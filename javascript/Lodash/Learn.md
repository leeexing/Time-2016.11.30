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

### _differenceBy

This method is like _.difference except that it accepts iteratee which is invoked for each element of array and values to generate the criterion by which they're compared. The order and references of result values are determined by the first array. The iteratee is invoked with one argument:
(value).

```js
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = A
}
```

### _drop

Creates a slice of array with n elements dropped from the beginning.

```js
// _.drop([1, 2, 3]);
// => [2, 3]
function drop (array, n, guard) {
  var length = array == null ? 0 : array.length
  if (!length) {
    return []
  }
  n = (guard || n === undefined) ? 1 : Number(n)
  return baseSlice(array, n < 0 ? 0 : n, length) // 具体查看源码
}
```

### _dropRight

Creates a slice of array with n elements dropped from the end.

```js
_.dropRight([1, 2, 3], 2);
// => [1]

function dropRight (array, num) {
  var length = array == null ? 0 : array.length
  if (!length) {
    return []
  }
  n = (guard || n === undefined) ? 1 : Number(n)
  n = lenght - n
  return baseSlice(array, 0, n < 0 ? 0 : n)
}
```

*转变一下思维，很重要！！！*

### _dropRightWhile

```js
// 一个有意思的技巧使用

while ((fromRight ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

// 上面这段代码就是想简单的使用一个循环做点事情。真正的逻辑处理为空
```

### _dropWhile

### _fill

Fills elements of array with value from start up to, but not including, end.

*这个方法ES6里面实现了*

### _findIndex

This method is like _.find except that it returns the index of the first element predicate returns truthy for instead of the element itself.

```js
// 基于这个函数实现的

function baseFindIndex (array, predicate, fromIndex, fromRight) {
  var length = array.length
      index = fromIndex + (fromRight ? 1 : -1)
    
  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index
    }
  }
  return -1
}

function findIndex (array, predicate, fromIndex) {
  var length = array == null ? 0 : length
  if (!length) {
    return -1
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex)
  if (index < 0) {
    index = natibeMax(length + index, 0)
  }
  return baseFindIndex(array, getIteratee(predicate, 3), index)
}

function getIteratee () {
  var result = lodash.iteratee || iteratee
  result = result === iteratee ? baseIteratee : result
  return arguments.length ? result(arguments[0], arguments[1]) : result
}
```

*该方法ES6已有*

### _flatten

Flattens array a single level deep.

```js
// 还是基于一个基本的扁平化处理
function baseFlatten (array, depth, predicate, isStrict, result) {
  // 上面已经有了
}

function flatten(array) {
  var length = array == null? 0: array.length
  return length ? baseFlatten(array, 1) : []
}

function flattenDeep(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, INFINITY) : [];
}

function flattenDepth(array, depth) {
var length = array == null ? 0 : array.length;
if (!length) {
  return [];
}
depth = depth === undefined ? 1 : toInteger(depth);
return baseFlatten(array, depth);
}
```

### _fromPairs

The inverse of _.toPairs; this method returns an object composed from key-value pairs.

```js
function (pairs) {
  var index = -1,
      length = pairs == null ? 0 : pairs.length,
      result = {}

  while (++index < length) {
    var pair = pairs[index]
    result[pair[0]] = pair[1]
  }
  return result
}
```

*很一般的处理思路*

### _indexOf

Gets the index at which the first occurrence of value is found in array using SameValueZero for equality comparisons. If fromIndex is negative, it's used as the offset from the end of array.

```js

```

### _initial

Gets all but the last element of array.

### _intersection

```js
// 了解到这个函数
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length)
  while (++index < length) {
    result[index] = iteratee(array[index], index, array)
  }
  return result
}
```

### _join

Converts all elements in array into a string separated by separator.

```js
nativeJoin = arrayProto.join

function join(array, separator) {
  return array == null ? '' : nativeJoin.call(array, separator)
}
```

### _last

Gets the last element of array.

```js
function last(array) {
  var length = array == null ? 0 : array.length
  return length ? array[length -1] : undefined
}
```

### _lastIndexOf

This method is like _.indexOf except that it iterates over elements of array from right to left.

```js
function lastIndexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length
  if (!length) {
    return -1
  }
  var index = length
  if (fromIndex !== undefined) {
    index = toInteger(fromIndex)
    index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, lenght -1)
  }
  return value === value
    ? strictLastIndexOf(array, value, index)
    : baseFindIndex(array, baseIsNaN, index, true)
}

// 扩展
function strictLastIndexOf(array, value, index) {
  var index = fromIndex + 1
  while (index--) {
    if (array[index] === value) { // 重要的就是这个 三个等于号
      return index
    }
  }
  return index
}
```

### _nth

Gets the element at index n of array. If n is negative, the nth element from the end is returned.

```js
function nth(array, n) {
  return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
}

  function baseNth(array, n) {
    var length = array.length;
    if (!length) {
      return;
    }
    n += n < 0 ? length : 0;
    return isIndex(n, length) ? array[n] : undefined;
  }
```

### _pull

Removes all given values from array using SameValueZero for equality comparisons.

```js
function pullAll(array, values) {
  return (array && array.length && values && values.length)
    ? basePullAll(array, values)
    : array;
}
```

*原来越简化它的逻辑判断了*
