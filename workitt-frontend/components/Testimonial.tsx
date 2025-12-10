import React from "react";

const Testimonial: React.FC = () => {
  return (
    <section className="relative py-32 bg-surface-light overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-lavender-tint/30 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold opacity-20 rounded-bl-full pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMEYxNzJBIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30 pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block animate-on-scroll">
            <span className="material-symbols-outlined text-7xl text-brand-accent mb-8 transform -rotate-12 opacity-80">
              format_quote
            </span>
          </div>

          <h3 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary mb-12 animate-on-scroll delay-100 relative z-10">
            "The resume was so much better than what I could create myself and
            now the interview mails keep{" "}
            <span className="relative inline-block px-3 py-1 mx-1 text-white">
              <span className="relative z-10">coming in</span>
              <div className="absolute inset-0 bg-brand-accent -skew-y-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transform scale-x-0 origin-left animate-on-scroll visible:scale-x-100 delay-300 transition-transform duration-700 ease-out"></div>
            </span>
            ."
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-on-scroll delay-200">
            <div className="relative group">
              <div className="absolute inset-0 bg-brand-gold rounded-full translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300"></div>
              <img
                src="https://cdn.dribbble.com/users/13546265/avatars/normal/0915ef5411e598501c14d2e151fe2b54.jpg?1724861842"
                alt="Faith Ayodeji"
                className="relative h-20 w-20 object-cover rounded-full border-2 border-primary grayscale group-hover:grayscale-0 transition-all duration-300 z-10"
              />
            </div>
            <div className="text-center md:text-left">
              <p className="font-bold text-xl uppercase tracking-wider text-primary font-display">
                Faith Ayodeji
              </p>
              <p className="font-mono text-sm text-brand-accent font-bold tracking-widest mt-1">
                UI/UX Designer
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
