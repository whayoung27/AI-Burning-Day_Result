import torch
import torch.nn as nn
import torch.nn.init
import torchvision
from torchvision import models
import torchvision.transforms as transforms
import torch.nn.init
from PIL import Image

class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        self.layer1 = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.layer2 = nn.Sequential(
            nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.layer3 = nn.Sequential(
            nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )

        self.fc1 = nn.Linear(32 * 32 * 128, 625)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(625, 2, bias=True)
        torch.nn.init.xavier_uniform_(self.fc1.weight)
        torch.nn.init.xavier_uniform_(self.fc2.weight)

    def forward(self, x):
        out = self.layer1(x)
        out = self.layer2(out)
        # print(out.shape)
        out = self.layer3(out)
        # print(out.shape)
        out = out.view(out.size(0), -1)
        out = self.fc1(out)
        out = self.relu(out)
        out = self.fc2(out)
        return out


device = 'cuda' if torch.cuda.is_available() else 'cpu'
# device = 'cpu'

torch.manual_seed(777)
if device == 'cuda':
    torch.cuda.manual_seed_all(777)

def is_receipt(img_file):
    model_v2 = CNN().to(device)
    model_v2.load_state_dict(torch.load('./static/model_v2.pth'))

    img = Image.open(img_file)
    
    # img = Image.open("./static/imgs/3.png")
    # png to jpg
    img = img.convert('RGB')

    resize = transforms.Resize([256, 256])
    img = resize(img)
    totensor = transforms.ToTensor()
    img = totensor(img).unsqueeze(0).to(device)
    img.shape
    # test
    with torch.no_grad():
        prediction = model_v2(img)
        prediction_value = torch.argmax(prediction, 1)
        value = prediction_value.data.cpu().numpy()[0]

    return value

# print(is_receipt())