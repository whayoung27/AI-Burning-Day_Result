import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import torchvision
import torchvision.transforms as transforms
import torch.nn.init
import visdom


def loss_tracker(loss_plot, loss_value, num):
    '''num & loss value are Tensor'''
    vis.line(X=num, Y=loss_value, win=loss_plot, update='append')


def run():
    torch.multiprocessing.freeze_support()
    # print('loop')


class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        self.layer1 = nn.Sequential(
            nn.Conv2d(3, 6, kernel_size=5, stride=1),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.layer2 = nn.Sequential(
            nn.Conv2d(6, 16, kernel_size=5, stride=1),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.layer3 = nn.Sequential(
            nn.Linear(16 * 29 * 29, 120),
            nn.ReLU(),
            nn.Linear(120, 2)
        )
        # torch.nn.init.xavier_uniform_(self.fc1.weight)
        # torch.nn.init.xavier_uniform_(self.fc2.weight)

    def forward(self, x):
        out = self.layer1(x)
        # print(out.shape)
        out = self.layer2(out)
        # print(out.shape)
        out = out.view(out.shape[0], -1)
        # print(out.shape)
        out = self.layer3(out)
        return out


if __name__ == '__main__':
    run()

    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    if device == 'cuda':
        torch.cuda.manual_seed_all(777)
    torch.manual_seed(777)

    vis = visdom.Visdom()
    vis.close(env='main')

    # dataset
    trans = transforms.Compose([
        transforms.ToTensor()
    ])
    train_data = torchvision.datasets.ImageFolder(root='../data/custom_data/train_data', transform=trans)

    data_loader = DataLoader(dataset=train_data, batch_size=8, shuffle=True, num_workers=2)

    # model parameter test
    model = CNN().to(device)
    # test_input = (torch.Tensor(3, 3, 64, 128)).to(device)
    # test_out = model(test_input)

    # params
    lr = 0.0005
    training_epochs = 30

    criterion = nn.CrossEntropyLoss().to(device)
    optimizer = optim.Adam(model.parameters(), lr=lr)

    # training
    total_batch = len(data_loader)
    print("Learning Started")

    loss_plt = vis.line(Y=torch.Tensor(1).zero_(), opts=dict(title='loss_plot', legend=['loss_train'], showlegend=True))
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
        # 한 에폭당 평균 loss
        loss_tracker(loss_plt, torch.Tensor([avg_cost]), torch.Tensor([epoch]))

    print('Learning Finished')
    torch.save(model.state_dict(), "./model.pth")
