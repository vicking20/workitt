import React from "react";

const features = [
  {
    id: 1,
    title: "AI-Powered Intelligence",
    description:
      "Advanced algorithms analyze job descriptions and optimize your resume content for maximum impact and ATS compatibility.",
    icon: "auto_awesome",
    color: "text-blue-400",
  },
  {
    id: 2,
    title: "Smart Document Manager",
    description:
      "Organize multiple versions of your resume and cover letters with cloud storage and easy access from any device.",
    icon: "storage",
    color: "text-green-400",
  },
  {
    id: 3,
    title: "Lightning Fast",
    description:
      "Generate professional resumes and cover letters in seconds, not hours. Apply to more jobs, faster.",
    icon: "flash_on",
    color: "text-yellow-400",
  },
  {
    id: 4,
    title: "Secure & Private",
    description:
      "Your personal information is protected with enterprise-grade encryption and security.",
    icon: "verified_user",
    color: "text-red-400",
  },
  {
    id: 5,
    title: "Application Tracker",
    description:
      "Keep track of all your job applications in one place with status updates and follow-up reminders.",
    icon: "analytics",
    color: "text-purple-400",
  },
  {
    id: 6,
    title: "Industry Templates",
    description:
      "Choose from professionally designed templates optimized for different industries and career levels.",
    icon: "library_books",
    color: "text-cyan-400",
  },
];

const Features: React.FC = () => {
  return (
    <section className="bg-black text-white py-24 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-on-scroll">
          <span className="font-sans font-bold uppercase tracking-widest text-sm text-brand-accent mb-4 block">
            Everything You Need
          </span>
          <h2 className="font-display text-5xl lg:text-6xl font-bold leading-tight mb-6">
            TOOLS TO{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-gold">
              SUCCEED
            </span>
          </h2>
          <p className="text-lg text-slate-400 font-sans">
            Our AI-powered platform provides all the tools you need to create
            standout applications that get results.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-white/20">
          {features.map((feature, idx) => (
            <div
              key={feature.id}
              className={`border-r border-b border-white/20 p-8 md:p-12 transition-all duration-300 group hover:bg-white/5 animate-on-scroll`}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {/* Icon */}
              <div className="mb-8">
                <div className="inline-block p-4 bg-white/10 group-hover:bg-brand-accent/20 transition-colors duration-300 rounded-xl">
                  <span
                    className={`material-symbols-outlined text-4xl ${feature.color} group-hover:scale-125 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-display text-2xl font-bold mb-4 uppercase group-hover:text-brand-gold transition-colors duration-300">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 font-sans leading-relaxed text-sm group-hover:text-slate-300 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Accent Line */}
              <div className="mt-6 h-1 w-0 bg-gradient-to-r from-brand-accent to-brand-gold group-hover:w-12 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
