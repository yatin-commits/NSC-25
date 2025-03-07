"use client";
import React from "react";
import { BackgroundBoxesDemo } from "./BackgroundBoxesDemo";
import CountdownTimer from "./CountdownTimer";
import { HoverBorderGradient } from "./ui/HoverBorderGradient";
import { motion } from "framer-motion";

import incubations from "../assets/incubations.png";

// Background animation settings
const bgVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export function HeroSection() {
  return (
    <div className="relative flex flex-col items-center md:justify-center pt-16 md:min-h-screen overflow-hidden px-4 text-center bg-white text-gray-900">
      {/* Animated Background */}
      <motion.div
        variants={bgVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-[#f0f4f8] via-[#e6ecf3] to-[#dfe6ee] bg-[length:200%_200%]"
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 text-center w-full max-w-5xl space-y-6"
      >
        {/* Heading */}
        <h2 className="font-extrabold tracking-tight leading-tight text-5xl text-gray-900">
          Join us in celebrating
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-6xl font-bold drop-shadow-lg"
          >
            National Students' Convention 2025
          </motion.span>
        </h2>

        {/* Countdown Timer */}
        <div className="mt-6 flex justify-center">
          <CountdownTimer initialTime={186400 + 36000 + 300 + 15} />
        </div>

        {/* Register Button */}
        <div className="mt-6 flex justify-center">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="relative bg-gradient-to-r cursor-pointer rounded-md from-blue-500 via-indigo-500 to-purple-500 text-white text-xl px-8 py-3 md:px-10 md:py-4 font-semibold flex items-center space-x-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50"
          >
            <span className="relative z-10"> Explore Events 🚀</span>
          </HoverBorderGradient>
        </div>

        {/* Sponsor Logos */}
        <div className="w-full">
          <img src={incubations} alt="logo" className="w-full mx-auto" />
        </div>
      </motion.div>
    </div>
  );
}
