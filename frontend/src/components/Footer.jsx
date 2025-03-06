import { FaInstagram, FaFacebook, FaLinkedin, FaPaperPlane } from "react-icons/fa";
import logo from '../assets/bvicamLogo.png';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-gray-950 via-black to-gray-900 text-gray-300 py-16 px-6 relative">
            <div className="max-w-7xl mx-auto -mt-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
                
                
                <div>
                    <img src={logo} alt="BVICAM Logo" className="w-48 mx-auto md:mx-0 drop-shadow-lg" />
                    <p className="mt-4 text-sm text-gray-400">© BVICAM 2024. All rights reserved.</p>
                </div>
                
                
                <div>
                    <h2 className="font-semibold text-xl text-white mb-4 border-l-4 border-yellow-400 pl-3">Quick Links</h2>
                    <ul className="space-y-3">
                        <li><Link to="/schedule" className="hover:text-yellow-400 transition duration-300">Schedule</Link></li>
                        <li><Link to="/events" className="hover:text-yellow-400 transition duration-300">Events</Link></li>
                        <li><Link to="/coordinators" className="hover:text-yellow-400 transition duration-300">Coordinators</Link></li>
                        <li><Link to="/faqs" className="hover:text-yellow-400 transition duration-300">FAQ's</Link></li>
                    </ul>
                </div>
                
                
                <div>
                    <h2 className="font-semibold text-xl text-white mb-4 border-l-4 border-yellow-400 pl-3">Follow Us</h2>
                    <div className="flex justify-center md:justify-start space-x-6 mt-3">
                        <FaFacebook size={32} className="hover:text-blue-500 transition-transform transform hover:scale-125 hover:shadow-lg cursor-pointer" />
                        <FaInstagram size={32} className="hover:text-pink-500 transition-transform transform hover:scale-125 hover:shadow-lg cursor-pointer" />
                        <FaLinkedin size={32} className="hover:text-blue-400 transition-transform transform hover:scale-125 hover:shadow-lg cursor-pointer" />
                    </div>
                </div>
                
                
                <div>
                    <h2 className="font-semibold text-xl text-white mb-4 border-l-4 border-yellow-400 pl-3">Stay Updated</h2>
                    <p className="text-sm text-gray-400">Subscribe to our newsletter for the latest updates.</p>
                    <div className="mt-5 flex items-center bg-gray-900/60 backdrop-blur-md rounded-full px-4 py-2 shadow-lg w-80">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="bg-transparent text-white placeholder-gray-400 focus:outline-none flex-grow px-3 py-2 focus:ring-2 focus:ring-yellow-400 rounded-full"
                        />
                        <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-full transition-transform transform hover:scale-110 hover:shadow-lg">
                            <FaPaperPlane className="text-black" />
                        </button>
                    </div>
                </div>
            </div>

            
            <div className="mt-12 relative text-center">
                <div className="text-[4rem] md:text-[11rem] -mt-21 font-bold text-gray-500 opacity-17 uppercase tracking-widest">BVICAM</div>
                <p className="mt-[-2rem] text-sm text-gray-500 -mb-3">Made with ❤️ and a lot of ☕ by Shreya & Yatin</p>
            </div>
        </footer>
    );
}

export default Footer;
