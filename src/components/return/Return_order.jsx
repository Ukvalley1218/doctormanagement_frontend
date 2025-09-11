import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, MapPin, RotateCcw } from "lucide-react";
import { useParams } from "react-router-dom";
import apiClient from "../../../apiclient";

const Return_order = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orderData, setOrderdata] = useState(null);
  const { order_id } = useParams();

  const fetchdata = async () => {
    try {
      const response = await apiClient.get(`/orders/${order_id}`);
      setOrderdata(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const returnTracking = [
    {
      id: "#R001",
      status: "In Transit",
      statusColor: "text-yellow-700 bg-yellow-100",
      steps: [
        {
          label: "Package picked up",
          date: "Jan 15, 2:30 PM",
          completed: true,
        },
        { label: "In transit", date: "Jan 16, 8:15 AM", completed: true },
        {
          label: "Delivered to pharmacy",
          date: "Expected: Jan 17",
          completed: false,
        },
      ],
    },
    {
      id: "#R002",
      status: "Completed",
      statusColor: "text-green-600 bg-green-100",
      steps: [
        { label: "Refund processed", date: "Jan 12, 4:45 PM", completed: true },
      ],
    },
  ];

  const handleOrderSelect = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleRequestReturn = async () => {
    if (selectedOrders.length > 0) {
      try {
        console.log(selectedOrders, order_id);
        const response = await apiClient.post("/orders/return", {
          orderId: order_id,
          productId: selectedOrders,
        });

        console.log("Return request response:", response.data);
        alert("Return request submitted successfully!");
        setSelectedOrders([]);
      } catch (error) {
        console.error("Error requesting return:", error.response || error);
        alert("Failed to submit return request. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">Return Your Medicine</h1>
        <p className="text-blue-100">
          Select from your recent orders and track returns easily
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Order Id: #{orderData && orderData.orderId}
            </h2>
          </div>

          <div className="space-y-4">
            {orderData &&
              orderData.items &&
              orderData.items.map((order) => {
                const isReturned = order.status === "returned";

                return (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Header row: checkbox + order + date */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={order.productId._id}
                          checked={selectedOrders.includes(order.productId._id)}
                          onChange={() =>
                            handleOrderSelect(order.productId._id)
                          }
                          disabled={isReturned}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                        />
                        <label
                          htmlFor={order._id}
                          className={`text-sm cursor-pointer ${
                            isReturned
                              ? "text-gray-400 line-through cursor-not-allowed"
                              : "text-gray-900"
                          }`}
                        >
                          {order.productId.name}
                        </label>
                      </div>

                      {isReturned && (
                        <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded">
                          Returned
                        </span>
                      )}
                    </div>

                    {/* Items list */}
                    <div className="space-y-1">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-left text-gray-900">
                            Total: ${order.productId.actualPrice}
                          </span>
                          <span className="text-gray-500">
                            Qty: {order.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <button
            onClick={handleRequestReturn}
            disabled={selectedOrders.length === 0}
            className={`w-full mt-6 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              selectedOrders.length > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <RotateCcw size={20} />
            Request Return
          </button>
        </div>

        {/* Return Tracking */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Return Tracking
          </h2>

          <div className="space-y-6">
            {returnTracking.map((returnItem) => (
              <div
                key={returnItem.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">
                    Return {returnItem.id}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${returnItem.statusColor}`}
                  >
                    {returnItem.status}
                  </span>
                </div>

                <div className="space-y-3 text-left">
                  {returnItem.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          step.completed
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            step.completed ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-500">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Return Address */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gray-500 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Return Address
                </h4>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Return_order;
