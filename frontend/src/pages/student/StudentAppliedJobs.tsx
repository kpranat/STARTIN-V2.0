import React, { useEffect, useState } from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import '../../App.css';

// Note: Backend endpoint to fetch applied jobs is not yet implemented
// Current backend only has the endpoint to submit applications (/get/applicants POST)
// Need backend endpoint like: GET /student/applied-jobs

// Define the Job Type interface
interface Job {
  id: number;
  role: string;
  company: string;
  type: string;
  status: string; // e.g., 'Pending', 'Interview', 'Rejected'
}

const StudentAppliedJobs: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ---------------------------------------------------------
    // TODO: BACKEND INTEGRATION
    // Need to create backend endpoint to fetch student's applied jobs:
    // GET /student/applied-jobs (with student_id from JWT or session)
    // Should join JobApplication, JobDetails, and CompanyProfile tables
    // ---------------------------------------------------------
    // async function fetchAppliedJobs() {
    //   try {
    //     const response = await api.student.getAppliedJobs();
    //     if (response.data.success) {
    //       setAppliedJobs(response.data.data);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching jobs", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
    // fetchAppliedJobs();
    // ---------------------------------------------------------

    // SIMULATION: Hardcoded data for now to show how it looks
    const mockData = [
      { id: 1, role: 'Frontend Intern', company: 'TechCorp', type: 'Remote', status: 'Pending' },
      { id: 4, role: 'Data Analyst', company: 'FinTech Solutions', type: 'On-site', status: 'Interview Scheduled' },
    ];
    
    setTimeout(() => {
      setAppliedJobs(mockData);
      setIsLoading(false);
    }, 500); // Fake delay
  }, []);

  return (
    <>
      <StudentNavbar />
      <div className="page-container">
        <h1 style={{ textAlign: 'center', marginBottom: '15px' }}>Your Applied Jobs</h1>

        <div style={{ 
          textAlign: 'center', 
          marginBottom: '25px', 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          maxWidth: '900px',
          margin: '0 auto 25px'
        }}>
          <p style={{ color: '#856404', fontSize: '0.95rem', margin: 0 }}>
            ⚠️ <strong>Note:</strong> Backend endpoint to fetch applied jobs is not yet implemented. 
            This page shows mock data. Backend needs to create an endpoint to retrieve your applications.
          </p>
        </div>

        {isLoading ? (
          <p style={{textAlign: 'center'}}>Loading applications...</p>
        ) : (
          <div className="jobs-grid">
            {appliedJobs.length === 0 ? (
                <p style={{textAlign:'center', gridColumn: '1/-1'}}>You haven't applied to any jobs yet.</p>
            ) : (
                appliedJobs.map((job) => (
                <div key={job.id} className="job-card">
                    <div className="card-header">
                    <h3 className="job-role">{job.role}</h3>
                    {/* Status Badge */}
                    <span 
                        className="job-type" 
                        style={{ 
                            backgroundColor: job.status === 'Interview Scheduled' ? '#dcfce7' : '#f3f4f6',
                            color: job.status === 'Interview Scheduled' ? '#166534' : '#555' 
                        }}
                    >
                        {job.status}
                    </span>
                    </div>
                    <p className="company-name">{job.company}</p>
                    <p style={{ fontSize: '0.9rem', color: '#777' }}>Type: {job.type}</p>

                    <button className="apply-btn" disabled style={{ backgroundColor: '#666', cursor: 'default' }}>
                        View Status
                    </button>
                </div>
                ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default StudentAppliedJobs;