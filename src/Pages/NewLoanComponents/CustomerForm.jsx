import { useState } from "react";

export default function CustomerForm({ loanData, setLoanData, customers = [] }) {
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoanData({
      ...loanData,
      [name]: value,
      // Reset customerID if manually editing name
      customerID: name === "customerName" ? 0 : loanData.customerID
    });

    if (name === "customerName") {
      const filtered = customers.filter(customer => 
        customer.customerName.toLowerCase().includes(value.toLowerCase())
      );
      
      setFilteredCustomers(filtered);
      setShowCustomerSuggestions(value.length > 0 && filtered.length > 0);
      // setIsExistingCustomer(false); // Assume new customer when typing
    }
  };

  const selectCustomer = (customer) => {
    setLoanData({
      ...loanData,
      customerID: customer.customerID,
      customerName: customer.customerName,
      fatherName: customer.fatherName,
      address: customer.address || "",
      pincode: customer.pincode || "",
      phone: customer.mobileNumber || "",
      email: customer.email || "",
      area: customer.area || ""
    });
    setShowCustomerSuggestions(false);
    // setIsExistingCustomer(true);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-purple-700">Customer Information</h2>
      
      <div className="mb-4 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
        <input
          type="text"
          name="customerName"
          value={loanData.customerName}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          placeholder="Search or enter new customer"
        />
        {showCustomerSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-purple-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.customerID}
                className="p-2 hover:bg-purple-50 cursor-pointer"
                onClick={() => selectCustomer(customer)}
              >
                <div className="font-medium">{customer.customerName}</div>
                <div className="text-sm text-gray-500">
                  {customer.fatherName}, {customer.mobileNumber || "No phone"}, 
                  {customer.address ? customer.address.split(',').pop().trim() : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
        <input
          type="text"
          name="fatherName"
          value={loanData.fatherName}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          placeholder="Enter father's name"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea
          name="address"
          value={loanData.address}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          placeholder="Enter address"
          rows="3"
          required
        ></textarea>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
          <input
            type="text"
            name="area"
            value={loanData.area}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter area"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={loanData.pincode}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter pincode"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={loanData.phone}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter phone number"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={loanData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter email"
          />
        </div>
      </div>
    </div>
  );
}