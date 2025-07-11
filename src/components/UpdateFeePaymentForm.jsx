import React from 'react';
import PropTypes from 'prop-types';

const UpdateFeePaymentForm = ({ selectedStudent, feePayments, updateFeePayment, setUpdateFeePayment, handleUpdateFeePayment, loading }) => {
  if (!selectedStudent || feePayments.length === 0) return null;

  return (
    <div className="mb-6 border-t pt-4">
      <h2 className="text-xl font-semibold mb-2">Update Fee Payment</h2>
      <form onSubmit={handleUpdateFeePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Fee Payment</label>
          <select
            value={updateFeePayment.feePaymentId}
            onChange={(e) => setUpdateFeePayment({ ...updateFeePayment, feePaymentId: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={updateFeePayment.status}
              onChange={(e) => setUpdateFeePayment({ ...updateFeePayment, status: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select status</option>
              <option value="OverPayed">OverPayed</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="fully_paid">Fully Paid</option>
              <option value="overdue">Overdue</option>
              <option value="waived">Waived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={updateFeePayment.dueDate}
              onChange={(e) => setUpdateFeePayment({ ...updateFeePayment, dueDate: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Updating...' : 'Update Fee Payment'}
        </button>
      </form>
    </div>
  );
};

UpdateFeePaymentForm.propTypes = {
  selectedStudent: PropTypes.object,
  feePayments: PropTypes.array.isRequired,
  updateFeePayment: PropTypes.object.isRequired,
  setUpdateFeePayment: PropTypes.func.isRequired,
  handleUpdateFeePayment: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default UpdateFeePaymentForm;