import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/api';
import { toast } from 'react-toastify';
import FeePaymentForm from './FeePaymentForm';
import TransactionForm from './TransactionForm';
import FeePaymentsList from './FeePaymentsList';
import ApplyAdjustmentForm from './ApplyAdjustmentForm';
import ApplyLateFeeForm from './ApplyLateFeeForm';
import UpdateFeePaymentForm from './UpdateFeePaymentForm';

const Feepayment = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [feePlans, setFeePlans] = useState([]);
    const [feePayments, setFeePayments] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(10);

    // State for filters
    const [filters, setFilters] = useState({
        course: '',
        batch: '',
        section: ''
    });

    // State for dropdown options
    const [dropdownOptions, setDropdownOptions] = useState({
        courses: [],
        batches: [],
        sections: []
    });

    // State for new fee payment
    const [newFeePayment, setNewFeePayment] = useState({
        feePlan: '',
        transaction: {
            transactionId: '',
            amount: '',
            paymentMethod: 'Cash',
            status: 'completed',
            receiptUrl: '',
            notes: ''
        },
        customScholarship: {
            type: '',
            amount: ''
        },
    });

    // State for adding transaction
    const [newTransaction, setNewTransaction] = useState({
        feePaymentId: '',
        transactionId: '',
        amount: '',
        paymentMethod: 'Cash',
        status: 'completed',
        receiptUrl: '',
        notes: ''
    });

    // State for applying scholarship/discount
    const [adjustment, setAdjustment] = useState({
        feePaymentId: '',
        type: 'scholarship',
        amount: '',
        description: '',
        recordedBy: '',
        customScholarshipType: '',
    });

    // State for updating fee payment
    const [updateFeePayment, setUpdateFeePayment] = useState({
        feePaymentId: '',
        status: '',
        dueDate: '',
    });

    // State for late fee application
    const [lateFeeData, setLateFeeData] = useState({
        feePaymentId: '',
        fineAmount: '',
        description: ''
    });

    // Fetch all initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch all necessary data in parallel
                const [studentsRes, feePlansRes, coursesRes, batchesRes, sectionsRes] = await Promise.all([
                    axiosInstance.get('/students'),
                    axiosInstance.get('/fee-plans'),
                    axiosInstance.get('/course'),
                    axiosInstance.get('/batch'),
                    axiosInstance.get('/section')
                ]);

                setStudents(studentsRes.data.data || []);
                setFilteredStudents(studentsRes.data.data || []);
                setFeePlans(feePlansRes.data.plans || []);

                setDropdownOptions({
                    courses: coursesRes.data || [],
                    batches: batchesRes.data || [],
                    sections: sectionsRes.data || []
                });

                if (studentsRes.data.data.length === 0) {
                    toast.warn('No students found in the database.');
                }
                if (feePlansRes.data.plans.length === 0) {
                    toast.warn('No fee plans found in the database.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data: ' + (error.response?.data?.message || error.message));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fetch sections by course when course filter changes
    useEffect(() => {
        if (filters.course) {
            const fetchSectionsByCourse = async () => {
                try {
                    const res = await axiosInstance.get(`/api/section/course/${filters.course}`);
                    setDropdownOptions(prev => ({
                        ...prev,
                        sections: res.data || []
                    }));
                } catch (error) {
                    console.error('Error fetching sections:', error);
                    toast.error('Failed to fetch sections: ' + (error.response?.data?.message || error.message));
                }
            };
            fetchSectionsByCourse();
        }
    }, [filters.course]);

    // Apply filters and search to students
    useEffect(() => {
        let result = [...students];
        
        // Apply course filter
        if (filters.course) {
            result = result.filter(student => 
                student.course && student.course._id === filters.course
            );
        }
        
        // Apply batch filter
        if (filters.batch) {
            result = result.filter(student => 
                student.batch && student.batch._id === filters.batch
            );
        }
        
        // Apply section filter
        if (filters.section) {
            result = result.filter(student => 
                student.section && student.section._id === filters.section
            );
        }

        // Apply search query
        if (searchQuery) {
            result = result.filter(student =>
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        setFilteredStudents(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [filters, searchQuery, students]);

    // Fetch selected student details and fee payments
    useEffect(() => {
        if (selectedStudent) {
            const fetchStudentData = async () => {
                try {
                    setLoading(true);
                    // Fetch student details
                    const studentResponse = await axiosInstance.get(`/students/${selectedStudent}`);
                    setSelectedStudentDetails(studentResponse.data.student || null);

                    // Fetch fee payments
                    const feePaymentResponse = await axiosInstance.get(`/fee-payments/student/${selectedStudent}`);
                    setFeePayments(feePaymentResponse.data.docs || []);
                } catch (error) {
                    console.error('Error fetching student data:', error);
                    toast.error('Failed to fetch student data: ' + (error.response?.data?.message || error.message));
                } finally {
                    setLoading(false);
                }
            };
            fetchStudentData();
        } else {
            setSelectedStudentDetails(null);
            setFeePayments([]);
        }
    }, [selectedStudent]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Reset dependent filters
        if (name === 'course') {
            setFilters(prev => ({
                ...prev,
                section: ''
            }));
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle page change for pagination
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle creating a new fee payment
    const handleCreateFeePayment = async (e) => {
        e.preventDefault();
        if (!selectedStudent || !newFeePayment.feePlan) {
            toast.error('Please select a student and fee plan');
            return;
        }

        try {
            setLoading(true);
            const selectedPlan = feePlans.find(plan => plan._id === newFeePayment.feePlan);
            if (!selectedPlan) {
                toast.error('Selected fee plan not found');
                return;
            }

            // Validate ObjectIds
            const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
            if (!isValidObjectId(selectedStudent) || !isValidObjectId(newFeePayment.feePlan)) {
                toast.error('Invalid student or fee plan ID');
                return;
            }
            if (!selectedPlan.course?._id || !selectedPlan.batch?._id) {
                toast.error('Fee plan is missing course or batch');
                return;
            }

            // Only validate transaction amount and paymentMethod if transaction data is provided
            if (newFeePayment.transaction.amount && !Number.isFinite(parseFloat(newFeePayment.transaction.amount))) {
                toast.error('Invalid transaction amount');
                return;
            }

            const payload = {
                student: selectedStudent,
                feePlan: newFeePayment.feePlan,
                course: selectedPlan.course._id,
                batch: selectedPlan.batch._id,
                totalAmount: selectedPlan.totalFee,
                dueDate: selectedPlan.dueDate,
                transaction: newFeePayment.transaction.amount ? {
                    // Only include transactionId if explicitly provided
                    ...(newFeePayment.transaction.transactionId && { transactionId: newFeePayment.transaction.transactionId }),
                    amount: parseFloat(newFeePayment.transaction.amount),
                    paymentMethod: newFeePayment.transaction.paymentMethod,
                    status: newFeePayment.transaction.status,
                    receiptUrl: newFeePayment.transaction.receiptUrl,
                    notes: newFeePayment.transaction.notes
                } : undefined,
                customScholarship: newFeePayment.customScholarship.amount ? {
                    type: newFeePayment.customScholarship.type || 'Manual',
                    amount: parseFloat(newFeePayment.customScholarship.amount)
                } : undefined
            };

            const response = await axiosInstance.post('/fee-payments/add', payload);

            if (response.status === 201 && response.data.success) {
                toast.success('Fee payment created successfully');
                setNewFeePayment({
                    feePlan: '',
                    transaction: {
                        transactionId: '',
                        amount: '',
                        paymentMethod: 'Cash',
                        status: 'completed',
                        receiptUrl: '',
                        notes: ''
                    },
                    customScholarship: {
                        type: '',
                        amount: ''
                    },
                });

                const updatedPayments = await axiosInstance.get(`/fee-payments/student/${selectedStudent}`);
                setFeePayments(updatedPayments.data.docs || []);

                if (response.data.warning) {
                    toast.warn(response.data.warning);
                }
            } else {
                throw new Error(response.data.message || 'Unexpected response');
            }
        } catch (error) {
            console.error('Error creating fee payment:', error.response?.data, error);
            toast.error('Failed to create fee payment: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Handle adding a transaction
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        if (!newTransaction.feePaymentId || !newTransaction.amount) {
            toast.error('Please fill all required transaction fields (fee payment ID and amount)');
            return;
        }

        try {
            setLoading(true);
            
            const transactionData = {
                // Only include transactionId if explicitly provided
                ...(newTransaction.transactionId && { transactionId: newTransaction.transactionId }),
                amount: parseFloat(newTransaction.amount),
                paymentMethod: newTransaction.paymentMethod,
                status: newTransaction.status,
                receiptUrl: newTransaction.receiptUrl || '',
                notes: newTransaction.notes || ''
            };

            const response = await axiosInstance.put('/fee-payments/transaction', {
                feePaymentId: newTransaction.feePaymentId,
                transaction: transactionData
            });

            if (response.data.success) {
                toast.success(response.data.message || 'Transaction added successfully');
                
                setNewTransaction({
                    feePaymentId: '',
                    transactionId: '',
                    amount: '',
                    paymentMethod: 'Cash',
                    status: 'completed',
                    receiptUrl: '',
                    notes: ''
                });

                const updatedPayments = await axiosInstance.get(`/fee-payments/student/${selectedStudent}`);
                setFeePayments(updatedPayments.data.docs || []);
            } else {
                throw new Error(response.data.message || 'Failed to add transaction');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            
            if (error.response) {
                toast.error(error.response.data.message || 'Failed to add transaction');
            } else if (error.request) {
                toast.error('No response from server. Please check your connection.');
            } else {
                toast.error(error.message || 'Failed to add transaction');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle applying scholarship or discount
    const handleApplyAdjustment = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
        if (!adjustment.feePaymentId || !isValidObjectId(adjustment.feePaymentId)) {
            toast.error('Please select a valid fee payment');
            return;
        }
        
        if (!adjustment.amount || isNaN(parseFloat(adjustment.amount)) || parseFloat(adjustment.amount) <= 0) {
            toast.error('Please enter a valid positive amount');
            return;
        }

        try {
            setLoading(true);
            
            // Prepare the payload
            const payload = {
                feePaymentId: adjustment.feePaymentId,
                type: adjustment.type,
                amount: parseFloat(adjustment.amount),
                description: adjustment.description || `Manual ${adjustment.type}`,
                recordedBy: adjustment.recordedBy || 'Admin',
                ...(adjustment.type === 'scholarship' && {
                    customScholarshipType: adjustment.customScholarshipType || 'Manual'
                })
            };

            const response = await axiosInstance.put('/fee-payments/apply-discount', payload);
            
            if (response.data.success) {
                toast.success(response.data.message || `${adjustment.type} applied successfully`);
                
                // Reset form
                setAdjustment({ 
                    feePaymentId: '', 
                    type: 'scholarship', 
                    amount: '', 
                    description: '', 
                    recordedBy: '',
                    customScholarshipType: '' 
                });

                // Refresh fee payments
                const updatedPayments = await axiosInstance.get(`/fee-payments/student/${selectedStudent}`);
                setFeePayments(updatedPayments.data.docs || []);
            } else {
                throw new Error(response.data.message || `Failed to apply ${adjustment.type}`);
            }
        } catch (error) {
            console.error('Error applying adjustment:', error.response?.data, error);
            if (error.response) {
                toast.error(error.response.data.message || `Failed to apply ${adjustment.type}`);
            } else if (error.request) {
                toast.error('No response from server. Please check your connection.');
            } else {
                toast.error(error.message || `Failed to apply ${adjustment.type}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle applying late fee
    const handleApplyLateFee = async e => {
        e.preventDefault();

        // Validate required fields
        if (!lateFeeData.feePaymentId) {
            toast.error('Please select a fee payment');
            return;
        }

        const fineAmount = parseFloat(lateFeeData.fineAmount);
        if (isNaN(fineAmount)) {
            toast.error('Please enter a valid fine amount');
            return;
        }

        try {
            setLoading(true);

            // Prepare the payload
            const payload = {
                feePaymentId: lateFeeData.feePaymentId,
                fineAmount: fineAmount,
                description: lateFeeData.description || 'Late fee applied',
            };

            const response = await axiosInstance.put('/fee-payments/apply-late-fee', payload);

            if (response.data.success) {
                toast.success(response.data.message || 'Late fee applied successfully');

                // Reset form
                setLateFeeData({
                    feePaymentId: '',
                    fineAmount: '',
                    description: '',
                });

                // Refresh fee payments
                const updatedPayments = await axiosInstance.get(`/fee-payments/student/${selectedStudent}`);
                setFeePayments(updatedPayments.data.docs || []);
            } else {
                throw new Error(response.data.message || 'Failed to apply late fee');
            }
        } catch (error) {
            console.error('Full error:', error);
            console.error('Error response:', error.response?.data);

            const errorMessage = error.response?.data?.message || error.message || 'Failed to apply late fee';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle updating fee payment
    const handleUpdateFeePayment = async (e) => {
        e.preventDefault();
        if (!updateFeePayment.feePaymentId) {
            toast.error('Please select a fee payment to update');
            return;
        }

        try {
            setLoading(true);
            const payload = {};
            if (updateFeePayment.status) payload.status = updateFeePayment.status;
            if (updateFeePayment.dueDate) payload.dueDate = updateFeePayment.dueDate;

            const response = await axiosInstance.put(`/fee-payments/${updateFeePayment.feePaymentId}`, payload);
            toast.success('Fee payment updated successfully');

            setUpdateFeePayment({
                feePaymentId: '',
                status: '',
                dueDate: ''
            });

            const updatedPayments = await axiosInstance.get(`/fee-payments/student/${selectedStudent}`);
            setFeePayments(updatedPayments.data.docs || []);
        } catch (error) {
            console.error('Error updating fee payment:', error);
            toast.error('Failed to update fee payment: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Handle deleting fee payment
    const handleDeleteFeePayment = async (feePaymentId) => {
        if (!window.confirm('Are you sure you want to delete this fee payment?')) return;

        try {
            setLoading(true);
            await axiosInstance.delete(`/fee-payments/${feePaymentId}`);
            toast.success('Fee payment deleted successfully');
            const updatedPayments = await axiosInstance.get(`/fee-payments/student/${selectedStudent}`);
            setFeePayments(updatedPayments.data.docs || []);
        } catch (error) {
            console.error('Error deleting fee payment:', error);
            toast.error('Failed to delete fee payment: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Calculate payment summary
    const calculatePaymentSummary = (payment) => {
        const totalScholarship = (payment.scholarshipApplied || 0) + (payment.customScholarship?.amount || 0);
        const totalDue = payment.totalAmount - totalScholarship + (payment.lateFeeApplied || 0) - (payment.discountApplied || 0);
        const balance = totalDue - (payment.amountPaid || 0);

        return {
            totalDue,
            balance,
            isOverdue: new Date() > new Date(payment.dueDate) && balance > 0
        };
    };

    // Pagination logic
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Fee Payment Management</h1>

            {/* Student Selection with Filters and Search */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Student Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search by name or email"
                            className="block w-full p-2 border border-gray-300 rounded-md"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                        <select
                            name="course"
                            value={filters.course}
                            onChange={handleFilterChange}
                            className="block w-full p-2 border border-gray-300 rounded-md"
                            disabled={loading}
                        >
                            <option value="">All Courses</option>
                            {dropdownOptions.courses.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                        <select
                            name="batch"
                            value={filters.batch}
                            onChange={handleFilterChange}
                            className="block w-full p-2 border border-gray-300 rounded-md"
                            disabled={loading}
                        >
                            <option value="">All Batches</option>
                            {dropdownOptions.batches.map((batch) => (
                                <option key={batch._id} value={batch._id}>
                                    {batch.startYear}-{batch.endYear}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                        <select
                            name="section"
                            value={filters.section}
                            onChange={handleFilterChange}
                            className="block w-full p-2 border border-gray-300 rounded-md"
                            disabled={loading || !filters.course}
                        >
                            <option value="">All Sections</option>
                            {dropdownOptions.sections.map((section) => (
                                <option key={section._id} value={section._id}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                    <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-md"
                        disabled={loading || filteredStudents.length === 0}
                    >
                        <option value="">Select a student</option>
                        {filteredStudents.map((student) => (
                            <option key={student._id} value={student._id}>
                                {student.name} ({student.email}) - {student.course?.name || 'No Course'}
                            </option>
                        ))}
                    </select>
                    {loading && <p className="text-gray-500 mt-2">Loading...</p>}
                    {!loading && filteredStudents.length === 0 && (
                        <p className="text-red-500 mt-2">No students match the selected filters or search.</p>
                    )}
                    {!loading && students.length === 0 && (
                        <p className="text-red-500 mt-2">No students available. Please add students first.</p>
                    )}
                </div>
            </div>

            {/* Students List */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Students List</h2>
                {loading ? (
                    <p className="text-gray-500">Loading students...</p>
                ) : filteredStudents.length === 0 ? (
                    <p className="text-red-500">No students found.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">Name</th>
                                        <th className="py-2 px-4 border-b">Email</th>
                                        <th className="py-2 px-4 border-b">Course</th>
                                        <th className="py-2 px-4 border-b">Batch</th>
                                        <th className="py-2 px-4 border-b">Section</th>
                                          <th className="py-2 px-4 border-b">Semester</th>
                                        {/* <th className="py-2 px-4 border-b">GPA</th> */}
                                        <th className="py-2 px-4 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-gray-100">
                                            <td className="py-2 px-4 border-b">{student.name}</td>
                                            <td className="py-2 px-4 border-b">{student.email}</td>
                                            <td className="py-2 px-4 border-b">{student.course?.name || 'N/A'}</td>
                                            <td className="py-2 px-4 border-b">
                                                {student.batch ? `${student.batch.startYear}-${student.batch.endYear}` : 'N/A'}
                                            </td>
                                            <td className="py-2 px-4 border-b">{student.section?.name || 'N/A'}</td>
                                              <td className="py-2 px-4 border-b">{student.semester || 'N/A'}</td>
                                            {/* <td className="py-2 px-4 border-b">{student.gpa || 'N/A'}</td> */}
                                            <td className="py-2 px-4 border-b">
                                                <button
                                                    onClick={() => setSelectedStudent(student._id)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-4 flex justify-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Student Details */}
            {selectedStudent && selectedStudentDetails && (
                <div className="mb-6 p-4 border rounded-md shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">Student Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p><strong>Name:</strong> {selectedStudentDetails.name}</p>
                        <p><strong>Email:</strong> {selectedStudentDetails.email}</p>
                        <p><strong>Phone:</strong> {selectedStudentDetails.phone || 'N/A'}</p>
                        <p><strong>Gender:</strong> {selectedStudentDetails.gender || 'N/A'}</p>
                        <p><strong>DOB:</strong> {selectedStudentDetails.dob ? new Date(selectedStudentDetails.dob).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>GPA:</strong> {selectedStudentDetails.gpa || 'N/A'}</p>
                        <p><strong>Academic Status:</strong> {selectedStudentDetails.academicStatus || 'N/A'}</p>
                        <p><strong>Semester:</strong> {selectedStudentDetails.semester || 'N/A'}</p>
                        <p><strong>Course:</strong> {selectedStudentDetails.course?.name || 'N/A'}</p>
                        <p><strong>Section:</strong> {selectedStudentDetails.section?.name || 'N/A'}</p>
                        <p><strong>Batch:</strong> {selectedStudentDetails.batch ? `${selectedStudentDetails.batch.startYear}-${selectedStudentDetails.batch.endYear}` : 'N/A'}</p>
                    </div>
                </div>
            )}

            {/* Create Fee Payment */}
            <FeePaymentForm
                selectedStudent={selectedStudent}
                feePlans={feePlans}
                newFeePayment={newFeePayment}
                setNewFeePayment={setNewFeePayment}
                handleCreateFeePayment={handleCreateFeePayment}
                loading={loading}
            />

            {/* Fee Payments List */}
            <FeePaymentsList
                selectedStudent={selectedStudent}
                feePayments={feePayments}
                loading={loading}
                handleDeleteFeePayment={handleDeleteFeePayment}
            />

            {/* Add Transaction */}
            <TransactionForm
                selectedStudent={selectedStudent}
                feePayments={feePayments}
                newTransaction={newTransaction}
                setNewTransaction={setNewTransaction}
                handleAddTransaction={handleAddTransaction}
                loading={loading}
            />

            {/* Apply Scholarship/Discount */}
            <ApplyAdjustmentForm
                selectedStudent={selectedStudent}
                feePayments={feePayments}
                adjustment={adjustment}
                setAdjustment={setAdjustment}
                handleApplyAdjustment={handleApplyAdjustment}
                loading={loading}
            />

            {/* Apply Late Fee */}
            <ApplyLateFeeForm
                selectedStudent={selectedStudent}
                feePayments={feePayments}
                lateFeeData={lateFeeData}
                setLateFeeData={setLateFeeData}
                handleApplyLateFee={handleApplyLateFee}
                loading={loading}
            />

            {/* Update Fee Payment */}
            <UpdateFeePaymentForm
                selectedStudent={selectedStudent}
                feePayments={feePayments}
                updateFeePayment={updateFeePayment}
                setUpdateFeePayment={setUpdateFeePayment}
                handleUpdateFeePayment={handleUpdateFeePayment}
                loading={loading}
            />
        </div>
    );
};

export default Feepayment;