import { useState } from "react";
import { FiLink2, FiArrowLeft, FiHash, FiLoader, FiClock } from "react-icons/fi";
import { useUrl } from "../context/UrlContext";
import LinkResultModal from "./LinkResultModal";
import useNormalizeUrl from "../hooks/useNormalizeUrl";
import useUrlValidation from "../hooks/useUrlValidation";
import useAliasLimiter from "../hooks/useAliasLimiter";
import useToggle from "../hooks/useToggle";

export default function UrlForm() {
  // Local form state
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiry, setExpiry] = useState("never");

  // Result modal state
  const [resultLink, setResultLink] = useState(null);

  // Custom hooks
  const { normalizeUrl } = useNormalizeUrl();
  const { validateUrl, invalidFormat } = useUrlValidation();
  const { limitAlias } = useAliasLimiter(12);
  const resultModal = useToggle();

  // context
  const { shortenUrl, isShortening } = useUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    
    const trimmedAlias = alias.trim();

    if (!validateUrl(trimmedUrl)) return;

    const finalUrl = normalizeUrl(trimmedUrl);

    if (!finalUrl) {
      invalidFormat();
      return;
    }

    const newLink = await shortenUrl({
      url: finalUrl,
      alias: trimmedAlias || undefined,
      expiry,
    });

    if (!newLink) return;

    setResultLink(newLink);
    resultModal.open();

    setUrl("");
    setAlias("");
    setExpiry("never");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-sm font-medium text-slate-800">
          لینک خود را وارد کنید
        </label>

        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-900">
            <FiLink2 />
          </span>

          <input
            dir="ltr"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={isShortening}
            className="w-full rounded-xl border border-white/70 bg-white/60 py-3 pr-10 pl-3 text-sm text-slate-800 shadow-sm outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-rose-200 focus:ring-4 focus:ring-rose-100 disabled:opacity-70"
          />
        </div>

        <label className="block text-sm font-medium text-slate-800">
          آدرس پیشنهادی دارید؟ (اختیاری)
        </label>

        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-900">
            <FiHash />
          </span>

          <input
            dir="ltr"
            type="text"
            value={alias}
            onChange={(e) => setAlias(limitAlias(e.target.value))}
            placeholder="my-link"
            disabled={isShortening}
            className="w-full rounded-xl border border-white/70 bg-white/60 py-3 pr-10 pl-3 text-sm text-slate-800 shadow-sm outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-rose-200 focus:ring-4 focus:ring-rose-100 disabled:opacity-70"
          />
        </div>

        {/* Expiry + submit row */}
        <div className="flex items-end justify-between gap-3">
          <div className="w-48">
            <label className="mb-2 block text-sm font-medium text-slate-800">
              زمان انقضا
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-900">
                <FiClock />
              </span>

              <select
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                disabled={isShortening}
                className="w-full appearance-none rounded-xl border border-white/70 bg-white/60 py-3 pr-10 pl-8 text-sm text-slate-800 shadow-sm outline-none backdrop-blur transition focus:border-rose-200 focus:ring-4 focus:ring-rose-100 disabled:opacity-70"
              >
                <option value="never">بدون انقضا</option>
                <option value="1h">1 ساعت</option>
                <option value="1d">1 روز</option>
                <option value="7d">7 روز</option>
                <option value="30d">30 روز</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isShortening}
            className="group inline-flex w-2/5 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-rose-700 to-red-500 px-4 py-3 text-md text-white shadow-lg shadow-rose-200/60 transition hover:brightness-[1.03] active:scale-[0.99] disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
          >
            {isShortening ? (
              <>
                <FiLoader className="animate-spin" />
                <span>کمی صبر کنید...</span>
              </>
            ) : (
              <>
                <span>کوتاه کن</span>
                <FiArrowLeft className="mt-1 transition group-hover:-translate-x-0.5" />
              </>
            )}
          </button>
        </div>

        <p className="flex items-center gap-1 text-xs text-slate-500">
          لینک کوتاه‌شده در تاریخچه نمایش داده می‌شود
        </p>
      </form>

      <LinkResultModal
        open={resultModal.isOpen}
        onClose={resultModal.close}
        link={resultLink}
      />

    </>
  );
}