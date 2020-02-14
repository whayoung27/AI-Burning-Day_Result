from app import db
from datetime import datetime
from .base import Base

class Video(Base):
    __tablename__ = 'video'

    id = db.Column(db.BigInteger, primary_key=True)
    title = db.Column(db.String(255))
    filename = db.Column(db.String(200))
    teacher = db.Column(db.String(50))
    thumb_nail = db.Column(db.String(255))
    length = db.Column(db.Integer)
    
        
        