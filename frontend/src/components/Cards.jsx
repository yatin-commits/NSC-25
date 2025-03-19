import { FaLinkedin } from "react-icons/fa";
import "./Cards.css";
import myImage from "../assets/me.jpg";
import mukul from "../assets/mukul.jpg"
import ujjwal from "../assets/Ujjwal.jpg"
import yatin from "../assets/yatin.jpg"
import navya from "../assets/navya.jpg"
import lakshita from "../assets/lakshita.jpg"
import amd from "../assets/amd.jpg"
import hiya from "../assets/hiya.jpg"
import pranav from "../assets/pranav.jpg"
import sourabh from "../assets/sourabh.jpg"
import mehak from "../assets/mehak.jpg"
import gunshita from "../assets/gunshita.jpg"
import ishaan from "../assets/ishaan.jpg"
import vanshika from "../assets/vanshika.jpg"
import karam from "../assets/karam.jpg"
import tashmeen from "../assets/tashmeen.jpg"

import pratham from "../assets/pratham.jpg"
import vijay from "../assets/vijay.jpg"
import nidhi from "../assets/nidhi.jpg"
import Harsh from "../assets/harsh.jpg"
import siya from "../assets/siya.jpg"
import darshita from "../assets/darshita.jpg"
import tushar from "../assets/tushar.jpg"
import ira from "../assets/ira.jpg"

import somil from "../assets/somil.jpg"
import ananya from "../assets/ananya.jpg"
import kanishka from "../assets/kanishka.jpg"


const Cards = () => {
    const cards = [
        {   
            img: myImage,
            name: "Shreya Singhal",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal-00010422a"
        },
        {   
            img: ujjwal,
            name: "Ujjwal chauhan",
            education: "BAJMC 3rd Year",
            url: "https://www.linkedin.com/in/shreya-singhal-00010422a"
        },
        {   
            img: Harsh,
            name: "Harsh Baswani",
            education: "B-tech 2nd Year",
            url: "https://www.linkedin.com/in/shreya-singhal-00010422a"
        },
        {   
            img: yatin,
            name: "Yatin Sharma",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal-00010422a"
        },
        {   
            img: gunshita,
            name: "Gunshita Varun",
            education: "BAJMC 3rd Year",
            url: "https://www.linkedin.com/in/gunshita-varun-795400271?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        {   
            img: ishaan,
            name: "Ishaan Verma",
            education: "MCA 2st Year",
            url: "https://www.linkedin.com/in/ishaanverma311?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        {   
            img: nidhi,
            name: "Nidhi Gupta",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/nidhigupta81?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        {   
            img: karam,
            name: "Karam Kaur",
            education: "BAJMC 2nd Year",
            url: "https://www.linkedin.com/in/karam-kaur-4867862a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        {   
            img: sourabh,
            name: "Sourabh Khera",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/sourabh-khera-356766227?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        {   
            img: ananya,
            name: "Ananya Jain",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/ananyajain11"
        },
        {   
            img: amd,
            name: "Kumar Amrendram",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/kumar-amrendram"
        },
        {   
            img: lakshita,
            name: "Lakshita Garg",
            education: "Bajmc 3rd Year",
            url: "https://www.linkedin.com/in/lakshita-garg-85956b262?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        {   
            img: myImage,
            name: "Rohit Rawat",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal-00010422a"
        },
        {   
            img: siya,
            name: "Siya Shokeen",
            education: "Bajmc 2rd Year",
            url: "https://www.linkedin.com/in/siya-shokeen-baa928316?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
        },
        {   
            img: myImage,
            name: "Revant",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/shreya-singhal-00010422a"
        },
        {   
            img: somil,
            name: "Somil",
            education: "BAJMC 2nd Year",
            url: "https://www.linkedin.com/in/somil-rathore-95a7872a8"
        },
        {   
            img: kanishka,
            name: "Kanishka Khurana",
            education: "BAJMC 2nd Year",
            url: "https://www.linkedin.com/in/kanishka-khurana-80864a291?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        {   
            img: vijay,
            name: "Vijay",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/vijay-padiyar-196258348?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        {   
            img: navya,
            name: "Navya Wadhwa",
            education: "BAJMC 3rd Year",
            url: "https://www.linkedin.com/in/navya-wadhwa-234791239?"
        },
        {   
            img: vanshika,
            name: "Vanshika Aggarwal",
            education: "BAJMC 3rd Year",
            url: "https://www.linkedin.com/in/vanshika-aggarwal-b16ab4253?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        {   
            img: pranav,
            name: "Pranav Pathak",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/pranav-pathak-a41821209/"
        },
        {   
            img: pratham,
            name: "Pratham Bhatia",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/bhatiapratham18?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
       
        {   
            img: hiya,
            name: "Hiya Chowdhary",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/hiya-chowdhry-b5b1a8252?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
        },
        {   
            img: darshita,
            name: "Darshita Dimri",
            education: "MCA 1st Year",
            url: "https://www.linkedin.com/in/darshita-dimri-160b9b21b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        {   
            img: tushar,
            name: "Tushar Sohal",
            education: "MCA 2st Year",
            url: "hhttps://www.linkedin.com/in/tushar-sohal-b70b661a2?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        {   
            img: tashmeen,
            name: "Tashmeen Kaur",
            education: "BAJMC 3rd year",
            url: "https://www.linkedin.com/in/tashmeen-kaur-21b36a271?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
        {   
            img: ira,
            name: "Ira Sharma",
            education: "BAJMC 3rd Year",
            url: "https://www.linkedin.com/in/ira-sharma-ab7388274?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
        },
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
