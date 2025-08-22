import React, { useEffect, useState } from "react";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";
import Login from "../auth/Login";
import dr from "../../assets/images/dr.png";
import dr1 from "../../assets/images/dr1.png";
import dr2 from "../../assets/images/dr2.png";
import { Star, MapPin, Clock, DollarSign, ChevronDown } from "lucide-react";

const Doctors = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriceSort, setSelectedPriceSort] =
    useState("Price: Low to High");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Rating");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Doctors data
  const doctorsData = [
    {
      id: 1,
      name: "Dr. John Smith",
      specialty: "Cardiologist",
      rating: 4.9,
      reviews: 127,
      location: "Downtown Medical Center",
      availability: "Next available: Today 2:30 PM",
      price: 500,
      image: dr,
    },
    {
      id: 2,
      name: "Dr. John Smith",
      specialty: "Cardiologist",
      rating: 4.9,
      reviews: 127,
      location: "Downtown Medical Center",
      availability: "Next available: Today 2:30 PM",
      price: 500,
      image: dr1,
    },
    {
      id: 3,
      name: "Dr. John Smith",
      specialty: "Cardiologist",
      rating: 4.3,
      reviews: 127,
      location: "Downtown Medical Center",
      availability: "Next available: Today 2:30 PM",
      price: 500,
      image: dr2,
    },
    {
      id: 4,
      name: "Dr. Emily Davis",
      specialty: "Pediatrician",
      rating: 4.6,
      reviews: 203,
      location: "Children's Medical Center",
      availability: "Next available: Monday 11:30 AM",
      price: 400,
      image: dr,
    },
    {
      id: 5,
      name: "Dr. Emily Davis",
      specialty: "Pediatrician",
      rating: 4.6,
      reviews: 203,
      location: "Children's Medical Center",
      availability: "Next available: Monday 11:30 AM",
      price: 400,
      image: dr1,
    },
    {
      id: 6,
      name: "Dr. Emily Davis",
      specialty: "Pediatrician",
      rating: 4.6,
      reviews: 203,
      location: "Children's Medical Center",
      availability: "Next available: Monday 11:30 AM",
      price: 400,
      image: dr2,
    },
    {
      id: 7,
      name: "Dr. Emily Davis",
      specialty: "Pediatrician",
      rating: 4.5,
      reviews: 203,
      location: "Children's Medical Center",
      availability: "Next available: Monday 11:30 AM",
      price: 300,
      image: dr,
    },
    {
      id: 8,
      name: "Dr. Emily Davis",
      specialty: "Pediatrician",
      rating: 4.6,
      reviews: 203,
      location: "Children's Medical Center",
      availability: "Next available: Monday 11:30 AM",
      price: 300,
      image: dr1,
    },
    {
      id: 9,
      name: "Dr. Emily Davis",
      specialty: "Pediatrician",
      rating: 4.6,
      reviews: 203,
      location: "Children's Medical Center",
      availability: "Next available: Monday 11:30 AM",
      price: 300,
      image: dr2,
    },
  ];

  const doctorsPerPage = 6;
  const totalPages = Math.ceil(doctorsData.length / doctorsPerPage);

  // Slice data for current page
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctorsData.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const categories = [
    "All Categories",
    "Cardiologist",
    "Pediatrician",
    "Dermatologist",
    "General Physician",
  ];
  const sortOptions = [
    "Rating",
    "Price: Low to High",
    "Price: High to Low",
    "Reviews",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />

      {/* Search and Filter Section */}
      <section className="bg-white pt-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl text-left md:text-2xl font-bold text-[#2D3748]">
              Available Doctors (24 results)
            </p>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                className="flex items-center gap-2 px-2 py-2 md:px-4 md:py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs">Sort by {sortBy}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showPriceDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setShowPriceDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Doctor Results Section */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-left text-gray-900 text-sm">
                        {doctor.name}
                      </h3>
                      <p className="text-gray-600 text-left text-sm">
                        {doctor.specialty}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900 ml-1">
                          {doctor.rating}
                        </span>
                        <span className="text-sm text-gray-600 ml-1">
                          ({doctor.reviews})
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900 ml-1">
                      {doctor.rating}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">
                      ({doctor.reviews})
                    </span>
                  </div> */}
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {doctor.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {doctor.availability}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-lg font-bold text-[#0066CC]">
                      ${doctor.price} consultation
                    </span>
                  </div>
                  <button className="w-full bg-[#4285F4] text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-2 rounded-md ${
                  currentPage === index + 1
                    ? "bg-[#4285F4] text-white"
                    : "hover:bg-gray-200 transition-colors"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </section>

      <Footer />

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
              ✕
            </button>
            <Login />
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
