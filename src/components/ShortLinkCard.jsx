import { FiCopy, FiTrash2, FiShare2, FiMaximize } from "react-icons/fi";
import QrModal from "./QrModal";
import useShareLink from "../hooks/useShareLink";
import useCopyLink from "../hooks/useCopyLink";
import useToggle from "../hooks/useToggle";

export default function ShortLinkCard({ link, onDelete }) {
  const { shareLink } = useShareLink();
  const { copyLink } = useCopyLink();
  const qrModal = useToggle();

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
        <div className="min-w-0 flex-1 text-left">
          <p className="mb-1 truncate text-[11px] text-slate-400">
            {link.originalLink}
          </p>

          <p className="font-mono text-sm font-medium tracking-wide text-rose-600">
            {link.shortLink}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {expiryLabel && (
            <span className="rounded-full bg-slate-900/70 px-2 p-0.5 text-[10px] text-white backdrop-blur">
              {expiryLabel}
            </span>
          )}

          <button
            onClick={qrModal.open}
            className="flex h-10 w-10 cursor-pointer shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-blue-50 hover:text-blue-600"
            title="QR Code"
          >
            <FiMaximize size={14} />
          </button>

          <button
            onClick={() => shareLink(link.shortLink)}
            className="flex h-10 w-10 cursor-pointer shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600"
            title="اشتراک‌گذاری"
          >
            <FiShare2 size={14} />
          </button>

          <button
            onClick={() => copyLink(link.shortLink)}
            className="flex h-10 w-10 cursor-pointer shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600"
            title="کپی لینک"
          >
            <FiCopy size={14} />
          </button>

          <button
            onClick={() => onDelete(link.id)}
            className="flex h-10 w-10 cursor-pointer shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
            title="حذف لینک"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {qrModal.isOpen && (
        <QrModal url={link.shortLink} onClose={qrModal.close} />
      )}
    </div>
  );
}