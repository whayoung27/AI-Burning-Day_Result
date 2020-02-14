import requests
import pickle
import natsort

# file 보냄 

resp = requests.post('http://192.168.110.16:6006/predict',
                     files={"file":open('./test1_1/face_0seconds.npy','rb')},json={'time':'0'})
print(resp.text)