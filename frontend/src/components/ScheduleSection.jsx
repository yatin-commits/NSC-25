"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {events} from './data.js'
export function ScheduleSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const carouselRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (carouselRef.current) {
      setIsScrollable(carouselRef.current.scrollWidth > carouselRef.current.clientWidth);
    }
  }, [filteredEvents]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -carouselRef.current.clientWidth / 2, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.clientWidth / 2, behavior: "smooth" });
    }
  };

  return (
    <div className="py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-100 relative overflow-hidden">
      <motion.h1 className="mt-3 text-center text-3xl md:text-5xl font-bold mb-8">
        Event Schedule
      </motion.h1>

      

      <div className="relative  w-screen mx-auto">
        {filteredEvents.length > 0 ? (
          <>
            {isScrollable && (
              <motion.button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2  p-2 rounded-full z-10 hidden md:block"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </motion.button>
            )}

            <div
              ref={carouselRef}
              className="flex overflow-x-auto space-x-4 pb-4 md:gap-6 scrollbar-hide snap-x scroll-smooth"
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 bg-white w-64 md:w-80 p-5 rounded-lg shadow-lg snap-start"
                >
                  <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
                  <span className="text-sm bg-indigo-600 text-white px-2 py-1 rounded-full">{event.time}</span>
                  <ul className="mt-3">
                    {event.heads.map((head, i) => (
                      <li key={i} className="text-sm mt-1">
                        {head.name} - <a href={`tel:${head.mobile}`}>{head.mobile}</a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="-mb-5">
              {isScrollable && (
                <motion.button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2  p-2 rounded-full z-10 hidden md:block"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </motion.button>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400">No events found.</p>
        )}
      </div>
    </div>
  );
}
