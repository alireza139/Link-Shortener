import { toast } from "react-hot-toast";
import useLock from "./useLock";

export default function useCopyLink() {
    const { runWithLock } = useLock(1200);

    const copyLink = (url, onClose) => {
        runWithLock(async () => {
            if (!url) return;

            onClose?.();

            try {
                await navigator.clipboard.writeText(url);
                toast.success("لینک کپی شد");
            } catch {
                toast.error("Clipboard access is not available");
            }
        });
    };

    return { copyLink };
}