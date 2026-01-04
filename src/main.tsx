import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

// Initialize RTL direction if needed
const savedLanguage = localStorage.getItem("language") || "en";
if (savedLanguage === "ar") {
  document.documentElement.dir = "rtl";
  document.documentElement.lang = "ar";
}

createRoot(document.getElementById("root")!).render(<App />);
