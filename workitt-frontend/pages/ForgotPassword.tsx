/**
 * Forgot Password Page
 * Handles password reset request
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../services/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    try {
      // Use the API endpoint we just created
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email,
      });
      setMessage(
        response.data.message ||
          "If an account exists, a reset link has been sent.",
      );
      setSubmitted(true);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-lavender-tint relative overflow-hidden px-6">
        <div className="absolute inset-0 bg-geo-bold opacity-10 pointer-events-none"></div>

        <div className="max-w-md w-full bg-white border-4 border-primary p-8 lg:p-12 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-blue-100 border-4 border-blue-600 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#2563eb]">
              <span className="material-symbols-outlined text-5xl text-blue-600">
                mail
              </span>
            </div>
          </div>

          <h2 className="font-motif text-3xl font-bold mb-4 uppercase tracking-tight text-primary">
            Check Your Inbox
          </h2>
          <p className="text-slate-600 font-sans mb-8 text-lg">
            We've sent password reset instructions to <strong>{email}</strong>.
          </p>

          <Link
            to="/login"
            className="inline-block w-full py-4 bg-primary text-white font-motif text-lg uppercase tracking-wider hover:bg-brand-accent transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-lavender-tint relative overflow-hidden">
      <div className="absolute inset-0 bg-geo-bold opacity-10 pointer-events-none"></div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-24 relative z-10 py-12">
        <Link
          to="/"
          className="absolute top-8 left-6 lg:left-24 flex items-center gap-2 cursor-pointer group"
        >
          <div className="h-8 w-8 bg-primary rotate-45 transition-transform duration-500 group-hover:rotate-[225deg]"></div>
          <h1 className="font-display text-2xl tracking-tight uppercase text-primary select-none group-hover:text-brand-accent transition-colors">
            Workitt
          </h1>
        </Link>

        <div className="max-w-md w-full mx-auto mt-12 lg:mt-0">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[2px] w-12 bg-brand-accent"></div>
              <span className="font-sans font-bold uppercase tracking-widest text-sm text-brand-accent">
                Account Recovery
              </span>
            </div>
            <h2 className="font-motif text-4xl lg:text-5xl text-primary leading-none mb-4">
              FORGOT YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-gold">
                PASSWORD?
              </span>
            </h2>
            <p className="text-slate-600 font-sans text-lg">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 animate-on-scroll shadow-md">
              <p className="text-sm text-red-600 font-sans font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-bold uppercase tracking-widest text-primary"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-4 border-2 border-primary bg-white text-primary placeholder-slate-400 font-sans focus:outline-none focus:border-brand-accent transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] focus:shadow-[4px_4px_0px_0px_rgba(232,111,62,1)]"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-accent text-white font-motif text-xl uppercase tracking-wider hover:bg-primary transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                "Sending..."
              ) : (
                <>
                  Send Reset Link
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-primary/10 text-center">
            <Link
              to="/login"
              className="text-sm font-bold uppercase tracking-widest text-primary hover:text-brand-accent transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-afro-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent rounded-full blur-3xl opacity-20"></div>

        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute top-4 -right-4 w-full h-full border-4 border-white/20 z-0"></div>
            <div className="relative z-10 h-full w-full bg-surface-light overflow-hidden shadow-2xl rounded-[60px]">
              <img
                src="/forgotpw.jpg"
                alt="Laptop"
                className="object-cover h-full w-full sculptural-img opacity-90"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
