import React from 'react';
import PropTypes from 'prop-types';

const calculatePaymentSummary = (payment) => {
  const totalDue = payment.totalAmount - (payment.amountPaid || 0) - (payment.scholarshipApplied || 0) - (payment.discountApplied || 0) + (payment.lateFeeApplied || 0);
  const balance = totalDue;
  const isOverdue = new Date(payment.dueDate) < new Date() && totalDue > 0;
  return { totalDue, balance, isOverdue };
};

const FeePaymentsList = ({ selectedStudent, feePayments, loading, handleDeleteFeePayment }) => {
  if (!selectedStudent) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Fee Payments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : feePayments.length === 0 ? (
        <p>No fee payments found for this student.</p>
      ) : (
        <div className="grid gap-4">
          {feePayments.map((payment) => {
            const summary = calculatePaymentSummary(payment);
            return (
              <div key={payment._id} className="p-4 border rounded-md shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p><strong>Fee Plan:</strong> {payment.feePlan?.name || 'N/A'}</p>
                    <p><strong>Course:</strong> {payment.course?.name || 'N/A'}</p>
                    <p><strong>Total Amount:</strong> ₹{payment.totalAmount}</p>
                    <p><strong>Amount Paid:</strong> ₹{payment.amountPaid}</p>
                    <p><strong>Scholarship Applied:</strong> ₹{payment.scholarshipApplied || 0}</p>
                    {payment.customScholarship?.amount > 0 && (
                      <p><strong>Custom Scholarship:</strong> ₹{payment.customScholarship.amount} ({payment.customScholarship.type || 'N/A'})</p>
                    )}
                    {payment.lateFeeApplied > 0 && (
                      <p><strong>Late Fee Applied:</strong> ₹{payment.lateFeeApplied}</p>
                    )}
                    {payment.discountApplied > 0 && (
                      <p><strong>Discount Applied:</strong> ₹{payment.discountApplied}</p>
                    )}
                    <p className={`font-semibold ${summary.isOverdue ? 'text-red-600' : ''}`}>
                      <strong>Total Due:</strong> ₹{summary.totalDue.toFixed(2)}
                    </p>
                    <p className={`font-semibold ${summary.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      <strong>Balance:</strong> ₹{summary.balance.toFixed(2)}
                    </p>
                    <p><strong>Status:</strong>
                      <span className={`ml-1 ${payment.status === 'fully_paid' ? 'text-green-600' :
                        payment.status === 'partially_paid' ? 'text-yellow-600' :
                        payment.status === 'overdue' ? 'text-red-600' : ''
                      }`}>
                        {payment.status.replace('_', ' ')}
                      </span>
                    </p>
                    <p><strong>Due Date:</strong>
                      <span className={`ml-1 ${summary.isOverdue ? 'text-red-600' : ''}`}>
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteFeePayment(payment._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-2">
                  <h3 className="font-medium">Transactions:</h3>
                  {payment.transactions.length === 0 ? (
                    <p>No transactions</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {payment.transactions.map((tx) => (
                        <li key={tx.transactionId}>
                          ₹{tx.amount} via {tx.paymentMethod} ({tx.status}) on {new Date(tx.paymentDate).toLocaleDateString()}
                          {tx.receiptUrl && (
                            <a href={tx.receiptUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">
                              Receipt
                            </a>
                          )}
                          {tx.notes && <p className="text-sm text-gray-600">Notes: {tx.notes}</p>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-2">
                  <h3 className="font-medium">Payment History:</h3>
                  {payment.paymentHistory.length === 0 ? (
                    <p>No history</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {payment.paymentHistory.map((history, index) => (
                        <li key={index}>
                          {history.type.replace('_', ' ')}: ₹{history.amount} on {new Date(history.date).toLocaleDateString()} - {history.description}
                          {history.recordedBy && <span className="text-sm text-gray-600"> (by {history.recordedBy})</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

FeePaymentsList.propTypes = {
  selectedStudent: PropTypes.object,
  feePayments: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  handleDeleteFeePayment: PropTypes.func.isRequired,
};

export default FeePaymentsList;