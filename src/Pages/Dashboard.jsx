// Pages/Dashboard.jsx
export default function Dashboard() {
  const loanStats = [
    { title: "New Loans Today", value: "18", color: "bg-indigo-100 text-indigo-800" },
    { title: "Loans Closed Today", value: "12", color: "bg-green-100 text-green-800" },
    { title: "Open Loans", value: "185", color: "bg-blue-100 text-blue-800" },
    { title: "Total Amount Loaned", value: "₹45,78,900", color: "bg-purple-100 text-purple-800" },
    { title: "This Month Interest", value: "₹1,85,400", color: "bg-green-100 text-green-800" },
    { title: "Gold Pawned (gms)", value: "4,582", color: "bg-yellow-100 text-yellow-800" },
    { title: "Silver Pawned (gms)", value: "18,456", color: "bg-gray-100 text-gray-800" },
   
   ];

  return (
    <div className="ml-7">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loanStats.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-lg p-4 shadow`}>
            <p className="text-sm font-medium">{stat.title}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}