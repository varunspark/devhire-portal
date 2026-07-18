import React from 'react';

export default function JobCard({ job, onApply, applied, actions }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        <span className={`badge ${job.active === false ? 'badge-inactive' : 'badge-active'}`}>
          {job.jobType?.replace('_', ' ')}
        </span>
      </div>
      <p className="job-company">{job.companyName} &middot; {job.location || 'Remote'}</p>
      <p className="job-description">{job.description}</p>
      {job.salary != null && <p className="job-salary">${job.salary.toLocaleString()} / year</p>}
      <div className="job-card-footer">
        {onApply && (
          <button className="btn btn-primary" disabled={applied} onClick={() => onApply(job)}>
            {applied ? 'Applied ✓' : 'Apply Now'}
          </button>
        )}
        {actions}
      </div>
    </div>
  );
}
