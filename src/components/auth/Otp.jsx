import React, { useState, useRef, useEffect } from "react";
import login_image from "../../assets/images/admin.png";
import logo from "../../assets/images/logo.png";
import apiClient from "../../../apiclient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const OTP = (props) => {
  const email = props.email;
  const { onLoginSuccess } = props;
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // 🔹 New state for errors
  const inputRefs = useRef([]);
  const navigation = useNavigate();
  const { login } = useAuth();
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleChange = (index, value) => {
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOTP(newOtp);

      if (index < 5 && value !== "") {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOTP(newOtp);
        inputRefs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOTP(newOtp);
      }
    }
  };

  const handleGetOTP = async () => {
    setErrorMessage(""); // clear previous errors
    try {
      const enteredOtp = otp.join("");
      if (enteredOtp.length !== 6) {
        setErrorMessage("Please enter a valid 6-digit OTP.");
        return;
      }

      setSubmit(true);
      const response = await apiClient.post("auth/verify-otp", {
        email,
        otp: enteredOtp,
      });

      login(response.data);

      if (typeof onLoginSuccess === "function") {
        onLoginSuccess();
      }
      // navigation(-1);
    } catch (error) {
      console.log(error.response);

      if (error.response?.status === 400) {
        setErrorMessage("Invalid/Expired OTP. Please try again.");
      } else if (error.response?.status === 410) {
        setErrorMessage("OTP has expired. Please resend a new one.");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setSubmit(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      if (!canResend) return;

      console.log("Resending OTP to:", email);
      const response = await apiClient.post(`/auth/resend-otp`, { email });
      console.log(response.data);
      setErrorMessage(""); // clear error on resend
      setTimer(30);
      setCanResend(false);

      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setCanResend(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      alert("OTP Send Successfully")
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="flex">
      {/* Left Side */}
      <div className="hidden md:block w-full bg-gray-50 flex justify-center ">
        <div className="w-full flex justify-center">
          <img
            src={login_image}
            alt="Medical professional"
            className="max-h-155 max-w-full object-contain"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl">
            <div className="flex justify-center">
              <img src={logo} alt="HealCure Logo" className="w-50" />
            </div>
            <div className="text-center mb-8">
              <h2 className="text-l font-semibold text-center text-gray-800 mb-2 mt-5">
                Enter the OTP sent to {email} to verify your E-Mail Address.
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between mb-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    className="w-8 md:w-12 h-10 md:h-16 text-center text-l md:text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700"
                  />
                ))}
              </div>

              {/* 🔹 Show error message */}
              {errorMessage && (
                <p className="text-red-600 text-sm text-center mb-4">
                  {errorMessage}
                </p>
              )}

              <button
                onClick={handleGetOTP}
                disabled={submit}
                className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
              >
                {submit ? "Verifying...." : "Verify OTP"}
              </button>

              <div className="text-center">
                {canResend ? (
                  <span
                    className="text-blue-600 cursor-pointer hover:text-blue-800"
                    onClick={handleResendOTP}
                  >
                    Resend OTP
                  </span>
                ) : (
                  <span className="text-gray-500">
                    Resend OTP in {timer} seconds
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTP;
