

from sqlalchemy import and_
from app import *
from utils import *

from model.script import Script
from model.video import Video
from model.pose import Pose
from model.ocr import OCR
from model.face import Face

def get_script_by_video_id(id) :
	return Script.query.filter(Script.video_id==id).order_by(Script.start_time).all()

def get_ocr_by_video_id(id) :
	return OCR.query.filter(OCR.video_id==id).order_by(OCR.start_time).all()

def get_pose_by_video_id(id) :
	return Pose.query.filter(Pose.video_id==id).order_by(Pose.start_time).all()

def get_face_by_video_id(id) :
	return Face.query.filter(Face.video_id==id).order_by(Face.start_time).all()

def get_video_by_id(id) :
	return Video.query.filter(Video.id==id).one()

def process_faces(face) :
	l = []

	action = ""
	for f in face :
		if len(f.label) == 0 or action == f.label :
			l.append(["",f.start_time])
		else :
			l.append([f.label,f.start_time])

		if len(f.label) > 0 :
			action = f.label

	return l

def get_videos() :
	return Video.query.all()

