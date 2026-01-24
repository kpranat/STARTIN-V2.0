import React, { useEffect, useState } from 'react';
import StudentNavbar from '../../components/StudentNavbar';
import { api } from '../../services/api';
import { getStudentId } from '../../utils/auth';
import '../../App.css';

interface Application {
  applicationid: number;
  jobid: number;
  jobtitle: string;
  jobtype: string;
  salary: string;
  description: string;
  requirements: string;
  enddate: string;
  companyname: string;
  companyid: number;
  status: string;
}

const StudentAppliedJobs: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const studentId = getStudentId();
      if (!studentId) {
        setError('Student ID not found. Please login again.');
        setIsLoading(false);
        return;
      }

      const response = await api.student.getAppliedJobsDetails({ studentid: parseInt(studentId) });
      
      if (response.data.success) {
        setAppliedJobs(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to fetch applications');
      }
    } catch (err: any) {
      console.error('Error fetching applied jobs:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { bg: '#fef3c7', color: '#92400e' };
      case 'rejected':
        return { bg: '#fee2e2', color: '#991b1b' };
      case 'interview scheduled':
        return { bg: '#d1fae5', color: '#065f46' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <>
      <StudentNavbar />
      <div className="page-container">
        <h1 style={{ textAlign: 'center', marginBottom: '15px' }}>Your Applied Jobs</h1>

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

        {isLoading ? (
          <p style={{textAlign: 'center'}}>Loading applications...</p>
        ) : (
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {appliedJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                <p>You haven't applied to any jobs yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {appliedJobs.map((application) => {
                  const statusStyle = getStatusColor(application.status);
                  return (
                    <div 
                      key={application.applicationid} 
                      style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        padding: '20px',
                        backgroundColor: '#fff'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                        <div>
                          <h3 style={{ margin: '0 0 5px 0', color: '#0f766e' }}>{application.jobtitle}</h3>
                          <p style={{ margin: '0', color: '#666', fontSize: '0.95rem' }}>
                            {application.companyname} • {application.salary}
                          </p>
                        </div>
                        <span 
                          style={{ 
                            padding: '8px 16px',
                            borderRadius: '6px',
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {application.status}
                        </span>
                      </div>
                      
                      <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#555' }}>
                        <p style={{ margin: '5px 0' }}>
                          <strong>Type:</strong> {application.jobtype}
                        </p>
                        <p style={{ margin: '5px 0' }}>
                          <strong>Description:</strong> {application.description}
                        </p>
                        <p style={{ margin: '5px 0' }}>
                          <strong>Requirements:</strong> {application.requirements}
                        </p>
                        <p style={{ margin: '5px 0', color: '#888' }}>
                          <strong>Application Deadline:</strong> {new Date(application.enddate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default StudentAppliedJobs;