import json
import numpy as np

with open("item.json", "r") as f:
    items = json.load(f)['data']

result = {}
for item in items:
    if 'from' in items[item]:
        result[item] = items[item]['from']
    else:
        result[item] = []

with open('item_combination.json', 'w', encoding='utf-8') as make_file:
    json.dump(result, make_file, indent="\t")

