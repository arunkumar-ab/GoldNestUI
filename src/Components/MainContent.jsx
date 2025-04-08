// Components/MainContent.jsx
import Dashboard from "../Pages/Dashboard";
import NewLoan from "../Pages/NewLoan";
import CloseLoan from "../Pages/CloseLoan";
import AdminViewLoans from "../Pages/AdminPages/AdminViewLoans";
import CustomerManagement from "../Pages/AdminPages/CustomerManagement";
import Login from "../Pages/Login";
import UserViewLoans from "../Pages/UserPages/UserViewLoan";

export default function MainContent({ currentView }) {
  const renderContent = () => {
    switch (currentView) {
      case "home":
        return <Dashboard />;
      case "newLoan":
        return <NewLoan />;
      case "closeLoan":
        return <CloseLoan />;
      case "userviewLoans":
        return <UserViewLoans/>
      case 'customer':
        return <CustomerManagement/>
      case "adminviewLoans":
        return <AdminViewLoans/>
      default:
        return <Login />;
    }
  };

  return (
    <main className="ml-42 p-6 w-full">
      {renderContent()}
      
    </main>
  );
}