"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bvicamlogo from "../assets/bvicamLogo.png";
import shark from "../assets/shark.png";
import code from "../assets/code.png";
import binary from "../assets/binary.png";
import { MapPin, X, Award } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { eventFields, eventsData } from "./eventFields";
import toast from "react-hot-toast";

const Events = () => {
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const { user, login, logout } = useAuth();
  const name = user?.name;
  const email = user?.email;

  useEffect(() => {
    if (expandedEvent !== null) {
      document.body.classList.add("overflow-hidden");
      // Load existing registration data for the expanded event
      const registration = registrations.find((r) => r.eventId === expandedEvent);
      if (registration) {
        setFormData(registration.fields);
      } else {
        setFormData({});
      }
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [expandedEvent, registrations]);

  useEffect(() => {
    if (user) {
      console.log(user);
      fetchRegistrations(user.uid, true);
    }
  }, [user]);

  const fetchRegistrations = async (uid, showWelcome = true) => {
    const loadingToast = toast.loading("Fetching data...");
    try {
      const response = await fetch(`https://nsc-25-backend.vercel.app/api/registrations?userId=${uid}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRegistrations(data || []);
      if (showWelcome) {
        toast.success(`Welcome, ${user.name || user.email}!`, { id: loadingToast, duration: 3000 });
      } else {
        toast.dismiss(loadingToast);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error.message);
      setRegistrations([]);
      toast.error("Failed to load registrations.", { id: loadingToast });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (eventId, isEdit = false) => {
    if (!user) {
      toast.error("Please log in to register.");
      return;
    }

    const requiredFields = eventFields[eventId].map((f) => f.name);
    if (!requiredFields.every((field) => formData[field]?.trim())) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      eventId,
      userId: user.uid,
      fields: formData,
      name: name || null,
      email: email || null,
    };
    console.log("Payload:", payload);

    const loadingToast = toast.loading(isEdit ? "Updating..." : "Registering...");
    try {
      const response = await fetch("https://nsc-25-backend.vercel.app/api/register", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(isEdit ? "Details updated successfully!" : "Registration successful!", { id: loadingToast });
        await fetchRegistrations(user.uid, false);
        if (!isEdit) setFormData({}); // Clear form only on new registration
      } else {
        toast.error(data.error || (isEdit ? "Update failed." : "Registration failed."), { id: loadingToast });
      }
    } catch (error) {
      console.error(`Error during ${isEdit ? "update" : "registration"}:`, error.message);
      toast.error(`${isEdit ? "Update" : "Registration"} error occurred.`, { id: loadingToast });
    }
  };

  const handleLogin = async () => {
    const loadingToast = toast.loading("Logging in...");
    try {
      await login();
      toast.success("Logged in successfully!", { id: loadingToast });
    } catch (error) {
      toast.error(`Login failed: ${error.message}`, { id: loadingToast });
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "select":
        return (
          <select
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base p-2"
            required
          >
            <option value="">Select an option</option>
            {field.options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="flex flex-wrap gap-4">
            {field.options.map((option) => (
              <label key={option} className="flex items-center text-sm sm:text-base">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={formData[field.name] === option}
                  onChange={handleInputChange}
                  className="mr-2"
                  required
                />
                {option}
              </label>
            ))}
          </div>
        );
      case "text":
      default:
        return (
          <input
            type="text"
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base p-2"
            required
          />
        );
    }
  };

  return (
    <section className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      {/* Prize Highlight Section */}
      <div className="w-full max-w-4xl mx-auto mb-6 py-4 px-4 text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white drop-shadow-lg">
            Prizes Worth <span className="text-yellow-200">₹1,00,000+</span>
          </h2>
          <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
        </div>
      </div>

      {/* Header with Login/Logout */}
      <motion.div
        className="w-full max-w-4xl mx-auto py-4 sm:py-6 px-4 rounded-b-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center bg-gradient-to-r from-[#00E6E6] via-[#00B3FF] to-[#0099FF] bg-clip-text text-transparent tracking-tight drop-shadow-md">
          Upcoming Events
        </h2>
        <div className="text-center mt-4 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 flex-wrap">
          {user ? (
            <>
              <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50 px-3 sm:px-4 py-1.5 rounded-full shadow-sm">
                Welcome, <span className="text-indigo-600 dark:text-indigo-400">{user.name || user.email}</span>
              </span>
              <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50 px-3 sm:px-4 py-1.5 rounded-full shadow-sm">
                <span className="text-indigo-600 dark:text-indigo-400">{user.email}</span>
              </span>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="text-xs sm:text-sm md:text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 sm:px-5 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a4.898 4.898 0 01-4.897-4.904 4.898 4.898 0 014.897-4.904c1.466 0 2.785.631 3.692 1.638l2.695-2.695A8.097 8.097 0 0011.956 3c-4.473 0-8.104 3.631-8.104 8.104 0 4.473 3.631 8.104 8.104 8.104 4.473 0 8.104-3.631 8.104-8.104 0-.382-.046-.757-.121-1.132z"
                  fill="currentColor"
                />
              </svg>
              Login with Google
            </button>
          )}
        </div>
      </motion.div>

      {/* Events Grid or Expanded View */}
      <div className="mt-8 w-full max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!expandedEvent ? (
            <motion.div
              key="grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {eventsData.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
                  onClick={() => setExpandedEvent(event.id)}
                >
                  <div className="relative h-36 sm:h-48 md:h-52 flex justify-center items-center overflow-hidden">
                    <img
                      src={typeof event.image === "string" ? event.image : event.image.src}
                      alt={event.name}
                      className="max-h-full max-w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h2 className="text-lg sm:text-xl font-bold mb-2 text-indigo-600">{event.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-3 line-clamp-2">
                      {event.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                      <MapPin className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <button
                  onClick={() => setExpandedEvent(null)}
                  className="absolute top-3 right-3 p-1.5 sm:p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 z-10"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div className="overflow-y-auto p-4 sm:p-6 flex-1">
                  {eventsData
                    .filter((e) => e.id === expandedEvent)
                    .map((event) => (
                      <div key={event.id} className="flex flex-col">
                        <div className="relative h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden mb-4 flex justify-center items-center bg-gray-100">
                          <img
                            src={typeof event.image === "string" ? event.image : event.image.src}
                            alt={event.name}
                            className="h-full w-auto max-w-full object-contain"
                          />
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600 mb-4 text-center">
                          {event.name}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6">
                          {event.longDescription}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3">Rules</h3>
                            <ul className="space-y-2 text-sm sm:text-base">
                              {event.rules.map((rule, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                                  <span>{rule}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3">Prize</h3>
                            <p className="text-sm sm:text-base md:text-lg font-medium bg-indigo-50 dark:bg-indigo-900/20 p-2 sm:p-3 rounded-lg">
                              {event.prize}
                            </p>
                          </div>
                        </div>
                        {user && !registrations.some((r) => r.eventId === event.id) ? (
                          <div className="mt-6">
                            <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3">Register</h3>
                            {eventFields[event.id].map((field) => (
                              <div key={field.name} className="mb-4">
                                <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 capitalize">
                                  {field.name.replace(/([A-Z])/g, " $1").trim()}
                                </label>
                                {renderField(field)}
                              </div>
                            ))}
                            <button
                              onClick={() => handleRegister(event.id, false)}
                              className="mt-4 w-full bg-indigo-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg hover:bg-indigo-700 text-base sm:text-lg"
                            >
                              Register Now
                            </button>
                          </div>
                        ) : user && registrations.some((r) => r.eventId === event.id) ? (
                          <div className="mt-6">
                            <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3">Edit Your Registration</h3>
                            {eventFields[event.id].map((field) => (
                              <div key={field.name} className="mb-4">
                                <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 capitalize">
                                  {field.name.replace(/([A-Z])/g, " $1").trim()}
                                </label>
                                {renderField(field)}
                              </div>
                            ))}
                            <button
                              onClick={() => handleRegister(event.id, true)}
                              className="mt-4 w-full bg-blue-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg hover:bg-blue-700 text-base sm:text-lg"
                            >
                              Update Details
                            </button>
                            <p className="mt-4 text-green-600 text-sm sm:text-base md:text-lg text-center">
                              You are already registered for this event!
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 flex justify-center">
                  <button
                    onClick={() => setExpandedEvent(null)}
                    className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-600 text-sm sm:text-base"
                  >
                    Collapse
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Events;