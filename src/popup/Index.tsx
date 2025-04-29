import { createRoot } from "react-dom/client";
import "./popup.css";
import { Popup } from "./component/Popup";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<Popup />);
}
