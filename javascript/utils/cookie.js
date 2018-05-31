/**
 * 设置 cookie
 */

// cookie<存>
function setCookie (cname, cvalue, exdays) {
  let d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  let expires = `expires=${d.toUTCString()}`
  console.log(cname + '=' + 'leeing' + '; ' + expires)
  document.cookie = `${cname}=${cvalue}; ${expires}`
}

// cookie<取>
function getCookie (cname) {
  let arr, reg = new RegExp(`(^| )${cname}=([^;]*)(;|$)`)
  if (arr = document.cookie.match(reg)) {
    return arr[2]
  }
  return null
}

// cookie<删>
function delCookie (cname) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cvalue = getCookie(cname)
  if (cvalue) {
    document.cookie = `${cname}=${cvalue};expires=${exp.toUTCString()}`
  }
}

export default {
  setCookie,
  getCookie,
  delCookie
}
