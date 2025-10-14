import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Filter,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  ArrowLeft,
} from "lucide-react";
import Footer from "../navigation/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import apiClient from "../../../apiclient";

const Medicine = () => {
  const { addToCart, cartCount, updateQuantity, items: cartItems } = useCart();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriceSort, setSelectedPriceSort] =
    useState("Price: Low to High");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showAddToCartNotification, setShowAddToCartNotification] =
    useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Server-side pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 8; // items per page

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Server-side pagination API call
  const loadProducts = async (
    page = 1,
    search = "",
    category = "All Categories",
    sort = "Price: Low to High"
  ) => {
    try {
      setLoading(true);

      // Build query parameters for server-side pagination
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        search: search.trim(),
        category: category === "All Categories" ? "" : category,
        sortBy: sort, // ✅ ensure you’re sending this exact key
      });


      const response = await apiClient.get(`/products?${params}`);

      console.log(response.data);



      setProducts(response.data.products || []);
      setTotalProducts(response.data.totalCount || 0);
      setTotalPages(response.data.totalPages || 0);

      // If your API doesn't return totalPages, calculate it
      if (!response.data.totalPages && response.data.totalCount) {
        setTotalPages(Math.ceil(response.data.totalCount / pageSize));
      }
    } catch (error) {
      console.error(
        "Failed to fetch products",
        error.response?.data || error.message
      );
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refetch when parameters change
  useEffect(() => {
    loadProducts(currentPage, searchQuery, selectedCategory, selectedPriceSort);
  }, [currentPage, searchQuery, selectedCategory, selectedPriceSort]);

  // Listen for search events from navbar
  useEffect(() => {
    const handleSearch = (event) => {
      setSearchQuery(event.detail);
      setCurrentPage(1); // Reset to first page on search
    };
    window.addEventListener("search", handleSearch);
    return () => window.removeEventListener("search", handleSearch);
  }, []);

  const getStockStyle = (stock) => {
    if (stock > 20)
      return {
        textColor: "text-green-800",
        bgColor: "bg-green-100",
        text: "In Stock",
      };
    if (stock > 0)
      return {
        textColor: "text-amber-800",
        bgColor: "bg-amber-100",
        text: "Low Stock",
      };
    return {
      textColor: "text-red-800",
      bgColor: "bg-red-100",
      text: "Out Of Stock",
    };
  };

  const categories = [
    "All Categories",
    "ayurvedic",
    "alopathy",
    "homeopathic",
  ];

  const priceSorts = [
    "Price: Low to High",
    "Price: High to Low",
    "Most Popular",
    "Newest",
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProduct(product);
    setShowAddToCartNotification(true);
    setTimeout(() => {
      setShowAddToCartNotification(false);
      setAddedProduct(null);
    }, 3000);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page
    setShowCategoryDropdown(false);
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setSelectedPriceSort(sort);
    setCurrentPage(1); // Reset to first page
    setShowPriceDropdown(false);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
    <div className="min-h-screen">
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-0 mb-10">
        {/* Results Header */}
        {/* <div className="my-4">
          <p className="text-xl md:text-2xl font-bold text-[#2D3748]">
            Available Products ({totalProducts} results)
          </p>
        </div> */}
        <div className="mx-6 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
        {/* Filter Bar */}
        <div className="bg-white rounded-lg p-4 my-6">
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
                      onClick={() => handleCategoryChange(category)}
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
                      onClick={() => handleSortChange(sort)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Button
            <button className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-[#0066CC] text-white rounded-md hover:bg-blue-700">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filter</span>
            </button> */}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {!products || products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No products found
              </div>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            products.map((product) => (
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

                <Link
                  to={`/product_details/${product._id}`}
                  className="flex-1 flex flex-col"
                >
                  <div className="pt-4 px-4 flex-1">
                    <h3 className="font-semibold text-left text-[#2D3748] text-lg mb-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-left text-xs mb-3">
                      {product.description.split(" ").slice(0, 10).join(" ")}
                      {product.description.split(" ").length > 10 ? "..." : ""}<br />
                      <span className="text-blue-600">{product.brand}</span>
                    </p>

                    {/* Price and Stock */}
                  </div>
                </Link>

                {/* Cart Controls */}
                <div className="p-4 mt-auto">
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
                      {(() => {
                        const s = getStockStyle(product.stock);
                        return (
                          <p
                            className={`text-sm font-medium px-3 py-1 rounded-full ${s.textColor} ${s.bgColor}`}
                          >
                            {s.text}
                          </p>
                        );
                      })()}
                    </div>
                  </div>
                  {(() => {
                    const cartItem = cartItems.find(
                      (item) => item._id === product._id
                    );
                    if (cartItem && cartItem.quantity > 0) {
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  product._id,
                                  cartItem.quantity - 1
                                )
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
                                updateQuantity(
                                  product._id,
                                  cartItem.quantity + 1
                                )
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
                    }
                    return (
                      <button
                        className={`w-full py-2 px-4 cursor-pointer rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors ${product.stock <= 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#0066CC] text-white hover:bg-blue-700"
                          }`}
                        disabled={product.stock <= 0}
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    );
                  })()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls - Only show if there are multiple pages */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
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
                className={`px-3 py-2 rounded-md ${currentPage === index + 1
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
            Showing {Math.min((currentPage - 1) * pageSize + 1, totalProducts)}{" "}
            - {Math.min(currentPage * pageSize, totalProducts)} of{" "}
            {totalProducts} products (Page {currentPage} of {totalPages})
          </div>
        )}
      </section>

      <Footer />

      {/* Add to Cart Success Notification */}
      {showAddToCartNotification && addedProduct && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <Check className="w-5 h-5" />
          <div>
            <p className="font-medium">{addedProduct.name} added to cart!</p>
            <p className="text-sm opacity-90">Cart now has {cartCount} items</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicine;
