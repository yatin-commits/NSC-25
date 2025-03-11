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
    <div className="flex items-center justify-center gap-2 md:gap-3 text-center flex-wrap md:flex-nowrap">
      {timeSegments.map((segment, index) => (
        <React.Fragment key={segment.label}>
          <div className="lg:pt-4 lg:mt-3 flex flex-col items-center bg-white dark:bg-gray-800 rounded-md px-2 py-1.5 shadow-md 
            w-[60px] h-[60px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px]">
            <span className="text-2xl md:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              {segment.value.toString().padStart(2, "0")}
            </span>
            <span className="text-[8px] md:text-xs lg:text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {segment.label}
            </span>
          </div>
          {index < timeSegments.length - 1 && (
            <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-500 dark:text-gray-300 animate-pulse">
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CountdownTimer;
