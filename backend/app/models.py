from .extensions import db

class studentAuth(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    mailId = db.Column(db.String(100),nullable = False)
    password = db.Column(db.String(500),nullable=False)
    