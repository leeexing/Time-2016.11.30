/**
 * 手写一下underscore
 */
_.shuffle = obj => {
  var shuffled = [], rand
  each(obj, (value, index, list) => {
    rand = Math.floor(Math.random() * (index + 1))
    shuffled[index] = shuffled[rand]
    shuffled[rand] = value
  })
  return shuffled
}

_.max = (obj, iterator, context) => {
  if (!iterator && Array.isArray(obj) && obj[0] === +obj[0]) {
    return Math.max.apply(Math, obj)
  }
  if (!iterator && _.isEmpty(obj)) {
    return -Infinity
  }
  var result = {
    computed: -Infinity
  }
  each(obj, (value, index, list) => {
    var computed = iterator ? iterator.call(context, value, index, list) : value
    computed >= result.computed && (
      result = {
        value,
        computed
      }
    )
  })
  return result.value
}