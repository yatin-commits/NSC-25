import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Define allowed admin emails
const adminEmails = ["sharmayatin0882@gmail.com", "superadmin@example.com"];

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <FiLoader className="text-lg  animate-spin size-8" />; // Prevent redirect until auth state is known

  const isAdmin = user && adminEmails.includes(user.email);
  console.log("User:", user);
  console.log("Is Admin:", isAdmin);

  return isAdmin ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
