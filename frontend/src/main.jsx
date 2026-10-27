// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );

import React from "react";
import ReactDom from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddressPage from "./components/AddressPage.jsx";
import VotingInfoDisplay from "./components/votingInfoDisplay";

ReactDom.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AddressPage />}></Route>
      <Route path="/voting-info" element={<VotingInfoDisplay />} />
    </Routes>
  </BrowserRouter>,
);
