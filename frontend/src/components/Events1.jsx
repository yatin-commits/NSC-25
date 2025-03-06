"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bvicamlogo from "../assets/bvicamLogo.png";
import shark from "../assets/shark.png";
import code from "../assets/code.png";
import binary from "../assets/binary.png";
import { MapPin, X, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const eventsData = [
  // Your eventsData array, unchanged (omitted for brevity)
  {
    id: 1,
    name: "Code Avengers",
    image: code,
    shortDescription: "Unleash your coding superpowers!",
    longDescription:
      "Assemble your team and tackle complex coding challenges in a thrilling hackathon-style event.",
    time: "9:00 AM - 3:00 PM",
    venue: "Tech Lab",
    rules: [
      "Teams of 3-5 members.",
      "Bring your own laptop.",
      "No pre-written code allowed.",
    ],
    prize: "Winner: ₹12,000, Runner-up: ₹6,000",
  },
  {
    id: 2,
    name: "Bollywood Bazigar",
    image: "/images/bollywood.jpg",
    shortDescription: "Dance and drama Bollywood-style!",
    longDescription:
      "Perform iconic Bollywood scenes or dance numbers in a high-energy competition.",
    time: "4:00 PM - 7:00 PM",
    venue: "Main Stage",
    rules: [
      "Teams of 2-8 members.",
      "5-minute performance limit.",
      "Costumes encouraged.",
    ],
    prize: "Winner: ₹8,000, Runner-up: ₹4,000",
  },
  {
    id: 3,
    name: "Volleyball",
    image: "/images/volleyball.jpg",
    shortDescription: "Spike your way to victory!",
    longDescription:
      "Compete in a fast-paced volleyball tournament with teams battling it out on the court.",
    time: "10:00 AM - 2:00 PM",
    venue: "Sports Ground",
    rules: [
      "Teams of 6 players.",
      "Standard volleyball rules apply.",
      "Best of 3 sets.",
    ],
    prize: "Winner: ₹10,000, Runner-up: ₹5,000",
  },
  {
    id: 4,
    name: "Battle Byte",
    image: binary,
    shortDescription: "Code fast, win big!",
    longDescription:
      "A speed-coding competition where participants solve problems under time pressure.",
    time: "1:00 PM - 4:00 PM",
    venue: "Computer Lab 2",
    rules: [
      "Individual participation.",
      "90-minute time limit.",
      "Top 3 solutions win.",
    ],
    prize: "Winner: ₹7,000, Runner-up: ₹3,500",
  },
  {
    id: 5,
    name: "Shark Tank",
    image: shark,
    shortDescription: "Pitch your million-dollar idea!",
    longDescription:
      "Present your startup idea to a panel of judges in a Shark Tank-inspired pitch event.",
    time: "3:00 PM - 6:00 PM",
    venue: "Conference Room",
    rules: [
      "Teams of 1-4 members.",
      "5-minute pitch + 5-minute Q&A.",
      "Props allowed.",
    ],
    prize: "Winner: ₹15,000, Runner-up: ₹7,500",
  },
  {
    id: 6,
    name: "Candid Moments",
    image: "/images/photography.jpg",
    shortDescription: "Capture the perfect shot!",
    longDescription:
      "A photography contest where participants submit their best candid shots of the fest.",
    time: "All Day",
    venue: "Campus Wide",
    rules: [
      "Individual entries.",
      "Submit up to 3 photos.",
      "No heavy editing allowed.",
    ],
    prize: "Winner: ₹6,000, Runner-up: ₹3,000",
  },
  {
    id: 7,
    name: "Cine Blitz",
    image: "/images/cinema.jpg",
    shortDescription: "Lights, camera, action!",
    longDescription:
      "Create and showcase a short film in this rapid filmmaking challenge.",
    time: "11:00 AM - 5:00 PM",
    venue: "Auditorium",
    rules: [
      "Teams of 3-6 members.",
      "Max 5-minute runtime.",
      "Theme provided on-spot.",
    ],
    prize: "Winner: ₹10,000, Runner-up: ₹5,000",
  },
  {
    id: 8,
    name: "Rangmanch",
    image: "/images/theatre.jpg",
    shortDescription: "Stage your story!",
    longDescription:
      "Perform a captivating drama or skit in this theatrical competition.",
    time: "2:00 PM - 5:00 PM",
    venue: "Open Theatre",
    rules: [
      "Teams of 4-10 members.",
      "10-minute performance limit.",
      "Minimal props allowed.",
    ],
    prize: "Winner: ₹8,000, Runner-up: ₹4,000",
  },
  {
    id: 9,
    name: "Fandango",
    image: "/images/dance.jpg",
    shortDescription: "Dance like nobody’s watching!",
    longDescription:
      "A solo or group dance competition featuring various styles and flair.",
    time: "5:00 PM - 8:00 PM",
    venue: "Main Stage",
    rules: [
      "1-6 participants.",
      "4-minute performance limit.",
      "Any dance style allowed.",
    ],
    prize: "Winner: ₹9,000, Runner-up: ₹4,500",
  },
  {
    id: 10,
    name: "War of Words",
    image: "/images/debate.jpg",
    shortDescription: "Argue your way to the top!",
    longDescription:
      "A debate competition where sharp minds clash over hot topics.",
    time: "10:00 AM - 1:00 PM",
    venue: "Seminar Hall",
    rules: [
      "Teams of 2 members.",
      "3-minute speaking slots.",
      "Rebuttals allowed.",
    ],
    prize: "Winner: ₹6,000, Runner-up: ₹3,000",
  },
  {
    id: 11,
    name: "Bollywood Beats",
    image: "/images/bollywooddance.jpg",
    shortDescription: "Groove to Bollywood rhythms!",
    longDescription:
      "A dance-off featuring the best of Bollywood music and moves.",
    time: "6:00 PM - 9:00 PM",
    venue: "Outdoor Arena",
    rules: [
      "Teams of 2-8 members.",
      "5-minute performance limit.",
      "Bollywood tracks only.",
    ],
    prize: "Winner: ₹10,000, Runner-up: ₹5,000",
  },
  {
    id: 12,
    name: "Creative Canvas",
    image: "/images/art.jpg",
    shortDescription: "Paint your masterpiece!",
    longDescription:
      "An art competition where participants create themed artworks on the spot.",
    time: "11:00 AM - 2:00 PM",
    venue: "Art Room",
    rules: [
      "Individual participation.",
      "2-hour time limit.",
      "Materials provided.",
    ],
    prize: "Winner: ₹7,000, Runner-up: ₹3,500",
  },
];

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
      console.log("Fetching registrations for user:", user.uid);
      fetchRegistrations(user.uid);
    }
  }, [user]);

  const fetchRegistrations = async (uid) => {
    try {
      const response = await fetch(`https://nsc-25-backend.vercel.app/api/registrations?userId=${uid}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch registrations: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Registrations fetched:", data);
      setRegistrations(Array.isArray(data) ? data : []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching registrations:", error.message);
      setRegistrations([]); // Reset on error
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (eventId) => {
    if (!user) {
      alert("Please log in to register.");
      return;
    }
    const requiredFields = eventFields[eventId];
    if (!requiredFields.every((field) => formData[field] && formData[field].trim())) {
      alert("Please fill all required fields with valid data.");
      return;
    }
    const payload = { eventId, userId: user.uid, fields: formData };
    console.log("Sending registration payload:", payload);
    try {
      const response = await fetch("https://nsc-25-backend.vercel.app/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("Registration response:", data);
      if (response.ok) {
        alert("Registration successful!");
        await fetchRegistrations(user.uid); // Refresh registrations
        setFormData({}); // Clear form
      } else {
        console.error("Registration failed:", data);
        alert(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Network or server error during registration:", error.message);
      alert("An error occurred while registering. Please try again.");
    }
  };

  const eventFields = {
    1: ["teamName", "teamSize", "preferredLanguage"],
    2: ["performanceType", "groupSize", "songChoice"],
    3: ["teamName", "teamSize"],
    4: ["codingLanguage", "experienceLevel"],
    5: ["pitchTitle", "teamSize", "industry"],
    6: ["cameraType", "photoTheme"],
    7: ["filmTitle", "teamSize", "genre"],
    8: ["playTitle", "castSize"],
    9: ["danceStyle", "groupSize"],
    10: ["debateTopicPreference", "teamName"],
    11: ["songChoice", "groupSize", "choreographer"],
    12: ["artMedium", "artTheme"],
  };

  return (
    <section className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      {/* Prize Highlight Section */}
      <div className="max-w-7xl mx-auto mb-6 py-6 px-6 text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="relative z-10 flex items-center justify-center gap-4">
          <Award className="w-10 h-10 text-white" />
          <h2 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Prizes Worth <span className="text-yellow-200">₹1,00,000+</span>
          </h2>
          <Award className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Header with Login/Logout */}
      <motion.div
        className="max-w-7xl mx-auto py-6 px-6 rounded-b-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl h-[69px] items-center align-middle flex justify-center font-extrabold text-center bg-gradient-to-r from-[#00E6E6] via-[#00B3FF] to-[#0099FF] bg-clip-text text-transparent">
          Upcoming Thrills
        </h1>
        <div className="text-center mt-2">
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button onClick={logout} className="ml-4 text-blue-600 hover:underline">
                Logout
              </button>
            </>
          ) : (
            <button onClick={login} className="text-blue-600 hover:underline">
              Login with Google
            </button>
          )}
        </div>
      </motion.div>

      {/* Events Grid or Expanded View */}
      <div className="mt-12 max-w-7xl mx-auto">
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
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
                  onClick={() => setExpandedEvent(event.id)}
                >
                  <div className="relative h-40 flex justify-center items-center overflow-hidden">
                    <img
                      src={typeof event.image === "string" ? event.image : event.image.src}
                      alt={event.name}
                      className="h-[90%] flex justify-center object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {event.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                      <MapPin className="w-4 h-4" /> {event.venue}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
                <button
                  onClick={() => setExpandedEvent(null)}
                  className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 z-10"
                >
                  <X className="w-6 h-6" />
                </button>
                {eventsData
                  .filter((e) => e.id === expandedEvent)
                  .map((event) => (
                    <div key={event.id} className="flex flex-col min-h-[50vh]">
                      <div className="p-6">
                        <h2 className="text-3xl font-bold mb-4 text-indigo-600">{event.name}</h2>
                        <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">
                          {event.longDescription}
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-semibold text-xl mb-4">Rules</h3>
                            <ul className="space-y-2">
                              {event.rules.map((rule, i) => (
                                <li key={i} className="flex gap-2 items-center">
                                  <span className="w-2 h-2 bg-indigo-400 rounded-full" /> {rule}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-semibold text-xl mb-4">Prize</h3>
                            <p className="text-lg font-medium bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                              {event.prize}
                            </p>
                          </div>
                        </div>
                        {/* Registration Form */}
                        {user && !registrations.some((r) => r.eventId === event.id) && (
                          <div className="mt-6">
                            <h3 className="font-semibold text-xl mb-4">Register</h3>
                            {eventFields[event.id].map((field) => (
                              <div key={field} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {field.replace(/([A-Z])/g, " $1").trim()}
                                </label>
                                <input
                                  type="text"
                                  name={field}
                                  value={formData[field] || ""}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                  required
                                />
                              </div>
                            ))}
                            <button
                              onClick={() => handleRegister(event.id)}
                              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                            >
                              Register
                            </button>
                          </div>
                        )}
                        {user && registrations.some((r) => r.eventId === event.id) && (
                          <p className="mt-4 text-green-600">You are already registered for this event!</p>
                        )}
                        {/* Debugging: Show registrations */}
                        {user && (
                          <div className="mt-4">
                            <p>Current Registrations:</p>
                            <pre>{JSON.stringify(registrations, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Events;