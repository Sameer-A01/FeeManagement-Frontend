import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Plus, User, Trash2, Edit3, Eye, Download } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    course: '',
    section: '',
    batch: '',
    academicStatus: '',
    minGpa: '',
    maxGpa: '',
    semester: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'PreferNotToSay',
    address: { street: '', city: '', state: '', postalCode: '', country: '' },
    profilePic: null,
    course: '',
    section: '',
    semester: '',
    batch: '',
    academicStatus: 'Active',
    gpa: 0,
    emergencyContacts: [{ name: '', relationship: '', phone: '', email: '' }]
  });

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, [pagination.page, pagination.limit, searchTerm, filters.course, filters.section, filters.batch, filters.academicStatus, filters.minGpa, filters.maxGpa, filters.semester]);

  useEffect(() => {
    if (formData.course) {
      fetchSections(formData.course);
      fetchBatches(formData.course);
    } else {
      setSections([]);
      setBatches([]);
    }
  }, [formData.course]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pagination.page, limit: pagination.limit, search: searchTerm, ...filters });
      Object.keys(filters).forEach(key => { if (!filters[key]) params.delete(key); });
      const response = await axiosInstance.get(`/students?${params.toString()}`);
      if (response.data.success) {
        setStudents(response.data.data || []);
        setPagination(prev => ({ ...prev, total: response.data.total || 0, pages: response.data.pages || 0, page: response.data.page || 1 }));
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      alert('Error fetching students: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/course');
      setCourses(response.data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      alert('Error fetching courses: ' + (err.response?.data?.error || err.message));
    }
  };

  const fetchSections = async (courseId) => {
    try {
      const response = await axiosInstance.get('/section');
      const filteredSections = response.data.filter(section => section.course?._id === courseId || section.course === courseId) || [];
      setSections(filteredSections);
    } catch (err) {
      console.error('Error fetching sections:', err);
      alert('Error fetching sections: ' + (err.response?.data?.error || err.message));
    }
  };

  const fetchBatches = async (courseId) => {
    try {
      const response = await axiosInstance.get('/batch');
      const filteredBatches = response.data.filter(batch => batch.course?._id === courseId || batch.course === courseId) || [];
      setBatches(filteredBatches);
    } catch (err) {
      console.error('Error fetching batches:', err);
      alert('Error fetching batches: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({ ...prev, address: { ...prev.address, [addressField]: value } }));
    } else if (name.includes('emergencyContacts.')) {
      const [, index, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        emergencyContacts: prev.emergencyContacts.map((contact, i) => i === parseInt(index) ? { ...contact, [field]: value } : contact)
      }));
    } else if (name === 'course') {
      setFormData(prev => ({ ...prev, [name]: value, section: '', batch: '', semester: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const studentData = { ...formData, profilePic: null };
      if (editingStudent) {
        const response = await axiosInstance.put(`/students/${editingStudent._id}`, studentData);
        if (response.data.success) {
          alert('Student updated successfully!');
          setShowModal(false);
          fetchStudents();
          resetForm();
        }
      } else {
        const response = await axiosInstance.post('/students/add', studentData);
        if (response.data.success) {
          alert('Student added successfully!');
          setShowModal(false);
          fetchStudents();
          resetForm();
        }
      }
    } catch (err) {
      console.error('Error saving student:', err);
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      dob: student.dob ? format(new Date(student.dob), 'yyyy-MM-dd') : '',
      gender: student.gender || 'PreferNotToSay',
      address: student.address || { street: '', city: '', state: '', postalCode: '', country: '' },
      profilePic: null,
      course: student.course?._id || '',
      section: student.section?._id || '',
      semester: student.semester || '',
      batch: student.batch?._id || '',
      academicStatus: student.academicStatus || 'Active',
      gpa: student.gpa || 0,
      emergencyContacts: student.emergencyContacts?.length > 0 ? student.emergencyContacts : [{ name: '', relationship: '', phone: '', email: '' }]
    });
    setShowModal(true);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await axiosInstance.delete(`/students/${id}`);
        if (response.data.success) {
          alert('Student deleted successfully!');
          fetchStudents();
        }
      } catch (err) {
        console.error('Error deleting student:', err);
        alert('Error deleting student: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get('/students/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting data:', err);
      alert('Error exporting data: ' + (err.response?.data?.error || err.message));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      dob: '',
      gender: 'PreferNotToSay',
      address: { street: '', city: '', state: '', postalCode: '', country: '' },
      profilePic: null,
      course: '',
      section: '',
      semester: '',
      batch: '',
      academicStatus: 'Active',
      gpa: 0,
      emergencyContacts: [{ name: '', relationship: '', phone: '', email: '' }]
    });
    setEditingStudent(null);
  };

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', relationship: '', phone: '', email: '' }]
    }));
  };

  const removeEmergencyContact = (index) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading your students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Student Management
                </h1>
                <p className="text-sm text-gray-600">Manage your student records</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Student
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 transform transition-all duration-500 hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
            <select
              name="course"
              value={filters.course}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name || 'Unknown Course'}
                </option>
              ))}
            </select>
            <select
              name="academicStatus"
              value={filters.academicStatus}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="OnLeave">On Leave</option>
              <option value="Graduated">Graduated</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
            <input
              type="number"
              name="semester"
              placeholder="Semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              min="1"
              max="8"
            />
            <div className="flex gap-2">
              <input
                type="number"
                name="minGpa"
                placeholder="Min GPA"
                value={filters.minGpa}
                onChange={handleFilterChange}
                className="w-24 px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                min="0"
                max="10"
                step="0.1"
              />
              <input
                type="number"
                name="maxGpa"
                placeholder="Max GPA"
                value={filters.maxGpa}
                onChange={handleFilterChange}
                className="w-24 px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                min="0"
                max="10"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Students ({students.length})
            </h3>
          </div>
          <div className="p-6">
            {students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No students found. Add some students to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-indigo-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Academic Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((student, index) => (
                      <tr
                        key={student._id}
                        className="bg-white/50 hover:shadow-md transition-all duration-300 transform hover:scale-101"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {student.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">{student.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-600">
                                {student.gender || 'N/A'} • {student.dob ? format(new Date(student.dob), 'MM/dd/yyyy') : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-800">{student.email || 'N/A'}</div>
                          <div className="text-sm text-gray-600">{student.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-800">{student.course?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-600">
                            Section: {student.section?.name || 'N/A'} • Semester: {student.semester || 'N/A'} • Batch: {student.batch ? `${student.batch.startYear || 'N/A'}-${student.batch.endYear || 'N/A'}` : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">GPA: {student.gpa != null ? student.gpa.toFixed(2) : '0'}/10.0</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.academicStatus === 'Active' ? 'bg-green-100 text-green-800' :
                            student.academicStatus === 'OnLeave' ? 'bg-yellow-100 text-yellow-800' :
                            student.academicStatus === 'Graduated' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.academicStatus || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                          <button
                            onClick={() => handleViewDetails(student)}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 hover:scale-105 transition-all duration-300"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 hover:scale-105 transition-all duration-300"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
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

          {/* Pagination */}
          <div className="px-6 py-4 bg-white/50 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
              <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="font-medium">{pagination.total}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/50 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h3>
                <button
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="PreferNotToSay">Prefer Not To Say</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Address */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                      <input
                        type="text"
                        name="address.postalCode"
                        value={formData.address.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
                {/* Academic Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Academic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                          <option key={course._id} value={course._id}>
                            {course.name || 'Unknown Course'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
                      <select
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                        required
                        disabled={!formData.course}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      >
                        <option value="">Select Section</option>
                        {sections.map((section) => (
                          <option key={section._id} value={section._id}>
                            {section.name || 'Unknown Section'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
                      <input
                        type="number"
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="8"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Batch *</label>
                      <select
                        name="batch"
                        value={formData.batch}
                        onChange={handleInputChange}
                        required
                        disabled={!formData.course}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      >
                        <option value="">Select Batch</option>
                        {batches.map((batch) => (
                          <option key={batch._id} value={batch._id}>
                            {(batch.startYear && batch.endYear) ? `${batch.startYear}-${batch.endYear}` : 'Unknown Batch'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Academic Status</label>
                      <select
                        name="academicStatus"
                        value={formData.academicStatus}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="Active">Active</option>
                        <option value="OnLeave">On Leave</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Withdrawn">Withdrawn</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">GPA (0-10)</label>
                      <input
                        type="number"
                        name="gpa"
                        value={formData.gpa}
                        onChange={handleInputChange}
                        min="0"
                        max="10"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
                {/* Emergency Contacts */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-semibold text-gray-800">Emergency Contacts</h4>
                    <button
                      type="button"
                      onClick={addEmergencyContact}
                      className="px-3 py-1 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl shadow hover:shadow-md transform hover:scale-105 transition-all duration-300 text-sm"
                    >
                      <Plus className="w-4 h-4 inline mr-1" /> Add Contact
                    </button>
                  </div>
                  {formData.emergencyContacts.map((contact, index) => (
                    <div key={index} className="border border-gray-100 p-3 rounded-xl mb-3 bg-white/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Contact {index + 1}</span>
                        {formData.emergencyContacts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEmergencyContact(index)}
                            className="text-red-500 text-sm hover:text-red-700 transition-all duration-300"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <input
                            type="text"
                            name={`emergencyContacts.${index}.name`}
                            value={contact.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                          <input
                            type="text"
                            name={`emergencyContacts.${index}.relationship`}
                            value={contact.relationship}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <input
                            type="tel"
                            name={`emergencyContacts.${index}.phone`}
                            value={contact.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            name={`emergencyContacts.${index}.email`}
                            value={contact.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 shadow hover:shadow-md transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : (editingStudent ? 'Update Student' : 'Add Student')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showDetailsModal && selectedStudent && (
          <div className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/50 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  Student Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">
                        {selectedStudent.dob ? format(new Date(selectedStudent.dob), 'MM/dd/yyyy') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.gender || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                {/* Address */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.address?.street || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.address?.city || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.address?.state || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.address?.postalCode || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.address?.country || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                {/* Academic Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Academic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.course?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.section?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.semester || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">
                        {selectedStudent.batch ? `${selectedStudent.batch.startYear || 'N/A'}-${selectedStudent.batch.endYear || 'N/A'}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Academic Status</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.academicStatus || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                      <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{selectedStudent.gpa != null ? selectedStudent.gpa.toFixed(2) : '0'}/10.0</p>
                    </div>
                  </div>
                </div>
                {/* Emergency Contacts */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Emergency Contacts</h4>
                  {selectedStudent.emergencyContacts?.length > 0 ? (
                    selectedStudent.emergencyContacts.map((contact, index) => (
                      <div key={index} className="border border-gray-100 p-3 rounded-xl mb-3 bg-white/50">
                        <div className="text-sm font-medium text-gray-700 mb-2">Contact {index + 1}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{contact.name || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                            <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{contact.relationship || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{contact.phone || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-xl border border-gray-100">{contact.email || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 bg-white/50 p-3 rounded-xl border border-gray-100">No emergency contacts available.</p>
                  )}
                </div>
                {/* Modal Actions */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 shadow hover:shadow-md transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;