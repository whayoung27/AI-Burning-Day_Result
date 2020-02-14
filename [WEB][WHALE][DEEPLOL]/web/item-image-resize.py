from PIL import Image
import json

with open('./items.json') as f:
    data = json.load(f)

items = data['data']
size = 23, 23
for k in items.keys():
    name = items[k]['image']['full']
    i = Image.open('./item-images/' + name)
    i.thumbnail(size, Image.ANTIALIAS)
    i.save('./resized-item-images/' + name)
    print(name)
