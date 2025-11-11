import React, { useState, useEffect } from "react";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";
import Login from "../auth/Login";
import medicine from "../../assets/images/medicine.png";
import medicine1 from "../../assets/images/medicine1.png";
import medicine2 from "../../assets/images/medicine2.png";
import { useCart } from "../../contexts/CartContext";
import {
  Check,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  User,
  ThumbsUp,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../apiclient";

const Product_details = () => {
  const { addToCart, cartCount, updateQuantity, items: cartItems } = useCart();
  const navigate = useNavigate();
  const { productId } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddToCartNotification, setShowAddToCartNotification] =
    useState(false);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isImageOpen, setIsImageOpen] = useState(false);


  // Rating system states
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/products/${productId}`);
        setProduct(response.data);

        setSelectedImage(response.data.mainImage);

        // Set reviews from product data or use empty array
        setReviews(response.data.reviews || []);

        // Fetch related products (same category)
        const relatedResponse = await apiClient.get("/products", {
          params: {
            category: response.data.category,
            limit: 3,
            exclude: productId,
          },
        });
        setRelatedProducts(relatedResponse.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const productImages = product
    ? [product.mainImage, ...(product.images || [])]
    : [medicine, medicine1, medicine2];

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product);
    setShowAddToCartNotification(true);
    setTimeout(() => {
      setShowAddToCartNotification(false);
    }, 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;

    addToCart(product);
    navigate("/cart");
  };

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

  // Rating system functions
  const renderStars = (rating, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
      />
    ));
  };

  const renderInteractiveStars = (
    rating,
    setRating,
    isInteractive = false,
    size = "w-5 h-5"
  ) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <Star
          key={index}
          onClick={() => isInteractive && setRating(starValue)}
          onMouseEnter={() => isInteractive && setHoveredRating(starValue)}
          onMouseLeave={() => isInteractive && setHoveredRating(0)}
          className={`${size} cursor-pointer ${starValue <= (hoveredRating || rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
            }`}
        />
      );
    });
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingRating(true);

      const response = await apiClient.post(`/products/${productId}/reviews`, {
        rating: userRating,
        comment: userComment,
      });

      console.log(response.data);
      alert("Review Submitted Successfully");

      // Reset form after submit
      setUserRating(0);
      setUserComment("");
      setShowRatingForm(false);

      // Update reviews immediately
      setReviews((prev) => [
        {
          id: prev.length + 1,
          name: "You", // Replace with logged-in user if available
          rating: userRating,
          comment: userComment,
          createdAt: new Date().toISOString(),
          verified: false,
        },
        ...prev,
      ]);
    } catch (error) {
      console.log(error.response);
      if (error?.response?.data?.msg == "No token, access denied") {
        alert("Login For Review Medicine");
      } else {
        alert(error?.response?.data?.msg || "Failed To Submit Review");
      }
    } finally {
      setSubmittingRating(false);
    }
  };

  // form 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await apiClient.post("/form", formData);
      console.log(res)
      setMessage("✅ Your query has been submitted successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setMessage("❌ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };






  // Calculate rating statistics
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      ).toFixed(1)
      : 0;
  const ratingDistribution = getRatingDistribution();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <Link
            to="/medicine"
            className="text-blue-600 hover:underline mt-2 block"
          >
            Back to Medicines
          </Link>
        </div>
      </div>
    );
  }

  const stockStyle = getStockStyle(product.stock);
  const cartItem = cartItems.find((item) => item._id === product._id);

  return (
    <div className="min-h-screen">
      <div className="mx-4 mt-4">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE — IMAGE + CONTACT + INFO */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="relative bg-white rounded-2xl shadow flex flex-col items-center">
              {product.actualPrice > product.sellingPrice && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                  -{Math.round(((product.actualPrice - product.sellingPrice) / product.actualPrice) * 100)}%
                </span>
              )}

              {product.prescriptionRequired && (
                <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                  RX
                </span>
              )}

              <div className="relative w-full h-72 rounded-xl overflow-hidden cursor-pointer" onClick={() => setIsImageOpen(true)}>
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>


            {/* Contact Form */}
            <div className="bg-gradient-to-br from-[#eaf3fd] to-[#e7f7f6] p-6 rounded-3xl shadow-sm w-full h-fit">
              <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
                Have any Question?
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#d5d8d8] rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#d5d8d8] rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone No"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#d5d8d8] rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <textarea name="message" placeholder="How We Can Help You" value={formData.message} onChange={handleChange} required id=""
                  className="w-full border border-[#d5d8d8] rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                ></textarea>

                <button
                  type="submit"
                  disabled={loading}
                  className={`cursor-pointer w-full bg-gradient-to-r from-[#378bba] to-[#64963c] text-white py-2 rounded-xl font-semibold transition-all ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                    }`}
                >
                  {loading ? "Submitting..." : "Contact us"}
                </button>

                {message && (
                  <p
                    className={`text-sm text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>


          </div>

          {/* CENTER — PRODUCT DETAILS */}
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">{product.brand || "HealCure Pharma"}</h3>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 mt-1">{product.description || "Promotes overall wellness and hormonal balance"}</p>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(Math.round(averageRating))}</div>
              <span className="text-gray-700 font-medium">{averageRating}</span>
              <span className="text-sm text-gray-500">({totalReviews} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">${product.sellingPrice}</span>
              {product.actualPrice > product.sellingPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">${product.actualPrice}</span>
                  <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">Save 15%</span>
                </>
              )}
            </div>

            {/* Quantity (hidden until Add to Cart) */}
            {cartItem && cartItem.quantity > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-sm sm:text-base font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center gap-3">
                  {/* Minus Button */}
                  <button
                    onClick={() => updateQuantity(product._id, cartItem.quantity - 1)}
                    className="cursor-pointer w-12 h-12 flex items-center justify-center text-black border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  {/* Quantity Display */}
                  <div className="w-12 h-12 flex items-center justify-center text-lg font-medium text-black border border-gray-300 rounded-xl">
                    {cartItem.quantity}
                  </div>

                  {/* Plus Button */}
                  <button
                    onClick={() => updateQuantity(product._id, cartItem.quantity + 1)}
                    className="cursor-pointer w-12 h-12 flex items-center justify-center text-black border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}


            {/* Buttons */}
            <div className="space-y-3">
              {cartItem && cartItem.quantity > 0 ? (
                <Link to="/cart">
                  <button className="cursor-pointer w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <Check className="h-5 w-5" /> Go to Cart
                  </button>
                </Link>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`cursor-pointer w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${product.stock <= 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#3a81f5] text-white hover:bg-blue-700"
                      }`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className={`cursor-pointer w-full py-3 rounded-lg font-semibold transition-colors ${product.stock <= 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#0fb880] text-white hover:bg-green-700"
                      }`}
                  >
                    {product.stock <= 0 ? "Out of Stock" : "Buy Now"}
                  </button>
                </>
              )}
            </div>
            {/* Medicine Info */}
            <div className="bg-blue-50 p-6 rounded-2xl shadow-sm">
  <h3 className="text-base sm:text-lg font-semibold mb-2">
    Medicine Information
  </h3>

  <p className="text-gray-700 text-xs sm:text-sm mb-4">
    {product.description
      ? product.description
      : "No description available for this product."}
  </p>

  <div className="grid grid-cols-2 gap-y-2 text-xs sm:text-sm">
    <span className="text-gray-500">Manufacturer:</span>
    <span className="font-medium text-gray-800 lg:text-right">
      {product.manufacture || "N/A"}
    </span>

    <span className="text-gray-500">SKU:</span>
    <span className="font-medium text-gray-800 lg:text-right">
  {product._id ? `${product._id.slice(0, 12)}...` : ""}
</span>

    <span className="text-gray-500">Expiry:</span>
    <span className="font-medium text-gray-800 lg:text-right">
      {product.expiry
        ? new Date(product.expiry).toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
          })
        : "N/A"}
    </span>
  </div>
</div>


            {/* Badges */}
            <div className="grid grid-cols-2 gap-3">
              {/* Verified Medicine */}
              <div className="flex items-center bg-green-50 text-green-800 px-4 py-2 rounded-xl">
                <div className="text-xl mr-2 bg-green-300 rounded-full p-1"><Shield/></div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">Verified Medicine</span>
                  <span className="text-xs text-gray-500">FDA Approved</span>
                </div>
              </div>

              {/* Fast Delivery */}
              <div className="flex items-center bg-blue-50 text-blue-800 px-4 py-2 rounded-xl">
                <div className="text-xl mr-2 bg-blue-300 rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="M2 3v-.5a.5.5 0 0 0-.5.5zm11 0h.5a.5.5 0 0 0-.5-.5zm0 6v-.5a.5.5 0 0 0-.5.5zM2 3.5h11v-1H2zM12.5 3v16h1V3zm-10 14V3h-1v14zM13 9.5h5v-1h-5zm8.5 3.5v4h1v-4zm-8 6V9h-1v10zm5.56 1.06a1.5 1.5 0 0 1-2.12 0l-.708.708a2.5 2.5 0 0 0 3.536 0zm-2.12-2.12a1.5 1.5 0 0 1 2.12 0l.708-.708a2.5 2.5 0 0 0-3.536 0zm-9.88 2.12a1.5 1.5 0 0 1-2.12 0l-.708.708a2.5 2.5 0 0 0 3.536 0zm-2.12-2.12a1.5 1.5 0 0 1 2.12 0l.708-.708a2.5 2.5 0 0 0-3.536 0zm14.12 0c.294.292.44.675.44 1.06h1c0-.639-.244-1.28-.732-1.768zM19.5 19c0 .385-.146.768-.44 1.06l.708.708A2.5 2.5 0 0 0 20.5 19zm-3.5-.5h-3v1h3zm.94 1.56A1.5 1.5 0 0 1 16.5 19h-1c0 .639.244 1.28.732 1.768zM16.5 19c0-.385.146-.768.44-1.06l-.708-.708A2.5 2.5 0 0 0 15.5 19zM4.94 20.06A1.5 1.5 0 0 1 4.5 19h-1c0 .639.244 1.28.732 1.768zM4.5 19c0-.385.146-.768.44-1.06l-.708-.708A2.5 2.5 0 0 0 3.5 19zm8.5-.5H8v1h5zm-5.94-.56c.294.292.44.675.44 1.06h1c0-.639-.244-1.28-.732-1.768zM7.5 19c0 .385-.146.768-.44 1.06l.708.708A2.5 2.5 0 0 0 8.5 19zm14-2a1.5 1.5 0 0 1-1.5 1.5v1a2.5 2.5 0 0 0 2.5-2.5zM18 9.5a3.5 3.5 0 0 1 3.5 3.5h1A4.5 4.5 0 0 0 18 8.5zM1.5 17A2.5 2.5 0 0 0 4 19.5v-1A1.5 1.5 0 0 1 2.5 17z" /><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M2 8h3m-3 4h5" stroke-width="1" /></g></svg></div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">Fast Delivery</span>
                  <span className="text-xs text-gray-500">Same day shipping</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — RELATED + SAFETY + DOCTOR */}
          <div className="space-y-6">
            {/* Related Medicines */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-left mb-4">
                Delivery Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    🚚
                  </div>
                  <div>
                    <p className="font-medium text-left">Free Delivery</p>
                    <p className="text-sm text-gray-600 text-left">
                      On orders over $25
                    </p>
                  </div>
                </div>



                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    🔒
                  </div>
                  <div>
                    <p className="font-medium text-left">Secure Payment</p>
                    <p className="text-sm text-gray-600 text-left">
                      SSL encrypted
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Info */}
            <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-left mb-4">Safety Information</h3>
              <div className="space-y-4">
                {/* Safety Item 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <g fill="none">
                        <path
                          stroke="currentColor"
                          strokeWidth="1.5"
                          d="M5.312 10.762C8.23 5.587 9.689 3 12 3s3.77 2.587 6.688 7.762l.364.644c2.425 4.3 3.638 6.45 2.542 8.022S17.786 21 12.364 21h-.728c-5.422 0-8.134 0-9.23-1.572s.117-3.722 2.542-8.022z"
                        />
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="1.5"
                          d="M12 8v5"
                        />
                        <circle cx="12" cy="16" r="1" fill="currentColor" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-left">Prescription Required</p>
                    <p className="text-sm text-gray-600 text-left">
                      Consult your doctor before use
                    </p>
                  </div>
                </div>

                {/* Safety Item 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    ⏰
                  </div>
                  <div>
                    <p className="font-medium text-left">Dosage Timing</p>
                    <p className="text-sm text-gray-600 text-left">
                      Take every 4–6 hours as needed
                    </p>
                  </div>
                </div>

                {/* Safety Item 3 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield/>
                  </div>
                  <div>
                    <p className="font-medium text-left">Secure Packaging</p>
                    <p className="text-sm text-gray-600 text-left">
                      Tamper-proof sealed bottle
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Appointment */}
            <div className="bg-[#f8f9fb] border border-gray-200 rounded-xl p-6 shadow-sm text-center">
              <h3 className="text-lg font-semibold mb-4">Book a Doctor Appointment</h3>
              {/* <button
        className="w-full bg-[#3a81f5] text-white py-2 rounded-lg font-semibold hover:bg-blue-700 mb-3"
      >
        Book Appointment
      </button> */}

              <button
                onClick={() => navigate("/doctors")}
                className="cursor-pointer w-full border bg-[#3a81f5] border-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-50 hover:text-green-700 transition-all"
              >
                See All Doctors
              </button>
            </div>
          </div>
        </div>


        {/* Product Information Tabs */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
  {/* Tabs Navigation */}
  <div className="border-b border-[#D1D5DB] overflow-x-auto">
    <nav className="flex min-w-max sm:min-w-0 space-x-4 sm:space-x-8 px-4 sm:px-6">
      {[
        "overview",
        "dosage & directions",
        "side effects & warnings",
        "customer reviews",
      ].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-3 sm:py-4 px-1 cursor-pointer border-b-2 font-medium text-xs sm:text-sm capitalize transition-colors whitespace-nowrap ${
            activeTab === tab
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.replace("-", " ")}
        </button>
      ))}
    </nav>
  </div>

  {/* Tab Content */}
  <div className="p-4 sm:p-6">
    {/* OVERVIEW */}
    {activeTab === "overview" && (
      <div>
        <h1 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
          Product Overview
        </h1>
        <p className="text-gray-700 text-sm sm:text-base text-left mb-4">
          {product.description}
        </p>
        {product.benefits && (
          <ul className="space-y-2 text-left text-gray-700 text-sm sm:text-base">
            {product.benefits.map((benefit, index) => (
              <li key={index}>• {benefit}</li>
            ))}
          </ul>
        )}
      </div>
    )}

    {/* DOSAGE & DIRECTIONS */}
    {activeTab === "dosage & directions" && (
      <div>
        <h4 className="font-semibold text-left mb-3 text-base sm:text-lg">
          Dosage & Directions
        </h4>
        <div className="space-y-3 text-left text-gray-700 text-sm sm:text-base leading-relaxed">
          {product.dosage ? (
            <div dangerouslySetInnerHTML={{ __html: product.dosage }} />
          ) : (
            <p>Dosage information not available for this product.</p>
          )}
        </div>
      </div>
    )}

    {/* SIDE EFFECTS */}
    {activeTab === "side effects & warnings" && (
      <div>
        <h4 className="font-semibold text-left mb-3 text-base sm:text-lg">
          Possible Side Effects & Warnings
        </h4>
        <div className="space-y-3 text-left text-gray-700 text-sm sm:text-base leading-relaxed">
          {product.sideeffects ? (
            <div
              dangerouslySetInnerHTML={{ __html: product.sideeffects }}
            />
          ) : (
            <p>Side effects information not available for this product.</p>
          )}
        </div>
      </div>
    )}

    {/* CUSTOMER REVIEWS */}
    {activeTab === "customer reviews" && (
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900">
            Recent Reviews
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowRatingForm(!showRatingForm)}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium px-3 py-2 rounded-lg transition"
            >
              Write Review
            </button>
            {reviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="cursor-pointer text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
              >
                {showAllReviews ? "Show Less" : "Show All Reviews"}
              </button>
            )}
          </div>
        </div>

        {/* Rating Form */}
        {showRatingForm && (
          <div className="bg-gray-50 rounded-lg p-4 sm:p-5 mb-6">
            <h5 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Share Your Experience
            </h5>
            <form onSubmit={handleRatingSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex items-center gap-1">
                    {renderInteractiveStars(userRating, setUserRating, true)}
                    <span className="ml-2 text-xs sm:text-sm text-gray-600">
                      {userRating > 0 &&
                        `${userRating} star${userRating > 1 ? "s" : ""}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  placeholder="Share your experience with this product..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {userComment.length}/500 characters
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={submittingRating || userRating === 0}
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  {submittingRating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRatingForm(false);
                    setUserRating(0);
                    setUserComment("");
                  }}
                  className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs sm:text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {totalReviews > 0 ? (
            (showAllReviews ? reviews : reviews.slice(0, 3)).map(
              (review, index) => (
                <div
                  key={review.id || index}
                  className="border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h5 className="font-medium text-gray-900 text-sm sm:text-base">
                          {review.name || review.userName || "Anonymous"}
                        </h5>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            <ThumbsUp className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-xs text-gray-500">
                          {formatDate(review.createdAt || review.date)}
                        </span>
                      </div>

                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="text-center py-6 text-gray-600">
              <p className="text-xs sm:text-sm">
                No reviews yet. Be the first to write one!
              </p>
            </div>
          )}
        </div>

        {!showAllReviews && reviews.length > 3 && (
          <div className="text-center mt-4">
            <p className="text-xs sm:text-sm text-gray-600">
              Showing 3 of {totalReviews} reviews
            </p>
          </div>
        )}
      </div>
    )}
  </div>


        </div>

        {/* Reviews List */}
        {/* <div className="mt-6 bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="lg:text-lg font-semibold text-gray-900">
              Recent Reviews
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRatingForm(!showRatingForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200"
              >
                Write Review
              </button>
              {reviews.length > 3 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {showAllReviews ? "Show Less" : "Show All Reviews"}
                </button>
              )}
            </div>
          </div> */}

        {/* Rating Form */}
        {/* {showRatingForm && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">
                Share Your Experience
              </h5>
              <form onSubmit={handleRatingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex items-center gap-1">
                      {renderInteractiveStars(userRating, setUserRating, true)}
                      <span className="ml-2 text-sm text-gray-600">
                        {userRating > 0 &&
                          `${userRating} star${userRating > 1 ? "s" : ""}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Share your experience with this product..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {userComment.length}/500 characters
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submittingRating || userRating === 0}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    {submittingRating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRatingForm(false);
                      setUserRating(0);
                      setUserComment("");
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {totalReviews > 0 ? (
              (showAllReviews ? reviews : reviews.slice(0, 3)).map(
                (review, index) => (
                  <div
                    key={review.id || index}
                    className="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-gray-900">
                            {review.name || review.userName || "Anonymous"}
                          </h5>
                          {review.verified && (
                            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              <ThumbsUp className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(review.createdAt || review.date)}
                          </span>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="text-center py-6 text-gray-600">
                <p className="text-sm">
                  No reviews yet. Be the first to write one!
                </p>
              </div>
            )}
          </div>

          {!showAllReviews && reviews.length > 3 && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Showing 3 of {totalReviews} reviews
              </p>
            </div>
          )}
        </div> */}
      </section>

      {/* Add to Cart Success Notification */}
      {showAddToCartNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <Check className="w-5 h-5" />
          <div>
            <p className="font-medium">{product.name} added to cart!</p>
            <p className="text-sm opacity-90">Cart now has {cartCount} items</p>
          </div>
        </div>
      )}
      {/* Image Popup */}
      {isImageOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setIsImageOpen(false)} // close on background click
        >
          <div
            className="relative max-w-4xl w-full px-4"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-6 lg:top-[-8px] lg:right-[50px] text-black bg-white hover:text-white rounded-full py-2 px-4 hover:bg-black/70"
              onClick={() => setIsImageOpen(false)}
            >
              ✕
            </button>

            {/* Enlarged Image */}
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Product_details;
