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
    <div className="w-full flex  flex-col items-center md: pt-16 md:full overflow-hidden px-4 text-center bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-900">
      {/* Animated Background */}
      <motion.div
        variants={bgVariants}
        initial="initial"
        animate="animate"
        className="absolute  inset-0 -z-10  bg-gradient-to-br from-[#f0f4f8] via-[#e6ecf3] to-[#dfe6ee] bg-[length:200%_200%]"
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="  text-center w-screen  space-y-6"
      >
        {/* Heading */}
        <h2 className="font-extrabold tracking-tight leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 text-center">
  Join us in celebrating
  <br />
  <motion.span
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
    className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 
               text-2xl sm:text-4xl md:text-6xl lg:text-6xl font-extrabold drop-shadow-xl"
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
    className="relative bg-gradient-to-r cursor-pointer rounded-xl from-blue-500 via-indigo-500 to-purple-500 
               text-white text-lg sm:text-xl px-6 p-2 sm:px-8 sm:py-4 md:px-10 md:py-5 font-semibold 
               flex items-center space-x-3 shadow-lg transition-all duration-300 
               hover:scale-105 hover:shadow-indigo-500/50 focus:ring-4 focus:ring-indigo-300 focus:outline-none"
  >
    <span className="relative z-10">Explore Events 🚀</span>
  </HoverBorderGradient>
</div>


        {/* Sponsor Logos */}
        <div className="w-full">
          <img src={incubations} alt="logo" className="w-[75%] object-contain mx-auto" />
        </div>
      </motion.div>
    </div>
  );
}
