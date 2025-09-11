import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Star,
  Filter,
  ChevronDown,
  Plus,
  Minus,
  Check,
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
import dr from "../../assets/images/dr.png";
import dr1 from "../../assets/images/dr1.png";
import dr2 from "../../assets/images/dr2.png";
import Navbar from "../navigation/Navbar";
import Login from "../auth/Login";
import Footer from "../navigation/Footer";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import apiClient from "../../../apiclient";

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

  const getCartItem = (productId) => {
    return cartItems.find((item) => item._id === productId);
  };

  const categories = [
    "All Categories",
    "Pain Relief",
    "Vitamins",
    "Heart Health",
    "Supplements",
    "Cold & Flu",
    "Allergy",
  ];
  const priceSorts = [
    "Price: Low to High",
    "Price: High to Low",
    "Most Popular",
    "Newest",
  ];

  const fetchdata = async () => {
    try {
      const response = await apiClient.get("/products");
      console.log(response.data);
      setProduct(response.data.products);
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchdoctordata = async () => {
    try {
      const response = await apiClient.get("/doctors");
      console.log(response.data.doctors);
      setDoctors(response.data.doctors);
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2D3748] mb-6">
            Expert Medical Care You Can{" "}
            <span className="text-[#0066CC]">Trust</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-8">
            Experience world-class healthcare with our team of renowned
            specialists and cutting-edge medical technology.
          </p>
          <div
            className="flex flex-col sm:flex-row 
                space-y-4 sm:space-y-0 sm:space-x-4 
                items-center sm:items-start 
                justify-center md:justify-start"
          >
            <Link to="/doctors">
              <button className="px-6 py-3 bg-[#0066CC] cursor-pointer text-white rounded-md flex items-center justify-center hover:bg-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Find a Doctor
              </button>
            </Link>

            <Link to="/medicines">
              <button className="px-6 py-3 border cursor-pointer border-[#0066CC] text-[#0066CC] rounded-md flex items-center justify-center hover:bg-blue-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Order Medicine
              </button>
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center md:mt-0">
          <div className="relative">
            {/* Doctor Image with responsive sizing */}
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl rounded-lg overflow-hidden mx-auto">
              <img
                src={hero}
                alt="Doctor"
                className="w-full h-auto object-cover shadow-xl"
              />
            </div>

            {/* Rating Section */}
            <div className="absolute bottom-4 md:bottom-5 left-2 md:left-4 bg-white p-3 md:p-4 rounded-lg shadow-lg max-w-xs">
              <div className="flex items-center">
                <div className="text-yellow-400 flex">
                  {[...Array(1)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 md:h-5 md:w-5 fill-current"
                    />
                  ))}
                </div>
                <div className="ml-2 text-left">
                  <span className="text-xs md:text-sm font-semibold text-[#2D3748] block">
                    4.9/5 Rating
                  </span>
                  <p className="text-xs md:text-sm text-[#2D3748] font-semibold">
                    1000+ Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-0">
        {/* Filter Bar */}
        <div className="rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            {/* Category Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 px-4 py-2 w-full sm:w-auto border border-gray-300 rounded-md bg-white hover:bg-gray-50 justify-between"
              >
                <span className="text-sm">{selectedCategory}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-full sm:w-[160px]">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowCategoryDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Sort Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                className="flex items-center gap-2 px-4 py-2 w-full sm:w-auto border border-gray-300 rounded-md bg-white hover:bg-gray-50 justify-between"
              >
                <span className="text-sm">{selectedPriceSort}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showPriceDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-full sm:w-[160px]">
                  {priceSorts.map((sort) => (
                    <button
                      key={sort}
                      onClick={() => {
                        setSelectedPriceSort(sort);
                        setShowPriceDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Button */}
            <button className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-[#0066CC] text-white rounded-md hover:bg-blue-700">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filter</span>
            </button>
          </div>

          {/* View All Medicines Button */}
          <div className="flex justify-center sm:justify-end mt-4 md:-mt-11">
            <Link to="/medicines">
              <button className="px-5 py-2 cursor-pointer border border-[#0066CC] text-[#0066CC] rounded-md hover:bg-blue-50 transition-colors">
                View All Medicines
              </button>
            </Link>
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
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
                >
                  {/* Product Image */}
                  <div className="bg-gray-100 flex items-center justify-center">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-48 md:h-56 object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <Link to={`/product_details/${product._id}`}>
                      <h3 className="font-semibold text-left text-[#2D3748] text-lg mb-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-left text-xs mb-1">
                        {product.description} <br /> {product.brand}
                      </p>

                      {/* Price + Stock */}
                      <div className="flex flex-row justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-[#2D3748]">
                            ${product.sellingPrice}
                          </span>
                          {product.actualPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${product.actualPrice}
                            </span>
                          )}
                        </div>

                        <div>
                          <p
                            className={`text-sm font-medium px-3 py-1 rounded-full ${style.textColor} ${style.bgColor}`}
                          >
                            {style.text}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* Cart Controls pinned at bottom */}
                    <div className="mt-auto">
                      {(() => {
                        const cartItem = getCartItem(product._id);
                        if (cartItem && cartItem.quantity > 0) {
                          return (
                            <div className="space-y-2">
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
                                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm font-medium hover:bg-green-700 transition-colors">
                                  <Check className="h-4 w-4" />
                                  Go to Cart
                                </button>
                              </Link>
                            </div>
                          );
                        } else {
                          return (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className={`w-full cursor-pointer py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                                product.stock === "Out of Stock"
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-[#0066CC] text-white hover:bg-blue-700"
                              }`}
                              disabled={product.stock <= "0"}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              {product.stock <= "0"
                                ? "Out of Stock"
                                : "Add to Cart"}
                            </button>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
      {/* Statistics Section */}
      <section className="bg-[#0066CC] py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">50+</h3>
              <p className="text-sm md:text-base opacity-90">Expert Doctors</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">25k+</h3>
              <p className="text-sm md:text-base opacity-90">
                Patients Treated
              </p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">15</h3>
              <p className="text-sm md:text-base opacity-90">Specialties</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">24/7</h3>
              <p className="text-sm md:text-base opacity-90">Emergency Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Appointments Section */}
      <section className="pb-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D3748] mb-4">
              Book Doctor Appointments
            </h2>
            <p className="text-lg text-gray-600">
              Connect with experienced healthcare professionals
            </p>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Doctor 1 */}
            {doctors &&
              doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white rounded-lg p-6 text-center shadow-md flex flex-col h-full"
                >
                  <div className="lg:flex gap-5">
                    <div className="flex justify-center mb-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl lg:text-left font-semibold text-[#2D3748] mb-0">
                        {doctor.name}
                      </h3>
                      <p className="text-center lg:text-left">
                        {doctor.specialty}
                      </p>
                      <div className="flex justify-center content-center lg:justify-start mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(1)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {doctor.rating} (100 reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-m mb-4 text-center lg:text-left">
                    {doctor.bio}
                  </p>

                  {/* Push bottom section down */}
                  <div className="mt-auto">
                    <div className="lg:flex justify-between items-center mb-4">
                      <div className="text-l font-bold text-[#0066CC]">
                        $ {doctor.consultationFee}/consultation
                      </div>
                      <div className="text-sm text-[#6B7280]">
                        Available Today
                      </div>
                    </div>
                    <Link to={`/book_appointment/${doctor._id}`}>
                      <button className="w-full cursor-pointer bg-[#0066CC] text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Book Appointment
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>

          {/* View All Doctors Button */}
          <div className="text-center">
            <Link to="/doctors">
              <button className="px-8 py-3 cursor-pointer border border-[#0066CC] text-[#0066CC] rounded-md hover:bg-blue-50 transition-colors">
                View All Doctors
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
