import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Popup from "./popup/Popup";
import { HeroUIProvider } from "@heroui/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <Popup />
    </HeroUIProvider>
  </StrictMode>
);
