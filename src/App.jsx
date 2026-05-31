import UrlForm from "./components/UrlForm";
import HistoryBox from "./components/HistoryBox";
import { FiZap } from "react-icons/fi";

export default function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-rose-100 selection:text-rose-900">
      <div className="mx-auto flex min-h-screen max-w-[1250px] flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 w-full text-center animate-fadeUp">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl border border-rose-50 bg-white p-3 text-rose-500 shadow-sm">
            <FiZap size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">کوتاه‌کننده لینک</h1>
          <p className="mt-2 font-light text-slate-500">لینک‌های طولانی خود را به کدهای کوتاه و زیبا تبدیل کنید</p>
        </div>
        <div className="w-full animate-fadeUp rounded-[2rem] border border-white/80 p-2 shadow-2xl shadow-rose-200/20 backdrop-blur-xl [animation-delay:200ms]">
          <div className="rounded-[1.6rem] bg-white/60 bg-[linear-gradient(to_right,#fecdd3_0%,#ffe4e6_25%,#fff1f2_40%,#ffffff_60%,#ffffff_100%)] p-6 sm:p-8">
            <div className="grid h-[350px] grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
              <UrlForm />
              <div className="min-h-full"><HistoryBox /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}