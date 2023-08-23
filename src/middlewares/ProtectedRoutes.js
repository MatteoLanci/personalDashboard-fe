import React, { useEffect } from "react";
import jwtDecode from "jwt-decode";

import Login from "../Pages/Login/Login";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

const authorization = () => {
  return JSON.parse(localStorage.getItem("userLogged"));
};

const allowedRoutes = ["/", "/register"];

export const useSession = () => {
  const session = authorization();
  const decodedSession = session ? jwtDecode(session) : null;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!session && !allowedRoutes.includes(location.pathname)) {
      navigate("/", { replace: true });
    }
  }, [navigate, session]);

  return decodedSession;
};

const ProtectedRoutes = () => {
  const isAuthorized = authorization();

  return isAuthorized ? <Outlet /> : <Login />;
};

export default ProtectedRoutes;
