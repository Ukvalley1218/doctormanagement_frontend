import React, { useState } from "react";
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";
import Login from "../auth/Login"; // Assuming you have this component
import medicine from "../../assets/images/medicine.png";
import medicine1 from "../../assets/images/medicine1.png";
import medicine2 from "../../assets/images/medicine2.png";

const Product_details = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(medicine);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const productImages = [medicine, medicine1, medicine2];

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const relatedProducts = [
    {
      id: 1,
      name: "Ibuprofen 400mg",
      description: "Pain reliever",
      price: "$8.99",
      image: medicine1,
    },
    {
      id: 2,
      name: "Aspirin 325mg",
      description: "Blood thinner",
      price: "$7.99",
      image: medicine2,
    },
    {
      id: 3,
      name: "Vitamin C 1000mg",
      description: "Immune support",
      price: "$14.99",
      image: medicine,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />

      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image + Product Details Combined Section */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg p-6 shadow-sm">
            {/* Product Images Section */}
            <div className="">
              <div className="mb-4">
                <img
                  src={selectedImage}
                  alt="Paracetamol 500mg"
                  className="w-full h-80 object-contain rounded-lg"
                />
              </div>
              <div className="flex gap-2 justify-center">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 border-2 rounded-lg overflow-hidden ${
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
            <div className=" rounded-lg p-6 ml-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Prescription Required
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  In Stock
                </span>
              </div>

              <h1 className="text-2xl text-left font-bold text-gray-900 mb-2">
                Paracetamol 500mg
              </h1>
              <p className="text-gray-600 text-left mb-1">
                Acetaminophen - Pain Relief & Fever Reducer
              </p>
              <p className="text-sm text-left text-gray-500 mb-4">
                By Johnson & Johnson | 30 Tablets
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  (4.8) 124 reviews
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold text-black-600">
                    $12.99
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    $15.00
                  </span>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    13% OFF
                  </span>
                </div>
                <p className="text-sm text-green-600">
                  Save $2.01 on this order
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center border border-[#D1D5DB] rounded-lg w-fit">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-[#D1D5DB]">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  🛒 Add to Cart
                </button>
                <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Delivery Information Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-left mb-4">Delivery Information</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    🚚
                  </div>
                  <div>
                    <p className="font-medium text-left">Free Delivery</p>
                    <p className="text-sm text-gray-600 text-left">On orders over $25</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    📅
                  </div>
                  <div>
                    <p className="font-medium text-left">Same Day Delivery</p>
                    <p className="text-sm text-gray-600 text-left">Order before 2 PM</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    🔒
                  </div>
                  <div>
                    <p className="font-medium text-left">Secure Payment</p>
                    <p className="text-sm text-gray-600 text-left">SSL encrypted</p>
                  </div>
                </div>
              </div>

              {/* You might also like */}
              <div className="mt-8">
                <h4 className="font-semibold mb-4 text-left">You might also like</h4>
                <div className="space-y-3">
                  {relatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center border border-[#E5E7EB] gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-contain"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-left">{product.name}</p>
                        <p className="text-xs text-gray-600 text-left">
                          {product.description}
                        </p>
                        <p className="text-sm font-semibold text-blue-600 text-left">
                          {product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="border-b border-[#D1D5DB]">
            <nav className="flex space-x-8 px-6">
              {["description", "dosage", "side-effects", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
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
                  Paracetamol is a common painkiller used to treat aches and
                  pain. It can also be used to reduce a high temperature. It's
                  available combined with other painkillers and anti-sickness
                  medicines.
                </p>
                <ul className="space-y-2 text-left text-gray-700">
                  <li>
                    • Effective for headaches, muscle aches, arthritis,
                    backache, toothaches, colds, and fevers
                  </li>
                  <li>
                    • Fast-acting formula provides relief within 30 minutes
                  </li>
                  <li>• Gentle on stomach when used as directed</li>
                  <li>• Suitable for adults and children over 12 years</li>
                </ul>
              </div>
            )}

            {activeTab === "dosage" && (
              <div>
                <h4 className="font-semibold text-left mb-3">Dosage Information</h4>
                <div className="space-y-3 text-left text-gray-700">
                  <p>
                    <strong>Adults and children 12 years and over:</strong> Take
                    1-2 tablets every 4-6 hours as needed. Do not exceed 8
                    tablets in 24 hours.
                  </p>
                  <p>
                    <strong>Children 6-12 years:</strong> Take 1/2 to 1 tablet
                    every 4-6 hours as needed. Do not exceed 4 tablets in 24
                    hours.
                  </p>
                  <p className="text-red-600">
                    <strong>Warning:</strong> Do not exceed recommended dose.
                    Consult your doctor if symptoms persist.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "side-effects" && (
              <div>
                <h4 className="font-semibold text-left mb-3">Possible Side Effects</h4>
                <div className="space-y-3 text-left text-gray-700">
                  <p>
                    Most people do not experience side effects with paracetamol,
                    but some may include:
                  </p>
                  <ul className="space-y-1">
                    <li>• Nausea or vomiting</li>
                    <li>• Allergic reactions (rash, itching, swelling)</li>
                    <li>• Liver damage (with overdose)</li>
                  </ul>
                  <p className="text-red-600 mt-3">
                    <strong>
                      Seek immediate medical attention if you experience severe
                      side effects.
                    </strong>
                  </p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h4 className="font-semibold text-left mb-4">Customer Reviews</h4>
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400 text-sm">★★★★★</div>
                        <span className="font-medium">John D.</span>
                        <span className="text-gray-500 text-sm">
                          • 2 days ago
                        </span>
                      </div>
                      <p className="text-gray-700 text-left">
                        Very effective for headaches and fever. Works quickly
                        and lasts for hours. Good value for money.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

export default Product_details;
