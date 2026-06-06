import { toast } from "react-hot-toast";

export default function useCopyLink() {
    const copyLink = async (url, onClose) => {
        if (!url) return;

        onClose?.();

        try {
            await navigator.clipboard.writeText(url);
            toast.success("لینک کپی شد");
        } catch {
            toast.error("Clipboard access is not available");
        }
    };

    return { copyLink };
}
