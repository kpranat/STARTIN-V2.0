from .extensions import db
from datetime import datetime, timedelta, timezone

# ============================== company verification =====================================
class companyVerification(db.Model):
    passkey = db.Column(db.String(500),primary_key = True,nullable = False)
    mailId = db.Column(db.String(500),primary_key = True,nullable = False)
    name= db.Column(db.String(255),nullable = False)
#=============================== admin auth ================================================
class adminAuth(db.Model):
    id = db.Column(db.Integer,primary_key = True,nullable = False)
    mailId = db.Column(db.String(255),nullable = False)
    password = db.Column(db.String(255),nullable = False)
#=============================== univeristy table ==========================================
class universitytable(db.Model):
    id = db.Column(db.Integer,primary_key = True,nullable = False)
    universityName = db.Column(db.String(500),nullable = False)
    passkey = db.Column(db.String(500),nullable = False)
#================================= Student Auth Table ========================================
class studentAuth(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    mailId = db.Column(db.String(100),nullable = False)
    password = db.Column(db.String(500),nullable=False)
    universityid = db.Column(db.Integer,db.ForeignKey("universitytable.id"),nullable = False)
#=============================== OTP Verification Table (for both) ===========================    
class otpVerification(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    otp = db.Column(db.String(6), nullable=False)
    email = db.Column(db.String(255),nullable = False)
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)  # Track when OTP was sent
    universityid = db.Column(db.Integer,db.ForeignKey("universitytable.id"),nullable = False)
    #validate OTP for 10min then invalidate it
    def __init__(self, email, otp):
        self.email = email
        self.otp = otp
        current_time = datetime.now(timezone.utc)
        self.created_at = current_time
        self.expires_at = current_time + timedelta(minutes=10)
#============================= Company Auth Table ======================================
class companyAuth(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    email =db.Column(db.String(255),nullable = False)
    password = db.Column(db.String(255),nullable = False)
    universityid = db.Column(db.Integer,db.ForeignKey("universitytable.id"),nullable = False)
#======================= Company Profile ==============================================
class CompanyProfile (db.Model):
    id = db.Column(db.Integer,primary_key = True)
    name= db.Column(db.String(255),nullable = False)
    website = db.Column(db.String(255),nullable = False)
    location = db.Column(db.String(255),nullable = False)
    about = db.Column(db.Text,nullable = False)
    universityid = db.Column(db.Integer,db.ForeignKey("universitytable.id"),nullable = False)

    jobs = db.relationship(
    "JobDetails",
    backref="company",
    lazy=True,
    cascade="all, delete"
    )
#======================= Student Profile ==============================================
class StudentProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullName = db.Column(db.String(255), nullable=False)
    about = db.Column(db.String(1000), nullable=True)
    skills = db.Column(db.String(500), nullable=True)
    github = db.Column(db.String(255), nullable=True)
    linkedin = db.Column(db.String(255), nullable=True)
    resume = db.Column(db.String(500), nullable=True)  # Store file path or name
    universityid = db.Column(db.Integer,db.ForeignKey("universitytable.id"),nullable = False) 
#===================== Job details ====================================================
class JobDetails(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    title = db.Column(db.String(255),nullable = False)
    type = db.Column(db.String(255),nullable = False)
    salary = db.Column(db.String(255),nullable = False)
    description = db.Column(db.Text,nullable = False)
    requirements = db.Column(db.Text,nullable = False)
    enddate = db.Column(db.DateTime,nullable = False)
    companyid = db.Column(db.Integer,db.ForeignKey("company_profile.id"),nullable = False)
    universityid = db.Column(db.Integer,db.ForeignKey("universitytable.id"),nullable = False)
#======================= job application ============================================
class JobApplication(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    companyid = db.Column(db.Integer,db.ForeignKey("company_profile.id"),nullable = False)
    studentid = db.Column(db.Integer,db.ForeignKey("student_profile.id"),nullable = False)
    jobid = db.Column(db.Integer,db.ForeignKey("job_details.id"),nullable = False)
    status = db.Column(db.String(255),nullable =False,default = "pending")
    universityid = db.Column(db.Integer,db.ForeignKey("universitytable.id"),nullable = False)
    
    # Unique constraint to prevent duplicate applications
    __table_args__ = (db.UniqueConstraint('studentid', 'jobid', name='unique_student_job_application'),)




