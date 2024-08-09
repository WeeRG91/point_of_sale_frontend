import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Login from "../pages/guest/Login";
import Customers from "../pages/auth/customers";

const routes = [
    {path: "/", element: <Navigate to="/login"/>},
    {path: "/login", element: <Login />},
    {path: "/customers", element: <Customers />},
]

export default function AppRoutes() {
  const route = useRoutes(routes);

  return route;
}
