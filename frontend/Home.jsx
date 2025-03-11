import { HeroSection } from "@/components/HeroSection";
import CountdownTimer from "./src/components/CountdownTimer";
import {ScheduleSection} from "./src/components/ScheduleSection";
import Events from "@/components/Events";
import Footer from "@/components/Footer";
import Faqs from "./src/components/Faqs";
import Coordinators from "./src/components/Coordinators";
import { useRef } from "react";

const HomePage = () => {

  const eventsRef = useRef(null);

  const scrollToEvents = () => {
    if (eventsRef.current) {
      eventsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    // <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
    //   <h1 className="text-5xl font-bold mb-6">Countdown to 2026</h1>
    //   <CountdownTimer targetDate="2025-12-31T23:59:59" />
    // </div>
    <>
    <HeroSection scrollToEvents={scrollToEvents}/>
    <ScheduleSection/>
    <Events eventsRef={eventsRef}/>
    <Coordinators/>
    <Faqs/>    
    <Footer />
    
    </>
  );
};

export default HomePage;
