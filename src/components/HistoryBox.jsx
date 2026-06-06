import { useUrl } from "../context/UrlContext";
import HistorySearch from "./HistorySearch";
import ShortLinkCard from "./ShortLinkCard";
import useFilterLinks from "../hooks/useFilterLinks";

export default function HistoryBox() {
    const { links, deleteLink } = useUrl();
    const { query, setQuery, filteredLinks } = useFilterLinks(links);

    const isEmpty = links.length === 0;
    const noResults = filteredLinks.length === 0;

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="mb-2 flex items-center px-1">
                    <h2 className="text-sm font-semibold text-slate-400">
                        تاریخچه اخیر
                    </h2>
                    <div className="mx-4 h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 to-transparent" />
                </div>

                <HistorySearch
                    value={query}
                    onChange={setQuery}
                />
            </div>

            <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-rose-300 to-transparent" />

            {isEmpty ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-100 py-10 text-center">
                    <p className="text-sm text-slate-400">هنوز هیچ لینکی کوتاه نشده است</p>
                </div>
            ) : noResults ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-100 py-10 text-center">
                    <p className="text-sm text-slate-400">نتیجه‌ای پیدا نشد</p>
                </div>
            ) : (
                <div
                    dir="ltr"
                    className="custom-scrollbar max-h-[260px] space-y-4 overflow-y-auto pr-2"
                >
                    {filteredLinks.map((link) => (
                        <ShortLinkCard
                            key={link.id}
                            link={link}
                            onDelete={deleteLink}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}