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
        <div className="relative w-full px-4 py-10 overflow-hidden">
            <div className="flex space-x-20 py-2 px-2 animate-scroll-reverse">
                {[...cards, ...cards].map((card, index) => (
                    <div key={index} className="bg-white/80 shadow-md rounded-2xl p-6 flex flex-col items-center h-80 w-50 lg:w-100 lg:h-95 min-w-[16rem] transition-all transform hover:scale-105">
                        <div className="relative w-40 h-40 lg:w-55 lg:h-55 mb-4 rounded-full overflow-hidden border-4 border-[#E9E8F8]">
                            <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                        </div>

                        <h1 className="text-xl font-bold text-gray-900">{card.name}</h1>

                        <div className="flex flex-row justify-center items-center gap-3">
                            <p className="mt-2 text-gray-700 text-md mb-3">{card.education}</p>

                            <div className="w-[.05rem] h-5 bg-black opacity-70"></div>

                            <a href={card.url} target="_blank" className="text-blue-600 text-2xl hover:text-blue-800 transition-all">
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
