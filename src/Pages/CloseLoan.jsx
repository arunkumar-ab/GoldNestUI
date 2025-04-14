import React, { useState } from 'react';
import axios from 'axios';

const CloseLoan = () => {
  const [searchBillNo, setSearchBillNo] = useState('');
  const [foundLoans, setFoundLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const searchLoans = async () => {
    if (!searchBillNo.trim()) {
      setError('Please enter a bill number');
      return;
    }

    setIsSearching(true);
    setError('');
    setFoundLoans([]);
    setSelectedLoan(null);
    
    try {
      const response = await axios.get(`http://localhost:5016/api/loans/search?billNo=${searchBillNo}`);
      
      if (response.data && response.data.length > 0) {
        setFoundLoans(response.data);
        console.log(response.data);
        setError('');
      } else {
        setError('No loans found with this bill number');
      }
    } catch (err) {
      setError('Error searching for loans: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSearching(false);
    }
  };

  const selectLoan = async (loanId) => {
    try {
      const response = await axios.get(`http://localhost:5016/api/loans/${loanId}`);
      setSelectedLoan(response.data);
      console.log("Selected loans", response.data);
    } catch (err) {
      setError('Error fetching loan details: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLoan) {
      setError('No loan selected');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const response = await axios.post(`http://localhost:5016/api/close/${selectedLoan.loanID}`);
      
      setSuccessMessage(`Loan ${selectedLoan.loanID} closed successfully.`);
      
      setTimeout(() => {
        resetForm();
      }, 3000);
      
    } catch (err) {
      setError('Error closing loan: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedLoan(null);
    setFoundLoans([]);
    setSearchBillNo('');
    setSuccessMessage('');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Close Loan</h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Search Loan by Bill Number</h3>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchBillNo}
            onChange={(e) => setSearchBillNo(e.target.value)}
            placeholder="Enter Bill Number"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={searchLoans}
            disabled={isSearching}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      
      {foundLoans.length > 0 && !selectedLoan && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Search Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Bill No.</th>
                  <th className="py-2 px-4 text-left">Customer</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {foundLoans.map((loan) => (
                  <tr key={`loan-${loan.loanID}`} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{loan.billNo}</td>
                    <td className="py-2 px-4">{loan.customerName || 'N/A'}</td>
                    <td className="py-2 px-4">{new Date(loan.loanIssueDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{loan.amountLoaned || '0.00'}</td>
                    <td className="py-2 px-4">{loan.status}</td>
                    <td className="py-2 px-4">
                      <button 
                        onClick={() => selectLoan(loan.loanID)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {selectedLoan && (
        <>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
            <div>
              <h3 className="font-medium mb-2">Loan Details</h3>
              <p><span className="font-semibold">Loan ID:</span> {selectedLoan.loanID}</p>
              <p><span className="font-semibold">Bill No:</span> {selectedLoan.billNo}</p>
              <p><span className="font-semibold">Customer:</span> {selectedLoan.customer?.customerName || 'N/A'}</p>
              <p><span className="font-semibold">Amount:</span> ₹{selectedLoan.amountLoaned?.toFixed(2) || '0.00'}</p>
              <p><span className="font-semibold">Date:</span> {new Date(selectedLoan.loanIssueDate).toLocaleDateString()}</p>
              <p><span className="font-semibold">Status:</span> {selectedLoan.status}</p>
              <p><span className="font-semibold">Description:</span> {selectedLoan.description || 'No description available'}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Payment Details</h3>
              <p><span className="font-semibold">Months Active:</span> {selectedLoan.calculation?.months || 0}</p>
              <p><span className="font-semibold">Principal Amount:</span> ₹{selectedLoan.calculation?.principal?.toFixed(2) || '0.00'}</p>
              <p><span className="font-semibold">Interest Rate:</span> {selectedLoan.calculation?.interestRate || 0}%</p>
              <p><span className="font-semibold">Interest Amount:</span> ₹{selectedLoan.calculation?.interestAmount?.toFixed(2) || '0.00'}</p>
              <p><span className="font-semibold">Total Payable:</span> ₹{selectedLoan.calculation?.totalPayable?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Pawned Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left border">Item Name</th>
                    <th className="py-2 px-4 text-left border">Gross Weight</th>
                    <th className="py-2 px-4 text-left border">Net Weight</th>
                    <th className="py-2 px-4 text-left border">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLoan.pawnedItems?.map((item, index) => (
                    <tr key={`item-${item.pawnedItemID || index}`} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 border">{item.itemName || 'N/A'}</td>
                      <td className="py-2 px-4 border">{item.grossWeight || 'N/A'} gm</td>
                      <td className="py-2 px-4 border">{item.netWeight || 'N/A'} gm</td>
                      <td className="py-2 px-4 border">₹{item.amount?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="p-4 bg-yellow-50 rounded mb-4">
              <p className="font-medium">Confirmation</p>
              <p>Are you sure you want to close this loan with a full payment of ₹{selectedLoan.calculation?.totalPayable?.toFixed(2) || '0.00'}?</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 bg-purple-600 text-white p-2 rounded hover:bg-blue-600"
              >
                {isProcessing ? 'Processing...' : 'Close Loan'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
      
      {!selectedLoan && foundLoans.length === 0 && !isSearching && (
        <div className="text-center p-8 bg-gray-50 rounded">
          <p>Search for a loan by bill number to close it</p>
        </div>
      )}
    </div>
  );
};

export default CloseLoan;