---
title: flask-sqlalchemy
tag: python, flask
desc: 平时使用中遇到的问题
---

## 查询

### with_entities()

  通过使用with_entities() 方法来获取要在结果中返回的列

```python eg
result = modle.User.query
          .with_entities(modle.User.name)
          .distinct()
```

backref 和 back_populate

  backref 是 back-populate 的更高级、更简化版本，是新对旧的替代关系
  back-populate 必须是双向的，而backref，可以 单向的声明，在任何一个类下，都可以。

backref是隐式的声明了关系反向引用的字段，back-populate则是显式的定义了关系反向引用的字段。相比于backref，back-populate使得模型之间的关系更清晰，所有的关系一目了然

### join()

[参考](https://www.jianshu.com/p/9771b0a3e589)

如果不用join得话，可以直接联表查询

``` Python
session.query(User.name, Address.email_address).filter(User.id==Address.user_id)
        .filter(Address.email_address=='test@test.com').all()

SELECT users.name AS users_name, addresses.email_address AS addresses_email_address
FROM users, addresses
WHERE users.id = addresses.user_id AND addresses.email_address = %s ('test@test.com',)
```

使用join查询的话

``` Python
session.query(User).join(Address).filter(Address.email_address=='test@test.com').first()

SELECT users.id AS users_id, users.name AS users_name
FROM users INNER JOIN addresses ON users.id = addresses.user_id
WHERE addresses.email_address = %s
 LIMIT %s
 ('test@test.com', 1)
```

注意，上面的用法的前提是存在外键的情况下，如果没有外键，那么可以使用,

``` Python
query.join(Address, User.id==Address.user_id)    # explicit condition
query.join(User.addresses)                       # specify relationship from left to right
query.join(Address, User.addresses)              # same, with explicit target
query.join('addresses')
```

### 包含contains

query.filter(User.addresses.contains(someaddress))

### paginate

分页器

``` Python
query.order_by(models.Fault.created_at.desc())
                  .paginate(args.page, args.per_page, error_out=False)
                  .items
```

page: 页数。必须
per_page: 页容，默认 20
error_out: 设置为 True（默认值），如果请求的页数超出了范围，则返回 404错误，
            设置为 False，页数超出范围返回一个空列表

paginate 属性：

    $ print(paginate.pages) #总共能生成多少页
    $ print(paginate.page) #当前页码数
    $ print(paginate.has_next) #True
    $ print(paginate.has_prev) #Flase
    $ print(paginate.next_num) #获取下一页的页码数
    $ print(paginate.prev_num) #获取上一页的页码数
    $ print(paginate.items) #获当前页的对象 列表

### 使用原生语法进行查询

db.engine.execute

``` Python
db.engine.execute('''\
            SELECT DISTINCT d.id
            FROM device as d
            LEFT JOIN subdevice AS sd ON sd.device_id = d.id
            LEFT JOIN state AS st ON st.id = sd.state_id
            WHERE st.code = 1 AND NOW() - sd.updated_at < interval '10 minute';
            ''')
```

### scalar

all()返回一个列表
first()返回至多一个结果，而且以单项形式，而不是只有一个元素的tuple形式返回这个结果
.scalar() 这个方法与.one_or_none()的效果一样。 如果查询到很多结果，抛出sqlalchemy.orm.exc.MultipleResultsFound异常。如果只有一个结果，返回它，没有结果返回None。
one()返回且仅返回一个查询结果。当结果的数量不足一个或者多于一个时会报错。
one_or_none()比起one()来，区别只是查询不到任何结果时不再抛出异常而是返回None。
get()这是个比较特殊的方法。它用于根据主键来返回查询结果，因此它有个参数就是要查询的对象的主键。如果没有该主键的结果返回None，否则返回这个结果。

## 建表

### cascade

在SQLAlchemy中，只要将一条数据添加到session中，其它和此条数据相关联的数据都会一起存到数据库中，这是因为在relationship中有一个关键字参数：cascade，默认选项为save-update

一：save-update：默认选项，在添加一条数据的时候，会把其他和次数据关联的数据都添加到数据库中，这种行为就是save-update属性决定的
二：delete：表示当删除某一个模型中的数据的时候，也删除掉使用relationship和此数据关联的数据
三：delete-orphan：表示当对一个ORM对象解除了父表中的关联对象的时候，自己便会被删除，如果父表的数据被删除，同样自己也会被删除，这个选项只能用在一对多上，不能用在多对多和多对一上，并且使用的时候还需要在子模型的relationship中增加参数：single_parent=True
四：merge(合并)：默认选项，当在使用session.merge合并一个对象的时候，会将使用了relationship相关联的对象也进行merge操作
五：expunge：移除操作的时候，会将相关联的对象也进行移除，这个操作只是从session中移除，并不会正则从数据库删除
六：all：对 save-update、merge、refresh-expire、expunge、delete 这几种的缩写
