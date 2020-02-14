from torch.utils.data import DataLoader
import torchvision
import torchvision.transforms as transforms
import torch.nn.init
from model.cnn import CNN
from model.cnn_v2 import CNN_V2
import visdom

vis = visdom.Visdom()

# vis.text('Hello, World!', env="main")

device = 'cuda' if torch.cuda.is_available() else 'cpu'
# device = 'cpu'

torch.manual_seed(777)
if device == 'cuda':
    torch.cuda.manual_seed_all(777)

# model = CNN().to(device)
# model.load_state_dict(torch.load('./model.pth'))
model_v2 = CNN_V2().to(device)
model_v2.load_state_dict(torch.load('./model_v2.pth'))
# # print(model.layer1[0])
# # print(new_model.layer1[0])
# #
# # print(model.layer1[0].weight[0][0][0])
# # print(new_model.layer1[0].weight[0][0][0])

trans = torchvision.transforms.Compose([
    transforms.ToTensor(),
])
test_data = torchvision.datasets.ImageFolder(root='../data/custom_data/test_data', transform=trans)
test_set = DataLoader(dataset=test_data, batch_size=len(test_data))
# test_set = DataLoader(dataset=test_data)
check_list = []

# test
with torch.no_grad():
    for num, data in enumerate(test_set):
        imgs, label = data

        imgs = imgs.to(device)
        label = label.to(device)

        prediction = model_v2(imgs)

        correct_prediction = torch.argmax(prediction, 1) == label
        check_list = correct_prediction.data.cpu().numpy()
        accuracy = correct_prediction.float().mean()
        print(f'Accuracy:{accuracy.item()}')

# check image on visdom
zero_list = []
for num, value in enumerate(check_list):
    if not value:
        zero_list.append(num)

print(zero_list)
for num, data in enumerate(test_set):
    imgs, label = data
    for idx, img in enumerate(imgs):
        if idx in zero_list:
            print(idx)
            vis.images(img, env='main')
