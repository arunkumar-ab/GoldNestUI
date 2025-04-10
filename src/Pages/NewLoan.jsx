
import { useState, useEffect } from "react";
import axios from "axios";
import CustomerForm from "./NewLoanComponents/CustomerForm";
import LoanDetailsForm from "./NewLoanComponents/LoanDetailsForm";
import PawnedItemsList from "./NewLoanComponents/PawnedItemsList";
import { fetchAllData, calculateTotalAmount, submitLoanData } from "./NewLoanComponents/LoanHelpers";

export default function NewLoan() {
  const [loanData, setLoanData] = useState({
    customerId: 0,
    customerName: "",
    fatherName: "",
    address: "",
    area: "",
    pincode: "",
    phone: "",
    description: "",
    email: "",
    issueDate: new Date().toISOString().split('T')[0],
    interestRate: "",
    billNo: "",
    amountLoaned: "",
    items: [{ itemID: 0, name: "", grossWeight: "", netWeight: "", amount: "", itemType: "gold" }]
  });

  // States for API data
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData(setCustomers, setItems, setLoading, setError);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitLoanData(loanData,customers,setCustomers,setItems);
      alert("Loan created successfully with ID: " + response.data.loanId);
      // Reset form or redirect
      // window.location.href = "/loans";
    } catch (err) {
      console.error("Error creating loan:", err);
      alert("Error creating loan: " + (err.response?.data?.message || err.message));
    }
  };

  const toggleNewCustomer = () => {
    setIsNewCustomer(!isNewCustomer);
  };

  // Form rendering with loading state
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="mt-0 ml-5 p-6 bg-white-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-purple-800">New Loan</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 border border-purple-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CustomerForm 
            loanData={loanData} 
            setLoanData={setLoanData} 
            customers={customers}
            isNewCustomer={isNewCustomer}
            toggleNewCustomer={toggleNewCustomer}
          />

          <div>
            <LoanDetailsForm 
              loanData={loanData} 
              setLoanData={setLoanData} 
            />

            <PawnedItemsList 
              loanData={loanData}
              setLoanData={setLoanData}
              items={items}
            />

            <div className="mt-4 p-3 border border-purple-300 rounded-lg bg-purple-100">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="font-bold text-lg">₹ {calculateTotalAmount(loanData).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 border border-purple-300 rounded-md text-purple-700 hover:bg-purple-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Create Loan
          </button>
        </div>
      </form>
    </div>
  );
}