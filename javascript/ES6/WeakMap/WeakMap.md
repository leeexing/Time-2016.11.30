# WeakMap

## WeakMap 的设计目的在于，键名是对象的弱引用（垃圾回收机制不将该引用考虑在内），所以其所对应的对象可能会被自动回收。当对象被回收后，WeakMap自动一处对应的键值对

## 典型引用

一个对应DOM元素的WeakMap结构，当某个DOM元素被移除，其所对应的 WeakMap 记录就会自动被移除。基本上，WeakMap的专用场合就是，他的键所对应的对象，`可能会在将来消失`。WeakMap 结构有足浴防止内存泄漏

## WeakMap 和 Map 在 API 上的主要区别

1、没有遍历操作（即没有 key（）、values()、entries() ），也没有 size属性
2、没法清空，即不支持 clear 方法。这与 WeakMap 的键不被计入引用，被垃圾回收机制忽略有关
3、方法只有四个： set、get、has、delete