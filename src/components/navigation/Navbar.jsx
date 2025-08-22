import React, { useEffect, useState } from "react";
import { ShoppingCart, Star, Filter, ChevronDown } from "lucide-react";
import logo from "../../assets/images/logo.png";

const Navbar = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-4 py-4 w-full mx-auto bg-white shadow-md">
      <div className="flex items-center">
        <img src={logo} className="mr-2 w-[30px]"/>
        <div className="text-2xl font-bold">
          <span className="text-[#0066CC]">Trust</span>
          <span className="text-[#2D3748]">Med</span>
        </div>
      </div>

      {/* Desktop Navigation */}
      {!isMobile && (
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative mr-50">
            <input
              type="text"
              placeholder="Search doctors, medicines, etc."
              className="w-[660px] pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <button
            className="px-4 py-2 bg-[#0066CC] text-white rounded-md hover:bg-blue-700"
            onClick={() => {
              if (onLoginClick) onLoginClick();
            }}
          >
            Login / SignUp
          </button>

          {/* Cart Icon */}
          <button className="p-2 text-[#2D3748] hover:text-[#0066CC] relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="flex items-center space-x-2">
          {/* Mobile Search Icon */}
          <button
            className="p-2 text-[#2D3748]"
            onClick={() => setIsSearchFocused(!isSearchFocused)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Cart Icon */}
          <button className="p-2 text-[#2D3748] relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </button>

          {/* Hamburger Menu */}
          <button
            className="p-2 text-[#2D3748]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile Search Bar */}
      {isMobile && isSearchFocused && (
        <div className="absolute top-full left-0 right-0 bg-white p-4 shadow-md z-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors, medicines, etc."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
              autoFocus
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-100 p-4">
          <div className="flex flex-col space-y-4">
            <button
              className="px-4 py-2 bg-[#0066CC] text-white rounded-md hover:bg-blue-700 text-left"
              onClick={() => {
                if (onLoginClick) onLoginClick();
                setIsMenuOpen(false);
              }}
            >
              Login / SignUp
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;