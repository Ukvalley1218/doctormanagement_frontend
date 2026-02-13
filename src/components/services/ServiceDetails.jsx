import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getServiceBySlug } from "../../components/services/ServiceCard";
import { Clock, Tag } from "lucide-react";
import Footer from "../navigation/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceDetails = () => {
    const { slug } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getServiceBySlug(slug)
            .then((res) => setService(res))
            .catch(() => setService(null))
            .finally(() => setLoading(false));
    }, [slug]);

    useEffect(() => {
        if (!loading) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [loading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05507c] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading service...</p>
                </div>
            </div>
        );
    }


    if (!service) {
        return <div className="py-20 text-center">Service not found</div>;
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-6 pt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-200 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-10">
                {/* IMAGE */}
                <div className="w-full lg:w-[38%] h-[450px] rounded-2xl overflow-hidden bg-gray-100 mx-auto shadow-2xl">
                    <img
                        src={service.image?.url}
                        alt={service.name}
                        className="w-full h-full object-cover bg-gray-300"
                    />
                </div>

                {/* CONTENT */}
                <div className="py-2 px-4 lg:py-8 flex-1">
                    <h1 className="text-4xl font-serif mb-4">
                        {service.name}
                    </h1>

                    {/* PRICE & DURATION */}
                    <div className="flex flex-col gap-4 text-lg text-[#05507c] mb-6">
                        <span className="flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            ${service.priceFrom} - ${service.priceTo}
                        </span>

                        <span className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            {service.durationMinutes} mins
                        </span>
                    </div>

                    {/* DESCRIPTION WITH READ MORE */}
                    <p className="text-gray-700 leading-8 mb-10 text-justify">
                        {showFullDesc
                            ? service.shortDescription
                            : service.shortDescription.slice(0, 200)}

                        {service.shortDescription.length > 200 && (
                            <button
                                onClick={() => setShowFullDesc(!showFullDesc)}
                                className="ml-2 text-[#05507c] font-medium hover:underline hover:cursor-pointer hover:text-[#0d6ea6] inline"
                            >
                                {showFullDesc ? "read less" : "... read more"}
                            </button>
                        )}
                    </p>

                    {/* CTA */}
                    <button
                        onClick={() =>
                            window.open(
                                "https://calendly.com/healcure/appointment",
                                "_blank"
                            )
                        }
                        className="bg-[#05507c] text-white px-10 py-3 rounded-md hover:bg-[#093a52] transition hover:cursor-pointer"
                    >
                        Book This Service
                    </button>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ServiceDetails;
