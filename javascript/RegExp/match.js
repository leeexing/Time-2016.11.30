/**
 * String.prototype.match
 */

 // 重点说明的式。如果match函数加了／g标志位，返回的数组里只包含整段字符串的匹配。

'./actions.js'.match(/\.\/(\w*)\.js$/)
// ["./actions.js", "actions", index: 0, input: "./actions.js", groups: undefined]

'./actions.js'.match(/\.\/(\w*)\.js$/g)
// ["./actions.js"]

// 解决办法就是使用 exec
/\.\/(\w*)\.js$/g.exec('./actions.js')
//["./actions.js", "actions", index: 0, input: "./actions.js", groups: undefined]

// 项目中遇到的一个例子
const cookieStr = 'access=0; Hm_lvt_36821d78221c3d917f48a439f723a8ed=1538961063; Hm_lvt_47893ac5fd4773efdea6440a8962fcae=1540518254; Hm_lpvt_47893ac5fd4773efdea6440a8962fcae=1540544588; Hm_lpvt_36821d78221c3d917f48a439f723a8ed=1540792096; nsts_ticket=%7B%22access_token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJEMDc0RTZBNjRFRTFGRUU0M0FBODZFNzRDMTRFNjc4MSIsImlhdCI6MTU0MDc5MjEyOCwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiODY0MDAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjM2ODY0MzIyOTk1OTcwNDE2NjQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoi5a2m5ZGYczEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdHVkZW50IiwiT3JnSUQiOiIzNjg2NDMyMDQ3MzU1NzkzNDA4IiwiRW50ZXJwcmlzZUNvZGUiOiIzMDAiLCJuYmYiOjE1NDA3OTIxMjgsImV4cCI6MTU0MDg3ODUyOCwiaXNzIjoiTlNUUy5OVUNURUNILkNPTSIsImF1ZCI6Ik5TVFNfVVNFUiJ9.iz_0BKLGi10PfAYelVKkArrFvPeSyjbwOqGTeF8PJBk%22%2C%22expires_in%22%3A86400%2C%22start_date%22%3A%221540792128%22%2C%22userID%22%3A%223686432299597041664%22%2C%22userName%22%3A%22%E5%AD%A6%E5%91%98s1%22%2C%22type%22%3A3%2C%22typeName%22%3A%22%E5%AD%A6%E5%91%98%22%2C%22enterpriseCode%22%3A%22300%22%2C%22avatar%22%3Anull%2C%22theme%22%3A0%7D'
const ck = decodeURIComponent(cookieStr)
console.log(
  ck,
  ck.match(/(nsts_ticket=)({.*})/g),
  ck.match(/"userName":"(.*?)"/g),
  RegExp.$1,
  RegExp.$2
  // ck.match(/"userName":"(.*?)"/)[1]
)
