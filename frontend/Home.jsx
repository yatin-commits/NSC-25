import { HeroSection } from "@/components/HeroSection";
import { ScheduleSection } from "./src/components/ScheduleSection";
import Events from "@/components/Events";
import Footer from "@/components/Footer";
import Faqs from "@/components/Faqs";
import Coordinators from "@/components/Coordinators";
import Navbarr from "@/components/NavBarr";
import { useRef, useCallback } from "react";

const HomePage = () => {
  const scheduleRef = useRef(null);
  const eventsRef = useRef(null);
  const coordinatorsRef = useRef(null);
  const faqRef = useRef(null);

  const scrollToSection = useCallback((ref) => {
    if (ref.current) {
      const top = ref.current.getBoundingClientRect().top + window.pageYOffset - 80; // Offset for navbar
      try {
        ref.current.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        // Fallback for browsers that don't support smooth scrolling
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }, []);

  return (
    <>
      <Navbarr
        scrollToSchedule={() => scrollToSection(scheduleRef)}
        scrollToEvents={() => scrollToSection(eventsRef)}
        scrollToCoordinators={() => scrollToSection(coordinatorsRef)}
        scrollToFAQ={() => scrollToSection(faqRef)}
      />
      <HeroSection scrollToEvents={() => scrollToSection(eventsRef)} />
      <div ref={scheduleRef}>
        <ScheduleSection />
      </div>
      <div ref={eventsRef}>
        <Events />
      </div>
      <div ref={coordinatorsRef}>
        <Coordinators />
      </div>
      <div ref={faqRef}>
        <Faqs />
      </div>
      <Footer />
    </>
  );
};

export default HomePage;