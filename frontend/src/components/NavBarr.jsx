import React, { useState } from "react";
import { motion } from "framer-motion";
import bvicamlogo from "../assets/bvicamLogo.png";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const adminEmails = ["sharmayatin0882@gmail.com", "shreyasinghal706@gmail.com", "amrendraex@gmail.com"];

const MenuItem = ({ setActive, active, item, children, onClick }) => {
  return (
    <div 
      onMouseEnter={() => setActive(item)} 
      className="relative group"
      onClick={onClick} // Add click handler
    >
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
      {active === item && children && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 pt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50"
        >
          <div className="p-4 text-sm text-gray-300">{children}</div>
        </motion.div>
      )}
    </div>
  );
};

const Navbarr = ({ 
  scrollToSchedule, 
  scrollToEvents, 
  scrollToCoordinators, 
  scrollToFAQ 
}) => {
  const [active, setActive] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, login, logout } = useAuth();

  const isAdmin = user && adminEmails.includes(user.email);

  const handleLogin = () => {
    login(false);
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Schedule", action: scrollToSchedule },
    { name: "Events", action: scrollToEvents },
    { name: "Coordinators", action: scrollToCoordinators },
    { name: "FAQ's", action: scrollToFAQ },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseLeave={() => setActive(null)}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-black/80 backdrop-blur-md border-b border-gray-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <img src={bvicamlogo} alt="BVICAM Logo" className="h-16 p-2" />
        </div>

        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navItems.map((item) => (
            <MenuItem 
              key={item.name} 
              setActive={setActive} 
              active={active} 
              item={item.name}
              onClick={item.action} // Pass the scroll action
            />
          ))}

          {isAdmin && (
            <a
              href="/admin"
              className="text-gray-200 cursor-pointer text-sm md:text-base font-medium hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
            >
              Admin Panel
            </a>
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

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-200 hover:text-purple-500 focus:outline-none transition-colors duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={isMenuOpen ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className={`md:hidden bg-gradient-to-r from-gray-900 to-black/80 border-t border-gray-700/50 px-4 pt-2 pb-4 ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        {navItems.map((item) => (
          <div key={item.name} className="py-2">
            <p
              className="cursor-pointer text-gray-200 text-sm font-medium hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              onClick={() => {
                item.action(); // Execute scroll action
                setIsMenuOpen(false);
              }}
            >
              {item.name}
            </p>
          </div>
        ))}

        {isAdmin && (
          <div className="py-2">
            <a
              href="/admin"
              className="text-gray-200 text-sm font-medium hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
            >
              Admin Panel
            </a>
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