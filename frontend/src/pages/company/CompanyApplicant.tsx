import React, { useState, useEffect } from 'react';
import CompanyNavbar from '../../components/CompanyNavbar';
import { api } from '../../services/api';
import { getCompanyId } from '../../utils/auth';
import '../../App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 

interface Applicant {
  studentid: number;
  name: string;
  about: string;
  skills: string;
  github: string;
  linkedin: string;
  resumename: string;
  resumepath: string;
  status: string;
  jobid: number;
  jobtitle: string;
  applicationid: number;
}

const CompanyApplicants: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get company ID from sessionStorage using the auth utility
      const companyId = getCompanyId();
      
      if (!companyId) {
        setError('Company ID not found. Please login again.');
        setLoading(false);
        return;
      }
      
      const response = await api.company.getApplicants({ compnayid: companyId });
      
      if (response.data.success) {
        // Backend now returns an array of all applicants
        setApplicants(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch applicants');
      }
    } catch (err: any) {
      console.error('Error fetching applicants:', err);
      setError(err.response?.data?.message || 'Failed to load applicants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = (resumePath: string) => {
    if (resumePath) {
      // Construct the full URL to the resume
      const resumeUrl = `${API_BASE_URL}/uploads/resumes/${resumePath}`;
      window.open(resumeUrl, '_blank');
    }
  };

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      const response = await api.company.updateApplicationStatus({
        application_id: applicationId,
        status: newStatus
      });

      if (response.data.success) {
        // Update the local state to reflect the change
        setApplicants(prevApplicants =>
          prevApplicants.map(applicant =>
            applicant.applicationid === applicationId
              ? { ...applicant, status: newStatus }
              : applicant
          )
        );
        alert(response.data.message || 'Status updated successfully!');
      } else {
        alert(response.data.message || 'Failed to update status');
      }
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <CompanyNavbar />
        <div className="page-container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading applicants...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CompanyNavbar />
      <div className="page-container">
        <h1 style={{ textAlign: 'center', marginBottom: '15px', color: '#333' }}>Applicants Dashboard</h1>
        
        {error && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '25px', 
            padding: '15px', 
            backgroundColor: '#fee', 
            borderRadius: '8px',
            maxWidth: '900px',
            margin: '0 auto 25px',
            color: '#c33'
          }}>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        <div className="profile-container" style={{ maxWidth: '1100px', padding: '0' }}>
          {applicants.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {applicants.map((applicant, index) => (
                <div 
                  key={index} 
                  style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    padding: '20px',
                    backgroundColor: '#fff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#0f766e' }}>{applicant.name}</h3>
                      <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>
                        <strong>Applied for:</strong> {applicant.jobtitle}
                      </p>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>About:</strong> {applicant.about || 'N/A'}
                      </p>
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Skills:</strong> {applicant.skills || 'N/A'}
                      </p>
                      <p style={{ margin: '5px 0', color: '#666', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong>Status:</strong>
                        <select
                          value={applicant.status}
                          onChange={(e) => handleStatusChange(applicant.applicationid, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            backgroundColor: 
                              applicant.status === 'pending' ? '#fef3c7' :
                              applicant.status === 'rejected' ? '#fee2e2' :
                              applicant.status === 'interview scheduled' ? '#d1fae5' : '#f3f4f6',
                            color: 
                              applicant.status === 'pending' ? '#92400e' :
                              applicant.status === 'rejected' ? '#991b1b' :
                              applicant.status === 'interview scheduled' ? '#065f46' : '#374151',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                          <option value="interview scheduled">Interview Scheduled</option>
                        </select>
                      </p>
                      
                      <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {applicant.github && (
                          <a 
                            href={applicant.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn"
                            style={{ 
                              padding: '8px 16px', 
                              fontSize: '0.9rem',
                              backgroundColor: '#333',
                              textDecoration: 'none',
                              display: 'inline-block'
                            }}
                          >
                            GitHub
                          </a>
                        )}
                        
                        {applicant.linkedin && (
                          <a 
                            href={applicant.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn"
                            style={{ 
                              padding: '8px 16px', 
                              fontSize: '0.9rem',
                              backgroundColor: '#0077b5',
                              textDecoration: 'none',
                              display: 'inline-block'
                            }}
                          >
                            LinkedIn
                          </a>
                        )}
                        
                        {applicant.resumepath && (
                          <button 
                            className="btn"
                            onClick={() => handleViewResume(applicant.resumepath)}
                            style={{ 
                              padding: '8px 16px', 
                              fontSize: '0.9rem',
                              backgroundColor: '#0f766e'
                            }}
                          >
                            View Resume
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
              No applicants found yet.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyApplicants;