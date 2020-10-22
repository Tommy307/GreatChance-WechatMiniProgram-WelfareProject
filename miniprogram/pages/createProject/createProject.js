// pages/createProject/createProject.js
const app = getApp();
const db=wx.cloud.database();
const _=db.command;
var time = new Date();
var labelArray = ['乡村教育', '乡村振兴', '志愿招募', '基层调研'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectName: '...',
    proid: '',

    labelArray: ['乡村教育', '乡村振兴', '志愿招募', '基层调研'],
    projectLabel: '请选择项目类型',
    labelColor: '#777',
    disLabelvHour: 'none',
    vHour: '',
    needCertification: false,
    disInputEmail: 'none',
    email: '...',

    coverImage: '../../images/jiahao2.png',
    coverImageID: '',
    pickerImg: '../../images/zuojiantou.png',

    projectInformation: '...',
    countProjectInformationWords: 0,

    projectContent: '...',
    countProjectContentWords: 0,

    projectImages: ['../../images/jiahao2.png'],
    projectImagesID: [],
    disImg: ['', 'none', 'none'],
    imagesCount: 0,

    memberNum: -1,
    startDate: '...',
    endDate: '...',
  },

  /* 输入项目名称 */
  onInputProjectName: function (e) {
    this.setData({
      projectName: e.detail.value,
    })
  },

  /* 成员数目输入 */
  memberNumInputChange: function (e) {
    var n = e.detail.value;
    if (n < 0 || n > 100) {
      wx.showToast({
        title: '请输入0~100的队友数目',
      })
    }
    this.setData({
      memberNum: n
    })
  },

  /* 起止时间选择 */
  bindStartDateChange: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },

  bindEndDateChange: function (e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  /* 选择项目类型 */
  bindPickerChange: function (e) {
    var label = labelArray[e.detail.value];
    this.setData({
      projectLabel: label,
      labelColor: 'rgb(255, 196, 4)',
      disLabelvHour: '',
    })
    if (label == '乡村教育') {
      this.setData({
        vHour: '10h/人'
      })
    } else if (label == '志愿招募') {
      this.setData({
        vHour: '60h/人' //(公益项目运营每期3个月时长)
      })
    } else if (label == '乡村振兴') {
      this.setData({
        vHour: '30h/人'
      })
    } else if (label == '基层调研') {
      this.setData({
        vHour: '50h/人'
      })
    }
  },

  /* 是否需要公益时证明 */
  onCheckVHour: function (e) {
    if (this.data.needCertification) {
      this.setData({
        needCertification: false,
        disInputEmail: 'none'
      })
    } else {
      this.setData({
        needCertification: true,
        disInputEmail: '',
      })
    }
  },

  /* 邮箱输入 */
  onInputEmail: function (e) {
    this.setData({
      email: e.detail.value
    })
  },

  /* 简介输入 */
  textAreaChange: function (e) {
    this.setData({
      countProjectInformationWords: e.detail.value.length,
      projectInformation: e.detail.value
    })
  },

  /* 正文输入 */
  CtextAreaChange: function (e) {
    this.setData({
      countProjectContentWords: e.detail.value.length,
      projectContent: e.detail.value
    })
  },

  /* 上传项目封面 */
  onTapCoverImg: function () {
    if (this.data.coverImage != '../../images/jiahao2.png') {
      wx.previewImage({
        urls: [this.data.coverImage],
      })
    } else {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          const filePath = res.tempFilePaths[0];
          const cloudPath = 'CoverImage-' + app.globalData.id + '-' + time.getFullYear() + (time.getMonth() + 1) + time.getDate() + time.getHours() + time.getMinutes() + time.getSeconds() + 'randomNum' + Math.random() * 100;
          this.setData({
            coverImage: filePath,
          }) /* 这个地方用不了this，就在函数里面。。。定义一个that */
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
                coverImageID: res.fileID
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
        }
      })
    }
  },

  /* 删除项目封面 */
  onLongTapCoverImg: function () {
    if (this.data.coverImage != '../../images/jiahao2.png') {
      wx.showModal({
        title: '提示',
        content: '要删除封面图片吗?',
        success: res => {
          if (res.confirm) {
            wx.cloud.deleteFile({
              fileList: [this.data.coverImageID],
              success: res => {
                console.log('删除服务器封面图片成功')
              }
            })
          }
        }
      })
      this.setData({
        coverImage: '../../images/jiahao2.png',
        coverImageID: '',
      })
    }
  },

  /* 用户长按图片 */
  onLongTapImg: function (e) {
    var n = e.target.dataset.n;
    if (this.data.projectImages[n] != '../../images/jiahao2.png') {
      wx.showModal({
        title: '提示',
        content: '要删除这张图片吗？',
        success: res => {
          if (res.confirm) {
            console.log('点击确定了');
            var imgs = this.data.projectImages;
            imgs.splice(n, 1);
            this.setData({
              imagesCount: this.data.projectImagesID.length - 1,
            })
            if (imgs[imgs.length - 1] != '../../images/jiahao2.png') {
              imgs.push('../../images/jiahao2.png')
            }
            if (imgs.length <= 3) {
              this.setData({
                disImg: ['', 'none', 'none'],
              })
            } else if (imgs.length <= 6) {
              this.setData({
                disImg: ['', '', 'none'],
              })
            } else {
              this.setData({
                disImg: ['', '', ''],
              })
            }
            this.setData({
              projectImages: imgs,
            })
            wx.cloud.deleteFile({
              fileList: [this.data.projectImagesID[n]],
              /* 这里要传数组来的 */
              success: res => {
                console.log("删除服务器图片成功");
                var imgsID = this.data.projectImagesID;
                imgsID.splice(n, 1);
                this.setData({
                  projectImagesID: imgsID,
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
    if (this.data.projectImages[n] == '../../images/jiahao2.png') {
      var imgs = this.data.projectImages;
      var imgsID = this.data.projectImagesID;
      var that = this;
      wx.chooseImage({
        count: 9 - n,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          imgs.pop(); /* 把默认的弹走,不能太早pop啦啦啦啦啦 */
          res.tempFilePaths.forEach(tempImg => {
            const cloudPath = 'projectImages-' + app.globalData.id + '-' + time.getFullYear() + (time.getMonth() + 1) + time.getDate() + time.getHours() + time.getMinutes() + time.getSeconds() + imgs.length + Math.random() * 100; /* 上传图片的云地址(加时间保证独立性) */
            const filePath = tempImg; /* 这里好像非要const才传的进去 */
            imgs.push(filePath);
            // 上传图片
            wx.showLoading({
              title: '上传图片中',
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
          that.setData({
            imagesCount: imgs.length,
          })
          if (imgs.length < 9) {
            imgs.push('../../images/jiahao2.png')
          }
          if (imgs.length <= 3) {
            that.setData({
              disImg: ['', 'none', 'none'],
            })
          } else if (imgs.length <= 6) {
            that.setData({
              disImg: ['', '', 'none'],
            })
          } else {
            that.setData({
              disImg: ['', '', ''],
            })
          }
          that.setData({
            projectImages: imgs,
            projectImagesID: imgsID,
          })
        }
      })
    } else if (n < this.data.projectImages.length) {
      wx.previewImage({
        urls: [this.data.projectImages[n]],
      })
    }
  },

  /* *********表单提交********* */
  projectFormSubmit: function (e) {
    if (this.data.projectLabel == '请选择项目类型') {
      wx.showToast({
        title: '请选择项目类型',
        icon: 'none',
      })
    } else if (this.data.needCertification && this.data.email == '...') {
      wx.showToast({
        title: '请填写邮箱，或者选择不需要线下公益时证明',
        icon: 'none',
      })
    } else if (this.data.projectName == '...') {
      wx.showToast({
        title: '请填写项目名称',
        icon: 'none',
      })
    } else if (this.data.startDate == '...' || this.data.endDate == '...') {
      wx.showToast({
        title: '请完整选择项目的起止时间',
        icon: 'none',
      })
    } else if (this.data.memberNum == -1) {
      wx.showToast({
        title: '请输入项目需要的队友数目',
        icon: 'none'
      })
    } else if (this.data.projectInformation == '...') {
      wx.showToast({
        title: '请填写项目简介',
        icon: 'none',
      })
    } else if (this.data.projectContent == '...') {
      wx.showToast({
        title: '请填写项目正文',
        icon: 'none',
      })
    } else {
      /* 封面为空，加上默认封面 */
      if (this.data.coverImageID == '') {
        if (this.data.projectLabel == '乡村教育') {
          this.setData({
            coverImageID: 'cloud://greatchancecloud-5lau2.6772-greatchancecloud-5lau2-1301741948/projectImages-42d70ff05e843f7a003004b0740a94a7-202047183114056.76107942467694',
          })
        } else if (this.data.projectLabel == '乡村振兴') {
          this.setData({
            coverImageID: 'cloud://greatchancecloud-5lau2.6772-greatchancecloud-5lau2-1301741948/projectImages-42d70ff05e843f7a003004b0740a94a7-202047183624020.810595893779183'
          })
        } else if (this.data.projectLabel == '志愿招募') {
          this.setData({
            coverImageID: 'cloud://greatchancecloud-5lau2.6772-greatchancecloud-5lau2-1301741948/projectImages-42d70ff05e843f7a003004b0740a94a7-20204718362417.348953924809831'
          })
        } else if (this.data.projectLabel == '基层调研') {
          this.setData({
            coverImageID: 'cloud://greatchancecloud-5lau2.6772-greatchancecloud-5lau2-1301741948/projectImages-42d70ff05e843f7a003004b0740a94a7-202047183624285.52153483622698'
          })
        }
      }
      /* 创建记录 */
      var updateTime=time.getFullYear() +"-"+ (time.getMonth() + 1) +"-"+ time.getDate() +"-"+ time.getHours() +"-"+ time.getMinutes();
      db.collection('Projects').add({
        data: {
          /* 这里用的是数据库的id，而非openid，便于对userInfo数据库的更新 */
          sponsor: app.globalData.id,
          sponsorInfo:{},
          sponsorQualified: app.globalData.isQualified,
          needCertification: this.data.needCertification,
          sponsorEmail: this.data.email,
          memberNum: this.data.memberNum,
          member: [],
          projectName: this.data.projectName,
          projectCoverImageID: this.data.coverImageID,
          projectImagesID: this.data.projectImagesID,
          projectLabel: this.data.projectLabel,
          projectInformation: this.data.projectInformation,
          projectContent: this.data.projectContent,
          projectState: "待审核",
          startDate: this.data.startDate,
          endDate: this.data.endDate,
          goodNum: 0,
          comments: [],
          collectNum: 0,
          vHour: this.data.vHour,
          isGood: false,
          isCollected: false,
          updateTime:updateTime,
          // userInfo:{},
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          this.setData({
            proid: res._id,
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          wx.showToast({
            title: '发布项目成功，请等待后台审核',
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
                proid: this.data.proid,
                state: 1,
                needAgreeButton: true,
                type:'发布项目',
                content: '申请发布项目'+this.data.projectName, 
                time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
              }
              users.forEach(u => {
                console.log(Mess);
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
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '项目发布失败，请检查网络状态'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })

      wx.navigateBack({
        complete: (res) => {},
      })
    }
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
    wx.navigateBack({
      complete: (res) => {},
    })
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