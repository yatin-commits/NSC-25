"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bvicamlogo from "../assets/bvicamLogo.png";
import shark from "../assets/shark.png";
import code from "../assets/code.png";
import binary from "../assets/binary.png";
import { MapPin, X, Award } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {eventFields,eventsData} from "./eventFields";
import toast from "react-hot-toast";

// const eventsData = [
//   {
//     id: 1,
//     name: "Code Avengers",
//     image: code,
//     shortDescription: "Unleash your coding superpowers!",
//     longDescription:
//       "Assemble your team and tackle complex coding challenges in a thrilling hackathon-style event.",
//     time: "9:00 AM - 3:00 PM",
//     venue: "Tech Lab",
//     rules: ["Teams of 3-5 members.", "Bring your own laptop.", "No pre-written code allowed."],
//     prize: "Winner: ₹12,000, Runner-up: ₹6,000",
//   },
//   {
//     id: 2,
//     name: "Bollywood Bazigar",
//     image: "/images/bollywood.jpg",
//     shortDescription: "Dance and drama Bollywood-style!",
//     longDescription:
//       "Perform iconic Bollywood scenes or dance numbers in a high-energy competition.",
//     time: "4:00 PM - 7:00 PM",
//     venue: "Main Stage",
//     rules: ["Teams of 2-8 members.", "5-minute performance limit.", "Costumes encouraged."],
//     prize: "Winner: ₹8,000, Runner-up: ₹4,000",
//   },
//   {
//     id: 3,
//     name: "Volleyball",
//     image: "/images/volleyball.jpg",
//     shortDescription: "Spike your way to victory!",
//     longDescription:
//       "Compete in a fast-paced volleyball tournament with teams battling it out on the court.",
//     time: "10:00 AM - 2:00 PM",
//     venue: "Sports Ground",
//     rules: ["Teams of 6 players.", "Standard volleyball rules apply.", "Best of 3 sets."],
//     prize: "Winner: ₹10,000, Runner-up: ₹5,000",
//   },
//   {
//     id: 4,
//     name: "Battle Byte",
//     image: binary,
//     shortDescription: "Code fast, win big!",
//     longDescription:
//       "A speed-coding competition where participants solve problems under time pressure.",
//     time: "1:00 PM - 4:00 PM",
//     venue: "Computer Lab 2",
//     rules: ["Individual participation.", "90-minute time limit.", "Top 3 solutions win."],
//     prize: "Winner: ₹7,000, Runner-up: ₹3,500",
//   },
//   {
//     id: 5,
//     name: "Shark Tank",
//     image: shark,
//     shortDescription: "Pitch your million-dollar idea!",
//     longDescription:
//       "Present your startup idea to a panel of judges in a Shark Tank-inspired pitch event.",
//     time: "3:00 PM - 6:00 PM",
//     venue: "Conference Room",
//     rules: ["Teams of 1-4 members.", "5-minute pitch + 5-minute Q&A.", "Props allowed."],
//     prize: "Winner: ₹15,000, Runner-up: ₹7,500",
//   },
//   {
//     id: 6,
//     name: "Candid Moments",
//     image: "/images/photography.jpg",
//     shortDescription: "Capture the perfect shot!",
//     longDescription:
//       "A photography contest where participants submit their best candid shots of the fest.",
//     time: "All Day",
//     venue: "Campus Wide",
//     rules: ["Individual entries.", "Submit up to 3 photos.", "No heavy editing allowed."],
//     prize: "Winner: ₹6,000, Runner-up: ₹3,000",
//   },
//   {
//     id: 7,
//     name: "Cine Blitz",
//     image: "/images/cinema.jpg",
//     shortDescription: "Lights, camera, action!",
//     longDescription:
//       "Create and showcase a short film in this rapid filmmaking challenge.",
//     time: "11:00 AM - 5:00 PM",
//     venue: "Auditorium",
//     rules: ["Teams of 3-6 members.", "Max 5-minute runtime.", "Theme provided on-spot."],
//     prize: "Winner: ₹10,000, Runner-up: ₹5,000",
//   },
//   {
//     id: 8,
//     name: "Rangmanch",
//     image: "/images/theatre.jpg",
//     shortDescription: "Stage your story!",
//     longDescription:
//       "Perform a captivating drama or skit in this theatrical competition.",
//     time: "2:00 PM - 5:00 PM",
//     venue: "Open Theatre",
//     rules: ["Teams of 4-10 members.", "10-minute performance limit.", "Minimal props allowed."],
//     prize: "Winner: ₹8,000, Runner-up: ₹4,000",
//   },
//   {
//     id: 9,
//     name: "Fandango",
//     image: "/images/dance.jpg",
//     shortDescription: "Dance like nobody’s watching!",
//     longDescription:
//       "A solo or group dance competition featuring various styles and flair.",
//     time: "5:00 PM - 8:00 PM",
//     venue: "Main Stage",
//     rules: ["1-6 participants.", "4-minute performance limit.", "Any dance style allowed."],
//     prize: "Winner: ₹9,000, Runner-up: ₹4,500",
//   },
//   {
//     id: 10,
//     name: "War of Words",
//     image: "/images/debate.jpg",
//     shortDescription: "Argue your way to the top!",
//     longDescription:
//       "A debate competition where sharp minds clash over hot topics.",
//     time: "10:00 AM - 1:00 PM",
//     venue: "Seminar Hall",
//     rules: ["Teams of 2 members.", "3-minute speaking slots.", "Rebuttals allowed."],
//     prize: "Winner: ₹6,000, Runner-up: ₹3,000",
//   },
//   {
//     id: 11,
//     name: "Bollywood Beats",
//     image: "/images/bollywooddance.jpg",
//     shortDescription: "Groove to Bollywood rhythms!",
//     longDescription:
//       "A dance-off featuring the best of Bollywood music and moves.",
//     time: "6:00 PM - 9:00 PM",
//     venue: "Outdoor Arena",
//     rules: ["Teams of 2-8 members.", "5-minute performance limit.", "Bollywood tracks only."],
//     prize: "Winner: ₹10,000, Runner-up: ₹5,000",
//   },
//   {
//     id: 12,
//     name: "Creative Canvas",
//     image: "/images/art.jpg",
//     shortDescription: "Paint your masterpiece!",
//     longDescription:
//       "An art competition where participants create themed artworks on the spot.",
//     time: "11:00 AM - 2:00 PM",
//     venue: "Art Room",
//     rules: ["Individual participation.", "2-hour time limit.", "Materials provided."],
//     prize: "Winner: ₹7,000, Runner-up: ₹3,500",
//   },
// ];

const Events = () => {
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const { user, login, logout } = useAuth();

  useEffect(() => {
    if (expandedEvent !== null) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [expandedEvent]);

  useEffect(() => {
    if (user) {
      console.log("User logged in, fetching registrations for UID:", user.uid);
      fetchRegistrations(user.uid, true); // Show welcome only on login
    }
  }, [user]);
  

  const fetchRegistrations = async (uid, showWelcome = true) => {
    const loadingToast = toast.loading("Fetching data...");
    try {
      const response = await fetch(`https://nsc-25-backend.vercel.app/api/registrations?userId=${uid}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("Fetched registrations:", data);
      setRegistrations(data || []);
  
      if (showWelcome) {
        toast.success(`Welcome, ${user.name || user.email}! `, { id: loadingToast, duration: 3000 });
      } else {
        toast.dismiss(loadingToast); // Just remove loading toast without showing welcome
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

  const handleRegister = async (eventId) => {
    if (!user) {
      toast.error("Please log in to register.");
      return;
    }
  
    const requiredFields = eventFields[eventId].map((f) => f.name);
    if (!requiredFields.every((field) => formData[field]?.trim())) {
      toast.error("Please fill all required fields.");
      return;
    }
  
    const payload = { eventId, userId: user.uid, fields: formData };
    console.log("Registering for event:", payload);
    const loadingToast = toast.loading("Registering...");
  
    try {
      const response = await fetch("https://nsc-25-backend.vercel.app/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success("Registration successful!", { id: loadingToast });
        await fetchRegistrations(user.uid, false); // Don't show welcome again
        setFormData({});
      } else {
        console.error("Registration error:", data);
        toast.error(data.error || "Registration failed.", { id: loadingToast });
      }
    } catch (error) {
      console.error("Error during registration:", error.message);
      toast.error("Registration error occurred.", { id: loadingToast });
    }
  };
  

  const handleLogin = async () => {
    const loadingToast = toast.loading("Logging in...");
    try {
      await login(); // Assuming login uses popup by default
      toast.success("Logged in successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Login error:", error.message);
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm p-2"
            required
          >
            <option value="">Select an option</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="flex flex-wrap gap-4">
            {field.options.map((option) => (
              <label key={option} className="flex items-center">
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm p-2"
            required
          />
        );
    }
  };

  return (
    <section className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      {/* Prize Highlight Section */}
      <div className="w-full mx-auto mb-6 py-4 px-4 text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-xl shadow-xl overflow-hidden">
        <div className="flex  sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <Award className="w-8 h-8 text-white" />
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            Prizes Worth <span className="text-yellow-200">₹1,00,000+</span>
          </h2>
          <Award className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Header with Login/Logout */}
      <motion.div
  className="w-full mx-auto py-6 px-4 rounded-b-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg"
  initial={{ y: -50 }}
  animate={{ y: 0 }}
  transition={{ duration: 0.5 }}
>
  <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-[#00E6E6] via-[#00B3FF] to-[#0099FF] bg-clip-text text-transparent tracking-tight drop-shadow-md">
    Upcoming Events
  </h2>
  <div className="text-center mt-4 w-full flex flex-row justify-center flex-wrap items-center gap-4">
    {user ? (
      <>
        <span className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50 px-4 rounded-full shadow-sm">
          Welcome,{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            {user.name || user.email}
          </span>
        </span>
        <span className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50 px-4 rounded-full shadow-sm">
          <span className="text-indigo-600 dark:text-indigo-400">{user.email}</span>
        </span>
        {/* Uncomment if you want the logout button on mobile */}
        {/* <div className="md:hidden flex justify-center">
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-1.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Logout
          </button>
        </div> */}
      </>
    ) : (
      <button
        onClick={handleLogin}
        className="text-sm sm:text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-5 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <div className="mt-8 w-full mx-auto">
  <AnimatePresence mode="wait">
    {!expandedEvent ? (
      <motion.div
        key="grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
            <div className="relative h-40 sm:h-52 flex justify-center items-center overflow-hidden">
  <img
    src={typeof event.image === "string" ? event.image : event.image.src}
    alt={event.name}
    className="max-h-full max-w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
/>
</div>

            <div className="p-5">
              <h2 className="text-xl font-bold mb-2 text-indigo-600">{event.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {event.shortDescription}
              </p>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                <MapPin className="w-4 h-4" /> {event.venue}
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
  <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
    {/* Close Button */}
    <button
      onClick={() => setExpandedEvent(null)}
      className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 z-10"
    >
      <X className="w-6 h-6" />
    </button>

    {/* Scrollable Content */}
    <div className="overflow-y-auto p-6 flex-1">
      {eventsData
        .filter((e) => e.id === expandedEvent)
        .map((event) => (
          <div key={event.id} className="flex flex-col">
            {/* Event Image */}
            <div className="relative h-56 rounded-lg overflow-hidden mb-4 flex justify-center items-center bg-gray-100">
              <img
                src={typeof event.image === "string" ? event.image : event.image.src}
                alt={event.name}
                className="h-full w-auto max-w-full object-contain"
              />
            </div>

            {/* Event Name & Description */}
            <h2 className="text-3xl font-bold text-indigo-600 mb-4 text-center">
              {event.name}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
              {event.longDescription}
            </p>

            {/* Rules & Prize Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-xl mb-3">Rules</h3>
                <ul className="space-y-2 text-base">
                  {event.rules.map((rule, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-indigo-400 rounded-full" /> {rule}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-3">Prize</h3>
                <p className="text-lg font-medium bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                  {event.prize}
                </p>
              </div>
            </div>

            {/* Registration Section */}
            {user && !registrations.some((r) => r.eventId === event.id) && (
              <div className="mt-6">
                <h3 className="font-semibold text-xl mb-3">Register</h3>
                {eventFields[event.id].map((field) => (
                  <div key={field.name} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {field.name.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
                <button
                  onClick={() => handleRegister(event.id)}
                  className="mt-4 w-full bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 text-lg"
                >
                  Register Now
                </button>
              </div>
            )}
            {user && registrations.some((r) => r.eventId === event.id) && (
              <p className="mt-4 text-green-600 text-lg">
                You are already registered for this event!
              </p>
            )}
          </div>
        ))}
    </div>

    {/* Collapse Button */}
    <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 flex justify-center">
      <button
        onClick={() => setExpandedEvent(null)}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
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