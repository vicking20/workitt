import React from "react";

const Pricing: React.FC = () => {
  return (
    <section
      id="pricing"
      className="bg-surface-light text-primary py-24 lg:py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-20 animate-on-scroll">
          <span className="font-sans font-bold uppercase tracking-widest text-sm text-brand-accent mb-4 block">
            Simple Pricing
          </span>
          <h2 className="font-display text-5xl lg:text-6xl font-bold leading-tight mb-6">
            START FREE AND
            <br />
            UPGRADE WHEN READY.
          </h2>
          <p className="text-lg text-slate-600 font-sans">
            No hidden fees, no surprises. Choose the plan that fits your career
            goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
          {/* Tier 1 - Free */}
          <div className="bg-white border-2 border-primary/10 p-8 hover:border-primary transition-colors duration-300 relative group animate-on-scroll delay-100">
            <div className="mb-4">
              <span className="font-display text-2xl uppercase">
                Free Trial
              </span>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold font-sans">€0</span>
              <span className="text-slate-500 text-sm ml-2">first 5 days</span>
            </div>
            <p className="text-slate-600 text-sm mb-8 font-sans">
              Perfect for getting started with your job search
            </p>
            <ul className="space-y-4 mb-8 text-sm font-sans text-slate-600">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-accent text-lg">
                  check
                </span>
                AI-powered resume creation
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-accent text-lg">
                  check
                </span>
                Custom cover letters
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-accent text-lg">
                  check
                </span>
                Document storage & management
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-accent text-lg">
                  check
                </span>
                Basic application tracking
              </li>
            </ul>
            <button className="w-full py-4 border-2 border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors text-sm">
              Start Free Trial
            </button>
          </div>

          {/* Tier 2 - Premium - Featured */}
          <div className="bg-primary text-white p-1 relative shadow-[16px_16px_0px_0px_rgba(232,111,62,1)] transform hover:-translate-y-2 transition-transform duration-300 animate-on-scroll">
            <div className="absolute top-0 right-0 bg-brand-accent text-white text-xs font-bold uppercase px-3 py-1 font-mono">
              Most Popular
            </div>
            <div className="border border-white/20 p-8 h-full">
              <div className="mb-4">
                <span className="font-display text-2xl uppercase text-brand-gold">
                  Premium
                </span>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold font-sans">2€</span>
                <span className="text-blue-100 text-sm ml-2">/ month</span>
              </div>
              <p className="text-blue-100 mb-8 text-sm font-sans">
                Unlock advanced features and priority support
              </p>
              <ul className="space-y-4 mb-8 text-sm font-sans text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-yellow-400 text-lg">
                    check
                  </span>
                  Everything in Free
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-yellow-400 text-lg">
                    check
                  </span>
                  Unlimited AI enhancements
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-yellow-400 text-lg">
                    check
                  </span>
                  Priority support
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-yellow-400 text-lg">
                    check
                  </span>
                  Advanced analytics
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-yellow-400 text-lg">
                    check
                  </span>
                  Early access to new features
                </li>
              </ul>
              <button className="w-full py-4 bg-white text-primary font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors text-sm">
                Get Premium (Coming Soon)
              </button>
            </div>
          </div>

          {/* Tier 3 - Enterprise */}
          <div className="bg-white border-2 border-primary p-8 hover:border-brand-accent transition-colors duration-300 relative group animate-on-scroll delay-200">
            <div className="mb-4">
              <span className="font-display text-2xl uppercase text-brand-accent">
                Enterprise
              </span>
            </div>
            <div className="mb-8">
              <span className="text-2xl font-bold font-sans text-primary">Contact Us</span>
            </div>
            <p className="text-slate-600 text-sm mb-8 font-sans font-semibold">
              Optimized for talent agencies, schools, and bootcamps
            </p>
            <ul className="space-y-4 mb-8 text-sm font-sans text-slate-600">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-accent text-lg">
                  check
                </span>
                Everything in Premium
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-accent text-lg">
                  check
                </span>
                Bulk user management & licensing
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-accent text-lg">
                  check
                </span>
                White-label options available
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-accent text-lg">
                  check
                </span>
                Dedicated account manager
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-accent text-lg">
                  check
                </span>
                Custom integrations & API access
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-accent text-lg">
                  check
                </span>
                Student/candidate progress tracking
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand-accent text-lg">
                  check
                </span>
                SLA & priority support 24/7
              </li>
            </ul>
            <a href="mailto:vfatunse@gmail.com">
              <button className="w-full py-4 bg-brand-accent text-white font-bold uppercase tracking-widest hover:bg-primary transition-colors text-sm">
                Contact Sales
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
