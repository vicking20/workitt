import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 96; // h-24 is roughly 96px
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: "Manifesto", id: "manifesto" },
    { name: "Engine", id: "engine" },
    { name: "Pricing", id: "pricing" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-lavender-tint/70 backdrop-blur-md border-b border-primary/5 transition-colors duration-300">
      <div className="flex h-16 items-center justify-between px-6 lg:px-12">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="h-8 w-8 bg-primary rotate-45 transition-transform duration-500 group-hover:rotate-[225deg]"></div>
          <h2 className="font-display text-2xl tracking-tight uppercase text-primary select-none group-hover:text-brand-accent transition-colors">
            Workitt
          </h2>
        </div>

        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={`#${item.id}`}
              onClick={(e) => handleScroll(e, item.id)}
              className="text-sm font-bold uppercase tracking-widest hover:text-brand-accent transition-colors text-primary relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <Link
          to="/signup"
          className="hidden md:flex bg-primary text-white px-8 py-3 text-sm font-bold uppercase hover:bg-brand-accent transition-colors relative overflow-hidden group items-center"
        >
          <span className="relative z-10">Join Now</span>
          <div className="absolute inset-0 h-full w-full bg-brand-accent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-primary hover:text-brand-accent transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-lavender-tint border-b border-primary/10 p-6 flex flex-col gap-6 shadow-lg animate-on-scroll visible">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={`#${item.id}`}
              className="text-lg font-bold uppercase tracking-widest hover:text-brand-accent text-primary"
              onClick={(e) => handleScroll(e, item.id)}
            >
              {item.name}
            </a>
          ))}
          <Link
            to="/signup"
            className="bg-primary text-white w-full py-4 text-sm font-bold uppercase hover:bg-brand-accent transition-colors text-center block"
          >
            Join Now
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
