import React from 'react';
import * as XLSX from 'xlsx';

const ExcelExport = ({ loans, filters, reportData }) => {
  const exportToExcel = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Format the loan data for Excel
    const loanData = loans.map((loan, index) => ({
      'S.No': index + 1,
      'ID': loan.id,
      'Bill No': loan.billNo,
      'Customer Name': loan.customerName,
      'Issue Date': loan.date,
      'Closed Date': loan.closedDate || '-',
      'Amount': loan.amount.replace('₹', '').trim(),
      'Status': loan.status,
      'Interest': loan.interest?.replace('₹', '').trim() || '-',
    }));

    // Create a worksheet for loan data
    const loanWorksheet = XLSX.utils.json_to_sheet(loanData);
    
    // Add styles to header row
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center' },
      fill: { fgColor: { rgb: "EEEEEE" } }
    };
    
    // Apply column widths
    const columnWidths = [
      { wch: 5 },  // S.No
      { wch: 8 },  // ID
      { wch: 10 }, // Bill No
      { wch: 25 }, // Customer Name
      { wch: 12 }, // Issue Date
      { wch: 12 }, // Closed Date
      { wch: 12 }, // Amount
      { wch: 10 }, // Status
      { wch: 12 }, // Interest
    ];
    
    loanWorksheet['!cols'] = columnWidths;
    
    // Create a filters worksheet
    const filterData = [
      { 'Filter': 'Date Range', 'Value': `${filters.dateRange.start || 'All'} to ${filters.dateRange.end || 'All'}` },
      { 'Filter': 'Status', 'Value': filters.statusFilter === 'all' ? 'All' : filters.statusFilter },
      { 'Filter': 'Search Query', 'Value': filters.searchQuery || 'None' }
    ];
    
    const filterWorksheet = XLSX.utils.json_to_sheet(filterData);
    
    // Create a summary worksheet
    const summaryData = [
      { 'Metric': 'Total Loan Amount', 'Value': `₹${reportData.totalLoanAmount.toLocaleString()}` },
      { 'Metric': 'Total Principal Received', 'Value': `₹${reportData.totalPrincipalReceived.toLocaleString()}` },
      { 'Metric': 'Total Interest Received', 'Value': `₹${reportData.totalInterestReceived.toLocaleString()}` },
      { 'Metric': 'Total Amount Received', 'Value': `₹${reportData.totalAmountReceived.toLocaleString()}` },
      { 'Metric': 'Active Loans Count', 'Value': reportData.activeLoanCount },
      { 'Metric': 'Closed Loans Count', 'Value': reportData.closedLoanCount }
    ];
    
    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    
    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(workbook, loanWorksheet, 'Loans');
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
    XLSX.utils.book_append_sheet(workbook, filterWorksheet, 'Filters');
    
    // Generate filename with current date
    const date = new Date();
    const dateStr = date.toLocaleDateString('en-GB').replace(/\//g, '-');
    const timeStr = date.toLocaleTimeString('en-GB').replace(/:/g, '-');
    const fileName = `Loans_Report_${dateStr}_${timeStr}.xlsx`;
    
    // Write the workbook and trigger download
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <button
      onClick={exportToExcel}
      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors"
    >
      Export to Excel
    </button>
  );
};

export default ExcelExport;