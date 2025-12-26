import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gradient-to-r from-brand-50 via-white to-brand-50 text-brand-900 shadow-md border-b border-brand-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Section */}
                    <div className="flex items-center cursor-pointer group" onClick={() => {
                        if (user) logout();
                        navigate('/login');
                    }}>
                        {/* Logo blends naturally with white bg */}
                        <img src="/logo.jpg" alt="BVC Group" className="h-12 w-auto object-contain mr-3 mix-blend-multiply" />

                        <div className="flex flex-col border-l-2 border-brand-200 pl-3 py-1">
                            <span className="font-heading font-extrabold text-2xl tracking-normal text-brand-900 leading-none">
                                BVCEduPay
                            </span>
                            <span className="text-[11px] uppercase tracking-[0.2em] text-brand-500 font-bold mt-1 font-heading">
                                Group of Institutions
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-3 pl-6">
                                    {user.role === 'librarian' && (
                                        <Link to="/librarian/dashboard" className="text-sm font-bold text-gray-500 hover:text-brand-600 mr-2">
                                            Dashboard
                                        </Link>
                                    )}
                                    {user.role === 'placement_officer' && (
                                        <Link to="/placement/dashboard" className="text-sm font-bold text-gray-500 hover:text-brand-600 mr-2">
                                            Dashboard
                                        </Link>
                                    )}
                                    {user.role === 'hostel_warden' && (
                                        <Link to="/hostel/dashboard" className="text-sm font-bold text-gray-500 hover:text-brand-600 mr-2">
                                            Dashboard
                                        </Link>
                                    )}
                                    <div className="flex flex-col items-end hidden md:flex">
                                        <span className="text-sm font-bold text-brand-900">{user.name}</span>
                                        <span className="text-xs font-medium text-brand-500 bg-brand-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="h-10 w-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 border-2 border-white shadow-sm ring-1 ring-brand-200">
                                        <User className="h-5 w-5" />
                                    </div>
                                </div>

                                <button
                                    onClick={logout}
                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="px-6 py-2.5 rounded-full bg-brand-600 text-white font-medium shadow-md hover:bg-brand-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-brand-600 hover:text-brand-900 hover:bg-brand-100 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay & Drawer */}
            <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>

                {/* Drawer */}
                <div className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                    {/* Drawer Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <span className="font-heading font-extrabold text-xl text-brand-900">Menu</span>
                        <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Drawer Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-4 p-4 bg-brand-50 rounded-xl border border-brand-100">
                                    <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-brand-600 shadow-sm ring-2 ring-brand-200">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-brand-900">{user.name}</p>
                                        <p className="text-xs font-bold text-brand-500 uppercase tracking-wider">{user.role}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Navigation</p>
                                    {user.role === 'librarian' && (
                                        <Link to="/librarian/dashboard" className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-brand-50 hover:text-brand-700 transition-all border border-transparent hover:border-brand-100" onClick={() => setIsOpen(false)}>
                                            <span className="mr-3">📚</span> Library Dashboard
                                        </Link>
                                    )}
                                    {user.role === 'placement_officer' && (
                                        <Link to="/placement/dashboard" className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-brand-50 hover:text-brand-700 transition-all border border-transparent hover:border-brand-100" onClick={() => setIsOpen(false)}>
                                            <span className="mr-3">💼</span> Placement Dashboard
                                        </Link>
                                    )}
                                    {user.role === 'hostel_warden' && (
                                        <Link to="/hostel/dashboard" className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-brand-50 hover:text-brand-700 transition-all border border-transparent hover:border-brand-100" onClick={() => setIsOpen(false)}>
                                            <span className="mr-3">🏠</span> Hostel Dashboard
                                        </Link>
                                    )}
                                    {/* Add general dashboard link if needed, or based on role */}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-4 pt-10">
                                <div className="p-4 bg-brand-50 rounded-full mb-2">
                                    <User className="h-10 w-10 text-brand-300" />
                                </div>
                                <p className="text-gray-500 text-center text-sm px-6">Please login to access your dashboard and services.</p>
                            </div>
                        )}
                    </div>

                    {/* Drawer Footer */}
                    <div className="p-5 border-t border-gray-100 bg-gray-50">
                        {user ? (
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-white border border-red-100 text-red-600 font-bold shadow-sm hover:bg-red-50 hover:border-red-200 transition-all"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Sign Out</span>
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="block w-full text-center px-6 py-3 rounded-lg bg-brand-600 text-white font-bold shadow-lg hover:bg-brand-700 transition-transform active:scale-95"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
