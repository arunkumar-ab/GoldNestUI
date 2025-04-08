import { useState } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import MainContent from "../../Components/MainContent";

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState("home");

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-grey-100 text-gray-800">
      <Header />
      <div className="flex pt-10">
        <Sidebar handleViewChange={handleViewChange} isUserDashboard={false} />
        <MainContent currentView={currentView} handleViewChange={handleViewChange} />
      </div>
    </div>
  );
}