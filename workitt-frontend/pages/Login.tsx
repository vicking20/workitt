/**
 * Login Page
 * Handles user authentication with email and password
 * (Neo-Brutalist)
 */

import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Check for verification status in URL
  useEffect(() => {
    const verified = searchParams.get("verified");
    const message = searchParams.get("message");
    const reset = searchParams.get("reset");

    if (verified === "success") {
      setSuccessMessage("Account verified successfully! You can now login.");
      // Clear URL parameters
      searchParams.delete("verified");
      setSearchParams(searchParams);

      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } else if (verified === "error") {
      if (message === "invalid_token") {
        setLocalError("Invalid or expired verification link.");
      } else {
        setLocalError("Verification failed. Please try again.");
      }
      // Clear URL parameters
      searchParams.delete("verified");
      searchParams.delete("message");
      setSearchParams(searchParams);
    } else if (reset === "success") {
      setSuccessMessage(
        "Password reset successfully! You can now login with your new password.",
      );
      // Clear URL parameters
      searchParams.delete("reset");
      setSearchParams(searchParams);

      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  }, [searchParams, setSearchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Validation
    if (!email || !password) {
      setLocalError("Email and password are required");
      return;
    }

    if (!email.includes("@")) {
      setLocalError("Please enter a valid email");
      return;
    }

    // Attempt login
    const success = await login(email, password);

    if (success) {
      navigate("/dashboard");
    }
    // Error will be displayed from context via displayError
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen w-full flex bg-lavender-tint relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-geo-bold opacity-10 pointer-events-none"></div>

      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-24 relative z-10 py-12">
        {/* Logo */}
        <Link
          to="/"
          className="absolute top-8 left-6 lg:left-24 flex items-center gap-2 cursor-pointer group"
        >
          <div className="h-8 w-8 bg-primary rotate-45 transition-transform duration-500 group-hover:rotate-[225deg]"></div>
          <h1 className="font-display text-2xl tracking-tight uppercase text-primary select-none group-hover:text-brand-accent transition-colors">
            Workitt
          </h1>
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[2px] w-12 bg-brand-accent"></div>
              <span className="font-sans font-bold uppercase tracking-widest text-sm text-brand-accent">
                Welcome Back
              </span>
            </div>
            <h2 className="font-motif text-5xl lg:text-6xl text-primary leading-none mb-4">
              LOGIN TO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-gold">
                CONTINUE
              </span>
            </h2>
            <p className="text-slate-600 font-sans text-lg">
              Access your AI-powered career tools.
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="relative z-20 mb-8 p-4 bg-green-50 border-l-4 border-green-600 shadow-md">
              <p className="text-sm text-green-700 font-sans font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  check_circle
                </span>
                {successMessage}
              </p>
            </div>
          )}

          {/* Error Message */}
          {displayError && (
            <div className="relative z-20 mb-8 p-4 bg-red-50 border-l-4 border-red-600 shadow-md">
              <p className="text-sm text-red-600 font-sans font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {displayError}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-bold uppercase tracking-widest text-primary"
              >
                Email Address
              </label>
              <div className="relative group">
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
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold uppercase tracking-widest text-primary"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold uppercase tracking-widest text-brand-accent hover:text-primary transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-4 border-2 border-primary bg-white text-primary placeholder-slate-400 font-sans focus:outline-none focus:border-brand-accent transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] focus:shadow-[4px_4px_0px_0px_rgba(232,111,62,1)]"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/50 hover:text-brand-accent transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-accent text-white font-motif text-xl uppercase tracking-wider hover:bg-primary transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t-2 border-primary/10 text-center">
            <p className="text-slate-600 font-sans mb-4">
              Don't have an account yet?
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-3 border-2 border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] hover:shadow-none"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Visual (Hidden on mobile) */}
      <div className="hidden lg:block w-1/2 bg-primary relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-afro-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold rounded-full blur-3xl opacity-20"></div>

        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative w-full max-w-lg aspect-[3/4]">
            {/* Frame */}
            <div className="absolute top-4 -right-4 w-full h-full border-4 border-white/20 z-0"></div>

            {/* Image */}
            <div className="relative z-10 h-full w-full bg-surface-light overflow-hidden shadow-2xl rounded-tr-[80px] rounded-bl-[80px]">
              <img
                src="/login.jpeg"
                alt="Login Visual"
                className="object-cover h-full w-full sculptural-img opacity-90"
              />

              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-primary/90 to-transparent text-white">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-brand-gold text-sm"
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-motif text-2xl leading-tight mb-2">
                  "Workitt helped me land my dream job in just 2 weeks."
                </p>
                <p className="font-mono text-sm text-brand-accent uppercase">
                  — Ayomide A., Product Designer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
