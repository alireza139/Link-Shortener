import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

const UrlContext = createContext();

// Helper function to simulate network delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function UrlProvider({ children }) {
  // Initialize links from LocalStorage or an empty array
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem("links");
    return saved ? JSON.parse(saved) : [];
  });

  // Stores the ID of the link currently copied to the clipboard
  const [copiedId, setCopiedId] = useState(null);

  // Loading state for the URL shortening process
  const [isShortening, setIsShortening] = useState(false);

  // Ref to manage the auto-dismiss timer for the delete undo notification
  const deleteTimerRef = useRef(null);

  // Sync links state to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("links", JSON.stringify(links));
  }, [links]);

  // Cleanup: clear any active delete timers when the component unmounts
  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
    };
  }, []);

  /*
   * Shortens a given URL.
   * Supports both a direct string or an object containing url and alias.
   */
  const shortenUrl = async (input) => {
    const url = typeof input === "string" ? input : input?.url;
    const alias = typeof input === "string" ? undefined : input?.alias;
    const expiry = typeof input === "string" ? "never" : input?.expiry || "never";


    const trimmedUrl = (url || "").trim();
    const trimmedAlias = (alias || "").trim();

    if (!trimmedUrl) {
      toast.error("Please enter a valid URL");
      return;
    }

    // Start loading state and show a loading toast
    setIsShortening(true);
    const loadingToastId = toast.loading("در حال آماده سازی لینک");

    try {
      // Simulate API delay (e.g., 5 seconds)
      await sleep(5000);

      // Generate a random 5-character code if no alias is provided
      const code = trimmedAlias || Math.random().toString(36).slice(2, 7);

      const newLink = {
        id: Date.now(),
        original: trimmedUrl,
        short: `shrt.it/${code}`,
        alias: trimmedAlias || null,
        expiry,
        createdAt: Date.now(),
      };

      // Add the new link to the top of the history list
      setLinks((prev) => [newLink, ...prev]);

      toast.dismiss(loadingToastId);

      // so UI can open the result modal with it
      return newLink;
    } catch (e) {
      toast.dismiss(loadingToastId);
      toast.error("خطا در ایجاد لینک کوتاه");
    } finally {
      setIsShortening(false);
    }

  };

  /*
   * Copies text to clipboard and handles UI feedback.
   */
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("در کلیبورد کپی شد");

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      toast.error("خطا در کپی لینک");
    }
  };

  /*
   * Restores a previously deleted link back into the history.
   */
  const restoreDeletedLink = (item) => {
    if (!item) return;

    setLinks((prev) => {
      const exists = prev.some((link) => link.id === item.id);
      if (exists) return prev;
      return [item, ...prev];
    });

    // Clear the auto-dismiss timer if the user manually restores
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }

    toast.success("لینک بازگردانی شد");
  };

  /*
   * Removes a link from the list and shows an undo notification.
   */
  const deleteLink = (id) => {
    setLinks((prev) => {
      const itemToDelete = prev.find((item) => item.id === id);
      if (!itemToDelete) return prev;

      const updatedLinks = prev.filter((item) => item.id !== id);

      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);

      // Show toast with an "Undo" (Restore) button
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

      // Clean up the ref after the notification duration
      deleteTimerRef.current = setTimeout(() => {
        toast.dismiss(toastId);
        deleteTimerRef.current = null;
      }, 5000);

      return updatedLinks;
    });
  };

  return (
    <UrlContext.Provider
      value={{
        links,
        copiedId,
        isShortening, // Exposed to disable form buttons during loading
        shortenUrl,
        copyToClipboard,
        deleteLink,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
}

// Custom hook to use the UrlContext
export const useUrl = () => useContext(UrlContext);