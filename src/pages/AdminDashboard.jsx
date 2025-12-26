import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, Settings, DollarSign, Users } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('search');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedStudent, setSearchedStudent] = useState(null);
    const [configData, setConfigData] = useState({
        quota: 'management',
        currentYear: '',
        usn: '',
        amount: ''
    });

    // Promotion Logic
    const [promotionYear, setPromotionYear] = useState(1);
    const [classStudents, setClassStudents] = useState([]);

    const handleSearchStudent = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.get(`/admin/students/search?query=${searchTerm}`);
            setSearchedStudent(data);
        } catch (error) {
            toast.error('Student not found');
            setSearchedStudent(null);
        }
    };

    const handleUpdateStudentFees = async (usn, updates) => {
        try {
            const { data } = await api.put(`/admin/students/${usn}/fees`, updates);
            toast.success('Fees Updated');
            setSearchedStudent(data);
        } catch (error) {
            toast.error('Update Failed');
        }
    };

    const handleConfigureFee = async (e) => {
        e.preventDefault();
        try {
            if (configData.quota === 'government') {
                if (!configData.currentYear) return toast.error('Select Year');
                await api.post('/admin/config/gov-fee', {
                    year: configData.currentYear,
                    amount: configData.amount
                });
                toast.success(`Government Fees updated for Year ${configData.currentYear}`);
            } else {
                if (!configData.usn) return toast.error('Enter USN');
                await api.put(`/admin/students/${configData.usn}/fees`, {
                    collegeFeeDue: configData.amount,
                    annualCollegeFee: configData.amount
                });
                toast.success('Management Fee Assigned');
            }
            setConfigData({ ...configData, amount: '' });
        } catch (error) {
            toast.error('Configuration Failed');
        }
    };

    const handleFetchClass = async () => {
        try {
            const { data } = await api.get(`/admin/students/year/${promotionYear}`);
            setClassStudents(data);
            if (data.length === 0) toast('No students found in this year', { icon: 'ℹ️' });
        } catch (error) {
            toast.error('Failed to fetch class list');
        }
    };

    const handlePromoteBatch = async () => {
        // Calculate eligible students
        const eligibleStudents = classStudents.filter(student => {
            const totalDue = (student.collegeFeeDue || 0) +
                (student.transportFeeDue || 0) +
                (student.hostelFeeDue || 0) +
                (student.placementFeeDue || 0);
            return totalDue <= 0;
        });

        const eligibleCount = eligibleStudents.length;

        if (eligibleCount === 0) {
            return toast.error('No eligible students to promote. Clear dues first.');
        }

        const confirmMsg = promotionYear === 4
            ? `Are you sure you want to GRADUATE ${eligibleCount} ELIGIBLE students from Year 4? \n\n(${classStudents.length - eligibleCount} students with pending dues will be SKIPPED)`
            : `Are you sure you want to PROMOTE ${eligibleCount} ELIGIBLE students from Year ${promotionYear} to Year ${promotionYear + 1}? \n\n(${classStudents.length - eligibleCount} students with pending dues will be SKIPPED)`;

        if (!confirm(confirmMsg)) return;

        try {
            const { data } = await api.post('/admin/students/promote', { currentYear: promotionYear });
            toast.success(data.message);
            handleFetchClass(); // Refresh list (should be empty now)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Promotion Failed');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex space-x-2 md:space-x-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'search', label: 'Search & Edit', icon: Search },
                    { id: 'fees', label: 'Fee Config', icon: Settings },
                    { id: 'promotion', label: 'Class Management', icon: Users }, // Reusing Users icon for now
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <tab.icon className="w-5 h-5 mr-2" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT */}

            {/* 1. FEE COLLECTION (Search) */}
            {activeTab === 'search' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                        <form onSubmit={handleSearchStudent} className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Enter Student USN / Roll Number"
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center">
                                <Search className="w-4 h-4 mr-2" /> Search
                            </button>
                        </form>
                    </div>

                    {searchedStudent && (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                            {/* Student Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{searchedStudent.usn}</h3>
                                    <p className="text-gray-500 text-sm">{searchedStudent.user?.name} | {searchedStudent.department}</p>
                                </div>
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase">
                                    {searchedStudent.quota}
                                </span>
                            </div>

                            {/* NEW: Dues Summary & Direct Actions */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-b border-gray-200">
                                {/* College Fee Box */}
                                <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">College Fee Due</h4>
                                        <p className="text-2xl font-bold text-indigo-700 mt-1">₹{searchedStudent.collegeFeeDue}</p>
                                    </div>
                                    {searchedStudent.collegeFeeDue > 0 ? (
                                        <div className="flex space-x-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to mark College Fee as PAID?')) {
                                                        handleUpdateStudentFees(searchedStudent.usn, { collegeFeeDue: 0 });
                                                    }
                                                }}
                                                className="flex-1 sm:flex-none justify-center px-3 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 text-sm font-bold flex items-center"
                                            >
                                                Mark Paid
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const newDue = prompt(`Update College Fee Due (Current: ₹${searchedStudent.collegeFeeDue}):`, searchedStudent.collegeFeeDue);
                                                    if (newDue !== null) {
                                                        handleUpdateStudentFees(searchedStudent.usn, { collegeFeeDue: parseInt(newDue) });
                                                    }
                                                }}
                                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-lg text-sm font-bold">Paid / No Due</span>
                                    )}
                                </div>

                                {/* Transport Fee Box */}
                                <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-orange-900 uppercase tracking-wider">Transport Fee Due</h4>
                                        <p className="text-2xl font-bold text-orange-700 mt-1">₹{searchedStudent.transportFeeDue}</p>
                                        {searchedStudent.transportRoute && <p className="text-xs text-orange-600 mt-1 font-medium bg-orange-100 px-2 py-0.5 rounded inline-block">{searchedStudent.transportRoute}</p>}
                                    </div>
                                    {searchedStudent.transportFeeDue > 0 ? (
                                        <div className="flex space-x-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to mark Transport Fee as PAID?')) {
                                                        handleUpdateStudentFees(searchedStudent.usn, { transportFeeDue: 0 });
                                                    }
                                                }}
                                                className="flex-1 sm:flex-none justify-center px-3 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 text-sm font-bold flex items-center"
                                            >
                                                Mark Paid
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const newDue = prompt(`Update Transport Fee Due (Current: ₹${searchedStudent.transportFeeDue}):`, searchedStudent.transportFeeDue);
                                                    if (newDue !== null) {
                                                        handleUpdateStudentFees(searchedStudent.usn, { transportFeeDue: parseInt(newDue) });
                                                    }
                                                }}
                                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-lg text-sm font-bold">Paid / No Due</span>
                                    )}
                                </div>

                                {/* Hostel Fee Box */}
                                <div className="bg-rose-50 p-5 rounded-xl border border-rose-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-rose-900 uppercase tracking-wider">Hostel Fee Due</h4>
                                        <p className="text-2xl font-bold text-rose-700 mt-1">₹{searchedStudent.hostelFeeDue}</p>
                                    </div>
                                    {searchedStudent.hostelFeeDue > 0 ? (
                                        <div className="flex space-x-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to mark Hostel Fee as PAID?')) {
                                                        handleUpdateStudentFees(searchedStudent.usn, { hostelFeeDue: 0 });
                                                    }
                                                }}
                                                className="flex-1 sm:flex-none justify-center px-3 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 text-sm font-bold flex items-center"
                                            >
                                                Mark Paid
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const newDue = prompt(`Update Hostel Fee Due (Current: ₹${searchedStudent.hostelFeeDue}):`, searchedStudent.hostelFeeDue);
                                                    if (newDue !== null) {
                                                        handleUpdateStudentFees(searchedStudent.usn, { hostelFeeDue: parseInt(newDue) });
                                                    }
                                                }}
                                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-lg text-sm font-bold">Paid / No Due</span>
                                    )}
                                </div>

                                {/* Placement Fee Box */}
                                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Placement Fee Due</h4>
                                        <p className="text-2xl font-bold text-blue-700 mt-1">₹{searchedStudent.placementFeeDue}</p>
                                    </div>
                                    {searchedStudent.placementFeeDue > 0 ? (
                                        <div className="flex space-x-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to mark Placement Fee as PAID?')) {
                                                        handleUpdateStudentFees(searchedStudent.usn, { placementFeeDue: 0 });
                                                    }
                                                }}
                                                className="flex-1 sm:flex-none justify-center px-3 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 text-sm font-bold flex items-center"
                                            >
                                                Mark Paid
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const newDue = prompt(`Update Placement Fee Due (Current: ₹${searchedStudent.placementFeeDue}):`, searchedStudent.placementFeeDue);
                                                    if (newDue !== null) {
                                                        handleUpdateStudentFees(searchedStudent.usn, { placementFeeDue: parseInt(newDue) });
                                                    }
                                                }}
                                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-lg text-sm font-bold">Paid / No Due</span>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="font-bold text-gray-700 mb-4 flex items-center">
                                    <DollarSign className="w-5 h-5 mr-2" /> Fee Ledger
                                </h4>

                                {searchedStudent.feeRecords && searchedStudent.feeRecords.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sem</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Due</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {searchedStudent.feeRecords
                                                    .sort((a, b) => (a.year - b.year) || ((a.semester || 0) - (b.semester || 0)))
                                                    .map((record) => (
                                                        <tr key={record._id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.year}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.semester || '-'}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{record.feeType}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{record.amountDue}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">₹{record.amountPaid}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">₹{record.amountDue - record.amountPaid}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                ${record.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                                        record.status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                                    {record.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                {record.status !== 'paid' && (
                                                                    <button
                                                                        onClick={() => {
                                                                            const amount = prompt(`Enter Payment Amount for Year ${record.year} Sem ${record.semester || '-'} ${record.feeType} (Bal: ₹${record.amountDue - record.amountPaid}):`, record.amountDue - record.amountPaid);
                                                                            if (amount) {
                                                                                const mode = prompt("Payment Mode (Cash/DD/Online):", "Cash");
                                                                                const ref = prompt("Reference No / Receipt No:", "OFFICE-" + Date.now().toString().slice(-4));
                                                                                handleUpdateStudentFees(searchedStudent.usn, {
                                                                                    feeRecordId: record._id,
                                                                                    amount: parseInt(amount),
                                                                                    mode,
                                                                                    reference: ref
                                                                                });
                                                                            }
                                                                        }}
                                                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded"
                                                                    >
                                                                        Mark as Paid
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        No fee records found for this student. Use "Fee Config" to assign fees.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 3. FEE CONFIG */}
            {activeTab === 'fees' && (
                <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                        <Settings className="mr-2 h-6 w-6 text-gray-600" />
                        Fee Configuration
                    </h2>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <form onSubmit={handleConfigureFee} className="space-y-6">

                            {/* Quota Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quota Category</label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    value={configData.quota}
                                    onChange={(e) => setConfigData({ ...configData, quota: e.target.value })}
                                >
                                    <option value="government">Government Quota (Bulk Update)</option>
                                    <option value="management">Management Quota (Individual)</option>
                                </select>
                            </div>

                            {/* Year Selection (Common for Both) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Year</label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    value={configData.currentYear}
                                    onChange={(e) => setConfigData({ ...configData, currentYear: e.target.value })}
                                    required
                                >
                                    <option value="">Select Year</option>
                                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>

                            {/* Conditional Inputs */}
                            {configData.quota === 'management' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student USN / Roll No</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Student USN"
                                        className="w-full p-2 border rounded-lg"
                                        value={configData.usn}
                                        onChange={(e) => setConfigData({ ...configData, usn: e.target.value })}
                                        required
                                    />
                                    <p className="text-xs text-orange-600 mt-1">Fee will be assigned ONLY to this student.</p>
                                </div>
                            )}

                            {/* Amount Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">College Fee Amount (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={configData.amount}
                                        onChange={(e) => setConfigData({ ...configData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold shadow-md">
                                {configData.quota === 'government' ? `Apply Fee to Year ${configData.currentYear} Students` : 'Assign Fee to Student'}
                            </button>

                        </form>
                    </div>

                    <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-200">
                        <p className="font-bold mb-1">Note:</p>
                        <p>
                            {configData.quota === 'government'
                                ? `This will update the 'College Fee Due' for ALL students currently in Year ${configData.currentYear || '...'} under Government Quota.`
                                : "This will set the 'College Fee Due' for the specific Management Quota student identified by the USN."
                            }
                        </p>
                    </div>
                </div>
            )}

            {/* 4. CLASS MANAGEMENT (Promotion) */}
            {activeTab === 'promotion' && (
                <div className="bg-white p-8 rounded-xl shadow-md max-w-5xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                        <Users className="mr-2 h-6 w-6 text-gray-600" />
                        Class Promotion Management
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-4 sm:items-end mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Year to Promote</label>
                            <select
                                className="w-48 p-2 border rounded-lg"
                                value={promotionYear}
                                onChange={(e) => setPromotionYear(parseInt(e.target.value))}
                            >
                                <option value={1}>Year 1</option>
                                <option value={2}>Year 2</option>
                                <option value={3}>Year 3</option>
                                <option value={4}>Year 4 (Graduate)</option>
                            </select>
                        </div>
                        <button
                            onClick={handleFetchClass}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-bold border border-gray-300"
                        >
                            Fetch Students
                        </button>
                    </div>

                    {classStudents.length > 0 && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                                <h3 className="font-bold text-gray-700">Year {promotionYear} - Active Students ({classStudents.length})</h3>
                                <button
                                    onClick={handlePromoteBatch}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-md animate-pulse"
                                >
                                    {(() => {
                                        const eligibleCount = classStudents.filter(s => ((s.collegeFeeDue || 0) + (s.transportFeeDue || 0) + (s.hostelFeeDue || 0) + (s.placementFeeDue || 0)) <= 0).length;
                                        return promotionYear === 4
                                            ? `Graduate ${eligibleCount} Eligible Candidates`
                                            : `Promote ${eligibleCount} Eligible Candidates`;
                                    })()}
                                </button>
                            </div>
                            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">USN</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quota</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Due</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {classStudents.map(student => {
                                            const totalDue = (student.collegeFeeDue || 0) +
                                                (student.transportFeeDue || 0) +
                                                (student.hostelFeeDue || 0) +
                                                (student.placementFeeDue || 0);
                                            const isEligible = totalDue <= 0;

                                            return (
                                                <tr key={student._id} className={!isEligible ? 'bg-red-50' : ''}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.usn}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.user?.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.department}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{student.quota}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{totalDue.toLocaleString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {isEligible ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                Eligible
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100 text-red-800 animate-pulse">
                                                                Dues Pending
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
