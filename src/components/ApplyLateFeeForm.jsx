import React from 'react';
import PropTypes from 'prop-types';

const ApplyLateFeeForm = ({ selectedStudent, feePayments, lateFeeData, setLateFeeData, handleApplyLateFee, loading }) => {
  if (!selectedStudent || feePayments.length === 0) return null;

  return (
    <div className="mb-6 border-t pt-4">
      <h2 className="text-xl font-semibold mb-2">Apply Late Fee</h2>
      <form onSubmit={handleApplyLateFee} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Fee Payment</label>
          <select
            value={lateFeeData.feePaymentId}
            onChange={(e) => setLateFeeData({ ...lateFeeData, feePaymentId: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700">Fine Amount</label>
            <input
              type="number"
              value={lateFeeData.fineAmount}
              onChange={(e) => setLateFeeData({ ...lateFeeData, fineAmount: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={lateFeeData.description}
              onChange={(e) => setLateFeeData({ ...lateFeeData, description: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Reason for late fee"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Applying...' : 'Apply Late Fee'}
        </button>
      </form>
    </div>
  );
};

ApplyLateFeeForm.propTypes = {
  selectedStudent: PropTypes.object,
  feePayments: PropTypes.array.isRequired,
  lateFeeData: PropTypes.object.isRequired,
  setLateFeeData: PropTypes.func.isRequired,
  handleApplyLateFee: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ApplyLateFeeForm;