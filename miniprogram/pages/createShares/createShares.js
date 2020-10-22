// miniprogram/pages/createShares/createShares.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
const time = new Date();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    _id: '',
    shareSubject: '',
    zixunImages: ['../../images/jiahao2.png'],
    zixunImagesID: [],
    imagesCount:0,

    currentTopic: '无话题(默认)',
    shareTopics: [],
    pickerImg: '../../images/zuojiantou.png',
    disTopics: 'none',

    shareInformation: '',

    countShareInformationWords: 0,
    /* toast */
    contentToast: '1~1500',
    contentToastColor: ''
  },

  subjectInputChange: function (e) {
    this.data.shareSubject = e.detail.value;
  },

  onTapPicker: function (e) {
    /* console.log('picker发送选择改变，携带值为', e.detail.value) */
    if (this.data.disTopics == 'none') {
      this.setData({
        disTopics: '',
        pickerImg: '../../images/xiajiantou.png',
      })
    } else {
      this.setData({
        disTopics: 'none',
        pickerImg: '../../images/zuojiantou.png'
      })
    }
  },

  onChooseTopic: function (e) {
    this.setData({
      currentTopic: e.target.dataset.topic,
      disTopics: 'none',
      pickerImg: '../../images/zuojiantou.png'
    })
  },

  textAreaChange: function (e) {
    this.setData({
      countShareInformationWords: e.detail.value.length,
      shareInformation: e.detail.value
    })
  },

  /* 用户长按图片 */
  onLongTapImg: function (e) {
    var n = e.target.dataset.n;
    if (this.data.zixunImages[n] != '../../images/jiahao2.png') {
      wx.showModal({
        title: '提示',
        content: '要删除这张图片吗？',
        success: res => {
          if (res.confirm) {
            console.log('点击确定了');
            var imgs = this.data.zixunImages;
            imgs.splice(n, 1);
            if(imgs[imgs.length-1]!='../../images/jiahao2.png'){
              imgs.push('../../images/jiahao2.png')
            }
            this.setData({
              zixunImages: imgs,
              imagesCount:this.data.zixunImagesID.length-1,
            })
            wx.cloud.deleteFile({
              fileList: [this.data.zixunImagesID[n]],
              /* 这里要传数组来的 */
              success: res => {
                console.log("删除服务器图片成功");
                var imgsID = this.data.zixunImagesID;
                imgsID.splice(n, 1);
                this.setData({
                  zixunImagesID: imgsID,
                  imagesCount:imgsID.length,
                })
              }
            })
          } else if (res.cancel) {
            console.log('点击取消了');
          }
        }
      })
    }
  },

  /* 用户点击图片 */
  onTapImg: function (e) {
    var n = e.target.dataset.n;
    if (this.data.zixunImages[n] == '../../images/jiahao2.png') {
      var imgs = this.data.zixunImages;
      var imgsID = this.data.zixunImagesID;
      var that = this;
      wx.chooseImage({
        count: 3 - n,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          imgs.pop(); /* 把默认的弹走 */
          res.tempFilePaths.forEach(tempImg => {
            const cloudPath = 'zixunImages-' + app.globalData.id + '-' + time.getFullYear() + (time.getMonth() + 1) + time.getDate() + time.getHours() + time.getMinutes() + time.getSeconds() + imgs.length+Math.random()*100; /* 上传图片的云地址(加时间保证独立性) */
            const filePath = tempImg; /* 这里好像非要const才传的进去 */
            imgs.push(filePath);
            // 上传图片
            wx.showLoading({
              title: '上传图片中...',
            })
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log('[上传文件] 成功：', res.fileID)
                imgsID.push(res.fileID);
              },
              fail: e => {
                console.error('[上传文件] 失败：', e)
                wx.showToast({
                  icon: 'none',
                  title: '上传失败,请检查网络设置',
                })
              },
              complete: () => {
                wx.hideLoading()
              }
            })
          })
          /* 在加入加号图之前 */
          that.setData({
            imagesCount:imgs.length,
          })
          if (imgs.length < 3) {
            imgs.push('../../images/jiahao2.png')
          }
          that.setData({
            zixunImages: imgs,
            zixunImagesID: imgsID,
          })
        }
      })
    } else if (n < this.data.zixunImages.length) {
      wx.previewImage({
        urls: [this.data.zixunImages[n]],
      })
    }
  },

  /* 用户点击提交 */
  shareFormSubmit: function (e) {
    /* check */
    if (this.data.shareInformation == '') {
      wx.showToast({
        title: '沉默是金,但不能发布哦！',
        icon: 'none'
      })
      this.setData({
        contentToast: "还请输入正文内容。",
        contentToastColor: "#555"
      })
    } else {
      if (this.data.currentTopic == "无话题(默认)") {
        this.setData({
          currentTopic: ''
        })
      }
      db.collection('Shares').add({
        data: {
          _user: app.globalData.userInfo,
          _userID: app.globalData.id,
          shareSubject: this.data.shareSubject,
          shareTopic: this.data.currentTopic,
          shareInformation: this.data.shareInformation,
          imageID: this.data.zixunImagesID,
          goodNum: 0,
          isGood:false,
          comments:[],
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          wx.showToast({
            title: '发布资讯成功',
          })
          this.setData({
            _id: res._id
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          wx.navigateBack({
            complete: (res) => {},
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }
  },

  /* 返回原界面 */
  onTapReturn:function(){
    wx.navigateBack({
      complete: (res) => {},
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.currentTopic) {
      this.setData({
        currentTopic: app.globalData.currentTopic
      })
      app.globalData.currentTopic = null;
    }
    db.collection('shareTopics').get({
      success: res => {
        var topics = ['无话题(默认)'];
        res.data.map(function (v) {
          return v.topic
        }).forEach(topic => {
          topics.push(topic)
        })
        this.setData({
          shareTopics: topics,
        })
      }
    })

    /* 调试用，记得删 */
    wx.getUserInfo({
      complete: (res) => {
        app.globalData.userInfo = res.userInfo
      },
    })
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