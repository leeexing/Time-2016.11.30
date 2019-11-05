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

## JWT

JWT格式：

```js
header.payload.signature
```

header:

```js
{
  "type": "JWT",
  "alg": "HS256"
}
```

payload:

```js
{
  userID: 'fasfweafsdaftgebt5452w',
}
// or

{
  "iat": 1571712589,
  "nbf": 1571712589,
  "jti": "90ff47b1-4050-4351-b132-2f2c051b79fd",
  "exp": 1572317389,
  "identity": {
    "userID": 3,
    "username": "admin",
    "usertype": "Admin"
  },
  "fresh": false,
  "type": "access"
}
```

signature: 签名。签名一般就是用一些算法生成一个能够认证身份的字符串

```js
data = base64UrlEncode(header) + "." + base64UrlEncode(payload)

hashedData = hash(data, secret)

signature = base64UrlEncode(hashedData)
```

上面hash方法用到了一个secret，这个东西需要application server和authentication server双方都知道，相当于约好了同一把验证的钥匙，最终才好做认证

最终得到的一个结果就是这样的

```js
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.
eyJpYXQiOjE1NzE3MTI1ODksIm5iZiI6MTU3MTcxMjU4OSwianRpIjoiOTBmZjQ3YjEtNDA1MC00MzUxLWIxMzItMmYyYzA1MWI3OWZkIiwiZXhwI
joxNTcyMzE3Mzg5LCJpZGVudGl0eSI6eyJ1c2VySUQiOjMsInVzZXJuYW1lIjoiYWRtaW4iLCJ1c2VydHlwZSI6IkFkbWluIn0sImZyZXNoIjpmYWx
zZSwidHlwZSI6ImFjY2VzcyJ9.3HgW-jDRixBfEapmm28ERMZ1_pi7CmtrBUa4nFutNoM
```

再次强调一点，别看上面做了那么多hash，其实目的不在加密保护数据，而是为了`**认证来源，认证来源，认证来源**`。JWT不保证数据不泄露，因为JWT的设计目的就不是数据加密和保护。

最后再解释一下application server如何认证用户发来的JWT是否合法，
首先application server 和 authentication server必须要有个约定，例如双方同时知道加密用的secret（这里假设用的就是简单的对称加密算法），那么在applicaition 收到这个JWT是，就可以利用JWT前两段（别忘了JWT是个三段的拼成的字符串哦）数据作为输入，用同一套hash算法和同一个secret自己计算一个签名值，
然后`把计算出来的签名值和收到的JWT第三段比较`，如果相同则认证通过，如果不相同，则认证不通过。就这么简单，当然，
上面是假设了这个hash算法是对称加密算法,其实如果用非对称加密算法也是可以的，比方说我就用非对称的算法，那么对应的key就是一对，而非一个，那么一对公钥+私钥可以这样分配：私钥由authentication server保存，公钥由application server保存，application server验证的时候，用公钥解密收到的signature,这样就得到了header和payload的拼接值，用这个拼接值跟前两段比较，相同就验证通过。总之，方法略不同，但大方向完全一样。

**注意**：
比较的是 `header.payload.signature` 中的第三段，也就是签名。
