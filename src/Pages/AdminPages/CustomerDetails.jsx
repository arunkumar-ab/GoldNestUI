import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerDetails = ({ customer, onBack }) => {
  const [loanHistory, setLoanHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoanHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5016/api/loanhistory/${customer.customerID}`);
        setLoanHistory(response.data);
      } catch (err) {
        console.error("Error fetching loan history:", err);
        setError("Failed to load loan history: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (customer && customer.customerID) {
      fetchLoanHistory();
    }
  }, [customer]);

  // Calculate duration from loan date to present date
  const calculateDuration = (loanDate) => {
    // Parse the loan date
    const startDate = new Date(loanDate);
    const currentDate = new Date();
    
    // Calculate difference in months and days
    let months = (currentDate.getFullYear() - startDate.getFullYear()) * 12;
    months += currentDate.getMonth() - startDate.getMonth();
    
    // Account for days difference
    const dayDifference = currentDate.getDate() - startDate.getDate();
    
    // If we're more than 2 days into the next month, count it as an additional month
    if (dayDifference > 2) {
      months += 1;
    }
    
    // First month is default
    return Math.max(1, months);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      

      {/* Customer Information Card */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Customer ID</p>
            <p className="text-md">{customer.customerID}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-md">{customer.customerName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Father's Name</p>
            <p className="text-md">{customer.fatherName || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-md">{customer.mobileNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-md">{customer.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Area</p>
            <p className="text-md">{customer.area || '-'}</p>
          </div>
          <div className="col-span-full">
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p className="text-md">{customer.address || '-'}</p>
          </div>
        </div>
      </div>

      {/* Loan History Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Loan History</h2>
        
        {loading ? (
          <div className="text-center py-6">Loading loan history...</div>
        ) : error ? (
          <div className="text-center py-6 text-red-600">{error}</div>
        ) : loanHistory.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No loan history found for this customer</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loanHistory.map((loan) => {
                  const currentDuration = calculateDuration(loan.date);
                  return (
                    <tr key={loan.loanid}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{loan.loanid}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(loan.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        ₹{loan.loanAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {loan.interestRate}%
                      </td>
                     
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        {currentDuration} {currentDuration === 1 ? 'Month' : 'Months'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${loan.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            loan.status === 'Closed' ? 'bg-blue-100 text-blue-800' : 
                            loan.status === 'fortified' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {loan.status}
                        </span>
                      </td>
                     
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Loan Payment History Section (if applicable) */}
      {loanHistory.length > 0 && loanHistory.some(loan => loan.payments && loan.payments.length > 0) && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loanHistory
                  .filter(loan => loan.payments && loan.payments.length > 0)
                  .flatMap(loan => 
                    loan.payments.map((payment, index) => (
                      <tr key={`${loan.id}-payment-${index}`}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{loan.loanID || loan.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          ₹{payment.amountPaid.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {payment.paymentMethod}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            payment.status === 'Failed' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;