import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Safely get uploadedFilePath
  const user = localStorage.getItem("user");
  const uploaded = user ? JSON.parse(user).uploadedFilePath : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Optional: remove user info on logout
    navigate("/");
  };

  return (
    <nav className="bg-blue-500 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          TIC DS
        </Link>

        {/* Links */}
        <div className="space-x-6">
          <Link to="/" className="hover:text-blue-200 transition">
            Home
          </Link>
          {token && (
            <>
              {!uploaded ? (
                <Link to="/upload" className="hover:text-blue-200 transition">
                  Upload
                </Link>
              ) : (
                <Link to="/upload" className="hover:text-blue-200 transition">
                  ReUpload
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="hover:text-blue-200 transition"
              >
                Logout
              </button>
            </>
          )}
          {!token && (
            <Link to="/login" className="hover:text-blue-200 transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
