// CustomerTable.js - Component to display customer data
import React from 'react';

const CustomerTable = ({ filteredCustomers, onEditClick , onViewClick}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Father's Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Address</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredCustomers.length === 0 ? (
            <tr>
              <td colSpan="10" className="px-4 py-4 text-center text-sm text-gray-500">No customers found</td>
            </tr>
          ) : (
            filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{customer.customerID}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{customer.customerName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{customer.fatherName || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{customer.mobileNumber}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{customer.email || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{customer.area || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{customer.address}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => onEditClick(customer)}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    Edit
                  </button><span>    </span>
                  <button 
                    onClick={() => onViewClick(customer)}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    View
                  </button>
                </td>
                
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;