// CustomerManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerTable from "../../Components/CustomerTable";
import CustomerEditForm from "./CustomerEditForm";
import CustomerDetails from "./CustomerDetails";
import SearchBox from "../../Components/SearchBox";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        // Fetch customers from the backend API
        const response = await axios.get("http://localhost:5016/api/customers");
        console.log(response.data);
        // Ensure all customers have a name property before sorting
        const customersWithNames = response.data.map(customer => ({
          ...customer,

          name: customer.customerName || "", // Use empty string if name is null/undefined
          fatherName: customer.fatherName || "",
          area: customer.area || "",
          mobileNumber: customer.mobileNumber || ""
        }));
        
        // Sort customers by name
        const sortedCustomers = [...customersWithNames].sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
        
        setCustomers(sortedCustomers);
        setFilteredCustomers(sortedCustomers);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(
        [...customers].sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      );
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        (customer.CustomerName || "").toLowerCase().includes(query) ||
        (customer.area || "").toLowerCase().includes(query) ||
        (customer.mobileNumber || "").includes(query) ||
        (customer.fatherName || "").toLowerCase().includes(query)
    );

    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  useEffect(() => {
    // Add or remove blur class to the main content when edit mode changes
    if (editMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [editMode]);

  const handleEditClick = (customer) => {
    setEditMode(true);
    setCurrentCustomer(customer);
    setViewMode(false);
  };

  const handleViewClick = (customer) => {
    console.log("Viewing customer:", customer); 
    setViewMode(true);
    setCurrentCustomer(customer);
    setEditMode(false);
  };

  const handleSubmit = async (formData) => {
    try {
      // Update customer on the backend
      await axios.put(`http://localhost:5016/api/customers/${formData.id}`, formData);
      
      // Update local state
      const updatedCustomers = customers.map((customer) =>
        customer.id === formData.id ? { ...formData } : customer
      );

      setCustomers(updatedCustomers);
      setEditMode(false);
      setCurrentCustomer(null);
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("Failed to update customer: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setCurrentCustomer(null);
  };

  const handleBack = () => {
    setViewMode(false);
    setCurrentCustomer(null);
  };

  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setEditMode(false);
      setViewMode(false);
    }
  };

  return (
    <div className="relative">
      {!viewMode ? (
        <div
          id="main-content"
          className={`p-4 bg-white rounded-lg shadow-md ${
            editMode ? "blur-sm" : ""
          }`}
        >
          <h1 className="text-xl font-bold mb-4">Customer Management</h1>

          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {loading ? (
            <div className="text-center py-6">Loading customers...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-600">{error}</div>
          ) : (
            <CustomerTable
              filteredCustomers={filteredCustomers}
              onEditClick={handleEditClick}
              onViewClick={handleViewClick}
            />
          )}
        </div>
      ) : (
        <CustomerDetails customer={currentCustomer} onBack={handleBack} />
      )}

      {/* Modal for Edit Form */}
      {editMode && currentCustomer && (
        <div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 modal-overlay backdrop-blur-sm"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Customer</h2>
            </div>
            <CustomerEditForm
              currentCustomer={currentCustomer}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
      {/* Modal for View Details */}
      {viewMode && currentCustomer && (
        <div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 modal-overlay backdrop-blur-sm"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Customer Details</h2>
            </div>
            <CustomerDetails
              customer={currentCustomer}
              onBack={handleBack}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;