import React, { useEffect } from "react";
import jwtDecode from "jwt-decode";

import Login from "../Pages/Login/Login";

import { Outlet, useNavigate } from "react-router-dom";

const authorization = () => {
  return JSON.parse(localStorage.getItem("userLogged"));
};

export const useSession = () => {
  const session = authorization();
  const decodedSession = session ? jwtDecode(session) : null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/", { replace: true });
    }
  }, [navigate, session]);

  return decodedSession;
};

const ProtectedRoutes = () => {
  const isAuthorized = authorization();
  const session = useSession();

  return isAuthorized ? <Outlet /> : <Login />;
};

export default ProtectedRoutes;
