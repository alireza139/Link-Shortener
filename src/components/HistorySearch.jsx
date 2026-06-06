import { FiSearch } from "react-icons/fi";

export default function HistorySearch({ value, onChange, onClear }) {
    return (
        <div className="mb-4 px-1">
            <div className="flex items-center gap-2 rounded-2xl border border-white bg-white/60 px-3 py-2 shadow-sm">
                <FiSearch className="shrink-0 text-slate-400" size={18} />

                <input
                    dir="ltr"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search into history..."
                    className="w-full h-6 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                />
            </div>
        </div>
    );
}
