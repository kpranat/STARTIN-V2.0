import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// General Pages
import UniversitySelect from './pages/UniversitySelect';
import Landing from './pages/Landing';

// Auth Pages
import StudentLogin from './pages/StudentLogin';
import StudentSignup from './pages/StudentSignup';
import CompanyLogin from './pages/CompanyLogin';
import CompanySignup from './pages/CompanySignup';

// Student Dashboard Pages
import StudentProfile from './pages/student/StudentProfile';
import StudentHome from './pages/student/StudentHome';         // The Job Discovery Page
import StudentAppliedJobs from './pages/student/StudentAppliedJobs'; // The "Applied Jobs" Page

// COMPANY PAGES
import CompanyProfile from './pages/company/CompanyProfile';
import CompanyPostJob from './pages/company/CompanyPostJob';
import CompanyApplicants from './pages/company/CompanyApplicant';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Step 1: Select University */}
          <Route path="/" element={<UniversitySelect />} />

          {/* Step 2: Choose Role (Student vs Company) */}
          <Route path="/role-selection" element={<Landing />} />

          {/* Step 3: Auth Flows */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/company/signup" element={<CompanySignup />} />

          {/* Step 4: Student Dashboard (Post-Login) - PROTECTED ROUTES */}
          
          {/* HOME -> Shows Job Discovery Board */}
          <Route 
            path="/student/home" 
            element={
              <ProtectedRoute redirectTo="/student/login">
                <StudentHome />
              </ProtectedRoute>
            } 
          />

          {/* APPLIED JOBS -> Shows list of applied jobs */}
          <Route 
            path="/student/applied-jobs" 
            element={
              <ProtectedRoute redirectTo="/student/login">
                <StudentAppliedJobs />
              </ProtectedRoute>
            } 
          />

          {/* PROFILE -> Edit/View Profile */}
          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute redirectTo="/student/login">
                <StudentProfile />
              </ProtectedRoute>
            } 
          />

          {/* COMPANY DASHBOARD ROUTES - PROTECTED */}
          <Route 
            path="/company/profile" 
            element={
              <ProtectedRoute redirectTo="/company/login">
                <CompanyProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/post-job" 
            element={
              <ProtectedRoute redirectTo="/company/login">
                <CompanyPostJob />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/applicants" 
            element={
              <ProtectedRoute redirectTo="/company/login">
                <CompanyApplicants />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect /company/home to profile for now */}
          <Route 
            path="/company/home" 
            element={
              <ProtectedRoute redirectTo="/company/login">
                <CompanyProfile />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;