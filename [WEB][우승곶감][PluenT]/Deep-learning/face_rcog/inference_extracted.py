import copy
import os
import time
import math
import random
import numpy as np
import pandas as pd
from pathlib import Path
import glob
from torch.optim import lr_scheduler
#import matplotlib.pyplot as plt
from PIL import Image, ImageEnhance, ImageOps
import torch.optim as optim
from tqdm import tqdm, tqdm_notebook
import natsort
import torch
from torch import nn, cuda
from torch.autograd import Variable 
import torch.nn.functional as F
import torchvision as vision
import torchvision.models as models
from torchvision import datasets, models, transforms
from torch.utils.data import Dataset, DataLoader
from torch.optim import Adam, SGD, Optimizer
from torch.optim.lr_scheduler import _LRScheduler, CosineAnnealingLR, ReduceLROnPlateau

# global variable
device = torch.device("cuda:0")


def test_model(model_path):
    
    data_transforms = transforms.Compose([
        transforms.Resize([224, 224]),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    data_transforms1 = transforms.Compose([
        transforms.RandomAffine(30,(0.2,0.2),(0.8,1.2)),
        transforms.Resize([224, 224]),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    data_transforms2 = transforms.Compose([
        transforms.RandomVerticalFlip(),
        transforms.Resize([224, 224]),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    data_transforms3 = transforms.Compose([
        transforms.RandomHorizontalFlip(),
        transforms.Resize([224, 224]),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    data_transforms4 = transforms.Compose([
        transforms.RandomRotation(15),
        transforms.Resize([224, 224]),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])


    model_ft = torch.load(model_path, map_location='cuda:0')
    path_test = os.path.join(os.getcwd(), 'test2')
    
    predictions = []
    outputs = []
    count = 0
    count_image = 0
    normal = 0
    anormal = 0


    image_list = natsort.natsorted(os.listdir(path_test))
    count_image = count_image + len(image_list)
    for i, image in enumerate(image_list):
        path_image = os.path.join(path_test, image)
        image_name = image
        image = Image.open(path_image)
        image = image.convert('RGB')
        imgblob = data_transforms(image)

        imgblob.unsqueeze_(dim=0)
        imgblob = Variable(imgblob)

        imgblob = imgblob.cuda(device)

        torch.no_grad()
        output = model_ft(imgblob)

        final = output
        prediction = int(torch.max(final.data, 1)[1].cpu().numpy())
        if prediction ==0 :
            print(f"감정의 동요가 {image_name[6:9]}초에 발견되었습니다.")
        else:
            print(f"평온한 상태입니다.")



test_model('./models/resnet_raf_new1.pth')




