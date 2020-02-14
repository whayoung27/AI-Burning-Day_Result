import io
import os
import json
import pickle
import re
import torch
from torch.autograd import Variable 
import torchvision.transforms as transforms
from PIL import Image
from flask import Flask, jsonify, request
app = Flask(__name__)
# image list file 
#path_test = os.path.join(os.getcwd(), 'test1_1')
class_idx = {0 : 'abnormal', 1: 'normal'}
# model inference 
device = torch.device("cuda" if torch.cuda.is_available() else 'cpu')
model_path = './models/resnet_raf_new1.pth' 
model_ft = torch.load(model_path, map_location='cuda' if torch.cuda.is_available() else 'cpu') 
model_ft.eval()

def transform_image(image_byte):
    data_transforms = transforms.Compose([
        transforms.Resize([224, 224]),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    #image = Image.open(image_byte)
    image = Image.fromarray(image_byte, 'RGB')
    #image = image.convert('RGB')
    imgblob = data_transforms(image)
    imgblob.unsqueeze_(dim=0)
    imgblob = Variable(imgblob)
    imgblob = imgblob.cuda(device)
    return imgblob
def get_prediction(image_byte):
    tensor = transform_image(image_byte)
    outputs = model_ft.forward(tensor)
    final = outputs
    prediction = int(torch.max(final.data, 1)[1].cpu().numpy())
    return prediction
@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        # 요청에서 파일을 읽도록 함.
        file = request.files['file']
        time = request.json['time']
        print(time)
        time = int(time)
        #time = int(re.findall('\d+', name)[0])
        img_bytes = pickle.load(file)
        #img_bytes = file.read() # obj return 
        prediction = get_prediction(image_byte=img_bytes)
        return jsonify({'class_id': prediction, 'class_name': class_idx[prediction], 'time':time})
if __name__ == '__main__':
    app.run(host='0.0.0.0', port='6006', debug=False)
    #app.run()