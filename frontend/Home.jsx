import { HeroSection } from "@/components/HeroSection";
import { ScheduleSection } from "./src/components/ScheduleSection";
import Events from "@/components/Events";
import Footer from "@/components/Footer";
import Faqs from "@/components/Faqs";
// import Coordinators from "@/components/Coordinators";
import Navbarr from "@/components/NavBarr";
import { useRef, useCallback, useState } from "react";

const HomePage = () => {
  const scheduleRef = useRef(null);
  const eventsRef = useRef(null);
  const coordinatorsRef = useRef(null);
  const faqRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = useCallback((ref) => {
    if (ref.current) {
      setMenuOpen(false);
      setTimeout(() => {
        const top = ref.current.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }, 300);
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
      <div ref={scheduleRef} id="schedule">
        <ScheduleSection />
      </div>
      <div ref={eventsRef} id="events">
        <Events />
      </div>
      {/* <div ref={coordinatorsRef} id="coordinators">
        <Coordinators />
      </div> */}
      <div ref={faqRef} id="faqs">
        <Faqs />
      </div>
      <Footer />
    </>
  );
};

export default HomePage;