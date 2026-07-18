import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-hero">
      <h1>Find your next role with <span>DevHire</span></h1>
      <p>A simple portal connecting developers with great companies.</p>
      <div className="home-actions">
        <Link className="btn btn-primary" to="/jobs">Browse Jobs</Link>
        <Link className="btn btn-outline" to="/register">Get Started</Link>
      </div>
    </div>
  );
}
