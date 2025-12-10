import React from 'react';

const Problem: React.FC = () => {
  return (
    <section id="manifesto" className="bg-surface-light text-primary py-16 lg:py-24 xl:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Pattern column */}
          <div className="hidden lg:block lg:col-span-2 h-full">
            <div
              className="w-full h-96 bg-repeat-y opacity-40 animate-on-scroll"
              style={{
                backgroundImage: 'radial-gradient(#0F172A 2px, transparent 2px)',
                backgroundSize: '20px 20px'
              }}
            ></div>
          </div>

          {/* Text Content */}
          <div className="col-span-12 lg:col-span-5 relative">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 lg:mb-6 animate-on-scroll">
              THE SYSTEM<br />IS <span className="bg-primary text-white px-2 inline-block transform -skew-x-6">RIGGED.</span>
            </h2>
            <p className="text-base lg:text-lg font-medium text-slate-600 mb-6 lg:mb-8 font-sans leading-relaxed animate-on-scroll delay-100">
              Generic templates. Black-box ATS filters. It's a game designed for you to lose. Your skills are invisible if they aren't translated into the language of algorithms.
            </p>
            <div className="h-2 w-24 bg-brand-accent animate-on-scroll delay-200"></div>
          </div>

          {/* Visual Content */}
          <div className="col-span-12 lg:col-span-5">
            <div className="relative pl-4 pt-4 lg:pl-8 lg:pt-8">
              <div className="absolute top-0 left-0 w-16 h-16 lg:w-24 lg:h-24 bg-brand-gold z-0 animate-pop-in"></div>
              <div className="relative z-10 bg-white p-0 shadow-2xl border-2 border-primary group animate-on-scroll delay-200">
                {/* Using a placeholder SVG or image for rejected resume */}
                <div className="w-full aspect-[3/4] bg-slate-100 flex items-center justify-center overflow-hidden relative">
                  <img
                    src="https://picsum.photos/id/1/600/800"
                    alt="Generic Resume trash"
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-red-500/20 mix-blend-multiply opacity-0 animate-stamp delay-300" style={{ animationFillMode: 'forwards' }}></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-3 py-1.5 lg:px-4 lg:py-2 font-mono text-xs lg:text-sm uppercase border-2 border-red-500 text-red-500 font-bold tracking-widest animate-stamp delay-300">
                    Rejected
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Problem;