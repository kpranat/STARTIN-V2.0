import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="container landing-container">
      <h1>Welcome to STARTIN'</h1>
      <p>Are you a Student or a Company?</p>
      
      <div className="selection-box">
        {/* Student Option */}
        <div className="card">
          <h2>Student</h2>
          <p>Find internships & hackathons.</p>
          <div className="btn-group">
            <Link to="/student/login" className="btn">Login</Link>
            <Link to="/student/signup" className="link">Sign Up</Link>
          </div>
        </div>

        {/* Company Option */}
        <div className="card">
          <h2>Company</h2>
          <p>Hire talent & post challenges.</p>
          <div className="btn-group">
            <Link to="/company/login" className="btn">Login</Link>
            <Link to="/company/signup" className="link">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;