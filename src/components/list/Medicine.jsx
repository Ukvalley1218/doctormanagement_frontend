import React, { useEffect, useState } from "react";
import medicine from "../../assets/images/medicine.png";
import medicine1 from "../../assets/images/medicine1.png";
import medicine2 from "../../assets/images/medicine2.png";
import medicine3 from "../../assets/images/medicine3.png";
import medicine4 from "../../assets/images/medicine4.png";
import medicine5 from "../../assets/images/medicine5.png";
import medicine6 from "../../assets/images/medicine6.png";
import medicine7 from "../../assets/images/medicine7.png";
import Navbar from "../navigation/Navbar";
import {
  ChevronDown,
  Filter,
  ShoppingCart,
  Heart,
  Eye,
  Activity,
  Thermometer,
  Check,
} from "lucide-react";
import Footer from "../navigation/Footer";
import { Link } from "react-router-dom";

const Medicine = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriceSort, setSelectedPriceSort] =
    useState("Price: Low to High");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNotification, setShowNotification] = useState(true);

  const itemsPerPage = 8;

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
      category: "Heart Care",
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
      category: "Mental Health",
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
      category: "Respiratory",
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
      image: medicine,
      background: "bg-[#DCFCE7]",
      category: "Bone Health",
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
      image: medicine1,
      background: "bg-[#DCFCE7]",
      category: "Heart Care",
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
      image: medicine2,
      background: "bg-[#DCFCE7]",
      category: "Fever",
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
      image: medicine,
      background: "bg-[#DCFCE7]",
      category: "Respiratory",
    },
    {
      id: 8,
      name: "Antihistamine 10mg",
      description: "Allergy Relief",
      brand: "By AllerFree",
      price: 16.25,
      originalPrice: null,
      stock: "Out of Stock",
      stockColor: "text-red-600",
      image: medicine1,
      background: "bg-[#FEE2E2]",
      category: "Mental Health",
    },
    {
      id: 9,
      name: "Calcium Tablets",
      description: "Bone Strength & Density Support",
      brand: "By BoneMax",
      price: 21.99,
      originalPrice: 25.99,
      stock: "In Stock",
      stockColor: "text-green-600",
      image: medicine2,
      background: "bg-[#DCFCE7]",
      category: "Bone Health",
    },
    {
      id: 10,
      name: "Iron Supplements",
      description: "Energy & Blood Health",
      brand: "By VitaPlus",
      price: 17.75,
      originalPrice: null,
      stock: "Low Stock",
      stockColor: "text-[#854D0E]",
      image: medicine,
      background: "bg-[#FEF9C3]",
      category: "Heart Care",
    },
    {
      id: 11,
      name: "Fever Reducer",
      description: "Fast Acting Temperature Control",
      brand: "By QuickRelief",
      price: 11.99,
      originalPrice: 14.99,
      stock: "In Stock",
      stockColor: "text-green-600",
      image: medicine1,
      background: "bg-[#DCFCE7]",
      category: "Fever",
    },
    {
      id: 12,
      name: "Probiotic Capsules",
      description: "Digestive Health Support",
      brand: "By DigestWell",
      price: 29.5,
      originalPrice: null,
      stock: "In Stock",
      stockColor: "text-green-600",
      image: medicine2,
      background: "bg-[#DCFCE7]",
      category: "Bone Health",
    },
    {
      id: 13,
      name: "Melatonin 5mg",
      description: "Natural Sleep Aid",
      brand: "By SleepWell",
      price: 13.25,
      originalPrice: null,
      stock: "In Stock",
      stockColor: "text-green-600",
      image: medicine,
      background: "bg-[#DCFCE7]",
      category: "Mental Health",
    },
    {
      id: 14,
      name: "Zinc Tablets",
      description: "Immune System Booster",
      brand: "By ImmuneMax",
      price: 12.75,
      originalPrice: 15.99,
      stock: "Low Stock",
      stockColor: "text-[#854D0E]",
      image: medicine1,
      background: "bg-[#FEF9C3]",
      category: "Respiratory",
    },
    {
      id: 15,
      name: "Blood Pressure Monitor",
      description: "Digital Home Monitoring",
      brand: "By HealthTrack",
      price: 89.99,
      originalPrice: 109.99,
      stock: "In Stock",
      stockColor: "text-green-600",
      image: medicine2,
      background: "bg-[#DCFCE7]",
      category: "Heart Care",
    },
    {
      id: 16,
      name: "Thermometer Digital",
      description: "Fast & Accurate Temperature",
      brand: "By TempCheck",
      price: 24.99,
      originalPrice: null,
      stock: "Out of Stock",
      stockColor: "text-red-600",
      image: medicine,
      background: "bg-[#FEE2E2]",
      category: "Fever",
    },
  ];

  const categories1 = [
    {
      name: "Heart Care",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
        >
          <path
            fill="#EF4444"
            d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"
          />
        </svg>
      ),
    },
    {
      name: "Mental Health",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
        >
          <path
            fill="#A855F7"
            d="M11 21V2.352A3.45 3.45 0 0 0 9.5 2a3.5 3.5 0 0 0-3.261 2.238A3.5 3.5 0 0 0 4.04 8.015a3.5 3.5 0 0 0-.766 1.128c-.042.1-.064.209-.1.313a3 3 0 0 0-.106.344a3.5 3.5 0 0 0 .02 1.468A4 4 0 0 0 2.3 12.5l-.015.036a4 4 0 0 0-.216.779A4 4 0 0 0 2 14q.005.361.072.716a4 4 0 0 0 .235.832l.021.041a4 4 0 0 0 .417.727q.158.22.342.415q.109.113.225.216q.15.137.315.26c.11.081.2.14.308.2l.059.04v.053a3.506 3.506 0 0 0 3.03 3.469a3.426 3.426 0 0 0 4.154.577A.97.97 0 0 1 11 21m10.934-7.68a4 4 0 0 0-.215-.779l-.017-.038a4 4 0 0 0-.79-1.235a3.4 3.4 0 0 0 .017-1.468a3 3 0 0 0-.1-.333c-.034-.108-.057-.22-.1-.324a3.5 3.5 0 0 0-.766-1.128a3.5 3.5 0 0 0-2.202-3.777A3.5 3.5 0 0 0 14.5 2a3.45 3.45 0 0 0-1.5.352V21a.97.97 0 0 1-.184.546a3.426 3.426 0 0 0 4.154-.577A3.506 3.506 0 0 0 20 17.5v-.049l.059-.04q.159-.096.308-.2c.149-.104.214-.169.315-.26q.116-.104.225-.216a4 4 0 0 0 .459-.588q.173-.264.3-.554l.021-.041q.131-.32.205-.659q.019-.086.035-.173q.069-.356.073-.72a4 4 0 0 0-.066-.68"
          />
        </svg>
      ),
    },
    {
      name: "Eye Care",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28.13"
          height="25"
          viewBox="0 0 576 512"
        >
          <path
            fill="#3B82F6"
            d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32M144 256a144 144 0 1 1 288 0a144 144 0 1 1-288 0m144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3"
            stroke-width="13"
            stroke="#3B82F6"
          />
        </svg>
      ),
    },
    {
      name: "Respiratory",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="31.25"
          height="25"
          viewBox="0 0 640 512"
        >
          <path
            fill="#22C55E"
            d="M320 0c17.7 0 32 14.3 32 32v132.1c0 16.4 8.4 31.7 22.2 40.5l9.8 6.2v-45.5C384 127 415 96 453.3 96c21.7 0 42.8 10.2 55.8 28.8c15.4 22.1 44.3 65.4 71 116.9c26.5 50.9 52.4 112.5 59.6 170.3c.2 1.3.2 2.6.2 4v7c0 49.1-39.8 89-89 89q-10.95 0-21.6-2.7l-72.7-18.2C414 480.5 384 442.1 384 398v-73l90.5 57.6c7.5 4.7 17.3 2.5 22.1-4.9s2.5-17.3-4.9-22.1L384 287.1v-.4l-44.1-28.1c-7.3-4.6-13.9-10.1-19.9-16.1c-5.9 6-12.6 11.5-19.9 16.1L256 286.7L161.2 347l-13.5 8.6h-.1c-7.4 4.8-9.6 14.6-4.8 22.1c4.7 7.5 14.6 9.7 22.1 4.9l91.1-58V398c0 44.1-30 82.5-72.7 93.1l-72.7 18.2Q99.95 512 89 512c-49.1 0-89-39.8-89-89v-7c0-1.3.1-2.7.2-4c7.2-57.9 33.1-119.4 59.6-170.3c26.8-51.5 55.6-94.8 71-116.9c13-18.6 34-28.8 55.8-28.8c38.4 0 69.4 31 69.4 69.3v45.5l9.8-6.2c13.8-8.8 22.2-24.1 22.2-40.5V32c0-17.7 14.3-32 32-32"
            stroke-width="13"
            stroke="#22C55E"
          />
        </svg>
      ),
    },
    {
      name: "Bone Health",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 24 24"
        >
          <path
            fill="#F97316"
            d="M8 14a3 3 0 0 1-3 3a3 3 0 0 1-3-3c0-.77.29-1.47.76-2c-.47-.53-.76-1.23-.76-2a3 3 0 0 1 3-3a3 3 0 0 1 3 3c1.33.08 2.67.17 4 .17s2.67-.09 4-.17a3 3 0 0 1 3-3a3 3 0 0 1 3 3c0 .77-.29 1.47-.76 2c.47.53.76 1.23.76 2a3 3 0 0 1-3 3a3 3 0 0 1-3-3c-1.33-.08-2.67-.17-4-.17s-2.67.09-4 .17"
          />
        </svg>
      ),
    },
    {
      name: "Fever",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 512 512"
        >
          <path
            fill="#EAB308"
            d="M96 382.1v-88.8c0-14.9 5.9-29.1 16.4-39.6l21.7-21.7l41 41c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-41-41l46.1-46.1l41 41c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-41-41L294.1 72l41 41c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-41-41l7.8-7.8C355.2 10.9 381.4.1 408.8.1C465.8.1 512 46.3 512 103.3c0 27.4-10.9 53.6-30.2 73L258.3 399.6a55.92 55.92 0 0 1-39.6 16.4h-88.8l-89 89c-9.4 9.4-24.6 9.4-33.9 0s-9.3-24.6 0-34l89-89z"
            stroke-width="13"
            stroke="#EAB308"
          />
        </svg>
      ),
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

  const filteredProducts =
    selectedCategory === "All Categories"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPaginationNumbers = () => {
    const numbers = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        numbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        numbers.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        numbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return numbers;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />

      {/* Category Navigation */}
      <div className="bg-white mt-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:flex lg:flex-wrap lg:justify-center gap-4 overflow-x-auto lg:overflow-visible">
            {categories1.map((category) => {
              const isActive = selectedCategory === category.name;
              return (
                <button
                  key={category.name}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setCurrentPage(1);
                  }}
                  className={`flex flex-col items-center space-y-2 p-3 md:p-5 md:px-15 border border-[#E5E7EB] rounded-lg min-w-[90px] transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-2 border-blue-200"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <div>{category.icon}</div>
                  <span className="text-xs sm:text-sm font-medium text-center">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-0 mb-10">
        {/* Filter Bar */}
        <div className="bg-white rounded-lg p-4 mb-6">
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
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentProducts.map((product) => (
            <Link to="/product_details">
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="bg-gray-100 h-48 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-left text-[#2D3748] text-lg mb-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-left text-xs mb-3">
                    {product.description} <br />
                    <span className="text-blue-600">{product.brand}</span>
                  </p>

                  {/* Price and Stock */}
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
                        className={`text-xs font-medium px-2 py-1 rounded ${product.stockColor} ${product.background}`}
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
                    onClick={() => setShowNotification(true)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {product.stock === "Out of Stock"
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getPaginationNumbers().map((pageNum, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof pageNum === "number" && handlePageChange(pageNum)
                }
                disabled={pageNum === "..."}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pageNum === currentPage
                    ? "bg-blue-600 text-white"
                    : pageNum === "..."
                    ? "bg-white text-gray-400 cursor-default"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        )}
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
};

export default Medicine;
