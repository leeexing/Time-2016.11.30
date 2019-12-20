---
title: inter-flask
tags: python, flask
description: flask相关知识点的使用
---

## flask-migrate

基本使用

```py

app = create_app()      #实例化一个app对象

manager = Manager(app)  #实例化一个manager对象

Migrate(app,db)    #绑定 数据库与app,建立关系

manager.add_command('db',MigrateCommand)    #添加迁移命令集 到脚本命令

# 初始化迁移文件
python manage.py db init

# 将模型添加到迁移文件
python manage.py db migrate -m "一些备注信息"

# 迁移文件中的模型映射到数据库中
python manage.py db upgrade

python manage.py db --help

```

总结：
1、介绍：因为采用db.create_all在后期修改字段的时候，不会自动的映射到数据库中，必须删除表，然后重新运行db.craete_all才会重新映射，这样不符合我们的需求。因此flask-migrate就是为了解决这个问题，它可以在每次修改模型后，可以将修改的东西映射到数据库中。
2、使用flask_migrate必须借助flask_scripts，这个包的MigrateCommand中包含了所有和数据库相关的命令。
3、python manage.py db init：初始化一个迁移脚本的环境，只需要执行一次。
4、python manage.py db migrate：将模型生成迁移文件，只要模型更改了，就需要执行一遍这个命令。
5、python manage.py db upgrade：将迁移文件真正的映射到数据库中。每次运行了migrate命令后，就记得要运行这个命令。

## flask_script

flask_script的作用是可以通过命令行的形式来操作flask例如通过一个命令跑一个开发版本的服务器，设置数据库，定时任务等

```py
from flask_script import Manager
from app import app

manage = Manager(app)

@manage.command
def runserver():
    print("服务开启成功")

# 等价于
manage.add_command('runserver', runserver())

manage.add_command('db',DBManage)

if __name__ =='__main__':
    manage.run()
```

`@manage.command` 作用是通过命令行可以访问这个方法
输入命令 `python manage.py runserver`

2、复杂情况下，建议使用@option

```py
@manager.option('-n', '--name', dest='name', help='Your name', default='world')    # 命令既可以用-n,也可以用--name，dest="name"用户输入的命令的名字作为参数传给了函数中的name
@manager.option('-u', '--url', dest='url', default='www.csdn.com')  # 命令既可以用-u,也可以用--url,dest="url"用户输入的命令的url作为参数传给了函数中的url
def hello(name, url):
    print('hellp', name)
    print(url)


python manage.py hello # hellp world
python manage.py hellp -n leeing -u leeing.cn
python manage.py hellp --name leeing --url leeing.cn
```

## flask_sqlalchemy

### 基本查询

REFER: [SQLAlchemy数据库增删改查](https://www.jianshu.com/p/b7704b6cb2ee)
REFER: [SQLAlchemy外键关联使用及其详细说明](https://www.jianshu.com/p/02c1a33ca1e9)
REFER: [对多&多对多查询](https://blog.csdn.net/chenmozhe22/article/details/95607372)
REFER: [Flask-SQLAlchemy常用操作](https://www.cnblogs.com/huchong/p/8274510.html)

```py
class Article(db.Model):
    __tablename__ = 'article'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Text, nullable=False)

db.create_all()
```

上面创建了一个article的表，`_ _ tablename _ _` 是SQLAlchemy规定的创建表的写法。

使用Flask-SQLAlchemy创建模型与表的映射：
1.模型需要继承自“db.Model”，然后需要映射到表中的属性，必须写成“db.Column”的数据类型。
2.数据类型：
db.Integer代表的是整形
db.String代表的是"varchar"，需要置顶最长的长度。
db.Text代表的是“text”。
……
3.其它参数：
primary_key代表的是将这个字段设置为主键。
autoincrement代表的是这个主键为自增长的。
nullable代表的是这个字段是否可以为空，默认可以为空，
可以将这个值设置为“False”,在数据库中，这个值就不能为空了。
4.调用db.create_all来将模型真正的创建到数据库中。

### 外键关联 (一对多)

```py
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False)


class Article(db.Model):
    __tablename__ = 'article'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    author = db.relationship('User', backref=db.backref('articles'))   <--relationship写在User和Article里面都是一样的。只是里面的参数值不一样罢了-->
```

这里将User中的id关联到Article中的author_id，也就是 author_id就是User中的id
关联的时候数据类型要保持一致，如db.Integer

```py
# 添加数据
username = request.args.get("username")
user = User(username=username)
db.session.add(user)
db.session.commit()

title = request.args.get("title")
content = request.args.get("content")
aitlcle = Article(title=title, content=content, author_id=1)
db.session.add(aitlcle)
db.session.commit()
```

准备工作完成了，外键肯定是关联成功了，可以通过运行代码来查看：

```py
article = Article.query.filter(Article.title == '如何收复汉室？').first()
author_id = article.author_id
user = User.query.filter(User.id == author_id).first()
```

下面这种写法更简单，在Article中如此：

```py
author = db.relationship('User', backref=db.backref('articles')):
```

🧡🧡🧡
第一个参数为模型User的名字（class User），这个是正向引用， Article引用User
第二个参数为反向引用，User引用Article

```py
article = Article.query.filter(Article.title == '如何收复汉室？').first()
print('username:%s' % article.author.username)
```

上面通过正向引用，也就是Article引用User来得到title为“如何收复汉室？”的这个作者是谁

现了正向引用，来看看反向引用，比如刘备还发表了哪些文章，即User引用Article:

```py
user = User.query.filter(User.name == '刘备').first()
articles = user.articles
for article in articles:
    print(article.title)
```

### SQLAlchemy外键多对多关系

REFER: [SQLAlchemy外键多对多关系](https://www.jianshu.com/p/5282a7525e52)

```py
class Article(db.Model):
    __tablename__ = 'article'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    tags = db.relationship('Tag', secondary=article_tag, backref=db.backref('articles'), lazy="dynamic)
```

tags = db.relationship('Tag', secondary=article_tag, backref=db.backref('articles')):
给Article这个模型添加一个`tags属性`，可以访问这篇文章的标签的数据，像访问普通模型一样。
backref是定义反向引用，可以通过Tag.articles`访问这个标签所关联的所有文章。
💚💚💚: secondary=article_tag这句话将article_id和tag_id关联起来，没有这个的话article_tag Article Tag这个三个是独立的

分析：
db.relationship这个方法，主要是关联2个表格的对象之间的关系
使用backref这个参数，可以理解为是一种虚拟的指向关系，从一个对象指向到另一个对象的中间枢纽。
第一个参数：当前类需要关联的----新类名
第二个参数：secondary，这个是重新定义的关联表
第三个参数：新类名指向当前类名的中间枢纽名
lazy：这个是加载表格的方式

💥💥💥lazy="dynamic"只可以用在一对多和多对多关系中，不可以用在一对一和多对一中
REFER: [SQLalchemy relationship之lazy属性](https://blog.csdn.net/bestallen/article/details/52601457)

```py
class Tag(db.Model):
    __tablename__ = 'tag'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
```

💙💙💙
**多对多的关系，要通过一个中间表进行关联article_tag就是中间表**。
中间表，不能通过class的方式实现，`只能`通过“ db.Table”的方式进行实现。

```py
article_tag = db.Table('article_tag',
                       db.Column('article_id', db.Integer, db.ForeignKey('article.id'), primary_key=True),
                       db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True)
                       )
```

如上的数据库模型类，比另外两个特殊的地方在于，他是在article_tag表格的基础上，再重新定义2个字段的外键，且重新定义了字段的名称。
flask_sqlalchemy把旧的表格article_tag，定义为新的article_tag_table表格去使用
定义了article_id的字段，来源于外键article.id（表名+字段）
定义了tag_id的字段，来源于外键tag.id（表名+字段）

添加数据：

```py
@app.route('/addArticleAddTag')
def addArticleAddTag():
    article1 = Article(title='如何实现经济稳定繁荣发展')
    article2 = Article(title='论增强国力的重要性')

    tag1 = Tag(name='经济')
    tag2 = Tag(name='民生')

    article1.tags.append(tag1)   <---- 这里添加数据有所不同。使用的是 append
    article1.tags.append(tag2)

    article2.tags.append(tag1)

    db.session.add(article1)
    db.session.add(article2)

    db.session.add(tag1)
    db.session.add(tag2)

    db.session.commit()
    return 'hello'
```

使用查询:

```py
@app.route('/queryData')
def queryData():
    # 查询指定的文章有几个标签
    article1 = Article.query.filter(Article.title == '如何实现经济稳定繁荣发展').first()
    tags = article1.tags
    for tag in tags:
        print(tag.name)

    # 查询指定的标签和哪些文章有关联
    t = Tag.query.filter(Tag.name == '经济').first()
    articles = t.articles  # 此处直接反向引用得到所有的文章
    for article in articles:
        print(article.title)
    return 'Hello World!'
```

1、通过正向引用，得到指定文章下有几个标签
2、通过反向引用，得到指定标签下有哪些文章关联

小结：
1、backref用于在关系另一端的类中快捷地创建一个指向当前类对象的属性。
  db.backref()是你需要对放置 backref的那一边的参数，

### 基本操作

```py
# ################ 添加 ################
obj1 = Users(name="hc")
session.add(obj1)   #添加一个对象

session.add_all([
    Users(name="hc"),
    Users(name="alex"),
    Hosts(name="c1.com"),
])      #添加多个对象
session.commit()

# ################ 删除 ################

# filter是where条件，最后调用one()或first()返回唯一行，如果调用all()则返回所有行
session.query(Users).filter(Users.id > 2).delete()  #删除Users表中id大于2的数据
session.commit()

# ################ 修改 ################

session.query(Users).filter(Users.id > 0).update({"name" : "099"})  # 将Users表中id>0的数据，把name字段改为099
# 更新user表中id大于2的name列，在原字符串后边增加099
session.query(Users).filter(Users.id > 0).update({Users.name: Users.name + "099"}, synchronize_session=False)    #synchronize_session设置为False即执行字符串拼接
# 更新user表中id大于2的num列，使最终值在原来数值基础上加1
session.query(Users).filter(Users.id > 0).update({"age": Users.age + 1}, synchronize_session="evaluate")    #synchronize_session设置为evaluate即执行四则运算

session.commit()

# ################ 查询 ################

r1 = session.query(Users).all()
r2 = session.query(Users.name.label('xx'), Users.age).all()     #label 取别名的，即在查询结果中，显示name的别名'xx'
r3 = session.query(Users).filter(Users.name == "alex").one()    # one()返回唯一行,类似于django的get,如果返回数据为多个则报错
r3 = session.query(Users).filter(Users.name == "alex").all()    # all()获取所有数据
r4 = session.query(Users).filter_by(name='alex').all()          # 注意filter和filter_by后面括号内条件的写法
r5 = session.query(Users).filter_by(name='alex').first()        # first()获取返回数据的第一行
r6 = session.query(Users).filter(text("id<:value and name=:name")).params(value=224, name='fred').order_by(Users.id).all()
#order_by后面还可以.desc()降序排列，默认为.asc()升序排列
# text(自定义条件，:的功能类似%s占位)，params中进行传参
r7 = session.query(Users).from_statement(text("SELECT * FROM Hosts where name=:name")).params(name='ed').all()
# text中还能从另一个表中查询，前面要用from_statement，而不是filter


session.close()
```


### in_、notin_、and、or、like、limit、排序、分组、连表、组合 进阶操作

```py
#　条件
ret = session.query(Users).filter_by(name='alex').all() #
ret = session.query(Users).filter(Users.id > 1, Users.name == 'eric').all() # 且的关系
ret = session.query(Users).filter(Users.id.between(1, 3), Users.name == 'eric').all()
ret = session.query(Users).filter(Users.id.in_([1,3,4])).all()
ret = session.query(Users).filter(~Users.id.in_([1,3,4])).all() # ~表示非。就是not in的意思
ret = session.query(Users).filter(Users.id.in_(session.query(Users.id).filter_by(name='eric'))).all() # 联表查询
from sqlalchemy import and_, or_   # 且和or的关系
ret = session.query(Users).filter(and_(Users.id > 3, Users.name == 'eric')).all() # 条件以and方式排列
ret = session.query(Users).filter(or_(Users.id < 2, Users.name == 'eric')).all() # 条件以or方式排列
ret = session.query(Users).filter(
    or_( #这部分表示括号中的条件都以or的形式匹配
        Users.id < 2, # 或者 or User.id < 2
        and_(Users.name == 'eric', Users.id > 3),# 表示括号中这部分进行and匹配
        Users.extra != ""
    )).all()


# 通配符
ret = session.query(Users).filter(Users.name.like('e%')).all()
ret = session.query(Users).filter(~Users.name.like('e%')).all() # 表示not like

# 限制 limit用法
ret = session.query(Users)[1:2] # 等于limit ，具体功能需要自己测试

# 排序
ret = session.query(Users).order_by(Users.name.desc()).all()
ret = session.query(Users).order_by(Users.name.desc(), Users.id.asc()).all() # 按照name从大到小排列，如果name相同，按照id从小到大排列

# 分组
from sqlalchemy.sql import func

ret = session.query(Users).group_by(Users.extra).all()
ret = session.query(
    func.max(Users.id),
    func.sum(Users.id),
    func.min(Users.id)).group_by(Users.name).all()

ret = session.query(
    func.max(Users.id),
    func.sum(Users.id),
    func.min(Users.id)).group_by(Users.name).having(func.min(Users.id) >2).all() # having对聚合的内容再次进行过滤

# 连表

ret = session.query(Users, Favor).filter(Users.id == Favor.nid).all()

ret = session.query(Person).join(Favor).all()
# 默认是inner join
ret = session.query(Person).join(Favor, isouter=True).all() # isouter表示是left join

# 组合
q1 = session.query(Users.name).filter(Users.id > 2)
q2 = session.query(Favor.caption).filter(Favor.nid < 2)
ret = q1.union(q2).all() #union默认会去重

q1 = session.query(Users.name).filter(Users.id > 2)
q2 = session.query(Favor.caption).filter(Favor.nid < 2)
ret = q1.union_all(q2).all() # union_all不去重
```

### with_entities

Flask-SQLAlchemy 的 query 是直接查询 model，查出来的一定是一个 model 对象。

如果要查询单个字段的话，应该用 session 去 query model。

```py
a = db.session.query(Page.title, Page.page).all()
print(a)

b = Page.query.with_entities(Page.title, Page.page).all()
print(b)
```

这两个查询返回的都是一个列表，列表内的元素是一个元组，不过不是 Python 内置的元组，是 sqlalchemy.util._collections.KeyedTuple。
但仍然有个问题，如果表中有many_to_one的外键关系，似乎不能通过这种方法嵌套查询出来。

## 问题

### 前端请求 308. 重定向

```python

api = Namespace('dogs', description='Dogs related operations')

dog = api.model('Dog', {
    'id': fields.String(required=True, description='The dog identifier'),
    'name': fields.String(required=True, description='The dog name'),
})

DOGS = [
    {'id': 'medor', 'name': 'Medor'},
]


@api.route('/')
class DogList(Resource):
    @api.doc('list_dogs')
    # @api.marshal_list_with(dog)
    def get(self):
        '''List all dogs'''
        print('gete 9999')
        return {
            'data': DOGS
        }

    def post(self):
        return {
            'data': DOGS,
            'total': len(DOGS)
        }
```

前端请求必须是 `get('http://127.0.0.1:5003/dogs/')`. 注意，最后的反斜杠 '/' 必须要带上。要不就写成 `@api.route('')`

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
