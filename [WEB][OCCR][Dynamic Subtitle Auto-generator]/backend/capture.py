import cv2
import os
import time
import math


def capture_image_in_video(video_path:str, divider:int):
    # Read the video from specified path
    cam = cv2.VideoCapture(video_path)

    try:
        # creating a folder named data
        if not os.path.exists('data'):
            os.makedirs('data')

        # if not created then raise error
    except OSError:
        print('Error: Creating directory of data')

    # frame
    currentframe = 0
    current_sec = 0
    frame_per_second = math.ceil(cam.get(cv2.CAP_PROP_FPS))
    fps_div = frame_per_second // divider
    print(f"FPS: {frame_per_second}, {fps_div}")

    # cam.set(cv2.CAP_PROP_FPS, )
    while (True):
        # time.sleep(1) # take schreenshot every 5 seconds
        # reading from frame
        ret, frame = cam.read()
        if ret:
            # if video is still left continue creating images
            # writing the extracted images
            if currentframe % fps_div == 0:  
                name = f'./data/frame_{current_sec}_{currentframe}.jpg'
                print('Creating...' + name)
                cv2.imwrite(name, frame)

            # increasing counter so that it will
            # show how many frames are created
            currentframe += 1
            if currentframe % frame_per_second == 0:
                currentframe = 0
                current_sec += 1
            
        else:
            break

    # Release all space and windows once done
    cam.release()
    cv2.destroyAllWindows()

# capture_image_in_video('./static/workman2.mp4', 3)