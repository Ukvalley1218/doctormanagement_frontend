import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPackageBySlug } from "../../components/services/PackageCard";
import { Clock, Dot, Tag } from "lucide-react";
import Footer from "../navigation/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PackageDetails = () => {
    const { slug } = useParams();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                setLoading(true);
                const data = await getPackageBySlug(slug);
                setPkg(data);
            } catch (error) {
                console.error(error);
                setPkg(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [slug]);


    useEffect(() => {
        if (!loading) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [loading]);


    /* LOADING */
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05507c] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading package...</p>
                </div>
            </div>
        );
    }



    /* NOT FOUND */
    if (!pkg) {
        return <div className="py-20 text-center">Package not found</div>;
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
                        src={pkg.image?.url}
                        alt={pkg.name}
                        className="w-full h-full object-cover bg-gray-300 "
                    />
                </div>


                {/* CONTENT */}
                <div className="py-2 px-4 lg:py-6 flex-1 ">
                    <h1 className="text-4xl font-serif mb-4">
                        {pkg.name}
                    </h1>

                    {/* PRICE & DURATION */}
                    <div className="flex flex-col gap-4 text-lg text-[#05507c] mb-6">
                        <span className="flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            ${pkg.packagePrice}
                            <span className="text-sm text-gray-500 line-through ml-2">
                                ${pkg.regularPrice}
                            </span>
                        </span>

                        <span className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            {pkg.totalDuration} mins
                        </span>
                    </div>

                    {/* DESCRIPTION WITH READ MORE */}
                    <p className="text-gray-700 leading-8 mb-10 text-justify">
                        {showFullDesc
                            ? pkg.description
                            : pkg.description.slice(0, 200)}

                        {pkg.description.length > 200 && (
                            <button
                                onClick={() => setShowFullDesc(!showFullDesc)}
                                className="ml-2 text-[#05507c] font-medium hover:underline hover:cursor-pointer hover:text-[#0d6ea6] inline"
                            >
                                {showFullDesc ? "read less" : "... read more"}
                            </button>
                        )}
                    </p>

                    {/* INCLUDED SERVICES */}
                    <div className="mb-10">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Included Services
                        </h3>

                        <ul className="space-y-2 text-gray-700 ">
                            {pkg.services.map((item) => (
                                <li
                                    key={item._id}
                                    onClick={() => navigate(`/services/${item.service.slug}`)}
                                    className="flex items-center gap-2 cursor-pointer hover:text-[#05507c] transition"
                                >
                                    <Dot className="w-12 h-12 hover:text-[#05507c]" />
                                    <span>
                                        {item.service.name} ({item.service.durationMinutes} mins)
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>



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
                        Book This Package
                    </button>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default PackageDetails;
