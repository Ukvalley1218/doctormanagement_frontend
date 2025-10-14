import React, { useEffect, useState, useMemo } from "react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Check,
  ShoppingBag,
  Package,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Login from "../auth/Login";
import apiClient from "../../../apiclient";

const Cart = () => {
  const navigate = useNavigate();
  const {
    items: cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    setDeliveryOption,
    promoCode,
    deliveryOption,
    deliveryFee,
  } = useCart();

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [promodiscount, setpromodiscount] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    apartment: "",
    landmark: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [errors, setErrors] = useState({}); // Validation errors

  const { isLoggedIn } = useAuth();

  // Fetch user + setting data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const requests = [];

        if (userId) {
          requests.push(apiClient.get(`/users/${userId}`));
        } else {
          requests.push(Promise.resolve(null));
        }

        requests.push(apiClient.get(`/admin/setting`));

        const [userRes, settingRes] = await Promise.all(requests);

        if (userRes) {
          setUser(userRes.data);
          setForm((prev) => ({
            ...prev,
            name: userRes?.data?.name || "",
            email: userRes?.data?.email || "",
            phone: userRes?.data?.phone || "",
            address: userRes?.data?.address?.address || "",
            apartment: userRes?.data?.address?.apartment || "",
            city: userRes?.data?.address?.city || "",
            landmark: userRes?.data?.address?.landmark || "",
            state: userRes?.data?.address?.state || "",
            zip: userRes?.data?.address?.zip || "",
          }));
        }

        setSetting(settingRes.data);
      } catch (error) {
        console.error("Error fetching data:", error.response || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Currency formatter
  const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

  // Calculate item discounted price
  // Calculate item discounted price with both user discount and promo discount
  const getItemPrice = (item) => {
    let totalDiscount = 0;

    if (user?.userDiscount) totalDiscount += user.userDiscount;
    if (promodiscount) totalDiscount += promodiscount;

    if (totalDiscount > 0) {
      const discountAmount = (item.actualPrice * totalDiscount) / 100;
      const discountedPrice = item.actualPrice - discountAmount;
      return discountedPrice * item.quantity;
    }

    return item.sellingPrice * item.quantity;
  };

  // Totals
  const actualTotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + item.actualPrice * item.quantity,
      0
    );
  }, [cartItems]);

  const finalAmount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + getItemPrice(item), 0);
  }, [cartItems, user, promodiscount]);

  const discountAmount = useMemo(() => {
    return actualTotal - finalAmount;
  }, [actualTotal, finalAmount]);

  // const totalamount = useMemo(() => {
  //   return finalAmount + (setting && setting[0]?.deliverfee);
  // }, [finalAmount, setting]);

  const totalamount = useMemo(() => {
    // Delivery fee logic
    const deliveryFee =
      actualTotal > 25 ? 0 : setting && setting[0]?.deliverfee;

    return finalAmount + deliveryFee;
  }, [finalAmount, setting, actualTotal]);


  // Apply promo code
  const handleApplyPromoCode = async () => {
    if (promoCodeInput.trim()) {
      const promo = await applyPromoCode(promoCodeInput.trim());
      console.log(promo);
      setpromodiscount(promo);
      setPromoCodeInput("");
    }
  };

  // Validation
  const validateForm = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{7,15}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.zip.trim()) {
      newErrors.zip = "Zip code is required";
    } else if (!/^\d{4,10}$/.test(form.zip)) {
      newErrors.zip = "Enter a valid zip code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setSubmit(true);
      const updatePayload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: {
          apartment: form.apartment,
          landmark: form.landmark,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
        },
      };

      await apiClient.put(`/users/${user._id}`, updatePayload);

      const session_id = localStorage.getItem("sessionId");

      const deliveryFee = actualTotal > 25 ? 0 : setting[0]?.deliverfee || 0;
      const placeOrderPayload = {
        shippingDetails: { ...form },
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        totalPrice: totalamount,
        deliverfee: deliveryFee,
        session_id,
        discountAmount: discountAmount,
        productValue: actualTotal,
      };

      await apiClient.post(`/orders`, placeOrderPayload);

      setOrderPlaced(true);
      navigate("/checkout-success");
      localStorage.removeItem("cart");
      localStorage.removeItem("sessionId");

      setTimeout(() => {
        setOrderPlaced(false);
        setShowCheckout(false);
        clearCart();
      }, 2000);
    } catch (error) {
      console.error("Order placement failed:", error);
      alert(
        error?.response?.data?.message ||
        "Unable to update this try again later"
      );
    } finally {
      setSubmit(false);
    }
  };

  // Loader UI
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

  // Empty Cart Design
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Header */}
            <div className="border-b border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">
                  Shopping Cart
                </h1>
              </div>
            </div>

            {/* Empty State Content */}
            <div className="p-12 text-center">
              <div className="max-w-md mx-auto">
                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Your cart is empty
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-8 leading-relaxed">
                  No products have been added to your cart yet. Browse our
                  catalog and discover great deals on medicines and healthcare
                  products.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Link to="/medicines">
                    <button className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                      <Package className="w-5 h-5" />
                      Browse Products
                    </button>
                  </Link>

                  <Link to="/">
                    <button className="w-full border mt-3 cursor-pointer border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Home
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="border-t border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-50 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    Easy Shopping
                  </h3>
                  <p className="text-sm text-gray-600">
                    Browse and add products to cart with ease
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-50 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    Fast Delivery
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quick and reliable delivery to your doorstep
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-50 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    Quality Products
                  </h3>
                  <p className="text-sm text-gray-600">
                    Authentic medicines from trusted sources
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Cart Items and Order Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Shopping Cart
              </h2>
              <span className="text-gray-500 text-sm">
                {cartItems.length} items
              </span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 sm:pb-0 sm:flex-col sm:gap-4 sm:overflow-visible">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-100 rounded-lg bg-white"
                >
                  <img
                    src={item.mainImage}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mx-auto sm:mx-0"
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-gray-500">{item.pack}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex justify-center items-center gap-2 sm:gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-center sm:text-right min-w-[80px]">
                    <div className="font-semibold text-blue-600 text-sm sm:text-base">
                      {formatCurrency(getItemPrice(item))}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 line-through">
                      {formatCurrency(item.actualPrice * item.quantity)}
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 p-1 sm:p-2 self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-4 border-t">
              <Link to="/medicines">
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm sm:text-base">
                  <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </button>
              </Link>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm sm:text-base"
                >
                  <Trash2 className="w-4 h-4" /> Clear Cart
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Product Value</span>
                <span>{formatCurrency(actualTotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Discount (
                    {[
                      user?.userDiscount ? `${user.userDiscount}% user` : null,
                      promodiscount?.discount
                        ? `${promodiscount.discount}% promo`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" + ")}
                    )
                  </span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                {actualTotal > 25 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span>{formatCurrency(setting && setting[0]?.deliverfee)}</span>
                )}
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(totalamount)}</span>
              </div>
            </div>

            {/* Promo */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleApplyPromoCode}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Apply
                </button>
              </div>
              {promoCode && (
                <p className="text-sm text-green-600 mt-2">
                  Promo code "{promoCode}" applied!
                </p>
              )}
            </div>

            {/* Checkout */}
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setIsLoginOpen(true);
                  return;
                }
                setShowCheckout(true);
              }}
              disabled={cartItems.length === 0}
              className={`w-full py-3 rounded-md font-medium flex items-center justify-center gap-2 ${cartItems.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length === 0 ? "Cart is Empty" : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">Checkout</h2>

            {/* Totals */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Product Value:</span>
                <span>{formatCurrency(actualTotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount{` (${user?.userDiscount}%)`}:</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>{formatCurrency(setting && setting[0].deliverfee)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(totalamount)}</span>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form?.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={form?.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={form?.phone || ""}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <input
                type="text"
                placeholder="Flat / Apartment / House No."
                value={form?.apartment || ""}
                onChange={(e) =>
                  setForm({ ...form, apartment: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Landmark"
                value={form?.landmark || ""}
                onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <div>
                <input
                  type="text"
                  placeholder="Address (Area and Street)"
                  value={form?.address || ""}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="City"
                    value={form?.city || ""}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="px-3 w-full py-2 border border-gray-300 rounded-md"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="State"
                    value={form?.state || ""}
                    onChange={(e) =>
                      setForm({ ...form, state: e.target.value })
                    }
                    className="px-3 w-full py-2 border border-gray-300 rounded-md"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Zip / Postal Code"
                  value={form?.zip || ""}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.zip && (
                  <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={submit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {submit ? "Submitting..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Success Toast */}
      {orderPlaced && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <Check className="w-5 h-5" />
          <div>
            <p className="font-medium">Order placed successfully!</p>
            <p className="text-sm opacity-90">Thank you for your purchase</p>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[999] flex items-center p-2 justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsLoginOpen(false)}
          />
          <div className="relative z-[1000] max-w-5xl w-full max-h-[90vh] overflow-auto rounded-lg shadow-2xl bg-white">
            <button
              aria-label="Close login"
              className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow hover:bg-white"
              onClick={() => setIsLoginOpen(false)}
            >
              ✕
            </button>
            <Login
              onLoginSuccess={() => {
                setIsLoginOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
