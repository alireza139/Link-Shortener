import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { FiX } from "react-icons/fi";

export default function QrModal({ url, onClose }) {
    // Downloads the rendered QR code as an SVG file.
    const downloadQR = () => {
        const svg = document.getElementById("qr-gen");
        if (!svg) return;

        // Serialize the SVG node to a string
        const xml = new XMLSerializer().serializeToString(svg);

        // Convert the SVG string to a base64 data URL
        const svg64 = btoa(xml);
        const image64 = "data:image/svg+xml;base64," + svg64;

        // Create a temporary <a> element to trigger the download
        const downloadLink = document.createElement("a");
        downloadLink.href = image64;
        downloadLink.download = "qr-code.svg";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    // Render the modal directly into <body> using a portal
    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            {/* Backdrop: clicking outside the modal closes it */}
            <div className="absolute inset-0" onClick={onClose}></div>

            {/* Modal container */}
            <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header row */}
                <div className="flex flex-row-reverse items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800">Your QR code</h3>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-6">
                    {/* QR code preview */}
                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <QRCodeSVG
                            id="qr-gen"
                            value={url}
                            size={200}
                            bgColor={"#F8FAFC"} // slate-50
                            fgColor={"#334155"} // slate-700
                            level={"H"} // High error correction level
                            includeMargin={false}
                        />
                    </div>

                    {/* The URL shown under the QR (wraps if it's long) */}
                    <p className="text-center text-xs text-slate-500 break-all px-4">
                        {url}
                    </p>

                    {/* Download action */}
                    <button
                        onClick={downloadQR}
                        className="w-full cursor-pointer rounded-xl bg-slate-800 py-3 text-white transition hover:bg-slate-900 active:scale-95"
                    >
                        <span>Download SVG file</span>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
