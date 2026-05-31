import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { UrlProvider } from "./context/UrlContext.jsx";

createRoot(document.getElementById("root")).render(
    <UrlProvider>
        <App />
        <Toaster
            position="top-left" 
            reverseOrder={false}
            toastOptions={{
                duration: 4000, 
                style: {
                    fontFamily: "Vazirmatn",
                    borderRadius: "16px",
                    padding: "12px 16px",
                    background: "#ffffff",
                    color: "#1e293b",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontSize: "14px",
                    border: "1px solid #f1f5f9"
                },
            }}
        />
    </UrlProvider>
);
