import React, { useState } from "react";
import login_image from "../../assets/images/admin.png";
import logo from "../../assets/images/logo.png";
import OTP from "./Otp";
import TermsAndConditions from "../information/terms";
import PrivacyPolicy from "../information/privacy";
import apiClient from "../../../apiclient";
import { useAuth } from "../../contexts/AuthContext";

const Login = ({ navigation, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState("");
  const [showLegal, setShowLegal] = useState(""); // "terms" | "privacy" | ""

  const { login } = useAuth();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleGetOTP = async () => {
    setError("");
    if (!email) return setError("Email is required");
    if (!validateEmail(email))
      return setError("Please enter a valid email address");

    try {
      setSubmit(true);
      const response = await apiClient.post("/auth/login", { email });
      console.log(response.data);
      setShowOTP(true);
    } catch (error) {
      console.log(error.response);
      setError(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setSubmit(false);
    }
  };

  // If OTP screen is active
  if (showOTP) return <OTP email={email} onLoginSuccess={onLoginSuccess} />;

  // If legal pages should be shown
  if (showLegal === "terms")
    return (
      <div>
        <button className="bg-white px-5 pt-3 -mb-5 w-full text-start" onClick={() => setShowLegal(null)}>← Login</button>
        <TermsAndConditions />
      </div>
    );

  if (showLegal === "privacy")
    return (
      <div>
        <button className="bg-white px-5 pt-3 w-full text-start" onClick={() => setShowLegal(null)}>← Login</button>
        <PrivacyPolicy />
      </div>
    );

  return (
    <div className="flex">
      {/* Left Side */}
      <div className="hidden md:block w-full bg-gray-50 flex justify-center">
        <img
          src={login_image}
          alt="Medical professional"
          className="max-h-155 md:max-h-130 lg:max-h-155 lg:w-[500px] object-contain"
        />
      </div>

      {/* Right Side */}
      <div className="w-full bg-gray-50 flex items-center justify-center p-8 md:p-2">
        <div className="w-full max-w-md">
          <div className="rounded-2xl">
            <div className="flex justify-center">
              <img src={logo} alt="HealCure Logo" className="w-50" />
            </div>

            <div className="text-center mb-0">
              <h2 className="text-xl font-semibold text-gray-700 mt-3">
                Welcome to HealCure
              </h2>
            </div>

            <div className="text-center mb-5">
              <p className="text-m md:text-l text-center text-gray-800 mb-2">
                Get started by entering your email ID
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email ID"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className={`w-full px-4 py-3 border ${
                    error ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-400`}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1 text-left">{error}</p>
                )}
              </div>

              <button
                onClick={handleGetOTP}
                disabled={submit}
                className={`cursor-pointer w-full bg-blue-600 ${
                  submit ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                } text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none`}
              >
                {submit ? "Submitting..." : "Get OTP"}
              </button>

              <div className="text-center text-sm text-gray-600">
                By clicking on Get OTP, you agree to our <br />
                <span
                  onClick={() => setShowLegal("terms")}
                  className="text-[#2563EB] cursor-pointer hover:underline"
                >
                  Terms & Conditions
                </span>{" "}
                and{" "}
                <span
                  onClick={() => setShowLegal("privacy")}
                  className="text-[#2563EB] cursor-pointer hover:underline"
                >
                  Privacy Policy
                </span>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
