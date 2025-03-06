import { useState } from "react";
import { FiHelpCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";

const Faqs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 text-gray-900 py-12 px-6">
            {/* Animated Gradient Heading */}
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse">
                ✨ Frequently Asked Questions ✨
            </h1>

            {/* FAQ Container */}
            <div className="w-full max-w-3xl space-y-6">
                {[
                    {
                        question: "What is the National Students Convention?",
                        answer: "The National Students Convention is an annual event that brings together students from across the country to participate in academic, cultural, and technical activities, fostering innovation and collaboration."
                    },
                    {
                        question: "Where and when will the convention take place?",
                        answer: "The convention will be held at BVICAM, Paschim Vihar, on 2nd April, 2025. Detailed venue information will be shared with registered participants."
                    },
                    {
                        question: "Who can attend the convention?",
                        answer: "The convention is open to undergraduate and postgraduate students from all disciplines."
                    },
                    {
                        question: "Is there any registration fee?",
                        answer: "No. It is absolutely free!"
                    },
                    {
                        question: "How do I make the most out of this event?",
                        answer: "Show up, step out of your comfort zone, network, compete, and most importantly—have fun! This is your chance to level up academically, socially, and professionally!"
                    }
                ].map((faq, index) => (
                    <div
                        key={index}
                        className="group bg-white p-6 rounded-xl border border-gray-300 shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer relative"
                        onClick={() => toggleFaq(index)}
                    >
                        {/* Glowing Border Effect on Hover */}
                        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-500 transition-all duration-300"></div>

                        {/* Question Section */}
                        <div className="flex justify-between items-center relative">
                            <div className="flex items-center gap-3">
                                <FiHelpCircle className="text-2xl text-blue-500" />
                                <span className="text-lg sm:text-xl font-semibold">{faq.question}</span>
                            </div>
                            {openIndex === index ? (
                                <FiChevronUp className="text-blue-500 transition-transform duration-300 transform rotate-180" />
                            ) : (
                                <FiChevronDown className="text-blue-500 transition-transform duration-300" />
                            )}
                        </div>

                        {/* Expandable Answer Section with Smooth Animation */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                openIndex === index ? "max-h-60 opacity-100 mt-3" : "max-h-0 opacity-0"
                            }`}
                        >
                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Faqs;
