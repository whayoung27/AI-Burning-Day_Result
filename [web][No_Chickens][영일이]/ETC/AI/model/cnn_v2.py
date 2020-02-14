import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import DataLoader
import torchvision
import torchvision.transforms as transforms
import torch.nn.init


def run():
    torch.multiprocessing.freeze_support()


class CNN_V2(nn.Module):
    def __init__(self):
        super(CNN_V2, self).__init__()
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


if __name__ == '__main__':
    run()

    device = 'cuda' if torch.cuda.is_available() else 'cpu'

    torch.manual_seed(777)
    if device == 'cuda':
        torch.cuda.manual_seed_all(777)

    # dataset
    trans = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    # trans = transforms.Compose([
    #     transforms.ToTensor()
    # ])
    train_data = torchvision.datasets.ImageFolder(root='../data/custom_data/train_data', transform=trans)

    data_loader = DataLoader(dataset=train_data, batch_size=8, shuffle=True, num_workers=2)

    model = CNN_V2().to(device)

    # params
    lr = 0.0005
    training_epochs = 10

    # loss_fn & optimizer
    criterion = nn.CrossEntropyLoss().to(device)
    # criterion = nn.BCEWithLogitsLoss().to(device)

    optimizer = torch.optim.Adam(model.parameters(), lr=lr)

    # training
    total_batch = len(data_loader)

    print("Learning Started")

    for epoch in range(training_epochs):
        avg_cost = 0.0

        for num, data in enumerate(data_loader):
            imgs, labels = data
            imgs = imgs.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            out = model(imgs)
            loss = criterion(out, labels)
            loss.backward()
            optimizer.step()

            avg_cost += loss / total_batch

        print(f'Epoch:{epoch + 1} cost = {avg_cost}')

    print('Learning Finished')
    torch.save(model.state_dict(), "./model_v2.pth")
