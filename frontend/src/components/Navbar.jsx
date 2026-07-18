import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">DevHire</Link>
      <div className="navbar-links">
        <Link to="/jobs">Jobs</Link>
        {user && <Link to="/dashboard">Dashboard</Link>}
        {isAdmin && <Link to="/admin">Admin Panel</Link>}
        {user ? (
          <>
            <span className="navbar-user">Hi, {user.username}</span>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
