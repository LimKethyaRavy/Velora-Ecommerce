import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { loginPublic } = useAuth();

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError(decodeURIComponent(oauthError));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSocialLogin = (provider) => {
    authService.redirectToSocialProvider(provider, redirectTo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await loginPublic({
        email: form.email,
        password: form.password,
      });

      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white text-slate-900">
        {/* Left Editorial Brand Panel */}
        <aside className="relative hidden lg:flex flex-col justify-between bg-[#3b5570] text-white p-12 overflow-hidden">
          {/* Subtle decorative arch lines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-1/3 w-96 h-96 rounded-t-full border border-white/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 top-[45%] w-72 h-72 rounded-t-full border border-white/15"
          />

          <div className="relative z-10 tracking-[0.28em] text-lg font-light uppercase">
            VELORA
          </div>

          <div className="relative z-10 max-w-md space-y-5">
            <div className="flex items-center gap-3 text-xs tracking-[0.22em] uppercase text-white/75">
              <span className="w-6 h-px bg-white/50" />
              <span>Welcome Back</span>
            </div>

            <h2 className="font-serif text-5xl leading-[1.12] font-normal">
              Timeless style,
              <br />
              waiting for you.
            </h2>

            <p className="text-sm text-white/80 leading-relaxed">
              Sign in to track orders, save favourites and check out faster.
            </p>
          </div>

          <div className="relative z-10 text-xs text-white/70">
            Free shipping on orders over $100
          </div>
        </aside>

        {/* Right Sign-In Form Panel */}
        <main className="flex flex-col justify-center px-6 sm:px-14 lg:px-20 py-10 relative">
          <Link
            to="/"
            className="absolute top-8 left-6 sm:left-14 lg:left-20 text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>Back to store</span>
          </Link>

          <div className="w-full max-w-md mx-auto mt-8 lg:mt-0">
            <h1 className="font-serif text-4xl text-slate-900 mb-1.5">
              Sign in
            </h1>
            <p className="text-sm text-slate-500 mb-7">
              Enter your details to access your account.
            </p>

            {error && (
              <div className="mb-5 rounded border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="h-11 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded flex items-center justify-center gap-2.5 text-sm font-medium text-slate-800 transition"
              >
                <span className="font-bold text-base text-[#4285F4]">G</span>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                className="h-11 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded flex items-center justify-center gap-2.5 text-sm font-medium text-slate-800 transition"
              >
                <span className="w-4 h-4 rounded-full bg-[#1877F2] text-white text-xs flex items-center justify-center font-bold">
                  f
                </span>
                <span>Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full border-t border-slate-200" />
              <span className="bg-white px-3 text-[11px] tracking-[0.14em] uppercase text-slate-400 whitespace-nowrap">
                Or with email
              </span>
              <div className="w-full border-t border-slate-200" />
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full h-11 px-3.5 text-sm border border-slate-200 rounded focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full h-11 pl-3.5 pr-10 text-sm border border-slate-200 rounded focus:outline-none focus:border-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="inline-flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-slate-600 underline underline-offset-2 hover:text-slate-900"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 bg-[#14171c] hover:bg-black text-white text-xs font-medium tracking-[0.16em] uppercase rounded transition disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in \u2197"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              New to Velora?{" "}
              <Link
                to="/register"
                className="font-semibold text-slate-900 underline underline-offset-2 hover:text-black"
              >
                Create an account
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
