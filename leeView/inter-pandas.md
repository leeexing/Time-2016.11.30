---
title: pandas
tag: bd
desc: 利用好数据库
---

## 创建一个DataFrame

``` Python
df = pd.DataFrame(data=None, index=None, columns=None, dtype=None, copy=False)
```

DataFrame()函数的参数index的值相当于行索引，若不手动赋值，将默认从0开始分配。columns的值相当于列索引，若不手动赋值，也将默认从0开始分配。

``` Python
data = pd.DataFrame({
    "height":np.random.randint(150,190,100),
    "weight":np.random.randint(40,90,100),
    "smoker":[boolean[x] for x in np.random.randint(0,2,100)],
    "gender":[gender[x] for x in np.random.randint(0,2,100)],
    "age":np.random.randint(15,90,100),
    "color":[color[x] for x in np.random.randint(0,len(color),100) ]
})

height、weight、smoker 表示的是列名
```

df.values 返回ndarray类型的对象。ndarray类型即numpy的 N 维数组对象
df.index 获取行索引。eg:Index(['one', 'two', 'three', 'four', 'five'], dtype='object')
df.columns 获取列索引. eg: Index(['姓名', '性别', '年龄', '职业'], dtype='object')
df.axes 获取行及列索引。
df.T index 与 columns 对调
df.info() 打印DataFrame对象的信息
df.head(i) 显示前 i 行数据
df.tail(i) 显示后 i 行数据
df.describe() 查看数据按列的统计信息。可显示数据的数量、缺失值、最小最大数、平均值、分位数等信息


## 读取数据

``` Python
df.read_csv('xxx')
df.read_json('xxx')
df.DataFrame(list(db.find().limit(100)))
```

## 只显示指定行

``` Python
data = df['title'] # Series 数据类型
data = df[['_id', 'title', 'type']] # DataFrame 数据类型
data = df[df['name'].str.contains('micle')].head() # 基于字符串的记录刷选
print(data)
data = df.loc[:, 'title']
data = df.loc[:, ['title', 'type']]

2、获取行数据
data = df[1: 3]
data = df[0, :]
2.1、通过 iloc 获取
data = df.iloc[2]

data = df[df.a < 1]
```

## 添加行

``` Python
def trim_text(text):
  return text.trim()

df['title_add'] = df.apply(lambda x: trim_text(x['title']), axis=1)
print(df)

2、创建一个是一个布尔值的列
df['is_selected'] = df['name'].str.contains('white')
# 然后进行刷选
df[df['is_selected'] == True]
```

## 过滤数据

``` Python
1、使用[]
df[df.A > 1]
df[df.A + df.B > 2]

2、结合apply方法
df[df.apply(lambda x: x['b'] > x['c'], axis=1)]
df[df['title_pure'].duplicated(keep='first')]

3、使用isin
df[df.E.isin(['one'])]
```

``` Python
# 实战
# 两种不同的写法。
def remove_symbol(text):
    """将文本中的标点符号去掉"""
    return re.sub(r'[\\n\[\]（）().。,，""“”{}、\s]+', '', text)

data['title_pure'] = data.apply(lambda x: remove_symbol(x['title']), axis=1)
data['title_pure'] = data['title'].apply(lambda x: re.sub(r'[\\n\[\]（）().。,，""“”{}、\s]+', '', x))
```

默认情况下 axis=0 表示按列，axis=1 表示按行。

## 去除重复的列数据

``` Python
data = df.drop_duplicates(subset=['title_add'], keep='list')
print(data.head(10))
new_df2 = df.drop_duplicates(['col1']) # 删除数据记录中col1值相同的记录
new_df4 = df.drop_duplicates(['col1', 'col2']) # 删除数据记录中指定列（col1/col2）值相同的记录
```

head(10)获取数据的前十条
subset参数是一个列表，这个列表是需要你填进行相同数据判断的条件.就比如我选的条件是method和year，即 method值和year的值相同就可被判定为一样的数据。
keep的取值有三个 分别是 first、last、false
keep=first时，保留相同数据的第一条。keep=last时，保存相同数据的最后一条。keep=false时，所有相同的数据都不保留。inplace=True时，会对原数据进行修改。否则，只返回视图，不对原数据修改。

## pandas的大小和数量有什么区别

size包括NaN值，count不包括：

## map

``` Python
boolean=[True,False]
    gender=["男","女"]
    color=["white","black","yellow"]
    data=pd.DataFrame({
        "height":np.random.randint(150,190,100),
        "weight":np.random.randint(40,90,100),
        "smoker":[boolean[x] for x in np.random.randint(0,2,100)],
        "gender":[gender[x] for x in np.random.randint(0,2,100)],
        "age":np.random.randint(15,90,100),
        "color":[color[x] for x in np.random.randint(0,len(color),100) ]
    })
```

``` Python
data['gender'] = data['gender'].map({"男": 1, "女": 0})
```

对于Series而言，map可以解决绝大多数的数据处理需求，但如果需要使用较为复杂的函数，则需要用到apply方法。

## apply

同时Series对象还有apply方法，apply方法的作用原理和map方法类似，区别在于apply能够传入功能更为复杂的函数。

``` Python
def apply_age(x,bias):
    return x+bias
​
#以元组的方式传入额外的参数
data["age"] = data["age"].apply(apply_age,args=(-3,))
```

对DataFrame而言，apply是非常重要的数据处理方法，它可以接收各种各样的函数（Python内置的或自定义的），处理方式很灵活

在DataFrame对象的大多数方法中，都会有axis这个参数，它控制了你指定的操作是沿着0轴还是1轴进行。
axis=0代表操作对列columns进行，
axis=1代表操作对行row进行

当沿着轴0（axis=0）进行操作时，会将各列(columns)默认以Series的形式作为参数，传入到你指定的操作函数中，操作后合并并返回相应的结果。

当apply设置了axis=1对行进行操作时，会默认将每一行数据以Series的形式（Series的索引为列名）传入指定函数，返回相应的结果。

``` Python
def BMI(series):
    weight = series["weight"]
    height = series["height"]/100
    BMI = weight/height**2
    return BMI
​
data["BMI"] = data.apply(BMI,axis=1)
```

总结一下对DataFrame的apply操作：

1. 当axis=0时，对每列columns执行指定函数；当axis=1时，对每行row执行指定函数。
2. 无论axis=0还是axis=1，其传入指定函数的默认形式均为Series，可以通过设置raw=True传入numpy数组。
3. 对每个Series执行结果后，会将结果整合在一起返回（若想有返回值，定义函数时需要return相应的值）
4. 当然，DataFrame的apply和Series的apply一样，也能接收更复杂的函数，如传入参数等，实现原理是一样的，具体用法详见官方文档。

## applyMap

applymap的用法比较简单，会对DataFrame中的每个单元格执行指定函数的操作，虽然用途不如apply广泛

## 导出数据

``` Python
# 基本语法
DataFrame.to_csv(path_or_buf=None, sep=', ', na_rep='', float_format=None, columns=None, header=True, index=True, index_label=None, mode='w', encoding=None, compression=None, quoting=None, quotechar='"', line_terminator='\n', chunksize=None, tupleize_cols=None, date_format=None, doublequote=True, escapechar=None, decimal='.')
```

o_csv('C:/Users/think/Desktop/Result.csv',sep='?')#使用?分隔需要保存的数据，如果不写，默认是,
dt.to_csv('C:/Users/think/Desktop/Result1.csv',na_rep='NA') #确实值保存为NA，如果不写，默认是空
dt.to_csv('C:/Users/think/Desktop/Result1.csv',float_format='%.2f') #保留两位小数
dt.to_csv('C:/Users/think/Desktop/Result.csv',columns=['name']) #保存索引列和name列
dt.to_csv('C:/Users/think/Desktop/Result.csv',header=0) #不保存列名
dt.to_csv('C:/Users/think/Desktop/Result1.csv',index=0) #不保存行索引

``` Python
df.to_json('./test_topic.json', orient='index')
df.to_csv('./test_topic.csv')
```

如果是Series转json，默认的orient是'index'，orient可选参数有 {‘split','records','index'}

如果是DataFrame转json，默认的orient是'columns'，orient可选参数有 {‘split','records','index','columns','values'}

orient: 默认值是 'index'

split，样式为 {index -> [index], columns -> [columns], data -> [values]}

records，样式为[{column -> value}, … , {column -> value}]

index ，样式为 {index -> {column -> value}}

columns，样式为 {index -> {column -> value}}

values，数组样式

table，样式为{‘schema': {schema}, ‘data': {data}}，和records类似