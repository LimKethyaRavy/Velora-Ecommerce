import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowUpRight, ArrowLeft } from "lucide-react";
import { authService } from "../../../service/public-site-auth";
import { useAlert } from "../../../UI/AlertModel";

const Register = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const alert = useAlert();
  const redirectTo = searchParams.get("redirect") || "/home";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeTerms: false,
    newsletter: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Please enter your name.";
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "The email input is invalid.";
    }
    if (!formData.password) {
      newErrors.password = "Please enter your password.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Please accept the Terms and Privacy Policy.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert.error({ title: "Please check your registration details" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const response = await authService.register(formData);
      const token = response.token;
      const user = response.data;

      if (token) localStorage.setItem("auth_token", token);
      onAuthSuccess?.(user, token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        setErrors({
          name: serverErrors.name?.[0] || "",
          email: serverErrors.email?.[0] || "",
          password: serverErrors.password?.[0] || "",
        });
      } else {
        setApiError(
          err.response?.data?.message ||
            "Registration failed. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    authService.redirectToSocialProvider(provider, redirectTo);
  };

  return (
    <div>
      <div className="w-full max-w-md mx-auto py-8 px-4">
        {/* Back to store */}
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to store
          </Link>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl text-neutral-900 mb-1">
          Create account
        </h1>
        <p className="text-xs text-neutral-500 mb-6">It only takes a minute.</p>

        {/* Google & Facebook */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-neutral-300 text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition disabled:opacity-50"
          >
            <span>G</span> Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("facebook")}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-neutral-300 text-xs font-medium text-neutral-800 hover:bg-neutral-50 transition disabled:opacity-50"
          >
            <span>f</span> Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-neutral-200 w-full" />
          <span className="bg-white px-3 text-[10px] tracking-widest text-neutral-400 uppercase whitespace-nowrap">
            OR WITH EMAIL
          </span>
          <div className="border-t border-neutral-200 w-full" />
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mb-4 p-3 text-xs text-red-700 bg-red-50 border border-red-200">
            {apiError}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full name */}
          <div>
            <label className="block text-xs font-medium text-neutral-800 mb-1">
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Emma Laurent"
              className={`w-full px-3 py-2.5 text-xs border outline-none transition ${
                errors.name
                  ? "border-red-500"
                  : "border-neutral-300 focus:border-neutral-900"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-[11px] text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-neutral-800 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-3 py-2.5 text-xs border outline-none transition ${
                errors.email
                  ? "border-red-500"
                  : "border-neutral-300 focus:border-neutral-900"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-neutral-800 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className={`w-full px-3 py-2.5 pr-10 text-xs border outline-none transition ${
                  errors.password
                    ? "border-red-500"
                    : "border-neutral-300 focus:border-neutral-900"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Checkboxes */}
          <div className="space-y-2.5 pt-1">
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded-none border-neutral-300 text-neutral-900 focus:ring-0"
                />
                <span className="text-[11px] text-neutral-600">
                  I agree to the{" "}
                  <Link to="/terms" className="underline text-neutral-900">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="underline text-neutral-900">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.agreeTerms}
                </p>
              )}
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                className="mt-0.5 rounded-none border-neutral-300 text-neutral-900 focus:ring-0"
              />
              <span className="text-[11px] text-neutral-600">
                Email me about new collections and offers.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-neutral-900 text-white py-3 px-4 text-xs tracking-widest uppercase font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 transition disabled:opacity-60"
          >
            {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            {!isSubmitting && <ArrowUpRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Sign in Link */}
        <p className="mt-6 text-center text-xs text-neutral-600">
          Already have an account?{" "}
          <Link
            to={
              redirectTo !== "/"
                ? `/login?redirect=${encodeURIComponent(redirectTo)}`
                : "/login"
            }
            className="underline font-medium text-neutral-900"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
