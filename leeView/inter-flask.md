# inter-flask

## 基本使用

### application/x-www-form-urlencoded类型如何获取表单数据及ImmutableMultiDict如何使用

取得的数据格式是 `ImmutableMultiDict` 格式的字典，这种格式的数据时不可变的，这时在使用 `.to_dict()` 就可以转换成常规字典类型了

```python
d = ImmutableMultiDict([('chunkNumber', '1'), ('chunkSize', '2048000'), ('currentChunkSize', '1268333'), ('totalSize', '1268333'), ('identifier', 'f6ef0c41e4eefd77bcdf3ee4307e9b84'), ('filename', '5cd160f153d45d1a6cd89410.zip'), ('relativePath', '5cd160f153d45d1a6cd89410.zip'), ('totalChunks', '1')])

d.to_dict()

{'chunkNumber': '1', 'chunkSize': '2048000', 'currentChunkSize': '1268333', 'totalSize': '1268333', 'identifier': 'f6ef0c41e4eefd77bcdf3ee4307e9b84', 'filename': '5cd160f153d45d1a6cd89410.zip', 'relativePath': '5cd160f153d45d1a6cd89410.zip', 'totalChunks': '1'}

# ❗注意这个区别

dict(d)

{'chunkNumber': ['1'], 'chunkSize': ['2048000'], 'currentChunkSize': ['1268333'], 'totalSize': ['1268333'], 'identifier': ['f6ef0c41e4eefd77bcdf3ee4307e9b84'], 'filename': ['5cd160f153d45d1a6cd89410.zip'], 'relativePath': ['5cd160f153d45d1a6cd89410.zip'], 'totalChunks': ['1']}
```
