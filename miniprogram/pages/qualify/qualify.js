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
    schoolState: '',
    schoolName: '',
    img: '../../images/jiahao2.png',
    imgID: '',
  },

  //here
  radioChange: function (e) {
    this.setData({
      schoolState: e.detail.value,
    })
  },

  inputSchoolName:function(e){
    this.setData({
      schoolName:e.detail.value
    })
  },

  /* 用户长按图片 */
  onLongTapImg: function (e) {
    if (this.data.img != '../../images/jiahao2.png') {
      wx.showModal({
        title: '提示',
        content: '要删除这张图片吗？',
        success: res => {
          if (res.confirm) {
            console.log('点击确定了');
            this.setData({
              img: '../../images/jiahao2.png'
            })
            wx.cloud.deleteFile({
              fileList: [this.data.imgID],
              /* 这里要传数组来的 */
              success: res => {
                console.log("删除服务器图片成功");
                this.setData({
                  imgID: '',
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
    if (this.data.img == '../../images/jiahao2.png') {
      var that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          res.tempFilePaths.forEach(tempImg => {
            const cloudPath = 'zixunImages-' + app.globalData.id + '-' + time.getFullYear() + (time.getMonth() + 1) + time.getDate() + time.getHours() + time.getMinutes() + time.getSeconds() + Math.random() * 100; /* 上传图片的云地址(加时间保证独立性) */
            const filePath = tempImg; /* 这里好像非要const才传的进去 */
            this.setData({
              img: filePath,
            })
            // 上传图片
            wx.showLoading({
              title: '上传图片中...',
            })
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log('[上传文件] 成功：', res.fileID)
                this.setData({
                  imgID: res.fileID,
                })
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
        }
      })
    } else {
      wx.previewImage({
        urls: [this.data.img],
      })
    }
  },

  /* 用户点击提交 */
  shareFormSubmit: function (e) {
    /* check */
    if (this.data.schoolState == '') {
      wx.showToast({
        title: '请选择是否在读',
        icon: 'none'
      })
    }else if(this.data.schoolName == ''){
      wx.showToast({
        title: '请输入学信网截图中的学校名称',
        icon: 'none'
      })
    } 
    else if (this.data.imgID == '') {
      wx.showToast({
        title: '请上传学信网姓名编号的截图',
      })
    } else {
      wx.showToast({
        title: '申请验证成功',
      })
      /* 给管理员发信 */
      db.collection('userInfo').where({
        _super: true
      }).get({
        success: res => {
          var users = res.data;
          var Mess = {
            userInfo: app.globalData.userInfo,
            user_id: app.globalData.id,
            state: 1,
            needAgreeButton: true,
            needImg:true,
            content: '请求进行学校认证',
            imgID:this.data.imgID,
            schoolName:this.data.schoolName,
            schoolState:this.data.schoolState,
            time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
            type:'用户认证'
          }
          users.forEach(u => {
            db.collection('userInfo').doc(u._id).update({
              data: {
                messages: _.push(Mess),
              },
              success:res=>{
                console.log('[root] [申请发布项目] 成功',u._id)
              }
            })
          })
        }
      });

      wx.navigateBack({
        complete: (res) => {},
      })
    }
  },

  /* 返回原界面 */
  onTapReturn: function () {
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