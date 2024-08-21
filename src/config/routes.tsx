import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Login from "../pages/guest/Login";
import BaseLayout from "../components/layouts/BaseLayout";
import AuthenticatedRoute from "../middleware/AuthenticatedRoute";
import Customers from "../pages/auth/customers";
import CustomerList from "../pages/auth/customers/List";
import CustomerCreate from "../pages/auth/customers/Create";
import CustomerEdit from "../pages/auth/customers/Edit";
import Products from "../pages/auth/products";
import ProductList from "../pages/auth/products/List";
import ProductCreate from "../pages/auth/products/Create";
import ProductEdit from "../pages/auth/products/Edit";

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
        element: <AuthenticatedRoute element={<Products />} />,
        children: [
          { path: "", element: <ProductList /> },
          { path: "create", element: <ProductCreate /> },
          { path: "edit/:id", element: <ProductEdit /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" /> },
];

export default function AppRoutes() {
  const route = useRoutes(routes);

  return route;
}
