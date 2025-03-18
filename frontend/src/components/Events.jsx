"use client";
import React, { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Award, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { eventFields as baseEventFields, eventsData } from "./data";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Events = forwardRef((props, ref) => {
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [showEditFields, setShowEditFields] = useState(false);
  const [formData, setFormData] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, login } = useAuth();
  const name = user?.name;
  const email = user?.email;
  const navigate = useNavigate();
  const [paymentReceipt, setPaymentReceipt] = useState(null); // For preview (URL.createObjectURL)
  const [paymentReceiptFile, setPaymentReceiptFile] = useState(null); // Raw file for upload
  const [showPaymentStep, setShowPaymentStep] = useState(false); // Toggle payment step

  useEffect(() => {
    if (expandedEvent !== null) {
      document.body.classList.add("overflow-hidden");
      const registration = registrations.find((r) => r.eventId === expandedEvent);
      if (registration) {
        setFormData(registration.fields);
        setPaymentReceipt(registration.paymentReceipt || null); // Cloudinary URL
        setPaymentReceiptFile(null); // Reset file on edit
      } else {
        setFormData({});
        setPaymentReceipt(null);
        setPaymentReceiptFile(null);
      }
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [expandedEvent, registrations]);

  useEffect(() => {
    if (user) {
      fetchRegistrations(user.uid, true);
    }
  }, [user]);

  const fetchRegistrations = async (uid, showWelcome = true) => {
    const loadingToast = toast.loading("Fetching data...");
    try {
      const response = await fetch(
        `https://nsc-25-backend.vercel.app/api/registrations?userId=${uid}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRegistrations(data || []);
      if (showWelcome) {
        toast.success(`Welcome, ${user.name || user.email}!`, {
          id: loadingToast,
          duration: 3000,
        });
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
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      const sizeField = ["teamSize", "groupSize", "castSize"].find((field) => field === name);
      if (sizeField) {
        const teamSize = parseInt(value) || 0;
        for (let i = 1; i <= Math.max(teamSize, prev[sizeField] || 0); i++) {
          if (i > teamSize) delete newFormData[`teamMemberId${i}`];
        }
      }
      return newFormData;
    });
  };

  const handlePaymentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentReceipt(URL.createObjectURL(file)); // For preview
      setPaymentReceiptFile(file); // Store raw file for upload
    }
  };

  const handleRegister = async (eventId, isEdit = false) => {
    if (!user) {
      toast.error("Please log in to register.");
      return;
    }

    const event = eventsData.find((e) => e.id === eventId);
    const requiresPayment = event.requiresPayment;

    if (requiresPayment && !isEdit && !paymentReceiptFile) {
      toast.error("Please upload your payment receipt.");
      return;
    }

    const requiredFields = ["memberId", ...(baseEventFields[eventId] || []).map((f) => f.name)];
    const sizeField = baseEventFields[eventId]?.find((f) =>
      ["teamSize", "groupSize", "castSize"].includes(f.name)
    );
    let memberIds = [formData.memberId];
    if (sizeField) {
      const teamSize = parseInt(formData[sizeField.name]) || 0;
      if (eventIsTeamBased(eventId) && teamSize > 1) {
        for (let i = 1; i <= teamSize - 1; i++) {
          requiredFields.push(`teamMemberId${i}`);
          memberIds.push(formData[`teamMemberId${i}`]);
        }
      }
    }

    if (!requiredFields.every((field) => formData[field]?.trim())) {
      if (!formData.memberId?.trim()) {
        toast.error(
          <div>
            You need a Member ID to register.{" "}
            <button
              onClick={() => navigate("/MemberForm")}
              className="underline text-blue-600 hover:text-blue-800"
            >
              Generate one now
            </button>
            .
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.error("Please fill all required fields.");
      }
      return;
    }

    const loadingToast = toast.loading("Verifying member IDs...");
    try {
      const verifyResponse = await fetch(
        "https://nsc-25-backend.vercel.app/api/verify-member-ids",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberIds }),
        }
      );
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) {
        if (verifyData.invalidIds && verifyData.invalidIds.length > 0) {
          const invalidList = verifyData.invalidIds.join(", ");
          toast.error(`Invalid member ID(s): ${invalidList}`, { id: loadingToast });
        } else {
          toast.error(verifyData.message || "Invalid member IDs", { id: loadingToast });
        }
        return;
      }
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.error("Verification failed", { id: loadingToast });
      return;
    }

    const formPayload = new FormData();
    formPayload.append("eventId", eventId);
    formPayload.append("userId", user.uid);
    formPayload.append("name", name);
    formPayload.append("email", email);
    formPayload.append("fields", JSON.stringify(formData)); // Stringify fields for FormData
    if (requiresPayment && !isEdit && paymentReceiptFile) {
      formPayload.append("paymentReceipt", paymentReceiptFile);
    }

    const registerToast = toast.loading(isEdit ? "Updating..." : "Registering...");
    try {
      const response = await fetch("https://nsc-25-backend.vercel.app/api/register", {
        method: isEdit ? "PUT" : "POST",
        body: formPayload, // No headers needed; FormData sets Content-Type automatically
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(isEdit ? "Details updated!" : "Registration successful!", {
          id: registerToast,
        });
        await fetchRegistrations(user.uid, false);
        if (!isEdit) {
          setFormData({});
          setPaymentReceipt(null);
          setPaymentReceiptFile(null);
          setShowPaymentStep(false);
        }
      } else {
        toast.error(data.error || (isEdit ? "Update failed." : "Registration failed."), {
          id: registerToast,
        });
      }
    } catch (error) {
      toast.error(`${isEdit ? "Update" : "Registration"} error occurred.`, {
        id: registerToast,
      });
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

  const renderField = (field, index = null) => {
    const fieldName = index !== null ? `${field.name}${index}` : field.name;
    switch (field.type) {
      case "select":
        return (
          <select
            name={fieldName}
            value={formData[fieldName] || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base p-2"
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
              <label key={option} className="flex items-center text-sm sm:text-base">
                <input
                  type="radio"
                  name={fieldName}
                  value={option}
                  checked={formData[fieldName] === option}
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
            name={fieldName}
            value={formData[fieldName] || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base p-2"
            required
          />
        );
    }
  };

  const filteredEvents = eventsData.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const eventIsTeamBased = (eventId) =>
    eventsData.find((e) => e.id === eventId)?.isTeamBased ||
    baseEventFields[eventId]?.some((f) => ["teamSize", "groupSize", "castSize"].includes(f.name));

  const getTeamSizeFieldName = (eventId) =>
    baseEventFields[eventId]?.find((f) => ["teamSize", "groupSize", "castSize"].includes(f.name))?.name || null;

  return (
    <div ref={ref} className="mt-4 md:mt-8 w-full mx-auto px-2 sm:px-4 md:px-8">
      <div className="w-full mx-auto mb-4 sm:mb-6 py-3 sm:py-4 px-3 sm:px-4 text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-xl shadow-xl overflow-hidden">
        <div className="flex sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white drop-shadow-lg">
            Prizes Worth <span className="text-yellow-200">₹1,00,000+</span>
          </h2>
          <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
        </div>
      </div>

      <motion.div
        className="w-full mx-auto py-4 sm:py-6 px-3 sm:px-4 rounded-b-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-center bg-gradient-to-r from-[#00E6E6] via-[#00B3FF] to-[#0099FF] bg-clip-text text-transparent tracking-tight drop-shadow-md">
          Upcoming Thrills
        </h2>
        <div className="text-center mt-2 sm:mt-4 flex flex-col items-center gap-2 sm:gap-4">
          {user ? (
            <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50 px-3 sm:px-4 py-1 sm:py-2 rounded-md shadow-sm">
              Welcome,{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                {user.name || user.email}
              </span>
            </span>
          ) : (
            <span className="text-xs flex flex-col sm:text-sm md:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-200 text-center">
              Please log in to register for events.
              <br />
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-white bg-black hover:bg-white hover:text-black hover:border-[1px] hover:border-black rounded-md transition"
                onClick={handleLogin}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Login with Google
              </button>
            </span>
          )}
        </div>
      </motion.div>

      <div className="relative mb-6 px-5 sm:px-4 mt-6">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search events by name, description, or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 md:py-3 lg:py-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm md:text-base lg:text-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl md:text-2xl"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!expandedEvent ? (
          <motion.div
            key="grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6 px-2 sm:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer w-full max-w-[350px] mx-auto mb-4"
                onClick={() => setExpandedEvent(event.id)}
              >
                <div className="relative h-32 sm:h-40 md:h-48 lg:h-52 flex justify-center items-center overflow-hidden">
                  <img
                    src={typeof event.image === "string" ? event.image : event.image.src}
                    alt={event.name}
                    className="max-h-full max-w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 sm:p-4 md:p-5">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-indigo-600">
                    {event.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 line-clamp-2">
                    {event.shortDescription}
                  </p>
                  <div className="flex items-center justify-between gap-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                    {user && registrations.some((r) => r.eventId === event.id) && (
                      <div className="flex space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 text-blue-500 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L15.732 5.732z"
                          />
                        </svg>
                        <span className="text-green-600 cursor-pointer flex font-medium">
                          Registered
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400 text-lg"
              >
                No events found matching your search.
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full max-w-[95vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <button
                onClick={() => {
                  setExpandedEvent(null);
                  setShowEditFields(false);
                  setShowPaymentStep(false);
                }}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1 sm:p-1.5 md:p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 z-10"
              >
                <X className="w-4 cursor-pointer h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
              <div className="overflow-y-auto p-3 sm:p-4 md:p-6 flex-1">
                {eventsData
                  .filter((e) => e.id === expandedEvent)
                  .map((event) => {
                    const isRegistered = user && registrations.some((r) => r.eventId === event.id);
                    const isTeamBased = eventIsTeamBased(event.id);
                    const sizeFieldName = getTeamSizeFieldName(event.id);
                    const teamSize = sizeFieldName ? parseInt(formData[sizeFieldName]) || 0 : 0;
                    const requiresPayment = event.requiresPayment;

                    return (
                      <div key={event.id} className="flex flex-col">
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-indigo-600 mb-3 sm:mb-4 text-center">
                          {event.name}
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">
                          {event.longDescription}
                        </p>
                        <div className="sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 md:mb-3">
                              Rules
                            </h3>
                            <div className="max-h-48 sm:max-h-56 md:max-h-64 lg:max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-700">
                              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                                {event.rules.map((rule, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                                    <span>{rule}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          {/* <div>
                            <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 md:mb-3">
                              Prize
                            </h3>
                            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium bg-indigo-50 dark:bg-indigo-900/20 p-1.5 sm:p-2 md:p-3 rounded-lg">
                              {event.prize}
                            </p>
                          </div> */}
                        </div>
                        {user && !isRegistered ? (
                          <div className="mt-4 sm:mt-6">
                            <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-1">
                              Register
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 sm:mb-2 md:mb-3">
                              Don’t have a Member ID?{" "}
                              <button
                                onClick={() => navigate("/MemberForm")}
                                className="text-indigo-600 cursor-pointer hover:text-indigo-800 underline"
                              >
                                Generate one
                              </button>
                            </p>
                            {requiresPayment && !showPaymentStep ? (
                              <div className="mb-4">
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                  Registration Fee: ₹{event.registrationFee || 500}
                                </p>
                                <button
                                  onClick={() => setShowPaymentStep(true)}
                                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm sm:text-base"
                                >
                                  Proceed to Payment
                                </button>
                              </div>
                            ) : (
                              <>
                                {requiresPayment && showPaymentStep && (
                                  <div className="mb-4">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                      Scan the QR code below to pay the registration fee:
                                    </p>
                                    <img
                                      src={event.qrCode || "/images/placeholder-qr.png"} // Placeholder QR code
                                      alt="Payment QR Code"
                                      className="w-32 h-32 mx-auto mb-2"
                                    />
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      Upload Payment Receipt
                                    </label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handlePaymentUpload}
                                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    {paymentReceipt && (
                                      <img
                                        src={paymentReceipt}
                                        alt="Uploaded Receipt Preview"
                                        className="w-32 h-32 mt-2 mx-auto"
                                      />
                                    )}
                                  </div>
                                )}
                                <div className="mb-3 sm:mb-4">
                                  <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
                                    Your Member ID
                                  </label>
                                  {renderField({ name: "memberId", type: "text" })}
                                </div>
                                {(baseEventFields[event.id] || []).map((field) => (
                                  <div key={field.name} className="mb-3 sm:mb-4">
                                    <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 capitalize">
                                      {field.name.replace(/([A-Z])/g, " $1").trim()}
                                    </label>
                                    {renderField(field)}
                                  </div>
                                ))}
                                {isTeamBased && sizeFieldName && teamSize > 1 && (
                                  <div className="mb-3 sm:mb-4">
                                    <h4 className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      Team Member IDs (excluding you)
                                    </h4>
                                    {Array.from({ length: teamSize - 1 }, (_, i) => (
                                      <div key={i} className="mb-2">
                                        <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
                                          Team Member {i + 1} ID
                                        </label>
                                        {renderField({ name: `teamMemberId${i + 1}`, type: "text" })}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <button
                                  onClick={() => handleRegister(event.id, false)}
                                  className="mt-3 sm:mt-4 w-full bg-indigo-600 cursor-pointer text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-3 rounded-lg hover:bg-indigo-700 text-sm sm:text-base md:text-lg"
                                >
                                  Register Now
                                </button>
                              </>
                            )}
                          </div>
                        ) : user && isRegistered ? (
                          <div className="mt-4 sm:mt-6">
                            <div className="flex items-center justify-between flex-col sm:flex-row gap-2">
                              <p className="text-green-600 text-xs sm:text-sm md:text-base lg:text-lg">
                                You are already registered for this event!
                              </p>
                              <button
                                onClick={() => setShowEditFields(!showEditFields)}
                                className="text-blue-600 cursor-pointer hover:text-blue-800 flex items-center gap-1 sm:gap-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L15.732 5.732z"
                                  />
                                </svg>
                                Edit Response
                              </button>
                            </div>
                            {showEditFields && (
                              <div className="mt-3 sm:mt-4">
                                {requiresPayment && paymentReceipt && (
                                  <div className="mb-4">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                      Payment Receipt:
                                    </p>
                                    <img
                                      src={paymentReceipt}
                                      alt="Payment Receipt"
                                      className="w-32 h-32 mx-auto"
                                    />
                                  </div>
                                )}
                                <div className="mb-3 sm:mb-4">
                                  <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
                                    Your Member ID
                                  </label>
                                  {renderField({ name: "memberId", type: "text" })}
                                </div>
                                {(baseEventFields[event.id] || []).map((field) => (
                                  <div key={field.name} className="mb-3 sm:mb-4">
                                    <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 capitalize">
                                      {field.name.replace(/([A-Z])/g, " $1").trim()}
                                    </label>
                                    {renderField(field)}
                                  </div>
                                ))}
                                {isTeamBased && sizeFieldName && teamSize > 1 && (
                                  <div className="mb-3 sm:mb-4">
                                    <h4 className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      Team Member IDs (excluding you)
                                    </h4>
                                    {Array.from({ length: teamSize - 1 }, (_, i) => (
                                      <div key={i} className="mb-2">
                                        <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
                                          Team Member {i + 1} ID
                                        </label>
                                        {renderField({ name: `teamMemberId${i + 1}`, type: "text" })}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <button
                                  onClick={() => handleRegister(event.id, true)}
                                  className="mt-3 sm:mt-4 w-full bg-blue-600 text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-3 rounded-lg hover:bg-blue-700 text-sm sm:text-base md:text-lg cursor-pointer"
                                >
                                  Update Details
                                </button>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
              </div>
              <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 flex justify-center">
                <button
                  onClick={() => {
                    setExpandedEvent(null);
                    setShowEditFields(false);
                    setShowPaymentStep(false);
                  }}
                  className="bg-red-500 cursor-pointer text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg hover:bg-red-600 text-xs sm:text-sm md:text-base"
                >
                  Collapse
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Events;