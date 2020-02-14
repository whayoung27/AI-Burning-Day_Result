# -*- coding: utf-8 -*-
from flask import Flask, render_template, current_app, url_for, g, session, redirect, make_response, request,Blueprint
import os
import utils
import json


from modules.video import *
from modules.search import *

import config
import base64

blueprint = Blueprint('main', __name__)


@blueprint.route("/")
@blueprint.route("/main")
def main() :
	
	videos = get_videos()
	return render_template("index.html",videos=videos,seconds_to_time=utils.seconds_to_time)


@blueprint.route("/video/<id>")
def video_page(id) :

	video = get_video_by_id(int(id))
	script = get_script_by_video_id(int(id))
	ocr = get_ocr_by_video_id(int(id))
	pose = get_pose_by_video_id(int(id))
	face = get_face_by_video_id(int(id))
	face = process_faces(face)

	start_time = None
	if "start_time" in request.args :
		start_time = request.args["start_time"]

	return render_template("video.html",video=video,script=script,ocr=ocr,pose=pose,face=face,
		seconds_to_time=utils.seconds_to_time,int=int,start_time=start_time,len=len)

@blueprint.route("/search")
def search_page() :
	key = request.args["key"]

	scripts = get_script_by_search(key)
	ocr = get_ocr_by_search(key)

	return render_template("search.html",scripts=scripts,ocr=ocr,key=key,int=int,seconds_to_time=utils.seconds_to_time)









