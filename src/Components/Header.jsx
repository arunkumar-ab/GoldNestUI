// Components/Header.jsx
import { useState } from "react";
import { Gem, Bell, Search, User, Settings, LogOut } from "lucide-react";

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-100 to-white h-16 z-10 shadow-sm">
      <div className="flex justify-between items-center h-full px-6">
        <div className="flex items-center">
          <Gem className="text-purple-600 h-6 w-6 mr-2" />
          <div className="text-xl font-semibold text-gray-800">Jewels Loan System</div>
        </div>
        
        
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-purple-100 relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <div
              className="h-10 w-10 bg-purple-200 rounded-full flex items-center justify-center cursor-pointer border-2 border-purple-300"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <User size={18} className="text-purple-800" />
            </div>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                  <User size={16} className="mr-2" />
                  Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                  <Settings size={16} className="mr-2" />
                  Settings
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
