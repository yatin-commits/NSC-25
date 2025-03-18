import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import bvicamlogo from "../assets/bvicamLogo.png";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const MenuItem = ({ setActive, active, item, onClick }) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative group" onClick={onClick}>
      <p
        className={`cursor-pointer text-gray-200 text-sm md:text-base font-medium transition-all duration-300 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 ${
          active === item
            ? "font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
            : "text-opacity-90"
        }`}
      >
        {item}
      </p>
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
    </div>
  );
};

const Navbarr = ({ scrollToSchedule, scrollToEvents, scrollToCoordinators, scrollToFAQ }) => {
  const [active, setActive] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS.split(",");
  const isAdmin = user && adminEmails.includes(user.email);

  // Handle scroll after navigation
  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      setTimeout(() => {
        location.state.scrollTo();
      }, 100); // Small delay to ensure page is rendered
    }
  }, [location]);

  const handleLogin = () => {
    login(false);
    setIsMenuOpen(false);
  };

  const handleNavClick = (scrollAction) => {
    if (location.pathname === "/") {
      // If already on homepage, scroll immediately
      scrollAction();
    } else {
      // Navigate to homepage with scroll action in state
      navigate("/", { state: { scrollTo: scrollAction } });
    }
    setIsMenuOpen(false);
  };

  const handleMemberFormClick = () => {
    navigate("/MemberForm");
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Schedule", action: () => handleNavClick(scrollToSchedule) },
    { name: "Events", action: () => handleNavClick(scrollToEvents) },
    { name: "Coordinators", action: () => handleNavClick(scrollToCoordinators) },
    { name: "FAQ's", action: () => handleNavClick(scrollToFAQ) },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseLeave={() => setActive(null)}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border-gray-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <img src={bvicamlogo} alt="BVICAM Logo" className="h-18 p-2" />
        </div>

        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navItems.map((item) => (
            <MenuItem
              key={item.name}
              setActive={setActive}
              active={active}
              item={item.name}
              onClick={item.action}
            />
          ))}
          {user && (
            <MenuItem
              key="Member ID"
              setActive={setActive}
              active={active}
              item="Member ID"
              onClick={handleMemberFormClick}
            />
          )}
          {isAdmin && (
            <MenuItem
              key="Admin Panel"
              setActive={setActive}
              active={active}
              item="Admin Panel"
              onClick={() => navigate("/admin")}
            />
          )}
          <div>
            {user ? (
              <button
                onClick={logout}
                className="text-gray-200 cursor-pointer text-sm md:text-base font-medium hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="text-gray-200 cursor-pointer text-sm md:text-base font-medium hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                Login with Google
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-200 hover:text-purple-500 focus:outline-none transition-colors duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={isMenuOpen ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className={`md:hidden bg-gradient-to-r from-gray-900 to-black/80 border-t border-gray-700/50 px-4 pt-2 pb-4 overflow-hidden ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        {navItems.map((item) => (
          <div key={item.name} className="py-2">
            <p
              className="cursor-pointer text-gray-200 text-sm font-medium hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              onClick={item.action}
            >
              {item.name}
            </p>
          </div>
        ))}
        {user && (
          <div className="py-2">
            <p
              className="cursor-pointer text-gray-200 text-sm font-medium hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              onClick={handleMemberFormClick}
            >
              Member ID
            </p>
          </div>
        )}
        {isAdmin && (
          <div className="py-2">
            <p
              className="cursor-pointer text-gray-200 text-sm font-medium hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              onClick={() => navigate("/admin")}
            >
              Admin Panel
            </p>
          </div>
        )}
        <div className="py-2">
          {user ? (
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="text-gray-200 text-sm font-medium hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="text-gray-200 text-sm font-medium hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
            >
              Login with Google
            </button>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbarr;