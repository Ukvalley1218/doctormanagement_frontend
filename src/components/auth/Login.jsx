import React, { useState } from 'react';
import login from '../../assets/images/login.png';
import OTP from './Otp';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);

  const handleGetOTP = () => {
    if (email) {
      console.log('Getting OTP for:', email);
      setShowOTP(true);
      // Add your OTP sending logic here
    }
  };

  // If OTP component should be shown, render it instead of the login form
  if (showOTP) {
    return <OTP email={email} />;
  }

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

      {/* Right Side - Login Form */}
      <div className="w-full bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-left text-gray-800 mb-2">
                Get started by entering your email ID
              </h2>
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
              >
                Get OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;