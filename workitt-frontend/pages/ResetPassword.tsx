/**
 * Reset Password Page
 * Allows users to set a new password using a reset token
 */

import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../services/api";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Password must contain at least one special character");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
        token,
        password,
        confirmPassword,
      });

      if (response.data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login?reset=success");
        }, 3000);
      } else {
        setError(response.data.error || "Failed to reset password");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
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
            Password Reset!
          </h2>
          <p className="text-slate-600 font-sans mb-8 text-lg">
            Your password has been successfully reset. Redirecting you to
            login...
          </p>

          {/* Manual Link */}
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

      {/* Center Column - Form */}
      <div className="w-full flex flex-col justify-center px-6 lg:px-24 relative z-10 py-12">
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
                Secure Reset
              </span>
            </div>
            <h2 className="font-motif text-5xl lg:text-6xl text-primary leading-none mb-4">
              CREATE NEW <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-gold">
                PASSWORD
              </span>
            </h2>
            <p className="text-slate-600 font-sans text-lg">
              Enter your new password below.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="relative z-20 mb-8 p-4 bg-white border-l-4 border-red-600 shadow-md border-2 border-red-200">
              <p className="text-sm text-red-700 font-sans font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-bold uppercase tracking-widest text-primary"
              >
                New Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
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
                  className="w-full px-4 py-4 border-2 border-primary bg-white text-primary placeholder-slate-400 font-sans focus:outline-none focus:border-brand-accent transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] focus:shadow-[4px_4px_0px_0px_rgba(232,111,62,1)]"
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
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
              <p className="text-xs font-bold text-blue-900 mb-2 uppercase tracking-wide">
                Password Requirements:
              </p>
              <ul className="text-xs text-blue-800 space-y-1 font-sans">
                <li>• At least 8 characters</li>
                <li>• One uppercase letter</li>
                <li>• One lowercase letter</li>
                <li>• One number</li>
                <li>• One special character (!@#$%^&*)</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-accent text-white font-motif text-xl uppercase tracking-wider hover:bg-primary transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                "Resetting Password..."
              ) : (
                <>
                  Reset Password
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
              Remember your password?
            </p>
            <Link
              to="/login"
              className="inline-block px-8 py-3 border-2 border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] hover:shadow-none"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
