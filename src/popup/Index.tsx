import { createRoot } from "react-dom/client";
import { Popup } from "./component/Popup";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<Popup />);
}
