---
title: go
---

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
