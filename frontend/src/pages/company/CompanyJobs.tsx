import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyNavbar from '../../components/CompanyNavbar';
import { api } from '../../services/api';
import { getCompanyId } from '../../utils/auth';
import '../../App.css';

interface Job {
  id: number;
  title: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
  enddate: string;
  status: string;
}

const CompanyJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const companyId = getCompanyId();
        
        if (!companyId) {
          setError('Company ID not found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await api.company.getJobs({ company_id: companyId });
        
        if (response.data.success) {
          setJobs(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load jobs');
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <CompanyNavbar />
      <div className="page-container">
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#0f766e' }}>
          Your Posted Jobs
        </h1>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading jobs...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="jobs-grid">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="card-header">
                    <h3 className="job-role">{job.title}</h3>
                    <span 
                      className="job-type" 
                      style={{
                        backgroundColor: job.status === 'Active' ? '#dcfce7' : '#fee2e2',
                        color: job.status === 'Active' ? '#166534' : '#991b1b'
                      }}
                    >
                      {job.status}
                    </span>
                  </div>

                  <p className="company-name">{job.type} • {job.salary}</p>

                  <div style={{ margin: '1rem 0', fontSize: '0.9rem', color: '#666' }}>
                    <p><strong>Description:</strong> {job.description}</p>
                    <p><strong>Requirements:</strong> {job.requirements}</p>
                    <p><strong>Application Deadline:</strong> {new Date(job.enddate).toLocaleDateString()}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="apply-btn"
                      style={{ 
                        backgroundColor: '#0f766e',
                        flex: 1
                      }}
                      onClick={() => navigate('/company/applicants', { state: { jobId: job.id } })}
                    >
                      View Applicants
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
                <p>You haven't posted any jobs yet.</p>
                <button 
                  className="btn-save"
                  style={{ 
                    marginTop: '1rem',
                    backgroundColor: '#0f766e',
                    padding: '10px 20px'
                  }}
                  onClick={() => navigate('/company/post-job')}
                >
                  Post Your First Job
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CompanyJobs;
