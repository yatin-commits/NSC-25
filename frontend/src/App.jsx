import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Home";
import AdminPanel from "./components/AdminPanel";
// import Navbar from "./components/Navbar";
import Navbarr from "./components/NavBarr";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <>
      <Navbarr />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route
         
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
