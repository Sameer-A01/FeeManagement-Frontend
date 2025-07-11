import React from 'react';
import PropTypes from 'prop-types';

const FeePaymentForm = ({ 
  selectedStudent, 
  feePlans, 
  newFeePayment, 
  setNewFeePayment, 
  handleCreateFeePayment, 
  loading 
}) => {
  if (!selectedStudent) return null;

  return (
    <div className="mb-6 border-t pt-4">
      <h2 className="text-xl font-semibold mb-2">Create New Fee Payment</h2>
      <form onSubmit={handleCreateFeePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Fee Plan</label>
          <select
            value={newFeePayment.feePlan}
            onChange={(e) => setNewFeePayment({ ...newFeePayment, feePlan: e.target.value })}
            className="block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a fee plan</option>
            {feePlans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.name} (₹{plan.totalFee}, {plan.duration})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium">Initial Transaction (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
              <input
                type="text"
                value={newFeePayment.transaction.transactionId}
                onChange={(e) =>
                  setNewFeePayment({
                    ...newFeePayment,
                    transaction: { ...newFeePayment.transaction, transactionId: e.target.value },
                  })
                }
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={newFeePayment.transaction.amount}
                onChange={(e) =>
                  setNewFeePayment({
                    ...newFeePayment,
                    transaction: { ...newFeePayment.transaction, amount: e.target.value },
                  })
                }
                className="block w-full p-2 border border-gray-300 rounded-md"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                value={newFeePayment.transaction.paymentMethod}
                onChange={(e) =>
                  setNewFeePayment({
                    ...newFeePayment,
                    transaction: { ...newFeePayment.transaction, paymentMethod: e.target.value },
                  })
                }
                className="block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={newFeePayment.transaction.status}
                onChange={(e) =>
                  setNewFeePayment({
                    ...newFeePayment,
                    transaction: { ...newFeePayment.transaction, status: e.target.value },
                  })
                }
                className="block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Receipt URL</label>
              <input
                type="text"
                value={newFeePayment.transaction.receiptUrl}
                onChange={(e) =>
                  setNewFeePayment({
                    ...newFeePayment,
                    transaction: { ...newFeePayment.transaction, receiptUrl: e.target.value },
                  })
                }
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <input
                type="text"
                value={newFeePayment.transaction.notes}
                onChange={(e) =>
                  setNewFeePayment({
                    ...newFeePayment,
                    transaction: { ...newFeePayment.transaction, notes: e.target.value },
                  })
                }
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium">Custom Scholarship (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <input
                type="text"
                value={newFeePayment.customScholarship.type}
                onChange={(e) =>
                  setNewFeePayment({
                    ...newFeePayment,
                    customScholarship: { ...newFeePayment.customScholarship, type: e.target.value },
                  })
                }
                className="block w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., Need-Based"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={newFeePayment.customScholarship.amount}
                onChange={(e) =>
                  setNewFeePayment({
                    ...newFeePayment,
                    customScholarship: { ...newFeePayment.customScholarship, amount: e.target.value },
                  })
                }
                className="block w-full p-2 border border-gray-300 rounded-md"
                min="0"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Fee Payment'}
        </button>
      </form>
    </div>
  );
};

FeePaymentForm.propTypes = {
  selectedStudent: PropTypes.object,
  feePlans: PropTypes.array.isRequired,
  newFeePayment: PropTypes.object.isRequired,
  setNewFeePayment: PropTypes.func.isRequired,
  handleCreateFeePayment: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FeePaymentForm;