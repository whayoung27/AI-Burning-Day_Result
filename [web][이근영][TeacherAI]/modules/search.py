from sqlalchemy import and_,func
from app import *
from utils import *

from model.script import Script
from model.video import Video
from model.pose import Pose
from model.ocr import OCR
from model.face import Face


def get_script_by_search(key) :
	scripts = Script.query.join(Video,Script.video_id==Video.id).add_columns(Video.thumb_nail,Video.title,Script.content,Script.start_time,Script.end_time,Script.video_id).filter(Script.content.like("%"+key+"%")).order_by(func.random()).all()
	return scripts

def get_ocr_by_search(key) :
	ocrs = OCR.query.join(Video,OCR.video_id==Video.id).add_columns(Video.thumb_nail,Video.title,OCR.content,OCR.start_time,OCR.end_time,OCR.video_id).filter(OCR.content.like("%"+key+"%")).order_by(func.random()).all()
	return ocrs