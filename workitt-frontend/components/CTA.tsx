import React from "react";
import { Link } from "react-router-dom";

const CTA: React.FC = () => {
  return (
    <section className="bg-white py-0">
      <div className="flex flex-col lg:flex-row h-auto lg:h-[600px]">
        {/* Left: Text */}
        <div className="flex-1 bg-surface-light p-12 lg:p-24 flex flex-col justify-center border-r border-primary">
          <h2 className="font-display text-6xl lg:text-8xl font-black text-primary leading-none mb-8 animate-on-scroll">
            READY
            <br />
            TO
            <br />
            RISE?
          </h2>
        </div>

        {/* Right: Action */}
        <div className="flex-1 bg-primary p-12 lg:p-24 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute inset-0 zigzag-pattern opacity-10 pointer-events-none transition-opacity duration-700 group-hover:opacity-20"></div>

          <p className="text-2xl text-white mb-10 relative z-10 max-w-sm font-sans leading-relaxed animate-on-scroll delay-100">
            Join 1,000+ professionals who stopped waiting and started taking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 items-start sm:items-center animate-on-scroll delay-200">
            <Link
              to="/signup"
              className="h-16 px-10 bg-brand-accent text-white font-display text-lg font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-none duration-200 flex items-center"
            >
              Start Free !
            </Link>
            <p className="text-sm text-slate-400 mt-4 sm:mt-0 flex items-center font-sans">
              No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
