import React, { useEffect, useState } from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import '../../App.css';

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
    // BACKEND INTEGRATION POINT
    // ---------------------------------------------------------
    // Fetch the list of jobs the logged-in student has applied to.
    // 
    // async function fetchAppliedJobs() {
    //   try {
    //     const response = await axios.get('/api/student/applications');
    //     setAppliedJobs(response.data);
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
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Your Applied Jobs</h1>

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