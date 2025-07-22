import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">Querify</Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-indigo-200">Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/ask" className="hover:text-indigo-200">Ask Question</Link>
                <Link to="/dashboard" className="hover:text-indigo-200">Dashboard</Link>
              </>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="hover:text-red-300">Logout</button>
            ) : (
              <Link to="/login" className="hover:text-indigo-200">Login</Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 pb-4 space-y-2">
            <Link to="/" className="block hover:text-indigo-200" onClick={toggleMenu}>Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/ask" className="block hover:text-indigo-200" onClick={toggleMenu}>Ask Question</Link>
                <Link to="/dashboard" className="block hover:text-indigo-200" onClick={toggleMenu}>Dashboard</Link>
              </>
            )}
            {isAuthenticated ? (
              <button onClick={() => { toggleMenu(); handleLogout(); }} className="block hover:text-red-300">Logout</button>
            ) : (
              <Link to="/login" className="block hover:text-indigo-200" onClick={toggleMenu}>Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
