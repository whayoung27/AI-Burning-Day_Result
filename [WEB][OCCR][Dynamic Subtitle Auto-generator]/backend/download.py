from pytube import YouTube
from capture import capture_image_in_video
import os

def download_from_url(yt_url, filename="workman"):
    yt_filename = filename
    try:
        yt = YouTube(yt_url)
        print(yt.title)
        # print(yt.streams.all())
        yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first().download(filename=yt_filename, output_path='static/')
        capture_image_in_video(f"{yt_filename}.mp4",4)
        return True
    except:
        return False



