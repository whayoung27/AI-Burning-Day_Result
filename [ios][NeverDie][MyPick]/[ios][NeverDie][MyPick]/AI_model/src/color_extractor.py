import cv2
import numpy as np
from matplotlib import pyplot as plt
from rgb2hsv import rgb_to_hsv

def _colorExtractor(img_route, r_x, r_y):

  # color_Range
  color_range_end = [20, 51, 60, 80, 138, 168, 200, 245, 275, 315, 350]

  # load image and convert it to BGR2RGB
  img = cv2.imread(img_route, cv2.IMREAD_COLOR)
  rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
  r, g, b = cv2.split(rgb)

  #check img size
  (height, width) = r.shape

	#convert pixel point rate to coordinate
  c_x = int(height * r_x)
  c_y = int(width * r_y)

  #check the rgb value of the pixel
  pixel_r = r[c_x][c_y]
  pixel_g = g[c_x][c_y]
  pixel_b = b[c_x][c_y]

  # change rgb to hsv
  pixel_h, pixel_s, pixel_v = rgb_to_hsv(pixel_r,pixel_g,pixel_b)

  #check the range
  h_range = pixel_h
  if (pixel_h <= color_range_end[0]) or (pixel_h > color_range_end[10]):
    h_range = 0
  else:
    for i in range(1, 11):
      if pixel_h <= color_range_end[i]:
        h_range = i
        break

  s_range = pixel_s // 25
  if s_range == 4:
    s_range = s_range - 1

  v_range = pixel_v // 25
  if v_range == 4:
    v_range = v_range - 1

  return (h_range, s_range.astype('uint8'), v_range.astype('uint8'))
