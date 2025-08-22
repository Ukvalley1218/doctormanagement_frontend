import React, { useState, useRef, useEffect } from "react";
import login from "../../assets/images/login.png";

const OTP = (props) => {
  const email = props.email;
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    // Start the timer when component mounts
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

    // Clean up the interval when component unmounts
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (index, value) => {
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOTP(newOtp);

      // Auto-focus to next input
      if (index < 5 && value !== "") {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // If current input is empty, move focus to previous input and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOTP(newOtp);
        inputRefs.current[index - 1].focus();
      } else {
        // Just clear the current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOTP(newOtp);
      }
    }
  };

  const handleGetOTP = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      console.log("Verifying OTP:", enteredOtp, "for email:", email);
      // Add your OTP verification logic here
    }
  };

  const handleResendOTP = () => {
    if (!canResend) return;
    
    console.log("Resending OTP to:", email);
    // Add your OTP resend logic here
    
    // Reset the timer
    setTimer(30);
    setCanResend(false);
    
    // Start the timer again
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
  };

  return (
    <div className="flex">
      {/* Left Side - Image */}
      <div className="w-full bg-gray-50 flex justify-center ">
        <div className="w-full flex justify-center">
          <img
            src={login}
            alt="Medical professional"
            className="max-h-155 max-w-full object-contain"
          />
        </div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="w-full bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-l font-semibold text-left text-gray-800 mb-2">
                Enter the OTP sent to {email} to verify your E-Mail Address.
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    className="w-12 h-16 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700"
                  />
                ))}
              </div>

              <button
                onClick={handleGetOTP}
                className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
              >
                Verify OTP
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