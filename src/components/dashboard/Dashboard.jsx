import React, { useEffect, useState } from "react";
import {
  Calendar,
  Pill,
  Users,
  ShoppingCart,
  Star,
  Clock,
  Package,
  Check,
  Box,
} from "lucide-react";
import dr from "../../assets/images/dr.png";
import dr1 from "../../assets/images/dr1.png";
import dr2 from "../../assets/images/dr2.png";
import apiClient from "../../../apiclient";
import { useCart } from "../../contexts/CartContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { addToCart, cartCount, updateQuantity, items: cartItems } = useCart();
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddToCartNotification, setShowAddToCartNotification] =
    useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [counts, setCounts] = useState(null);
  // Fetch doctors and medicines data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch doctors
        const doctorsResponse = await apiClient.get("/doctors");
        const doctorsData = doctorsResponse.data.doctors || [];
        console.log(doctorsData);
        // Fetch medicines
        const medicinesResponse = await apiClient.get("/products");
        const medicinesData = medicinesResponse.data.products || [];

        setDoctors(doctorsData.slice(0, 4)); // Show only first 3 doctors
        setMedicines(medicinesData.slice(0, 4)); // Show only first 4 medicines
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Fallback to static data if API fails
        // setDoctors([
        //   {
        //     _id: 1,
        //     name: "Dr. John Smith",
        //     specialty: "Cardiologist",
        //     rating: 4.8,
        //     reviews: 120,
        //     image: dr,
        //   },
        //   {
        //     _id: 2,
        //     name: "Dr. Sarah Wilson",
        //     specialty: "Dermatologist",
        //     rating: 4.9,
        //     reviews: 95,
        //     image: dr1,
        //   },
        //   {
        //     _id: 3,
        //     name: "Dr. Michael Brown",
        //     specialty: "General Physician",
        //     rating: 4.7,
        //     reviews: 88,
        //     image: dr2,
        //   },
        // ]);

        // setMedicines([
        //   {
        //     _id: 1,
        //     name: "Paracetamol 500mg",
        //     type: "Pain Relief",
        //     description: "Strip of 10 tablets",
        //     sellingPrice: 12.5,
        //   },
        //   {
        //     _id: 2,
        //     name: "Amoxicillin 250mg",
        //     type: "Antibiotic",
        //     description: "Strip of 10 capsules",
        //     sellingPrice: 18.75,
        //   },
        //   {
        //     _id: 3,
        //     name: "Vitamin D3",
        //     type: "Supplement",
        //     description: "Bottle of 60 tablets",
        //     sellingPrice: 24.98,
        //   },
        //   {
        //     _id: 4,
        //     name: "Ibuprofen 400mg",
        //     type: "Anti-inflammatory",
        //     description: "Strip of 20 tablets",
        //     sellingPrice: 15.3,
        //   },
        // ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (medicine) => {
    addToCart(medicine);
    setAddedProduct(medicine);
    setShowAddToCartNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowAddToCartNotification(false);
      setAddedProduct(null);
    }, 3000);
  };

  const getCartItem = (productId) => {
    return cartItems.find((item) => item._id === productId);
  };

  const fetchCounts = async () => {
    try {
      const response = await apiClient.get("/count");
      console.log(response.data);
      setCounts(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen m-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Products
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {counts?.productsCount}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Box className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  Medicine Orders
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {counts?.ordersCount}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Pill className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  Available Doctors
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {counts?.doctorsCount}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Book Appointment Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Book Appointment
                </h2>
                <Link to="/doctors">
                  <p className="text-blue-600">View All</p>
                </Link>
              </div>
            </div>
            <div className="p-2">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-gray-100 last:border-b-0 gap-4"
                >
                  {/* Image */}
                  <div className="flex justify-center sm:justify-start">
                    <img
                      src={doctor.image || dr}
                      className="w-16 h-16 rounded-full object-cover"
                      alt={doctor.name}
                    />
                  </div>

                  {/* Details + Button (mobile flex row, desktop separated) */}
                  <div className="flex flex-row sm:flex-row items-center sm:justify-between w-full gap-4">
                    {/* Details */}
                    <div className="text-left sm:text-left flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {doctor.specialty}
                      </p>

                      <div className="flex items-center justify-start sm:justify-start mt-1 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">
                          {doctor.rating} (
                          {typeof doctor.reviews === "object"
                            ? doctor.reviews?.length || 100
                            : doctor.reviews || 100}{" "}
                          reviews)
                        </span>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="flex justify-center sm:justify-end">
                      <Link to={`/book_appointment/${doctor._id}`}>
                        <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Book Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Browse Medicines Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Browse Medicines
                </h2>
                <Link to="/medicines">
                  <p className="text-blue-600">View All</p>
                </Link>{" "}
              </div>
            </div>
            <div className="p-6">
              {/* <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search medicines and doctors..."
                  className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div> */}
              <div className="space-y-4">
                {medicines.map((medicine) => {
                  const cartItem = getCartItem(medicine._id);

                  return (
                    <div
                      key={medicine._id}
                      className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
                    >
                      {/* Image */}
                      <Link to={`/product_details/${medicine._id}`}>
                        <div className="flex-shrink-0">
                          <img
                            src={medicine?.mainImage}
                            alt={medicine.name}
                            className="w-24 h-24 rounded-xl cursor-pointer object-contain bg-gray-50 p-2"
                          />
                        </div>
                      </Link>
                      {/* Content */}
                      <div className="flex flex-col flex-1 w-full">
                        <Link to={`/product_details/${medicine._id}`}>
                          <h3 className="font-semibold text-gray-900 text-md text-left">
                            {medicine.name}
                          </h3>
                          {medicine.category || medicine.description ? (
                            <p className="text-sm text-gray-500 text-left mt-1">
                              {/* {medicine.category} */}
                              {/* {medicine.description || medicine.packSize} */}
                            </p>
                          ) : null}
                        </Link>

                        {/* Price and Actions */}
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-lg font-semibold text-green-600">
                            ${medicine.sellingPrice}
                          </p>

                          {cartItem && cartItem.quantity > 0 ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    medicine._id,
                                    cartItem.quantity - 1
                                  )
                                }
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              >
                                <span className="text-gray-700 text-sm font-semibold">
                                  -
                                </span>
                              </button>

                              <span className="w-8 text-center font-medium text-sm">
                                {cartItem.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    medicine._id,
                                    cartItem.quantity + 1
                                  )
                                }
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              >
                                <span className="text-gray-700 text-sm font-semibold">
                                  +
                                </span>
                              </button>

                              <Link to="/cart">
                                <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors">
                                  <Check className="w-4 h-4" />
                                </button>
                              </Link>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(medicine)}
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        {/* <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="p-2">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === "appointment"
                          ? "bg-blue-100"
                          : "bg-green-100"
                      }`}
                    >
                      <activity.icon
                        className={`w-5 h-5 ${
                          activity.type === "appointment"
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-left text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-sm text-gray-500 text-left flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === "Confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>

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

export default Dashboard;
