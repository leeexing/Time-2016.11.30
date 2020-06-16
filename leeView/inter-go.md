---
title: go
---

## 初始化项目

``` Go
// Go
mkdir demo && cd demo
go env -w GOPROXY=https://goproxy.cn,direct
go mod init github.com/leeexing/demo
ls // go.mod
go get [-u] xxx
```

## 常用go包列表

- [go-watcher](https://github.com/radovskyb/watcher) 监听文件夹中文件的变化
  watcher is a Go package for watching for files or directory changes without using filesystem events.
- [bluemonday](https://java.ctolib.com/bluemonday.html): 一个快速的HTML有害内容清除Golang库
- [goCron](https://github.com/jasonlvhit/gocron) go框架进阶——定时任务 goCron
- [seelog](xx) go第三方日志系统-seelog-使用文档

## strconv

> 数据类型转换包

strconv包提供了字符串与简单数据类型之间的类型转换功能。可以将简单类型转换为字符串，也可以将字符串转换为其它简单类型。

简单的转换数据类型的方式：valueOfTypeB = typeB(valueOfTypeA)

- 字符串转int：Atoi()
- int转字符串: Itoa()。由于string可能无法转换为int，所以这个函数有两个返回值：第一个返回值是转换成int的值，第二个返回值判断是否转换成功。
- ParseTP类函数将string转换为TP类型：ParseBool()、ParseFloat()、ParseInt()、ParseUint()。因为string转其它类型可能会失败，所以这些函数都有第二个返回值表示是否转换成功
- FormatTP类函数将其它类型转string：FormatBool()、FormatFloat()、FormatInt()、FormatUint()
- AppendTP类函数用于将TP转换成字符串后append到一个slice中：AppendBool()、AppendFloat()、AppendInt()、AppendUint()

## path/filepath

> 兼容各操作系统的文件路径

- filepath.Abs 返回所给路径的绝对路径
  filepath.Abs("./test.txt")
- filepath.Base 返回路径最后一个元素
  1.如果路径为空字符串，返回.
  2.如果路径只有斜线，返回/
- filepath.Clean 返回等价的最短路径
  1.用一个斜线替换多个斜线
  2.清除当前路径.
  3.清除内部的..和他前面的元素
  4.以/..开头的，变成/
- filepath.Dir 返回路径最后一个元素的目录
  1.路径为空则返回.
- filepath.Ext 返回路径中的扩展名。如果没有点，返回空
  eg: filepath.Ext("./a/b/c/d.jpg")
- filepath.FromSlash 将路径中的/替换为路径分隔符
  eg: filepath.FromSlash("./a/b/c")
- filepath.Glob 返回所有匹配的文件
  eg: filepath.Glob("./*.go")
- filepath.IsAbs 判断路径是不是绝对路径
- filepath.Join 连接路径，返回已经clean过的路径
  eg: filepath.Join("C:/a", "/b", "/c")
- filepath.Split 分割路径中的目录与文件
  eg: dir, file := filepath.Split("C:/a/b/c/d.jpg")
- filepath.Walk 遍历指定目录下所有文件
  eg: filepath.Walk("./", func(path string, info os.FileInfo, err error) error {
        fmt.Println(path);
        return nil;
    });

## flag

> 命令行参数解析

### 定义flags有两种方式

1. flag.Xxx() Xxx 可以是 Int、String、Bool。返回一个相应类型的指针
2. flag.XxxVar() 将flag绑定到一个变量上

``` Go
var ip = flag.Int("flagname", 1234, "help message for flagname")

第一个参数：flag名称为flagname
第二个参数：flagname默认值为1234
第三个参数：flagname的提示信息
```

返回的是指针类型，获取的ip的值应该 *ip

``` Go
var flagValue int
flag.IntVar(&flagValue, "flagname", 1234, "help message for flagname")
```

第一个参数 ：接收flagname的实际值的
第二个参数 ：flag名称为flagname
第三个参数 ：flagname默认值为1234
第四个参数 ：flagname的提示信息

### 解析flag

flag.parse()

## ioutil

- ioutil.NopCloser 返回一个读取对象的ReadCloser接口
- ioutil.ReadAll 读取所有的数据
- ioutil.ReadDir 读取目录下信息
- ioutil.ReadFile 读取整个文件数据
- ioutil.WriteFile 向指定文件写入数据，如果文件不存在，则创建文件，写入数据之前清空文件
- ioutil.TempDir 在当前目录下，创建一个以test为前缀的临时文件夹，并返回文件夹路径
- ioutil.TempFile 在当前目录下，创建一个以test为前缀的文件，并以读写模式打开文件，并返回os.File指针

``` Go
r2 := strings.NewReader("1234567890");
p, _ := ioutil.ReadAll(r2);
fmt.Println(string(p));

//读取目录下信息
fileInfo, _ := ioutil.ReadDir("./");
for _, v := range fileInfo {
    fmt.Println(v.Name());
}

//读取整个文件数据
data, _ := ioutil.ReadFile("./1.txt");
fmt.Println(string(data));

//向指定文件写入数据，如果文件不存在，则创建文件，写入数据之前清空文件
ioutil.WriteFile("./xxx.txt", []byte("hello,world"), 0655);

//在当前目录下，创建一个以test为前缀的临时文件夹，并返回文件夹路径
name, _ := ioutil.TempDir("./", "test");
fmt.Println(name);

//在当前目录下，创建一个以test为前缀的文件，并以读写模式打开文件，并返回os.File指针
file, _ := ioutil.TempFile("./", "test");
file.WriteString("写入字符串");
file.Close();
```

## json

> 数据的序列化和反序列化

- json.Marshal 一个结构体正常序列化
- json.Unmarshal 将json字符串解码到相应的数据结构

``` Go
func main() {
    p := &Product{}
    p.Name = "Xiao mi 6"
    p.IsOnSale = false
    p.Number = 10000
    p.Price = 2499.00
    p.ProductID = 0

    data, _ := json.Marshal(p) // 得到的是 byte 类型的字符串
    fmt.Println(string(data))
}
```

``` Go
type Product struct {
    Name      string  `json:"name"`
    ProductID int64   `json:"-"` // 表示不进行序列化
    Number    int     `json:"number"`
    Price     float64 `json:"price"`
    IsOnSale  bool    `json:"is_on_sale,string"`
}

var data = `{"name":"Xiao mi 6","number":10000,"price":2499,"is_on_sale":"false"}`

var p = &Person{}
err := json.Unmarshal(data, p)
fmt.Primtln(*p)
```

### 自定义解析JSON

``` Go
// Mail _
type Mail struct {
    Value string
}

// UnmarshalJSON _
func (m *Mail) UnmarshalJSON(data []byte) error {
    // 这里简单演示一下，简单判断即可
    if bytes.Contains(data, []byte("@")) {
        return fmt.Errorf("mail format error")
    }
    m.Value = string(data)
    return nil
}

// UnmarshalJSON _
func (m *Mail) MarshalJSON() (data []byte, err error) {
    if m != nil {
        data = []byte(m.Value)
    }
    return
}
```

## go struct 里面的指针成员变量怎么理解

``` Go
type Model struct {
  ID        uint `gorm:"primary_key"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt *time.Time `sql:"index"`
}
```

解答：

1) 指针允许空吧，不是指针的是非空
2) time.Time 的默认值是 0000-00-00
3) 举个例子，以 JSON 格式打印一个零值结构体时，非指针的结果是默认值，指针是 null。
4) 结构体中的零值不会出现在 gorm 构造的查询条件中，但指针例外。然后删除一般是软删除，DeletedAt 字段初始为零值，删除之后会有值。
    把 DeletedAt 弄成指针，查询的时候就会自然带上 DeletedAt == nil，就能查到未删除的数据，而 CreatedAt 和 UpdatedAt 没有这种需求。
