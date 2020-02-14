import json
import numpy as np

with open("item.json", "r") as f:
    items = json.load(f)['data']

leaves = []
combinations = []
for item in items:
    if 'from' not in items[item]:
        leaves.append(item)
    else:
        combinations.append(item)

n_leaves = len(leaves)
one_hot = np.zeros((n_leaves, n_leaves), dtype=np.int)
for i in range(n_leaves):
    one_hot[i][i] = 1

result = {}
for i, item in enumerate(leaves):
    result[item] = one_hot[i]

while True:
    nxt = []
    for item in combinations:
        needs = items[item]['from']
        label = np.zeros(n_leaves, dtype=np.int)

        flag = True
        for need in needs:
            if need not in result:
                nxt.append(item)
                flag = False
                break
            label += result[need]
        if not flag:
            continue

        result[item] = label
    if len(result) == len(items):
        break

for item in result:
    result[item] = "".join(map(str, result[item]))

with open('item2label.json', 'w', encoding='utf-8') as make_file:
    json.dump(result, make_file, indent="\t")
