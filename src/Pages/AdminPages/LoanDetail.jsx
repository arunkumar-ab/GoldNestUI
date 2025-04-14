import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoanDetailModal = ({ isOpen, onClose, loanId }) => {
  const [loanDetails, setLoanDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [calculation, setCalculation] = useState(null);
  const [pawnedItems, setPawnedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && loanId) fetchLoanDetails(loanId);
  }, [isOpen, loanId]);

  const fetchLoanDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5016/api/loans/${id}`);
      console.log('Full API response:', response.data);
      if (response.data) {
        setLoanDetails({
          id: response.data.loanID,
          billNo: response.data.billNo,
          date: response.data.loanIssueDate,
          status: response.data.status,
          interestRate: response.data.interestRate,
          amount: response.data.amountLoaned,
          closedDate: response.data.closedDate // If applicable
        });
        
        setCustomerDetails({
          id: response.data.customer.customerID,
          name: response.data.customer.customerName,
          fatherName: response.data.customer.fatherName,
          phone: response.data.customer.mobileNumber,
          address: response.data.customer.address || '',

        });
        
        setPawnedItems(response.data.pawnedItems.map(item => ({
          name: item.itemName,
          description: item.description || '',
          netWeight: item.netWeight || 0,
          grossWeight: item.grossWeight || 0,
          amount: item.amount || 0
        })));
        
        setCalculation(response.data.calculation);
      } else {
        setLoanDetails(null);
        setCustomerDetails(null);
        setPawnedItems([]);
        setCalculation(null);
        setError("Loan details not found.");
      }
    } catch (err) {
      console.error('Failed to fetch loan details', err);
      setError("Failed to fetch loan details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 modal-overlay backdrop-blur-sm" 
         onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-purple-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold">Loan Details {loanDetails && `- ${loanDetails.billNo}`}</h2>
          
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-4 text-center"><p>Loading loan details...</p></div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : loanDetails && customerDetails && calculation ? (
          <div className="p-4">
            {/* Customer & Loan Info Compact Row */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Customer Info Card */}
              <div className="md:col-span-1 bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-semibold mb-2 text-gray-800 border-b pb-1">Customer Info</h3>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">ID:</span>
                    <span className="font-medium">{customerDetails.id}</span>
                  </div>
                  <div>
                    <span className="font-medium">Name: {customerDetails.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Father: {customerDetails.fatherName}</span>
                  </div>
                  <div>
                    <span className='font-medium'>{customerDetails.phone}</span>
                  </div>
                  <div className="font-medium" title={customerDetails.address}>
                    {customerDetails.address}
                  </div>
                  
                </div>
              </div>
              
              {/* Loan Financial Card */}
              <div className="md:col-span-2 bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-semibold mb-2 text-gray-800 border-b pb-1">Loan Financial Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">{loanDetails.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p>
                      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        loanDetails.status === 'Active' ? 'bg-green-100 text-green-800' :
                        loanDetails.status === 'Closed' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {loanDetails.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Principal</p>
                    <p className="font-medium">₹{calculation.principal.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Interest Rate</p>
                    <p className="font-medium">{calculation.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium">{calculation.months} month(s)</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Interest Amount</p>
                    <p className="font-medium">₹{calculation.interestAmount.toLocaleString()}</p>
                  </div>
                  {loanDetails.status === 'Closed' && (
                    <div>
                      <p className="text-gray-600">Closed Date</p>
                      <p className="font-medium">{loanDetails.closedDate}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600">Total Payable</p>
                    <p className="font-medium text-purple-800">₹{calculation.totalPayable.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pledged Items Table - More Compact */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-800 border-b pb-1">Pledged Items</h3>
              {pawnedItems && pawnedItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (g)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pawnedItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{item.name}</td>
                          <td className="px-3 py-2 text-xs text-gray-500">{item.description}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{item.netWeight} ({item.grossWeight})</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">₹{item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No item details found for this loan.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-red-500">Loan details not found.</p>
          </div>
        )}

        {/* Footer */}
      </div>
    </div>
  );
};

export default LoanDetailModal;