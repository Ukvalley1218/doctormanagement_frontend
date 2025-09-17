import React, { useEffect, useState } from "react";
import { Phone, User, MapPin, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../../apiclient";

const Profile = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState("name");
  const navigation = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [saveing, setSaveing] = useState(false);

  const [formData, setFormData] = useState({
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

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (
      !/^\+?([1-9]\d{0,2})?[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}$/.test(
        formData.phone.trim()
      )
    ) {
      newErrors.phone = "Enter a valid Canadian or international phone number.";
    }

    // Address tab validations
    if (activeTab === "address") {
      if (!formData.apartment.trim())
        newErrors.apartment = "Apartment/House number is required.";
      if (!formData.address.trim()) newErrors.address = "Address is required.";
      if (!formData.city.trim()) newErrors.city = "City is required.";
      if (!formData.state.trim()) newErrors.state = "State is required.";
      if (!formData.zip.trim()) newErrors.zip = "Zip/Postal code is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error on typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Reset form to current user data
  const handleCancel = () => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address?.address || "",
      apartment: user.address?.apartment || "",
      city: user.address?.city || "",
      landmark: user.address?.landmark || "",
      state: user.address?.state || "",
      zip: user.address?.zip || "",
    });
    setSelectedImage(null);
    setErrors({});
  };

  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;
      const response = await apiClient.get(`/users/${userId}`);
      setUser(response.data);
      // preload basic info
      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        address: response.data.address?.address || "",
        apartment: response.data.address?.apartment || "",
        city: response.data.address?.city || "",
        landmark: response.data.address?.landmark || "",
        state: response.data.address?.state || "",
        zip: response.data.address?.zip || "",
      });
    } catch (error) {
      console.error("Error fetching user:", error.response || error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Save changes
  const handleSaveChanges = async () => {
    if (!user?._id) return;
    if (!validateForm()) return;

    try {
      setSaveing(true);
      const updatePayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          apartment: formData.apartment,
          landmark: formData.landmark,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
      };

      console.log(selectedImage);
      if (selectedImage) {
        try {
          const formData = new FormData();
          formData.append("image", selectedImage);

          const response = await apiClient.post(
            `/upload/users/${user._id}/avatar`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log(response.data);
        } catch (error) {
          console.log(error.response || error.message);
        }
      }

      const response = await apiClient.put(`/users/${user._id}`, updatePayload);

      setUser(response.data);
      alert("Profile updated successfully!");
      fetchUser();
    } catch (error) {
      console.error("Error updating user:", error.response || error.message);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaveing(false);
    }
  };

  // Logout
  const handleLogout = () => {
    try {
      logout();
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess();
      }
      navigation("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : user?.avatarUrl
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image"
              />
              <label
                htmlFor="profile-image"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                Change Photo
              </label>
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Profile Information
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Manage your personal information and contact details
              </p>

              {/* Phone Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Primary Phone</p>
                    <p className="text-sm font-medium">{user?.phone || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveTab("name")}
              className={`py-3 text-sm font-medium border-b-2 ${
                activeTab === "name"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="cursor-pointer flex items-center gap-2">
                <User className="w-4 h-4" />
                Name Details
              </div>
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`py-3 text-sm font-medium border-b-2 ${
                activeTab === "address"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="cursor-pointer flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address Details
              </div>
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === "name" && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-6">
                Personal Name Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 123-456-7890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "address" && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-6">
                Address Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flat / Apartment / House No.
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="House No. & Floor*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.apartment && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.apartment}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmark & Area Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="Enter landmark"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address (Area and Street)
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Area and Street"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip / Postal Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="Postal Code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-xs mt-1">{errors.zip}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={saveing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              {saveing ? "Saving...." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-200 flex justify-center">
          <button
            onClick={handleLogout}
            className="px-10 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
