import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/images/logo.png";
import apiClient from "../../../apiclient";
import { Mail, MapPin, Phone} from "lucide-react";

const Footer = () => {
  const { isLoggedIn } = useAuth();
  const [footer, setFooter] = useState(null);

  // ✅ Fetch footer data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/admin/setting`);
        setFooter(response.data[0]);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchData();
  }, []);

  // ✅ Safely hide footer after all hooks have run
  if (isLoggedIn) {
    return <></>; // or just `null`, both fine after hooks
  }

  return (
    <footer className="bg-[#1b3647] text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} className="w-50" alt="Logo" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-semibold">
              Your trusted healthcare partner, providing expert medical care and quality medicines.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-gray-300 text-sm font-semibold">
              <li className="flex items-center gap-2">
                <span className="text-white">→</span>
                <a href="/" className="hover:text-green-400 transition-colors">Home</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white">→</span>
                <a href="/doctors" className="hover:text-green-400 transition-colors">Find Therapists</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white">→</span>
                <a href="/medicines" className="hover:text-green-400 transition-colors">Order Medicines</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white">→</span>
                <a href="#" className="hover:text-green-400 transition-colors">About Us</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-3 text-gray-300 text-sm font-semibold">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full border-2 border-green-400"></div>
                <a href="#" className="hover:text-green-400 transition-colors">Online Consultation</a>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full border-2 border-green-400"></div>
                <a href="#" className="hover:text-green-400 transition-colors">Medicine Delivery</a>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full border-2 border-green-400"></div>
                <a href="#" className="hover:text-green-400 transition-colors">Health Packages</a>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full border-2 border-green-400"></div>
                <a href="#" className="hover:text-green-400 transition-colors">Lab Tests</a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-300 text-sm font-semibold">
              <li className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-[#2299e6] to-[#10abda] p-2 rounded-lg mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+16478466375</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-[#08b6cb] to-[#12b7ac] p-2 rounded-lg mt-0.5">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span>care@healcure.com</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-[#13b89f] to-[#10b885] p-2 rounded-lg mt-0.5">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span>Unit 102, 3465 Semenyk Ct, Mississauga, ON L5C 4P9</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-semibold">
            © 2025 HealCure. All rights reserved. Made with 🤍 for better healthcare.
          </p>
          
          {/* Social Icons */}
          <div className="flex gap-3">
            <a href="#" className="bg-gray-700 hover:bg-blue-500 p-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14h-3v8h-4v-8H7v-4h3V7a5 5 0 0 1 5-5h3v4h-3q-1 0-1 1v3h4Z"/></svg>
            </a>
            <a href="#" className="bg-gray-700 hover:bg-blue-400 p-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14"><g fill="none"><g clipPath="url(#SVGG1Ot4cAD)"><path fill="currentColor" d="M11.025.656h2.147L8.482 6.03L14 13.344H9.68L6.294 8.909l-3.87 4.435H.275l5.016-5.75L0 .657h4.43L7.486 4.71zm-.755 11.4h1.19L3.78 1.877H2.504z"/></g><defs><clipPath id="SVGG1Ot4cAD"><path fill="#fff" d="M0 0h14v14H0z"/></clipPath></defs></g></svg>
            </a>
            <a href="#" className="bg-gray-700 hover:bg-pink-500 p-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M17.34 5.46a1.2 1.2 0 1 0 1.2 1.2a1.2 1.2 0 0 0-1.2-1.2m4.6 2.42a7.6 7.6 0 0 0-.46-2.43a4.9 4.9 0 0 0-1.16-1.77a4.7 4.7 0 0 0-1.77-1.15a7.3 7.3 0 0 0-2.43-.47C15.06 2 14.72 2 12 2s-3.06 0-4.12.06a7.3 7.3 0 0 0-2.43.47a4.8 4.8 0 0 0-1.77 1.15a4.7 4.7 0 0 0-1.15 1.77a7.3 7.3 0 0 0-.47 2.43C2 8.94 2 9.28 2 12s0 3.06.06 4.12a7.3 7.3 0 0 0 .47 2.43a4.7 4.7 0 0 0 1.15 1.77a4.8 4.8 0 0 0 1.77 1.15a7.3 7.3 0 0 0 2.43.47C8.94 22 9.28 22 12 22s3.06 0 4.12-.06a7.3 7.3 0 0 0 2.43-.47a4.7 4.7 0 0 0 1.77-1.15a4.85 4.85 0 0 0 1.16-1.77a7.6 7.6 0 0 0 .46-2.43c0-1.06.06-1.4.06-4.12s0-3.06-.06-4.12M20.14 16a5.6 5.6 0 0 1-.34 1.86a3.06 3.06 0 0 1-.75 1.15a3.2 3.2 0 0 1-1.15.75a5.6 5.6 0 0 1-1.86.34c-1 .05-1.37.06-4 .06s-3 0-4-.06a5.7 5.7 0 0 1-1.94-.3a3.3 3.3 0 0 1-1.1-.75a3 3 0 0 1-.74-1.15a5.5 5.5 0 0 1-.4-1.9c0-1-.06-1.37-.06-4s0-3 .06-4a5.5 5.5 0 0 1 .35-1.9A3 3 0 0 1 5 5a3.1 3.1 0 0 1 1.1-.8A5.7 5.7 0 0 1 8 3.86c1 0 1.37-.06 4-.06s3 0 4 .06a5.6 5.6 0 0 1 1.86.34a3.06 3.06 0 0 1 1.19.8a3.1 3.1 0 0 1 .75 1.1a5.6 5.6 0 0 1 .34 1.9c.05 1 .06 1.37.06 4s-.01 3-.06 4M12 6.87A5.13 5.13 0 1 0 17.14 12A5.12 5.12 0 0 0 12 6.87m0 8.46A3.33 3.33 0 1 1 15.33 12A3.33 3.33 0 0 1 12 15.33"/></svg>
            </a>
            <a href="#" className="bg-gray-700 hover:bg-blue-600 p-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></g></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
