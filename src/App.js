import React from "react";

//! Router-Dom Import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//! Components Import
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

//! Pages Import
import Homepage from "./Pages/Home/Homepage";
import Login from "./Pages/Login/Login";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
