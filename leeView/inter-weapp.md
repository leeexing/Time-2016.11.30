# inter-weapp

> 小程序

## 有用的UI库

REFER: https://www.jianshu.com/p/4182f4a18cb6

### ColorUI

ColorUI是一个Css类的UI组件库！不是一个Js框架。相比于同类小程序组件库，ColorUI更注重于视觉交互！

## 生命周期

```js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: [],
    months: [],
    nowmax: 0,
    nowmin: 0
  },

  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
```
