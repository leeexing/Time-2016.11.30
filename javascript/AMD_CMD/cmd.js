/**
 * 模块同步加载
 * 下面的两个 jquery 模块加载都是没有结果的
 * 以为 jquery 本省就没有 🔺模块化🔻
 */
seajs.config({
  // alias: { 'jquery': 'https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js' }
  // alias: { 'jquery': './lib/jquery-1.12.1.min.js' }
  // alias: { 'jquery': './jquery.js' }
})

seajs.use(['./lib/seeking.js'], function(SEE) {
  console.log(SEE)
  console.log(SEE.min(9, 5))
  SEE.find('.header')
})