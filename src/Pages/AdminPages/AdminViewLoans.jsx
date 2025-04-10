
import React, { useState, useEffect } from 'react';
import LoanDetailModal from './LoanDetail';
import ExcelExport from '../../Components/ExcelExport';
import axios from "axios";

const ViewLoans = () => {
  // State for loans and filtering
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLoanId, setSelectedLoanId] = useState('');
  
  // State for filters
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  // State for report data
  const [reportData, setReportData] = useState({
    totalLoanAmount: 0,
    totalInterestReceived: 0, 
    totalPrincipalReceived: 0,
    totalAmountReceived: 0,
    activeLoanCount: 0,
    closedLoanCount: 0
  });

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({
    id: '',
    name: ''
  });

  // Function to fetch loans with filters
  const fetchLoans = async () => {
    setLoading(true);
    try {
      // Build query parameters based on current filters
      let queryParams = new URLSearchParams();
      
      if (dateRange.start) {
        queryParams.append('fromDate', dateRange.start);
      }
      
      if (dateRange.end) {
        queryParams.append('toDate', dateRange.end);
      }
      
      if (statusFilter) {
        queryParams.append('status', statusFilter);
      }
      
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      // Make API call with query parameters
      const response = await axios.get(`http://localhost:5016/api/loans?${queryParams.toString()}`);
      
      // Format the loan data from the API response
      const formattedLoans = response.data.loans.map(loan => ({
        id: loan.loanID,
        billNo: loan.billNo,
        billNoInt: parseInt(loan.billNo.replace(/[^0-9]/g, '')) || 0, // Extract numeric part for sorting
        customerId: loan.customerId,
        customerName: loan.customerName || 'Unknown',
        date: new Date(loan.openDate).toLocaleDateString('en-GB'),
        dateObj: new Date(loan.openDate), // Store date object for sorting
        closedDate: loan.closeDate ? new Date(loan.closeDate).toLocaleDateString('en-GB') : '',
        closedDateObj: loan.closeDate ? new Date(loan.closeDate) : null, // Store date object for sorting
        amount: `₹${(loan.amount ?? 0).toLocaleString()}`,
        amountValue: loan.amount || 0, // Store numeric value for sorting
        status: loan.status,
        interestMonths: loan.interestMonths,
        interest: loan.interest ? `₹${loan.interest.toLocaleString()}` : '-',
        amountReceived: loan.amountReceived ? `₹${loan.amountReceived.toLocaleString()}` : '-'
      }));
      
      setLoans(formattedLoans);
      setFilteredLoans(formattedLoans);
      
      // Set report data from API response
      setReportData({
        totalLoanAmount: response.data.summary.totalLoanAmount,
        totalInterestReceived: response.data.summary.totalInterestReceived,
        totalPrincipalReceived: response.data.summary.totalPrincipalReceived,
        totalAmountReceived: response.data.summary.totalAmountReceived,
        activeLoanCount: response.data.summary.activeLoansCount,
        closedLoanCount: response.data.summary.closedLoansCount
      });

      // console.log("API response:", response.data);
    } catch (err) {
      setError('Failed to fetch loans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchLoans();
  }, []);

  // Handle filter changes
  const handleFilterChange = () => {
    fetchLoans();
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    
    // If already sorting by this key, toggle direction
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Apply sorting to the filtered loans
  useEffect(() => {
    let sortedLoans = [...filteredLoans];
    
    if (sortConfig.key) {
      sortedLoans.sort((a, b) => {
        // Determine which properties to compare based on the key
        let aValue, bValue;
        
        switch(sortConfig.key) {
          case 'date':
            aValue = a.dateObj;
            bValue = b.dateObj;
            break;
          case 'closedDate':
            // Handle null values for closed dates
            if (a.closedDateObj === null && b.closedDateObj === null) return 0;
            if (a.closedDateObj === null) return 1;
            if (b.closedDateObj === null) return -1;
            aValue = a.closedDateObj;
            bValue = b.closedDateObj;
            break;
          case 'billNo':
            aValue = a.billNoInt;
            bValue = b.billNoInt;
            break;
          case 'amount':
            aValue = a.amountValue;
            bValue = b.amountValue;
            break;
          default:
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredLoans(sortedLoans);
  }, [sortConfig]);

  const getSortIndicator = (columnName) => {
    if (sortConfig.key !== columnName) {
      return '⇅';
    }
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const handleViewCustomer = (customerId, customerName, loanId) => {
    setSelectedCustomer({ id: customerId, name: customerName });
    setSelectedLoanId(loanId);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md ml-7">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">View Loans</h1>
        <ExcelExport 
          loans={filteredLoans} 
          filters={{ dateRange, statusFilter, searchQuery }}
          reportData={reportData}
        />
      </div>

      {/* Filters Section */}
      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <div className="flex flex-wrap items-end gap-2">
          {/* Date Range Filter */}
          <div className="flex-1 min-w-0 max-w-xs">
            <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full p-1 text-sm border rounded"
            />
          </div>
          <div className="flex-1 min-w-0 max-w-xs">
            <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full p-1 text-sm border rounded"
            />
          </div>

          {/* Status Filter */}
          <div className="flex-1 min-w-0 max-w-xs">
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-1 text-sm border rounded"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="fortified">Fortified</option>
            </select>
          </div>

          {/* Search Filter */}
          <div className="flex-2 min-w-0 max-w-sm">
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Name or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-1 text-sm border rounded"
            />
          </div>
          
          {/* Apply filters button */}
          <div className="flex-none">
            <button 
              onClick={handleFilterChange}
              className="bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Report Summary</h2>
        <div className="grid grid-cols-3 gap-4 mb-2">
          <div className="p-2 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Total Loan Amount</p>
            <p className="text-lg font-semibold">₹{reportData.totalLoanAmount.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Total Interest Received</p>
            <p className="text-lg font-semibold">₹{reportData.totalInterestReceived.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Total Amount Received</p>
            <p className="text-lg font-semibold">₹{reportData.totalAmountReceived.toLocaleString()}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-2 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Total Principal Received</p>
            <p className="text-lg font-semibold">₹{reportData.totalPrincipalReceived.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Active Loans</p>
            <p className="text-lg font-semibold">{reportData.activeLoanCount}</p>
          </div>
          <div className="p-2 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Closed Loans</p>
            <p className="text-lg font-semibold">{reportData.closedLoanCount}</p>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      {loading ? (
        <div className="text-center py-6">Loading loans...</div>
      ) : error ? (
        <div className="text-center py-6 text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th 
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('billNo')}
                >
                  Bill No {getSortIndicator('billNo')}
                </th>
                <th 
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('customerName')}
                >
                  Customer {getSortIndicator('customerName')}
                </th>
                <th 
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('date')}
                >
                  Date {getSortIndicator('date')}
                </th>
                <th 
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('closedDate')}
                >
                  Closed Date {getSortIndicator('closedDate')}
                </th>
                <th 
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('amount')}
                >
                  Amount {getSortIndicator('amount')}
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-3 py-3 text-center text-sm text-gray-500">No loans found</td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{loan.id}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{loan.billNo}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{loan.customerName}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{loan.date}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {loan.closedDate || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{loan.amount}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${loan.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' :
                            loan.status.toLowerCase() === 'closed' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewCustomer(loan.customerId, loan.customerName, loan.id)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Details Modal */}
      <LoanDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        loanId={selectedLoanId}
      />
    </div>
  );
};

export default ViewLoans;