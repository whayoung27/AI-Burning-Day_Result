import os
import cv2
import pickle
import numpy as np
import time
import argparse
import logging
# multiple cascades: https://github.com/Itseez/opencv/tree/master/data/haarcascades
# https://github.com/Itseez/opencv/blob/master/data/haarcascades/haarcascade_frontalface_default.xml
# face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
face_cascade = cv2.CascadeClassifier('face_default.xml') # api from open cv
# https://github.com/Itseez/opencv/blob/master/data/haarcascades/haarcascade_eye.xml
eye_cascade = cv2.CascadeClassifier('eye_default.xml')
save_dir = 'test1_1'
# data dir
cap = cv2.VideoCapture('./datas/test1.mp4')
count = 0
#start = time.time()

if not os.path.isdir(save_dir):
    os.mkdir(save_dir)
else:
    pass

# if os.path.file
while 1:
   ret, img = cap.read()
   gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
   # cascase face
   faces = face_cascade.detectMultiScale(gray, 1.3, 5)
   
   for (x, y, w, h) in faces:
       cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
       roi_gray = gray[y:y + h, x:x + w]
       roi_color = img[y:y + h, x:x + w]
       
       img_face = img[y-20:y+h+20,x-20:x+w+20]
       if count % 30 == 0:
           if count ==0:
               pickle.dump(img_face, open(f"{save_dir}/face_{int(count/1)}seconds.npy","wb+"))
               #cv2.imwrite(f"{save_dir}/face_{count/1}seconds.jpg", img_face)
           else:
               pickle.dump(img_face, open(f"{save_dir}/face_{int(count/30)}seconds.npy","wb+"))
               #cv2.imwrite(f"{save_dir}/face_{count/30}seconds.jpg", img_face)
       cv2.imshow('img', img)
       count += 1
   k = cv2.waitKey(30) & 0xff
   if k == 27:
       break

cap.release()
cv2.destroyAllWindows()
end = time.time()
#print(f"TIME {end-start,:.4f}sec")


# if __name__ == '__main__':
#     parser = argparse.ArgumentParser()
#     parser.add