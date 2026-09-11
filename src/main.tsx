import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CopyProvider } from "@/CopyProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CopyProvider>
      <App />
    </CopyProvider>
  </React.StrictMode>,
);
