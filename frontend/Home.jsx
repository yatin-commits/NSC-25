import { HeroSection } from "@/components/HeroSection";
import { ScheduleSection } from "./src/components/ScheduleSection";
import Events from "@/components/Events";
import Footer from "@/components/Footer";
import Faqs from "@/components/Faqs";
import Coordinators from "@/components/Coordinators";
import Navbarr from "@/components/NavBarr";
import { useRef, useCallback, useState } from "react";

const HomePage = () => {
  const scheduleRef = useRef(null);
  const eventsRef = useRef(null);
  const coordinatorsRef = useRef(null);
  const faqRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false); // Track mobile menu state

  const scrollToSection = useCallback((ref) => {
    if (ref.current) {
      // Close mobile menu first
      setMenuOpen(false);

      setTimeout(() => {
        const top = ref.current.getBoundingClientRect().top + window.pageYOffset - 80; // Offset for navbar
        window.scrollTo({ top, behavior: "smooth" });
      }, 300); // Wait for menu to close before scrolling
    }
  }, []);

  return (
    <>
      <Navbarr
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
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
