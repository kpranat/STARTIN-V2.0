import React, { useState } from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import '../../App.css'; 

// 1. Define the shape of a Job object
interface Job {
  id: number;
  role: string;
  company: string;
  type: string;
  location: string;
  skills: string[];
}

// 2. Mock Data (The jobs available to apply for)
const MOCK_JOBS: Job[] = [
  { id: 1, role: "Frontend Intern", company: "TechNova", type: "Internship", location: "Remote", skills: ["React", "CSS"] },
  { id: 2, role: "Backend Engineer", company: "DataFlow", type: "Full-time", location: "Bangalore", skills: ["Node.js", "MongoDB"] },
  { id: 3, role: "UI/UX Designer", company: "Creative Minds", type: "Project", location: "Mumbai", skills: ["Figma", "Design"] },
  { id: 4, role: "Data Analyst", company: "FinTech Solutions", type: "Internship", location: "Delhi", skills: ["Python", "SQL"] },
];

const StudentHome: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // 3. State to track which jobs user has clicked "Apply" on
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);

  // 4. Handle Apply Click
  const handleApply = (jobId: number) => {
    if (appliedJobIds.includes(jobId)) return; // Prevent double clicks

    // Add this ID to the list of applied jobs (changes button color)
    setAppliedJobIds([...appliedJobIds, jobId]);

    // Backend Note: In the future, this is where you call axios.post('/api/apply')
    alert("Application submitted successfully!"); 
  };

  // 5. Filter Logic
  const filteredJobs = MOCK_JOBS.filter(job => 
    job.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
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

        {/* Grid of Job Cards */}
        <div className="jobs-grid">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);

            return (
              <div key={job.id} className="job-card">
                
                <div className="card-header">
                  <h3 className="job-role">{job.role}</h3>
                  <span className="job-type">{job.type}</span>
                </div>
                
                <p className="company-name">{job.company} • {job.location}</p>
                
                <div className="skills-container">
                  {job.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>

                {/* Apply Button with visual toggle */}
                <button 
                  onClick={() => handleApply(job.id)}
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
          })}
        </div>

      </div>
    </>
  );
};

export default StudentHome;