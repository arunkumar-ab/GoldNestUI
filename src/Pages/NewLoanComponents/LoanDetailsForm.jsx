// components/LoanDetailsForm.jsx
export default function LoanDetailsForm({ loanData, setLoanData }) {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setLoanData({
        ...loanData,
        [name]: value
      });
    };
  
    return (
      <>
        <h2 className="text-lg font-semibold mb-4 text-purple-700">Loan Information</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
            <input
              type="text"
              name="billNo"
              value={loanData.billNo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter bill number"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
            <input
              type="number"
              name="interestRate"
              value={loanData.interestRate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter interest rate"
              step="0.01"
            />
          </div>
        </div>
  
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={loanData.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter loan description"
            rows="3"
          ></textarea>
        </div>
  
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
          <input
            type="date"
            name="issueDate"
            value={loanData.issueDate}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </>
    );
  }