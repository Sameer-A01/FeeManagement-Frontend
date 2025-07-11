import React from 'react';
import PropTypes from 'prop-types';

const TransactionForm = ({ 
  selectedStudent, 
  feePayments, 
  newTransaction, 
  setNewTransaction, 
  handleAddTransaction, 
  loading 
}) => {
  if (!selectedStudent || feePayments.length === 0) return null;

  return (
    <div className="mb-6 border-t pt-4">
      <h2 className="text-xl font-semibold mb-2">Add New Transaction</h2>
      <form onSubmit={handleAddTransaction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Fee Payment</label>
          <select
            value={newTransaction.feePaymentId}
            onChange={(e) => setNewTransaction({ ...newTransaction, feePaymentId: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700">Transaction ID (Optional)</label>
            <input
              type="text"
              value={newTransaction.transactionId}
              onChange={(e) => setNewTransaction({ ...newTransaction, transactionId: e.target.value })}
              placeholder="Transaction ID (optional)"
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              value={newTransaction.paymentMethod}
              onChange={(e) => setNewTransaction({ ...newTransaction, paymentMethod: e.target.value })}
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
              value={newTransaction.status}
              onChange={(e) => setNewTransaction({ ...newTransaction, status: e.target.value })}
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
              value={newTransaction.receiptUrl}
              onChange={(e) => setNewTransaction({ ...newTransaction, receiptUrl: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <input
              type="text"
              value={newTransaction.notes}
              onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !newTransaction.feePaymentId || !newTransaction.amount}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

TransactionForm.propTypes = {
  selectedStudent: PropTypes.string, // Corrected from PropTypes.object
  feePayments: PropTypes.array.isRequired,
  newTransaction: PropTypes.object.isRequired,
  setNewTransaction: PropTypes.func.isRequired,
  handleAddTransaction: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default TransactionForm;