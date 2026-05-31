import { useRef, useState } from "react";
import {
  FiLink2,
  FiArrowLeft,
  FiHash,
  FiLoader,
  FiClock,
} from "react-icons/fi";
import { useUrl } from "../context/UrlContext";
import toast from "react-hot-toast";
import LinkResultModal from "./LinkResultModal";

export default function UrlForm() {
  // Grab the shorten action and loading state from Context
  const { shortenUrl, isShortening } = useUrl();

  // Local form state
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiry, setExpiry] = useState("never");

  // Result modal state
  const [resultOpen, setResultOpen] = useState(false);
  const [resultLink, setResultLink] = useState(null);

  // Toast lock: prevents the same alias warning from showing repeatedly
  const aliasToastRef = useRef(false);

  // Accept only full URLs that start with https://
  const httpsRegex = /^https:\/\/\S+$/i;

  // Accept simple domain-only input and auto-prepend https://
  const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim input values to avoid validation issues caused by extra spaces
    const trimmedUrl = url.trim();
    const trimmedAlias = alias.trim();

    // Basic required validation
    if (!trimmedUrl) {
      toast.error("لطفاً یک لینک وارد کنید");
      return;
    }

    let finalUrl = "";

    // Normalize the URL before sending it to Context
    if (httpsRegex.test(trimmedUrl)) {
      finalUrl = trimmedUrl;
    } else if (domainRegex.test(trimmedUrl)) {
      finalUrl = `https://${trimmedUrl}`;
    } else {
      toast.error("فرمت لینک صحیح نیست");
      return;
    }

    // Create the short link once, then use the returned object for the result modal
    const newLink = await shortenUrl({
      url: finalUrl,
      alias: trimmedAlias || undefined,
      expiry,
    });

    if (newLink) {
      setResultLink(newLink);
      setResultOpen(true);
    }

    // Reset the form after a successful shorten
    setUrl("");
    setAlias("");
    setExpiry("never");
  };

  // Share the generated short link using the native share API when available
  const handleShareResult = async () => {
    const shortUrl = resultLink?.shortUrl;
    if (!shortUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Short link",
          text: "Here is your short link:",
          url: shortUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shortUrl);
      toast.success("لینک کوتاه کپی شد");
    } catch {
      toast.error("اشتراک‌گذاری انجام نشد");
    }
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
            onChange={(e) => {
              // Capture the latest input value as the user types or pastes
              const raw = e.target.value;

              // If the input exceeds 12 characters and no toast is currently locked,
              // show the warning once.
              if (raw.length > 12 && !aliasToastRef.current) {
                aliasToastRef.current = true;
                toast.error("حداکثر طول آدرس پیشنهادی ۱۲ کاراکتر است");

                // Unlock the toast after a short delay so it can appear again later
                setTimeout(() => {
                  aliasToastRef.current = false;
                }, 1200);
              }

              // Keep only the first 12 characters in state
              setAlias(raw.slice(0, 12));
            }}
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
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        link={resultLink}
        onShare={handleShareResult}
      />
    </>
  );
}
