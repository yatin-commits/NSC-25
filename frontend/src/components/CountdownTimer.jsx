"use client";
import React, { useState, useEffect } from "react";

const CountdownTimer = () => {
  const targetDate = new Date("2025-04-04T00:00:00Z").getTime();
  const [timeLeft, setTimeLeft] = useState(Math.max(0, Math.floor((targetDate - Date.now()) / 1000)));

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(Math.max(0, Math.floor((targetDate - Date.now()) / 1000)));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, targetDate]);

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      { label: "Days", value: days },
      { label: "Hours", value: hours },
      { label: "Minutes", value: minutes },
      { label: "Seconds", value: secs },
    ];
  };

  const timeSegments = formatTime(timeLeft);

  return (
    <div className="flex gap-4 md:gap-6 text-center">
      {timeSegments.map((segment) => (
        <div key={segment.label} className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {segment.value.toString().padStart(2, "0")}
          </span>
          <span className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            {segment.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;