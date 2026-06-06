export default function useNormalizeUrl() {
    const httpsRegex = /^https:\/\/\S+$/i;
    const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/;

    const normalizeUrl = (url) => {
        const trimmed = url.trim();

        if (!trimmed) return null;

        if (httpsRegex.test(trimmed)) {
            return trimmed;
        }

        if (domainRegex.test(trimmed)) {
            return `https://${trimmed}`;
        }

        return null;
    };

    return { normalizeUrl };
}
