import toast from "react-hot-toast";
import useLock from "./useLock";

export default function useAliasLimiter(max = 12) {
    const { runWithLock } = useLock(1200);

    const limitAlias = (value) => {
        if (value.length > max) {
            runWithLock(() => {
                toast.error(`حداکثر طول آدرس پیشنهادی ${max} کاراکتر است`);
            });
        }

        return value.slice(0, max);
    };

    return { limitAlias };
}