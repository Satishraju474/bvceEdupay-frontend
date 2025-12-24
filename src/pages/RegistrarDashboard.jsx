import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { UserPlus, Key, Eye, EyeOff } from 'lucide-react';

const RegistrarDashboard = () => {
    const [activeTab, setActiveTab] = useState('create');

    // Create Student Form
    const [formData, setFormData] = useState({
        username: '', password: '', name: '', department: 'CSE',
        currentYear: 1, quota: 'government', entry: 'regular', email: '',
        transportOpted: false, assignedCollegeFee: 0, assignedTransportFee: 0
    });

    // Removed regulations and batches arrays as they are no longer needed

    // Reset Password Form
    const [resetData, setResetData] = useState({ username: '', newPassword: '' });

    const [searchUSN, setSearchUSN] = useState('');
    const [searchedStudent, setSearchedStudent] = useState(null);

    const handleSearchStudent = async () => {
        if (!searchUSN) return toast.error('Please enter a USN');
        try {
            const { data } = await api.get(`/registrar/students/${searchUSN}`);
            setSearchedStudent(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Student not found');
            setSearchedStudent(null);
        }
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/registrar/students', formData);
            toast.success('Student Created Successfully');
            // Reset crucial fields
            setFormData({ ...formData, username: '', name: '', email: '', password: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create student');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await api.post('/registrar/reset-password', resetData);
            toast.success('Password Reset Successfully');
            setResetData({ username: '', newPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Registrar Dashboard</h1>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'create' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Student
                </button>
                <button
                    onClick={() => setActiveTab('reset')}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'reset' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Key className="w-5 h-5 mr-2" />
                    Reset Password
                </button>
                <button
                    onClick={() => setActiveTab('view')}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'view' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Eye className="w-5 h-5 mr-2" />
                    View Student
                </button>
            </div>

            {/* TAB: CREATE STUDENT */}
            {activeTab === 'create' && (
                <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl">
                    <h2 className="text-xl font-bold mb-6">Register New Student</h2>
                    <form onSubmit={handleCreateStudent} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">USN / Roll No</label>
                                <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Department</label>
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                    <option>CSE</option><option>ECE</option><option>ME</option><option>CV</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quota</label>
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.quota} onChange={e => setFormData({ ...formData, quota: e.target.value })}>
                                    <option value="government">Government</option>
                                    <option value="management">Management</option>
                                </select>
                            </div>
                        </div>

                        {/* Management Fee Input - Optional Checkbox Logic could be here, but usually mandatory for Mgmt */}
                        {formData.quota === 'management' && (
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <label className="block text-sm font-bold text-yellow-800">Assign Management College Fee (₹)</label>
                                <input type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.assignedCollegeFee} onChange={e => setFormData({ ...formData, assignedCollegeFee: e.target.value })} />
                            </div>
                        )}

                        {/* Transport Option */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center mb-2">
                                <input type="checkbox" id="transport" className="h-4 w-4 text-indigo-600 rounded"
                                    checked={formData.transportOpted} onChange={e => setFormData({ ...formData, transportOpted: e.target.checked })} />
                                <label htmlFor="transport" className="ml-2 block text-sm font-medium text-gray-900">Opt for Transport?</label>
                            </div>

                            {formData.transportOpted && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Assign Transport Fee (₹)</label>
                                    <input type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                        value={formData.assignedTransportFee} onChange={e => setFormData({ ...formData, assignedTransportFee: e.target.value })} />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Year</label>
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                    value={formData.currentYear} onChange={e => setFormData({ ...formData, currentYear: parseInt(e.target.value) })}>
                                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                                </select>
                            </div>

                            {/* Removed Batch and Regulation Selectors */}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Entry Type</label>
                            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                value={formData.entry} onChange={e => setFormData({ ...formData, entry: e.target.value })}>
                                <option value="regular">Regular</option>
                                <option value="lateral">Lateral</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Default Password</label>
                            <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        </div>

                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                            Create Student Account
                        </button>
                    </form>
                </div>
            )}

            {/* TAB: RESET PASSWORD */}
            {activeTab === 'reset' && (
                <div className="bg-white p-8 rounded-xl shadow-md max-w-xl">
                    <h2 className="text-xl font-bold mb-6">Reset User Password</h2>
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Student USN / Username</label>
                            <input type="text" required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                placeholder="Enter USN"
                                value={resetData.username}
                                onChange={e => setResetData({ ...resetData, username: e.target.value })} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input type="text" required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                placeholder="Enter New Password"
                                value={resetData.newPassword}
                                onChange={e => setResetData({ ...resetData, newPassword: e.target.value })} />
                        </div>

                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                            Reset Password
                        </button>
                    </form>
                </div>
            )}

            {/* TAB: VIEW STUDENT */}
            {activeTab === 'view' && (
                <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl">
                    <h2 className="text-xl font-bold mb-6">View Student Details</h2>
                    <div className="flex space-x-4 mb-8">
                        <input
                            type="text"
                            placeholder="Enter Student USN"
                            className="flex-1 rounded-md border-gray-300 shadow-sm border p-2"
                            value={searchUSN}
                            onChange={(e) => setSearchUSN(e.target.value)}
                        />
                        <button
                            onClick={handleSearchStudent}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center"
                        >
                            <Eye className="w-5 h-5 mr-2" /> Search
                        </button>
                    </div>

                    {searchedStudent && (
                        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                            <div className="flex items-start space-x-6">
                                <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md flex-shrink-0">
                                    {searchedStudent.user.photoUrl ? (
                                        <img
                                            src={`http://localhost:5000${searchedStudent.user.photoUrl}`}
                                            alt="Student"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-xs uppercase text-center p-2">
                                            No Photo
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Name</p>
                                        <p className="text-xl font-bold text-gray-900">{searchedStudent.user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">USN</p>
                                        <p className="text-lg font-bold text-gray-900">{searchedStudent.usn}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Department</p>
                                        <p className="text-lg font-bold text-gray-900">{searchedStudent.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Year</p>
                                        <p className="text-lg font-bold text-gray-900">{searchedStudent.currentYear}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Email</p>
                                        <p className="text-gray-900">{searchedStudent.user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Quota</p>
                                        <p className="text-gray-900 capitalize">{searchedStudent.quota}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default RegistrarDashboard;
