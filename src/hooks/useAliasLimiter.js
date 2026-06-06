import { useRef } from "react";
import toast from "react-hot-toast";

export default function useAliasLimiter(max = 12) {
    const toastLock = useRef(false);

    const limitAlias = (value) => {
        if (value.length > max && !toastLock.current) {
            toastLock.current = true;

            toast.error(`حداکثر طول آدرس پیشنهادی ${max} کاراکتر است`);

            setTimeout(() => {
                toastLock.current = false;
            }, 1200);
        }

        return value.slice(0, max);
    };

    return { limitAlias };
}
