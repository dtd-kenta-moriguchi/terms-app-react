import { createRoot } from "react-dom/client";
import { Content } from "./component/Content";

const root = document.createElement("div");
root.id = "crx-content-root";
document.body.appendChild(root);
createRoot(root).render(<Content />);
