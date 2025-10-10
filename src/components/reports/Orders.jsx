import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import apiClient from "../../../apiclient";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orderdata, setOrderdata] = useState([]);
  const [user, setUser] = useState(null);

  // pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;
        const response = await apiClient.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error.response || error.message);
      }
    };
    fetchUser();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "text-green-600 bg-green-50";
      case "in transit":
        return "text-blue-600 bg-blue-50";
      case "processing":
      case "placed":
        return "text-yellow-600 bg-yellow-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "in transit":
        return <Truck className="w-4 h-4" />;
      case "processing":
      case "placed":
        return <Package className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  // ✅ filter based on API data
  const filterOrders = (orders) => {
    switch (activeTab) {
      case "delivered":
        return orders.filter(
          (order) => order.status?.toLowerCase() === "delivered"
        );
      case "placed":
        return orders.filter((order) =>
          ["out for delivery", "processing", "placed"].includes(
            order.status?.toLowerCase()
          )
        );
      case "cancelled":
        return orders.filter(
          (order) => order.status?.toLowerCase() === "cancelled"
        );
      case "out for delivery":
        return orders.filter(
          (order) => order.status?.toLowerCase() === "out for delivery"
        );
      default:
        return orders;
    }
  };

  const filteredOrders = filterOrders(orderdata);

  const fetchdata = async (currentPage = 1) => {
    try {
      const response = await apiClient.get(`/orders/me?page=${currentPage}`);
      const { orders, totalPages, totalOrders, page } = response.data;

      // ✅ Transform API response to match UI
      const mappedOrders = orders.map((order) => ({
        id: order.orderId,
        _id: order._id,
        orderDate: new Date(order.createdAt).toLocaleDateString(),
        deliveryDate: order.updatedAt
          ? new Date(order.updatedAt).toLocaleDateString()
          : "N/A",
        status: order.orderStatus,
        totalAmount: order.totalPrice,
        items: order.items.map((i) => ({
          name: i.productId?.name || "Unknown Item",
          brand: i.productId?.brand || "Unknown Brand",
          quantity: i.quantity,
          price: i.productId?.actualPrice || 0,
        })),
        shippingAddress: `${order.shippingDetails?.apartment}, ${order.shippingDetails?.landmark}, ${order.shippingDetails?.address}, ${order.shippingDetails?.city}, ${order.shippingDetails?.state} - ${order.shippingDetails?.zip}`,
      }));

      setOrderdata(mappedOrders);
      setPage(page);
      setTotalPages(totalPages);
      setTotalOrders(totalOrders);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchdata(page);
  }, [page]);

  const handleCancel = async (orderId) => {
    try {
      const confirmCancel = window.confirm(
        "Are you sure you want to cancel this order?"
      );
      if (!confirmCancel) return;

      const reason = window.prompt(
        "Please enter a reason for cancellation:",
        "Customer request"
      );
      if (!reason) {
        alert("Cancellation reason is required!");
        return;
      }

      await apiClient.put(`/orders/cancel`, { reason, orderId });

      alert("Order cancelled successfully!");
      fetchdata(page);
    } catch (error) {
      console.error(error.response || error.message);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

  const getItemPrice = (item) => {
    if (user?.userDiscount) {
      const discountAmount = (item.price * user.userDiscount) / 100;
      const discountedPrice = item.price - discountAmount;
      return discountedPrice * item.quantity;
    }
    return item.price * item.quantity;
  };

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <div className="flex items-center space-x-3 mb-2 lg:mb-0">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
            {getStatusIcon(order.status)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-left">
              Order #{order.id}
            </h3>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Ordered: {order.orderDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Expected: {order.deliveryDate}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(
              order.status
            )}`}
          >
            {getStatusIcon(order.status)}
            <span>{order.status}</span>
          </span>
          <span className="font-bold text-gray-900">
            ${order.totalAmount?.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="border-t border-gray-100 pt-3">
        <h4 className="font-medium text-gray-900 mb-2 text-left">
          Items ({order.items.length})
        </h4>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-left text-sm">
                  {item.name}
                </p>
                <p className="text-xs text-gray-600 text-left">{item.brand}</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Qty: {item.quantity}</span>
                <span>•</span>
                <span className="font-medium">
                  {formatCurrency(getItemPrice(item))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div className="border-t border-gray-100 pt-3 mt-3">
        <div className="flex items-start space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-left text-gray-700">
              Shipping Address:
            </p>
            <p className="text-left">{order.shippingAddress}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-100">
        <Link to={`/order_details/${order._id}`}>
          <button className="text-blue-600 hover:text-blue-700 cursor-pointer flex items-center space-x-1 text-sm">
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </Link>
        {order.status?.toLowerCase() === "delivered" && (
          <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm">
            <Download className="w-4 h-4" />
            <span>Invoice</span>
          </button>
        )}
        {["in transit", "processing", "placed"].includes(
          order.status?.toLowerCase()
        ) && (
          <button
            onClick={() => handleCancel(order._id)}
            className="text-red-600 cursor-pointer hover:text-red-700 flex items-center space-x-1 text-sm"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel Order</span>
          </button>
        )}
      </div>
    </div>
  );

  const totalAmount =
    orderdata && orderdata.length > 0
      ? orderdata
          .filter((order) => order.status?.toLowerCase() !== "cancelled") // ✅ skip cancelled
          .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
          .toFixed(2)
      : "0.00";

  return (
    <div className="min-h-screen p-2 mt-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-left text-gray-900">
            Order History
          </h1>
          <p className="text-gray-600 text-left mt-1">
            Track and manage your medicine orders
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {totalOrders}
            </div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600">
              {
                orderdata.filter((o) => o.status.toLowerCase() === "delivered")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {
                orderdata.filter((o) =>
                  ["out for delivery", "placed"].includes(
                    o.status.toLowerCase()
                  )
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${totalAmount}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mt-5 mb-6">
          <div className="flex flex-wrap gap-1">
            {[
              { key: "all", label: "All Orders", count: totalOrders },
              {
                key: "delivered",
                label: "Delivered",
                count: orderdata.filter(
                  (o) => o.status.toLowerCase() === "delivered"
                ).length,
              },
              {
                key: "placed",
                label: "Placed",
                count: orderdata.filter(
                  (o) => o.status.toLowerCase() === "placed"
                ).length,
              },
              {
                key: "cancelled",
                label: "Cancelled",
                count: orderdata.filter(
                  (o) => o.status.toLowerCase() === "cancelled"
                ).length,
              },
              {
                key: "out for delivery",
                label: "Out For Delivery",
                count: orderdata.filter(
                  (o) => o.status.toLowerCase() === "out for delivery"
                ).length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === "all"
                  ? "You haven't placed any orders yet."
                  : `No ${activeTab} orders found.`}
              </p>
              <Link to="/medicines">
                <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Start Shopping
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-2 rounded-md font-medium ${
                  page === index + 1
                    ? "bg-[#4285F4] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200 transition-colors"
                }`}
              >
                {index + 1}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
