
import { BadgeCheck ,HeartHandshake, Award, Sparkles } from "lucide-react"

const WhyChooseOurServices = () => {
    return (
        <section className="bg-white py-8">
            <div className="max-w-7xl mx-auto px-40">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-[25px] text-gray-700 mb-2">
                        Why Choose Our Services
                    </h2>
                    <p className="text-[14px] text-gray-600 max-w-2xl mx-auto">
                        Experience the difference with our commitment to excellence and personalized care.
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-4 text-center">

                    {/* Item 1 */}
                    <div>
                        <div className="w-10 h-10 rounded-full mx-auto mb-4">
                            <BadgeCheck className="w-full h-full"/>
                        </div>
                        <h4 className="text-[15px] font-medium text-[#2F2F2F] mb-2">
                            Certified Therapists
                        </h4>
                        <p className="text-[12px] text-[#7A7A7A] leading-relaxed">
                            Licensed professionals with years of experience
                        </p>
                    </div>

                    {/* Item 2 */}
                    <div>
                        <div className="w-10 h-10 rounded-full mx-auto mb-4">
                            <HeartHandshake className="w-full h-full" />
                        </div>
                        <h4 className="text-[15px] font-medium text-[#2F2F2F] mb-2">
                            Personalized Treatments
                        </h4>
                        <p className="text-[12px] text-[#7A7A7A] leading-relaxed">
                            Customized care tailored to your unique needs
                        </p>
                    </div>

                    {/* Item 3 */}
                    <div>
                        <div className="w-10 h-10  rounded-full mx-auto mb-4">
                            <Award className="h-full w-full"  />
                        </div>
                        <h4 className="text-[15px] font-medium text-[#2F2F2F] mb-2">
                            Premium Products
                        </h4>
                        <p className="text-[12px] text-[#7A7A7A] leading-relaxed">
                            High-quality, natural products for best results
                        </p>
                    </div>

                    {/* Item 4 */}
                    <div>
                        <div className="w-10 h-10 rounded-full mx-auto mb-4">
                            <Sparkles className="w-full h-full"/>
                        </div>
                        <h4 className="text-[15px] font-medium text-[#2F2F2F] mb-2">
                            Calm & Hygienic Environment
                        </h4>
                        <p className="text-[12px] text-[#7A7A7A] leading-relaxed">
                            Clean, peaceful space for your comfort and safety
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default WhyChooseOurServices
