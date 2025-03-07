"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../../backend/firebase/firebase";
import { signInWithPopup, signInWithRedirect, signOut }  from 'https://cdn.jsdelivr.net/npm/firebase@^11.4.0/firebase-auth.js/+esm' 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (useRedirect = false) => {
    try {
      if (useRedirect) {
        // Use redirect for mobile
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Use popup for desktop
        const result = await signInWithPopup(auth, googleProvider);
        setUser({
          name: result.user.displayName,
          email: result.user.email,
          uid: result.user.uid,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);