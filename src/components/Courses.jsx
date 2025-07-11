import React, { useEffect, useState } from 'react';
import { Plus, BookOpen, Users, Calendar, GraduationCap, Sparkles, Trash2, Edit3 } from 'lucide-react';
import axiosInstance from '../utils/api';

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [batches, setBatches] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');
  const [isLoading, setIsLoading] = useState(true);

  const [newCourse, setNewCourse] = useState({ name: '', duration: '' });
  const [newSection, setNewSection] = useState({ name: '', courseId: '' });
  const [newBatch, setNewBatch] = useState({ startYear: '', endYear: '', courseId: '' });

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [courseRes, sectionRes, batchRes] = await Promise.all([
        axiosInstance.get('/course'),
        axiosInstance.get('/section'),
        axiosInstance.get('/batch'),
      ]);
      setCourses(courseRes.data);
      setSections(sectionRes.data);
      setBatches(batchRes.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddCourse = async () => {
    if (!newCourse.name.trim() || !newCourse.duration) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await axiosInstance.post('/course/add', newCourse);
      setNewCourse({ name: '', duration: '' });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding course');
    }
  };

  const handleAddSection = async () => {
    if (!newSection.name.trim() || !newSection.courseId) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await axiosInstance.post('/section/add', newSection);
      setNewSection({ name: '', courseId: '' });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding section');
    }
  };

  const handleAddBatch = async () => {
    if (!newBatch.startYear || !newBatch.endYear || !newBatch.courseId) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await axiosInstance.post('/batch/add', newBatch);
      setNewBatch({ startYear: '', endYear: '', courseId: '' });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding batch');
    }
  };

  const tabs = [
    { id: 'courses', label: 'Courses', icon: BookOpen, count: courses.length },
    { id: 'sections', label: 'Sections', icon: Users, count: sections.length },
    { id: 'batches', label: 'Batches', icon: Calendar, count: batches.length }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading your data...</p>
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
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Course Manager
                </h1>
                <p className="text-sm text-gray-600">Manage your academic programs</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Modern Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 bg-white/60 p-1 rounded-2xl backdrop-blur-sm border border-white/40 w-fit mx-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 transform ${
                    activeTab === tab.id
                      ? 'bg-white shadow-lg shadow-indigo-100 text-indigo-600 scale-105'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-white/50 hover:scale-102'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-indigo-100 text-indigo-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Course Form */}
        {activeTab === 'courses' && (
          <div className="mb-8 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 transform transition-all duration-500 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Add New Course</h2>
            </div>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                <input
                  type="text"
                  placeholder="Enter course name"
                  value={newCourse.name}
                  onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (years)</label>
                <input
                  type="number"
                  placeholder="Duration"
                  value={newCourse.duration}
                  onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <button
                onClick={handleAddCourse}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Course
              </button>
            </div>
          </div>
        )}

        {/* Add Section Form */}
        {activeTab === 'sections' && (
          <div className="mb-8 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 transform transition-all duration-500 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Add New Section</h2>
            </div>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Name</label>
                <input
                  type="text"
                  placeholder="Enter section name"
                  value={newSection.name}
                  onChange={e => setNewSection({ ...newSection, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select
                  value={newSection.courseId}
                  onChange={e => setNewSection({ ...newSection, courseId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddSection}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Section
              </button>
            </div>
          </div>
        )}

        {/* Add Batch Form */}
        {activeTab === 'batches' && (
          <div className="mb-8 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 transform transition-all duration-500 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Add New Batch</h2>
            </div>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Year</label>
                <input
                  type="number"
                  placeholder="Start Year"
                  value={newBatch.startYear}
                  onChange={e => setNewBatch({ ...newBatch, startYear: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">End Year</label>
                <input
                  type="number"
                  placeholder="End Year"
                  value={newBatch.endYear}
                  onChange={e => setNewBatch({ ...newBatch, endYear: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select
                  value={newBatch.courseId}
                  onChange={e => setNewBatch({ ...newBatch, courseId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddBatch}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Batch
              </button>
            </div>
          </div>
        )}

        {/* Data Display */}
        <div className="grid gap-6">
          {/* Courses Display */}
          {activeTab === 'courses' && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Courses ({courses.length})
                </h3>
              </div>
              <div className="p-6">
                {courses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No courses added yet</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {courses.map((course, index) => (
                      <div
                        key={course._id}
                        className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:scale-102"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {course.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{course.name}</h4>
                            <p className="text-sm text-gray-600">{course.duration} years duration</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sections Display */}
          {activeTab === 'sections' && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-teal-50 border-b border-green-100">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Sections ({sections.length})
                </h3>
              </div>
              <div className="p-6">
                {sections.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No sections added yet</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {sections.map((section, index) => (
                      <div
                        key={section._id}
                        className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:scale-102"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {section.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{section.name}</h4>
                            <p className="text-sm text-gray-600">{section.course?.name || 'No course assigned'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Batches Display */}
          {activeTab === 'batches' && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  Batches ({batches.length})
                </h3>
              </div>
              <div className="p-6">
                {batches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No batches added yet</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {batches.map((batch, index) => (
                      <div
                        key={batch._id}
                        className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:scale-102"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {String(batch.startYear).slice(-2)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{batch.startYear}–{batch.endYear}</h4>
                            <p className="text-sm text-gray-600">{batch.course?.name || 'No course assigned'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseManager;