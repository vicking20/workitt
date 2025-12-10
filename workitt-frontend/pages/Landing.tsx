/**
 * Landing Page
 * Main Page
 */

import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Problem from "../components/Problem";
import Solution from "../components/Solution";
import Features from "../components/Features";
import Testimonial from "../components/Testimonial";
import Process from "../components/Process";
import Marquee from "../components/Marquee";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import ResumeFeatures from "@/components/ResumeFeatures";
import CoverLetterFeatures from "@/components/CoverLetterFeatures";

const Landing: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Uncomment below to run animation only once
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    const elements = document.querySelectorAll(
      ".animate-on-scroll, .animate-stamp, .animate-slide-in-right, .animate-pop-in",
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full flex-col min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <ResumeFeatures />
        <CoverLetterFeatures />
        <Features />
        <Testimonial />
        <Process />
        <Marquee />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Landing;
