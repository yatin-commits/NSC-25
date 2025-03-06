import { HeroSection } from "@/components/HeroSection";
import CountdownTimer from "./src/components/CountdownTimer";
import {ScheduleSection} from "./src/components/ScheduleSection";

const HomePage = () => {
  return (
    // <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
    //   <h1 className="text-5xl font-bold mb-6">Countdown to 2026</h1>
    //   <CountdownTimer targetDate="2025-12-31T23:59:59" />
    // </div>
    <>
    <HeroSection/>
    <ScheduleSection/>
    
    </>
  );
};

export default HomePage;
