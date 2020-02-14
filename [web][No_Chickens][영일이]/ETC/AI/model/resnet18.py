import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim import lr_scheduler
import numpy as np
import torchvision
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
import ssl

ssl._create_default_https_context = ssl._create_unverified_context


# 학습을 위해 데이터 증가(augmentation) 및 일반화(normalization)
# 검증을 위한 일반화
# data_transforms = {
#     'train': transforms.Compose([
#         transforms.RandomResizedCrop(224),
#         transforms.RandomHorizontalFlip(),
#         transforms.ToTensor(),
#         transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
#     ]),
#     'val': transforms.Compose([
#         transforms.Resize(256),
#         transforms.CenterCrop(224),
#         transforms.ToTensor(),
#         transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
#     ]),
# }
def run():
    torch.multiprocessing.freeze_support()


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

    total_batch = len(data_loader)

    model = models.resnet18(pretrained=True)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 2)
    model = model.to(device)
    # params
    lr = 0.001
    training_epochs = 25

    # loss_fn & optimizer
    criterion = nn.CrossEntropyLoss().to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)

    scheduler = lr_scheduler.StepLR(optimizer, step_size=7, gamma=0.1)

    for epoch in range(training_epochs):
        print('Epoch {}/{}'.format(epoch, training_epochs - 1))
        print('-' * 10)

        avg_cost = 0.0

        # 데이터를 반복
        for num, data in enumerate(data_loader):
            imgs, labels = data
            imgs = imgs.to(device)
            labels = labels.to(device)

            # 매개변수 경사도를 0으로 설정
            optimizer.zero_grad()

            # 순전파
            # 학습 시에만 연산 기록을 추적
            out = model(imgs)
            loss = criterion(out, labels)
            loss.backward()
            optimizer.step()

            # 통계
            avg_cost += loss / total_batch

            scheduler.step()

        print(f'Loss: {avg_cost}')

    torch.save(model.state_dict(), "./model_v3.pth")
