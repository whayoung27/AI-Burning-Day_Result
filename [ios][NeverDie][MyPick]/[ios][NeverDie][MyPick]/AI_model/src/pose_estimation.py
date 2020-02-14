import os
import sys
import requests
import ast
import cv2

def _poseEstimation(img_route, x1, x2, y1, y2):

  #key
  client_id = "l5txm7bgmd"
  client_secret = "IJICvD902TboRCYQQ9stdiUCsQm8jAiC6tmMwQUp"

  #read image
  img = cv2.imread(img_route, cv2.IMREAD_COLOR)
  #check size of the image
  (height, width, channel) = img.shape

  #convert it in rate
  x1 = x1/width
  x2 = x2/width
  y1 = y1/height
  y2 = y2/height

  #pose estimation
  url = "https://naveropenapi.apigw.ntruss.com/vision-pose/v1/estimate"
  files  = {'image':  open(img_route, 'rb')}
  headers = {'X-NCP-APIGW-API-KEY-ID': client_id, 'X-NCP-APIGW-API-KEY': client_secret }
  response = requests.post(url, files=files, headers=headers)
  rescode = response.status_code
  if(rescode!=200):
      print("Error Code:" + str(rescode))
      return (-1, -1)

  #text to dictionary
  res_dict = ast.literal_eval(response.text)

  #chech the bounding box
  for i in res_dict["predictions"]:
    if '0' in i:
      if i['0']['x'] <= x2 and i['0']['x'] >= x1 and i['0']['y'] <= y2 and i['0']['y'] >= y1:
        #this person is right
        if '2' in i:
          s_x = i['2']['x']
          s_y = i['2']['y']
          return (s_x, s_y)

  return (-1, -1)
