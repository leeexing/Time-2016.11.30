# jsonp

## 原理

> 一定需要设置好返回值的数据类型。不能是 `application/json`

```js
window.sourceData = function(name) {
      alert(name)
    }
    $(() => {
      setTimeout(() => {
        $('head').append("<script src='http://127.0.0.1:5281/v1/api/home?callback=sourceData'><\/script>")
      }, 2000)
      $.get('http://127.0.0.1:5281/v1/api/home?callback=sourceData', res => {
        console.log(res)
      })
    })
```

```python 后台
from flask import request, make_response
from flask_restplus import Namespace, Resource

from app.controllers.home_c import HomeManager

ns = Namespace('home', description='在线标注首页图表数据')
homeManager = HomeManager()


@ns.route('/')
class HomeTest(Resource):

    def get(self):
        print(request.args)
        cb_name = request.args.get('callback')
        res = make_response(cb_name + '(123)')        <---------这里很重要
        res.contentType = 'text/html;charset=UTF-8'   <---------这里也一样
        return res
```