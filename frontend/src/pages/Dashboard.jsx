import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyApplications } from '../services/applicationService';

export default function Dashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusCounts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="page-container">
      <h1>Welcome, {user?.username} 👋</h1>
      <p className="text-muted">Here's an overview of your job applications.</p>

      <div className="stats-grid">
        <div className="stat-card"><span className="stat-number">{applications.length}</span><span>Total Applications</span></div>
        <div className="stat-card"><span className="stat-number">{statusCounts.APPLIED || 0}</span><span>Applied</span></div>
        <div className="stat-card"><span className="stat-number">{statusCounts.SHORTLISTED || 0}</span><span>Shortlisted</span></div>
        <div className="stat-card"><span className="stat-number">{statusCounts.HIRED || 0}</span><span>Hired</span></div>
      </div>

      <h2>My Applications</h2>
      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>You haven't applied to any jobs yet. Head over to <a href="/jobs">Job Listings</a>.</p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Job</th><th>Resume</th><th>Status</th><th>Applied On</th></tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td>{app.jobTitle}</td>
                <td><a href={app.resumeLink} target="_blank" rel="noreferrer">View</a></td>
                <td><span className={`status-badge status-${app.status.toLowerCase()}`}>{app.status}</span></td>
                <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
