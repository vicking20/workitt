/**
 * Signup Page
 * Handles user registration with validation
 */

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [signupSuccess, setSignupSuccess] = useState(false);

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
  }, [username, email, password, confirmPassword]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Username validation
    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!email.includes("@")) {
      errors.email = "Please enter a valid email";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.password =
        "Password must contain at least one special character (!@#$%^&*)";
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Attempt signup
    const success = await signup(username, email, password, confirmPassword);

    if (success) {
      setSignupSuccess(true);
      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-lavender-tint relative overflow-hidden px-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-geo-bold opacity-10 pointer-events-none"></div>

        <div className="max-w-md w-full bg-white border-4 border-primary p-8 lg:p-12 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] relative z-10 text-center">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-green-100 border-4 border-green-600 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#16a34a]">
              <span className="material-symbols-outlined text-5xl text-green-600">
                check_circle
              </span>
            </div>
          </div>

          {/* Success Message */}
          <h2 className="font-motif text-4xl font-bold mb-4 uppercase tracking-tight text-primary">
            Account Created!
          </h2>
          <p className="text-slate-600 font-sans mb-8 text-lg">
            We've sent a verification link to your email. Please check your
            inbox to verify your account.
          </p>

          {/* Email Display */}
          <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-600 text-left">
            <p className="text-sm text-slate-700 font-sans">
              <span className="font-bold">Verification email sent to:</span>
              <br />
              {email}
            </p>
          </div>

          {/* Back to Login Link */}
          <Link
            to="/login"
            className="inline-block w-full py-4 bg-primary text-white font-motif text-lg uppercase tracking-wider hover:bg-brand-accent transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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

        <div className="max-w-md w-full mx-auto mt-12 lg:mt-0">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[2px] w-12 bg-brand-accent"></div>
              <span className="font-sans font-bold uppercase tracking-widest text-sm text-brand-accent">
                Start Your Journey
              </span>
            </div>
            <h2 className="font-motif text-5xl lg:text-6xl text-primary leading-none mb-4">
              CREATE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-gold">
                ACCOUNT
              </span>
            </h2>
            <p className="text-slate-600 font-sans text-lg">
              Join thousands of professionals advancing their careers.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-white border-l-4 border-red-600 shadow-md border-2 border-red-200">
              <p className="text-sm text-red-700 font-sans font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="block text-sm font-bold uppercase tracking-widest text-primary"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className={`w-full px-4 py-3 border-2 bg-white text-primary placeholder-slate-400 font-sans focus:outline-none transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] focus:shadow-[4px_4px_0px_0px_rgba(232,111,62,1)] ${
                  validationErrors.username
                    ? "border-red-600 focus:border-red-600"
                    : "border-primary focus:border-brand-accent"
                }`}
                disabled={isLoading}
              />
              {validationErrors.username && (
                <p className="text-xs text-red-600 font-bold mt-1">
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
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
                className={`w-full px-4 py-3 border-2 bg-white text-primary placeholder-slate-400 font-sans focus:outline-none transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] focus:shadow-[4px_4px_0px_0px_rgba(232,111,62,1)] ${
                  validationErrors.email
                    ? "border-red-600 focus:border-red-600"
                    : "border-primary focus:border-brand-accent"
                }`}
                disabled={isLoading}
              />
              {validationErrors.email && (
                <p className="text-xs text-red-600 font-bold mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-bold uppercase tracking-widest text-primary"
              >
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={`w-full px-4 py-3 border-2 bg-white text-primary placeholder-slate-400 font-sans focus:outline-none transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] focus:shadow-[4px_4px_0px_0px_rgba(232,111,62,1)] ${
                    validationErrors.password
                      ? "border-red-600 focus:border-red-600"
                      : "border-primary focus:border-brand-accent"
                  }`}
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
              {validationErrors.password && (
                <p className="text-xs text-red-600 font-bold mt-1">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-bold uppercase tracking-widest text-primary"
              >
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 border-2 bg-white text-primary placeholder-slate-400 font-sans focus:outline-none transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] focus:shadow-[4px_4px_0px_0px_rgba(232,111,62,1)] ${
                    validationErrors.confirmPassword
                      ? "border-red-600 focus:border-red-600"
                      : "border-primary focus:border-brand-accent"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/50 hover:text-brand-accent transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-xs text-red-600 font-bold mt-1">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-accent text-white font-motif text-xl uppercase tracking-wider hover:bg-primary transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-4"
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t-2 border-primary/10 text-center">
            <p className="text-slate-600 font-sans mb-4">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="inline-block px-8 py-3 border-2 border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] hover:shadow-none"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Visual (Hidden on mobile) */}
      <div className="hidden lg:block w-1/2 bg-primary relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-afro-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent rounded-full blur-3xl opacity-20"></div>

        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative w-full max-w-lg aspect-[3/4]">
            {/* Frame */}
            <div className="absolute top-4 -right-4 w-full h-full border-4 border-white/20 z-0"></div>

            {/* Image */}
            <div className="relative z-10 h-full w-full bg-surface-light overflow-hidden shadow-2xl rounded-tl-[80px] rounded-br-[80px]">
              <img
                src="/signup.jpeg"
                alt="Signup Visual"
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
                  "The AI resume builder transformed my job search completely."
                </p>
                <p className="font-mono text-sm text-brand-accent uppercase">
                  — Temiye A., Software Engineer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
