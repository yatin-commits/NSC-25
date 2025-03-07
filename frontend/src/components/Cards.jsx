import { FaLinkedin } from "react-icons/fa";
import "./Cards.css";
import myImage from "../assets/me.jpg";

const Cards = () => {
    const cards = [
        {   
            img: myImage,
            name: "Shreya Singhal",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal"
        },
        {   
            img: myImage,
            name: "Shreya Singhal",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal"
        },
        {   
            img: myImage,
            name: "Shreya Singhal",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal"
        },
        {   
            img: myImage,
            name: "Shreya Singhal",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal"
        },
        {   
            img: myImage,
            name: "Shreya Singhal",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal"
        },
        {   
            img: myImage,
            name: "Shreya Singhal",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal"
        }
    ];

    return (
        <div className="relative w-full px-6 py-12 overflow-hidden bg-gradient-to-r from-purple-100 to-indigo-200">
            <div className="flex space-x-8 py-4 px-4 animate-scroll-reverse overflow-x-auto scrollbar-hide">
                {[...cards, ...cards].map((card, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-64 lg:w-80 min-w-[16rem] transition-transform duration-300 hover:scale-105">
                        <div className="relative w-24 h-24 lg:w-28 lg:h-28 mb-4 rounded-full overflow-hidden border-4 border-gray-300 shadow-md">
                            <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                        </div>

                        <h1 className="text-lg lg:text-xl font-semibold text-gray-900">{card.name}</h1>

                        <div className="flex flex-row justify-center items-center gap-3 mt-2">
                            <p className="text-gray-700 text-sm lg:text-md">{card.education}</p>

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
