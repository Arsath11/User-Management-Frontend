import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const ProductedRoutes = () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  return isLoggedIn === "true" ? <Outlet /> : <Navigate to={"/"} />;
};

export default ProductedRoutes;
