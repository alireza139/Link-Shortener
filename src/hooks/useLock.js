import { useRef } from "react";

export default function useLock(delay = 1000) {
    const locked = useRef(false);

    const runWithLock = (callback) => {
        if (locked.current) return;

        locked.current = true;
        callback?.();

        setTimeout(() => {
            locked.current = false;
        }, delay);
    };

    return { runWithLock };
}
