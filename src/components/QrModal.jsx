import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { FiX } from "react-icons/fi";
import useQrDownload from "../hooks/useQrDownload";

export default function QrModal({ url, onClose }) {
    const { qrRef, download } = useQrDownload();

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex flex-row-reverse items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800">Your QR code</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <QRCodeSVG
                            ref={qrRef}
                            value={url}
                            size={200}
                            bgColor="#F8FAFC"
                            fgColor="#334155"
                            level="H"
                            includeMargin={false}
                        />
                    </div>

                    <p className="text-center text-xs text-slate-500 break-all px-4">
                        {url}
                    </p>

                    <button
                        onClick={download}
                        className="w-full cursor-pointer rounded-xl bg-slate-800 py-3 text-white transition hover:bg-slate-900 active:scale-95"
                    >
                        Download SVG file
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
