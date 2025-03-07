"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../../backend/firebase/firebase";
import { signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        });
      } else {
        setUser(null);
      }
      setLoading(false); // Stop loading once auth state is determined
    });

    return () => unsubscribe();
  }, []);

  const login = async (useRedirect = false) => {
    try {
      if (useRedirect) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        setUser({
          name: result.user.displayName,
          email: result.user.email,
          uid: result.user.uid,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    const loadingToast = toast.loading("Logging out...");
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Logged out successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.", { id: loadingToast });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? (
  <div className="flex justify-center items-center min-h-screen">
    <FiLoader className="text-lg  animate-spin size-8" />
  </div>
) : (
  children
)}
 {/* Prevent rendering before auth state is known */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
