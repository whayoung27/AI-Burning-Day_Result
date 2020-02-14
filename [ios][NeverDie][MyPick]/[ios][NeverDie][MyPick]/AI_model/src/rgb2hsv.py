def rgb_to_hsv(r, g, b):
	
  #extract min, max
	r, g, b = r/255, g/255, b/255
	mx = max(r, g, b)
	mn = min(r, g, b)

  #check diff
	df = mx-mn
	
  #convert rgb to hsv channel
	if mx == mn:
		h = 0
	elif mx == r:
		h = (60 * ((g-b)/df) + 360) % 360
	elif mx == g:
		h = (60 * ((b-r)/df) + 120) % 360
	elif mx == b:
		h = (60 * ((r-g)/df) + 240) % 360
	if mx == 0:
		s = 0
	else:
		s = (df/mx)*100
    
	v = mx*100

	return list((h, s, v))