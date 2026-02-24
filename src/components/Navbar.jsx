import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';

// Logo assets (Paths from public directory)
const srlLogo = "/SRL.svg";
const mmpsrpcLogo = "/mmpsrpc.png";
const svkmLogo = "/svkm.png";
const ksvLogo = "/ksv.png";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Exact Sequence: 1. Home | 2. SRL Sessions | 3. Achievements | 4. Researchers | 5. Leaderboard | 6. About Us
    const menuItems = [
        { label: "Home", path: "/" },
        { label: "SRL Sessions", path: "/sessions" },
        { label: "Achievements", path: "/achievements" },
        { label: "Researchers", path: "/researchers" },
        { label: "Leaderboard", path: "/leaderboard" },
    ];

    const institutionalLinks = [
        { label: "SVKM", path: "https://www.svkm.org.in/", isExternal: true },
        { label: "KSV", path: "https://www.ksv.ac.in/", isExternal: true },
        { label: "MMPSRPC", path: "/organization/mmpsrpc", isExternal: false },
    ];

    return (
        <nav className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-[#FAF9F6]/95 backdrop-blur-md shadow-md py-2' : 'bg-[#FAF9F6] py-4'}`}>
            {/* MAIN CONTAINER - Increased max-width and adjusted padding to remove "extra space" */}
            <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between px-8">

                {/* WRAPPER 1: LEFT (Logo & Site Title) - w-auto for natural width */}
                <div className="flex items-center gap-4 shrink-0">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-full p-2 flex items-center justify-center shadow-md shrink-0 transition-transform group-hover:scale-105">
                            <img src={srlLogo} alt="SRL" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-teal-900 font-black text-sm lg:text-lg xl:text-3xl tracking-tight leading-none whitespace-nowrap">
                                Students Research Lab <span className="text-teal-600">(SRL)</span>
                            </h1>
                            <p className="text-teal-800/80 font-bold text-[8px] lg:text-[10px] xl:text-xs uppercase tracking-widest whitespace-nowrap">
                                MMPSRPC, Kadi Sarva Vishwavidyalaya
                            </p>
                        </div>
                    </Link>
                </div>

                {/* WRAPPER 2: CENTER-RIGHT (Navigation Links) - Shifting towards right side */}
                <div className="hidden xl:flex items-center justify-end flex-1 px-12">
                    <div className="flex items-center gap-x-6 2xl:gap-x-10">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                className={({ isActive }) => `
                                    relative py-1 text-sm lg:text-[15px] font-black transition-all duration-300 whitespace-nowrap uppercase tracking-wider
                                    ${isActive ? "text-teal-700" : "text-teal-900/70 hover:text-teal-900"}
                                    group/link
                                `}
                            >
                                {item.label}
                                <span className={`absolute bottom-0 left-0 h-[3px] bg-teal-600 transition-all duration-300 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                            </NavLink>
                        ))}

                        {/* About Us Dropdown */}
                        <div className="relative group/about" onMouseEnter={() => setAboutDropdownOpen(true)} onMouseLeave={() => setAboutDropdownOpen(false)}>
                            <button className="flex items-center gap-1.5 py-1 text-sm lg:text-[15px] font-black text-teal-900/70 hover:text-teal-900 transition-all whitespace-nowrap uppercase tracking-wider">
                                About Us <ChevronDown size={14} className={`transition-transform duration-300 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {aboutDropdownOpen && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white shadow-2xl rounded-xl overflow-hidden py-2 mt-3 border border-teal-50">
                                        {institutionalLinks.map((link) => (
                                            link.isExternal ? (
                                                <a key={link.label} href={link.path} target="_blank" rel="noopener noreferrer" className="block px-6 py-3 text-xs font-black text-gray-700 hover:bg-teal-50 hover:text-[#0D9488] transition-all">
                                                    {link.label}
                                                </a>
                                            ) : (
                                                <Link key={link.label} to={link.path} className="block px-6 py-3 text-xs font-black text-gray-700 hover:bg-teal-50 hover:text-[#0D9488] transition-all">
                                                    {link.label}
                                                </Link>
                                            )
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* WRAPPER 3: RIGHT (Buttons & Partner Logos) - Grouped tightly */}
                <div className="flex items-center justify-end gap-x-6 shrink-0">
                    <div className="hidden lg:flex items-center gap-x-3">
                        <Link to="/join" className="px-6 py-3 bg-gradient-to-br from-[#FCD34D] via-[#D97706] to-[#B45309] text-white font-black rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all text-xs xl:text-sm whitespace-nowrap uppercase tracking-wider">
                            Join Us
                        </Link>
                        <a href="https://appointment.mmpsrpc.in/" target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-white text-[#0D9488] border border-teal-100 shadow-sm font-black rounded-full hover:scale-105 active:scale-95 transition-all text-xs xl:text-sm whitespace-nowrap uppercase tracking-wider">
                            SRL Appointment System
                        </a>
                    </div>

                    <div className="hidden xl:flex items-center gap-x-4 border-l border-teal-900/10 pl-6 shrink-0">
                        <a href="https://www.svkm.org.in/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                            <img src={svkmLogo} alt="SVKM" className="h-10 lg:h-12 w-auto object-contain" />
                        </a>
                        <a href="https://www.ksv.ac.in/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-300">
                            <img src={ksvLogo} alt="KSV" className="h-10 lg:h-12 w-auto object-contain" />
                        </a>
                        <a href="/organization/mmpsrpc" className="hover:scale-110 transition-transform duration-300">
                            <img src={mmpsrpcLogo} alt="MMPSRPC" className="h-10 lg:h-12 w-auto object-contain" />
                        </a>
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setOpen(!open)} className="xl:hidden text-teal-900 p-2 hover:bg-teal-50 rounded-lg transition-colors shrink-0">
                        {open ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>
            </div>

            {/* MOBILE DRAWER */}
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-[110] xl:hidden flex flex-col">
                        <div className="p-6 flex justify-between items-center border-b border-gray-100 bg-teal-50/30">
                            <div className="flex items-center gap-3">
                                <img src={srlLogo} alt="SRL" className="w-10 h-10 object-contain" />
                                <span className="font-black text-[#0D9488] text-xl uppercase tracking-tighter">Students Lab</span>
                            </div>
                            <button onClick={() => setOpen(false)} className="p-2 text-[#0D9488] hover:bg-teal-50 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-3">
                            {menuItems.map((item) => (
                                <NavLink key={item.label} to={item.path} onClick={() => setOpen(false)} className={({ isActive }) => `block px-6 py-4 rounded-2xl font-black text-xl transition-all ${isActive ? 'bg-teal-50 text-[#0D9488] border-l-4 border-[#0D9488]' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    {item.label}
                                </NavLink>
                            ))}
                            <div className="pt-6">
                                <p className="px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b pb-2">Our Institutions</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {institutionalLinks.map((link) => (
                                        <a key={link.label} href={link.path} className="flex items-center justify-between px-6 py-4 bg-gray-50 rounded-2xl font-black text-[#0D9488] hover:bg-teal-50 transition-all">
                                            {link.label} <ChevronDown size={18} className="-rotate-90 opacity-40" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-8 border-t border-gray-100 space-y-4 bg-gray-50/50">
                            <Link to="/join" onClick={() => setOpen(false)} className="block w-full py-5 text-center bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-black rounded-3xl shadow-xl uppercase tracking-widest text-lg transition-transform active:scale-95">Join Us Now</Link>
                            <a href="https://appointment.mmpsrpc.in/" className="block w-full py-5 text-center bg-[#0D9488] text-white font-black rounded-3xl shadow-xl uppercase tracking-widest text-lg transition-transform active:scale-95">SRL Appointment</a>
                            <div className="flex justify-center items-center gap-8 py-6 opacity-80">
                                <img src={svkmLogo} className="h-8 w-auto object-contain" alt="SVKM" />
                                <img src={ksvLogo} className="h-8 w-auto object-contain" alt="KSV" />
                                <img src={mmpsrpcLogo} className="h-8 w-auto object-contain" alt="MMPSRPC" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
