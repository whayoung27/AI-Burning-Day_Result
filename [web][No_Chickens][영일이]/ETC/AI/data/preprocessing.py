import torchvision
from torchvision import transforms

from torch.utils.data import DataLoader

from matplotlib.pyplot import imshow

trans = transforms.Compose([
    transforms.Resize((256, 256))
])

train_data = torchvision.datasets.ImageFolder(root='./imgs/train', transform=trans)
test_data = torchvision.datasets.ImageFolder(root='./imgs/test', transform=trans)

for num, value in enumerate(train_data):
    data, label = value
    print(num, data, label)

    if (label == 0):
        data.save(f'custom_data/train_data/non-receipt/{num}_{label}.jpeg')
    else:
        data.save(f'custom_data/train_data/receipt/{num}_{label}.jpeg')

for num, value in enumerate(test_data):
    data, label = value
    print(num, data, label)

    if (label == 0):
        data.save(f'custom_data/test_data/non-receipt/{num}_{label}.jpeg')
    else:
        data.save(f'custom_data/test_data/receipt/{num}_{label}.jpeg')
