import React from "react";

//! Router-Dom Import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//! Components Import
import Navbar from "./components/Navbar/NavigationBar";
import Footer from "./components/Footer/Footer";

//! Pages Import
import Homepage from "./Pages/Home/Homepage";
import Login from "./Pages/Login/Login";
import Profile from "./Pages/Profile/Profile";
import Registration from "./components/Registration/Registration";
import Support from "./Pages/Support/Support";
import CommunityPage from "./Pages/CommunityPage/CommunityPage";

//! MiddleWares Import
import ProtectedRoutes from "./middlewares/ProtectedRoutes";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/support" element={<Support />} />
          <Route path="/community" element={<CommunityPage />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
