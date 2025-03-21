import React, { useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Home";
import AdminPanel from "./components/AdminPanel";
import Navbarr from "./components/NavBarr";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import MemberForm from "./pages/MemberForm";
import ProtectedRouteMember from "./components/ProtectedRouteMember";
import Members from "./pages/Members";
import IncompleteRegistrations from "./pages/IncompleteRegistrations";

const App = () => {
  const eventsRef = useRef(null);
  
  const scrollToEvents = () => {
    eventsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Navbarr scrollToEvents={() => eventsRef.current?.scrollIntoView({ behavior: "smooth" })} />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
      
        <Route path="/members" element={
          <ProtectedRouteMember>
            <Members />
          </ProtectedRouteMember>
      } />
        <Route path="/incomplete" element={<IncompleteRegistrations />} />
     
        
        <Route path="/MemberForm" element={
          <ProtectedRouteMember>
          <MemberForm /> 
        </ProtectedRouteMember>
          } 
          />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/faqs" element={<Faqs />} />
        <Route path="/coordinators" element={<Coordinators />} /> */}
      </Routes>
      {/* <Footer /> */}
    </>
  );
};

export default App;