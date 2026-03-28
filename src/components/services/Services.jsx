import ServiceCard from "./ServiceCard";
import { useEffect, useRef, useState } from "react";
import { getServices } from "./ServiceCard";
import PackageCard, { getPackages } from "./PackageCard";
import WhyChooseOurServices from "./WhyChooseOurServices";
import HeroImg from "../../assets/images/services_bg.png"
import CallToAction from "./CallToAction";
import Footer from "../navigation/Footer";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TABS = [
    { label: "All Services", value: "" },
    { label: "Body Therapy", value: "Body Therapy" },
    { label: "Beauty & Grooming", value: "Beauty & Grooming" },
    { label: "Medical & Wellness", value: "Medical Wellness" },
    { label: "Relaxation", value: "Relaxation" },
];


const Services = () => {
    const [services, setServices] = useState([]);
    const [category, setCategory] = useState("");
    const [packages, setPackages] = useState([]);

    const [pageLoading, setPageLoading] = useState(true);
    const [servicesLoading, setServicesLoading] = useState(false);
    const navigate = useNavigate();
    const packagesRef = useRef(null);
    const isFirstLoad = useRef(true);


    useEffect(() => {
        const fetchServices = async () => {
            try {
                if (isFirstLoad.current) {
                    setPageLoading(true);
                } else {
                    setServicesLoading(true);
                }

                const data = await getServices(category);
                setServices(data);
            } catch (error) {
                console.error(error);
                setServices([]);
            } finally {
                setPageLoading(false);
                setServicesLoading(false);
                isFirstLoad.current = false;
            }
        };

        fetchServices();
    }, [category]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await getPackages();
                setPackages(res.data);
            } catch (error) {
                console.error(error);
                setPackages([]);
            }
        };

        fetchPackages();
    }, []);

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b4c6a] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading services...</p>
                </div>
            </div>
        );
    }


    return (
        <div>

            {/* Hero */}
            <section
                style={{ backgroundImage: `url(${HeroImg})` }}
                className="bg-cover bg-center"
            >
                {/* BACK BUTTON */}
                <div className="max-w-7xl mx-auto pt-6">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 rounded-xl px-4 py-1.5 text-gray-700 shadow-sm hover:bg-gray-100 border-1 hover:shadow-xl transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    <h1 className="text-4xl text-[#05507C] md:text-5xl font-serif mb-6">
                        Our Wellness & <br />Beauty Services
                    </h1>

                    <p className="max-w-xl text-[#3e3933] mb-8">
                        Curated treatments designed to restore balance, beauty, and well-being
                        through gentle, personalized care.
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => window.open("https://calendly.com/healcure/appointment", "_blank")}
                            className="bg-[#05507C] text-white px-6 py-3 rounded-md hover:bg-[#093a52] hover:cursor-pointer transition">
                            Book an Appointment
                        </button>

                        <button
                            onClick={() => {
                                packagesRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
                                });
                            }}
                            className="border border-[#0b4c6a] text-[#0b4c6a] px-6 py-3 rounded-md hover:bg-gray-200 hover:text-[#0b4c6a] hover:cursor-pointer transition ">
                            Explore Packages
                        </button>
                    </div>
                </div>
            </section>

            {/* Filter Tabs */}
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-3 py-6 flex gap-3 flex-wrap justify-center">
                    {TABS.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => setCategory(tab.value)}
                            className={`px-5 py-1 rounded-md text-sm font-semibold transition-all ${category === tab.value
                                ? "bg-[#0b4c6a] text-white hover:cursor-pointer"
                                : "border border-gray-300 text-gray-600 hover:border-[#0b4c6a] hover:text-[#0b4c6a] hover:cursor-pointer bg-gray-100"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </section>


            {/* Services Grid */}
            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20 min-h-[300px]">
                {servicesLoading ? (
                    <div className="col-span-full flex justify-center items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0b4c6a]"></div>
                    </div>
                ) : services.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500">
                        No services found.
                    </p>
                ) : (
                    services.map((service) => (
                        <ServiceCard key={service._id} service={service} />
                    ))
                )}
            </section>
            {/* <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                {services.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500">
                        No services found.
                    </p>
                ) : (
                    services.map((service) => (
                        <ServiceCard key={service._id} service={service} />
                    ))
                )}
            </section> */}


            {/* PackageGrid*/}
            <section
                ref={packagesRef}
                className="bg-[#F4EFE8] py-10 scroll-mt-22">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-2xl font-serif mb-2 text-gray-700">
                            Wellness Packages
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Combine multiple services for a complete wellness experience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 px-20">
                        {packages.map(pkg => (
                            <PackageCard key={pkg._id} pkg={pkg} />
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <WhyChooseOurServices />

            {/*Call To Action*/}
            <CallToAction />

            {/*Footer*/}
            <Footer />
        </div>
    );
};

export default Services;
