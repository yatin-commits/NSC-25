import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Define allowed admin emails
const adminEmails = ["sharmayatin0882@gmail.com", "superadmin@example.com"];

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Prevent redirection until auth state is known

  console.log("User:", user);
  const isAdmin = user && adminEmails.includes(user.email);
  console.log("Is Admin:", isAdmin);

  return isAdmin ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
