import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Login from "../pages/guest/Login";
import Customers from "../pages/auth/customers";
import BaseLayout from "../components/layouts/BaseLayout";
import AuthenticatedRoute from "../middleware/AuthenticatedRoute";
import CustomerList from "../pages/auth/customers/List";
import CustomerCreate from "../pages/auth/customers/Create";
import CustomerEdit from "../pages/auth/customers/Edit";

const routes = [
  { path: "/", element: <Navigate to="/login" /> },
  { path: "/login", element: <Login /> },
  {
    path: "/dashboard",
    element: <AuthenticatedRoute element={<BaseLayout />} />,
    children: [
      { path: "", element: <Navigate to="customers" /> },
      {
        path: "customers",
        element: <AuthenticatedRoute element={<Customers />} />,
        children: [
          { path: "", element: <CustomerList /> },
          { path: "create", element: <CustomerCreate /> },
          { path: "edit/:id", element: <CustomerEdit /> },
        ],
      },
      {
        path: "products",
        element: <AuthenticatedRoute element={<Customers />} />,
      },
    ],
  },
  { path: "*", element: <Navigate to="/" /> },
];

export default function AppRoutes() {
  const route = useRoutes(routes);

  return route;
}
