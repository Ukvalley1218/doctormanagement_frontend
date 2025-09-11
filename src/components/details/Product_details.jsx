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
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../apiclient";

const Product_details = () => {
  const { addToCart, cartCount, updateQuantity, items: cartItems } = useCart();
  const navigate = useNavigate();
  const { productId } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showAddToCartNotification, setShowAddToCartNotification] =
    useState(false);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        className={`${size} ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
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
          className={`${size} cursor-pointer ${
            starValue <= (hoveredRating || rating)
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
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image + Product Details Combined Section */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg p-6 shadow-sm">
            {/* Product Images Section */}
            <div className="">
              <div className="mb-4">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-50 xl:h-80 object-contain rounded-lg"
                />
              </div>
              <div className="flex gap-2 justify-center">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-10 xl:h-16 border-2 rounded-lg overflow-hidden ${
                      selectedImage === img
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className=" rounded-lg py-6 xl:ml-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {product.prescriptionRequired
                    ? "Prescription Required"
                    : "Over the Counter"}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${stockStyle.textColor} ${stockStyle.bgColor}`}
                >
                  {stockStyle.text}
                </span>
              </div>

              <h1 className="text-2xl text-left font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 text-left mb-1">
                {product.description}
              </p>
              <p className="text-sm text-left text-gray-500 mb-4">
                By {product.brand} | {product.packSize}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="font-medium text-gray-900">
                  {averageRating}
                </span>
                <span className="text-sm text-gray-600">
                  ({totalReviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold text-black-600">
                    ${product.sellingPrice}
                  </span>
                  {product.actualPrice &&
                    product.actualPrice > product.sellingPrice && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          ${product.actualPrice}
                        </span>
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          {Math.round(
                            ((product.actualPrice - product.sellingPrice) /
                              product.actualPrice) *
                              100
                          )}
                          % OFF
                        </span>
                      </>
                    )}
                </div>
                {product.actualPrice &&
                  product.actualPrice > product.sellingPrice && (
                    <p className="text-sm text-green-600">
                      Save $
                      {(product.actualPrice - product.sellingPrice).toFixed(2)}{" "}
                      on this order
                    </p>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {(() => {
                  if (cartItem && cartItem.quantity > 0) {
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(product._id, cartItem.quantity - 1)
                            }
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium text-lg">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(product._id, cartItem.quantity + 1)
                            }
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <Link to="/cart">
                          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                            <Check className="h-5 w-5" />
                            Go to Cart
                          </button>
                        </Link>
                      </div>
                    );
                  } else {
                    return (
                      <>
                        <button
                          onClick={handleAddToCart}
                          disabled={product.stock <= 0}
                          className={`w-full py-3 rounded-lg cursor-pointer font-medium flex items-center justify-center gap-2 transition-colors ${
                            product.stock <= 0
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                        <button
                          onClick={handleBuyNow}
                          disabled={product.stock <= 0}
                          className={`w-full py-3 cursor-pointer rounded-lg font-medium transition-colors ${
                            product.stock <= 0
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-orange-500 text-white hover:bg-orange-600"
                          }`}
                        >
                          {product.stock <= 0 ? "Out of Stock" : "Buy Now"}
                        </button>
                      </>
                    );
                  }
                })()}
              </div>
            </div>
          </div>

          {/* Delivery Information Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
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

                {/* <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    📅
                  </div>
                  <div>
                    <p className="font-medium text-left">Same Day Delivery</p>
                    <p className="text-sm text-gray-600 text-left">
                      Order before 2 PM
                    </p>
                  </div>
                </div> */}

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

              {/* You might also like */}
              {/* {relatedProducts.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-semibold mb-4 text-left">
                    You might also like
                  </h4>
                  <div className="space-y-3">
                    {relatedProducts.map((relatedProduct) => (
                      <Link
                        key={relatedProduct._id}
                        to={`/product_details/${relatedProduct._id}`}
                      >
                        <div className="flex items-center border border-[#E5E7EB] gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <img
                            src={relatedProduct.mainImage}
                            alt={relatedProduct.name}
                            className="w-12 h-12 object-contain"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm text-left">
                              {relatedProduct.name}
                            </p>
                            <p className="text-xs text-gray-600 text-left">
                              {relatedProduct.description}
                            </p>
                            <p className="text-sm font-semibold text-blue-600 text-left">
                              ${relatedProduct.sellingPrice}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
            {/* Rating Overview Section */}
            <div className="mt-8 bg-white rounded-xl shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Reviews
              </h3>

              {totalReviews > 0 ? (
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Overall Rating */}
                  <div className="flex flex-col items-center md:items-start">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {averageRating}
                    </div>
                    <div className="flex items-center mb-2">
                      {renderStars(Math.round(averageRating), "w-5 h-5")}
                    </div>
                    <p className="text-sm text-gray-600">
                      {totalReviews} total reviews
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div
                        key={rating}
                        className="flex items-center gap-2 mb-1"
                      >
                        <span className="text-sm text-gray-600 w-6">
                          {rating}
                        </span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width:
                                totalReviews > 0
                                  ? `${
                                      (ratingDistribution[rating] /
                                        totalReviews) *
                                      100
                                    }%`
                                  : "0%",
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {ratingDistribution[rating]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-600">
                  <p className="text-lg font-medium">No reviews yet</p>
                  <p className="text-sm">
                    Be the first to review this product!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="border-b border-[#D1D5DB]">
            <nav className="flex space-x-8 px-6">
              {["description", "dosage", "sideeffects"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 cursor-pointer border-b-2 font-medium text-sm capitalize transition-colors ${
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

          <div className="p-6">
            {activeTab === "description" && (
              <div>
                <p className="text-gray-700 text-left mb-4">
                  {product.description}
                </p>
                {product.benefits && (
                  <ul className="space-y-2 text-left text-gray-700">
                    {product.benefits.map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === "dosage" && (
              <div>
                <h4 className="font-semibold text-left mb-3">
                  Dosage Information
                </h4>
                <div className="space-y-3 text-left text-gray-700">
                  {product.dosage ? (
                    <div dangerouslySetInnerHTML={{ __html: product.dosage }} />
                  ) : (
                    <p>Dosage information not available for this product.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "sideeffects" && (
              <div>
                <h4 className="font-semibold text-left mb-3">
                  Possible Side Effects
                </h4>
                <div className="space-y-3 text-left text-gray-700">
                  {product.sideeffects ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: product.sideeffects }}
                    />
                  ) : (
                    <p>
                      Side effects information not available for this product.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="mt-6 bg-white rounded-xl shadow border border-gray-200 p-6">
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
          </div>

          {/* Rating Form */}
          {showRatingForm && (
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
        </div>
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

      <Footer />
    </div>
  );
};

export default Product_details;
