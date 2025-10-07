import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { toast } from 'react-toastify';

const Navbar = ({ isAdmin, isWorker }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-soft fixed top-0 left-0 right-0 z-50 border-b border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Link to="/" className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-primary-700 tracking-wide hover:text-primary-800 transition-colors">
          <span className="hidden sm:inline">Domestic Services</span>
          <span className="sm:hidden">DS</span>
        </Link>
        {/* Hamburger Icon */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-neutral-200 z-40">
            <div className="flex flex-col space-y-3 p-4 sm:p-6">
              <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span>Home</span>
              </Link>
              <Link to="/about" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                <span>About</span>
              </Link>
              {!isAdmin && (
                <Link to="/services" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  <span>Services</span>
                </Link>
              )}
              {user ? (
                <>
                  {!isAdmin && !isWorker && (
                    <Link to="/bookings" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span>Dashboard</span>
                    </Link>
                  )}
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="bg-gradient-to-r from-primary-500 to-accent-600 text-white px-4 py-2 rounded-lg shadow font-bold hover:from-primary-600 hover:to-accent-700 transition border-2 border-primary-300 flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span>A-Dashboard</span>
                    </Link>
                  )}
                  {isWorker && (
                    <Link to="/worker" onClick={() => setMenuOpen(false)} className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-lg shadow font-bold hover:from-green-600 hover:to-teal-700 transition border-2 border-green-300 flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M9 17H7a4 4 0 01-4-4v-2a4 4 0 014-4h2a4 4 0 014 4v2m0 0v2a4 4 0 01-4 4H7a4 4 0 01-4-4v-2a4 4 0 014-4h2a4 4 0 014 4v2z" /></svg>
                      <span>W-Dashboard</span>
                    </Link>
                  )}
                  <Link to="/contact" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span>Contact</span>
                  </Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 font-semibold shadow-md transition">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/contact" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span>Contact</span>
                  </Link>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                    <span>Login</span>
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/" className="flex items-center space-x-1 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span>Home</span>
          </Link>
          <Link to="/about" className="flex items-center space-x-1 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
            <span>About</span>
          </Link>
          {!isAdmin && (
            <Link to="/services" className="flex items-center space-x-1 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              <span>Services</span>
            </Link>
          )}
          {user ? (
            <>
              {!isAdmin && !isWorker && (
                <Link to="/bookings" className="flex items-center space-x-1 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>Dashboard</span>
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="bg-gradient-to-r from-primary-500 to-accent-600 text-white px-5 py-2 rounded-lg shadow font-bold hover:from-primary-600 hover:to-accent-700 transition border-2 border-primary-300 ml-1 flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>A-Dashboard</span>
                </Link>
              )}
              {isWorker && (
                <Link to="/worker" className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-5 py-2 rounded-lg shadow font-bold hover:from-green-600 hover:to-teal-700 transition border-2 border-green-300 ml-1 flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M9 17H7a4 4 0 01-4-4v-2a4 4 0 014-4h2a4 4 0 014 4v2m0 0v2a4 4 0 01-4 4H7a4 4 0 01-4-4v-2a4 4 0 014-4h2a4 4 0 014 4v2z" /></svg>
                  <span>W-Dashboard</span>
                </Link>
              )}
              <Link to="/contact" className="flex items-center space-x-1 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>Contact</span>
              </Link>
              {/* Profile dropdown */}
              <div className="relative group ml-4">
                <button className="flex items-center px-3 py-1 rounded-full hover:bg-gradient-to-r hover:from-primary-100 hover:to-accent-100 focus:outline-none focus:ring-2 focus:ring-primary-200 transition">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-lg mr-2 shadow-md border-2 border-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-semibold text-primary-700 mr-2">{user.name}</span>
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute right-0 mt-2 w-72 bg-white border border-primary-100 rounded-2xl shadow-medium py-5 px-6 z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-200">
                  <div className="flex flex-col items-center mb-3">
                    <div className="flex flex-col items-center w-full">
                      <div className="relative mb-2">
                        <span className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg border-4 border-white">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                        <span className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow">
                          <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-xl text-primary-800 mb-1">
                        <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {user.name}
                      </div>
                      <div className="text-xs text-neutral-400 mb-2">ID: {user._id}</div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-1 mb-3">
                    <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-primary-50 transition">
                      <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0" /></svg>
                      <span className="font-medium">Email:</span> {user.email}
                    </div>
                    {user.mobile && (
                      <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-primary-50 transition">
                        <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        <span className="font-medium">Mobile:</span> {user.mobile}
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-primary-50 transition">
                        <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 0011.314-11.314l-4.243-4.243a4 4 0 00-5.657 5.657l4.243 4.243z" /></svg>
                        <span className="font-medium">Location:</span> {user.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-primary-50 transition">
                      <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9" /></svg>
                      <span className="font-medium">Role:</span> {user.role}
                    </div>
                    <Link to="/reset-password" className="block w-full text-center bg-gradient-to-r from-accent-400 to-accent-500 text-white py-2 rounded-lg hover:from-accent-500 hover:to-accent-600 font-semibold my-3 shadow-md transition">Reset Password</Link>
                    <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mt-2 w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg hover:from-red-600 hover:to-pink-600 font-semibold shadow-md transition">Logout</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/contact" className="flex items-center space-x-1 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>Contact</span>
              </Link>
              <Link to="/login" className="flex items-center space-x-1 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                <span>Login</span>
              </Link>
              <Link to="/register" className="flex items-center space-x-1 text-primary-600 hover:text-primary-800 transition-colors font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
