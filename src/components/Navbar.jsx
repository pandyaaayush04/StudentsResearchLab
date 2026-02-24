import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

// Assets from public directory
import srlLogo from "/SRL.svg";
const mmpsrpcLogo = "/mmpsrpc.png";
const svkmLogo = "/svkm.png";
const ksvLogo = "/ksv.png";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Requested Sequence: SRL Sessions | Achievements | researchers | Leaderboard | Join Us | Appointment
    const menuItems = [
        { label: "SRL Sessions", path: "/sessions" },
        { label: "Achievements", path: "/achievements" },
        { label: "Researchers", path: "/researchers" },
        { label: "Leaderboard", path: "/leaderboard" },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-r from-teal-800 via-teal-700 to-teal-600 shadow-lg sticky top-0 ${isScrolled ? 'py-2 lg:py-3 h-auto' : 'py-3 lg:py-4 h-auto'}`}>
                {/* Cube pattern overlay */}
                <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

                <div className="w-[98%] mx-auto relative z-10">
                    <div className="flex justify-between items-center">
                        {/* LEFT: Logo + Text */}
                        <Link to="/" className="flex items-center flex-shrink-0 min-w-0 group">
                            <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-all group-hover:scale-110 shadow-xl border-2 border-white/20">
                                <img
                                    src={srlLogo}
                                    alt="SRL Logo"
                                    className="w-10 h-10 lg:w-11 lg:h-11 xl:w-13 xl:h-13 object-contain"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="font-bold text-white hover:text-[#F8E7C1] transition duration-300 leading-tight">
                                    <span className="text-sm sm:text-base lg:text-lg tracking-tight font-serif whitespace-nowrap">Students Research Lab (SRL)</span>
                                </h1>
                                <p className="text-[#F8E7C1] font-semibold leading-tight text-[10px] sm:text-xs lg:text-xs xl:text-sm font-sans uppercase tracking-[0.1em]">
                                    MMPSRPC, Kadi Sarva Vishwavidyalaya
                                </p>
                            </div>
                        </Link>

                        {/* CENTER: Navigation (Desktop) */}
                        <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
                            <div className="flex items-center gap-1 xl:gap-2">
                                {menuItems.map((item) => (
                                    <NavLink
                                        key={item.label}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `block px-2 xl:px-4 py-2 font-medium transition-all duration-300 rounded-md whitespace-nowrap text-xs lg:text-[11px] xl:text-sm
                                            ${isActive ? "bg-teal-700 text-white shadow-inner" : "text-white hover:bg-teal-700/50"}`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}

                                {/* Glow Button for Appointment */}
                                <a
                                    href="https://appointment.mmpsrpc.in/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glow-button inline-flex items-center justify-center px-4 xl:px-6 py-2 text-teal-900 text-[10px] xl:text-xs font-black rounded-md ml-4 uppercase tracking-widest group/btn"
                                >
                                    <span className="relative z-10 transition-colors group-hover/btn:text-teal-950">SRL Appointment System</span>
                                    <div className="glow-effect"></div>
                                </a>
                                <span className="text-white/30 ml-4 hidden xl:block font-light">|</span>
                            </div>
                        </div>

                        {/* RIGHT: Partner Logos (Desktop) */}
                        <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
                            <a href="https://www.ksv.ac.in/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 transition-transform hover:scale-110">
                                <img src={ksvLogo} alt="KSV Logo" className="w-9 h-9 xl:w-12 xl:h-12 object-contain filter brightness-110" />
                            </a>
                            <a href="https://www.svkm.org.in/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 transition-transform hover:scale-110">
                                <img src={svkmLogo} alt="SVKM Logo" className="w-8 h-10 xl:w-10 xl:h-12 object-contain filter brightness-110" />
                            </a>
                            <a href="/organization/mmpsrpc" className="flex-shrink-0 transition-transform hover:scale-110">
                                <img src={mmpsrpcLogo} alt="MMPSRPC Logo" className="w-9 h-9 xl:w-12 xl:h-12 object-contain filter brightness-110" />
                            </a>
                        </div>

                        {/* MOBILE MENU TOGGLE */}
                        <button
                            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => setOpen((v) => !v)}
                        >
                            {open ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-teal-800 shadow-2xl overflow-hidden border-t border-white/10 relative z-50 mt-2"
                        >
                            <div className="flex flex-col px-6 py-8 gap-4">
                                {menuItems.map((item) => (
                                    <NavLink
                                        key={item.label}
                                        to={item.path}
                                        onClick={() => setOpen(false)}
                                        className={({ isActive }) =>
                                            `text-sm font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition-all
                                            ${isActive ? "bg-teal-700 text-white" : "text-white/80 hover:text-white"}`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}

                                <div className="pt-4 px-4">
                                    <a
                                        href="https://appointment.mmpsrpc.in/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setOpen(false)}
                                        className="glow-button block w-full text-center py-4 rounded-xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all text-xs text-teal-900 relative overflow-hidden"
                                    >
                                        <span className="relative z-10">SRL Appointment System</span>
                                        <div className="glow-effect"></div>
                                    </a>
                                </div>

                                <div className="flex justify-center gap-8 py-6 border-t border-white/10 mt-4">
                                    <img src={ksvLogo} className="h-10 w-10 object-contain brightness-125" alt="KSV" />
                                    <img src={svkmLogo} className="h-10 w-10 object-contain brightness-125" alt="SVKM" />
                                    <img src={mmpsrpcLogo} className="h-10 w-10 object-contain brightness-125" alt="MMPSRPC" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

        </>
    );
};

export default Navbar;
