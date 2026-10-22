import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";

const container = document.getElementById("root");

if (!container) {
  throw new Error("The application root was not found.");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
