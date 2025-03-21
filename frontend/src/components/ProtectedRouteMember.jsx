import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

// Define allowed admin emails
// const adminEmails =import.meta.env.VITE_ADMIN_EMAILS;

const ProtectedRouteMember = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; 

  // console.log("User:", user);
//   const isAdmin = user && adminEmails.includes(user.email);
//   console.log("Is Admin:", isAdmin);

  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRouteMember;
