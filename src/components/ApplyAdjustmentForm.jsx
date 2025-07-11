import React from 'react';
import PropTypes from 'prop-types';

const ApplyAdjustmentForm = ({ selectedStudent, feePayments, adjustment, setAdjustment, handleApplyAdjustment, loading }) => {
  if (!selectedStudent || feePayments.length === 0) return null;

  return (
    <div className="mb-6 border-t pt-4">
      <h2 className="text-xl font-semibold mb-2">Apply Scholarship or Discount</h2>
      <form onSubmit={handleApplyAdjustment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Fee Payment</label>
          <select
            value={adjustment.feePaymentId}
            onChange={(e) => setAdjustment({ ...adjustment, feePaymentId: e.target.value })}
            className="block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a fee payment</option>
            {feePayments.map((payment) => (
              <option key={payment._id} value={payment._id}>
                {payment.feePlan?.name || 'N/A'} (₹{payment.totalAmount})
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={adjustment.type}
              onChange={(e) => setAdjustment({ ...adjustment, type: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="scholarship">Scholarship</option>
              <option value="discount">Discount</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={adjustment.amount}
              onChange={(e) => setAdjustment({ ...adjustment, amount: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>
          {adjustment.type === 'scholarship' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Scholarship Type</label>
              <input
                type="text"
                value={adjustment.customScholarshipType}
                onChange={(e) => setAdjustment({ ...adjustment, customScholarshipType: e.target.value })}
                className="block w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., Need-Based"
              />
            </div>
          )}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={adjustment.description}
              onChange={(e) => setAdjustment({ ...adjustment, description: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Optional description"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Recorded By</label>
            <input
              type="text"
              value={adjustment.recordedBy}
              onChange={(e) => setAdjustment({ ...adjustment, recordedBy: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Admin name"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Applying...' : `Apply ${adjustment.type}`}
        </button>
      </form>
    </div>
  );
};

ApplyAdjustmentForm.propTypes = {
  selectedStudent: PropTypes.object,
  feePayments: PropTypes.array.isRequired,
  adjustment: PropTypes.object.isRequired,
  setAdjustment: PropTypes.func.isRequired,
  handleApplyAdjustment: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ApplyAdjustmentForm;