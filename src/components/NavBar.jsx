import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  const isOnDashboard = location.pathname === '/dashboard';

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-gray-800 text-2xl font-bold hover:text-gray-600 transition duration-150">
            GoodFellas
          </Link>
          
          {/* Mobile view */}
          <div className="md:hidden">
            {token ? (
              <Link
                to={isOnDashboard ? "/" : "/dashboard"}
                className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-150"
              >
                {isOnDashboard ? "Home" : "Dashboard"}
              </Link>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-150">
                  Log In
                </Link>
                <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition duration-150">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Desktop view */}
          <div className="hidden md:flex md:items-center">
            {!token && (
              <div className="flex space-x-4">
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-150">
                  Log In
                </Link>
                <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition duration-150">
                  Sign Up
                </Link>
              </div>
            )}
            {token && (
              <Link
                to={isOnDashboard ? "/" : "/dashboard"}
                className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition duration-150 ml-4"
              >
                {isOnDashboard ? "Home" : "Dashboard"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;