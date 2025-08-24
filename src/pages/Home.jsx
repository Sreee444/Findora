import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Lost & Found Reporting",
    desc: "Easily report lost or found items and help the community reconnect with their belongings.",
    icon: "🔎",
  },
  {
    title: "Real-time Notifications",
    desc: "Get instant updates when your item is found or when there's a match.",
    icon: "📬",
  },
  {
    title: "Location Tracking",
    desc: "See where items were lost or found on a live campus map.",
    icon: "📍",
  },
  {
    title: "Admin Approval",
    desc: "All submissions are reviewed for safety and accuracy.",
    icon: "🛡️",
  },
];



const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
    <div className="max-w-2xl w-full text-center mb-12">
      {/* Logo Section */}
      <div className="mb-8 flex justify-center">
        <img 
          src="/gotcha-logo-new.png" 
          alt="Gotcha Lost & Found" 
          className="h-20 md:h-24 w-auto object-contain transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            // Fallback if logo doesn't load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <h1 
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text hidden"
          style={{display: 'none'}}
        >
          Gotcha
        </h1>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white"> Lost & Found System </h2>
      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">A modern, secure, and community-driven platform to reunite lost items with their owners.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/lost" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Report Lost Item</Link>
        <Link to="/found" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition">Report Found Item</Link>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
      {features.map((f) => (
        <div key={f.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-start gap-4 hover:shadow-2xl transition">
          <span className="text-3xl md:text-4xl">{f.icon}</span>
          <div className="text-left">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{f.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Home;



