// import React, { useState, useEffect } from 'react';

// const LoanDetailModal = ({ isOpen, onClose, loanId }) => {
//   const [loanDetails, setLoanDetails] = useState(null);
//   const [customerDetails, setCustomerDetails] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (isOpen && loanId) {
//       fetchLoanDetails(loanId);
//     }
//   }, [isOpen, loanId]);

//   const fetchLoanDetails = async (id) => {
//     setLoading(true);
//     try {
//       // Simulate API call with sample data
//       const response = await new Promise((resolve) => {
//         setTimeout(() => {
//           // Find the specific loan
//           const loan = sampleLoans.find(l => l.id === id);
          
//           if (!loan) {
//             resolve({ loan: null, customer: null });
//             return;
//           }
          
//           // Find the customer for this loan
//           const customer = sampleCustomers.find(c => c.id === loan.customerId);
          
//           // Find the collateral item for this specific loan
//           const loanItems = sampleLoanItems.filter(item => item.loanId === id);
          
//           resolve({ loan, customer, loanItems });
//         }, 500);
//       });
      
//       if (response.loan) {
//         setLoanDetails({
//           ...response.loan,
//           items: response.loanItems
//         });
//         setCustomerDetails(response.customer);
//       } else {
//         setLoanDetails(null);
//         setCustomerDetails(null);
//       }
//     } catch (err) {
//       console.error('Failed to fetch loan details', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateInterest = (loan) => {
//     const startDate = new Date(loan.date);
//     const endDate = loan.status === 'Closed' ? new Date(loan.closedDate) : new Date();
    
//     // Calculate months (partial months count as full)
//     const months = Math.ceil(
//       (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
//       (endDate.getMonth() - startDate.getMonth()) +
//       (endDate.getDate() < startDate.getDate() ? -1 : 0)
//     );
    
//     // Convert amount from string (₹25,000) to number (25000)
//     const principalAmount = parseFloat(loan.amount.replace(/[^0-9.-]+/g, ''));
    
//     // Calculate interest (1% per month)
//     const interestRate = 0.01; // 1% monthly interest
//     const monthlyInterest = principalAmount * interestRate;
//     const totalInterest = monthlyInterest * months;
    
//     return {
//       months,
//       principalAmount,
//       monthlyInterest,
//       totalInterest,
//       totalAmount: principalAmount + totalInterest
//     };
//   };

//   const handleOutsideClick = (e) => {
//     if (e.target.classList.contains('modal-overlay')) {
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 modal-overlay backdrop-blur-sm"
//       onClick={handleOutsideClick}
//     >
//       <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Modal Header */}
//         <div className="bg-purple-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Loan Details {loanDetails && `- ${loanDetails.id}`}</h2>
//           <button onClick={onClose} className="text-white hover:text-gray-200">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Modal Content */}
//         {loading ? (
//           <div className="p-6 text-center">
//             <p>Loading loan details...</p>
//           </div>
//         ) : loanDetails && customerDetails ? (
//           <div className="p-6">
//             {/* Customer Details Section */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Customer Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Customer ID</p>
//                   <p className="font-medium">{customerDetails.id}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Full Name</p>
//                   <p className="font-medium">{customerDetails.name}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Phone Number</p>
//                   <p className="font-medium">{customerDetails.phone}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Email</p>
//                   <p className="font-medium">{customerDetails.email}</p>
//                 </div>
//                 <div className="md:col-span-2">
//                   <p className="text-sm text-gray-600">Address</p>
//                   <p className="font-medium">{customerDetails.address}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">ID Proof</p>
//                   <p className="font-medium">{customerDetails.idProof}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">ID Number</p>
//                   <p className="font-medium">{customerDetails.idNumber}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Selected Loan Item Details */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Pledged Items for This Loan</h3>
//               {loanDetails.items && loanDetails.items.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Weight</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Weight</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {loanDetails.items.map((item, index) => (
//                         <tr key={index}>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
//                           <td className="px-4 py-3 text-sm text-gray-500">{item.description}</td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.grossWeight} g</td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.netWeight} g</td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{item.value.toLocaleString()}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500">No item details found for this loan.</p>
//               )}
//             </div>

//             {/* Loan Financial Details */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Loan Financial Details</h3>
              
//               {(() => {
//                 // Calculate all financial details
//                 const calculation = calculateInterest(loanDetails);
                
//                 return (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
//                     <div>
//                       <p className="text-sm text-gray-600">Loan Date</p>
//                       <p className="font-medium">{loanDetails.date}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Status</p>
//                       <p className="font-medium">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           loanDetails.status === 'Active' ? 'bg-green-100 text-green-800' :
//                           loanDetails.status === 'Closed' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
//                         }`}>
//                           {loanDetails.status}
//                         </span>
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Loan Amount</p>
//                       <p className="font-medium">₹{calculation.principalAmount.toLocaleString()}</p>
//                     </div>
//                     {loanDetails.status === 'Closed' && (
//                       <div>
//                         <p className="text-sm text-gray-600">Closed Date</p>
//                         <p className="font-medium">{loanDetails.closedDate}</p>
//                       </div>
//                     )}
//                     <div>
//                       <p className="text-sm text-gray-600">Loan Duration</p>
//                       <p className="font-medium">{calculation.months} months</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Interest Rate</p>
//                       <p className="font-medium">1% per month</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Monthly Interest</p>
//                       <p className="font-medium">₹{calculation.monthlyInterest.toLocaleString()}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Total Interest</p>
//                       <p className="font-medium">₹{calculation.totalInterest.toLocaleString()}</p>
//                     </div>
//                     <div className="md:col-span-2 bg-purple-50 p-3 rounded-lg mt-2">
//                       <p className="text-sm font-medium text-purple-800">Total Payable Amount</p>
//                       <p className="text-xl font-bold text-purple-900">₹{calculation.totalAmount.toLocaleString()}</p>
//                     </div>
//                   </div>
//                 );
//               })()}
//             </div>
//           </div>
//         ) : (
//           <div className="p-6 text-center">
//             <p className="text-red-500">Loan details not found.</p>
//           </div>
//         )}

//         {/* Modal Footer */}
//         <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Sample customer data
// const sampleCustomers = [
//   {
//     id: 'C1001',
//     name: 'Rajesh Kumar',
//     phone: '+91 9876543210',
//     email: 'rajesh.kumar@example.com',
//     address: '123 Main Street, Mumbai, Maharashtra 400001',
//     idProof: 'Aadhaar Card',
//     idNumber: '1234-5678-9012'
//   },
//   {
//     id: 'C1002',
//     name: 'Priya Sharma',
//     phone: '+91 9876543211',
//     email: 'priya.sharma@example.com',
//     address: '456 Park Avenue, Delhi, 110001',
//     idProof: 'PAN Card',
//     idNumber: 'ABCDE1234F'
//   },
//   {
//     id: 'C1003',
//     name: 'Amit Patel',
//     phone: '+91 9876543212',
//     email: 'amit.patel@example.com',
//     address: '789 Garden Road, Ahmedabad, Gujarat 380001',
//     idProof: 'Passport',
//     idNumber: 'A1234567'
//   }
// ];

// // Sample loans data
// const sampleLoans = [
//   {
//     id: 'A0001',
//     customerId: 'C1001',
//     customerName: 'Rajesh Kumar',
//     date: '2025-03-01',
//     closedDate: '2025-04-15',
//     amount: '₹25,000',
//     status: 'Closed',
//   },
//   {
//     id: 'A0002',
//     customerId: 'C1002',
//     customerName: 'Priya Sharma',
//     date: '2025-02-15',
//     closedDate: '',
//     amount: '₹35,000',
//     status: 'Active',
//   },
//   {
//     id: 'A0003',
//     customerId: 'C1003',
//     customerName: 'Amit Patel',
//     date: '2025-01-20',
//     closedDate: '2025-03-25',
//     amount: '₹15,000',
//     status: 'Closed',
//   },
//   {
//     id: 'A0004',
//     customerId: 'C1001',
//     customerName: 'Rajesh Kumar',
//     date: '2024-12-10',
//     closedDate: '',
//     amount: '₹40,000',
//     status: 'Fortified',
//   },
// ];

// // Sample loan items (new data structure for specific loan items)
// const sampleLoanItems = [
//   {
//     loanId: 'A0001',
//     name: 'Gold Necklace',
//     description: '22K Gold, Floral Design',
//     grossWeight: 26.5,
//     netWeight: 25.2,
//     value: 120000
//   },
//   {
//     loanId: 'A0002',
//     name: 'Diamond Earrings',
//     description: '1 carat each, pair',
//     grossWeight: 4.2,
//     netWeight: 3.8,
//     value: 200000
//   },
//   {
//     loanId: 'A0003',
//     name: 'Silver Items',
//     description: 'Various silver utensils',
//     grossWeight: 520,
//     netWeight: 500,
//     value: 45000
//   },
//   {
//     loanId: 'A0004',
//     name: 'Gold Chain',
//     description: '22K Gold',
//     grossWeight: 15.8,
//     netWeight: 15.0,
//     value: 72000
//   },
//   {
//     loanId: 'A0004',
//     name: 'Gold Ring',
//     description: '22K Gold with Ruby',
//     grossWeight: 8.5,
//     netWeight: 8.0,
//     value: 38000
//   }
// ];

// export default LoanDetailModal;

import React, { useState, useEffect } from 'react';

const LoanDetailModal = ({ isOpen, onClose, loanId }) => {
  const [loanDetails, setLoanDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && loanId) fetchLoanDetails(loanId);
  }, [isOpen, loanId]);

  const fetchLoanDetails = async (id) => {
    setLoading(true);
    try {
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          const loan = sampleLoans.find(l => l.id === id);
          if (!loan) {
            resolve({ loan: null, customer: null });
            return;
          }
          const customer = sampleCustomers.find(c => c.id === loan.customerId);
          const loanItems = sampleLoanItems.filter(item => item.loanId === id);
          resolve({ loan, customer, loanItems });
        }, 500);
      });
      
      if (response.loan) {
        setLoanDetails({ ...response.loan, items: response.loanItems });
        setCustomerDetails(response.customer);
      } else {
        setLoanDetails(null);
        setCustomerDetails(null);
      }
    } catch (err) {
      console.error('Failed to fetch loan details', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateInterest = (loan) => {
    const startDate = new Date(loan.date);
    const endDate = loan.status === 'Closed' ? new Date(loan.closedDate) : new Date();
    const months = Math.ceil(
      (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
      (endDate.getMonth() - startDate.getMonth()) +
      (endDate.getDate() < startDate.getDate() ? -1 : 0)
    );
    const principalAmount = parseFloat(loan.amount.replace(/[^0-9.-]+/g, ''));
    const interestRate = 0.01;
    const monthlyInterest = principalAmount * interestRate;
    const totalInterest = monthlyInterest * months;
    
    return {
      months,
      principalAmount,
      monthlyInterest,
      totalInterest,
      totalAmount: principalAmount + totalInterest
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 modal-overlay backdrop-blur-sm" 
         onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-purple-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold">Loan Details {loanDetails && `- ${loanDetails.id}`}</h2>
          
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-4 text-center"><p>Loading loan details...</p></div>
        ) : loanDetails && customerDetails ? (
          <div className="p-4">
            {/* Customer & Loan Info Compact Row */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Customer Info Card */}
              <div className="md:col-span-1 bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-semibold mb-2 text-gray-800 border-b pb-1">Customer Info</h3>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium">{customerDetails.id}</span>
                  </div>
                  <div>
                    <span className="font-medium">{customerDetails.name}</span>
                  </div>
                  <div>
                    <span>{customerDetails.phone}</span>
                  </div>
                  <div className="text-gray-600 truncate" title={customerDetails.address}>
                    {customerDetails.address}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{customerDetails.idProof}:</span>
                    <span>{customerDetails.idNumber}</span>
                  </div>
                </div>
              </div>
              
              {/* Loan Financial Card */}
              <div className="md:col-span-2 bg-gray-50 p-3 rounded">
                <h3 className="text-sm font-semibold mb-2 text-gray-800 border-b pb-1">Loan Financial Details</h3>
                {(() => {
                  const calc = calculateInterest(loanDetails);
                  return (
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
                        <p className="text-gray-600">Amount</p>
                        <p className="font-medium">₹{calc.principalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Duration</p>
                        <p className="font-medium">{calc.months} months</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Monthly Interest</p>
                        <p className="font-medium">₹{calc.monthlyInterest.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Interest</p>
                        <p className="font-medium">₹{calc.totalInterest.toLocaleString()}</p>
                      </div>
                      {loanDetails.status === 'Closed' && (
                        <div>
                          <p className="text-gray-600">Closed Date</p>
                          <p className="font-medium">{loanDetails.closedDate}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-600">Total Payable</p>
                        <p className="font-medium text-purple-800">₹{calc.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Pledged Items Table - More Compact */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-800 border-b pb-1">Pledged Items</h3>
              {loanDetails.items && loanDetails.items.length > 0 ? (
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
                      {loanDetails.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{item.name}</td>
                          <td className="px-3 py-2 text-xs text-gray-500">{item.description}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{item.netWeight} ({item.grossWeight})</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">₹{item.value.toLocaleString()}</td>
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
        <div className="bg-gray-50 px-4 py-3 rounded-b-lg flex justify-end">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


// Sample customer data
const sampleCustomers = [
    {
      id: 'C1001',
      name: 'Rajesh Kumar',
      phone: '+91 9876543210',
      email: 'rajesh.kumar@example.com',
      address: '123 Main Street, Mumbai, Maharashtra 400001',
      idProof: 'Aadhaar Card',
      idNumber: '1234-5678-9012'
    },
    {
      id: 'C1002',
      name: 'Priya Sharma',
      phone: '+91 9876543211',
      email: 'priya.sharma@example.com',
      address: '456 Park Avenue, Delhi, 110001',
      idProof: 'PAN Card',
      idNumber: 'ABCDE1234F'
    },
    {
      id: 'C1003',
      name: 'Amit Patel',
      phone: '+91 9876543212',
      email: 'amit.patel@example.com',
      address: '789 Garden Road, Ahmedabad, Gujarat 380001',
      idProof: 'Passport',
      idNumber: 'A1234567'
    }
  ];
  
  // Sample loans data
  const sampleLoans = [
    {
      id: 'A0001',
      customerId: 'C1001',
      customerName: 'Rajesh Kumar',
      date: '2025-03-01',
      closedDate: '2025-04-15',
      amount: '₹25,000',
      status: 'Closed',
    },
    {
      id: 'A0002',
      customerId: 'C1002',
      customerName: 'Priya Sharma',
      date: '2025-02-15',
      closedDate: '',
      amount: '₹35,000',
      status: 'Active',
    },
    {
      id: 'A0003',
      customerId: 'C1003',
      customerName: 'Amit Patel',
      date: '2025-01-20',
      closedDate: '2025-03-25',
      amount: '₹15,000',
      status: 'Closed',
    },
    {
      id: 'A0004',
      customerId: 'C1001',
      customerName: 'Rajesh Kumar',
      date: '2024-12-10',
      closedDate: '',
      amount: '₹40,000',
      status: 'Fortified',
    },
  ];
  
  // Sample loan items (new data structure for specific loan items)
  const sampleLoanItems = [
    {
      loanId: 'A0001',
      name: 'Gold Necklace',
      description: '22K Gold, Floral Design',
      grossWeight: 26.5,
      netWeight: 25.2,
      value: 120000
    },
    {
      loanId: 'A0002',
      name: 'Diamond Earrings',
      description: '1 carat each, pair',
      grossWeight: 4.2,
      netWeight: 3.8,
      value: 200000
    },
    {
      loanId: 'A0003',
      name: 'Silver Items',
      description: 'Various silver utensils',
      grossWeight: 520,
      netWeight: 500,
      value: 45000
    },
    {
      loanId: 'A0004',
      name: 'Gold Chain',
      description: '22K Gold',
      grossWeight: 15.8,
      netWeight: 15.0,
      value: 72000
    },
    {
      loanId: 'A0004',
      name: 'Gold Ring',
      description: '22K Gold with Ruby',
      grossWeight: 8.5,
      netWeight: 8.0,
      value: 38000
    }
  ];
export default LoanDetailModal;