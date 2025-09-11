import React, { useState } from "react";
import login_image from "../../assets/images/admin.png";
import logo from "../../assets/images/logo.png";
import OTP from "./Otp";
import apiClient from "../../../apiclient";
import { useAuth } from "../../contexts/AuthContext";

const Login = ({ navigation, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [submit, setSubmit] = useState(false);
  const { login } = useAuth();

  const handleGetOTP = async () => {
    try {
      if (email) {
        setSubmit(true);
        console.log("Getting OTP for:", email);
        const response = await apiClient.post("/auth/login", { email });
        console.log(response.data);
        setShowOTP(true);
        // Add your OTP sending logic here
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setSubmit(false);
    }
  };

  // If OTP component should be shown, render it instead of the login form
  if (showOTP) {
    return <OTP email={email} onLoginSuccess={onLoginSuccess} />;
  }

  return (
    <div className="flex">
      {/* Left Side - Image */}
      <div className="hidden md:block w-full bg-gray-50 flex justify-center ">
        <div className="w-full flex justify-center">
          <img
            src={login_image}
            alt="Medical professional"
            className="max-h-155 md:max-h-130 lg:max-h-155 max-w-full object-contain"
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full bg-gray-50 flex items-center justify-center p-8 md:p-2">
        <div className="w-full max-w-md">
          <div className="rounded-2xl p-3">
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-400"
                />
              </div>

              <button
                onClick={handleGetOTP}
                disabled={submit}
                className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
              >
                {submit ? "Submitting...." : "Get OTP"}
              </button>

              <div className="text-center">
                By click on get OTP, you agree to our <br /> <span className="text-[#2563EB]">Terms &
                Conditions</span> and <span className="text-[#2563EB]">Privacy Policy</span>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
