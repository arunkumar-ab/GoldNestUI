import { useState } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import MainContent from "../../Components/MainContent";

export default function UserDashboard() {
  const [currentView, setCurrentView] = useState("userviewLoans");

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <div className="flex pt-16">
        <Sidebar handleViewChange={handleViewChange} isUserDashboard={true} />
        <MainContent currentView={currentView} handleViewChange={handleViewChange} />
      </div>
    </div>
  );
}