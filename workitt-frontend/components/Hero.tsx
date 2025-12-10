import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  const bgPatternRef = useRef<HTMLDivElement>(null);
  const bgShapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Foreground content moves at 1.0 (normal scroll).
      // Background pattern moves slower (0.2) to feel further away.
      if (bgPatternRef.current) {
        bgPatternRef.current.style.transform = `translateY(${scrollY * 0.25}px)`;
      }
      // Shape moves in reverse direction slightly (-0.1) or very slow to create a distinct layer.
      if (bgShapeRef.current) {
        bgShapeRef.current.style.transform = `translateY(${scrollY * -0.15}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-[95vh] w-full bg-lavender-tint text-primary overflow-hidden flex flex-col justify-center pt-24">
      {/* Background Elements */}
      <div
        ref={bgPatternRef}
        className="absolute inset-0 bg-geo-bold opacity-30 pointer-events-none will-change-transform"
      ></div>
      <div
        ref={bgShapeRef}
        className="absolute right-0 top-0 w-1/2 h-full bg-brand-accent/5 hidden lg:block pointer-events-none will-change-transform"
        style={{ clipPath: "polygon(20% 0%, 100% 0, 100% 100%, 0% 100%)" }}
      ></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 h-full flex items-center">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          {/* Text Content */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            <div className="mb-6 flex items-center gap-4 animate-on-scroll">
              <div className="h-[2px] w-12 bg-brand-accent"></div>
              <span className="font-sans font-bold uppercase tracking-widest text-sm text-brand-accent">
                Now enhanced with AI
              </span>
            </div>

            <h1 className="font-motif text-6xl sm:text-7xl lg:text-8xl leading-[0.9] text-primary mb-8 relative animate-on-scroll delay-100">
              <span className="relative z-10">YOUR DREAM</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-gold relative z-10">
                JOB AWAITS
              </span>
              <div className="absolute -left-4 top-1/2 w-32 h-32 bg-brand-gold/20 rounded-full blur-2xl -z-0"></div>
            </h1>

            <div className="flex flex-col md:flex-row gap-8 items-start mt-4 animate-on-scroll delay-200">
              <div className="md:w-3/4">
                <p className="text-xl font-medium text-slate-700 leading-relaxed font-sans">
                  Transform your career with AI-powered resumes and cover
                  letters that get noticed. Land interviews 3x faster with
                  professional documents tailored to your dream job.
                </p>
              </div>
            </div>

            <div className="mt-12 inline-block group cursor-pointer animate-on-scroll delay-300">
              <div className="bg-primary p-2 shadow-[8px_8px_0px_0px_rgba(232,111,62,1)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[12px_12px_0px_0px_rgba(232,111,62,1)]">
                <div className="flex items-center">
                  <Link to="/login">
                    <button className="bg-brand-accent text-white px-8 py-4 font-motif text-lg uppercase tracking-wider group-hover:bg-white group-hover:text-primary transition-colors h-16 w-full md:w-auto">
                      Get Started
                    </button>
                  </Link>
                  <div className="h-16 w-16 bg-brand-dark flex items-center justify-center text-white border-l border-white/10 overflow-hidden relative">
                    <span className="material-symbols-outlined transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-125">
                      north_east
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm font-bold text-slate-500 uppercase tracking-wide">
                No credit card • Free Analysis
              </p>
            </div>
          </div>

          {/* Visual Content */}
          <div className="col-span-12 lg:col-span-5 relative mt-12 lg:mt-0 animate-on-scroll delay-300">
            <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[3/4] animate-float">
              {/* Decorative Frame */}
              <div className="absolute top-4 -right-4 w-full h-full border-4 border-primary/20 z-0"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-gold z-10 rounded-full mix-blend-multiply opacity-80"></div>

              {/* Main Image Container */}
              <div
                className="relative z-0 h-full w-full bg-primary overflow-hidden shadow-2xl"
                style={{ borderRadius: "0 100px 0 100px" }}
              >
                <img
                  src="/landing.jpg"
                  alt="Career Growth"
                  className="object-cover h-full w-full sculptural-img opacity-80"
                />

                {/* Image Overlays */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary to-transparent opacity-90"></div>

                {/* Floating Stats */}
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="flex items-end gap-2 mb-2">
                    <div className="w-2 bg-brand-accent h-4 animate-pulse"></div>
                    <div
                      className="w-2 bg-brand-accent h-8 animate-pulse"
                      style={{ animationDelay: "100ms" }}
                    ></div>
                    <div
                      className="w-2 bg-brand-accent h-12 animate-pulse"
                      style={{ animationDelay: "200ms" }}
                    ></div>
                    <div
                      className="w-2 bg-brand-accent h-6 animate-pulse"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="w-2 bg-brand-accent h-10 animate-pulse"
                      style={{ animationDelay: "400ms" }}
                    ></div>
                  </div>
                  <h3 className="font-motif text-2xl uppercase leading-none mb-1">
                    Career
                    <br />
                    Growth
                  </h3>
                  <p className="font-mono text-xs text-brand-gold uppercase">
                    Guaranteed with AI optimization
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              {/* <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-accent flex items-center justify-center rounded-full shadow-2xl z-20 hover:scale-110 transition-transform cursor-pointer group">
                <span className="material-symbols-outlined text-4xl text-white group-hover:rotate-[360deg] transition-transform duration-700">
                  psychology
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-surface-light to-transparent"></div>
    </section>
  );
};

export default Hero;
