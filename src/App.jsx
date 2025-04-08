import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./Pages/AdminPages/AdminDashboard";
import Login from "./Pages/Login";
import UserDashboard from "./Pages/UserPages/UserDashboard";
function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />
        
        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* User Dashboard - Personalized page for user */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
