// 1. Import the necessary components from react-router-dom
import { Routes, Route, useNavigate } from "react-router-dom";
// import "./App.css";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Medicine from "./components/list/Medicine";
import Doctors from "./components/list/Doctors";
import Product_details from "./components/details/Product_details";
import Navbar from "./components/navigation/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import Cart from "./components/cart/Cart";
import Appointment from "./components/reports/Appointment";
import Profile from "./components/auth/Profile";
import Appointment_details from "./components/details/appointment_details";
import Orders from "./components/reports/Orders";
import OrderDetails from "./components/details/Order_details";
import Return_order from "./components/return/Return_order";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import CheckoutSuccess from "./components/checkout/CheckoutSuccess";
import AppointmentSuccess from "./components/checkout/apointmentSuccess";
import { useEffect, useState } from "react";
import apiClient from "../apiclient";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import TermsAndConditions from "./components/information/terms";
import PrivacyPolicy from "./components/information/privacy";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Routes>
            {/* Routes with Navbar layout */}
            <Route path="/*" element={<LayoutWithNavbar />} />
            {/* Route for login without navbar */}
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/login" element={<Login />} />
          </Routes>
          <GlobalLoadingOverlay />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

// Layout component that includes the Navbar and renders children
function LayoutWithNavbar() {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [setting, setSetting] = useState(null);
  const { isLoggedIn } = useAuth();

  const fetchData = async () => {
    try {
      const response = await apiClient.get(`/admin/setting`);
      setSetting(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Navbar isLoggedIn={isLoggedIn} onLoginClick={() => setIsLoginOpen(true)}>
      <Routes>
        {/* Home page is always accessible at "/" */}
        <Route path="/" element={<Home />} />
        
        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/medicines" element={<Medicine />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/product_details/:productId"
          element={<Product_details />}
        />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/order" element={<Orders />} />
        <Route path="/order_details/:order_id" element={<OrderDetails />} />
        <Route path="/return_order/:order_id" element={<Return_order />} />
        <Route
          path="/book_appointment/:doctor_id"
          element={<Appointment_details />}
        />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/apointment-success" element={<AppointmentSuccess />} />
        <Route path="/terms_condition" element={<TermsAndConditions />} />
        <Route path="/privacy_policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>

      {isLoginOpen && (
        <div className="fixed inset-0 z-[999] flex items-center p-2 justify-center">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <Login
              onLoginSuccess={() => {
                setLogin(true);
                setIsLoginOpen(false);
                // navigate(-1);
              }}
            />
          </div>
        </div>
      )}
    </Navbar>
  );
}

function GlobalLoadingOverlay() {
  const { isLoading } = useLoading();
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow p-6 flex items-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="text-gray-700">Loading...</span>
      </div>
    </div>
  );
}

export default App;