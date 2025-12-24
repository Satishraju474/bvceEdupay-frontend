import { useState, useEffect } from 'react';
import api from '../api/axios';
import { PieChart, Users, BookOpen, Layers } from 'lucide-react';

const PrincipalDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error('Failed to load stats');
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="p-8">Loading Analytics...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Principal's Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Strength</p>
                            <h3 className="text-3xl font-bold mt-2">{stats.totalStudents}</h3>
                        </div>
                        <Users className="h-8 w-8 text-blue-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Active Students</p>
                            <h3 className="text-3xl font-bold mt-2">{stats.activeStudents}</h3>
                        </div>
                        <BookOpen className="h-8 w-8 text-green-200" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Department Distribution */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-bold mb-6 flex items-center">
                        <Layers className="h-5 w-5 mr-2 text-indigo-500" />
                        Department Distribution
                    </h2>
                    <div className="space-y-4">
                        {stats.byDepartment?.map((dept) => (
                            <div key={dept._id} className="flex items-center">
                                <span className="w-16 font-medium text-gray-600">{dept._id}</span>
                                <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full"
                                        style={{ width: `${(dept.count / stats.totalStudents) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="font-bold text-gray-800">{dept.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quota & Entry */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-bold mb-6 flex items-center">
                        <PieChart className="h-5 w-5 mr-2 text-purple-500" />
                        Admission Analytics
                    </h2>

                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">By Quota</h3>
                        <div className="flex space-x-4">
                            {stats.byQuota?.map((item) => (
                                <div key={item._id} className="bg-purple-50 px-4 py-2 rounded-lg text-center flex-1">
                                    <span className="block text-purple-800 font-bold capitalize">{item._id}</span>
                                    <span className="text-gray-600 text-sm">{item.count} Students</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">By Entry Type</h3>
                        <div className="flex space-x-4">
                            {stats.byEntryType?.map((item) => (
                                <div key={item._id} className="bg-blue-50 px-4 py-2 rounded-lg text-center flex-1">
                                    <span className="block text-blue-800 font-bold capitalize">{item._id}</span>
                                    <span className="text-gray-600 text-sm">{item.count} Students</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrincipalDashboard;
