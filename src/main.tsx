
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/globals.css"; // v3 - Lighter theme
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
