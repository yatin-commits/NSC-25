
import React from 'react'
import Home from '../Home'
import Navbar from './components/NavBar'
import Footer from './components/Footer'
import Faqs from './components/Faqs'
import Coordinators from './components/Coordinators'

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Home";
import AdminPanel from "./components/AdminPanel";
// import Navbar from "./components/Navbar";
import Navbarr from "./components/NavBarr";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";


const App = () => {
  return (
    <>
< main>
    <Navbar/>
    <Home/>
    <Coordinators/>
    <Faqs/>
    <Footer/>
=======
    <Toaster position="top-center" reverseOrder={false} />
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
</main>
    </>
  );
};

export default App;
