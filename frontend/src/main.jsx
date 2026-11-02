import ReactDom from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddressPage from "./components/AddressPage.jsx";
import VotingInfoPage from "./components/votingInfoDisplay";
import "./index.css";

ReactDom.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AddressPage />}></Route>
      <Route path="/voting-info" element={<VotingInfoPage />} />
    </Routes>
  </BrowserRouter>,
);
