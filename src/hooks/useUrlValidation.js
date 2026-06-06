import toast from "react-hot-toast";

export default function useUrlValidation() {
    const validateUrl = (url) => {
        if (!url) {
            toast.error("لطفاً یک لینک وارد کنید");
            return false;
        }

        return true;
    };

    const invalidFormat = () => {
        toast.error("فرمت لینک صحیح نیست");
    };

    return {
        validateUrl,
        invalidFormat,
    };
}