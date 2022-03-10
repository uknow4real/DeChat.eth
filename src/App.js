import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Header from "./components/Header";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

let contract = require("./contract/dechat.json");
web3 = new Web3(window.ethereum);
web3.eth.defaultAccount = web3.eth.accounts[0];
let dechat = new web3.eth.Contract(
  contract,
  "0x651383Ef6c43745a0f06F80A8Ac5bc104eD63a1e"
);
// 0x651383Ef6c43745a0f06F80A8Ac5bc104eD63a1e

export default () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login contract={dechat} />} />
        <Route path="/chat" element={<Chat contract={dechat} />} />
      </Routes>
    </Router>
  );
};
