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
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [userName, setUserName] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  const navigate = useNavigate();

  const mockReviews = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      rating: 5,
      comment:
        "Excellent doctor! Very thorough and caring. Highly recommend for anyone seeking quality healthcare.",
      date: "2024-01-15",
      verified: true,
    },
    {
      id: 2,
      patientName: "Michael Chen",
      rating: 4,
      comment:
        "Great experience overall. Dr. was professional and knowledgeable. Wait time was reasonable.",
      date: "2024-01-10",
      verified: true,
    },
    {
      id: 3,
      patientName: "Emily Davis",
      rating: 5,
      comment:
        "Outstanding care! The doctor took time to explain everything clearly and answered all my questions.",
      date: "2024-01-08",
      verified: false,
    },
    {
      id: 4,
      patientName: "Robert Wilson",
      rating: 4,
      comment:
        "Very satisfied with the consultation. Professional approach and effective treatment plan.",
      date: "2024-01-05",
      verified: true,
    },
    {
      id: 5,
      patientName: "Lisa Anderson",
      rating: 5,
      comment:
        "Fantastic doctor! Compassionate, skilled, and really listens to patient concerns.",
      date: "2024-01-02",
      verified: true,
    },
  ];

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
          className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6 mx-6 mt-6">

        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
          {/* Image */}
          <div className="flex justify-center sm:justify-start">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              <img
                src={data?.image}
                alt="Doctor"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name + details + amount */}
          <div className="flex flex-row justify-between w-full items-center gap-4">
            {/* Left side (details) */}
            <div className="text-center sm:text-left">
              <h2 className="text-lg text-left font-semibold text-gray-900">
                {data?.name}
              </h2>
              <p className="text-blue-600 text-left font-medium text-sm">
                {data?.speciality}
              </p>

              <div className="flex items-center text-left justify-center sm:justify-start mt-1 text-sm text-gray-600">
                <div className="flex items-center mr-1">
                  {renderStars2(Math.round(averageRating))}
                </div>
                <span className="font-medium text-gray-900">
                  {averageRating}
                </span>
                <span className="ml-1">({totalReviews} reviews)</span>
              </div>

              <div className="flex items-center text-left sm:justify-start text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                {data?.location}
              </div>
            </div>

            {/* Right side (amount) */}
            <div className="text-center sm:text-right">
              <p className="text-xl font-bold text-gray-900">
                ${data?.consultationFee}
              </p>
              <p className="text-sm text-gray-600">Consultation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6 mx-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Patient Reviews
        </h3>

        {totalReviews > 0 ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Overall Rating */}
            <div className="flex flex-col items-center md:items-start">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {averageRating}
              </div>
              <div className="flex items-center mb-2">
                {renderStars(Math.round(averageRating), "w-5 h-5")}
              </div>
              <p className="text-sm text-gray-600">
                {totalReviews} total reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-600 w-6">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width:
                          totalReviews > 0
                            ? `${(ratingDistribution[rating] / totalReviews) *
                            100
                            }%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-600">
            <p className="text-lg font-medium">No reviews yet</p>
            <p className="text-sm">Be the first to review this doctor!</p>
          </div>
        )}
      </div>

      {/* Calendly Booking */}
      <div className="w-full rounded-xl shadow mt-4">
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
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-3 mb-3 mx-3">
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
        </div>

        {/* Rating Form */}
        {showRatingForm && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h5 className="text-lg font-semibold text-gray-900 mb-4">
              Share Your Experience
            </h5>
            <form onSubmit={handleRatingSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                    required
                  />
                </div> */}

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
      </div>
    </div>
  );
};

export default AppointmentDetails;
