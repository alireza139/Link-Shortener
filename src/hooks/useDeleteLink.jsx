import { useRef, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function useDeleteLink(setLinks) {
    const deleteTimerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (deleteTimerRef.current) {
                clearTimeout(deleteTimerRef.current);
                deleteTimerRef.current = null;
            }
        };
    }, []);

    const restoreDeletedLink = (item) => {
        if (!item) return;

        setLinks((prev) => {
            const exists = prev.some((link) => link.id === item.id);
            if (exists) return prev;
            return [item, ...prev];
        });

        if (deleteTimerRef.current) {
            clearTimeout(deleteTimerRef.current);
            deleteTimerRef.current = null;
        }

        toast.success("لینک بازگردانی شد");
    };

    const deleteLink = (id) => {
        setLinks((prev) => {
            const itemToDelete = prev.find((item) => item.id === id);
            if (!itemToDelete) return prev;

            const updatedLinks = prev.filter((item) => item.id !== id);

            if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);

            const toastId = toast(
                (t) => (
                    <div className="flex items-center gap-3">
                        <span className="text-sm">لینک حذف شد</span>
                        <button
                            onClick={() => {
                                restoreDeletedLink(itemToDelete);
                                toast.dismiss(t.id);
                            }}
                            className="rounded-lg bg-slate-900 px-2 py-1 text-xs text-white"
                        >
                            بازگردانی
                        </button>
                    </div>
                ),
                { duration: 5000 }
            );

            deleteTimerRef.current = setTimeout(() => {
                toast.dismiss(toastId);
                deleteTimerRef.current = null;
            }, 5000);

            return updatedLinks;
        });
    };

    return { deleteLink };
}