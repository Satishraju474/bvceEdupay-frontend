
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, ShieldCheck, Clock, Users, BookOpen, CreditCard, LayoutDashboard } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <header className="relative bg-brand-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 opacity-90"></div>
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500 opacity-20 blur-3xl"></div>
                    <div className="absolute top-20 left-1/3 w-72 h-72 rounded-full bg-accent opacity-10 blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-800 border border-brand-600 text-brand-200 text-sm font-semibold mb-6 animate-in slide-in-from-top">
                        Welcome to BVCEduPay
                    </span>
                    <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight mb-6 leading-tight max-w-4xl">
                        Streamline Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-brand-300">College Experience</span> with One Platform
                    </h1>
                    <p className="text-lg md:text-xl text-brand-100 max-w-2xl mb-10 leading-relaxed">
                        A comprehensive ERP solution for BVC Group of Institutions. Manage fees, exams, placements, and more with our seamless digital ecosystem.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link to="/login" className="px-8 py-4 rounded-full bg-accent text-brand-900 font-bold text-lg shadow-[0_0_20px_rgba(0,210,211,0.3)] hover:shadow-[0_0_30px_rgba(0,210,211,0.5)] hover:bg-white hover:scale-105 transition-all duration-300 flex items-center justify-center">
                            Get Started <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <a href="#features" className="px-8 py-4 rounded-full bg-transparent border-2 border-brand-500 text-white font-bold text-lg hover:bg-brand-800 transition-all duration-300 flex items-center justify-center">
                            Learn More
                        </a>
                    </div>
                </div>

                {/* Wave Decoration at Bottom */}
                <div className="absolute bottom-0 w-full overflow-hidden leading-none rotate-180">
                    <svg className="relative block w-full h-12 md:h-24" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
                    </svg>
                </div>
            </header>

            {/* Features Grid */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-brand-600 font-bold uppercase tracking-widest text-sm mb-2">Our Features</h2>
                        <h3 className="text-3xl md:text-4xl font-heading font-bold text-brand-900">Why Choose BVCEduPay?</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group p-8 rounded-2xl bg-brand-50 hover:bg-white border border-brand-100 hover:border-brand-200 transition-all duration-300 shadow-sm hover:shadow-xl">
                            <div className="w-14 h-14 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <CreditCard className="h-7 w-7" />
                            </div>
                            <h4 className="text-xl font-bold text-brand-900 mb-3">Seamless Payments</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Pay tuition, hostel, and transport fees effortlessly. Our secure gateway ensures transaction safety and instant receipts.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-8 rounded-2xl bg-brand-50 hover:bg-white border border-brand-100 hover:border-brand-200 transition-all duration-300 shadow-sm hover:shadow-xl">
                            <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <LayoutDashboard className="h-7 w-7" />
                            </div>
                            <h4 className="text-xl font-bold text-brand-900 mb-3">Role-Based Dashboards</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Specialized interfaces for Students, Admission, Transport, Library, and more, tailored to your specific needs.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-8 rounded-2xl bg-brand-50 hover:bg-white border border-brand-100 hover:border-brand-200 transition-all duration-300 shadow-sm hover:shadow-xl">
                            <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <h4 className="text-xl font-bold text-brand-900 mb-3">Secure & Reliable</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Built with top-tier security standards to protect student data and financial records.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group p-8 rounded-2xl bg-brand-50 hover:bg-white border border-brand-100 hover:border-brand-200 transition-all duration-300 shadow-sm hover:shadow-xl">
                            <div className="w-14 h-14 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Clock className="h-7 w-7" />
                            </div>
                            <h4 className="text-xl font-bold text-brand-900 mb-3">Real-time Updates</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Get instant notifications for exams, fee deadlines, and placement opportunities. Never miss an important update.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="group p-8 rounded-2xl bg-brand-50 hover:bg-white border border-brand-100 hover:border-brand-200 transition-all duration-300 shadow-sm hover:shadow-xl">
                            <div className="w-14 h-14 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="h-7 w-7" />
                            </div>
                            <h4 className="text-xl font-bold text-brand-900 mb-3">Academic Management</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Track attendance, grades, and academic progress with our integrated tools for students and faculty.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="group p-8 rounded-2xl bg-brand-50 hover:bg-white border border-brand-100 hover:border-brand-200 transition-all duration-300 shadow-sm hover:shadow-xl">
                            <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Users className="h-7 w-7" />
                            </div>
                            <h4 className="text-xl font-bold text-brand-900 mb-3">Placement Support</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Dedicated portal for placement activities, company drives, and career guidance resources.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Overview */}
            <section className="py-20 bg-brand-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-brand-700">
                        <div className="p-4">
                            <div className="text-4xl md:text-5xl font-extrabold text-accent mb-2">5000+</div>
                            <div className="text-brand-200 font-medium tracking-wide uppercas text-sm">Students</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl md:text-5xl font-extrabold text-accent mb-2">500+</div>
                            <div className="text-brand-200 font-medium tracking-wide uppercase text-sm">Faculty</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl md:text-5xl font-extrabold text-accent mb-2">20+</div>
                            <div className="text-brand-200 font-medium tracking-wide uppercase text-sm">Courses</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl md:text-5xl font-extrabold text-accent mb-2">100%</div>
                            <div className="text-brand-200 font-medium tracking-wide uppercase text-sm">Placement</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-900 mb-6">Ready to Experience the Future?</h2>
                    <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                        Join the BVC community and access all your academic and financial information in one place.
                    </p>
                    <Link to="/login" className="inline-flex items-center px-10 py-5 rounded-full bg-brand-600 text-white font-bold text-xl shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all hover:-translate-y-1">
                        Login Now
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
