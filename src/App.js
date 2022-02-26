import React from "react";
import "./App.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import Chat from "./components/Chat";
let contract = require('./contract/dechat.json');
web3 = new Web3(window.ethereum);
web3.eth.defaultAccount = web3.eth.accounts[0];
let dechat = new web3.eth.Contract(contract,'0x5227d73db0022650de9c716c979fea52e43156d3');
// 0x5227d73db0022650de9c716c979fea52e43156d3

export default () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login contract={dechat}/>}
        />
        <Route
          path="/chat/:room"
          element={<Chat contract={dechat}/>}
        />
      </Routes>
    </Router>
  );
};