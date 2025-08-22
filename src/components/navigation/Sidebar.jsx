import React, { useEffect, useState } from "react";
import { 
  ShoppingCart, 
  Star, 
  Filter, 
  ChevronDown, 
  Calendar,
  Pill,
  Users,
  Package,
  BarChart3,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import logo from "../../assets/images/logo.png";

const Sidebar = ({ onLoginClick, isLoggedIn = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Sidebar menu items
  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", active: true },
    { icon: Calendar, label: "Appointments" },
    { icon: Pill, label: "Medicines" },
    { icon: Users, label: "Doctors" },
    { icon: Package, label: "Orders" }
  ];

  // Regular navbar for non-logged-in users
  if (!isLoggedIn) {
    return (
      <nav className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-4 py-4 w-full mx-auto bg-white shadow-md">
        <div className="flex items-center">
          <img src={logo} className="mr-2 w-[30px]" alt="TrustMed Logo" />
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
              <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
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
              <Search className="h-6 w-6" />
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
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
              <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
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
  }

  // Logged-in user navbar with sidebar
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <div className="w-64 bg-white shadow-lg flex-shrink-0">
          <div className="p-4">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">MediCare Plus</span>
            </div>
            
            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    item.active
                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform">
            <div className="p-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-800">MediCare Plus</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      item.active
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <nav className="bg-white shadow-sm px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              {isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 text-gray-600 mr-3"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
              
              {/* Page Title */}
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar - Desktop */}
              {!isMobile && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search medicines and doctors..."
                    className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                </div>
              )}

              {/* Mobile Search Button */}
              {isMobile && (
                <button
                  className="p-2 text-gray-600"
                  onClick={() => setIsSearchFocused(!isSearchFocused)}
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-blue-600 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Cart */}
              <button className="p-2 text-gray-600 hover:text-blue-600 relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </button>

              {/* User Profile */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                {!isMobile && (
                  <ChevronDown className="h-4 w-4 text-gray-600 ml-2" />
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isMobile && isSearchFocused && (
            <div className="mt-3 pt-3 border-t">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search medicines and doctors..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;