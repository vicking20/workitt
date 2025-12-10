import React from "react";
const ResumeFeatures: React.FC = () => {
    return (
        <section id="resume-builder" className="py-24 bg-white text-primary overflow-hidden border-t-2 border-primary/5">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Content */}
                    <div className="flex-1 order-2 lg:order-1 animate-on-scroll">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[2px] w-12 bg-brand-accent"></div>
                            <span className="font-sans font-bold uppercase tracking-widest text-sm text-brand-accent">
                                Resume Builder
                            </span>
                        </div>
                        <h2 className="font-motif text-4xl md:text-5xl lg:text-6xl text-primary leading-[1.1] mb-8">
                            BUILD A <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-gold">WINNING RESUME</span> <br /> IN MINUTES
                        </h2>
                        <p className="text-lg text-slate-600 mb-8 font-sans leading-relaxed">
                            Stop struggling with formatting. Our intelligent builder handles the design so you can focus on the content.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-8 mb-10">
                            {[
                                { icon: "upload_file", title: "Import from PDF", desc: "Start from an existing resume." },
                                { icon: "edit_document", title: "Create from Scratch", desc: "Guided step-by-step builder." },
                                { icon: "auto_awesome", title: "AI Optimization", desc: "Tailored content that passes ATS." },
                                { icon: "picture_as_pdf", title: "PDF Export", desc: "Download purely formatted PDFs." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-12 h-12 shrink-0 bg-lavender-tint border-2 border-primary flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
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
                    {/* Visual */}
                    <div className="flex-1 order-1 lg:order-2 relative animate-on-scroll">
                        <div className="group relative w-full aspect-square max-w-lg mx-auto bg-lavender-tint border-4 border-primary p-2 shadow-[16px_16px_0px_0px_rgba(232,111,62,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[12px_12px_0px_0px_rgba(232,111,62,1)] transition-all duration-300">
                            <div className="w-full h-full bg-white border-2 border-primary/10 overflow-hidden relative flex flex-col">
                                {/* Mock Resume UI */}
                                <div className="h-4 bg-primary/5 w-full border-b border-primary/5 flex items-center px-2 gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col gap-4 opacity-50 blur-[1px] group-hover:blur-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-4"></div>
                                    <div className="h-8 bg-slate-200 w-3/4 mx-auto"></div>
                                    <div className="h-4 bg-slate-100 w-1/2 mx-auto mb-8"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-slate-100 w-full"></div>
                                        <div className="h-4 bg-slate-100 w-full"></div>
                                        <div className="h-4 bg-slate-100 w-5/6"></div>
                                    </div>
                                </div>

                                {/* Overlay badge */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="bg-brand-accent text-white px-6 py-3 font-bold uppercase tracking-widest shadow-lg -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                                        ATS Friendly
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
export default ResumeFeatures;
