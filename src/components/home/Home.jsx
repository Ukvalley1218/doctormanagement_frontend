import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Star,
  Filter,
  ChevronDown,
  Plus,
  Minus,
  Check,
  Users,
  Clock,
  Heart,
  ShoppingBag,
  CarTaxiFront,
} from "lucide-react";
import hero from "../../assets/images/hero.png";
import medicine from "../../assets/images/medicine.png";
import medicine1 from "../../assets/images/medicine1.png";
import medicine2 from "../../assets/images/medicine2.png";
import medicine3 from "../../assets/images/medicine3.png";
import medicine4 from "../../assets/images/medicine4.png";
import medicine5 from "../../assets/images/medicine5.png";
import medicine6 from "../../assets/images/medicine6.png";
import medicine7 from "../../assets/images/medicine7.png";
import medicines from "../../assets/images/medicines.png";
import eye from "../../assets/images/eye_care.webp";
import pain from "../../assets/images/pain_relief.jpg";
import vitamins from "../../assets/images/vitamins.avif";
import derma from "../../assets/images/derma_care.jpg";
import dr from "../../assets/images/dr.png";
import dr1 from "../../assets/images/dr1.png";
import dr2 from "../../assets/images/dr2.png";
import Navbar from "../navigation/Navbar";
import Login from "../auth/Login";
import Footer from "../navigation/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import apiClient from "../../../apiclient";
import Swal from "sweetalert2"; // import SweetAlert2

function Home() {
  const { addToCart, updateQuantity, items: cartItems, cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriceSort, setSelectedPriceSort] =
    useState("Price: Low to High");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showAddToCartNotification, setShowAddToCartNotification] =
    useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [product, setProduct] = useState(null);
  const [doctors, setDoctors] = useState(null);
  const [loading, setLoading] = useState(true); // 🔹 Loading state

  const navigate = useNavigate();

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

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProduct(product);
    setShowAddToCartNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowAddToCartNotification(false);
      setAddedProduct(null);
    }, 3000);
  };

  const handleQuantityChange = (productId, change) => {
    const currentItem = cartItems.find((item) => item._id === productId);
    if (currentItem) {
      const newQuantity = Math.max(0, currentItem.quantity + change);
      if (newQuantity === 0) {
        updateQuantity(productId, 0);
      } else {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  const handleBuyNow = (product) => {
    if (!product) return;

    addToCart(product);
    navigate("/cart");
  };

  const getCartItem = (productId) => {
    return cartItems.find((item) => item._id === productId);
  };

  const categories = ["All Categories", "ayurvedic", "alopathy", "homeopathic"];
  const priceSorts = [
    "Price: Low to High",
    "Price: High to Low",
    "Most Popular",
    "Newest",
  ];

  const fetchdata = async () => {
    try {
      const response = await apiClient.get("/products?limit=4");
      console.log(response.data);
      // ✅ Filter only active medicines
    const activeMedicines = (response.data.products || []).filter(
      (product) => product.status === "Active"
    );
      setProduct(activeMedicines);
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchdoctordata = async () => {
    try {
      const response = await apiClient.get("/doctors?limit=3");
      console.log(response.data.doctors);
      // ✅ Filter only active doctors
    const activeDoctors = (response.data.doctors || []).filter(
      (doctor) => doctor.status === "Active"
    );

      setDoctors(activeDoctors);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchdata(), fetchdoctordata()]);
      setLoading(false); // 🔹 Stop loading when data is ready
    };
    fetchAll();
  }, []);

  const getStockStyle = (stock) => {
    if (stock > 20) {
      return {
        textColor: "text-green-800",
        bgColor: "bg-green-100",
        text: "In Stock",
      };
    } else if (stock > 0) {
      return {
        textColor: "text-amber-800",
        bgColor: "bg-amber-100",
        text: "Low Stock",
      };
    } else {
      return {
        textColor: "text-red-800",
        bgColor: "bg-red-100",
        text: "Out Of Stock",
      };
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const [errors, setErrors] = useState({});
   const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // ✅ Allows international phone numbers (+, spaces, parentheses, hyphens)
    const phoneRegex = /^\+?[0-9\s()-]{7,20}$/;

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email address.";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Please enter a valid international phone number.";

    if (!formData.message.trim()) newErrors.message = "Message is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await apiClient.post("/form", formData);
      if (res.data.success) {
        Swal.fire({
          title: "✅ Success!",
          text: "Your message has been sent successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        Swal.fire({
          title: "⚠️ Oops!",
          text: "Failed to submit the form. Please try again.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "❌ Error",
        text: "Something went wrong while submitting your form.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}

      {/* Hero + Form + Stats Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-white mx-auto overflow-hidden">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-12 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Content */}
            <div className="pt-4 lg:pl-4">
              <div className="bg-gradient-to-r from-[#d9ecfd] to-[#ccfaf3] text-blue-600 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 mb-6">

                #1 Trusted Healthcare Platform
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                <span className="text-[#358abf]">Expert Medical</span>
                <br />
                <span className="text-[#358abf]">Care</span>
                <br />
                <span className="text-[#69972f]">You Can Trust</span>
              </h1>

              <p className="text-base md:text-lg text-gray-700 mb-8 font-semibold leading-relaxed max-w-md">
                Connect with world-class therapists and access advanced healthcare technology from the comfort of your home. Your health, our priority.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/doctors">
                  <button className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4h-2V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7h16Zm0-9H4V7a1 1 0 0 1 1-1h2v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h2a1 1 0 0 1 1 1Z" /></svg>

                    Find a Therapist
                    <span>→</span>
                  </button>
                </Link>

                <Link to="/medicines">
                  <button className="cursor-pointer px-6 py-3 border-2 border-gray-800 text-gray-800 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all duration-300 bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.822 7.431A1 1 0 0 0 21 7H7.333L6.179 4.23A1.99 1.99 0 0 0 4.333 3H2v2h2.333l4.744 11.385A1 1 0 0 0 10 17h8c.417 0 .79-.259.937-.648l3-8a1 1 0 0 0-.115-.921M17.307 15h-6.64l-2.5-6h11.39z" /><circle cx="10.5" cy="19.5" r="1.5" fill="currentColor" /><circle cx="17.5" cy="19.5" r="1.5" fill="currentColor" /></svg>

                    Order Medicine
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Side (Form Overlapping Section) */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="lg:absolute lg:top-[150px] transform lg:-translate-y-1/2 lg:right-0 w-full sm:w-3/4 md:w-4/5 lg:w-[480px] z-30">

                {/* Rating Badge */}
                <div className="flex items-center gap-2 mb-6 justify-center bg-gradient-to-r from-[#fdfdfc] to-[#fcfdfe] border-2 px-6 py-4 rounded-2xl shadow-lg border-[#f3d9b7] pr-2">
                  {/* Numbered Circles */}
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white text-base font-bold border-[3px] border-white shadow-md z-40">
                      1
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-base font-bold border-[3px] border-white shadow-md z-30">
                      2
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-base font-bold border-[3px] border-white shadow-md z-20">
                      3
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-base font-bold border-[3px] border-white shadow-md z-10">
                      4
                    </div>
                  </div>

                  {/* Rating Section */}
                  <div className="flex flex-col gap-0.5">
                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 fill-yellow-400"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Rating Text */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-gray-900">4.9</span>
                      <span className="text-sm font-medium text-gray-600">1000+ Reviews</span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="bg-gradient-to-r from-[#e8f2fd] to-[#d8ede7] rounded-3xl shadow-xl p-8 backdrop-blur-sm border border-white/50">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find the best</h3>
                  <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Name */}
      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-xl bg-white border ${
            errors.name ? "border-red-500" : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-xl bg-white border ${
            errors.email ? "border-red-500" : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <input
          type="tel"
          name="phone"
          placeholder="Phone No (e.g., +1 234 567 890)"
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-xl bg-white border ${
            errors.phone ? "border-red-500" : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <textarea
          name="message"
          placeholder="How can we help you"
          rows="4"
          value={formData.message}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-xl bg-white border ${
            errors.message ? "border-red-500" : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none`}
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`cursor-pointer w-full text-white py-3 rounded-xl font-medium 
        transition-all duration-300 shadow-md 
        ${
          loading
            ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-[#3b8caf] to-[#63963f] hover:shadow-xl hover:-translate-y-0.5 active:scale-95 hover:from-[#4ea0c5] hover:to-[#79b54d]"
        }`}
      >
        {loading ? (
          <div className="flex justify-center items-center gap-2">
            <svg
              className="w-5 h-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span>Sending...</span>
          </div>
        ) : (
          "Contact us"
        )}
      </button>
    </form>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - Full Width, with form overlapping */}
        <div className="bg-gradient-to-r from-[#73afd3] to-[#94b679] py-28 md:py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white">
            {/* Shifted Left Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-32 text-left text-white md:ml-0 lg:-ml-10">
              <div className="flex flex-col items-center md:items-start">
                <div className="bg-[#60a4cd] bg-opacity-10 p-5 rounded-lg mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 15 15"><path fill="currentColor" d="M5.5 7A2.5 2.5 0 0 1 3 4.5v-2a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v2a3.49 3.49 0 0 0 1.51 2.87A4.4 4.4 0 0 1 5 10.5a3.5 3.5 0 1 0 7 0v-.57a2 2 0 1 0-1 0v.57a2.5 2.5 0 0 1-5 0a4.4 4.4 0 0 1 1.5-3.13A3.49 3.49 0 0 0 9 4.5v-2A1.5 1.5 0 0 0 7.5 1H7a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v2A2.5 2.5 0 0 1 5.5 7m6 2a1 1 0 1 1 0-2a1 1 0 0 1 0 2" /></svg>
                </div>
                <h3 className="text-5xl md:text-4xl font-bold mb-3">50+</h3>
                <p className="text-base opacity-90 font-semibold">Expert Therapists</p>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <div className="bg-[#60a4cd] bg-opacity-25 p-5 rounded-lg mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-17.87a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85" /></svg>

                </div>
                <h3 className="text-5xl md:text-4xl font-bold mb-3">25k+</h3>
                <p className="text-base opacity-90 font-semibold">Patients Treated</p>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <div className="bg-[#60a4cd] bg-opacity-25 p-5 rounded-lg mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><g fill="none"><path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12" /><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12Z" /><path stroke="currentColor" stroke-linecap="square" stroke-width="2" d="M12 6.5V12l3 3" /></g></svg>
                </div>
                <h3 className="text-5xl md:text-4xl font-bold mb-3">24/7</h3>
                <p className="text-base opacity-90 font-semibold">Emergency Care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-gradient-to-r from-[#f5f8fc] to-[#eef7fe] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#358abf]">Why Choose </span>
              <span className="text-[#69972f]">HealCure</span>
            </h2>
            <p className="text-gray-600 font-semibold text-lg">Experience healthcare like never before</p>
          </div>

          {/* Features Grid */}
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-start">
              {/* Feature 1 */}
              <div className="bg-white text-left rounded-lg p-8 hover:shadow-lg transition-shadow w-full md:w-[90%]">
                <div className="bg-gradient-to-r from-[#308cef] to-[#0eadd9] backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Secure & Private</h3>
                <p className="text-black">HIPAA compliant platform</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white text-left rounded-lg p-8 hover:shadow-lg transition-shadow w-full md:w-[90%]">
                <div className="bg-gradient-to-r from-[#308cef] to-[#0eadd9] backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Instant Connect</h3>
                <p className="text-black">Chat in 60 seconds</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white text-left rounded-lg p-8 hover:shadow-lg transition-shadow w-full md:w-[90%]">
                <div className="bg-gradient-to-r from-[#308cef] to-[#0eadd9] backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Track Progress</h3>
                <p className="text-black">Monitor your health journey</p>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* Products Section */}
      {/* Medicines Section */}
      <section className="max-w-7xl bg-gradient-to-r from-[#f9fafd] to-[#f5fbfe] mx-auto px-4 md:px-6 py-12 md:py-12 text-center">


        {/* Sub Heading */}
        <h3 className="text-2xl md:text-4xl font-bold text-[#358abf] mb-3">
          Order Your <span className="text-[#69972f]">Medicines</span>
        </h3>

        {/* Description */}
        <p className="text-gray-600 font-semibold mb-10">
          Quality medications delivered to your doorstep
        </p>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {/* Eye Care - Active */}
          <div className="flex flex-col items-center justify-center w-full lg:w-[50%] rounded-2xl text-white transform hover:scale-105 transition-all">
            <img src={medicines} alt="" />
          </div>
        </div>



        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {product &&
            product.map((product) => {
              const style = getStockStyle(product.stock);

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 relative"
                >
                  {/* Discount Badge */}
                  {product.actualPrice && (
                    <div className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {Math.round(
                        ((product.actualPrice - product.sellingPrice) /
                          product.actualPrice) *
                        100
                      )}
                      % OFF
                    </div>
                  )}

                  {/* Wishlist Icon */}
                  <button className="absolute top-3 left-3 bg-white p-1.5 rounded-full shadow-sm hover:bg-pink-50 transition">
                    <Heart className="w-4 h-4 text-pink-500" />
                  </button>

                  {/* Product Image */}
                  <div className="relative bg-gray-50 flex items-center justify-center">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="object-contain h-full"
                    />

                    {/* Stock Badge (bottom-left of image) */}
                    <p
                      className={`absolute bottom-3 left-3 text-xs font-medium px-2 py-1 rounded-full ${style.textColor} ${style.bgColor}`}
                    >
                      {style.text}
                    </p>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 p-4 text-left">
                    <Link to={`/product_details/${product._id}`}>
                      <h3 className="font-semibold text-[#2D3748] text-base mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                        {product.description.split(" ").slice(0, 10).join(" ")}
                        {product.description.split(" ").length > 10 ? "..." : ""}
                      </p>
                    </Link>

                    {/* Price & Stock */}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="text-[#007BFF] font-extrabold text-xl">
                          ${product.sellingPrice}
                        </span>
                        {product.actualPrice && (
                          <span className="text-gray-400 text-sm line-through ml-2">
                            ${product.actualPrice}
                          </span>
                        )}
                      </div>


                    </div>

                    {/* Cart Section */}
                    <div className="mt-auto space-y-2">
                      {(() => {
                        const cartItem = getCartItem(product._id);
                        if (cartItem && cartItem.quantity > 0) {
                          return (
                            <>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(product._id, -1)
                                  }
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center font-medium text-sm">
                                  {cartItem.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(product._id, 1)
                                  }
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <Link to="/cart">
                                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold hover:from-green-600 hover:to-green-700 transition">
                                  <Check className="w-4 h-4" />
                                  Go to Cart
                                </button>
                              </Link>
                            </>
                          );
                        } else {
                          return (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAddToCart(product)}
                                className={`cursor-pointer w-1/2 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-1 transition ${product.stock === "Out of Stock"
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "border-blue-500 text-blue-600 hover:bg-blue-50"
                                  }`}
                                disabled={product.stock <= "0"}
                              >
                                <ShoppingCart className="h-4 w-4" />
                                Add to Cart
                              </button>
                              <button onClick={() => handleBuyNow(product)} className="cursor-pointer w-1/2 bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-semibold hover:opacity-90 transition">
                                <ShoppingCart className="h-4 w-4" />
                                Buy Now
                              </button>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        {/* Filter Bar */}





        {/* View All Medicines Button */}
        <div className="flex justify-center mt-12">
          <Link to="/medicines">
            <button className="px-5 py-2 cursor-pointer border bg-white text-black font-bold rounded-md hover:bg-blue-50 transition-colors">
              View All Medicines
              <span className="ml-2">→</span>
            </button>
          </Link>
        </div>




      </section>


      {/* Doctor Appointments Section */}
      <section className="bg-gradient-to-b from-[#f0f6fe] to-[#ecfbfe] py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#358abf] mb-2">
              Book an <span className="text-[#69972f]">Appointment</span>
            </h2>
            <p className="text-gray-600 text-lg font-semibold">
              Consult with our expert therapists
            </p>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors &&
              doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Doctor Image */}
                  <div className="w-full h-64 flex items-center justify-center bg-gray-50 overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>


                  {/* Doctor Details */}
                  <div className="p-5 text-left">
                    <div className="flex justify-between items-center mb-1 text-sm text-gray-600">
                      <span>{doctor.experience || "7 years of Practice"}</span>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><path fill="currentColor" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7" /></svg>

                        {doctor.location || "Ontario"}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-[#0066CC] hover:underline mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {doctor.bio ||
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                    </p>

                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="h-4 w-4"
                      >
                        <path d="M3.5 0a.5.5 0 01.5.5V1h8V.5a.5.5 0 011 0V1h.5A1.5 1.5 0 0115 2.5V3H1v-.5A1.5 1.5 0 012.5 1H3v-.5a.5.5 0 01.5-.5zM1 4h14v9.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 13.5V4zm3 2.5a.5.5 0 011 0V8h6V6.5a.5.5 0 011 0V8h1.5a.5.5 0 010 1H12v1.5a.5.5 0 01-1 0V9H5v1.5a.5.5 0 01-1 0V9H2.5a.5.5 0 010-1H4V6.5z" />
                      </svg>
                      Mon, Tue, Wed, Sun
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-gray-800">
                        $ {doctor.consultationFee || "70"} / Reception
                      </p>
                      <Link to={`/book_appointment/${doctor._id}`}>
                        <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* View All Doctors Button */}
          <div className="flex justify-center mt-12">
            <Link to="/doctors">
              <button className="px-5 py-2 cursor-pointer border bg-white text-black font-bold rounded-md hover:bg-blue-50 transition-colors">
                View All Therapists
                <span className="ml-2">→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Add to Cart Success Notification */}
      {showAddToCartNotification && addedProduct && (
        <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 bg-green-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 sm:gap-3 max-w-[90vw] sm:max-w-none">
          <Check className="w-5 h-5" />
          <div>
            <p className="font-medium">{addedProduct.name} added to cart!</p>
            <p className="text-sm opacity-90">Cart now has {cartCount} items</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
