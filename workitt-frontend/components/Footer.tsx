import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 96;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display text-4xl font-bold mb-6">Workitt.</h3>
            <p className="max-w-xs text-slate-400 font-sans">
              AI-powered career advancement for the bold.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-brand-gold uppercase tracking-widest mb-6 text-sm font-sans">
              Product
            </h4>
            <ul className="space-y-4 text-sm font-medium text-slate-300 font-sans">
              <li>
                <a
                  href="#resume-builder"
                  onClick={(e) => handleScroll(e, "resume-builder")}
                  className="relative inline-block hover:text-white transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-brand-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  Resume Builder
                </a>
              </li>
              <li>
                <a
                  href="#cover-letter"
                  onClick={(e) => handleScroll(e, "cover-letter")}
                  className="relative inline-block hover:text-white transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-brand-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  Cover Letter
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleScroll(e, "pricing")}
                  className="relative inline-block hover:text-white transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-brand-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-gold uppercase tracking-widest mb-6 text-sm font-sans">
              Legal
            </h4>
            <ul className="space-y-4 text-sm font-medium text-slate-300 font-sans">
              <li>
                <Link
                  to="/privacy"
                  className="relative inline-block hover:text-white transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-brand-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="relative inline-block hover:text-white transition-colors after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-brand-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-sans">
            © 2025 Workitt Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="https://folio.zekfat.xyz">
              <div className="h-8 w-8 bg-white/10 flex items-center justify-center rounded-full hover:bg-brand-accent transition-colors cursor-pointer text-slate-300 hover:text-white group">
                <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">
                  public
                </span>
              </div>
            </a>
            <a href="mailto:vfatunse@gmail.com">
              <div className="h-8 w-8 bg-white/10 flex items-center justify-center rounded-full hover:bg-brand-accent transition-colors cursor-pointer text-slate-300 hover:text-white group">
                <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">
                  alternate_email
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
