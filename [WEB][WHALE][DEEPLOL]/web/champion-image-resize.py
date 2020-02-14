from PIL import Image
import json

with open('./champions.json') as f:
    data = json.load(f)

items = data['data']
size = 60, 60
for k in items.keys():
    name = items[k]['key'] + '.png'
    i = Image.open('./champion-images/' + name)
    i.thumbnail(size, Image.ANTIALIAS)
    i.save('./resized-champion-images/' + name)
    print(name)
