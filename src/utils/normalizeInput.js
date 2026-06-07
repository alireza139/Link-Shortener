export function normalizeUrl(url) {
    const httpsRegex = /^https:\/\/\S+$/i;
    const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/;

    const trimmed = url.trim();

    if (!trimmed) return null;

    if (httpsRegex.test(trimmed)) return trimmed;

    if (domainRegex.test(trimmed)) return `https://${trimmed}`;

    return null;
}

export function normalizeAlias(alias) {
    const trimmed = alias.trim();
    return trimmed || null;
}