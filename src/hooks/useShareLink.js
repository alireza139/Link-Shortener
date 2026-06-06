import toast from "react-hot-toast";

export default function useShareLink() {
    const shareLink = async (url) => {
        if (!url) return;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Short link",
                    text: "Here is your short link:",
                    url,
                });
                return;
            }

            await navigator.clipboard.writeText(url);
            toast.success("لینک کوتاه کپی شد");
        } catch {
            toast.error("اشتراک‌گذاری انجام نشد");
        }
    };

    return { shareLink };
}