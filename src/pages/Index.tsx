import { useRef } from "react";
import Hero from "@/components/Hero";
import WaitlistForm from "@/components/WaitlistForm";
import Benefits from "@/components/Benefits";
import Footer from "@/components/Footer";

const Index = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Hero onCTA={scrollToForm} />
      <div ref={formRef}>
        <WaitlistForm />
      </div>
      <Benefits />
      <Footer />
    </div>
  );
};

export default Index;
