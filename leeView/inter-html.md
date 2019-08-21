# inter-html

> html一些不知道的知识点

## Manifest.json

Manifest.json文件是h5+移动app的配置文件，用于指定应用的显示名称、图表、应用入口文件地址及需要使用的设备权限等信息。

## 自定义触发事件

```js Event
window.onresize = (e) => {
  console.log(e)
  console.lgo('自定义事件')
}

window.dispatchEvent(new Event('resize'))
```

```js customEvent
// add an appropriate event listener
obj.addEventListener("cat", function(e) { process(e.detail) });

// create and dispatch the event
var event = new CustomEvent("cat", {"detail":{"hazcheeseburger":true}});
obj.dispatchEvent(event);
使用自定义事件需要注意兼容性问题，而使用 jQuery 就简单多了：
```

## TOOD
