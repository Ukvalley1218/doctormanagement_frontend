import { useState, useEffect } from "react";
import { ShoppingCart, Star, Filter, ChevronDown } from "lucide-react";
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

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriceSort, setSelectedPriceSort] =
    useState("Price: Low to High");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

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

  // Mock product data based on the image
  const products = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      description: "Acetaminophen - Pain Relief & Fever Reducer",
      brand: "By Johnson & Johnson",
      price: 12.99,
      originalPrice: 16.99,
      stock: "In Stock",
      stockColor: "text-green-600",
      background: "bg-[#DCFCE7]",
      image: medicine,
      category: "Pain Relief",
    },
    {
      id: 2,
      name: "Ibuprofen 400mg",
      description: "Anti-Inflammatory & Pain Relief",
      brand: "By MediLabs",
      price: 18.5,
      originalPrice: null,
      stock: "In Stock",
      stockColor: "text-green-600",
      image: medicine1,
      background: "bg-[#DCFCE7]",
      category: "Pain Relief",
    },
    {
      id: 3,
      name: "Vitamin D3 1000IU",
      description: "Bone Health Supplement",
      brand: "By VitaHealth",
      price: 24.99,
      originalPrice: 29.99,
      stock: "Low Stock",
      stockColor: "text-[#854D0E]",
      image: medicine2,
      background: "bg-[#FEF9C3]",
      category: "Vitamins",
    },
    {
      id: 4,
      name: "Aspirin 75mg",
      description: "Heart Health & Blood Thinner",
      brand: "By CardioMed",
      price: 8.75,
      originalPrice: null,
      stock: "In Stock",
      stockColor: "text-green-600",
      image: medicine3,
      background: "bg-[#DCFCE7]",
      category: "Heart Health",
    },
    {
      id: 5,
      name: "Omega-3 Fish Oil",
      description: "Heart & Brain Health",
      brand: "By OceanHealth",
      price: 32.99,
      originalPrice: null,
      stock: "In Stock",
      stockColor: "text-green-600",
      image: medicine4,
      background: "bg-[#DCFCE7]",
      category: "Supplements",
    },
    {
      id: 6,
      name: "Daily Multivitamin",
      description: "Complete Nutritional Support",
      brand: "By NutriMax",
      price: 19.99,
      originalPrice: 24.99,
      stock: "In Stock",
      stockColor: "text-green-600",
      image: medicine5,
      background: "bg-[#DCFCE7]",
      category: "Vitamins",
    },
    {
      id: 7,
      name: "Cough Syrup",
      description: "Respiratory Relief",
      brand: "By RespCare",
      price: 14.5,
      originalPrice: null,
      stock: "In Stock",
      stockColor: "text-green-600",
      image: medicine6,
      background: "bg-[#DCFCE7]",
      category: "Cold & Flu",
    },
    {
      id: 8,
      name: "Antihistamine 25mg",
      description: "Allergy Relief",
      brand: "By AllerFree",
      price: 16.25,
      originalPrice: null,
      stock: "Out of Stock",
      stockColor: "text-red-600",
      image: medicine7,
      background: "bg-[#FEE2E2]",
      category: "Allergy",
    },
  ];

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

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />

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
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <button className="px-6 py-3 bg-[#0066CC] text-white rounded-md flex items-center justify-center hover:bg-blue-700">
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
            <button className="px-6 py-3 border border-[#0066CC] text-[#0066CC] rounded-md flex items-center justify-center hover:bg-blue-50">
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
            <Link to="/medicine">
              <button className="px-5 py-2 cursor-pointer border border-[#0066CC] text-[#0066CC] rounded-md hover:bg-blue-50 transition-colors">
                View All Medicines
              </button>
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="bg-gray-100 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-1/2 object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-left text-[#2D3748] text-lg mb-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-left text-xs mb-1">
                  {product.description} <br /> {product.brand}
                </p>

                {/* Price */}
                <div className="flex flex-row justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-[#2D3748]">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div>
                    <p
                      className={`text-sm font-medium px-2 py-1 rounded ${product.stockColor} ${product.background}`}
                    >
                      {product.stock}
                    </p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                    product.stock === "Out of Stock"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#0066CC] text-white hover:bg-blue-700"
                  }`}
                  disabled={product.stock === "Out of Stock"}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {product.stock === "Out of Stock"
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
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
      <section className="bg-gray-100 py-16">
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
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="flex gap-5">
                <div className="flex justify-center mb-4">
                  <img
                    src={dr}
                    alt="Dr. Rajesh Kumar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-0">
                    Dr. Rajesh Kumar
                  </h3>
                  <p className="text-left">General Physician</p>
                  <div className="flex mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(1)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      4.9 (100 reviews)
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-m mb-4 text-left">
                10+ years experience in general medicine and preventive care
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-[#0066CC]">
                  ₹500/consultation
                </span>
                <span className="text-sm text-[#6B7280]">Available Today</span>
              </div>
              <button className="w-full bg-[#0066CC] text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                Book Appointment
              </button>
            </div>

            {/* Doctor 2 */}
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="flex gap-5">
                <div className="flex justify-center mb-4">
                  <img
                    src={dr1}
                    alt="Dr. Priya Sharma"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748]">
                    Dr. Priya Sharma
                  </h3>
                  <p className="text-left">Cardiologist</p>
                  <div className="flex mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(1)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-left text-gray-600 ml-2">
                      4.8 (89 reviews)
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-m mb-4 text-left">
                Specialist in heart diseases and cardiovascular health
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-[#0066CC]">
                  ₹800/consultation
                </span>
                <span className="text-sm text-[#6B7280]">Next slot: 2 PM</span>
              </div>
              <button className="w-full bg-[#0066CC] text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                Book Appointment
              </button>
            </div>

            {/* Doctor 3 */}
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="flex gap-5">
                <div className="flex justify-center mb-4">
                  <img
                    src={dr2}
                    alt="Dr. Amit Singh"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-0">
                    Dr. Amit Singh
                  </h3>
                  <p className="text-left">Dermatologist</p>

                  <div className="flex justify-center items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(1)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      4.7 (156 reviews)
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-m mb-4 text-left">
                Expert in skin care and dermatological treatments
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-[#0066CC]">
                  ₹600/consultation
                </span>
                <span className="text-sm text-[#6B7280]">
                  Available Tomorrow
                </span>
              </div>
              <button className="w-full bg-[#0066CC] text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                Book Appointment
              </button>
            </div>
          </div>

          {/* View All Doctors Button */}
          <div className="text-center">
            <Link to="/doctor">
              <button className="px-8 py-3 border border-[#0066CC] text-[#0066CC] rounded-md hover:bg-blue-50 transition-colors">
                View All Doctors
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsLoginOpen(false)}
          />
          <div className="relative z-[1000] max-w-5xl w-full max-h-[90vh] overflow-auto rounded-lg shadow-2xl">
            <button
              aria-label="Close login"
              className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow hover:bg-white"
              onClick={() => setIsLoginOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <Login />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
