import { useState } from "react";
import { FiCopy, FiCheck, FiTrash2, FiShare2, FiMaximize } from "react-icons/fi";
import { toast } from "react-hot-toast";
import QrModal from "./QrModal";

export default function ShortLinkCard({ link, copiedId, onCopy, onDelete }) {
  // Controls whether the QR modal is currently open
  const [showQr, setShowQr] = useState(false);

  // Share the short URL using the native Web Share API when available.
  // If sharing is not supported, fall back to copying the link instead.
  const shareLink = async () => {
    // Normalize the short link to a valid absolute URL
    const raw = String(link?.short ?? "");
    const url = raw.startsWith("http") ? raw : `https://${raw}`;

    const shareData = {
      title: "لینک کوتاه‌شده",
      text: "این لینک کوتاه‌شده را ببین:",
      url,
    };

    try {
      if (navigator.share) {
        // Open the device/browser native share sheet
        await navigator.share(shareData);
      } else {
        // Fallback: copy the link when Web Share API is unavailable
        await navigator.clipboard.writeText(url);
        toast.success("مرورگر شما اشتراک‌گذاری را پشتیبانی نمی‌کند؛ لینک کپی شد");
      }
    } catch {
      // Covers user cancellation and any runtime/share permission errors
      toast.error("اشتراک‌گذاری انجام نشد");
    }
  };

  // Always pass a fully qualified URL to the QR modal
  const qrUrl = link?.short?.startsWith("http")
    ? link.short
    : `https://${link.short}`;

  // expiry label
  const expiryMap = {
    never: "بدون انقضا",
    "1h": "انقضا: ۱ ساعت",
    "1d": "انقضا: ۱ روز",
    "7d": "انقضا: ۷ روز",
    "30d": "انقضا: ۳۰ روز",
  };
  const expiryLabel = expiryMap[link?.expiry] || null;

  return (
    <div className="group relative rounded-2xl border border-white bg-white/50 p-4 transition-all hover:bg-white/80 hover:shadow-md animate-fadeUp">
      <div className="flex items-center justify-between gap-4">
        {/* Link content: original URL + generated short URL */}
        <div className="min-w-0 flex-1 text-left">
          <p className="mb-1 truncate text-[11px] text-slate-400">
            {link.original}
          </p>

          <p className="font-mono text-sm font-medium tracking-wide text-rose-600">
            {link.short}
          </p>
        </div>

        {/* Action buttons: QR, share, copy, delete */}
        <div className="flex items-center gap-1">
          {/* Small floating badge that shows the expiry info when available */}
          {expiryLabel && (
            <span className="rounded-full bg-slate-900/70 px-2 p-0.5 text-[10px] text-white backdrop-blur">
              {expiryLabel}
            </span>
          )}

          {/* Open the QR code modal */}
          <button
            onClick={() => setShowQr(true)}
            className="flex h-10 w-10 cursor-pointer shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-blue-50 hover:text-blue-600"
            title="QR Code"
          >
            <FiMaximize size={14} />
          </button>

          {/* Share the short link, or copy it if sharing is unsupported */}
          <button
            onClick={shareLink}
            className="flex h-10 w-10 cursor-pointer shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600"
            title="اشتراک‌گذاری"
          >
            <FiShare2 size={14} />
          </button>

          {/* Copy the short link.
              If this item was recently copied, show a check icon instead. */}
          <button
            onClick={() => onCopy(link.short, link.id)}
            className={`flex h-10 w-10 cursor-pointer shrink-0 items-center justify-center rounded-xl transition-all ${copiedId === link.id
              ? "bg-emerald-50 text-emerald-600 shadow-inner"
              : "bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
              }`}
            title="کپی لینک"
          >
            {copiedId === link.id ? <FiCheck size={14} /> : <FiCopy size={14} />}
          </button>

          {/* Remove this link from the history/list */}
          <button
            onClick={() => onDelete(link.id)}
            className="flex h-10 w-10 cursor-pointer shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
            title="حذف لینک"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Mount the QR modal only when the user opens it */}
      {showQr && <QrModal url={qrUrl} onClose={() => setShowQr(false)} />}
    </div>
  );
}
