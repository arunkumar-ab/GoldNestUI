import React from 'react';

const CustomerDetails = ({ customer, onBack }) => {
  // Sample loan history data (replace with actual data from your system)
  const loanHistory = [
    { id: 1, loanAmount: 5000, interestRate: 2.5, status: 'Closed', date: '2023-10-01' },
    { id: 2, loanAmount: 3000, interestRate: 3.0, status: 'Open', date: '2023-09-15' },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Father's Name:</strong> {customer.fatherName}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
        <p><strong>Area:</strong> {customer.area}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Loan History</h2>
        {loanHistory.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Loan ID</th>
                <th className="py-2 px-4 border-b">Loan Amount</th>
                <th className="py-2 px-4 border-b">Interest Rate</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {loanHistory.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{loan.id}</td>
                  <td className="py-2 px-4 border-b">{loan.loanAmount}</td>
                  <td className="py-2 px-4 border-b">{loan.interestRate}%</td>
                  <td className="py-2 px-4 border-b">{loan.status}</td>
                  <td className="py-2 px-4 border-b">{loan.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No loan history found.</p>
        )}
      </div>

      
    </div>
  );
};

export default CustomerDetails;