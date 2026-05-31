import { useMemo, useState } from "react";
import { useUrl } from "../context/UrlContext";
import HistorySearch from "./HistorySearch";
import ShortLinkCard from "./ShortLinkCard";

export default function HistoryBox() {
    // Read link data and actions from the shared URL context
    const { links, copiedId, copyToClipboard, deleteLink } = useUrl();

    // Local state for the history search input
    const [query, setQuery] = useState("");

    // Filter links by matching the search query against
    // both the original URL and the shortened URL
    const filteredLinks = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!q) return links;

        return links.filter((link) => {
            const original = String(link.original ?? "").toLowerCase();
            const short = String(link.short ?? "").toLowerCase();

            return original.includes(q) || short.includes(q);
        });
    }, [links, query]);

    return (
        <div>
            {/* Section header with title and search field */}
            <div className="flex justify-between">
                <div className="mb-2 flex items-center justify-between px-1">
                    <h2 className="text-sm font-semibold text-slate-400">تاریخچه اخیر</h2>
                    <div className="mx-4 h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 to-transparent" />
                </div>

                <HistorySearch
                    value={query}
                    onChange={setQuery}
                    onClear={() => setQuery("")}
                />
            </div>

            {/* Decorative divider */}
            <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-rose-300 to-transparent" />

            {/* Empty state: no links have been created yet */}
            {links.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-100 py-10 text-center">
                    <p className="text-sm text-slate-400">
                        هنوز هیچ لینکی کوتاه نشده است
                    </p>
                </div>
            ) : filteredLinks.length === 0 ? (
                /* Empty state: links exist, but no results match the search */
                <div className="rounded-2xl border-2 border-dashed border-slate-100 py-10 text-center">
                    <p className="text-sm text-slate-400">نتیجه‌ای پیدا نشد</p>
                </div>
            ) : (
                /* Scrollable list of filtered short links */
                <div
                    dir="ltr"
                    className="custom-scrollbar max-h-[260px] space-y-4 overflow-y-auto pr-2"
                >
                    {filteredLinks.map((link) => (
                        <ShortLinkCard
                            key={link.id}
                            link={link}
                            copiedId={copiedId}
                            onCopy={copyToClipboard}
                            onDelete={deleteLink}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}