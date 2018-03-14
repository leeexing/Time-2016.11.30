# -*- coding: utf-8 -*-
"""
1、运行 express-app.js
2、运行 app.py 
3、可以实现跨域请求 python 开启的服务 的 api

4、反应好像慢一些
"""

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/users')
def users():
    return 'user example'

if __name__ == '__main__':
    app.run(debug=True)

