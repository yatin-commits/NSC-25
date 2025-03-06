"use client";
import React from "react";
import { BackgroundBoxesDemo } from "./BackgroundBoxesDemo"; // Background effect
import CountdownTimer from "./CountdownTimer";
import { HoverBorderGradient } from "./ui/HoverBorderGradient";
import { motion } from "framer-motion";
import bvicamlogo from "../assets/bvicamLogo.png";
import incubations from "../assets/incubations.png";

// Sponsor logos
const sponsorLogos = [
  "./src/assets/bvicamLogo.png",
  "./src/assets/bvicamLogo.png",
  "./src/assets/bvicamLogo.png",
  "./src/assets/bvicamLogo.png",
  "./src/assets/bvicamLogo.png",
  "./src/assets/bvicamLogo.png",
];

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

// Particle animation settings
const floatingParticles = [...Array(15)].map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 5 + 3,
  delay: Math.random() * 5,
}));

export function HeroSection() {
  return (
    <div className="relative flex flex-col items-center md:justify-center pt-16 md:min-h-screen overflow-hidden px-4 text-center">
      {/* Animated Gradient Background */}
      <motion.div
        variants={bgVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0a0f1a] via-[#0044cc] to-[#050d24] bg-[length:200%_200%]"
      />

      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md -z-10"></div>

      {/* Floating Particles */}
      {floatingParticles.map((particle, index) => (
        <motion.div
          key={index}
          initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0 }}
          animate={{
            y: [`${particle.y}%`, `${particle.y + 5}%`, `${particle.y}%`],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-cyan-400 blur-md"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
        />
      ))}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 text-center w-full max-w-5xl space-y-6"
      >
        {/* Heading */}
        <h2 className="text-white font-extrabold tracking-tight leading-tight text-5xl">
          Join us in celebrating
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00E6E6] via-[#00B3FF] to-[#0099FF] text-6xl font-bold drop-shadow-lg"
          >
            National Students' Convention
          </motion.span>
        </h2>

        {/* Countdown Timer */}
        <div className="mt-6 flex justify-center">
          <CountdownTimer initialTime={86400 + 3600 + 300 + 15} />
        </div>

        {/* Register Button */}
        <div className="mt-6 flex justify-center">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="relative bg-gradient-to-r cursor-pointer rounded-md from-[#00E6E6] via-[#00B3FF] to-[#0099FF] text-white text-xl px-8 py-3 md:px-10 md:py-4 font-semibold flex items-center space-x-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50"
          >
            <span className="relative z-10"> Explore Events 🚀</span>

            {/* Subtle Animated Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00E6E6] via-[#00B3FF] to-[#0099FF] opacity-40 blur-lg rounded-full transition-opacity duration-300 group-hover:opacity-70"></div>
          </HoverBorderGradient>
        </div>

        {/* Sponsor Logos */}
        {/* <div className="mt-8 flex flex-wrap justify-center w-full max-w-6xl gap-6 opacity-90 px-4">
          {sponsorLogos.map((logo, index) => (
            <motion.img
              key={index}
              src={logo}
              alt="Sponsor Logo"
              className="w-24 sm:w-32 md:w-40 lg:w-48 transition-transform duration-300 hover:scale-110 brightness-110 hover:brightness-125"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            />
          ))}
        </div> */}
        <div>
          <img src={incubations} alt="logo" />

        </div>
      </motion.div>
    </div>
  );
}
