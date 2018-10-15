"""
重点是使用 迭代器
"""
arr = [72, 9, 64, 8,9,72,9,8,9]
a = [ {'x':1, 'y':2}, {'x':1, 'y':3}, {'x':1, 'y':2}, {'x':2, 'y':4}]

def dequpe(items, key=None):
    seen = set()
    for item in items:
        if item not in seen:
            yield item
            seen.add(item)

def dequeue(items, key=None):
    seen = set()
    for item in items:
        val = item if not key else key(item)
        if val not in seen:
            yield item
            seen.add(val)

print(
    list(dequpe(arr)),
    list(dequeue(a, key=lambda d: d['x']))
)