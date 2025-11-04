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
  X,
  User,
  LogOutIcon,
} from "lucide-react";
import logo from "../../assets/images/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../../apiclient";

const Navbar = ({ onLoginClick, isLoggedIn = false, children }) => {
  const { cartCount } = useCart();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

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

  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;
      const response = await apiClient.get(`/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error.response || error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isMobile = windowWidth <= 768;

  // Function to check if a route is active
  const isActiveRoute = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Function to get page title based on current route
  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/") return "Dashboard";
    if (currentPath.startsWith("/appointment")) return "Appointments";
    if (currentPath.startsWith("/medicines")) return "Medicines";
    if (currentPath.startsWith("/doctors")) return "Doctors";
    if (currentPath.startsWith("/order")) return "Orders";
    if (currentPath.startsWith("/profile")) return "Profile";
    if (currentPath.startsWith("/cart")) return "Cart Details";
    if (currentPath.startsWith("/product_details")) return "Medicine Details";
    if (currentPath.startsWith("/book_appointment")) return "Book Appointment";
    if (currentPath.startsWith("/return_order")) return "Return Order";
    if (currentPath.startsWith("/checkout-success")) return "Checkout Success";
    if (currentPath.startsWith("/apointment-success"))
      return "Appointment Success";
    return "Dashboard";
  };

  // Sidebar menu items with dynamic active state
  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", link: "/" },
    
    { icon: Pill, label: "Medicines", link: "/medicines" },
    { icon: Users, label: "Therapists", link: "/doctors" },
    { icon: Package, label: "Orders", link: "/order" },
    { icon: User, label: "Profile", link: "/profile" },
  ];

  // search bar stuff
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ doctors: [], products: [] });
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch search suggestions
  useEffect(() => {
    if (query.length < 2) {
      setResults({ doctors: [], products: [] });
      setShowDropdown(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setShowDropdown(true); // show popup immediately
        const res = await apiClient.get(`/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchResults, 400); // debounce
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (type, id) => {
    setShowDropdown(false);
    setQuery("");
    if (type === "doctor") {
      navigate(`../book_appointment/${id}`);
    } else {
      navigate(`../product_details/${id}`);
    }
  };

  // 🔹 Search Dropdown UI (used in desktop & mobile)
  const renderSearchDropdown = () =>
    showDropdown && (
      <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-sm text-gray-500">Searching...</span>
          </div>
        ) : (
          <>
            {/* Doctors */}
            {results.doctors.length > 0 && (
              <div>
                <p className="px-3 py-2 text-sm font-semibold text-gray-600">
                  Doctors
                </p>
                {results.doctors.map((doc) => (
                  <div
                    key={doc._id}
                    onMouseDown={() => handleSelect("doctor", doc._id)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <img
                      src={doc.image || "/doctor-placeholder.png"}
                      alt={doc.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-sm">
                      {doc.name} — {doc.specialty}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Products */}
            {results.products.length > 0 && (
              <div>
                <p className="px-3 py-2 text-sm font-semibold text-gray-600">
                  Products
                </p>
                {results.products.map((prod) => (
                  <div
                    key={prod._id}
                    onMouseDown={() => handleSelect("product", prod._id)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <img
                      src={prod.mainImage || "/product-placeholder.png"}
                      alt={prod.name}
                      className="w-8 h-8 rounded mr-2"
                    />
                    <span className="text-sm">
                      {prod.name} — ${prod.sellingPrice}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* No results */}
            {results.doctors.length === 0 && results.products.length === 0 && (
              <div className="p-4 text-sm text-gray-500 text-center">
                No results found
              </div>
            )}
          </>
        )}
      </div>
    );

  // ✅ Non-logged-in navbar
  if (!isLoggedIn) {
    return (
      <>
        <nav className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-4 py-4 w-full mx-auto bg-white shadow-md">
          <Link to="/">
            <div className="flex items-center">
              <img src={logo} className="mr-2 w-[140px]" alt="Healcure Logo" />
            </div>
          </Link>

          {!isMobile && (
            <div className="flex items-center gap-3 md:gap-4">
              {/* 🔹 Desktop Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search medicines and therapists..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                {renderSearchDropdown()}
              </div>

              <button
                className="px-4 py-2 bg-[#0066CC] cursor-pointer text-white rounded-md hover:bg-blue-700"
                onClick={onLoginClick}
              >
                Login / SignUp
              </button>

              {/* Cart */}
              <Link to="/cart">
                <button className="p-2 text-[#2D3748] hover:text-[#0066CC] relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          )}

          {/* 🔹 Mobile Navigation */}
          {isMobile && (
            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-[#2D3748]"
                onClick={() => setIsSearchFocused(!isSearchFocused)}
              >
                <Search className="h-6 w-6" />
              </button>

              <Link to="/cart">
                <button className="p-2 text-[#2D3748] hover:text-[#0066CC] relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>

              <button
                className="p-2 text-[#2D3748]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}

          {/* 🔹 Mobile Search */}
          {isMobile && isSearchFocused && (
            <div className="absolute top-full left-0 right-0 bg-white p-4 shadow-md z-50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search therapists, medicines, etc."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  autoFocus
                />
                <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                {renderSearchDropdown()}
              </div>
            </div>
          )}

          {/* 🔹 Mobile Menu */}
          {isMobile && isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 p-4">
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

        {/* Main content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </>
    );
  }

  const handleLogout = () => {
    try {
      logout();
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess();
      }
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Logged-in Navbar
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <div className="w-64 bg-white shadow-lg flex-shrink-0">
          <div className="p-4">
            <Link to="/">
              <div className="flex items-center mb-8">
                <img
                  src={logo}
                  className="mr-2 w-[140px]"
                  alt="Healcure Logo"
                />
              </div>
            </Link>

            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <Link key={index} to={item.link}>
                  <button
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      isActiveRoute(item.link)
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                </Link>
              ))}
              <div
                className="w-full flex cursor-pointer items-center px-4 py-3 text-left rounded-lg transition-colors text-red-600 hover:bg-gray-50"
                onClick={handleLogout}
              >
                <div>
                  <LogOutIcon className="h-5 w-5 mr-3" />
                </div>
                Logout
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-500/50 backdrop-blur-xs z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div
          className={`fixed left-0 top-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              <img src={logo} className="mr-2 w-[140px]" alt="Healcure Logo" />
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <button
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      isActiveRoute(item.link)
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <nav className="bg-white shadow-sm px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 text-gray-600 mr-3"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
              <h1 className="xl:text-xl font-semibold text-gray-800">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* 🔹 Desktop Search */}
              {!isMobile && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search medicines and therapists..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="w-50 lg:w-80 xl:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                  {renderSearchDropdown()}
                </div>
              )}

              {/* 🔹 Mobile Search Toggle */}
              {isMobile && (
                <button
                  className="p-2 text-gray-600"
                  onClick={() => setIsSearchFocused(!isSearchFocused)}
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {/* Cart */}
              <Link to="/cart">
                <button className="p-2 text-[#2D3748] hover:text-[#0066CC] relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* Profile */}
              <Link to="/profile">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <img
                      src={user?.avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
              </Link>
            </div>
          </div>
          {/* Mobile Search Bar */}
          {isMobile && isSearchFocused && (
            <div className="mt-3 relative">
              <input
                type="text"
                placeholder="Search medicines and doctors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
              {renderSearchDropdown()}
            </div>
          )}
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Navbar;
