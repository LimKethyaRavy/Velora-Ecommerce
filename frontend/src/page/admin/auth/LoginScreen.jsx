
import { useState } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import AuthScreenLayout from "../../../layouts/AuthScreenLayout";

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("Login UI is ready! Laravel authentication comes next.");
  };

  return (
    <AuthScreenLayout>
      <div className="w-full">

        {/* Brand */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl tracking-[0.08em] text-[#171717]">
            VELORA
          </h1>

          <p className="mt-2 text-sm font-medium tracking-[0.25em] text-gray-700">
            Atelier Admin
          </p>
        </div>

        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-[#191919]">
            Welcome Back
          </h2>

          <p className="mt-2 text-base text-gray-500">
            Sign in to your admin account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <Mail
              size={21}
              strokeWidth={1.8}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-800"
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[62px] w-full rounded-xl border border-[#dedbd7] bg-transparent pl-16 pr-5 text-base text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <LockKeyhole
              size={21}
              strokeWidth={1.8}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-800"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-[62px] w-full rounded-xl border border-[#dedbd7] bg-transparent pl-16 pr-14 text-base text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-black focus:ring-1 focus:ring-black"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-800 transition hover:text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={21} strokeWidth={1.8} />
              ) : (
                <Eye size={21} strokeWidth={1.8} />
              )}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between gap-3">

            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-800">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-black"
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={() =>
                setMessage("Password recovery will be implemented later.")
              }
              className="text-sm font-medium text-gray-900 transition hover:text-gray-500"
            >
              Forgot password?
            </button>

          </div>

          {/* Feedback */}
          {message && (
            <p role="status" className="text-center text-sm text-gray-600">
              {message}
            </p>
          )}

          {/* Sign In */}
          <button
            type="submit"
            className="flex h-[58px] w-full items-center justify-center gap-3 rounded-xl bg-[#191919] text-base font-medium text-white transition duration-300 hover:bg-black hover:shadow-lg active:scale-[0.99]"
          >
            Sign In
            <ArrowRight size={20} />
          </button>

        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-5">
          <div className="h-px flex-1 bg-[#dedbd7]" />
          <span className="text-sm text-gray-500">
            or continue with
          </span>
          <div className="h-px flex-1 bg-[#dedbd7]" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          disabled
          className="flex h-[58px] w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-[#dedbd7] bg-transparent text-base font-medium text-gray-900 opacity-80"
        >
          <span className="text-xl font-bold text-[#4285F4]">G</span>
          Continue with Google
        </button>

        {/* Footer */}
        <p className="mt-12 text-center text-sm text-gray-500">
          © 2025 Velora. All rights reserved.
        </p>

      </div>
    </AuthScreenLayout>
  );
};

export default LoginScreen;
