import React, { useEffect, useState } from "react";
import { Star, MapPin, Calendar, User, ThumbsUp, ArrowLeft } from "lucide-react";
import dr from "../../assets/images/dr.png";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../apiclient";
import { InlineWidget } from "react-calendly";

const AppointmentDetails = () => {
  const { doctor_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [userName, setUserName] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(`/doctors/${doctor_id}`);
        setData(res.data);
        console.log(res.data);
        // In a real app, you'd fetch reviews from an API
        setReviews(res.data.reviews);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctor_id]);

  const renderStars = (rating, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
      />
    ));
  };

  const renderStars2 = (rating, size = "w-4 h-4") => {
    return Array.from({ length: 1 }, (_, index) => (
      <Star
        key={index}
        className={`${size} ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
      />
    ));
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

  // form 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await apiClient.post("/form", formData);
      console.log(res)
      setMessage("✅ Your query has been submitted successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setMessage("❌ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };





  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      ).toFixed(1)
      : 0;

  // Update handleRatingSubmit to accept event
  const handleRatingSubmit = async (e) => {
    e.preventDefault(); // <-- Prevent form from refreshing the page
    try {
      setSubmittingRating(true);

      const response = await apiClient.post(`/doctors/${doctor_id}/reviews`, {
        rating: userRating,
        comment: userComment,
      });

      console.log(response.data);
      alert("Review Submitted Successfully");

      // Reset form after submit
      setUserRating(0);
      setUserComment("");
      setShowRatingForm(false);

      // Optionally update reviews immediately
      setReviews((prev) => [
        {
          id: prev.length + 1,
          patientName: "You", // Replace with logged-in user if available
          rating: userRating,
          comment: userComment,
          date: new Date().toISOString(),
          verified: false,
        },
        ...prev,
      ]);
    } catch (error) {
      console.log(error.response);
      if (error?.response?.data?.msg == "No token, access denied") {
        alert("Login For Review Doctor");
      } else {
        alert(error?.response?.data?.msg || "Failed To Submit Review");
      }
    } finally {
      setSubmittingRating(false);
    }
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
          className={`${size} cursor-pointer ${starValue <= (hoveredRating || rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
            }`}
        />
      );
    });
  };

  return (
    <div className="">
      {/* Doctor Profile */}
      <div className="mx-6 mt-4">

        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>
      <div className="bg-white lg:mt-6 ">

        <div className="bg-gray-50 min-h-screen pb-10 px-6">
          {/* Top Section: Doctor Info */}
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* LEFT: Doctor Details */}
            <div className="bg-white rounded-2xl shadow-md p-6 mt-6 lg:mt-0">
              <div className="flex flex-col items-center">
                <img
                  src={data?.image || dr}
                  alt={data?.name}
                  className="w-32 h-32 rounded-lg object-cover mb-4 shadow"
                />
                <h2 className="text-xl font-bold text-blue-700">{data?.name}</h2>
                <p className="text-gray-600 font-semibold">
                  {data?.qualifications || "D.O.M.P"}
                </p>
                <p className="text-gray-500">
                  {data?.experience || "25 yrs. of practice"} of practise
                </p>

                <p className="text-[#f87215] font-bold text-lg mt-2">
                  ${data?.consultationFee || 120} / Per Visit
                </p>
                <p className="text-sm text-center text-[#f87215] mt-1">
                  Free Consultation: Available for specific treatments
                </p>

                <p className="text-gray-700 text-sm text-center mt-3 leading-relaxed">
                  {data?.about ||
                    "Experienced and compassionate healthcare professional ensuring the highest standard of patient care."}
                </p>
              </div>
            </div>

            {/* MIDDLE: Contacts + Treatments */}
            <div className="flex flex-col gap-6">
              {/* Contact Card */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="font-semibold text-lg mb-4">Contacts</h3>

                <div className="space-y-3 text-sm">
                  {/* Address */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-gray-500 w-full sm:w-[30%]">Address:</span>
                    <span className="font-medium text-gray-800 w-full sm:w-[70%]">
                      {data?.location || "Ontario"}
                    </span>
                  </div>

                  {/* Office */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-gray-500 w-full sm:w-[30%]">Office:</span>
                    <span className="font-medium text-gray-800 w-full sm:w-[70%]">
                      {data?.office || "Suite 402, Downtown Plaza"}
                    </span>
                  </div>

                  {/* Mobile */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-gray-500 w-full sm:w-[30%]">Mobile:</span>
                    <span className="font-medium text-gray-800 w-full sm:w-[70%]">
                      {data?.number || "+1 (555) 123-4567"}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-gray-500 w-full sm:w-[30%]">Email:</span>
                    <span className="text-orange-600 w-full sm:w-[70%]">
                      {data?.email || "info@domain.ltd"}
                    </span>
                  </div>

                  {/* Website */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-gray-500 w-full sm:w-[30%]">Website:</span>
                    <a
                      href={data?.website || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 w-full sm:w-[70%]"
                    >
                      {data?.website || "https://domain.ltd"}
                    </a>
                  </div>
                </div>


              </div>

              {/* Treatments Card */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="font-semibold text-lg mb-4">Treatments</h3>
                <div className="flex flex-wrap gap-2">
                  {(data?.services || [
                    "Botox & Dermal Fillers",
                    "Laser Treatments",
                    "Stem Cell Therapy",
                    "Osteopathy Treatments",
                    "Weight Management",
                  ]).map((treat, i) => {
                    // soft color palette
                    const colors = [
                      "bg-blue-100 text-blue-800",
                      "bg-green-100 text-green-800",
                      "bg-pink-100 text-pink-800",
                      "bg-yellow-100 text-yellow-800",
                      "bg-purple-100 text-purple-800",
                      "bg-teal-100 text-teal-800",
                      "bg-orange-100 text-orange-800",
                    ];
                    const color = colors[i % colors.length];
                    return (
                      <span
                        key={i}
                        className={`px-3 py-1 text-sm font-medium rounded-full border border-transparent ${color}`}
                      >
                        {treat}
                      </span>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT: Consultation Card */}
            <div className="bg-[#f8f9fb] rounded-2xl shadow-md p-6 flex flex-col justify-between h-[320px]">
              <div>
                <h3 className="font-semibold text-lg mb-4">Consultation Details</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span>In-Person Consultation</span>
                    <span className="font-medium">${data.consultationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Video Consultation</span>
                    <span className="font-medium">$120</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Follow-up Visit</span>
                    <span className="font-medium">$100</span>
                  </div>
                </div>
              </div>

              {/* Fixed bottom buttons inside the card */}
              <div className="mt-auto pt-4">
                <button
                  onClick={() =>
                    window.open(data?.calendlyUrl || "https://calendly.com/yourlink", "_blank")
                  }
                  className="cursor-pointer w-full bg-[#3a81f5] text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Book Appointment
                </button>

                <button
                  onClick={() => {
                    const phoneNumber = data?.number || "919876543210"; // 👈 replace with doctor’s WhatsApp number (include country code, no +)
                    const message = encodeURIComponent("Hello Doctor, I’d like to chat with you.");
                    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
                  }}
                  className="cursor-pointer w-full bg-[#0fb880] text-white py-2 rounded-lg font-medium hover:bg-green-700 mt-2 transition"
                >
                  Chat Now
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Section: Tabs + Contact Form */}
<div className="max-w-7xl mx-auto mt-10 flex flex-col lg:flex-row gap-8 px-4 sm:px-6 md:px-0">
  {/* DOCTOR INFO SECTION - TABS ON TOP */}
  <div className="lg:w-[70%] bg-white rounded-3xl shadow-sm p-4 sm:p-6">
    {/* Tabs Header */}
    <div className="border-b border-gray-200 mb-6 overflow-x-auto">
      <nav className="flex space-x-4 sm:space-x-6 min-w-max">
        {["overview", "experience & education", "patient feedback", "FAQs"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer whitespace-nowrap pb-3 text-sm sm:text-base font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </nav>
    </div>

    {/* Tab Content */}
    <div>
      {/* Overview */}
      {activeTab === "overview" && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Overview
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {data?.about ||
              "Experienced healthcare professional providing holistic treatment and care."}
          </p>
        </div>
      )}

      {/* Experience */}
      {activeTab === "experience & education" && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Experience
          </h3>
          <p className="text-gray-700 mb-2 text-sm sm:text-base">
            {data?.experience || "15+ years of clinical experience"}
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            Graduated from:{" "}
            <span className="font-medium">
              {data?.qualifications || "D.O.M.P (Osteopathy)"}
            </span>
          </p>
        </div>
      )}

      {/* FAQs */}
      {activeTab === "FAQs" && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {[
              {
                q: "How do I book an appointment with the doctor?",
                a: "You can easily book an appointment through our online booking system or by calling the clinic directly. Walk-ins are also welcome, but pre-booked slots are prioritized.",
              },
              {
                q: "What should I bring for my first visit?",
                a: "Please carry your previous medical records, prescription details, and any relevant test reports. It helps the doctor assess your condition more accurately.",
              },
              {
                q: "How should I take my prescribed medicines?",
                a: "Follow the dosage and timing strictly as prescribed. Always take medicines after food unless otherwise directed by your doctor. Avoid self-adjusting the dosage.",
              },
              {
                q: "Can I contact the doctor after my appointment?",
                a: "Yes. Follow-up consultations can be booked online or by phone. For urgent concerns, please contact our clinic helpline for immediate guidance.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200"
              >
                <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                  {faq.q}
                </h4>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patient Feedback */}
      {activeTab === "patient feedback" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">
              Recent Reviews
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowRatingForm(!showRatingForm)}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium px-3 py-2 rounded-lg transition"
              >
                Write Review
              </button>
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="cursor-pointer text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
              >
                {showAllReviews ? "Show Less" : "Show All Reviews"}
              </button>
            </div>
          </div>

          {/* Rating Form */}
          {showRatingForm && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h5 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
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
                      <span className="ml-2 text-xs sm:text-sm text-gray-600">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    placeholder="Share your experience with this doctor..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {userComment.length}/500 characters
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={submittingRating}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
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
                      setUserName("");
                    }}
                    className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews */}
          <div className="space-y-4">
            {totalReviews > 0 ? (
              (showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h5 className="font-medium text-gray-900 text-sm sm:text-base">
                          {review.name}
                        </h5>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            <ThumbsUp className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-xs text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-600">
                <p className="text-sm">No reviews yet. Be the first to write one!</p>
              </div>
            )}
          </div>

          {!showAllReviews && reviews.length > 3 && (
            <div className="text-center mt-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing 3 of {totalReviews} reviews
              </p>
            </div>
          )}
        </div>
      )}
    </div>



            </div>
            {/* RIGHT: Contact Form */}
            <div className="lg:w-[30%] bg-gradient-to-br from-[#eaf2fd] to-[#e7f7f6] p-6 rounded-3xl shadow-sm h-fit">
              <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
                Find The Best
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#d5d8d8] rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#d5d8d8] rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone No"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#d5d8d8] rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <textarea
                  name="message"
                  placeholder="How Can We Help You"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#d5d8d8] rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                ></textarea>

                <button
                  type="submit"
                  disabled={loading}
                  className={`cursor-pointer w-full bg-gradient-to-r from-[#378bbc] to-[#689731] text-white py-2 rounded-xl font-semibold transition-all ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                    }`}
                >
                  {loading ? "Submitting..." : "Contact us"}
                </button>

                {message && (
                  <p
                    className={`text-sm text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Calendly Booking */}
      {/* <div className="w-full rounded-xl shadow mt-4">
        {data && data?.calendlyUrl && (
          <div>
            <InlineWidget
              url={data && data?.calendlyUrl}
              styles={{
                height: "850px",
                paddingLeft: "10px",
                marginBottom: 20,
              }}
            />
          </div>
        )}
      </div> */}

      {/* Reviews List */}
      {/* <div className="bg-white rounded-xl shadow border border-gray-200 p-3 mb-3 mx-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="lg:text-lg font-semibold text-gray-900">
            Recent Reviews
          </h4>
          <div className="flex gap-2">
            <button
              onClick={() => setShowRatingForm(!showRatingForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-2 py-2 rounded-lg transition-colors duration-200"
            >
              Write Review
            </button>
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showAllReviews ? "Show Less" : "Show All Reviews"}
            </button>
          </div>
        </div> */}

      {/* Rating Form */}
      {/* {showRatingForm && (
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
                  placeholder="Share your experience with this doctor..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {userComment.length}/500 characters
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submittingRating}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
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
                    setUserName("");
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {totalReviews > 0 ? (
            (showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 pb-4 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-gray-900">
                        {review.name}
                      </h5>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          <ThumbsUp className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))
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
      </div>*/}
    </div>
  );
};

export default AppointmentDetails;
