import React, { useEffect, useState } from "react";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";
import Login from "../auth/Login";
import dr from "../../assets/images/dr.png";
import dr1 from "../../assets/images/dr1.png";
import dr2 from "../../assets/images/dr2.png";
import { Star, MapPin, Clock, DollarSign, ChevronDown } from "lucide-react";
import apiClient from "../../../apiclient";
import { Link } from "react-router-dom";

const Doctors = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriceSort, setSelectedPriceSort] =
    useState("Price: Low to High");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [sortBy, setSortBy] = useState("Rating");
  const [currentPage, setCurrentPage] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Server-side pagination state
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const doctorsPerPage = 10;

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

  // Server-side pagination API call
  const fetchdoctordata = async (page = 1, search = "", sort = "Rating") => {
    try {
      setLoading(true);
      
      // Build query parameters for server-side pagination
      const params = new URLSearchParams({
        page: page.toString(),
        limit: doctorsPerPage.toString(),
        search: search.trim(),
        sortBy: sort
      });

      const response = await apiClient.get(`/doctors?${params}`);
      
      console.log(response.data);
      
      // Assuming your API returns something like:
      // {
      //   doctors: [...],
      //   totalCount: 50,
      //   currentPage: 1,
      //   totalPages: 9
      // }
      
      setDoctors(response.data.doctors || []);
      setTotalDoctors(response.data.totalDoctors || 0);
      setTotalPages(response.data.totalPages || 0);
      
      // If your API doesn't return totalPages, calculate it
      if (!response.data.totalPages && response.data.totalCount) {
        setTotalPages(Math.ceil(response.data.totalCount / doctorsPerPage));
      }
      
    } catch (error) {
      console.log(error);
      setDoctors([]);
      setTotalDoctors(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchdoctordata(currentPage, searchQuery, sortBy);
  }, [currentPage, searchQuery, sortBy]);

  // Listen for search events from navbar
  useEffect(() => {
    const handleSearch = (event) => {
      setSearchQuery(event.detail);
      setCurrentPage(1); // Reset to first page on search
    };

    window.addEventListener("search", handleSearch);
    return () => window.removeEventListener("search", handleSearch);
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page on sort change
    setShowPriceDropdown(false);
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

  // Loading UI while fetching data
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
    <div className="min-h-screen">
      {/* Search and Filter Section */}
      <section className="pt-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl text-left md:text-2xl font-bold text-[#2D3748]">
              Available Doctors ({totalDoctors} results)
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
                      onClick={() => handleSortChange(option)}
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
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {!doctors || doctors.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No doctors found
                </div>
                <p className="text-gray-400">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/book_appointment/${doctor._id}`}>
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
                            <span className="text-sm font-medium text-gray-900">
                              {doctor.rating}
                            </span>
                            <span className="text-sm text-gray-600">
                              (100 Reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {doctor.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-lg font-bold text-[#0066CC]">
                          ${doctor.consultationFee} consultation
                        </span>
                      </div>
                      <button className="w-full bg-[#4285F4] text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium">
                        Book Appointment
                      </button>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* Pagination - Only show if there are multiple pages */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="p-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </button>
            </div>
          )}

          {/* Page Info */}
          {totalPages > 1 && (
            <div className="text-center mt-4 text-sm text-gray-600">
              Showing {Math.min((currentPage - 1) * doctorsPerPage + 1, totalDoctors)} - {Math.min(currentPage * doctorsPerPage, totalDoctors)} of {totalDoctors} doctors (Page {currentPage} of {totalPages})
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Doctors;