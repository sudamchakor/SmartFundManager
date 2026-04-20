import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css"; // Updated import
import "./styles/theme.css"; // New import
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/emiCalculator">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
