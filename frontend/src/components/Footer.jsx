import React from "react";
import bvicamLogo from "/src/assets/bvicamLogo.png"; // Adjust path as needed
import { FaFacebook, FaInstagram, FaLinkedin, FaPaperPlane } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white py-8 sm:py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <img
              src={bvicamLogo}
              alt="BVICAM Logo"
              className="w-36 sm:w-40 lg:w-44 h-auto mb-4 transform hover:scale-105 transition duration-300"
            />
            <p className="text-sm sm:text-base text-gray-300">
              Empowering innovation, shaping the future.
            </p>
            <p className="mt-2 text-xs sm:text-sm text-gray-400">
              © 2024 BVICAM. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg sm:text-xl font-bold text-yellow-300 mb-4 relative">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-yellow-400 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm sm:text-base">
              {["Schedule", "Events", "Coordinators", "FAQ's"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-300 hover:text-yellow-400 hover:translate-x-2 transition-all duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg sm:text-xl font-bold text-yellow-300 mb-4 relative">
              Connect With Us
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-yellow-400 rounded-full"></span>
            </h3>
            <div className="flex space-x-4 sm:space-x-6">
              {[
                { Icon: FaFacebook, url: "https://www.facebook.com/share/bC9x66sK5qH7Tqoe/" },
                { Icon: FaInstagram, url: "https://www.instagram.com/ibvicam?igsh=MXZsY2MzcnllaXdtdg==" },
                { Icon: FaLinkedin, url: "https://www.linkedin.com/school/bharati-vidyapeeth-institute-of-computer-applications-&-management/" },
              ].map(({ Icon, url }, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-yellow-400 transform hover:scale-125 transition-all duration-300"
                >
                  <Icon size={8} className="size-8" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg sm:text-xl font-bold text-yellow-300 mb-4 relative">
              Stay Updated
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-yellow-400 rounded-full"></span>
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-4 text-center sm:text-left">
              Subscribe for the latest news and events.
            </p>
            <div className="flex w-full max-w-xs sm:max-w-sm">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gray-800 border border-gray-700 rounded-l-md text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-xs sm:text-sm"
              />
              <button className="px-3 sm:px-4 py-2 sm:py-3 bg-yellow-400 text-gray-900 font-semibold rounded-r-md hover:bg-yellow-500 transition-all duration-200">
                <FaPaperPlane size={14} className="sm:size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 sm:mt-12 border-t border-gray-700"></div>

        {/* Footer Credits */}
        {/* <div className="text-center text-gray-400 mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm">
            Crafted with <span className="text-red-400 animate-pulse">❤️</span> by
            <a
              href="https://www.linkedin.com/in/kumar-amrendram/"
              className="text-yellow-300 hover:underline mx-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amrendram
            </a>
            |
            <a
              href="https://www.linkedin.com/in/yatinsharma01/"
              className="text-yellow-300 hover:underline mx-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yatin
            </a>
            |
            <a
              href="#"
              className="text-yellow-300 hover:underline mx-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vijay
            </a>
          </p>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;