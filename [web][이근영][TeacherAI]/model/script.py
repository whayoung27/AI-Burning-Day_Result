from app import db
from datetime import datetime
from .base import Base

class Script(Base):
    __tablename__ = 'script'

    id = db.Column(db.BigInteger, primary_key=True)
    video_id = db.Column(db.BigInteger)
    start_time = db.Column(db.BigInteger)
    end_time = db.Column(db.BigInteger)
    content = db.Column(db.Text)
    
    words = db.Column(db.String(200))
    recommend_lecture = db.Column(db.Text)
    study_content = db.Column(db.Text)
        
        