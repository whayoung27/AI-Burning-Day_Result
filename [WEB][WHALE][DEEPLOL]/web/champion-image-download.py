import json
import wget

with open('champions.json') as f:
    data = json.load(f)

items = data['data']
for k in items.keys():
    name = items[k]['image']['full']
    id = items[k]['key']
    url = 'http://ddragon.leagueoflegends.com/cdn/10.3.1/img/champion/' + name
    wget.download(url, './champion-images/' + id + '.png')
    print(name, id)
