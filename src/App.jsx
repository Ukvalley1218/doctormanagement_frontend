// 1. Import the necessary components from react-router-dom
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Medicine from "./components/list/Medicine";
import Doctors from "./components/list/Doctors";
import Product_details from "./components/details/Product_details";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} index />
      <Route path="/medicine" element={<Medicine />} index />
      <Route path="/doctor" element={<Doctors />} index />
      <Route path="/product_details" element={<Product_details />} index />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;
