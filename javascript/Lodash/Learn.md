This is the docs of Learning Lodash

## Lodash

> 坚持每天一个API

### _chunk

Creates an array of elements split into groups the length of size. If array can't be split evenly, the final chunk will be the remaining elements.

```js important-for-me
var length = array == null ? 0 : array.length
var index = 0
    resIndex = 0
    result = Array(Math.ceil(length/size))
while(index < length) {
  result[resIndex] = array.slice(index, (index += size))
}
```

*while 循环使用起来比for循环更加简洁漂亮*

### _compact

Creates an array with all falsey values removed. The values `false, null, 0, "", undefined, and NaN` are falsey.

```js important-for-me
// 其实可以使用filter实现
array.filter(item => item)
```

### _concat

Creates a new array concatenating array with any additional arrays and/or values.

```js key
var array = [1];
var other = _.concat(array, 2, [3], [[4]]);

function concat() {
  var length = arguments.length
  if (!length) {
    return []
  }
  var args = Array(length - 1)
      array = arguments[0]
      index = length
  
  while (index--){
    args[index - 1] = arguments[index]
  }
  return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1))
}
```

*实现传入参数如果是数组的扁平化，使用了递归操作*

### _baseFlatten

```js _baseFlatten
function baseFlatten (array, depth, predicate, isStrict, result) {
  var index = -1
      length = array.length
  
  predicate || (predicate = isFlattenable)
  result || (result = [])

  while (++index < length) {
    var value = array[index]
    if (depath > 0 && predicate(value)) {
      if (depath > 1) {
        baseFlatten(value, depath - 1, predicate, isStrict, result)
      } else {
        arrayPush(result, value)
      } 
    } else if (!isStrict) {
      result[result.length] = value
    }
  }
  return result
}
```

😀自己写的话
```js baseFlatten-mine
// 使用 reduce。可能就不加那么多的判断了
```

```js _isFlattenable
function isFlattenable (value) {
  return isArray(value) || isArguments(value) ||
          !!(spreadableSymbol && value && value[spreadableSymbol])

  // spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined
  // isArray = Array.isArray
  // isArguments = baseIsArguments(function(){return arguments}()) ? baseIsArguments : function(value) {
  //   return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee')
  // }
}
```

```js arrayPush
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length

  while (++index < length) {
    array[offset + index] = values[index]
  }
  return array
}
```

### _difference

Creates an array of array values not included in the other given arrays using SameValueZero for equality comparisons. The order and references of result values are determined by the first array.

```js source
_.difference([2, 1], [2, 3]);
// => [1]

var difference = baseRest(function (array, values) {
  return isArrayLikeOobject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : []
})

// baseDifference 处理逻辑还很长
```