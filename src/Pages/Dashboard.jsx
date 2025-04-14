import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    newLoansToday: 0,
    loansClosedToday: 0,
    openLoans: 0,
    totalAmountLoaned: 0,
    thisMonthInterest: 0,
    goldPawnedGrams: 0,
    silverPawnedGrams: 0
  });

  useEffect(() => {
    const fetchLoanStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5016/api/LoanStats");
        setStats({
          newLoansToday: response.data.newLoansToday,
          loansClosedToday: response.data.loansClosedToday,
          openLoans: response.data.openLoans,
          totalAmountLoaned: response.data.totalAmountLoaned,
          thisMonthInterest: response.data.thisMonthInterest,
          goldPawnedGrams: response.data.goldPawnedGrams,
          silverPawnedGrams: response.data.silverPawnedGrams
        });
      } catch (error) {
        console.error("Error fetching loan stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanStats();
  }, []);

  // Format currency for Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace(/^₹/, '₹ ');
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const loanStats = [
    { 
      title: "New Loans Today", 
      value: formatNumber(stats.newLoansToday), 
      color: "bg-indigo-100 text-indigo-800" 
    },
    { 
      title: "Loans Closed Today", 
      value: formatNumber(stats.loansClosedToday), 
      color: "bg-green-100 text-green-800" 
    },
    { 
      title: "Open Loans", 
      value: formatNumber(stats.openLoans), 
      color: "bg-blue-100 text-blue-800" 
    },
    { 
      title: "Total Amount Loaned", 
      value: formatCurrency(stats.totalAmountLoaned), 
      color: "bg-purple-100 text-purple-800" 
    },
    { 
      title: "This Month Interest", 
      value: formatCurrency(stats.thisMonthInterest), 
      color: "bg-green-100 text-green-800" 
    },
    { 
      title: "Gold Pawned (gms)", 
      value: formatNumber(stats.goldPawnedGrams), 
      color: "bg-yellow-100 text-yellow-800" 
    },
    { 
      title: "Silver Pawned (gms)", 
      value: formatNumber(stats.silverPawnedGrams), 
      color: "bg-gray-100 text-gray-800" 
    },
  ];

  return (
    <div className="ml-7">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loanStats.map((stat, index) => (
            <div key={index} className={`${stat.color} rounded-lg p-4 shadow`}>
              <p className="text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}