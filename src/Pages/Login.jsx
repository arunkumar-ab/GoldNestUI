import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gem } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Temporary direct navigation for demo purposes
    navigate("/admin-dashboard");
    
    // Commented API call logic for future implementation
    // try {
    //   const response = await axios.post("http://localhost:8080/api/login", {
    //     email,
    //     password,
    //   });

    //   if (response.data && response.data.role) {
    //     // Navigate to user or admin dashboard based on the role
    //     if (response.data.role === "admin") {
    //       navigate("/admin-dashboard");
    //     } else if (response.data.role === "user") {
    //       navigate("/user-dashboard");
    //     }
    //   }
    // } catch (err) {
    //   setError("Invalid credentials or an error occurred. Please try again.");
    // }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-50">
      <div className="max-w-md w-full px-6 py-8">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-6">
          <div className="bg-purple-600 p-3 rounded-full">
            <Gem size={32} className="text-white" />
          </div>
        </div>
        
        {/* Login Box */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-purple-100">
          <h2 className="text-purple-800 text-2xl font-semibold text-center mb-6">Welcome Back</h2>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                className="w-full p-3 rounded-lg border"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full p-3 rounded-lg border "
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-6">
              <Link to="/forgot-password" className="text-purple-600 hover:text-purple-800 text-sm">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors font-medium"
            >
              Sign In
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
}