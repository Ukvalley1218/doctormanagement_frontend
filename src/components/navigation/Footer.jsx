import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#2D3748] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold mb-4 md:justify-start justify-center flex md:block">
              <span className="text-[#0066CC]">Trust</span>
              <span className="text-white">Med</span>
            </div>
            <p className="text-gray-300 text-sm text-center md:text-left">
              Your trusted healthcare partner for medicines and medical
              consultations.
            </p>
          </div>

          {/* Services */}
          <div className="md:ml-5">
            <h4 className="text-lg font-semibold mb-4 text-center md:text-left">Services</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="text-center md:text-left">
                <a href="#" className="hover:text-white">
                  Online Pharmacy
                </a>
              </li>
              <li className="text-center md:text-left">
                <a href="#" className="hover:text-white">
                  Doctor Consultations
                </a>
              </li>
              <li className="text-center md:text-left">
                <a href="#" className="hover:text-white">
                  Health Checkups
                </a>
              </li>
              <li className="text-center md:text-left">
                <a href="#" className="hover:text-white">
                  Medicine Delivery
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-center md:text-left">Support</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="text-center md:text-left">
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li className="text-center md:text-left">
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li className="text-center md:text-left">
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li className="text-center md:text-left">
                <a href="#" className="hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-center md:text-left">Contact</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex flex-col md:flex-row items-center justify-center md:justify-start text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  +91 98765-43210
                </div>
              </li>
              <li className="flex flex-col md:flex-row items-center justify-center md:justify-start text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  support@trustmed.com
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 TrustMed+ All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;