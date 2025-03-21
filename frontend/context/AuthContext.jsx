"use client";
import React, { createContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../../backend/firebase/firebase";
import { signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in successfully!");
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const signInWithGoogleRedirect = async () => {
    try {
      setLoading(true);
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithGoogleRedirect,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <FiLoader className="animate-spin text-4xl text-blue-600" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}