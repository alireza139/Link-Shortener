import { useRef } from "react";

export default function useQrDownload(filename = "qr-code.svg") {
    const qrRef = useRef(null);

    const download = () => {
        if (!qrRef.current) return;

        const svg = qrRef.current;

        const xml = new XMLSerializer().serializeToString(svg);
        const svg64 = btoa(xml);
        const image64 = "data:image/svg+xml;base64," + svg64;

        const link = document.createElement("a");
        link.href = image64;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return { qrRef, download };
}
