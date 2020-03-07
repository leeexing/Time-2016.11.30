---
title: 大数据相关知识学习
tags: 大数据
description: 慢慢来
---

## 一些书籍

Sparkd
Storm
kafka
HDFS
HBase 不睡觉
zooKeeper
Hadoop Yarn
Spark SQL

## 一些工具

### jupyter + notebook

REFER: [Jupyter Notebooks的安装和使用介绍](https://blog.csdn.net/qq_33619378/article/details/83037106)

**快捷键**：
进入命令模式之后（此时你没有活跃单元），有以下快捷键：
A：在所选单元之上插入一个新的单元
B：在所选单元之下插入一个新的单元
D：连续按两次删除所选的单元
Z：撤销被删除的单元
Y：将当前选中的单元变成一个代码单元
F：查找和替换
Shift +上或下箭头：可选择多个单元。
Shift + M：在多选模式时，可合并你的选择。

处于编辑模式时（在命令模式时按 Enter 会进入编辑模式），下列快捷键很有用：
Ctrl + Home ：到达单元起始位置
Ctrl + S ：保存进度
Ctrl + Enter ：会运行你的整个单元块
Alt + Enter ：不止会运行你的单元块，还会在下面添加一个新单元
Ctrl + Shift + F ：打开命令面板

## pandas

### set_index、reset_index

DataFrame可以通过set_index方法，可以设置单索引和复合索引。

``` Python
DataFrame.set_index(keys, drop=True, append=False, inplace=False, verify_integrity=False)
keys：列标签或列标签/数组列表，需要设置为索引的列
drop：默认为True，删除用作新索引的列
append：默认为False，是否将列附加到现有索引
inplace：默认为False，适当修改DataFrame(不要创建新对象)
verify_integrity：默认为false，检查新索引的副本。否则，请将检查推迟到必要时进行。将其设置为false将提高该方法的性能。
```

reset_index可以还原索引，从新变为默认的整型索引

``` Python
DataFrame.reset_index(level=None, drop=False, inplace=False, col_level=0, col_fill=”)

level：int、str、tuple或list，默认无，仅从索引中删除给定级别。默认情况下移除所有级别。控制了具体要还原的那个等级的索引
drop：drop为False则索引列会被还原为普通列，否则会丢失
inplace：默认为false，适当修改DataFrame(不要创建新对象)
col_level：int或str，默认值为0，如果列有多个级别，则确定将标签插入到哪个级别。默认情况下，它将插入到第一级。
col_fill：对象，默认‘’，如果列有多个级别，则确定其他级别的命名方式。如果没有，则重复索引名
注：reset_index还原分为两种类型，第一种是对原DataFrame进行reset，第二种是对使用过set_index()函数的DataFrame进行reset
```


### pandas.read_csv参数整理

> 很多的参数啊

常用的几个如下：
__filepath_or_buffer__ : str，pathlib。str, pathlib.Path, py._path.local.LocalPath or any object with a read() method (such as a file handle or StringIO)
可以是URL，可用URL类型包括：http, ftp, s3和文件。对于多文件正在准备中
本地文件读取实例：://localhost/path/to/table.csv

__sep__ : str, default ‘,’
指定分隔符。如果不指定参数，则会尝试使用逗号分隔。分隔符长于一个字符并且不是‘\s+’,将使用python的语法分析器。并且忽略数据中的逗号。正则表达式例子：'\r\t'

__delimiter__ : str, default None
定界符，备选分隔符（如果指定该参数，则sep参数失效）

__delim_whitespace__ : boolean, default False.
指定空格(例如’ ‘或者’ ‘)是否作为分隔符使用，等效于设定sep='\s+'。如果这个参数设定为Ture那么delimiter 参数失效。
在新版本0.18.1支持

__header__ : int or list of ints, default ‘infer’
指定行数用来作为列名，数据开始行数。如果文件中没有列名，则默认为0，否则设置为None。如果明确设定header=0 就会替换掉原来存在列名。header参数可以是一个list例如：[0,1,3]，这个list表示将文件中的这些行作为列标题（意味着每一列有多个标题），介于中间的行将被忽略掉（例如本例中的2；本例中的数据1,2,4行将被作为多级标题出现，第3行数据将被丢弃，dataframe的数据从第5行开始。）。
注意：如果skip_blank_lines=True 那么header参数忽略注释行和空行，所以header=0表示第一行数据而不是文件的第一行。

__names__ : array-like, default None
用于结果的列名列表，如果数据文件中没有列标题行，就需要执行header=None。默认列表中不能出现重复，除非设定参数mangle_dupe_cols=True。

__index_col__ : int or sequence or False, default None
用作行索引的列编号或者列名，如果给定一个序列则有多个行索引。
如果文件不规则，行尾有分隔符，则可以设定index_col=False 来是的pandas不适用第一列作为行索引。

---

1、pandas 一般是读取 `表格类型` 的数据。例如
  csv、tsv、txt：pd.read_csv
  excel: pd.read_excel
  mysql: pd.read_sql

**2、数据结构**
  *DataFrame 二维数据   ，整个表格，多行多列。 (df.index, df.columns)
  *series：一维数据，一行或者一列

``` Python
s1 = pd.Series([1, 'a', 5.1, 7])
# 创建一个具有标签索引的 series
s2 = pd.Series([1, 'a', 5.1, 7], index=['a', 'b', 'd', 'g']) # index 索引

# 获取数据
s2['a']
s2[['a', 'b']]
```

``` Python
data = {
  'state': ['ohio', 'ohio', 'NY'],
  'year': [2000, 2001, 2002],
  'pop': [1.1, 1.5, 5.6]
}
df = pd.DateFrame(data)

df.columns
df.index # RangeIndex(start=0, stop=5, step=1)

# 查询一列
df['state'] # 一列
df.loc[0] # 一行
df.loc[1:3] # 多行
```

**3、数据查询**
df.loc  根据行列的标签值查询
df.iloc 根据行列的数字位置查询
df.where
df.query

1、.loc 既能查询，又能覆盖写入

``` Python
# 使用单个 label 查询
df.set_index('ymd', replace=True)
df.index # 返回所有索引

# 得到单个值
df.loc('2018-01-03', 'bwendu')
# 得到一个series
df.loc('2018-01-03', ['bwendu' 'ywendu])

# 行index按区间
df.loc['2018-01-03': '2018-01-06', 'bwendu']

# 使用表达式查询， 结果返回表达式为 True 的值
df.loc[df['bwendu'] < 10, :] # 后面的冒号表示 查询所有的列

# 使用函数
df.loc[lambda df: (df['bwendu'] <= 30) & (df['ywendu'] >= 15)), :]

# 计算温差
df.loc[:, 'wencha'] = df['bwendu'] - df['ywendu]
```

2、df.apply

apply a function on an axis of the DataFrame
返回的是一个函数作用之后的 series 数据

``` Python
# 添加一列温度温度类型

def get_wendu_type(x):
    if x['bwendu] > 33:
        return '高温'
    if x['ywendu'] < -10:
        return '低温'
    return '常温'

# 注意，需要设置 axis == 1，这时 series 的index 是 columns
df.loc[:, 'wendu_type'] = df.apply(get_wendu_type, axis=1)
# 查看温度类型的计数
df['wendu_type'].value_counts()

# 结果
常温 389
高温 29
低温 8
```

3、df.assign

assign new columns to DataFrame
返回新的对象包含新的列和原来的列

``` Python
# 将温度由摄氏度变为华氏度

# 可以同时添加多个新的列
df.assign(
  ywendu_huashi = lambda x: x['ywendu'] * 9 / 5 + 32,
  # 摄氏度转华氏度
  bwendu_huashi = lambda x: x['bwendu'] * 9 / 5 + 32
)
```

4、按条件选择分组分别赋值

``` Python
# 先创建空的列
df['wencha_type'] = ''

# 中括号里面第一个参数是条件表达式
df.loc[df['bwendu'] - df['ywendu'] > 10, 'wencha_type'] = '温差大'
df.loc[df['bwendu'] - df['ywendu'] <= 10, 'wencha_type'] = '温差正常'

df['wecha_type'].value_counts()
```

**4、数据统计**
1、汇总类型统计

``` Python
# 一下子统计所有数字列统计结果
df.describe()

# 查看单个 Series 的数据
df['bWendu'].mean()

# 最高温度
df['bwendu'].max()

# 最低温度
df['bwendu'].min()
```

2、唯一去重和按值计算

``` Python
# 唯一性去重
df['fengxiang'].unique()

# 按值计算
df['tianqi'].value_counts()
```

3、相关系数和协方差

```py
# 协方差
df.cov()

# 相关洗漱矩阵
df.corr()
```

### 5、缺失值处理

1、pandas使用这些函数处理缺失值

- isnull 和 notnull：检测是否为空值。可用于 df 和 Series
- dropna：丢弃、删除 缺失值
  - axis 删除行还是列。{0： 'index', '1': columns} default 0
  - how 若个等于 any 则任何为空都删除，如果等于 all 则所有值都为空才删除
  - inplace 如果为 True则修改当前df，否则返回新的df
- fillna 填充空值
  - value 用于填充的值。可以是单个值，也可以是对象
  - method 等于 fill 使用前一个不为 空的值填充 forwrod fill；backword fill 使用后一个不为空的值填充
  - axis 按行还是按列填充
  - iplace 同上

``` Python
# 读取数据
studf = df.read_csv('./learn-pandas-data/datas/student_excel/student_excel.xlsx', skipwrows=2)

studf.isnull()
studf.notnull()

# 筛选没有空分数的所有行
df.loc[df['分数'].notnull()], :]

# 删除掉全是空值的列
df.dropna(axis='clumns', how='all', inplace=True)

# 删除掉全是空值的行
df.dropna(axis='index', how='all', inplace=True)

# 将分数列为空的填充为 0
df.fillna({'分数': 0}) # 如果分数 列 的值为空 填充为 0
# 等价于
df.loc[:, '分数'] = df['分数'].fillna(0)

# 使用前面的有效值填充
df.loc[:, '姓名'] = df['姓名'].fillna(method='ffill) # forwrod fill

# 数据保存
df.to_excel('path', index=False) # 不保存 01234 这样的索引值
```

**6、数据排序**
1、series排序
series.sort_values(ascending=True,inplace=False)

- ascending: 默认True为升序
- inplace: 是否修改原始值

2、DataFrame.sort_values(by, ascending=True, inplace=False)

- by: 字符串或者list<字符串>，单列排序或者多列排序
- 同上

### 字符串处理

`df['bWendu'].str.replace("℃", "").astype('int32')`

Pandas的字符串处理：

1. 使用方法：先获取Series的str属性，然后在属性上调用函数；
2. 只能在字符串列上使用，不能数字列上使用；
3. Dataframe上没有str属性和处理方法
4. Series.str并不是Python原生字符串，而是自己的一套方法，不过大部分和原生str很相似；

[Series.str字符串方法列表参考文档](https://pandas.pydata.org/pandas-docs/stable/reference/series.html#string-handling)

本节演示内容：

1. 获取Series的str属性，然后使用各种字符串处理函数
2. 使用str的startswith、contains等bool类Series可以做条件查询
3. 需要多次str处理的链式操作
4. 使用正则表达式的处理

``` Python
# 获取str属性
df['bwendu'].str

# 字符串替换函数
df['bwendu'].str.replace('C', '')

# 判断是不是数字
df['bwendu'].str.isnumeric()

# 获取长度
df['bwendu'].str.len()

# 使用str的startswith、contains等得到bool的Series可以做条件查询
condition = df["ymd"].str.startswith("2018-03")
# 结果
condition
0      False
1      False

#  每次调用函数，都返回一个新Series
df["ymd"].str.replace("-", "").str.slice(0, 6)
# 等同于
df["ymd"].str.replace("-", "").str[0:6]
```

使用正则表达式的处理

``` Python
# 添加新列
def get_nianyueri(x):
    year,month,day = x["ymd"].split("-")
    return f"{year}年{month}月{day}日"

df["中文日期"] = df.apply(get_nianyueri, axis=1)

df["中文日期"]
0      2018年01月01日
1      2018年01月02日

# 问题：怎样将“2018年12月31日”中的年、月、日三个中文字符去除？

# 方法1：链式replace
df["中文日期"].str.replace("年", "").str.replace("月","").str.replace("日", "")

# 方法2：正则表达式替换
df["中文日期"].str.replace("[年月日]", "")
```

### Pandas的axis参数怎么理解

xis=0或者"index"：
  如果是单行操作，就指的是某一行
  如果是聚合操作，指的是跨行cross rows

axis=1或者"columns"：
  如果是单列操作，就指的是某一列
  如果是聚合操作，指的是跨列cross columns

**按哪个axis，就是这个axis要动起来(类似被for遍历)，其它的axis保持不动**:

``` Python
# 生成数据
df = pd.DataFrame(
    np.arange(12).reshape(3,4),
    columns=['A', 'B', 'C', 'D']
)

df
# A	B	C	D
# 0	0	1	2	3
# 1	4	5	6	7
# 2	8	9	10	11

# drop 单列，就是删除某一列
df.drop('A', axis=1)

# drop 单行，就是删除某一行
df.drop(1, axis=0)
```

``` Python
# 按axis=0/index执行mean聚合操作

# axis=0 or axis=index
df.mean(axis=0) # 代表 跨行输出列结果

A    4.0
B    5.0
C    6.0
D    7.0

指定了按哪个axis，就是这个axis要动起来(类似被for遍历)，其它的axis保持不动

# 按axis=1/columns执行mean聚合操作
# axis=1 or axis=columns
df.mean(axis=1) # 代表 跨列 输出 行结果

0    1.5
1    5.5
2    9.5

指定了按哪个axis，就是这个axis要动起来(类似被for遍历)，其它的axis保持不动
```

### pandas的索引index

把数据存储于普通的column列也能用于数据查询，那使用index有什么好处？

index的用途总结：

1. 更方便的数据查询；
2. 使用index可以获得性能提升；
3. 自动的数据对齐功能；
4. 更多更强大的数据结构支持；

``` Python
df = pd.read_csv("./datas/ml-latest-small/ratings.csv")

# 使用index查询数据
# drop==False，让索引列还保持在column
df.set_index("userId", inplace=True, drop=False)

# 使用index的查询方法
df.loc[500].head(5)

# 使用column的condition查询方法
df.loc[df["userId"] == 500].head()
```

使用index会提升查询性能

如果index是唯一的，Pandas会使用哈希表优化，查询性能为O(1);
如果index不是唯一的，但是有序，Pandas会使用二分查找算法，查询性能为O(logN);
如果index是完全随机的，那么每次查询都要扫描全表，查询性能为O(N);

### Pandas怎样实现DataFrame的Merge

Pandas的Merge，相当于Sql的Join，将不同的表按key关联到一个表

merge的语法：

``` Python
pd.merge(left, right, how='inner', on=None, left_on=None, right_on=None, left_index=False, right_index=False, sort=True, suffixes=('_x', '_y'), copy=True, indicator=False, validate=None)
```

left，right：要merge的dataframe或者有name的Series
how：join类型，'left', 'right', 'outer', 'inner'
on：join的key，left和right都需要有这个key
left_on：left的df或者series的key
right_on：right的df或者seires的key
left_index，right_index：使用index而不是普通的column做join
suffixes：两个元素的后缀，如果列有重名，自动添加后缀，默认是('_x', '_y')

[文档地址：](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.merge.html)

本次讲解提纲：

1. 电影数据集的join实例
2. 理解merge时一对一、一对多、多对多的数量对齐关系
3. 理解left join、right join、inner join、outer join的区别
4. 如果出现非Key的字段重名怎么办

2、理解merge时数量的对齐关系
以下关系要正确理解：

one-to-one：一对一关系，关联的key都是唯一的
比如(学号，姓名) merge (学号，年龄)
结果条数为：1*1
one-to-many：一对多关系，左边唯一key，右边不唯一key
比如(学号，姓名) merge (学号，语文成绩、数学成绩、英语成绩)
结果条数为：1*N
many-to-many：多对多关系，左边右边都不是唯一的
比如（学号，语文成绩、数学成绩、英语成绩） merge (学号，篮球、足球、乒乓球)
结果条数为：M*N

3.1 inner join，默认
左边和右边的key都有，才会出现在结果里

3.2 left join
左边的都会出现在结果里，右边的如果无法匹配则为Null

3.3 right join
右边的都会出现在结果里，左边的如果无法匹配则为Null

3.4 outer join
左边、右边的都会出现在结果里，如果无法匹配则为Null

### Pandas实现数据的合并concat

**使用场景：**
批量合并相同格式的Excel、给DataFrame添加行、给DataFrame添加列

一句话说明concat语法：
  使用某种合并方式(inner/outer)
  沿着某个轴向(axis=0/1)
  把多个Pandas对象(DataFrame/Series)合并成一个。

concat语法：pandas.concat(objs, axis=0, join='outer', ignore_index=False)

objs：一个列表，内容可以是DataFrame或者Series，可以混合
  axis：默认是0代表按行合并，如果等于1代表按列合并
  join：合并的时候索引的对齐方式，默认是outer join，也可以是inner join
  ignore_index：是否忽略掉原来的数据索引

append语法：DataFrame.append(other, ignore_index=False)
append只有按行合并，没有按列合并，相当于concat按行的简写形式

  other：单个dataframe、series、dict，或者列表
  ignore_index：是否忽略掉原来的数据索引

参考文档：
[pandas.concat的api文档：](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.concat.html)
[pandas.concat的教程：](https://pandas.pydata.org/pandas-docs/stable/user_guide/merging.html)
[pandas.append的api文档：](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.append.html)

### Pandas怎样实现groupby分组统计

类似SQL：
select city,max(temperature) from city_weather group by city;

groupby：先对数据分组，然后在每个分组上应用聚合函数、转换函数

本次演示：
一、分组使用聚合函数做数据统计
二、遍历groupby的结果理解执行流程
三、实例分组探索天气数据

### Pandas的数据转换函数map、apply、applymap

数据转换函数对比：map、apply、applymap：

1. map：只用于Series，实现每个值->值的映射；
2. apply：用于Series实现每个值的处理，用于Dataframe实现某个轴的Series的处理；
3. applymap：只能用于DataFrame，用于处理该DataFrame的每个元素；

1、 map用于Series值的转换

实例：将股票代码英文转换成中文名字

`Series.map(dict) or Series.map(function)`均可

``` Python
import pandas as pd
stocks = pd.read_excel('./datas/stocks/互联网公司股票.xlsx')
stocks.head()

stocks["公司"].unique()

# 公司股票代码到中文的映射，注意这里是小写
dict_company_names = {
    "bidu": "百度",
    "baba": "阿里巴巴",
    "iq": "爱奇艺",
    "jd": "京东"
}

# 方法1：Series.map(dict)
stocks["公司中文1"] = stocks["公司"].str.lower().map(dict_company_names)

# 方法2：Series.map(function)。
# function的参数是Series的每个元素的值
stocks["公司中文2"] = stocks["公司"].map(lambda x : dict_company_names[x.lower()])

```

2、 apply用于Series和DataFrame的转换
  Series.apply(function), 函数的参数是每个值
  DataFrame.apply(function), 函数的参数是Series

``` Python
stocks["公司中文3"] = stocks["公司"].apply(
    lambda x : dict_company_names[x.lower()])

stocks["公司中文4"] = stocks.apply(
    lambda x : dict_company_names[x["公司"].lower()],
    axis=1)
# 注意这个代码：
# 1、apply是在stocks这个DataFrame上调用；
# 2、lambda x的x是一个Series，因为指定了axis=1所以Seires的key是列名，可以用x'公司'获取
```

3、applymap用于DataFrame所有值的转换

``` Python
sub_df = stocks[['收盘', '开盘', '高', '低', '交易量']]

# 收盘  开盘  高  低  交易量
# 0 104.32 102.35 104.73 101.15 2.24
# 1 102.62 100.85 103.24 99.50  2.69
# 2 102.00 102.80 103.26 101.00 1.78
# 3 169.48 166.65 170.18 165.00 10.39
# 4 165.77 162.82 166.88 161.90 11.60

# 将这些数字取整数，应用于所有元素
sub_df.applymap(lambda x : int(x))

# 直接修改原df的这几列
stocks.loc[:, ['收盘', '开盘', '高', '低', '交易量']] = sub_df.applymap(lambda x : int(x))
```

## numpy
