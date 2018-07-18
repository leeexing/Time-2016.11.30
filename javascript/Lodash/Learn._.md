# underscore

## _identity

```js
function identity(value) {
  return value
}

function isFunction(obj) {
  return typeof obj === 'function' || false
}

function isObject(obj) {
  let type = typeof obj
  return type === 'function' || type === 'object' && !!obj
}

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}
```

## 这几个函数真的一开始把我搞懵了

```js
const cb = function(value, context, argCount) {
  if (_.iteratee !== builtinIteratee) return _.iteratee(value, context)
  if (value == null) return _.identity
  if (_.isFunction(value)) return optimizeCb(value, context, argCount)
  if (_.isObject(value) && _.isArray(value)) return _matcher(value)
  return _.property(vlaue) 
}

_.iteratee = builtinInteratee = function(value, context) {
  return cb(value, context, Infinity)
}

const optimizeCb = function(func, context, argCount) {
  // 不需要绑定上下文，直接返回函数
  if (context === viod 0) return func
  switch (argCount == null ? 3 : argCount) {
    // 简单的绑定函数；偏函数应用
    case 1: return function(value) {
      return func.call(context, value)
    }
    // 一般的 each、map 迭代函数
    case 3: return function(value, index, collection) {
      return func.call(context, value, index, collection)
    }
    // reduce 的时候使用
    case 4: return function(accumulator, value, index, collection) {
      return func.call(context, accumulator, value, index, collection)
    }
  }
  // 都不是的情况下，默认返回一个偏函数
  return function() {
    return func.apply(context, arguments)
  }
}
```

## 这个创建对象函数有点意思。具体和 Object.create 区别开来

```js
const baseCreate = function(prototype) {
  if (!_.isObject(prototype)) return {}
  if (Object.create) return Object.create(prototype)
  let Ctor = function(){}
  Ctor.prototype = prototype
  let result = new Ctor()
  Ctor.prototype = null
  return result
}
```

## _isArrayLike

```js
function shallowProperty = key => obj => obj[key] == null ? void 0 : obj[key]

var getLength = shallowProperty('length')

function isArrayLike (collection) {
  var length = getLength(collection)
  return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX
}
```

## _each

```js
var _each = function(obj, iteratee, context) {
  if (isArrayLike(obj)) {
    for (var i=0, length = obj.length; i < length; i++) {
      obj[i] = iteratee(obj[i], i, obj)
    }
  } else {
    var keys = Object.keys(obj)
    for (var i = 0, length = keys.length; i < length; i++) {
      obj[keys[i]] = iteratee(obj[keys[i]], keys[i], obj)
    }
  }
  return obj
}
```

## _map

```js
_map = function(obj, iteratee, context) {
  iterate = cb(iteratee, context)
  var keys = isArrayLike(obj) && Object.keys(obj)
  var length = (keys || obj).length
  var result = Array(length)
  for (var i = 0; i < length; i++) {
    var curIndex = keys ? keys[i] : i
    result[i] = iteratee(obj[curIndex], curIndex, obj)
  }
  return result
}
```

*真的是有在做简化操作*

## _createReduce

```js
const createReduce = function(dir) {
  const reducer = function(obj, iteratee, memo, initial) {
    let keys = isArrayLike(obj) && Object.keys(obj),
        length = (keys || obj).length,
        index = dir > 0 ? 0 : length - 1
    if (!initial) {
      memo = obj[keys ? keys[index] : index]
      index += dir
    }
    for (; index >= 0 && index < length; index += dir) {
      let currentIndex = keys ? keys[index] : index
      memo = iteratee(memo, obj[currentIndex], currentIndex, obj)
    }
    return memo
  }
  return function(obj, iteratee, memo, context) {
    return reducer(obj, optimizeCb(iteratee, context, 4), memo, intitial)
  }
}

_reducer = createReduce(1)

_reducerRight = createReduce(-1)
```

## _find

```js
const find = function(obj, predicate, context) {
  let keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey
  let key = keyFinder(obj, predicate, context)
  if (key !== void 0 && key !== -1) {
    return obj[key]
  }
}

const findIndex = createPredicateIndexFinder(1)

const createPredicateIndexFinder = function(dir) {
  return function(array, predicate, context) {
    predicate = cb(predicate,context)
    let length = getLength(array)
    let index = dir > 0 ? 0 : length - 1
    for (; index >= 0 && index < length; index += dir) {
      if (predicate(array[index], index, array)) {
        return index
      }
    }
    return -1
  }
}
```

## _filter

```js
const filter = function(obj, predicate, context) {
  let result = []
  predicate = cb(predicate, context)
  each(obj, function(value, index, list) {
    if (predicate(value, index, list)) {
      result.push(value)
    }
  })
  return result
}
```

## _reject

```js
const reject = function(obj, predicate, context) {
  return filter(obj, negate(cb(predicate), context))
}

const negate = function(predicate) {
  return function() {
    return !predicate.apply(this, arguments)
  }
}

let negatee = predicate => (...args) => !predicate.apply(this, args)
```
