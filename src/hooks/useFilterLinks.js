import { useMemo, useState } from "react";

export default function useFilterLinks(links) {
    // Local state for the history search input
    const [query, setQuery] = useState("");

    const filteredLinks = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!q) return links;

        return links.filter((link) => {
            const original = String(link.originalLink ?? "").toLowerCase();
            const short = String(link.shortLink ?? "").toLowerCase();

            return original.includes(q) || short.includes(q);
        });
    }, [links, query]);

    return {
        query,
        setQuery,
        filteredLinks,
    };
}
