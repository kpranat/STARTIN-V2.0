import React, { useState, useEffect } from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import { api } from '../../services/api';
import { getStudentId } from '../../utils/auth';
import '../../App.css'; 

// 1. Define the shape of a Job object to match backend response
interface Job {
  id: number;
  title: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
  enddate: string;
  companyname: string;
  companyid: number;
}

const StudentHome: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 3. State to track which jobs user has clicked "Apply" on
  // Load from localStorage to persist across page reloads
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>(() => {
    const studentId = getStudentId();
    const stored = localStorage.getItem(`appliedJobs_${studentId}`);
    return stored ? JSON.parse(stored) : [];
  });

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await api.student.getJobs();
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

  // 4. Handle Apply Click - Now connects to backend
  const handleApply = async (job: Job) => {
    if (appliedJobIds.includes(job.id)) return; // Prevent double clicks

    try {
      const studentId = getStudentId();
      if (!studentId) {
        alert('Please login again to apply for jobs.');
        return;
      }

      const response = await api.student.applyJob({
        studentid: parseInt(studentId),
        companyid: job.companyid,
        jobid: job.id
      });

      if (response.data.success) {
        // Add this ID to the list of applied jobs (changes button color)
        const newAppliedIds = [...appliedJobIds, job.id];
        setAppliedJobIds(newAppliedIds);
        
        // Persist to localStorage
        localStorage.setItem(`appliedJobs_${studentId}`, JSON.stringify(newAppliedIds));
        
        alert(response.data.message || 'Application submitted successfully!');
      } else {
        alert(response.data.message || 'Failed to submit application. Please try again.');
      }
    } catch (err: any) {
      console.error('Error applying for job:', err);
      // Check if it's a duplicate application error
      if (err.response?.data?.message === 'You have already applied to this job') {
        alert('You have already applied to this job.');
        // Add to local state to reflect the applied status
        const studentId = getStudentId();
        const newAppliedIds = [...appliedJobIds, job.id];
        setAppliedJobIds(newAppliedIds);
        if (studentId) {
          localStorage.setItem(`appliedJobs_${studentId}`, JSON.stringify(newAppliedIds));
        }
      } else {
        alert('Failed to submit application. Please try again.');
      }
    }
  };

  // 5. Filter Logic
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.companyname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <StudentNavbar />
      <div className="page-container">
        
        {/* Header Section */}
        <div className="header-section">
          <h1>Find Your Next Opportunity</h1>
          <p>Browse internships and projects tailored for students.</p>
          
          <div className="search-box">
            <input 
              type="text" 
              className="search-input"
              placeholder="Search roles or companies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading jobs...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-container" style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            <p>{error}</p>
          </div>
        )}

        {/* Grid of Job Cards */}
        {!loading && !error && (
          <div className="jobs-grid">
            {filteredJobs.length > 0 ? filteredJobs.map((job) => {
              const isApplied = appliedJobIds.includes(job.id);

              return (
                <div key={job.id} className="job-card">
                  
                  <div className="card-header">
                    <h3 className="job-role">{job.title}</h3>
                    <span className="job-type">{job.type}</span>
                  </div>
                  
                  <p className="company-name">{job.companyname} • {job.salary}</p>
                  
                  <div className="job-description" style={{ margin: '1rem 0', fontSize: '0.9rem', color: '#666' }}>
                    <p><strong>Description:</strong> {job.description}</p>
                    <p><strong>Requirements:</strong> {job.requirements}</p>
                    <p><strong>Application Deadline:</strong> {new Date(job.enddate).toLocaleDateString()}</p>
                  </div>

                  {/* Apply Button with visual toggle */}
                  <button 
                    onClick={() => handleApply(job)}
                    className="apply-btn"
                    disabled={isApplied}
                    style={{ 
                      backgroundColor: isApplied ? '#cccccc' : '', // Turn gray if applied
                      cursor: isApplied ? 'default' : 'pointer'
                    }}
                  >
                    {isApplied ? 'Applied ✅' : 'Apply Now'}
                  </button>
                </div>
              );
            }) : (
              <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
                <p>No jobs available at the moment. Please check back later!</p>
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
};

export default StudentHome;