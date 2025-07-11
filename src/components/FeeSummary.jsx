import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Users, DollarSign, Calendar, Filter, Download, RefreshCw, Eye, EyeOff, ChevronDown, ChevronUp, Bell, Award, CreditCard, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import axiosInstance from '../utils/api';

const FeeSummary = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [filters, setFilters] = useState({
    courseName: '',
    batchStartYear: '',
    batchEndYear: '',
    section: '',
    startDate: '',
    endDate: '',
    status: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedStatus, setExpandedStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusConfig = (status) => {
    const configs = {
      'fully_paid': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
      'partially_paid': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
      'overdue': { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
      'OverPayed': { icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
      'waived': { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
    };
    return configs[status] || configs['partially_paid'];
  };

  const toggleStatus = (status) => {
    setExpandedStatus((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const clearMessages = () => {
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/fees/dashboard');
      setDashboardData(response.data.data || response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard analytics. Please check your connection and try again.');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/fees/courses');
      setCourses(response.data.data || response.data);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Courses fetch error:', err);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axiosInstance.get('/fees/batches');
      setBatches(response.data.data || response.data);
    } catch (err) {
      setError('Failed to fetch batches');
      console.error('Batches fetch error:', err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchCourses();
    fetchBatches();
  }, []);

  useEffect(() => {
    if (error || success) {
      clearMessages();
    }
  }, [error, success]);

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await axiosInstance.get(`/fees/analytics?${queryParams.toString()}`);
      setFilteredData(response.data.data || response.data);
      setError('');
      setSuccess('Filters applied successfully!');
    } catch (err) {
      setError('Failed to fetch filtered analytics');
      console.error('Filter error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/fees/students/search?name=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data.data || response.data);
      setError('');
    } catch (err) {
      setError('Failed to search students');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get('/fees/export', {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fee-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setSuccess('Data exported successfully!');
    } catch (err) {
      setError('Failed to export data');
      console.error('Export error:', err);
    }
  };

  const resetFilters = () => {
    setFilters({
      courseName: '',
      batchStartYear: '',
      batchEndYear: '',
      section: '',
      startDate: '',
      endDate: '',
      status: '',
    });
    setFilteredData({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Fee Management System
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={fetchDashboard}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800">{success}</p>
            <button
              onClick={() => setSuccess('')}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'search', label: 'Student Search', icon: Search },
                { id: 'analytics', label: 'Analytics', icon: Filter },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-1 py-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Fees</p>
                    <p className="text-3xl font-bold text-slate-900">₹{(dashboardData.totalFees || 0).toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Collected</p>
                    <p className="text-3xl font-bold text-green-600">₹{(dashboardData.totalCollected || 0).toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Outstanding</p>
                    <p className="text-3xl font-bold text-red-600">₹{(dashboardData.totalOutstanding || 0).toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Fines</p>
                    <p className="text-3xl font-bold text-orange-600">₹{(dashboardData.totalFines || 0).toLocaleString()}</p>
                    <p className="text-sm text-slate-500">{dashboardData.numberOfFines || 0} fines</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Scholarships</p>
                    <p className="text-3xl font-bold text-purple-600">₹{(dashboardData.totalScholarships || 0).toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Discounts</p>
                    <p className="text-3xl font-bold text-indigo-600">₹{(dashboardData.totalDiscounts || 0).toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method Breakdown
              </h3>
              <div className="space-y-3">
                {dashboardData.paymentMethodBreakdown?.map((method, index) => (
                  <div key={method._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index % 4 === 0 ? 'bg-blue-500' : 
                        index % 4 === 1 ? 'bg-green-500' : 
                        index % 4 === 2 ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></div>
                      <span className="font-medium text-slate-700">{method._id}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">₹{method.total.toLocaleString()}</p>
                      <p className="text-sm text-slate-500">{method.count} transactions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Students by Payment Status
              </h3>
              {dashboardData.studentsByStatus?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.studentsByStatus.map((statusGroup) => {
                    const statusConfig = getStatusConfig(statusGroup._id);
                    const Icon = statusConfig.icon;
                    return (
                      <div key={statusGroup._id} className={`border rounded-lg ${statusConfig.border} ${statusConfig.bg}`}>
                        <button
                          onClick={() => toggleStatus(statusGroup._id)}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-opacity-80 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-5 h-5 ${statusConfig.color}`} />
                            <span className="font-semibold text-slate-900">
                              {statusGroup._id.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-sm text-slate-500">
                              ({statusGroup.students.length} students)
                            </span>
                          </div>
                          {expandedStatus[statusGroup._id] ? 
                            <ChevronUp className="w-4 h-4 text-slate-500" /> : 
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          }
                        </button>
                        {expandedStatus[statusGroup._id] && (
                          <div className="border-t border-slate-200 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {statusGroup.students.map((student) => (
                                <div key={student.studentId} className="bg-white p-3 rounded-lg border border-slate-200">
                                  <p className="font-medium text-slate-900">{student.name}</p>
                                  {/* <p className="text-sm text-slate-500">ID: {student.studentId}</p> */}
                                  <p className="text-sm text-slate-500">Course: {student.course || 'N/A'}</p>
                                  <p className="text-sm text-slate-500">Batch: {student.batch || 'N/A'}</p>
                                  <p className="text-sm text-slate-500">Semester: {student.semester || 'N/A'}</p>
                                  <p className="text-sm text-slate-500">Section: {student.section || 'N/A'}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No students found for payment statuses.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search Students by Name
              </h2>
              <form onSubmit={handleSearchSubmit} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {searchResults.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Search Results ({searchResults.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((student) => {
                    const statusConfig = getStatusConfig(student.status);
                    const Icon = statusConfig.icon;
                    return (
                      <div key={student.studentId} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">{student.name}</h4>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${statusConfig.bg}`}>
                            <Icon className={`w-3 h-3 ${statusConfig.color}`} />
                            <span className={`text-xs font-medium ${statusConfig.color}`}>
                              {student.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500">ID: {student.studentId}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {searchQuery && searchResults.length === 0 && !loading && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 text-center">
                <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500">No students found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtered Analytics
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200"
                >
                  {showFilters ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
                </button>
              </div>

              {showFilters && (
                <form onSubmit={handleFilterSubmit} className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <select
                      value={filters.courseName}
                      onChange={(e) => setFilters({ ...filters, courseName: e.target.value })}
                      className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course.name}>{course.name}</option>
                      ))}
                    </select>

                    <select
                      value={filters.batchStartYear}
                      onChange={(e) => setFilters({ ...filters, batchStartYear: e.target.value })}
                      className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="">Select Batch Start Year</option>
                      {[...new Set(batches.map(batch => batch.startYear))].map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>

                    <select
                      value={filters.batchEndYear}
                      onChange={(e) => setFilters({ ...filters, batchEndYear: e.target.value })}
                      className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="">Select Batch End Year</option>
                      {[...new Set(batches.map(batch => batch.endYear))].map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Section ID"
                      value={filters.section}
                      onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                      className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />

                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                      className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />

                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                      className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />

                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="">Select Status</option>
                      <option value="OverPayed">Over Paid</option>
                      <option value="partially_paid">Partially Paid</option>
                      <option value="fully_paid">Fully Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="waived">Waived</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-6 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-all duration-200 shadow-md"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Filter className="w-4 h-4" />
                          <span>Apply Filters</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {filteredData.totalFees && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Filtered Analytics Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-600 mb-1">Total Fees</h4>
                      <p className="text-2xl font-bold text-blue-600">₹{(filteredData.totalFees || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h4 className="text-sm font-medium text-green-600 mb-1">Total Collected</h4>
                      <p className="text-2xl font-bold text-green-600">₹{(filteredData.totalCollected || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                      <h4 className="text-sm font-medium text-red-600 mb-1">Total Outstanding</h4>
                      <p className="text-2xl font-bold text-red-600">₹{(filteredData.totalOutstanding || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  {filteredData.studentsByStatus?.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">Filtered Students by Payment Status</h4>
                      <div className="space-y-3">
                        {filteredData.studentsByStatus.map((statusGroup) => {
                          const statusConfig = getStatusConfig(statusGroup._id);
                          const Icon = statusConfig.icon;
                          return (
                            <div key={statusGroup._id} className={`border rounded-lg ${statusConfig.border} ${statusConfig.bg}`}>
                              <button
                                onClick={() => toggleStatus(`filtered_${statusGroup._id}`)}
                                className="w-full p-4 text-left flex items-center justify-between hover:bg-opacity-80 transition-colors duration-200"
                              >
                                <div className="flex items-center space-x-3">
                                  <Icon className={`w-5 h-5 ${statusConfig.color}`} />
                                  <span className="font-semibold text-slate-900">
                                    {statusGroup._id.replace('_', ' ').toUpperCase()}
                                  </span>
                                  <span className="text-sm text-slate-500">
                                    ({statusGroup.students.length} students)
                                  </span>
                                </div>
                                {expandedStatus[`filtered_${statusGroup._id}`] ? 
                                  <ChevronUp className="w-4 h-4 text-slate-500" /> : 
                                  <ChevronDown className="w-4 h-4 text-slate-500" />
                                }
                              </button>
                              {expandedStatus[`filtered_${statusGroup._id}`] && (
                                <div className="border-t border-slate-200 p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {statusGroup.students.map((student) => (
                                      <div key={student.studentId} className="bg-white p-3 rounded-lg border border-slate-200">
                                        <p className="font-medium text-slate-900">{student.name}</p>
                                        <p className="text-sm text-slate-500">ID: {student.studentId}</p>
                                        <p className="text-sm text-slate-500">Course: {student.course || 'N/A'}</p>
                                        <p className="text-sm text-slate-500">Batch: {student.batch || 'N/A'}</p>
                                        <p className="text-sm text-slate-500">Semester: {student.semester || 'N/A'}</p>
                                        <p className="text-sm text-slate-500">Section: {student.section || 'N/A'}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeSummary;