import React from 'react';

const Marquee: React.FC = () => {
  const companies = [
    "Acme Corp", "GlobalTech", "Nebula Industries", "FoxRun", "Circle",
    "Acme Corp", "GlobalTech", "Nebula Industries", "FoxRun", "Circle"
  ];

  return (
    <section className="py-16 bg-lavender-tint">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="font-display font-black text-4xl md:text-5xl text-primary uppercase tracking-tight">
          Our users have been hired at
        </h2>
      </div>

      {/* Company Marquee */}
      <div className="bg-brand-accent py-6 overflow-hidden whitespace-nowrap border-y-4 border-black">
        <div className="inline-block animate-marquee">
          {companies.map((company, index) => (
            <React.Fragment key={index}>
              <span className="mx-8 font-display font-bold text-2xl text-black uppercase">{company}</span>
              <span className="mx-8 font-display font-bold text-2xl text-black uppercase opacity-50">•</span>
            </React.Fragment>
          ))}
          {/* Duplicate for seamless loop */}
          {companies.map((company, index) => (
            <React.Fragment key={`dup-${index}`}>
              <span className="mx-8 font-display font-bold text-2xl text-black uppercase">{company}</span>
              <span className="mx-8 font-display font-bold text-2xl text-black uppercase opacity-50">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marquee;