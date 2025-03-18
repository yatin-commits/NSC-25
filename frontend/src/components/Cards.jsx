import { FaLinkedin } from "react-icons/fa";
import "./Cards.css";
import myImage from "../assets/me.jpg";
import mukul from "../assets/mukul.jpg"
import ujjwal from "../assets/Ujjwal.jpg"
import yatin from "../assets/yatin.jpg"

const Cards = () => {
    const cards = [
        {   
            img: myImage,
            name: "Shreya Singhal",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal-00010422a"
        },
        {   
            img: mukul,
            name: "Mukul Bhardwaj",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal-00010422a"
        },
        {   
            img: ujjwal,
            name: "Ujjwal chauhan",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal-00010422a"
        },
        {   
            img: myImage,
            name: "Mahak bansal",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/mahak-bansal-2004-"
        },
        {   
            img: yatin,
            name: "Yatin Sharma",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal-00010422a"
        },
        {   
            img: myImage,
            name: "Gunshita Varun",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal-00010422a"
        }
    ];

    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-purple-50 to-indigo-100">
            <div className="flex space-x-8 py-4 px-4 animate-scroll-reverse overflow-x-auto scrollbar-hide">
                {[...cards, ...cards].map((card, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-evenly w-64 lg:w-85 lg:h-75 min-w-[16rem] transition-transform duration-300 hover:scale-105">
                        <div className="relative w-24 h-24 lg:w-44 lg:h-44 mb-4 rounded-full overflow-hidden border-4 border-gray-300 shadow-md">
                            <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                        </div>

                        <h1 className="text-lg lg:text-xl font-bold text-gray-900">{card.name}</h1>

                        <div className="flex flex-row justify-center items-center gap-3 mt-2">
                            <p className="text-gray-700 text-sm lg:text-md lg:text-semibold">{card.education}</p>

                            <div className="w-px h-5 bg-gray-400"></div>

                            <a href={card.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xl hover:text-blue-800 transition-colors">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cards;
