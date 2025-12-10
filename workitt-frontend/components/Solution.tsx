import React from "react";

const Solution: React.FC = () => {
  return (
    <section id="engine" className="bg-primary text-white py-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        {/* Left Content */}
        <div className="p-6 lg:p-12 xl:p-24 flex flex-col justify-center relative">
          <div
            className="absolute top-0 left-0 w-32 h-full opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px",
            }}
          ></div>

          <div className="relative z-10">
            <span className="text-brand-accent font-bold tracking-widest uppercase mb-3 lg:mb-4 block font-sans text-sm lg:text-base animate-on-scroll">
              The Workitt Engine
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-7xl mb-6 lg:mb-8 animate-on-scroll delay-100">
              REWRITE
              <br />
              THE RULES.
            </h2>
            <p className="text-base lg:text-xl text-slate-300 max-w-md mb-8 lg:mb-12 font-sans leading-relaxed animate-on-scroll delay-200">
              Our AI doesn't just format; it translates your lived experience
              into high-value signals that recruiters and machines can't ignore.
            </p>

            <ul className="space-y-6 lg:space-y-8">
              <li className="flex items-center gap-4 lg:gap-6 group animate-on-scroll delay-300">
                <div className="h-10 w-10 lg:h-12 lg:w-12 bg-brand-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-black text-xl lg:text-2xl group-hover:rotate-180 transition-transform duration-500">
                    auto_awesome
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-lg lg:text-xl uppercase font-display group-hover:text-brand-gold transition-colors">
                    Custom GPT analysis tailored to you
                  </h4>
                  <p className="text-xs lg:text-sm text-slate-400 font-sans mt-1">
                    Deep semantic matching for your target role.
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-4 lg:gap-6 group animate-on-scroll delay-400">
                <div className="h-10 w-10 lg:h-12 lg:w-12 bg-surface-light flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-black text-xl lg:text-2xl group-hover:rotate-180 transition-transform duration-500">
                    key_visualizer
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-lg lg:text-xl uppercase font-display group-hover:text-brand-gold transition-colors">
                    Keyword Dominance
                  </h4>
                  <p className="text-xs lg:text-sm text-slate-400 font-sans mt-1">
                    Pass the ATS filters. Guaranteed.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative bg-brand-dark overflow-hidden flex items-center justify-center group py-16 lg:py-24 px-6 lg:px-0">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, #333 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>

          <div className="relative z-10 w-full max-w-xs lg:max-w-md transition-transform duration-700 group-hover:scale-105 animate-slide-in-right pb-12 lg:pb-16">
            <div className="bg-white p-1 pb-12 lg:pb-16 shadow-[12px_12px_0px_0px_rgba(232,111,62,1)] lg:shadow-[20px_20px_0px_0px_rgba(232,111,62,1)]">
              {/* Fake UI Header */}
              <div className="bg-slate-100 p-4 lg:p-6 border-b border-slate-200">
                <div className="flex gap-3 lg:gap-4 items-center">
                  <div className="h-10 w-10 lg:h-12 lg:w-12 bg-primary rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 lg:h-4 w-24 lg:w-32 bg-slate-300 rounded"></div>
                    <div className="h-2 lg:h-3 w-16 lg:w-20 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Fake UI Body */}
              <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
                <div className="h-3 lg:h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-3 lg:h-4 w-5/6 bg-slate-200 rounded"></div>
                <div className="h-3 lg:h-4 w-full bg-slate-200 rounded"></div>

                <div className="mt-6 lg:mt-8 flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase font-mono border border-green-200">
                    Strong Match
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase font-mono border border-blue-200">
                    Executive Tone
                  </span>
                </div>
              </div>
            </div>

            {/* Optimization Badge - adjusted position for mobile */}
            <div className="absolute -bottom-6 -right-6 lg:-bottom-10 lg:-right-10 bg-black text-white p-4 lg:p-6 shadow-xl border border-white/10 animate-pop-in delay-500 hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl lg:text-4xl text-brand-gold mb-1 lg:mb-2 animate-pulse">
                bolt
              </span>
              <p className="font-mono text-xs lg:text-sm">
                OPTIMIZATION
                <br />
                COMPLETE
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
