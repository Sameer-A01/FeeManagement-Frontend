import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Eye, Filter, X } from 'lucide-react';

const FeePlanManagement = () => {
  const [feePlans, setFeePlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [filters, setFilters] = useState({
    course: '',
    batch: '',
    section: '',
    duration: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  const fetchFeePlans = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await axiosInstance.get(`/fee-plans?${queryParams.toString()}`);
      if (response.data.success) {
        setFeePlans(response.data.plans);
      }
    } catch (err) {
      alert('Error fetching fee plans: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeePlans();
  }, [filters]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fee plan?')) {
      try {
        await axiosInstance.delete(`/fee-plans/${id}`);
        alert('Fee plan deleted successfully');
        fetchFeePlans();
      } catch (err) {
        alert('Error deleting fee plan: ' + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
                <Filter className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Fee Plan Management
                </h1>
                <p className="text-sm text-gray-600">Manage your fee plans and schedules</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Fee Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        {showFilters && (
          <div className="mb-8 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 transform transition-all duration-500 hover:shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Course"
                value={filters.course}
                onChange={(e) => setFilters({...filters, course: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Batch (e.g., 2023-2024)"
                value={filters.batch}
                onChange={(e) => setFilters({...filters, batch: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              <input
                type="text"
                placeholder="Section"
                value={filters.section}
                onChange={(e) => setFilters({...filters, section: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              <select
                value={filters.duration}
                onChange={(e) => setFilters({...filters, duration: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">All Durations</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="semesterly">Semesterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 animate-pulse">Loading fee plans...</p>
          </div>
        )}

        {/* Fee Plans Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-600" />
              Fee Plans ({feePlans.length})
            </h3>
          </div>
          <div className="p-6">
            {feePlans.length === 0 && !loading ? (
              <div className="text-center py-8 text-gray-500">
                <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No fee plans found. Create a new fee plan to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-indigo-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">S.No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Batch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total Fee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {feePlans.map((plan, index) => (
                      <tr
                        key={plan._id}
                        className="bg-white/50 hover:shadow-md transition-all duration-300 transform hover:scale-101"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{plan.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{plan.course?.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {plan.batch ? `${plan.batch.startYear}-${plan.batch.endYear}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 capitalize">{plan.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">₹{plan.totalFee.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {new Date(plan.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            plan.status === 'active' ? 'bg-green-100 text-green-800' :
                            plan.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {plan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedPlan(plan);
                              setShowViewModal(true);
                            }}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 hover:scale-105 transition-all duration-300"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPlan(plan);
                              setShowEditModal(true);
                            }}
                            className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 hover:scale-105 transition-all duration-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(plan._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:scale-105 transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {(showCreateModal || showEditModal) && (
          <FeePlanModal
            isEdit={showEditModal}
            plan={selectedPlan}
            onClose={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              setSelectedPlan(null);
            }}
            onSuccess={fetchFeePlans}
          />
        )}

        {showViewModal && selectedPlan && (
          <ViewFeePlanModal
            plan={selectedPlan}
            onClose={() => {
              setShowViewModal(false);
              setSelectedPlan(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

const FeePlanModal = ({ isEdit, plan, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    sections: [],
    batch: '',
    duration: 'monthly',
    dueDate: '',
    feeComponents: [{ feeType: 'Tuition', amount: 0, tax: 0 }],
    totalFee: 0,
    lateFees: [],
    scholarships: [],
    additionalNotes: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingSections, setLoadingSections] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [coursesRes, batchesRes] = await Promise.all([
          axiosInstance.get('/course'),
          axiosInstance.get('/batch')
        ]);
        
        setCourses(coursesRes.data || []);
        setBatches(batchesRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        alert('Error loading form data');
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, []);

  const fetchSections = async () => {
    if (formData.course) {
      setLoadingSections(true);
      try {
        const response = await axiosInstance.get(`/section/course/${formData.course}`);
        setSections(response.data?.sections || []);
      } catch (err) {
        console.error('Error fetching sections:', err);
        alert('Error loading sections');
      } finally {
        setLoadingSections(false);
      }
    } else {
      setSections([]);
      setFormData(prev => ({ ...prev, sections: [] }));
    }
  };

  useEffect(() => {
    fetchSections();
  }, [formData.course]);

  useEffect(() => {
    if (isEdit && plan) {
      setFormData({
        name: plan.name || '',
        course: plan.course?._id || '',
        sections: plan.sections?.map(s => s._id) || [],
        batch: plan.batch?._id || '',
        duration: plan.duration || 'monthly',
        dueDate: plan.dueDate ? new Date(plan.dueDate).toISOString().split('T')[0] : '',
        feeComponents: plan.feeComponents || [{ feeType: 'Tuition', amount: 0, tax: 0 }],
        totalFee: plan.totalFee || 0,
        lateFees: plan.lateFees || [],
        scholarships: plan.scholarships || [],
        additionalNotes: plan.additionalNotes || '',
        status: plan.status || 'active'
      });
    }
  }, [isEdit, plan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEdit) {
        await axiosInstance.put(`/fee-plans/${plan._id}`, formData);
        alert('Fee plan updated successfully');
      } else {
        await axiosInstance.post('/fee-plans/add', formData);
        alert('Fee plan created successfully');
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const addFeeComponent = () => {
    setFormData({
      ...formData,
      feeComponents: [...formData.feeComponents, { feeType: 'Tuition', amount: 0, tax: 0 }]
    });
  };

  const removeFeeComponent = (index) => {
    const newComponents = formData.feeComponents.filter((_, i) => i !== index);
    setFormData({ ...formData, feeComponents: newComponents });
  };

  const updateFeeComponent = (index, field, value) => {
    const newComponents = [...formData.feeComponents];
    newComponents[index] = { ...newComponents[index], [field]: value };
    setFormData({ ...formData, feeComponents: newComponents });
  };

  const addLateFee = () => {
    setFormData({
      ...formData,
      lateFees: [...formData.lateFees, { fromDate: '', toDate: '', fineAmount: 0 }]
    });
  };

  const removeLateFee = (index) => {
    const newLateFees = formData.lateFees.filter((_, i) => i !== index);
    setFormData({ ...formData, lateFees: newLateFees });
  };

  const updateLateFee = (index, field, value) => {
    const newLateFees = [...formData.lateFees];
    newLateFees[index] = { ...newLateFees[index], [field]: value };
    setFormData({ ...formData, lateFees: newLateFees });
  };

  return (
    <div className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/50 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Filter className="w-5 h-5 text-indigo-600" />
            </div>
            {isEdit ? 'Edit Fee Plan' : 'Create Fee Plan'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {loadingData ? (
            <div className="text-center py-4">
              <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 animate-pulse">Loading form data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                  <select
                    required
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value, sections: []})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch *</label>
                  <select
                    required
                    value={formData.batch}
                    onChange={(e) => setFormData({...formData, batch: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select Batch</option>
                    {batches.map(batch => (
                      <option key={batch._id} value={batch._id}>
                        {batch.course?.name} - {batch.startYear} to {batch.endYear}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sections</label>
                  {loadingSections ? (
                    <p className="text-gray-500">Loading sections...</p>
                  ) : (
                    <>
                      {formData.course ? (
                        <select
                          multiple
                          value={formData.sections}
                          onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                            setFormData({...formData, sections: selectedOptions});
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                          size="3"
                          disabled={!formData.course || sections.length === 0}
                        >
                          {Array.isArray(sections) && sections.length > 0 ? (
                            sections.map(section => (
                              <option key={section._id} value={section._id}>
                                {section.name}
                              </option>
                            ))
                          ) : (
                            <option disabled>No sections available</option>
                          )}
                        </select>
                      ) : (
                        <p className="text-gray-500">Please select a course first</p>
                      )}
                      <small className="text-gray-500">Hold Ctrl/Cmd to select multiple sections</small>
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                  <select
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semesterly">Semesterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-semibold text-gray-800">Fee Components</h3>
                  <button
                    type="button"
                    onClick={addFeeComponent}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow hover:shadow-md transform hover:scale-105 transition-all duration-300 text-sm"
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> Add Component
                  </button>
                </div>
                {formData.feeComponents.map((component, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 border border-gray-100 rounded-xl bg-white/50">
                    <select
                      value={component.feeType}
                      onChange={(e) => updateFeeComponent(index, 'feeType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="Tuition">Tuition</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Transport">Transport</option>
                      <option value="Library">Library</option>
                      <option value="Exam">Exam</option>
                      <option value="Lab">Lab</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={component.amount}
                      onChange={(e) => updateFeeComponent(index, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                    <input
                      type="number"
                      placeholder="Tax"
                      value={component.tax}
                      onChange={(e) => updateFeeComponent(index, 'tax', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeeComponent(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 hover:scale-105 transition-all duration-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Fee (₹)</label>
                <input
                  type="number"
                  value={formData.totalFee}
                  onChange={(e) => setFormData({...formData, totalFee: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Auto-calculated if left empty"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-semibold text-gray-800">Late Fees</h3>
                  <button
                    type="button"
                    onClick={addLateFee}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow hover:shadow-md transform hover:scale-105 transition-all duration-300 text-sm"
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> Add Late Fee
                  </button>
                </div>
                {formData.lateFees.map((lateFee, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 border border-gray-100 rounded-xl bg-white/50">
                    <input
                      type="date"
                      placeholder="From Date"
                      value={lateFee.fromDate}
                      onChange={(e) => updateLateFee(index, 'fromDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                    <input
                      type="date"
                      placeholder="To Date"
                      value={lateFee.toDate}
                      onChange={(e) => updateLateFee(index, 'toDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                    <input
                      type="number"
                      placeholder="Fine Amount"
                      value={lateFee.fineAmount}
                      onChange={(e) => updateLateFee(index, 'fineAmount', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeLateFee(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 hover:scale-105 transition-all duration-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 shadow hover:shadow-md transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    
    </div>
  );
};

const ViewFeePlanModal = ({ plan, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/50 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Filter className="w-5 h-5 text-indigo-600" />
            </div>
            Fee Plan Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
              <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{plan.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{plan.course?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
              <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">
                {plan.batch ? `${plan.batch.startYear}-${plan.batch.endYear}` : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100 capitalize">{plan.duration}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">
                {new Date(plan.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                plan.status === 'active' ? 'bg-green-100 text-green-800' :
                plan.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {plan.status}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-3">Fee Components</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-100">
                <thead className="bg-indigo-50/50">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-gray-600 border-b border-gray-100">Fee Type</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-600 border-b border-gray-100">Amount</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-600 border-b border-gray-100">Tax</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-600 border-b border-gray-100">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {plan.feeComponents?.map((component, index) => (
                    <tr key={index} className="bg-white/50">
                      <td className="p-3 text-sm text-gray-800">{component.feeType}</td>
                      <td className="p-3 text-sm text-gray-800">₹{component.amount.toLocaleString()}</td>
                      <td className="p-3 text-sm text-gray-800">₹{component.tax.toLocaleString()}</td>
                      <td className="p-3 text-sm text-gray-800">₹{(component.amount + component.tax).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <strong className="text-lg text-gray-800">Total Fee: ₹{plan.totalFee.toLocaleString()}</strong>
            </div>
          </div>

          {plan.lateFees?.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-3">Late Fees</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-100">
                  <thead className="bg-indigo-50/50">
                    <tr>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 border-b border-gray-100">From Date</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 border-b border-gray-100">To Date</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 border-b border-gray-100">Fine Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {plan.lateFees.map((lateFee, index) => (
                      <tr key={index} className="bg-white/50">
                        <td className="p-3 text-sm text-gray-800">{new Date(lateFee.fromDate).toLocaleDateString()}</td>
                        <td className="p-3 text-sm text-gray-800">{new Date(lateFee.toDate).toLocaleDateString()}</td>
                        <td className="p-3 text-sm text-gray-800">₹{lateFee.fineAmount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {plan.scholarships?.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-3">Scholarships</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-100">
                  <thead className="bg-indigo-50/50">
                    <tr>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 border-b border-gray-100">Student</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 border-b border-gray-100">Type</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 border-b border-gray-100">Amount</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-600 border-b border-gray-100">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {plan.scholarships.map((scholarship, index) => (
                      <tr key={index} className="bg-white/50">
                        <td className="p-3 text-sm text-gray-800">{scholarship.student?.name || 'N/A'}</td>
                        <td className="p-3 text-sm text-gray-800">{scholarship.type}</td>
                        <td className="p-3 text-sm text-gray-800">₹{scholarship.amount.toLocaleString()}</td>
                        <td className="p-3 text-sm text-gray-800">
                          {new Date(scholarship.fromDate).toLocaleDateString()} - {new Date(scholarship.toDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {plan.additionalNotes && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{plan.additionalNotes}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
              <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">
                {new Date(plan.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
              <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">
                {new Date(plan.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 shadow hover:shadow-md transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default FeePlanManagement;