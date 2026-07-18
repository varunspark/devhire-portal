import React, { useEffect, useState } from 'react';
import { getJobs } from '../services/jobService';
import { applyForJob, getMyApplications } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadJobs();
    if (user) loadMyApplications();
  }, [user]);

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMyApplications = async () => {
    try {
      const apps = await getMyApplications();
      setAppliedJobIds(new Set(apps.map(a => a.jobId)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (job) => {
    if (!user) {
      setMessage('Please log in to apply for jobs.');
      return;
    }
    const resumeLink = window.prompt('Paste a link to your resume (Google Drive, Dropbox, etc.):');
    if (!resumeLink) return;
    try {
      await applyForJob(job.id, resumeLink);
      setAppliedJobIds(prev => new Set(prev).add(job.id));
      setMessage(`Applied to ${job.title} successfully!`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not submit application.');
    }
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.companyName?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1>Job Listings</h1>
      <input
        className="search-input"
        placeholder="Search by title, company, or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {message && <div className="alert alert-info">{message}</div>}

      {loading ? (
        <p>Loading jobs...</p>
      ) : filteredJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="job-grid">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onApply={handleApply}
              applied={appliedJobIds.has(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
