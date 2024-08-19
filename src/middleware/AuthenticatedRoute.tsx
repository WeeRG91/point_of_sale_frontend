import React from "react";
import { useStore } from "../store/rootStore";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

interface AuthenticatedRouteProps {
  element: JSX.Element;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ element }) => {
  // Add your authentication logic here
  const {
    rootStore: { authStore },
  } = useStore();
  const isAuthenticated = authStore.isAuthenticated; // Example authentication check

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Or redirect to a login page
  }

  return element;
};

export default observer(AuthenticatedRoute);
