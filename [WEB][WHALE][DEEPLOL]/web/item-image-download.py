import json
import wget

with open('./items.json') as f:
    data = json.load(f)

items = data['data']
for k in items.keys():
    name = items[k]['image']['full']
    url = 'http://ddragon.leagueoflegends.com/cdn/10.3.1/img/item/' + name
    wget.download(url, './item-images/' + name)
    print(name)
