import React from "react";
import "./App.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import Chat from "./components/Chat";

export default () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login/>}
        />
        <Route
          path="/chat"
          element={<Chat/>}
        />
      </Routes>
    </Router>
  );
};