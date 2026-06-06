import { createContext, useContext, useEffect, useState } from "react";
import useDeleteLink from "../hooks/useDeleteLink";
import useShortenUrl from "../hooks/useShortenUrl";

const UrlContext = createContext();

export function UrlProvider({ children }) {
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem("links");
    return saved ? JSON.parse(saved) : [];
  });

  // sync with localStorage
  useEffect(() => {
    localStorage.setItem("links", JSON.stringify(links));
  }, [links]);

  // hooks
  const { deleteLink } = useDeleteLink(setLinks);
  const { shortenUrl, isShortening } = useShortenUrl(setLinks);

  return (
    <UrlContext.Provider
      value={{
        links,
        shortenUrl,
        deleteLink,
        isShortening,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
}
export const useUrl = () => useContext(UrlContext);