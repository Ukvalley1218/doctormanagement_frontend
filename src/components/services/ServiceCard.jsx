import { Link } from "react-router-dom";
import apiClient from "../../../apiclient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const getServices = async (category = "") => {
    try {
        const url = category
            ? `/services?category=${encodeURIComponent(category)}`
            : `/services`;

        const res = await apiClient.get(url);

        return res.data.data;
    } catch (error) {
        console.error("Failed to fetch services:", error);
        return [];
    }
};

export const getServiceBySlug = async (slug) => {
    try {
        const res = await apiClient.get(`/services/${slug}`);
        return res.data.data;
    } catch (error) {
        console.error("Failed to fetch service:", error);
        return null;
    }
};


const ServiceCard = ({ service }) => {

    const [showFullDesc, setShowFullDesc] = useState(false)
    const navigate = useNavigate();



    return (

        <div
            onClick={() => navigate(`/services/${service.slug}`)}
            className="bg-white rounded-xl cursor-pointer shadow-md  hover:shadow-lg transition-all"
        >
            {/*Image */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                <img
                    src={service.image?.url}
                    alt={service.name}
                    className="h-70 w-full bg-gray-200 object-contain"
                />

                {/*Content */}
                <div className="px-4 py-3">

                    {/*Heading */}
                    <h3 className="font-serif text-lg text-[#0b4c6a] mb-2">
                        {service.name}
                    </h3>

                    {/*details */}
                    <p className="text-gray-700 leading-6 text-justify">
                        {showFullDesc
                            ? service.shortDescription
                            : service.shortDescription.slice(0, 100)}

                        {service.shortDescription.length > 100 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowFullDesc(!showFullDesc)}
                                }

                                className="ml-2 text-[#05507c] font-medium hover:underline hover:cursor-pointer hover:text-[#0d6ea6] inline"
                            >
                                {showFullDesc ? "read less" : "... read more"}
                            </button>
                        )}
                    </p>

                    {/*Properties*/}
                    <div className="flex justify-between items-center py-3">

                        <p className="text-lg font-bold text-[#0b4c6a]">
                            Starting at ${service.priceFrom} -
                            ${service.priceTo}
                        </p>
                        <p className="text-sm text-gray-600 ">
                            {service.durationMinutes} mins
                        </p>

                    </div>


                    <div className="flex justify-around items-center py-2">
                        <Link
                            to={`/services/${service.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-300 text-black px-8 py-2 rounded-md text-sm hover:bg-gray-200 hover:text-[#05507c] hover:border-[#093a52] transition"
                        >
                            Learn More
                        </Link>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open("https://calendly.com/healcure/appointment", "_blank")}
                            }
                            className="bg-[#05507c] text-white px-8 py-2 rounded-md text-sm hover:bg-[#093a52] hover:cursor-pointer  transition"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
