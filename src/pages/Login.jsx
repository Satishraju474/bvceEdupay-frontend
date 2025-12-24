import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Lock, User } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { username, password });
            login(data);
            toast.success('Login Successful!');

            if (data.role === 'student') navigate('/student/dashboard');
            else if (data.role === 'admin') navigate('/admin/dashboard');
            else if (data.role === 'principal') navigate('/principal/dashboard');
            else if (data.role === 'exam_head') navigate('/exam-head/dashboard');
            else if (data.role === 'transport_dept') navigate('/transport/dashboard');
            else if (data.role === 'registrar') navigate('/registrar/dashboard');
            else navigate('/');

        } catch (error) {
            toast.error(error.response?.data?.message || 'Login Failed');
        }
    };

    return (
        <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-900 to-brand-800 transform -skew-y-6 origin-top-left z-0"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl z-0"></div>

            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md relative z-10 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 rounded-full bg-brand-50 mb-4">
                        <Lock className="h-8 w-8 text-brand-700" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-brand-900 tracking-tight">Student Portal</h2>
                    <p className="text-gray-500 mt-2 text-sm font-medium">BVC Group of Institutions</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 tracking-wide">USERNAME / USN</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400 group-focus-within:text-brand-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-all bg-gray-50 focus:bg-white placeholder-gray-400 text-gray-800"
                                placeholder="Enter your ID"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 tracking-wide">PASSWORD</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-600 transition-colors" />
                            </div>
                            <input
                                type="password"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-all bg-gray-50 focus:bg-white placeholder-gray-400 text-gray-800"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md hover:shadow-lg text-sm font-bold text-white bg-gradient-to-r from-brand-700 to-brand-600 hover:from-brand-800 hover:to-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-300 uppercase tracking-wider"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="mailto:satishraju3548@gmail.com" className="text-xs text-brand-500 hover:text-brand-700 font-medium underline underline-offset-2 transition-colors">
                        Need help? Contact Admin Office.
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
