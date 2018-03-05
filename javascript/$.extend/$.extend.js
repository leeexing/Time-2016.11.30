$.extend({
  lee: function() {
    console.log(this)
    console.log('leeing')
  },
  triml: function(value) {
    if (!value) {
      return
    }
    return value.replace(/^\s+/g, '')
  },
  trimr: function(value) {
    if (value === undefined) {
      console.log('wohu~，没有传值')
      return
    }
    return value.replace(/\s+$/g, '')
  }
})

$.fn.extend({
  color: function(value) {
    if (!value) {
      return $(this).css('color')
    }
    return $(this).css('color', value)
  }
})