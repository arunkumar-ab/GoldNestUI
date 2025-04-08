import React, { useState, useEffect } from 'react';

const CloseLoan = ({ loans, onLoanClose, onNewLoanCreate, fetchLoanById }) => {
  const [searchLoanId, setSearchLoanId] = useState('');
  const [loan, setLoan] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const [paymentOption, setPaymentOption] = useState('full'); // 'full', 'partial', 'interest'
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);

  const searchLoan = async () => {
    if (!searchLoanId.trim()) {
      setError('Please enter a loan ID');
      return;
    }

    setIsSearching(true);
    setError('');
    
    try {
      // If fetchLoanById is a prop function (e.g., API call)
      const foundLoan = await fetchLoanById(searchLoanId);
      
      if (foundLoan) {
        setLoan(foundLoan);
        calculateLoanDetails(foundLoan);
      } else {
        setError('Loan not found');
        setLoan(null);
      }
    } catch (err) {
      setError('Error searching for loan: ' + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const calculateLoanDetails = (loanData) => {
    if (loanData) {
      // Calculate total interest (months * interest rate * principal)
      const monthsActive = calculateMonthsActive(loanData.startDate);
      const interest = loanData.amount * (loanData.interestRate / 100) * monthsActive;
      const total = loanData.amount + interest;
      
      setTotalInterest(interest);
      setTotalPayable(total);
      setPaymentAmount(total); // Default to full payment
    }
  };

  useEffect(() => {
    if (loan) {
      calculateLoanDetails(loan);
    }
  }, [loan]);

  const calculateMonthsActive = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - start.getFullYear()) * 12 + 
                       (now.getMonth() - start.getMonth());
    return Math.max(1, monthsDiff); // Minimum 1 month
  };

  const handlePaymentOptionChange = (e) => {
    const option = e.target.value;
    setPaymentOption(option);
    
    if (option === 'full') {
      setPaymentAmount(totalPayable);
      setRemainingAmount(0);
    } else if (option === 'interest') {
      setPaymentAmount(totalInterest);
      setRemainingAmount(loan.amount);
    } else {
      // For partial, reset to 0 to let user enter amount
      setPaymentAmount(0);
      setRemainingAmount(totalPayable);
    }
  };

  const handlePaymentAmountChange = (e) => {
    const amount = parseFloat(e.target.value) || 0;
    setPaymentAmount(amount);
    
    if (paymentOption === 'partial') {
      setRemainingAmount(Math.max(0, totalPayable - amount));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!loan) {
      setError('No loan selected');
      return;
    }
    
    // Close the current loan
    const closedLoan = {
      ...loan,
      status: 'closed',
      closedDate: new Date().toISOString(),
      paymentAmount,
      paymentType: paymentOption,
      totalInterest
    };
    
    onLoanClose(closedLoan);
    
    // If partial payment or interest only, create a new loan
    if (paymentOption === 'partial' || paymentOption === 'interest') {
      const newLoanAmount = remainingAmount > loan.amount ? loan.amount : remainingAmount;
      
      const newLoan = {
        amount: newLoanAmount,
        interestRate: loan.interestRate,
        startDate: new Date().toISOString(),
        status: 'active',
        customerId: loan.customerId,
        relatedLoanId: loan.id // Reference to the original loan
      };
      
      onNewLoanCreate(newLoan);
    }
    
    // Reset the form after successful submission
    setLoan(null);
    setSearchLoanId('');
    setPaymentOption('full');
    setPaymentAmount(0);
    setRemainingAmount(0);
    setTotalInterest(0);
    setTotalPayable(0);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Close Loan</h2>
      
      {/* Loan Search Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Search for Loan</h3>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchLoanId}
            onChange={(e) => setSearchLoanId(e.target.value)}
            placeholder="Enter Loan ID"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={searchLoan}
            disabled={isSearching}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      
      {loan ? (
        <>
          <div className="mb-4">
            <h3 className="font-medium">Loan Details</h3>
            <p>Loan ID: {loan.id}</p>
            <p>Principal Amount: ${loan.amount.toFixed(2)}</p>
            <p>Interest Rate: {loan.interestRate}%</p>
            <p>Start Date: {new Date(loan.startDate).toLocaleDateString()}</p>
            <p>Months Active: {calculateMonthsActive(loan.startDate)}</p>
            <p>Total Interest: ${totalInterest.toFixed(2)}</p>
            <p>Total Payable: ${totalPayable.toFixed(2)}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Payment Option</label>
              <select
                value={paymentOption}
                onChange={handlePaymentOptionChange}
                className="w-full p-2 border rounded"
              >
                <option value="full">Full Payment</option>
                <option value="partial">Partial Payment</option>
                <option value="interest">Interest Only</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">Payment Amount</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={handlePaymentAmountChange}
                disabled={paymentOption === 'full' || paymentOption === 'interest'}
                className="w-full p-2 border rounded"
                min="0"
                max={totalPayable}
                step="0.01"
              />
            </div>
            
            {paymentOption !== 'full' && (
              <div className="mb-4">
                <label className="block mb-2">Remaining Amount (New Loan)</label>
                <input
                  type="number"
                  value={remainingAmount.toFixed(2)}
                  className="w-full p-2 border rounded bg-gray-100"
                  disabled
                />
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-purple-600 text-white p-2 rounded hover:bg-blue-600"
            >
              {paymentOption === 'full' ? 'Close Loan' : 'Process Payment & Create New Loan'}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded">
          <p>Search for a loan by ID to close it</p>
        </div>
      )}
    </div>
  );
};

export default CloseLoan;