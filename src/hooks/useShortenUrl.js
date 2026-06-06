import { useState } from "react";
import { toast } from "react-hot-toast";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useShortenUrl(setLinks) {
    const [isShortening, setIsShortening] = useState(false);

    const shortenUrl = async (input) => {
        const url = typeof input === "string" ? input : input?.url;
        const alias = typeof input === "string" ? undefined : input?.alias;
        const expiry =
            typeof input === "string" ? "never" : input?.expiry || "never";

        const trimmedUrl = (url || "").trim();
        const trimmedAlias = (alias || "").trim();

        if (!trimmedUrl) {
            toast.error("Please enter a valid URL");
            return null;
        }

        setIsShortening(true);
        const loadingToastId = toast.loading("در حال آماده سازی لینک");

        try {
            await sleep(5000);

            const code =
                trimmedAlias || Math.random().toString(36).slice(2, 7);

            const newLink = {
                id: Date.now(),
                originalLink: trimmedUrl,
                shortLink: `https://shrt.it/${code}`,
                alias: trimmedAlias || null,
                expiry,
                createdAt: Date.now(),
            };

            setLinks((prev) => [newLink, ...prev]);

            toast.dismiss(loadingToastId);

            return newLink;
        } catch {
            toast.dismiss(loadingToastId);
            toast.error("خطا در ایجاد لینک کوتاه");
            return null;
        } finally {
            setIsShortening(false);
        }
    };

    return { shortenUrl, isShortening };
}