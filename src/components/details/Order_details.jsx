import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, HelpCircle, RotateCcw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../../../apiclient";

const OrderDetails = () => {
  const [orderData, setOrderdata] = useState(null);
  const { order_id } = useParams();
  const [loading,setLoading]=useState(false);

  const fetchdata = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/orders/${order_id}`);
      console.log(response.data);
      setOrderdata(response.data);
    } catch (error) {
      console.log(error.response);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    <div className="max-w-6xl mx-auto p-4 mt-10 sm:p-4 lg:p-4 rounded bg-white">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Order Details
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Track your medicine order status and details
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 w-full sm:w-auto justify-center"
          onClick={() =>
            window.open(
              `https://vps.healcure.ca/api/orders/invoice/${orderData.orderId}`,
              "_blank"
            )
          }
        >
          <Download size={16} />
          Download Invoice
        </button>
      </div>

      {/* Order Info and Status */}
      <div className=" rounded-lg p-4 sm:p-6 mb-8 text-left">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Order #{orderData && orderData.orderId}
            </h2>
            <p className="text-sm text-gray-600">
              Placed on {orderData && formatDate(orderData.createdAt)}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
              orderData?.orderStatus === "Delivered"
                ? "bg-green-100 text-green-800"
                : orderData?.orderStatus === "Cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {orderData && orderData.orderStatus}
          </span>
        </div>

        {/* Progress Timeline */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-0">
          {[
            "Placed",
            "Confirmed",
            "Out For Delivery",
            "Delivered",
            "Cancelled",
          ].map((status, index, arr) => {
            // If your API gives trackingHistory with timestamps
            const step = orderData?.trackingHistory?.find(
              (s) => s.status === status
            );

            // Otherwise, fall back to matching just orderStatus
            const isCompleted = step || orderData?.orderStatus === status;
            const isLast = index === arr.length - 1;

            // Decide circle color
            let circleColor = "bg-gray-300";
            if (isCompleted) {
              if (status === "Cancelled") circleColor = "bg-red-500";
              else if (status === "Delivered") circleColor = "bg-green-500";
              else if (status === "Placed") circleColor = "bg-blue-500";
              else if (status === "Confirmed") circleColor = "bg-blue-500";
              else if (status === "Out For Delivery")
                circleColor = "bg-blue-500";
              // else circleColor = "bg-blue-500";
            }

            return (
              <div
                key={status}
                className="flex-1 flex flex-col items-center relative"
              >
                {/* Circle Indicator */}
                <div
                  className={`w-8 h-8 ${circleColor} rounded-full flex items-center justify-center mb-2`}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>

                {/* Title & Date */}
                <p className="text-xs font-medium text-gray-900 text-center">
                  {status}
                </p>
                <p className="text-xs text-gray-500 text-center">
                  {step
                    ? new Date(step.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </p>

                {/* Connector Line */}
                {index < arr.length - 1 && (
                  <div
                    className={`hidden sm:block absolute top-4 left-1/2 w-full h-0.5 ${
                      isCompleted ? "bg-blue-500" : "bg-gray-300"
                    } -translate-y-1/2 z-[-1]`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Ordered Medicines */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">
            Ordered Medicines
          </h3>

          {/* Medicine Items */}
          {/* Paracetamol */}
          {orderData &&
            orderData.items.map((order, index) => (
              <div
                key={index}
                className="space-y-4 border border-gray-200 p-4 rounded-lg mb-5"
              >
                <div className="flex items-start gap-4 text-left">
                  <div className="w-12 h-12 bg-blue-100 mt-2 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={order?.productId?.mainImage}
                      alt={order?.productId?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">
                        {order?.productId?.name}
                      </h4>
                      {order.status === "returned" && (
                        <span className="hidden lg:block bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          Returned
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {order?.productId?.category}
                    </p>
                    <p className="text-sm text-gray-600">
                      Mfg: {order?.productId?.brand}
                    </p>
                  </div>

                  <div className="text-left">
                    <p className="text-sm text-center text-gray-600">
                      Qty: {order?.quantity}
                    </p>
                    <p className="font-medium text-center text-gray-900">
                      ${order?.productId?.actualPrice.toFixed(2)}
                    </p>
                    {order?.status === "returned" && (
                      <p className="lg:hidden bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                        Returned
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Product Value</span>
                <span className="text-gray-900">
                  $
                  {orderData &&
                    orderData.productValue &&
                    orderData.productValue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charges</span>
                <span className="text-gray-900">
                  ${orderData && orderData.deliverfee}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">
                  -$
                  {orderData &&
                    orderData.discountAmount &&
                    orderData.discountAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-green-600">
                  $
                  {orderData &&
                    orderData.taxAmount &&
                    orderData.taxAmount.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${orderData && orderData.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-gray-50 p-4 rounded-lg text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delivery Information
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">
                {orderData && orderData.shippingDetails.name}
              </p>
              <p>{orderData && orderData.shippingDetails.phone}</p>
              <p>{orderData && orderData.shippingDetails.apartment}</p>
              <p>
                {orderData && orderData.shippingDetails.landmark},{" "}
                {orderData && orderData.shippingDetails.address}
              </p>
              <p>
                {orderData && orderData.shippingDetails.city},{" "}
                {orderData && orderData.shippingDetails.state} -{" "}
                {orderData && orderData.shippingDetails.zip}
              </p>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-gray-50 p-4 rounded-lg text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Need Help?
            </h3>
            <div className="space-y-2">
              <button
                className="w-full flex items-center justify-center gap-2 px-4 cursor-pointer py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={() =>
                  window.open(
                    "https://tawk.to/chat/68d584746d94701951d027a1/1j610qs3d",
                  )
                }
              >
                <HelpCircle size={16} />
                Contact Support
              </button>

              {orderData && orderData.orderStatus === "Delivered" && (
                <Link to={`/return_order/${order_id}`}>
                  <button className="w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200">
                    <RotateCcw size={16} />
                    Return Items
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
