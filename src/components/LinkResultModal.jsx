import { createPortal } from "react-dom";
import { FiX, FiLink, FiShare2, FiCopy } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function LinkResultModal({ open, onClose, link }) {
    // Don't render anything when the modal is closed
    if (!open) return null;

    // Normalize incoming link fields 
    const originalUrl = link?.original ?? link?.url ?? "";
    const shortRaw = link?.short ?? link?.shortUrl ?? "";

    // Ensure the short URL is a valid absolute URL (add protocol if missing)
    function normalizeUrl(value) {
        if (!value) return "";

        const hasProtocol = /^https?:\/\//i.test(value);
        if (hasProtocol) return value;

        return `https://${value}`;
    }
    const shortUrl = normalizeUrl(shortRaw);

    const handleCopy = async () => {
        // Nothing to copy
        if (!shortUrl) return;

        // Close the modal first for a smoother UX
        onClose?.();

        try {
            // Copy using the modern Clipboard API
            await navigator.clipboard.writeText(shortUrl);
            toast.success("لینک کپی شد");
        } catch {
            // Clipboard API may fail on insecure contexts or restricted browsers
            toast.error("Clipboard access is not available");
        }
    };

    const handleShare = async () => {
        // Nothing to share
        if (!shortUrl) return;

        // Close the modal first for a smoother UX
        onClose?.();

        try {
            // Use the Web Share API when available (mostly mobile browsers)
            if (navigator.share) {
                await navigator.share({
                    title: "Shortened link",
                    text: "Here is the shortened link:",
                    url: shortUrl,
                });
                return;
            }

            // Fallback: copy to clipboard when share is not supported
            await navigator.clipboard.writeText(shortUrl);
            toast.success("اشتراک گذاری پشتیبانی نشد(کپی شد)");
        } catch {
            // Covers share rejection, clipboard failures, etc.
            toast.error("خطا در اشتراک گذاری");
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999]">
            {/* Backdrop: clicking outside the modal closes it */}
            <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal panel */}
            <div className="relative mx-auto mt-24 w-[92%] max-w-xl rounded-2xl border border-white/40 bg-white/80 p-5 shadow-2xl backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-900">
                        Your link is ready
                    </h3>

                    {/* Close button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        aria-label="Close"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="mt-4 space-y-3">
                    {/* Original URL */}
                    <div className="rounded-xl border border-slate-200 bg-white/70 p-3">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <FiLink />
                            Original URL
                        </div>
                        <div dir="ltr" className="mt-1 break-all text-sm text-slate-900">
                            {originalUrl || "-"}
                        </div>
                    </div>

                    {/* Short URL */}
                    <div className="rounded-xl border border-slate-200 bg-white/70 p-3">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <FiLink />
                            Short URL
                        </div>
                        <div
                            dir="ltr"
                            className="mt-1 break-all text-sm font-semibold text-slate-900"
                        >
                            {shortUrl || "-"}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
                    {/* Copy button */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        disabled={!shortUrl}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                        aria-label="Copy short link"
                        title="Copy"
                    >
                        <FiCopy />
                    </button>

                    {/* Share button */}
                    <button
                        type="button"
                        onClick={handleShare}
                        disabled={!shortUrl}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                        aria-label="Share short link"
                        title="Share"
                    >
                        <FiShare2 />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
