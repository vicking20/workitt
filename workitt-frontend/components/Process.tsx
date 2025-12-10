import React from "react";

const steps = [
  {
    id: "01",
    title: "Upload Your Info",
    desc: "Share your work experience, skills, and career goals. Upload your old resume or start from scratch - our AI adapts to your needs.",
    icon: "upload_file",
    color: "text-brand-gold",
    delay: "",
  },
  {
    id: "02",
    title: "AI Magic Happens",
    desc: "Our advanced AI analyzes job postings, optimizes your content, and creates tailored resumes and cover letters that pass ATS systems.",
    icon: "psychology",
    color: "text-brand-accent",
    bg: "bg-primary",
    delay: "delay-200",
  },
  {
    id: "03",
    title: "Land Your Dream Job",
    desc: "Download professional documents, track your applications, and watch the interview invitations roll in. Success guaranteed!",
    icon: "download_done",
    color: "text-green-400",
    delay: "delay-400",
  },
];

const Process: React.FC = () => {
  return (
    <section className="bg-black text-white py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-white/20">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className={`border-r border-b border-white/20 p-8 md:p-12 transition-all duration-300 group relative overflow-hidden ${step.bg ? step.bg : "hover:bg-white/5"} ${idx > 0 && !step.bg ? "md:mt-0" : ""} animate-on-scroll ${step.delay} hover:-translate-y-3 hover:shadow-2xl hover:z-10`}
              style={{
                marginTop:
                  idx > 0 && window.innerWidth >= 768 ? `${idx * 48}px` : "0",
              }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity select-none duration-500">
                <span className="text-6xl font-display font-black text-transparent text-stroke">
                  {step.id}
                </span>
              </div>

              <div className="mb-8 transform transition-transform duration-300">
                <span
                  className={`material-symbols-outlined text-5xl ${step.color} group-hover:scale-125 transition-transform duration-300 inline-block`}
                >
                  {step.icon}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold mb-4 uppercase group-hover:text-brand-gold transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-400 font-sans leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
