import cv2
import os
import sys

def main(video_path, option): #dancing.mp4

    # Read the video from specified path
    cam = cv2.VideoCapture("../video/" + video_path)
#         cam = cv2.VideoCapture("src/main/resources/video/" + video_path)
    fps = round(cam.get(cv2.CAP_PROP_FPS))

    try:
        # creating a folder named data
        if not os.path.exists('../images'):
            os.makedirs('../images')

    # if not created then raise error
    except OSError:
        print ('Error: Creating directory of data')

    # frame
    currentframe = 0


    if option is not "n":
        option = option.split(',')
    i = 0
    flag = True

    while(cam.isOpened()):
        #print(currentframe)
        ret, frame = cam.read()
        if frame is None:
            break

        save = False
        if option is "n":
            if currentframe % fps == 0:
                save = True

        else:
            if flag and currentframe == int(option[i]):
                save = True
                i+=1
                if(i == len(option)):
                    flag = False

        if save:
            # if video is still left continue creating images
            name = '../images/image-frame' + str(currentframe) + '.jpg'
            print(name)
            cv2.imwrite(name, frame)
            currentframe += 1
        else:
            currentframe += 1
            continue




    # Release all space and windows once done
    cam.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
  main(sys.argv[1], sys.argv[2])