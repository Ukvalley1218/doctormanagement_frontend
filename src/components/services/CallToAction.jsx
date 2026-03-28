

const CallToAction = () => {
    return (
        <div>
            <section className="bg-[#0B4C6A] py-[40px]">
                <div className="max-w-[900px] mx-auto px-6 text-center text-white">

                    {/* Heading */}
                    <h2 className="text-[36px] font-medium mb-[20px]">
                        Your journey to wellness begins here
                    </h2>

                    {/* Subtitle */}
                    <p className="text-[16px] text-white/80 mb-[40px] leading-[26px]">
                        Take the first step towards a more balanced, beautiful you with our personalized treatments.
                    </p>

                    {/* Button */}
                    <button
                        onClick={() =>
                            window.open("https://calendly.com/healcure/appointment", "_blank")
                        }
                        className="mx-auto h-[52px] px-[48px] bg-white text-[#0B4C6A] text-[15px] font-medium rounded-full hover:bg-gray-400 hover:cursor-pointer transition"
                    >
                        Book Your Appointment
                    </button>

                    {/* Small text */}
                    <p className="text-[13px] text-white/70 mt-[20px]">
                        Complimentary consultation for new clients
                    </p>
                </div>
            </section>

        </div>
    )
}

export default CallToAction
