//index.js
//获取应用实例
const app = getApp()
let context = null;// 使用 wx.createContext 获取绘图上下文 context  
let canvasw = 0;
let canvash = 0; 
let hat = {
  url: "../img/hat2.png",
  w: 50,
  h: 50,
  x: 100,
  y: 100,
  b: 1,//缩放的倍率
  rotate: 0//旋转的角度
} 
wx.getSystemInfo({
  success: res => {
    canvasw = res.windowWidth;//设备宽度  
    canvash = res.windowHeight;
  }
}); 
Page({
  data: {
    hasHat:false,
    src:'',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.src = app.globalData.userInfo.avatarUrl;
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.src = res.userInfo.avatarUrl;
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.src = res.userInfo.avatarUrl;
        }
      })
    }
  },
  drawCanvas:function() {
    context = wx.createCanvasContext('myCanvas');
    context.drawImage(this.src, ((canvasw-256)/2), 0, 256, 256)
    context.draw()
  },
  addHat: function () {
    if (!this.hasHat){
      this.hasHat = true;
      this.drawCanvas()
      context.translate(hat.x, hat.y)
      context.scale(hat.b, hat.b)
      context.rotate(hat.rotate * Math.PI / 180)
      context.drawImage(hat.url, -hat.w / 2, -hat.h / 2, hat.w, hat.h)
      context.draw(true)
    }
  },
  setZoom: function (e) {
    hat.b = e.detail.value
    hat.w = 0.5 * hat.b
    hat.h = 0.5 * hat.b
    this.setHat();
  },
  setAngle: function (e) {
    hat.rotate = 4 * e.detail.value 
    this.setHat();
  },
  moveHat: function (e) {
    hat.x = e.touches[0].x
    hat.y = e.touches[0].y
    this.setHat();
  },
  setHat:function () {
    this.drawCanvas(true)
    context.translate(hat.x, hat .y)
    context.scale(hat.b, hat.b)
    context.rotate(hat.rotate * Math.PI / 180)
    context.drawImage(hat.url, -hat.w / 2, -hat.h / 2, hat.w, hat.h)
    context.draw(true)
  }, 
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
