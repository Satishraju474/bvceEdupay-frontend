import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, GraduationCap } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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

                    {/* Navigation/User Section */}
                    <div className="flex items-center space-x-6">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-3 pl-6">
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
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
