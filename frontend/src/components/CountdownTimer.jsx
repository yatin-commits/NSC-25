import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Function to format time into DD:HH:MM:SS
const formatTime = (time) => {
  const days = Math.floor(time / (60 * 60 * 24));
  const hours = Math.floor((time % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = time % 60;

  return {
    days: days.toString().padStart(2, "0"),
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };
};

const CountdownTimer = ({ initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  useEffect(() => {
    let interval = null;

    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <div className="flex flex-col mt-4 items-center justify-center p-4 text-gray-900 border border-gray-300 rounded-lg bg-white shadow-md space-y-4 w-full max-w-md mx-auto">
      <div className="text-3xl md:text-4xl lg:text-5xl font-semibold flex space-x-2">
        <motion.div
          key={days}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-12 md:w-16 text-center bg-gray-200 p-2 rounded"
        >
          {days}
        </motion.div>
        <span>:</span>
        <motion.div
          key={hours}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-12 md:w-16 text-center bg-gray-200 p-2 rounded"
        >
          {hours}
        </motion.div>
        <span>:</span>
        <motion.div
          key={minutes}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-12 md:w-16 text-center bg-gray-200 p-2 rounded"
        >
          {minutes}
        </motion.div>
        <span>:</span>
        <motion.div
          key={seconds}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-12 md:w-16 text-center bg-gray-200 p-2 rounded"
        >
          {seconds}
        </motion.div>
      </div>
    </div>
  );
};

export default CountdownTimer;
