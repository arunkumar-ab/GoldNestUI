// Components/Sidebar.jsx
import { Gem, DollarSign, Users, HomeIcon, XCircle, ClipboardList } from "lucide-react";

export default function Sidebar({ handleViewChange, isUserDashboard }) {
  const userMenuItems = [
    { id: "newLoan", label: "New Loan", icon: <DollarSign size={18} /> },
    { id: "closeLoan", label: "Close Loan", icon: <XCircle size={18} /> },
    { id: "userviewLoans", label: "View Loans", icon: <ClipboardList size={18} /> },
  ];

  const adminMenuItems = [
    { id: "home", label: "Dashboard", icon: <HomeIcon size={18} /> },
    { id: "newLoan", label: "New Loan", icon: <DollarSign size={18} /> },
    { id: "closeLoan", label: "Close Loan", icon: <XCircle size={18} /> },
    { id: "adminviewLoans", label: "View Loans", icon: <ClipboardList size={18} /> },
    { id: "customer", label: "Customers", icon: <Users size={18} /> },
  ];

  const menuItems = isUserDashboard ? userMenuItems : adminMenuItems;

  return (
    <div className="fixed top-16 left-0 h-full w-50 bg-purple-100 bg-opacity-90 p-4 shadow-md border-r border-purple-100">

      <ul className="mt-4 space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className="p-3 hover:bg-purple-100 rounded-lg cursor-pointer transition-all flex items-center text-gray-700 hover:text-purple-800"
            onClick={() => handleViewChange(item.id)}
          >
            <span className="mr-3 text-purple-600">{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}