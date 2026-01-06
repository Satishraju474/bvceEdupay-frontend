import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
    LayoutDashboard,
    Search,
    Settings,
    GraduationCap,
    Menu,
    X,
    CreditCard,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    Search as SearchIcon,
    ArrowUpRight,
    Users,
    FileText
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

// --- Components ---

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
        {subtext && (
            <div className="mt-4 flex items-center text-xs font-medium text-gray-400">
                {subtext}
            </div>
        )}
    </div>
);

const SearchInput = ({ value, onChange, placeholder, onSearch }) => (
    <div className="relative group w-full max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(e)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
                onClick={onSearch}
                className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors text-xs font-medium shadow-sm"
            >
                Enter
            </button>
        </div>
    </div>
);

const SectionHeader = ({ title, description }) => (
    <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500 max-w-2xl">{description}</p>}
    </div>
);

// --- Main Dashboard ---

const SearchStudentView = ({
    searchTerm,
    setSearchTerm,
    handleSearch,
    searchedStudent,
    concessionMode,
    setConcessionMode,
    concessionVal,
    setConcessionVal,
    handleUpdateFees
}) => {
    const [localSearch, setLocalSearch] = useState(searchTerm);

    // Sync if parent updates (optional, but good for resetting)
    useEffect(() => {
        setLocalSearch(searchTerm);
    }, [searchTerm]);

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Search Student Database</h3>
                <div className="flex justify-center">
                    <SearchInput
                        placeholder="Enter USN or Name"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        onSearch={() => handleSearch(localSearch)}
                    />
                </div>
            </div>

            {searchedStudent && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{searchedStudent.usn}</h2>
                            <p className="opacity-80 mt-1 text-lg">{searchedStudent.user?.name}</p>
                            <div className="flex gap-3 mt-4">
                                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">{searchedStudent.department}</span>
                                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm capitalize">{searchedStudent.quota}</span>
                            </div>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-bold text-2xl">
                            {searchedStudent.user?.name?.charAt(0)}
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: 'College Fee', key: 'collegeFeeDue' },
                            { label: 'Transport Fee', key: 'transportFeeDue' },
                            { label: 'Hostel Fee', key: 'hostelFeeDue' },
                            { label: 'Placement Fee', key: 'placementFeeDue' }
                        ].map(fee => (
                            <div key={fee.key} className="p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-100 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{fee.label}</span>
                                    {searchedStudent[fee.key] === 0 ? (
                                        <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold ring-1 ring-green-100">PAID</span>
                                    ) : (
                                        <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs font-bold ring-1 ring-red-100">DUE</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-2xl font-bold text-gray-900">₹{searchedStudent[fee.key]?.toLocaleString()}</span>
                                </div>

                                {searchedStudent[fee.key] > 0 && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100">
                                        {concessionMode === fee.key ? (
                                            <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm animate-fade-in text-sm">
                                                <p className="mb-2 font-medium text-gray-700">Grant Recommendation Concession</p>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Amount"
                                                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                                        value={concessionVal}
                                                        onChange={(e) => setConcessionVal(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={() => {
                                                            const val = Number(concessionVal);
                                                            if (!val || val <= 0) return toast.error("Enter valid amount");
                                                            if (val > searchedStudent[fee.key]) return toast.error("Concession cannot exceed due");

                                                            const newDue = searchedStudent[fee.key] - val;
                                                            handleUpdateFees(searchedStudent.usn, { [fee.key]: newDue });
                                                            toast.success(`Concession of ₹${val} applied!`);
                                                            setConcessionMode(null);
                                                            setConcessionVal('');
                                                        }}
                                                        className="flex-1 bg-indigo-600 text-white py-1.5 rounded-md text-xs font-bold hover:bg-indigo-700"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => { setConcessionMode(null); setConcessionVal(''); }}
                                                        className="px-3 bg-gray-100 text-gray-600 py-1.5 rounded-md text-xs font-bold hover:bg-gray-200"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setConcessionMode(fee.key); setConcessionVal(''); }}
                                                    className="flex-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                                                >
                                                    Concession
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Mark this fee as fully PAID?')) handleUpdateFees(searchedStudent.usn, { [fee.key]: 0 });
                                                    }}
                                                    className="flex-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                                                >
                                                    Mark Paid
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mx-8 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-indigo-600" />
                            Fee Ledger History
                        </h3>
                        <div className="space-y-3">
                            {/* Simulated Historic Data */}
                            {Array.from({ length: searchedStudent.currentYear - 1 }, (_, i) => i + 1).flatMap(year => {
                                // Check for existence
                                const hasRecord = searchedStudent.feeRecords?.some(r => r.year === year && r.feeType === 'college');
                                if (hasRecord) return [];

                                const semA = (year * 2) - 1;
                                const semB = year * 2;

                                return [semA, semB].map(sem => (
                                    <div key={`hist-adm-sem-${sem}`} className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-200 opacity-60">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <CheckCircle size={16} className="text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-700 text-sm">Year {year} - Semester {sem}</p>
                                                <p className="text-xs text-gray-500">College / Tuition Fee</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold border border-gray-200">ARCHIVED</span>
                                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">PAID</span>
                                        </div>
                                    </div>
                                ));
                            })}

                            {/* Actual Records */}
                            {searchedStudent.feeRecords && searchedStudent.feeRecords.length > 0 ? (
                                searchedStudent.feeRecords.sort((a, b) => b.year - a.year || b.semester - a.semester).map((record) => (
                                    <div key={record._id} className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${record.status === 'paid' ? 'bg-green-50' : 'bg-red-50'}`}>
                                                <CreditCard size={16} className={`${record.status === 'paid' ? 'text-green-600' : 'text-red-600'}`} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">Year {record.year} - Semester {record.semester}</p>
                                                <p className="text-xs text-gray-500 capitalize">{record.feeType} Fee</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 mt-3 md:mt-0 w-full md:w-auto">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 font-medium uppercase">Amount Due</p>
                                                <p className="font-bold text-gray-900">₹{record.amountDue}</p>
                                            </div>
                                            <div className="text-right border-l border-gray-100 pl-6">
                                                <p className="text-xs text-gray-400 font-medium uppercase">Paid</p>
                                                <p className={`font-bold ${record.amountPaid >= record.amountDue ? 'text-green-600' : 'text-gray-900'}`}>₹{record.amountPaid}</p>
                                            </div>
                                            <div className="pl-2">
                                                {record.status === 'paid' ? (
                                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold block text-center min-w-[80px]">PAID</span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold block text-center min-w-[80px]">PENDING</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400 italic">No active ledger records found.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminDashboard = () => {
    // Layout State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('analytics');

    // Data State
    const [analyticsData, setAnalyticsData] = useState(null);
    const [analyticsFilter, setAnalyticsFilter] = useState({ year: 'all', department: 'all', type: 'all' });
    const [searchedStudent, setSearchedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [configData, setConfigData] = useState({ quota: 'government', currentYear: '', usn: '', amount: '' });
    const [classStudents, setClassStudents] = useState([]);
    const [promotionYear, setPromotionYear] = useState(1);
    const [loading, setLoading] = useState(false);

    // Directory State
    const [directoryStudents, setDirectoryStudents] = useState([]);
    const [directoryFilter, setDirectoryFilter] = useState({ department: 'all', year: 'all' });

    // Concession State
    const [concessionMode, setConcessionMode] = useState(null); // 'collegeFeeDue', etc.
    const [concessionVal, setConcessionVal] = useState('');

    // --- Effects & Handlers ---

    useEffect(() => {
        if (activeTab === 'analytics') fetchAnalytics();
        if (activeTab === 'users') fetchDirectory();
    }, [activeTab, analyticsFilter, directoryFilter]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const { year, department, type } = analyticsFilter;
            const { data } = await api.get(`/admin/analytics?year=${year}&department=${department}&type=${type}`);
            setAnalyticsData(data);
        } catch (error) {
            toast.error('Could not load analytics');
        } finally {
            setLoading(false);
        }
    };

    const fetchDirectory = async () => {
        try {
            setLoading(true);
            const { department, year } = directoryFilter;
            const { data } = await api.get(`/admin/students?department=${department}&year=${year}`);
            setDirectoryStudents(data);
        } catch (error) {
            toast.error('Could not load student directory');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!searchTerm.trim()) return;
        try {
            setLoading(true);
            const { data } = await api.get(`/admin/students/search?query=${searchTerm}`);
            setSearchedStudent(data);
        } catch (error) {
            toast.error('Student not found');
            setSearchedStudent(null);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateFees = async (usn, updates) => {
        try {
            const { data } = await api.put(`/admin/students/${usn}/fees`, updates);
            toast.success('Fee record updated');
            setSearchedStudent(data);
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleFetchClass = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/admin/students/year/${promotionYear}`);
            setClassStudents(data);
            if (data.length === 0) toast('No students found for this year', { icon: 'ℹ️' });
        } catch (error) {
            toast.error('Failed to fetch class');
        } finally {
            setLoading(false);
        }
    };

    const handlePromote = async () => {
        const eligible = classStudents.filter(s => {
            const totalDue = (s.collegeFeeDue || 0) + (s.transportFeeDue || 0) + (s.hostelFeeDue || 0) + (s.placementFeeDue || 0);
            return totalDue <= 0;
        });
        if (eligible.length === 0) return toast.error('No eligible students found');

        if (!confirm(`Promote ${eligible.length} students?`)) return;

        try {
            const { data } = await api.post('/admin/students/promote', { currentYear: promotionYear });
            toast.success(data.message);
            handleFetchClass();
        } catch (error) {
            toast.error('Promotion failed');
        }
    };

    const handleConfigSubmit = async (e) => {
        e.preventDefault();
        try {
            if (configData.quota === 'government') {
                if (!configData.currentYear) return toast.error('Select Year');
                await api.post('/admin/config/gov-fee', { year: configData.currentYear, amount: configData.amount });
                toast.success('Bulk update successful');
            } else {
                if (!configData.usn) return toast.error('Enter USN');
                await api.put(`/admin/students/${configData.usn}/fees`, { collegeFeeDue: configData.amount, annualCollegeFee: configData.amount });
                toast.success('Individual fee assigned');
            }
            setConfigData(prev => ({ ...prev, amount: '' }));
        } catch (error) {
            toast.error('Configuration failed');
        }
    };

    const formatValue = (val) => {
        if (analyticsFilter.type === 'all') return val;
        return `₹${(val / 100000).toFixed(1)}L`;
    };

    // --- Sub-Views ---

    const StudentsDirectoryView = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700">Filter Directory</h3>
                <div className="flex gap-3 w-full sm:w-auto">
                    <select
                        className="flex-1 sm:w-40 p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        value={directoryFilter.department}
                        onChange={(e) => setDirectoryFilter({ ...directoryFilter, department: e.target.value })}
                    >
                        <option value="all">All Departments</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="AIML">AIML</option>
                        <option value="CSM">CSM</option>
                        <option value="CAD">CAD</option>
                        <option value="EEE">EEE</option>
                        <option value="CIVIL">CIVIL</option>
                        <option value="MECH">MECH</option>
                    </select>

                    <select
                        className="flex-1 sm:w-32 p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        value={directoryFilter.year}
                        onChange={(e) => setDirectoryFilter({ ...directoryFilter, year: e.target.value })}
                    >
                        <option value="all">All Years</option>
                        {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">USN</th>
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Year</th>
                                <th className="px-6 py-4">Quota</th>
                                <th className="px-6 py-4">Contact Email</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {directoryStudents.length > 0 ? directoryStudents.map(student => (
                                <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-medium text-indigo-600">{student.usn}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{student.user?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
                                            {student.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">Year {student.currentYear}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${student.quota === 'government' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                                            }`}>
                                            {student.quota}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{student.user?.email || 'N/A'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                                        No students found matching filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-xs text-center text-gray-500">
                    Showing {directoryStudents.length} Record{directoryStudents.length !== 1 && 's'}
                </div>
            </div>
        </div>
    );

    const AnalyticsView = () => (
        <div className="space-y-6 animate-fade-in">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700">Financial Insights</h3>
                <div className="flex gap-3 w-full sm:w-auto flex-wrap">
                    <select
                        className="p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        value={analyticsFilter.type}
                        onChange={(e) => setAnalyticsFilter({ ...analyticsFilter, type: e.target.value })}
                    >
                        <option value="all">Overall Status (Student Count)</option>
                        <option value="college">Academic Fee (₹)</option>
                        <option value="transport">Transport Fee (₹)</option>
                        <option value="hostel">Hostel Fee (₹)</option>
                        <option value="placement">Training Fee (₹)</option>
                        <option value="exam">Exam Fee (₹)</option>
                    </select>

                    <select
                        className="p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        value={analyticsFilter.department}
                        onChange={(e) => setAnalyticsFilter({ ...analyticsFilter, department: e.target.value })}
                    >
                        <option value="all">All Departments</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="AIML">AIML</option>
                        <option value="CSM">CSM</option>
                        <option value="CAD">CAD</option>
                        <option value="EEE">EEE</option>
                        <option value="CIVIL">CIVIL</option>
                        <option value="MECH">MECH</option>
                    </select>

                    <select
                        className="p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        value={analyticsFilter.year}
                        onChange={(e) => setAnalyticsFilter({ ...analyticsFilter, year: e.target.value })}
                    >
                        <option value="all">All Years</option>
                        {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            {(() => {
                const type = analyticsFilter.type;

                const getFeeConfig = (t) => {
                    const configs = {
                        college: { label: 'Academic', key: 'College' },
                        transport: { label: 'Transport', key: 'Transport' },
                        hostel: { label: 'Hostel', key: 'Hostel' },
                        placement: { label: 'Training', key: 'Placement' }
                    };
                    return configs[t];
                };

                if (type === 'exam') {
                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StatCard
                                title="Active Exam Collection"
                                value={`₹${(analyticsData?.totalExamCollected / 100000).toFixed(1)}L`}
                                subtext="Total Paid"
                                icon={CheckCircle}
                                colorClass="bg-emerald-50 text-emerald-600"
                            />
                            <StatCard
                                title="Estimated Pending"
                                value={`₹${(analyticsData?.totalExamPending / 100000).toFixed(1)}L`}
                                subtext="Based on Active Notifications"
                                icon={AlertCircle}
                                colorClass="bg-red-50 text-red-600"
                            />
                        </div>
                    );
                }

                if (type !== 'all' && getFeeConfig(type)) {
                    const config = getFeeConfig(type);
                    const annual = analyticsData?.[`total${config.key}Annual`] || 0;
                    const due = analyticsData?.[`total${config.key}Due`] || 0;
                    const collected = Math.max(0, annual - due);

                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StatCard
                                title={`${config.label} Collected`}
                                value={`₹${(collected / 100000).toFixed(1)}L`}
                                subtext={`Total ${config.label} Received`}
                                icon={CheckCircle}
                                colorClass="bg-emerald-50 text-emerald-600"
                            />
                            <StatCard
                                title={`${config.label} Due`}
                                value={`₹${(due / 100000).toFixed(1)}L`}
                                subtext={`Pending ${config.label} Payments`}
                                icon={AlertCircle}
                                colorClass="bg-red-50 text-red-600"
                            />
                        </div>
                    );
                }

                return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard
                            title="Academic Due"
                            value={`₹${(analyticsData?.totalCollegeDue / 100000).toFixed(1)}L`}
                            subtext="Pending Collection"
                            icon={GraduationCap}
                            colorClass="bg-indigo-50 text-indigo-600"
                        />
                        <StatCard
                            title="Transport Due"
                            value={`₹${(analyticsData?.totalTransportDue / 100000).toFixed(1)}L`}
                            subtext="Logistics Pending"
                            icon={CreditCard}
                            colorClass="bg-orange-50 text-orange-600"
                        />
                        <StatCard
                            title="Hostel Due"
                            value={`₹${(analyticsData?.totalHostelDue / 100000).toFixed(1)}L`}
                            subtext="Accommodation"
                            icon={LayoutDashboard}
                            colorClass="bg-rose-50 text-rose-600"
                        />
                        <StatCard
                            title="Training Due"
                            value={`₹${(analyticsData?.totalPlacementDue / 100000).toFixed(1)}L`}
                            subtext="Placement Cell"
                            icon={CheckCircle}
                            colorClass="bg-green-50 text-green-600"
                        />
                    </div>
                );
            })()}

            {/* Chart */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-gray-800">
                        {analyticsFilter.type === 'all' ? 'Student Payment Status Distribution' : `${analyticsFilter.type.charAt(0).toUpperCase() + analyticsFilter.type.slice(1)} Fee Collection Analysis`}
                    </h3>
                    <div className="flex gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> {analyticsFilter.type === 'all' ? 'Fully Paid' : 'Collected'}</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div> {analyticsFilter.type === 'all' ? 'Has Dues' : 'Pending'}</div>
                    </div>
                </div>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData?.breakdown || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 11 }}
                                tickFormatter={formatValue}
                            />
                            <Tooltip
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                formatter={(value) => analyticsFilter.type === 'all' ? value : `₹${value.toLocaleString()}`}
                            />
                            <Bar
                                dataKey="fullyPaid"
                                name={analyticsFilter.type === 'all' ? "Students Paid" : "Collected"}
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                            />
                            <Bar
                                dataKey="pending"
                                name={analyticsFilter.type === 'all' ? "Students Pending" : "Pending"}
                                fill="#ef4444"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    // SearchStudentView component moved to top level

    const FeeConfigView = () => (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Fee Structure Configuration</h3>
            <form onSubmit={handleConfigSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Target Audience</label>
                        <select
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium"
                            value={configData.quota}
                            onChange={(e) => setConfigData({ ...configData, quota: e.target.value })}
                        >
                            <option value="government">Government (Bulk Class)</option>
                            <option value="management">Management (Single Student)</option>
                            <option value="nri">NRI (Single Student)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Academic Year</label>
                        <select
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium"
                            value={configData.currentYear}
                            onChange={(e) => setConfigData({ ...configData, currentYear: e.target.value })}
                        >
                            <option value="">Select Year</option>
                            {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                        </select>
                    </div>
                </div>

                {configData.quota !== 'government' && (
                    <div className="animate-fade-in">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Student USN</label>
                        <input
                            type="text"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium"
                            placeholder="Enter USN"
                            value={configData.usn}
                            onChange={(e) => setConfigData({ ...configData, usn: e.target.value })}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Annual College Fee (₹)</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-lg font-bold text-gray-900"
                        placeholder="0.00"
                        value={configData.amount}
                        onChange={(e) => setConfigData({ ...configData, amount: e.target.value })}
                    />
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.99]">
                        Apply Fee Configuration
                    </button>
                </div>
            </form>
        </div>
    );

    const AcademicView = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <select
                        className="flex-1 md:w-48 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                        value={promotionYear}
                        onChange={(e) => setPromotionYear(parseInt(e.target.value))}
                    >
                        <option value={1}>Year 1</option>
                        <option value={2}>Year 2</option>
                        <option value={3}>Year 3</option>
                        <option value={4}>Year 4</option>
                    </select>
                    <button
                        onClick={handleFetchClass}
                        className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Load Data
                    </button>
                </div>
                {classStudents.length > 0 && (
                    <button
                        onClick={handlePromote}
                        className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
                    >
                        Process Promotion
                    </button>
                )}
            </div>

            {classStudents.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">USN</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Eligibility</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {classStudents.map(student => {
                                    const totalDue = (student.collegeFeeDue || 0) + (student.transportFeeDue || 0) + (student.hostelFeeDue || 0) + (student.placementFeeDue || 0);
                                    const isEligible = totalDue <= 0;
                                    return (
                                        <tr key={student._id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{student.usn}</td>
                                            <td className="px-6 py-4 text-gray-600">{student.user?.name}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 capitalize">
                                                    {student.quota}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isEligible ? (
                                                    <span className="flex items-center text-green-600 font-bold text-xs gap-1">
                                                        <CheckCircle size={14} /> Ready
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-red-500 font-bold text-xs gap-1">
                                                        <AlertCircle size={14} /> Dues
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );

    const LogsView = () => {
        const [logs, setLogs] = useState([]);
        const [filter, setFilter] = useState({ role: '', action: '' });

        useEffect(() => {
            fetchLogs();
        }, [filter, activeTab]);

        const fetchLogs = async () => {
            try {
                // setLoading(true); // Optional
                const query = new URLSearchParams(filter).toString();
                const { data } = await api.get(`/admin/logs?${query}`);
                setLogs(data);
            } catch (error) {
                // toast.error('Failed to load logs'); // Avoid spamming if switching tabs quickly
            }
        };

        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-wrap gap-4 mb-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-bold text-gray-500 uppercase">Action Filter</label>
                        <input
                            placeholder="e.g. UPDATE, LOGIN"
                            className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm"
                            onChange={e => setFilter({ ...filter, action: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-bold text-gray-500 uppercase">Role Filter</label>
                        <select
                            className="w-full mt-1 p-2 border border-gray-200 rounded-lg text-sm bg-white"
                            onChange={e => setFilter({ ...filter, role: e.target.value })}
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="exam_head">Exam Head</option>
                            <option value="registrar">Registrar</option>
                            <option value="principal">Principal</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button onClick={fetchLogs} className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800">Refresh</button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            {logs.length > 0 ? logs.map(log => (
                                <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                        {log.user?.username || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 capitalize">
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-semibold">{log.role}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-bold">
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <div className="max-w-xs overflow-x-auto">
                                            <pre className="text-[10px] bg-gray-50 p-2 rounded border border-gray-100 font-mono text-gray-600">
                                                {JSON.stringify(log.details, null, 2)}
                                            </pre>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400 italic">No logs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // --- Shell ---

    return (
        <div className="min-h-screen bg-gray-50/50 flex font-sans text-gray-900">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 h-screen w-72 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 h-20 flex items-center border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3">
                        <GraduationCap className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">Edu<span className="text-indigo-600">Pay</span></span>
                    <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {[
                        { id: 'analytics', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'users', label: 'Students', icon: Users },
                        { id: 'search', label: 'Manage', icon: Search },
                        { id: 'fees', label: 'Fee Config', icon: CreditCard },
                        { id: 'promotion', label: 'Academics', icon: GraduationCap },
                        { id: 'logs', label: 'Audit Logs', icon: FileText },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon size={20} className={`mr-3 ${activeTab === item.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                            {item.label}
                            {activeTab === item.id && <ChevronRight size={16} className="ml-auto text-indigo-400" />}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold border border-white shadow-sm">
                            AD
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-section text-gray-900 font-bold">Administrator</p>
                            <p className="text-xs text-gray-500">System Access</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600">
                        <Menu size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight capitalize">{activeTab.replace('-', ' ')}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-500">System Live</span>
                    </div>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    {activeTab === 'analytics' && <SectionHeader title="Financial Overview" description="Real-time aggregation of academic fee collections." />}
                    {activeTab === 'users' && <SectionHeader title="Student Directory" description="Complete list of active students with department filters." />}
                    {activeTab === 'search' && <SectionHeader title="Student Management" description="Search, view, and update student financial records." />}
                    {activeTab === 'fees' && <SectionHeader title="Fee Configuration" description="Set up tuition structures for upcoming academic terms." />}
                    {activeTab === 'promotion' && <SectionHeader title="Academic Board" description="Manage student progression and graduation eligibility." />}
                    {activeTab === 'logs' && <SectionHeader title="System Audit Logs" description="Track all privileged actions within the system." />}

                    {activeTab === 'analytics' && <AnalyticsView />}
                    {activeTab === 'users' && <StudentsDirectoryView />}
                    {activeTab === 'search' && <SearchStudentView
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleSearch={handleSearch}
                        searchedStudent={searchedStudent}
                        concessionMode={concessionMode}
                        setConcessionMode={setConcessionMode}
                        concessionVal={concessionVal}
                        setConcessionVal={setConcessionVal}
                        handleUpdateFees={handleUpdateFees}
                    />}
                    {activeTab === 'fees' && <FeeConfigView />}
                    {activeTab === 'promotion' && <AcademicView />}
                    {activeTab === 'logs' && <LogsView />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
