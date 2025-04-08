import React, { useState, useEffect } from 'react';

const ViewLoans = () => {
  // State for loans and filtering
  const [loans, setLoans] = useState(sampleLoans); // Using sample data
  const [filteredLoans, setFilteredLoans] = useState(sampleLoans);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State for filters
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // State for report data
  const [reportData, setReportData] = useState({
    totalLoanAmount: 0,
    totalInterestEarned: 0,
    totalAmountReceived: 0,
  });

  // Fetch loans on component mount
  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        // Simulate API call with sample data
        const response = await new Promise((resolve) =>
          setTimeout(() => resolve({ data: sampleLoans }), 1000)
        );
        setLoans(response.data);
        setFilteredLoans(response.data);
      } catch (err) {
        setError('Failed to fetch loans');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Calculate the number of months between two dates (rounded up)
  const calculateMonths = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    // Round up if there are additional days
    if (end.getDate() > start.getDate()) {
      return months + 1;
    }
    return months;
  };

  // Apply filters and calculate report data when filter state changes
  useEffect(() => {
    let result = loans;

    // Apply date filter
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include the entire end day

      result = result.filter((loan) => {
        const loanDate = new Date(loan.date);
        return loanDate >= startDate && loanDate <= endDate;
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(
        (loan) => loan.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (loan) =>
          loan.customerName.toLowerCase().includes(query) ||
          loan.id.toLowerCase().includes(query)
      );
    }

    setFilteredLoans(result);

    // Calculate report data for closed loans within the date range
    const closedLoans = result.filter((loan) => loan.status.toLowerCase() === 'closed');
    const totalLoanAmount = closedLoans.reduce(
      (sum, loan) => sum + parseFloat(loan.amount.replace(/[^0-9.-]+/g, '')),
      0
    );

    // Calculate total interest earned
    const totalInterestEarned = closedLoans.reduce((sum, loan) => {
      const months = calculateMonths(loan.date, loan.closedDate || new Date());
      const interest = parseFloat(loan.amount.replace(/[^0-9.-]+/g, '')) * months * 0.01;
      return sum + interest;
    }, 0);

    const totalAmountReceived = totalLoanAmount + totalInterestEarned;

    setReportData({ totalLoanAmount, totalInterestEarned, totalAmountReceived });
  }, [loans, dateRange, statusFilter, searchQuery]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md ml-7">
      <h1 className="text-xl font-bold mb-4">View Loans</h1>

      {/* Compact Filters Section */}
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Closed Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500">No loans found</td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{loan.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{loan.customerName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{loan.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {loan.status === 'Closed' ? loan.closedDate : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{loan.amount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${loan.status === 'Active' ? 'bg-green-100 text-green-800' :
                            loan.status === 'Closed' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewCustomer(loan.customerId, loan.customerName)}
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
    </div>
  );
};

// Sample data for demonstration
const sampleLoans = [
  {
    id: 'A0001',
    customerId: 'C1001',
    customerName: 'Rajesh Kumar',
    date: '2025-03-01',
    closedDate: '2025-04-15', // Example closed date
    amount: '₹25,000',
    status: 'Closed',
  },
  {
    id: 'A0002',
    customerId: 'C1002',
    customerName: 'Priya Sharma',
    date: '2025-02-15',
    closedDate: '', // Open loan, no closed date
    amount: '₹35,000',
    status: 'Active',
  },
  {
    id: 'A0003',
    customerId: 'C1003',
    customerName: 'Amit Patel',
    date: '2025-01-20',
    closedDate: '2025-03-25', // Example closed date
    amount: '₹15,000',
    status: 'Closed',
  },
  {
    id: 'A0004',
    customerId: 'C1001',
    customerName: 'Rajesh Kumar',
    date: '2024-12-10',
    closedDate: '', // Open loan, no closed date
    amount: '₹40,000',
    status: 'Fortified',
  },
];

export default ViewLoans;