import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {

  const { user } = useSelector((store) => store.user);

  // agar user login nahi hai
  if (!user) {
    return <Navigate to="/login" />;
  }

  // agar admin route hai aur user admin nahi hai
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;