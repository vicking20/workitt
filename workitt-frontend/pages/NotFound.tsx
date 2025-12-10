/**
 * NotFound Page (404)
 */

import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-lavender-tint relative overflow-hidden px-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-geo-bold opacity-10 pointer-events-none"></div>

      <div className="max-w-lg w-full bg-white border-4 border-primary p-8 lg:p-12 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] relative z-10 text-center">
        <div className="mb-8">
          <h1 className="font-motif text-8xl font-bold text-brand-accent mb-2">
            404
          </h1>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-primary">
            Page Not Found
          </h2>
        </div>

        <p className="text-slate-600 font-sans mb-8 text-lg">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <Link
          to="/"
          className="inline-block w-full py-4 bg-primary text-white font-motif text-lg uppercase tracking-wider hover:bg-brand-accent transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
