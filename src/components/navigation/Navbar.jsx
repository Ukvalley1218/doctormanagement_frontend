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
  Home
} from "lucide-react";
import logo from "../../assets/images/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../../apiclient";

const Navbar = ({ onLoginClick, isLoggedIn = false, children }) => {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY RETURNS
  const { cartCount } = useCart();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ doctors: [], products: [] });
  const [showDropdown, setShowDropdown] = useState(false);

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

  useEffect(() => {
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

    fetchUser();
  }, []);

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
        setShowDropdown(true);
        const res = await apiClient.get(`/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchResults, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  // COMPUTED VALUES AND FUNCTIONS AFTER HOOKS
  const isMobile = windowWidth <= 768;
  const isHomePage = location.pathname === "/";

  const isActiveRoute = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/") return "Dashboard";
    if (currentPath === "/dashboard") return "Dashboard";
    if (currentPath.startsWith("/appointment")) return "Appointments";
    if (currentPath.startsWith("/medicines")) return "Medicines";
    if (currentPath.startsWith("/doctors")) return "Therapists";
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

  const sidebarItems = [
    { icon: Home, label: "Home", link: "/" },
    { icon: BarChart3, label: "Dashboard", link: "/dashboard" },
    { icon: Pill, label: "Medicines", link: "/medicines" },
    { icon: Users, label: "Therapists", link: "/doctors" },
    { icon: Package, label: "Orders", link: "/order" },
    { icon: User, label: "Profile", link: "/profile" },
  ];

  const handleSelect = (type, id) => {
    setShowDropdown(false);
    setQuery("");
    if (type === "doctor") {
      navigate(`../book_appointment/${id}`);
    } else {
      navigate(`../product_details/${id}`);
    }
  };

  const handleLogout = () => {
    try {
      logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

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

            {results.doctors.length === 0 && results.products.length === 0 && (
              <div className="p-4 text-sm text-gray-500 text-center">
                No results found
              </div>
            )}
          </>
        )}
      </div>
    );

  // NOW SAFE TO HAVE CONDITIONAL RETURNS - ALL HOOKS HAVE BEEN CALLED
  const showSimpleNavbar = !isLoggedIn || isHomePage;

  if (showSimpleNavbar) {
    return (
      <>
        <nav className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-36 py-4 w-full mx-auto bg-white shadow-md">
          <Link to="/">
            <div className="flex items-center">
              <img src={logo} className="mr-2 w-[140px]" alt="Healcure Logo" />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <div className="flex items-center gap-12">
              <Link to="/">
                <button className="cursor-pointer font-semibold hover:text-blue-400">Home</button>
              </Link>
              <Link to="/doctors">
                <button className="cursor-pointer font-semibold hover:text-blue-400">Therapists</button>
              </Link>
              <Link to="/medicines">
                <button className="cursor-pointer font-semibold hover:text-blue-400">Medicines</button>
              </Link>
            </div>
          )}

          {!isMobile && (
            <div className="flex items-center gap-3 md:gap-4">
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

              {isLoggedIn ? (
                <Link to="/dashboard">
                  <button className="px-4 py-2 bg-gradient-to-r from-[#2267e5] to-[#0b9391] cursor-pointer text-white rounded-md hover:bg-blue-700">
                    Dashboard
                  </button>
                </Link>
              ) : (
                <button
                  className="px-4 py-2 bg-gradient-to-r from-[#2267e5] to-[#0b9391] cursor-pointer text-white rounded-md hover:bg-blue-700"
                  onClick={onLoginClick}
                >
                  Sign In
                  <span className="ml-2">→</span>
                </button>
              )}

              <Link to="/cart">
                <button className="cursor-pointer p-2 text-[#2D3748] hover:text-[#0066CC] relative">
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

          {isMobile && isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 p-4">
              <div className="flex flex-col space-y-4">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  <button className="cursor-pointer w-full text-left font-semibold text-gray-700 hover:text-blue-500">
                    Home
                  </button>
                </Link>

                <Link to="/doctors" onClick={() => setIsMenuOpen(false)}>
                  <button className="cursor-pointer w-full text-left font-semibold text-gray-700 hover:text-blue-500">
                    Therapists
                  </button>
                </Link>

                <Link to="/medicines" onClick={() => setIsMenuOpen(false)}>
                  <button className="cursor-pointer w-full text-left font-semibold text-gray-700 hover:text-blue-500">
                    Medicines
                  </button>
                </Link>

                <div className="border-t border-gray-200 my-2" />

                {isLoggedIn ? (
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <button className="cursor-pointer px-4 py-2 w-full bg-gradient-to-r from-[#2267e5] to-[#0b9391] text-white rounded-md hover:bg-blue-700 text-left">
                      Dashboard
                    </button>
                  </Link>
                ) : (
                  <button
                    className="cursor-pointer px-4 py-2 w-full bg-gradient-to-r from-[#2267e5] to-[#0b9391] text-white rounded-md hover:bg-blue-700 text-left"
                    onClick={() => {
                      if (onLoginClick) onLoginClick();
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign In
                    <span className="ml-2">→</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>

        <div className="flex-1 overflow-auto">{children}</div>
      </>
    );
  }

  // Full navbar with sidebar for logged-in users (not on home page)
  return (
    <div className="flex h-screen bg-gray-50">
     {/* Sidebar (desktop & mobile toggleable) */}
{!isMobile && (
  <div
    className={`bg-white shadow-lg flex-shrink-0 transition-all duration-300 ${
      isSidebarOpen ? "w-64" : "w-20"
    }`}
  >
    <div className="p-4 flex flex-col items-center relative">
      {/* Logo + Collapse Button */}
      <div className="flex items-center justify-between w-full mb-6">
        <Link to="/">
          <img
            src={logo}
            alt="Healcure Logo"
            className={`transition-all duration-300 ${
              isSidebarOpen ? "w-[140px]" : "hidden"
            }`}
          />
        </Link>

        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 w-full">
        {sidebarItems.map((item, index) => (
          <Link key={index} to={item.link}>
            <div className="relative group">
              <button
                className={`cursor-pointer w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                  isActiveRoute(item.link)
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />

                {/* Sidebar label (visible only if open) */}
                <span
                  className={`ml-3 text-sm font-medium transition-opacity duration-300 ${
                    isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
                  }`}
                >
                  {item.label}
                </span>
              </button>

              {/* Tooltip (only when sidebar is collapsed) */}
              {!isSidebarOpen && (
                <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-medium py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200">
                  {item.label}
                </span>
              )}
            </div>
          </Link>
        ))}

        {/* Logout Button */}
        <div className="relative group">
          <button
            onClick={handleLogout}
            className="cursor-pointer w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors text-red-600 hover:bg-gray-50"
          >
            <LogOutIcon className="h-5 w-5" />
            <span
              className={`ml-3 text-sm font-medium transition-opacity duration-300 ${
                isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              Logout
            </span>
          </button>

          {/* Tooltip for logout */}
          {!isSidebarOpen && (
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-medium py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200">
              Logout
            </span>
          )}
        </div>
      </nav>
    </div>
  </div>
)}


      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-500/50 backdrop-blur-xs z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {isMobile && (
        <div
          className={`fixed left-0 top-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                    className={`cursor-pointer w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${isActiveRoute(item.link)
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

      <div className="flex-1 flex flex-col overflow-hidden">
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

              {isMobile && (
                <button
                  className="p-2 text-gray-600"
                  onClick={() => setIsSearchFocused(!isSearchFocused)}
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              <Link to="/cart">
                <button className="cursor-pointer p-2 text-[#2D3748] hover:text-[#0066CC] relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>

              <Link to="/profile">
                <div className="flex items-center">
                  <div className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-semibold uppercase">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      // Default initials (e.g., from user.name)
                      <span>
                        {user?.name
                          ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                          : "PR"}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

            </div>
          </div>
          {isMobile && isSearchFocused && (
            <div className="mt-3 relative">
              <input
                type="text"
                placeholder="Search medicines and therapists..."
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

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};


export default Navbar;