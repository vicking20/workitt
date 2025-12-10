import React, { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "How does the AI actually work?",
    answer:
      "Our AI analyzes thousands of successful resumes and job postings to understand what employers are looking for. It then optimizes your content, suggests improvements, and ensures your documents pass through Applicant Tracking Systems (ATS) used by most companies today.",
  },
  {
    id: 2,
    question: "Can I customize the generated documents?",
    answer:
      "Absolutely! While our AI creates a strong foundation, you have complete control over editing and customizing every aspect of your resume and cover letters. Think of it as having an expert writing partner who does the heavy lifting.",
  },
  {
    id: 3,
    question: "Is my personal data secure?",
    answer:
      "Yes, absolutely. We use enterprise-grade encryption to protect your data, and we never share your personal information with third parties. Your resumes and cover letters are stored securely and are only accessible to you.",
  },
  {
    id: 4,
    question: "Do I need design skills to use Workitt?",
    answer:
      "Not at all! Workitt handles all the formatting, design, and layout automatically. Our professional templates are optimized for readability and ATS compatibility, so you can focus on your content while we take care of making it look great.",
  },
  {
    id: 5,
    question: "What makes Workitt different from other resume builders?",
    answer:
      "Unlike traditional resume builders, Workitt uses advanced AI to understand job requirements and tailor your documents accordingly. We also offer application tracking, multiple document versions, and continuous optimization based on the latest hiring trends.",
  },
];

const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-surface-light text-primary py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-20 animate-on-scroll">
          <span className="font-sans font-bold uppercase tracking-widest text-sm text-brand-accent mb-4 block">
            Have Questions?
          </span>
          <h2 className="font-display text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-gold">
              Questions
            </span>
          </h2>
          <p className="text-lg text-slate-600 font-sans">
            Everything you need to know about Workitt and how it can help you
            land your dream job.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, idx) => (
            <div
              key={faq.id}
              className="border-2 border-primary/20 group animate-on-scroll"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-8 text-left flex items-center justify-between hover:bg-primary/5 transition-colors duration-300 group"
              >
                <h3 className="font-display text-lg md:text-xl font-bold uppercase leading-tight group-hover:text-brand-accent transition-colors duration-300">
                  {faq.question}
                </h3>
                <div className="ml-6 shrink-0">
                  <span
                    className={`material-symbols-outlined text-2xl text-brand-accent transition-transform duration-500 ${openId === faq.id ? "rotate-180" : ""}`}
                  >
                    expand_more
                  </span>
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  openId === faq.id ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-8 pb-8 pt-4 border-t border-primary/10">
                  <p className="text-slate-600 font-sans leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-20 animate-on-scroll delay-200">
          <p className="text-slate-600 mb-6 font-sans">Still have questions?</p>
          <a
            href="mailto:vfatunse@gmail.com"
            className="inline-flex items-center px-8 py-4 bg-primary border-2 border-primary text-white font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-colors duration-300 group"
          >
            <span className="material-symbols-outlined mr-3 group-hover:-rotate-45 transition-transform">
              mail
            </span>
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
