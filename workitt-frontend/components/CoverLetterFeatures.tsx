import React from "react";
const CoverLetterFeatures: React.FC = () => {
    return (
        <section id="cover-letter" className="py-24 bg-lavender-tint text-primary overflow-hidden border-t-2 border-primary/5">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Visual */}
                    <div className="flex-1 relative animate-on-scroll">
                        <div className="group relative w-full aspect-square max-w-lg mx-auto bg-white border-4 border-primary p-2 shadow-[16px_16px_0px_0px_rgba(232,111,62,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[12px_12px_0px_0px_rgba(232,111,62,1)] transition-all duration-300">
                            <div className="w-full h-full bg-slate-50 border-2 border-primary/10 overflow-hidden relative flex flex-col p-8">
                                {/* Mock Cover Letter UI */}
                                <div className="space-y-4 opacity-50 blur-[1px] group-hover:blur-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                                        <div className="space-y-1 text-right">
                                            <div className="h-3 bg-slate-200 w-32 ml-auto"></div>
                                            <div className="h-3 bg-slate-200 w-24 ml-auto"></div>
                                        </div>
                                    </div>
                                    <div className="h-4 bg-slate-200 w-1/3 mb-6"></div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-slate-200 w-full"></div>
                                        <div className="h-3 bg-slate-200 w-full"></div>
                                        <div className="h-3 bg-slate-200 w-full"></div>
                                        <div className="h-3 bg-slate-200 w-5/6"></div>
                                    </div>
                                    <div className="space-y-2 pt-4">
                                        <div className="h-3 bg-slate-200 w-full"></div>
                                        <div className="h-3 bg-slate-200 w-full"></div>
                                        <div className="h-3 bg-slate-200 w-4/5"></div>
                                    </div>
                                    <div className="pt-8">
                                        <div className="h-3 bg-slate-200 w-1/4"></div>
                                    </div>
                                </div>

                                {/* Overlay badge */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="bg-brand-gold text-primary px-6 py-3 font-bold uppercase tracking-widest shadow-lg rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                                        AI Powered
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 animate-on-scroll">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[2px] w-12 bg-brand-accent"></div>
                            <span className="font-sans font-bold uppercase tracking-widest text-sm text-brand-accent">
                                Cover Letter Generator
                            </span>
                        </div>
                        <h2 className="font-motif text-4xl md:text-5xl lg:text-6xl text-primary leading-[1.1] mb-8">
                            TAILORED LETTERS <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-gold">THAT CONNECT</span>
                        </h2>
                        <p className="text-lg text-slate-600 mb-8 font-sans leading-relaxed">
                            Craft compelling cover letters in seconds. Our AI analyzes your resume and the job description to create a perfect match.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-8 mb-10">
                            {[
                                { icon: "person_celebrate", title: "Smart Personas", desc: "Uses your saved resume profiles." },
                                { icon: "work", title: "Job Analysis", desc: "Tailors content to job descriptions." },
                                { icon: "style", title: "Matching Designs", desc: "Templates that match your resume." },
                                { icon: "magic_button", title: "One-Click Write", desc: "Generate full letters instantly." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-12 h-12 shrink-0 bg-white border-2 border-primary flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                                        <span className="material-symbols-outlined text-brand-accent">{item.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 uppercase font-display">{item.title}</h3>
                                        <p className="text-sm text-slate-500 font-sans">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default CoverLetterFeatures;
