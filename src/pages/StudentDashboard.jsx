import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle, AlertCircle, Clock, Camera, Wallet, BookOpen, Bus, Book, Briefcase, Home } from 'lucide-react';

const StudentDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [eligibility, setEligibility] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [payments, setPayments] = useState([]);
    const [libraryRecords, setLibraryRecords] = useState([]);
    const [activeFeeYear, setActiveFeeYear] = useState(1);
    const [feeTab, setFeeTab] = useState('college');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const fetchData = async () => {
        try {
            const [profileRes, eligibilityRes, notificationsRes, paymentsRes, libraryRes] = await Promise.all([
                api.get('/students/profile'),
                api.get('/students/eligibility'),
                api.get('/admin/notifications'), // Fetch active notifications
                api.get('/payments/my-history'), // Fetch student payments
                api.get('/library/my-books') // Fetch library records
            ]);
            setProfile(profileRes.data);
            setActiveFeeYear(profileRes.data.currentYear || 1);
            setEligibility(eligibilityRes.data);
            setNotifications(notificationsRes.data);
            setPayments(paymentsRes.data);
            setLibraryRecords(libraryRes.data);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        setUploading(true);
        try {
            const { data } = await api.post('/upload/profile-photo', formData);

            // Optimistically update profile photo
            setProfile(prev => ({
                ...prev,
                user: { ...prev.user, photoUrl: data.photoUrl }
            }));

            toast.success('Profile photo updated!');
        } catch (error) {
            console.error(error);
            toast.error(`Upload Failed: ${error.message} - ${error.response?.status}`);
        } finally {
            setUploading(false);
        }
    };

    const handlePayment = async (amount, type, notificationId = null) => {
        try {
            const { data: order } = await api.post('/payments/create-order', {
                amount,
                paymentType: type
            });

            const { data: { key } } = await api.get('/payments/key');

            const options = {
                key: key,
                amount: order.amount,
                currency: order.currency,
                name: "College Fee System",
                description: `Payment for ${type}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await api.post('/payments/verify', {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            paymentType: type,
                            amount: amount,
                            examNotificationId: notificationId
                        });
                        toast.success('Payment Successful!');
                        fetchData(); // Refresh data - Instant UI Update
                    } catch (error) {
                        toast.error('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: profile?.user?.name,
                    email: profile?.user?.email,
                    contact: ""
                },
                theme: {
                    color: "#4f46e5"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            toast.error('Failed to initiate payment');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-medium text-indigo-600">Loading Dashboard...</div>;

    const isEligible = eligibility?.isEligible;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">


            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-lg border-l-4 border-brand-500 p-6 md:p-8 flex flex-col gap-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center w-full">
                    <div className="flex items-center space-x-5 w-full md:w-auto justify-center md:justify-start">
                        <div className="relative group">
                            <div className="h-20 w-20 rounded-full ring-4 ring-brand-100 overflow-hidden bg-brand-50 flex items-center justify-center">
                                {profile?.user?.photoUrl ? (
                                    <img
                                        src={`http://localhost:5000${profile.user.photoUrl}`}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <CheckCircle className="h-8 w-8 text-brand-600" />
                                )}
                            </div>
                            {/* Upload Button Overlay */}
                            <label className="absolute bottom-0 right-0 bg-brand-600 text-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-brand-700 transition-colors hidden group-hover:flex items-center justify-center" title="Change Photo">
                                {uploading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Camera className="w-4 h-4" />
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1">Student Profile</p>
                            <h2 className="text-2xl font-serif font-bold text-brand-900 leading-none">{profile?.user?.name}</h2>
                            <p className="text-sm text-gray-500 font-mono mt-1">{profile?.usn}</p>
                        </div>
                    </div>
                    <div className="h-12 w-px bg-gray-200 hidden md:block mx-2"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 flex-1 w-full">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Dept</p>
                            <p className="font-bold text-gray-800 text-lg">{profile?.department}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Year</p>
                            <p className="font-bold text-gray-800 text-lg">{profile?.currentYear}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Quota</p>
                            <p className="font-bold text-gray-800 text-lg capitalize">{profile?.quota}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Entry</p>
                            <p className="font-bold text-gray-800 text-lg capitalize">{profile?.entry}</p>
                        </div>
                    </div>
                </div>
                {profile?.transportOpted && profile?.transportRoute && (
                    <div className="pt-4 border-t border-gray-100 w-full">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Transport Route</p>
                        <p className="font-bold text-gray-800 text-lg flex items-center">
                            <Bus className="w-4 h-4 mr-2 text-indigo-500" />
                            {profile.transportRoute}
                        </p>
                    </div>
                )}
            </div>

            {/* Fee Details Tabs Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gray-50/50 border-b border-gray-200 px-4 md:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center">
                        <Wallet className="mr-3 h-6 w-6 text-brand-600" />
                        Fee Details
                    </h3>
                    <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="bg-white p-1 rounded-lg border border-gray-200 flex shadow-sm min-w-max">
                            <button
                                onClick={() => setFeeTab('college')}
                                className={`px-4 py-3 rounded-md text-sm font-bold transition-all duration-200 flex items-center ${feeTab === 'college'
                                    ? 'bg-brand-600 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Admission Fee
                            </button>
                            <button
                                onClick={() => setFeeTab('transport')}
                                className={`px-4 py-3 rounded-md text-sm font-bold transition-all duration-200 flex items-center ${feeTab === 'transport'
                                    ? 'bg-brand-600 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <Bus className="w-4 h-4 mr-2" />
                                Transport Fee
                            </button>
                            <button
                                onClick={() => setFeeTab('library')}
                                className={`px-4 py-3 rounded-md text-sm font-bold transition-all duration-200 flex items-center ${feeTab === 'library'
                                    ? 'bg-brand-600 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <Book className="w-4 h-4 mr-2" />
                                Library
                            </button>
                            <button
                                onClick={() => setFeeTab('placement')}
                                className={`px-4 py-3 rounded-md text-sm font-bold transition-all duration-200 flex items-center ${feeTab === 'placement'
                                    ? 'bg-brand-600 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <Briefcase className="w-4 h-4 mr-2" />
                                Placement Fee
                            </button>
                            <button
                                onClick={() => setFeeTab('hostel')}
                                className={`px-4 py-3 rounded-md text-sm font-bold transition-all duration-200 flex items-center ${feeTab === 'hostel'
                                    ? 'bg-brand-600 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Hostel Fee
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {(() => {
                        if (feeTab === 'library') {
                            const activeBooks = libraryRecords.filter(r => r.status === 'borrowed' || r.status === 'overdue');
                            const returnedBooks = libraryRecords.filter(r => r.status === 'returned');

                            return (
                                <div className="space-y-6">
                                    <h4 className="text-lg font-serif font-bold text-gray-800 flex items-center">
                                        <Book className="mr-2 h-5 w-5 text-gray-400" />
                                        Pending Returns ({activeBooks.length})
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {activeBooks.length > 0 ? activeBooks.map(book => (
                                            <div key={book._id} className="border border-red-100 bg-red-50/30 rounded-xl p-4 flex justify-between items-start">
                                                <div>
                                                    <h5 className="font-bold text-gray-900">{book.bookTitle}</h5>
                                                    <p className="text-xs text-gray-500 font-mono mb-2">ID: {book.bookId}</p>
                                                    <p className="text-sm text-gray-600">Due: <span className="font-bold">{new Date(book.dueDate).toLocaleDateString()}</span></p>
                                                </div>
                                                <span className="px-2 py-1 rounded-md bg-white border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wide">
                                                    {book.status}
                                                </span>
                                            </div>
                                        )) : (
                                            <p className="col-span-full text-center text-gray-500 italic py-4">No pending books.</p>
                                        )}
                                    </div>

                                    {returnedBooks.length > 0 && (
                                        <>
                                            <h4 className="text-lg font-serif font-bold text-gray-800 flex items-center mt-6">
                                                <CheckCircle className="mr-2 h-5 w-5 text-gray-400" />
                                                Return History
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {returnedBooks.map(book => (
                                                    <div key={book._id} className="border border-gray-100 bg-gray-50/30 rounded-xl p-4 flex justify-between items-start opacity-75">
                                                        <div>
                                                            <h5 className="font-bold text-gray-700">{book.bookTitle}</h5>
                                                            <p className="text-xs text-gray-500 font-mono mb-1">ID: {book.bookId}</p>
                                                            <p className="text-xs text-gray-500">Returned: {new Date(book.returnDate).toLocaleDateString()}</p>
                                                        </div>
                                                        <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wide">
                                                            Returned
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        }

                        const feeRecords = profile?.feeRecords?.filter(r => r.year === activeFeeYear && r.feeType === feeTab) || [];
                        const totalDue = feeRecords.reduce((sum, r) => sum + r.amountDue, 0);
                        const totalPaid = feeRecords.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
                        const pending = totalDue - totalPaid;


                        return (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-brand-50/50 rounded-xl p-6 border border-brand-100 relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 -mt-4 -mr-4 w-24 h-24 bg-brand-200/20 rounded-full blur-2xl transition-all group-hover:bg-brand-200/40"></div>
                                        <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1 relative z-10">Total Fee</p>
                                        <h4 className="text-3xl font-serif font-bold text-gray-900 relative z-10">₹{totalDue.toLocaleString()}</h4>
                                    </div>
                                    <div className="bg-emerald-50/50 rounded-xl p-6 border border-emerald-100 relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-200/20 rounded-full blur-2xl transition-all group-hover:bg-emerald-200/40"></div>
                                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1 relative z-10">Paid Amount</p>
                                        <h4 className="text-3xl font-serif font-bold text-gray-900 relative z-10">₹{totalPaid.toLocaleString()}</h4>
                                    </div>
                                    <div className="bg-rose-50/50 rounded-xl p-6 border border-rose-100 relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 -mt-4 -mr-4 w-24 h-24 bg-rose-200/20 rounded-full blur-2xl transition-all group-hover:bg-rose-200/40"></div>
                                        <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1 relative z-10">Pending Due</p>
                                        <h4 className="text-3xl font-serif font-bold text-gray-900 relative z-10">₹{pending.toLocaleString()}</h4>
                                    </div>
                                </div>


                            </div>
                        );
                    })()}

                    {/* Integrated Fee Structure List */}
                    {feeTab !== 'library' && (
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <h4 className="text-lg font-serif font-bold text-gray-800 mb-4 flex items-center">
                                <CreditCard className="mr-2 h-5 w-5 text-gray-400" />
                                Detailed Breakdown
                            </h4>

                            {/* Year Tabs */}
                            <div className="flex space-x-1 mb-6 bg-gray-50 p-1 rounded-lg max-w-md">
                                {[1, 2, 3, 4].map(year => (
                                    <button
                                        key={year}
                                        onClick={() => setActiveFeeYear(year)}
                                        className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all duration-200 uppercase tracking-wide ${activeFeeYear === year
                                            ? 'bg-white text-brand-700 shadow-sm ring-1 ring-black/5'
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        Year {year}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {feeTab !== 'library' && [...new Set(profile?.feeRecords?.filter(r => r.year === activeFeeYear && r.feeType === feeTab).map(r => r.semester))].sort().map(sem => {
                                    const semRecords = profile?.feeRecords?.filter(r => r.year === activeFeeYear && r.semester === sem && r.feeType === feeTab);
                                    // ... rest of the code
                                    return (
                                        <div key={sem} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                                <span className="font-bold text-gray-800 text-sm">Semester {sem}</span>
                                            </div>
                                            <div className="p-4 space-y-4">
                                                {semRecords.map((record, idx) => (
                                                    <div key={idx} className="flex flex-col space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${record.status === 'paid' ? 'bg-green-100 text-green-700' : record.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                                {record.status === 'paid' ? 'Paid' : record.status === 'partial' ? 'Partial' : 'Pending'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-xs text-gray-500 font-medium">
                                                            <span>Due: ₹{record.amountDue.toLocaleString()}</span>
                                                            <span>Paid: ₹{record.amountPaid?.toLocaleString() || 0}</span>
                                                        </div>

                                                    </div>
                                                ))}
                                                {semRecords.length === 0 && <p className="text-sm text-gray-400 italic text-center py-2">No fee records found.</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                                {feeTab !== 'library' && (!profile?.feeRecords || profile.feeRecords.filter(r => r.year === activeFeeYear && r.feeType === feeTab).length === 0) && (
                                    <div className="col-span-full text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        No {feeTab} fee records for Year {activeFeeYear}.
                                        <br />
                                        <span className="text-xs text-gray-400">If you have recently been promoted, fees may not be configured yet.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">

                    {/* Eligibility Status */}
                    <div className={`rounded-xl shadow-lg hover:shadow-xl transition-all p-6 text-white relative overflow-hidden group ${isEligible ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-rose-500 to-pink-600'}`}>
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>

                        <h3 className="text-xl font-bold mb-3 flex items-center relative z-10 font-serif">
                            {isEligible ? <CheckCircle className="mr-2" /> : <AlertCircle className="mr-2" />}
                            Fee Status
                        </h3>
                        <p className="opacity-95 mb-5 text-sm leading-relaxed relative z-10 font-medium">
                            {isEligible
                                ? "All regular dues are cleared. You are eligible to register for upcoming exams."
                                : "You have pending dues. Please clear them to become eligible for exams."}
                        </p>
                        {!isEligible && (
                            <div className="bg-black/10 p-4 rounded-lg text-xs backdrop-blur-sm border border-white/10 relative z-10">
                                <p className="font-bold mb-2 uppercase tracking-wide opacity-80">Reasons For Ineligibility</p>
                                <ul className="list-disc list-inside space-y-1.5 font-medium">
                                    {eligibility?.reasons?.map((reason, idx) => (
                                        <li key={idx}>{reason}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Exam Notifications - Right Column (Span 2) */}
                <div className="lg:col-span-2">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center">
                        <Clock className="mr-3 h-7 w-7 text-brand-600" />
                        Upcoming Exams
                    </h3>

                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-dashed border-gray-300">
                            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No active exam notifications at the moment.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {notifications.filter(n => n.year === profile?.currentYear).map((exam) => {
                                const isPaid = payments.some(p => p.examNotificationId === exam._id && p.status === 'completed');
                                const today = new Date();
                                const startDate = new Date(exam.startDate);
                                const endDate = new Date(exam.endDate);
                                const isDateValid = today >= startDate && today <= endDate;

                                // Semester-wise Eligibility Logic
                                const isOddSem = (exam.semester % 2 !== 0);
                                const isExamEligible = isOddSem ? eligibility?.eligibleForOddSem : eligibility?.eligibleForEvenSem;

                                // Late Fee Logic
                                const isLate = exam.lateFee > 0; // Simple check if penalty is set
                                const totalAmount = exam.examFeeAmount + (isLate ? exam.lateFee : 0);

                                // Library Check
                                const hasPendingBooks = libraryRecords.some(r => r.status !== 'returned');

                                return (
                                    <div key={exam._id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                        <div className="p-7">
                                            <div className="flex justify-between items-start mb-5">
                                                <div>
                                                    <h4 className="text-2xl font-serif font-bold text-brand-900 group-hover:text-brand-700 transition-colors">{exam.title}</h4>
                                                    <div className="flex items-center space-x-3 mt-2">
                                                        <span className="px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wide border border-brand-100">
                                                            Year {exam.year}
                                                        </span>
                                                        <span className="px-2.5 py-0.5 rounded-md bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wide border border-gray-100">
                                                            Sem {exam.semester || 'N/A'}
                                                        </span>
                                                    </div>

                                                    {isLate && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 mt-2 border border-rose-100">
                                                            <AlertCircle className="w-3 h-3 mr-1" /> Late Fee Applied: ₹{exam.lateFee}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="bg-brand-50 text-brand-800 font-bold px-5 py-3 rounded-lg text-xl flex flex-col items-end shadow-inner border border-brand-100">
                                                    <span>₹{totalAmount.toLocaleString()}</span>
                                                    {isLate && <span className="text-xs text-brand-400 line-through">₹{exam.examFeeAmount}</span>}
                                                </div>
                                            </div>

                                            {exam.description && (
                                                <p className="text-gray-600 mb-6 bg-gray-50/80 p-4 rounded-lg text-sm border-l-4 border-gray-300 italic">
                                                    "{exam.description}"
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                                                <div className="text-sm font-medium text-gray-500">
                                                    <div className="flex items-center space-x-6">
                                                        <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-brand-400" /> Start: <span className="text-gray-800 ml-1">{startDate.toLocaleDateString()}</span></span>
                                                        <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-brand-400" /> End: <span className="text-gray-800 ml-1">{endDate.toLocaleDateString()}</span></span>
                                                    </div>
                                                </div>

                                                {isPaid ? (
                                                    <button disabled className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-lg font-bold flex items-center cursor-default border border-emerald-100 shadow-sm">
                                                        <CheckCircle className="mr-2 h-5 w-5 fill-emerald-100" /> Fee Paid
                                                    </button>
                                                ) : !isDateValid ? (
                                                    <button disabled className="px-6 py-3 bg-gray-100 text-gray-400 rounded-lg font-bold cursor-not-allowed flex items-center border border-gray-200">
                                                        {today < startDate ? "Starts Soon" : "Expired"} <Clock className="ml-2 h-4 w-4" />
                                                    </button>
                                                ) : hasPendingBooks ? (
                                                    <button disabled className="px-6 py-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg font-bold cursor-not-allowed flex items-center text-sm">
                                                        Clear Library Dues <Book className="ml-2 h-4 w-4" />
                                                    </button>
                                                ) : isExamEligible ? (
                                                    <button
                                                        onClick={() => handlePayment(totalAmount, 'exam_fee', exam._id)}
                                                        className="px-8 py-3 bg-gradient-to-r from-brand-600 to-brand-800 text-white rounded-lg font-bold shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transform transition-all flex items-center text-sm uppercase tracking-wide"
                                                    >
                                                        Pay Exam Fee <CreditCard className="ml-2 h-4 w-4" />
                                                    </button>
                                                ) : (
                                                    <button disabled className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg font-bold cursor-not-allowed flex items-center text-sm">
                                                        {isOddSem ? "Eligibility: Need 50% Paid" : "Eligibility: Need 100% Paid"} <AlertCircle className="ml-2 h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>

                                        </div>
                                        {/* Strip at bottom */}
                                        <div className={`h-1.5 w-full ${isPaid ? 'bg-emerald-500' : isExamEligible ? 'bg-brand-500' : 'bg-rose-400'}`}></div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
