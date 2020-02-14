# -*- coding: utf-8 -*-
__author__ = 'Seran'

import cv2

def framecut():

    videocap = cv2.VideoCapture('./test.mp4') #('/Users/kk/Desktop/baby.mp4')  #경로

    count = 0

    while (videocap.isOpened()):
    
        while (videocap.isOpened()):
            ret, image = videocap.read()
            
                            #프레임 조절 50프레임 마다
            if (int(videocap.get(1)) % 150 == 0):
                print('Saved frame number : ' + str(int(videocap.get(1))))
                cv2.imwrite("./framecut/frame%d.jpg" % count, image)
                print('Saved frame%d.jpg' % count)
                count += 1

        videocap.release()

        return "framecut complete!"
