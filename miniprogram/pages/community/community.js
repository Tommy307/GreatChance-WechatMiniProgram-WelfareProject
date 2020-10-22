// miniprogram/pages/community/community.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const time = new Date();
const APPID = 'wx5d581499ee7eb9ba';
const APPSECRET = 'fe07b5ea91dde8edf6a12d4cd130c8ba';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //super
    encryptedData: '',
    iv: '',
    code: undefined,
    disAttention: 'none',
    disPrivacy: 'none',
    clientAttention: '',
    isFresh: false,
    _super: false,
    /* 引导页 */
    disWelcomePage: '',
    userInfo: {},
    logged: false,
    getUserId: false,
    takeSession: false,
    requestResult: '',

    bottomImg: ['../../images/项目图标（未选中）@2x.png', '../../images/项目图标（选中）@2x.png', '../../images/社区图标（未选中）@2x.png', '../../images/社区图标（选中）@2x.png', '../../images/我的图标（未选中）@2x.png', '../../images/我的图标（选中）@2x.png'], //底部分区
    disBottomImg: ['', 'none', 'none', '', '', 'none'],
    /* 未选中在前 */
    disFootLine: '',
    disCreateButton: "none", //是否显示创建按钮
    cacheProjectsR: [], //这个是分标签的

    //评论区**************************************
    disComments: 'none',
    disCommentsHeight: 0,
    commentInputHeight: '55rpx',
    comments: [],
    commentTargetId: '',
    inputComment: '',
    inputCommentReal: '', //用来清空input
    isProisShrisTop: 1,

    //用户信息面板************************************
    disUserHeight: 0,
    _user: {},
    disMyPageMess: 'none',

    //项目管理************************************
    disManageProjectPage: 'none',
    manageProjectPageDisplayProjects: [], //在下面三个之间转换
    sponsorPro: [],
    memberPro: [],
    collectPro: [],
    mpageWeight: ['bold', '400', '400'],
    mpageBorder: ['', 'hidden', 'hidden'],
    //消息
    disMessage: 'none',
    disUnread: 'none',
    unreadMess: [],
    readedMess: [],

    //社区***************************************
    disCommunity: '',
    scrollHeightPosition:-1,      // 开始设置为-1，防止直接上拉查看就刷新了
    //导航栏
    pageWeight: ['bold', '400', '400'],
    pageBorder: ['', 'hidden', 'hidden'],
    //搜索框
    disSIcon: '', //搜索的图标
    disQXIcon: 'none',
    disQXText: 'none',
    inputValue: '',
    searchContainerW: '174rpx',
    searchInputW: '140rpx',
    searchHolder: '搜索',
    focusInput: '',
    disHead: '',
    disBody: '',

    searchResultProjects: [],
    //Banner
    bannerProjects: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3500,
    duration: 1000,
    displayBanner: '',
    //项目标签入口
    displayLabels: '',
    labelColor: ['#99CCFF', '#CCCCCC', '#99CCCC', '#CCCCFF'],
    labelImg: ['cloud://greatchancecloud-5lau2.6772-greatchancecloud-5lau2-1301741948/projectImages-42d70ff05e843f7a003004b0740a94a7-202042144940034.23845892477855', 'cloud://greatchancecloud-5lau2.6772-greatchancecloud-5lau2-1301741948/projectImages-42d70ff05e843f7a003004b0740a94a7-202042144940181.83887113816711', 'cloud://greatchancecloud-5lau2.6772-greatchancecloud-5lau2-1301741948/projectImages-42d70ff05e843f7a003004b0740a94a7-202042144940244.47379138548653', 'cloud://greatchancecloud-5lau2.6772-greatchancecloud-5lau2-1301741948/projectImages-42d70ff05e843f7a003004b0740a94a7-2020421516084.55155402254562'],
    //资讯流
    shares: [],
    focus_shares: [],
    disZixun1: '', //全部资讯
    disZixun2: 'none', //关注用户的资讯
    zixunText: '热门资讯',
    //话题
    displayTopics: 'none',
    topics: [],
    //创建话题
    disCTopicHeight: 0,
    disCreateTopic:"none",
    inputTopic: '',
    createTopicInput: '',

    //项目列表*******************************************
    setLabelValue: 0,
    disProjectList: 'none',
    sortRule: '时间',
    sortState: '升序',
    disChooseSortRule: 'none',
    projects: [],
    cacheProjects: [],
    pageWeightP: ['bold', '400', '400', '400'],
    pageBorderP: ['', 'hidden', 'hidden', 'hidden'],
    projectLabelIntroImages: ['cloud://greatchancecloud-5lau2.6772-greatchancecloud-5lau2-1301741948/projectImages-42d70ff05e843f7a003004b0740a94a7-20204215256041.02720856489843', 'cloud://greatchancecloud-5lau2.6772-greatchancecloud-5lau2-1301741948/CoverImage-8abc3c855ed1d76d0006916a7ff588c0-2020530164347randomNum58.609623973190914', 'cloud://greatchancecloud-5lau2.6772-greatchancecloud-5lau2-1301741948/projectImages-42d70ff05e843f7a003004b0740a94a7-20204215256223.94451370545052', 'cloud://greatchancecloud-5lau2.6772-greatchancecloud-5lau2-1301741948/projectImages-8abc3c855ed1d76d0006916a7ff588c0-2020530164347096.00697095654513'],
    projectLabelIntroImage: '../../images/项目类型-乡村教育-正方形@2x.png',
    projectLabelIntroNames: ['乡村教育类公益项目', '乡村振兴类公益项目', '志愿招募类公益项目', '基层调研类公益项目'],
    projectLabelIntroName: '乡村教育类公益项目',
    projectLabelIntroVHours: ['10', '60', '30', '50'],
    projectLabelIntroVHour: '10',
    projectLabelIntroTexts: [
      '助力改善基层素质教育资源匮乏境况，谷仓计划面向大学生伙伴们，发起涵盖学习方法、专业介绍、语言学习、兴趣发展等主题的 “好奇心课堂”：1位大学生志愿者成功发起1次分享课，就能让30个孩子的好奇心得到满足。你也可以独立或约上伙伴组团，发起更多素质拓展小课堂，为乡村的孩子们推开世界不一样的那扇窗。仓主大人，不妨一试？',
      '如何帮助农户提升农产品附加值？乡村垃圾分类怎么破？艺术创造能唤醒乡村带来第二个越后妻有吗？……助力乡村振兴，青年大有可为。乡村经济、政治、文化、社会、生态文明和党建“六大建设”，总有地方等待你的专业发挥！提交的项目方案针对性越强，实现的可能性越高哦！',
      '以尊重大学生志愿者们的热情、善良和创造力为出发点，我们致力于打造一个优质、理性而不失温度的青年公益交流社区。在这里可以寻找或者发布志愿者招募信息，可以深入讨论公益话题，更能体验跟伙伴组团在线做公益的神奇协作功能。谷仓计划第一期运营志愿者招募现已正式启动，期待你的到来。',
      '我们致力于打造链接基层一线与高校师生的在线平台，让基层被更多年轻人看见，让年轻人看见真实的基层。在这里，我们会不定期发布基层调研需求主题，并可长期对接高校调研申请。敬请期待。'
    ],
    projectLabelIntroText: '...',
    commentIcon: '../../images/项目详情底部栏-评论按钮@2x.png',
    BorderS: ['', 'none', 'none'],
    WeightS: ['bold', '400', '400'],

    //项目详情页********************************************************
    disProjectDetailPage: 'none',
    chooseProject: {},
    chooseProjectUserName: '',
    chooseProjectUserAvatar: '',
    projectDetailStateText: '',
    disProjectDetailBottomLine: '',
    isManage: false, //是否返回项目管理页
    isSearch: false,
    isMyPage: false,
    isBanner: false,
    isMine: false, //我发布的项目
    isMember: false, //我参与的项目
    disManageMember: 'none',

    disChangeInformationOrContent: 'none',
    detailTextInputSet: '',
    inputInformation: '',
    inputContent: '',
    disChangeImage: 'none',
    changeImageSet: '',
    changeInformation: false,

    coverImage: '', //项目封面
    projectImages: [], //项目配图

    //我的页面************************************************************
    disMyPage: 'none',
    disMyPageFocus: 'none',
    focusUsers: [],
    userWords: '',
    userWordsTemp: '',
    history: [],
    qualifyState: '',
    disUserWordsInput: 'none',
    disUserWords: '',
    favorPeo: [],
    favorPeoInfo: [],
    disMyPageBannerSet: 'none',

    myShares: [],
    disMyPageShares: 'none',
  },
  //Super****************************************************************************************************
  onTapFootLinePage: function (e) { //点击底层换页 项目 社区 我的
    var n = e.currentTarget.dataset.n;
    if (n == 1) { //进入项目管理
      this.setData({
        disManageProjectPage: '',
        disCommunity: 'none',
        disMyPage: 'none',
        disBottomImg: ['none', '', '', 'none', '', 'none'],
      })
      db.collection('userInfo').doc(app.globalData.id).get({
        success: res => {
          var mess = res.data.messages;
          var unread = [],
            read = [];
          mess.forEach(m => {
            if (m.state == 1) {
              unread.push(m)
            } else if (m.state == 0) {
              read.push(m)
            }
          })
          var unreadIcon = 'none';
          if (unread.length != 0) unreadIcon = ''; //要提醒用户
          this.setData({
            unreadMess: unread,
            readedMess: read,
            disUnread: unreadIcon,
          })
        }
      })
    } else if (n == 2) { //进入社区
      this.setData({
        disManageProjectPage: 'none',
        disCommunity: '',
        disMyPage: 'none',

        disBottomImg: ['', 'none', 'none', '', '', 'none'],

        disHead: '', //将搜索去掉
        disBody: '',
        searchHolder: '搜索',
        searchContainerW: '174rpx',
        searchInputW: '140rpx',
        disSIcon: '',
        disQXIcon: 'none',
        disQXText: 'none',
        inputValue: '',
        searchResultProjects: [],
        disFootLine: '', //
      })
    } else if (n == 3) { //进入我的页面
      this.setData({
        disManageProjectPage: 'none',
        disCommunity: 'none',
        disMyPage: '',
        disBottomImg: ['', 'none', '', 'none', 'none', ''],
        disMyPageMess: 'none',
        disMyPageFocus: 'none',
        disMyPageBannerSet: 'none',
      })
      db.collection('userInfo').doc(app.globalData.id).get({
        success: res => {
          var mess = res.data.messages;
          var unread = [],
            read = [];
          mess.forEach(m => {
            if (m.state == 1) {
              unread.push(m)
            } else if (m.state == 0) {
              read.push(m)
            }
          })
          var unreadIcon = 'none';
          if (unread.length != 0) unreadIcon = ''; //要提醒用户
          this.setData({
            unreadMess: unread,
            readedMess: read,
            disUnread: unreadIcon,
          })

          /* 拿历史信息 */
          var userWords = res.data.userWords;
          var history = [];
          history.push(res.data.publishProjectAndFinished);
          history.push(res.data.joinProjectAndFinished);
          history.push(res.data.publishProjectAndQuit);
          history.push(res.data.joinProjectAndBeKicked);
          var focusUsers = res.data.favorPeo;
          this.setData({
            userWords: userWords,
            history: history,
            focusUsers: focusUsers,
            qualifyState: res.data.qualifyState,
          })
        }
      })
    }
  },

  checkSettingStatu: function (cb) {
    var that = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        var authSetting = res.authSetting;
        if (isEmptyObject(authSetting)) {
          //第一次
        } else {
          // 没有授权的提醒
          if (authSetting['scope.userInfo'] === false) {
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用该小程序功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: function success(res) {
                      console.log()
                    }
                  });
                }
              }
            })
          } else if (authSetting['scope.userInfo'] === true) {
            //该处用户获取用户的一些授权信息
            if (that.data.userInfo) {
              var nickname = that.data.userInfo.nickName;
              var gender = that.data.userInfo.gender
              //性别 0：未知、1：男、2：女
              if (gender == 1) {
                gender = "True"
              } else if (gender == 2) {
                gender = "False"
              } else {
                gender = "True"
              }

            }
          }
        }
      }
    })
  },

  getUserInfo: function (e) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
              this.setData({
                userInfo: res.userInfo,
                encryptedData: res.encryptedData,
                iv: res.iv
              });

              // 调用 login 得到code之后进行服务器请求unionid
              wx.login({
                complete: (res) => {
                  this.setData({
                    code: res.code,
                  })
                  wx.showLoading({
                    title: '请求中...',
                    duration: '1000'
                  })
                  wx.request({
                    url: 'https://www.gucangjihua2020.icu:8088/decodeUserInfo',
                    method: 'POST',
                    data: {
                      wxspAppid: APPID,
                      wxspSecret: APPSECRET,
                      encryptedData: this.data.encryptedData,
                      iv: this.data.iv,
                      code: this.data.code
                    },
                    dataType: 'STRING',
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success: res => {
                      var jsonD = JSON.parse(res.data);
                      if (jsonD.userInfo != undefined) {
                        app.globalData.openid = jsonD.userInfo.unionId;
                        db.collection('userInfo').get({
                          success: res => {
                            res.data.forEach(user => {
                               /* 数据库中有该用户信息，进行缓存 */
                              if (user._openid == app.globalData.openid) {
                                console.log('[用户数据库查询]:成功)');
                                if (user._super) {
                                  wx.showToast({
                                    icon: 'none',
                                    title: 'Welcome root!',
                                    duration: 1000,
                                  })
                                }
                                app.globalData.id = user._id;
                                app.globalData.favorPeo = user.favorPeo; //关注的用户（id+info）
                                app.globalData.userInfo.isQualified = user.isQualified;
                                app.globalData.userInfo.qualifyState = user.qualifyState;
                                app.globalData.userInfo.qualifyText = user.qualifyText;
              
                                this.setData({
                                  getUserId: true,
                                })
              
                                // 进行缓存
                                /* 用户消息 */
                                db.collection('userInfo').doc(app.globalData.id).get({
                                  success: res => {
                                    // 签名、历史记录、认证信息
                                    var userWords = res.data.userWords;
                                    var history = [];
                                    history.push(res.data.publishProjectAndFinished);
                                    history.push(res.data.joinProjectAndFinished);
                                    history.push(res.data.publishProjectAndQuit);
                                    history.push(res.data.joinProjectAndBeKicked);
                                    var focusUsers = res.data.favorPeo;
                                    this.setData({
                                      _super: res.data._super,
                                      userWords: userWords,
                                      history: history,
                                      focusUsers: focusUsers,
                                      favorPeo: res.data.favorPeo,
                                      isQualified: res.data.isQualified,
                                      qualifyState: res.data.qualifyState,
                                      qualifyText: res.data.qualifyText
                                    })
              
                                    /* 拿关注用户的资讯 */
                                    db.collection("Shares").get({
                                      success: res => {
                                        console.log("here1 ", res.data);
                                        //全部资讯的缓存
                                        var cacheShares = [];
                                        res.data.forEach(s => {
                                          cacheShares.push(s);
                                        })
                                        cacheShares.reverse();
                                        //关注用户资讯的缓存
                                        var focus_shares = [];
                                        this.data.favorPeo.forEach(peo => {
                                          cacheShares.forEach(shr => {
                                            if (shr._userID == peo.id) focus_shares.push(shr);
                                          })
                                        })
                                        this.setData({
                                          focus_shares: focus_shares,
                                        })
                                        console.log('[查询数据库 Shares] 成功 [关注用户] 匹配结果数目 : ' + this.data.focus_shares.length);
                                      }
                                    })
                                    var favorPeoInfo = new Array();
                                    this.data.favorPeo.forEach(peo => {
                                      favorPeoInfo.push(peo.userInfo);
                                    })
                                    this.setData({
                                      favorPeoInfo: favorPeoInfo,
                                    })
              
                                  }
                                })
              
                                /* 资讯缓存(含关注用户的资讯的缓存2) */
                                db.collection('Shares').get({
                                  success: res => {
                                    console.log("here1 ", res.data);
                                    var cacheShares = [];
                                    res.data.forEach(s => {
                                      cacheShares.push(s);
                                    })
                                    cacheShares.reverse();
                                    this.setData({
                                      shares: cacheShares,
                                    })
              
                                    var myShares = [];
                                    cacheShares.forEach(s => {
                                      if (s._userID == app.globalData.id) {
                                        myShares.push(s);
                                      }
                                    })
                                    this.setData({
                                      myShares: myShares,
                                    })
              
                                    console.log('[数据库Shares] [查询记录] 成功: ', res)
              
                                    console.log('[查询数据库 Shares] 成功 匹配结果数目 : ' + this.data.shares.length);
                                  }
                                })
              
                                /* 项目缓存 */
                                db.collection('Projects').get({
                                  success: res => {
                                    var projects = res.data;
                                    var pro1 = [],
                                      pro2 = [],
                                      pro3 = [],
                                      pro4 = [],
                                      sponsorPro = [],
                                      collectPro = [],
                                      memberPro = [];
                                    // console.log('用户的id ', app.globalData.id)
                                    projects.forEach(pro => {
                                      if (pro.projectLabel == '乡村教育' && pro.projectState != '待审核' && pro.projectState != '已完成') pro1.push(pro);
                                      else if (pro.projectLabel == '乡村振兴' && pro.projectState != '待审核' && pro.projectState != '已完成') pro2.push(pro);
                                      else if (pro.projectLabel == '志愿招募' && pro.projectState != '待审核' && pro.projectState != '已完成') pro3.push(pro);
                                      else if (pro.projectLabel == '基层调研' && pro.projectState != '待审核' && pro.projectState != '已完成') pro4.push(pro);
                                      if (pro.sponsor == app.globalData.id) sponsorPro.push(pro);
                                      pro.member.forEach(mem => {
                                        if (mem.id == app.globalData.id) memberPro.push(pro);
                                      })
                                    })
                                    var cache = [];
                                    cache.push(pro1);
                                    cache.push(pro2);
                                    cache.push(pro3);
                                    cache.push(pro4);
                                    console.log('[数据库Projects] [查询记录] 成功:', cache);
                                    this.setData({
                                      cacheProjects: cache,
                                      cacheProjectsR: res.data,
                                      projects: cache[this.data.setLabelValue],
                                      manageProjectPageDisplayProjects: sponsorPro,
                                      sponsorPro: sponsorPro,
                                      memberPro: memberPro,
                                    })
                                    //用户收藏的项目是双重的复杂度，所以单开弄
                                    db.collection('userInfo').doc(app.globalData.id).get({
                                      success: res => {
                                        var collectedPros = res.data.favorProjects;
                                        projects.forEach(pro_ => {
                                          collectedPros.forEach(cpro => {
                                            if (cpro == pro_._id) collectPro.push(pro_)
                                          })
                                        })
                                        this.setData({
                                          collectPro: collectPro,
                                        })
                                      }
                                    });
                                  },
                                  fail: res => {
                                    console.log('[数据库Projects] [查询记录] 失败:', res);
                                  }
                                })
              
                              }
                            });
                            /* 没找到，进行创建 */
                            if (!this.data.getUserId) {
                              console.log('[数据库查询]:未找到此用户', '进行:[用户数据库创建]');
                              this.setData({
                                isFresh: true,
                              })
                              this.createUserInfo();
                            }
                          }
                        })
              
                        this.setData({
                          disWelcomePage: 'none',
                        }) //显示主页
                      } else {
                        this.getUserInfo();
                      }
                    },
                    fail:res=>{
                      console.log("Fail request for unionid!");
                    }
                  })
                },
              })
            }
          })

        } else {
          wx.showModal({
            title: '用户未授权',
            content: '如需正常使用该小程序功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
            showCancel: false,
            success: function (resbtn) {
              if (resbtn.confirm) {
                wx.openSetting({
                  success: function success(resopen) {
                    //  获取用户数据
                    that.checkSettingStatu();
                  }
                });
              }
            }
          })
        }
      }
    }) //获取用户开放信息状态

    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        userInfo: e.detail.userInfo
      })
    }
    app.globalData.userInfo = this.data.userInfo;
    wx.showLoading({
      title: '加载中',
      duration: 2000,
    })

  },

  /* onGetOpenid: function () {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid);

          wx.navigateTo({
            url: '../userConsole/userConsole',
          })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
          wx.navigateTo({
            url: '../deployFunctions/deployFunctions',
          })
        }
      })
    },
   */

  /* 创建新用户 */
  createUserInfo: function () {
    db.collection('userInfo').add({
      data: {
        _super: false,
        messages: [],
        _openid: app.globalData.openid,
        favorPeo: [],
        favorProjects: [],
        publishProjectAndFinished: 0,
        publishProjectAndQuit: 0,
        joinProjectAndFinished: 0,
        joinProjectAndBeKicked: 0,
        userInfo: app.globalData.userInfo,
        goodProjects: [],
        goodShares: [],
        favorProjects: [],
        qualifyState: '待认证',
        qualifyText: '',
        isQualified: false,
      },
      success: res => {
        app.globalData.id = res._id
        app.globalData.userInfo.isQualified = user.isQualified;
        app.globalData.userInfo.qualifyState = user.qualifyState;
        app.globalData.userInfo.qualifyText = user.qualifyText;
        this.setData({
          getUserId: true,
        })
        console.log('[新增用户]:[成功]')
        this.setData({
          disWelcomePage: "none",
        })
      }
    })
  },

  /* 点击用户头像，查看用户信息 */
  enterUserDetail: function (e) {
    var user_id = e.currentTarget.dataset.userid;
    db.collection('userInfo').doc(user_id).get({
      success: res => {
        var _user = res.data;
        this.setData({
          _user: _user,
        })
        console.log('[提取用户信息] 成功', this.data._user)
      }
    })
    this.setData({
      disUserHeight: '',
    })
  },

  /* 点击关注用户 */
  onTapFocusUser: function (e) {
    var userid = e.currentTarget.dataset.userid;
    var uinfo = {}; //必须赋值给一个对象类型，进行解码
    uinfo = e.currentTarget.dataset.userinfo;
    var isq = e.currentTarget.dataset.isqualified;
    var qs = e.currentTarget.dataset.qualifystate;
    var qt = e.currentTarget.dataset.qualifytext;
    var info = {
      avatarUrl: uinfo.avatarUrl,
      nickName: uinfo.nickName,
      isQualified: isq,
      qualifyState: qs,
      qualifyText: qt,
      focusDate: time.getFullYear() + "." + (time.getMonth() + 1) + "." + time.getDate(),
    };
    var isFocused = false;
    if(userid == app.globalData.id){
      isFocused = true;
        wx.showToast({
          icon: 'none',
          title: '请关注其它用户哦~',
        })
    }
    else{
      db.collection('userInfo').doc(app.globalData.id).get({
        success: res => {
          var user = res.data;
          
          user.favorPeo.forEach(peo => {
            if (peo.id == userid) {
              isFocused = true;
              wx.showToast({
                icon: 'none',
                title: '您已经关注过该用户了',
              })
            }
          })
          if (!isFocused) {
            var userNew = {
              id: userid,
              userInfo: info,
            }
            db.collection('userInfo').doc(app.globalData.id).update({
              data: {
                favorPeo: _.push(userNew), //数据库里记录的有id和info
              },
              success: res => {
                wx.showToast({
                  title: '关注用户成功',
                })
                console.log('[关注用户] 成功')
                var favorPeo = this.data.favorPeo;
                var focusShares = this.data.focus_shares;
                var favorPeoInfo = this.data.favorPeoInfo;
                favorPeo.push(userid);
                favorPeoInfo.push(info);
                db.collection("Shares").where({
                  _userID: userid,
                }).get({
                  success: res => {
                    res.data.forEach(shr => {
                      focusShares.push(shr);
                    })
                  }
                })
                this.setData({
                  favorPeo: favorPeo,
                  focus_shares: focusShares,
                  favorPeoInfo: favorPeoInfo,
                })
              }
            })
          }
        }
      })
    }
  },

  /* 离开用户信息 */
  onTapCancelOfUserDetail: function (e) {
    this.setData({
      disUserHeight: 0,
      _user: {},
    })
  },

  /* 社区刷新页面 
     问题在于这个事件在移动到两端的时候都会同时触发这两个事件
     解决方法我想这 
  */
  communitySharePullDownToRefresh: function(e){
    if(this.data.scrollHeightPosition == 0){
      wx.showLoading({
        duration:300,
      })
      /* 资讯缓存(含关注用户的资讯的缓存2) */
      db.collection('Shares').get({
        success: res => {
          var cacheShares = [];
          res.data.forEach(s => {
            cacheShares.push(s);
          })
          cacheShares.reverse();
          this.setData({
            shares: cacheShares,
          })
  
          var myShares = [];
          cacheShares.forEach(s => {
            if (s._userID == app.globalData.id) {
              myShares.push(s);
            }
          })
          this.setData({
            myShares: myShares,
          })
        }
      })

      this.setData({
        scrollHeightPosition: -1,   // 刷新过一次不再刷新
      })
    }
  },

  communitySharePull:function(e){
    if(e.detail.scrollTop == 0){
      this.setData({
        scrollHeightPosition:0,
      })
    }
  },


  //我的****************************************************************************************************

  /* 删除资讯 */
  tapDeleteShare: function (e) {
    var id = e.currentTarget.dataset.shareid;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否要删除改资讯',
      success: res => {
        if (res.confirm) {
          var myShares = this.data.myShares;
          var shares = this.data.shares;
          myShares.splice(index, 1);
          this.setData({
            myShares: myShares,
          })
          var sindex;
          shares.forEach((s, index) => {
            if (s._id == id) {
              sindex = index;
            }
          })
          shares.splice(sindex, 1);
          this.setData({
            shares: shares,
          })
          db.collection('Shares').doc(id).remove({
            success: res => {
              console.log('[删除资讯] 成功');
              wx.showToast({
                title: '删除成功',
              })
            }
          })
        }
      }
    })
  },

  /* 打开消息面板/关注的用户面板/Banner设置面板 */
  onTapMyPageDiv: function (e) {
    var n = e.currentTarget.dataset.n;
    if (n == 1) { //消息通知
      this.setData({
        disMyPageMess: '',
        disMyPageFocus: 'none',
        disMyPageBannerSet: 'none',
        disMyPageShares: 'none',
      })
    } else if (n == 2) { //关注的用户
      this.setData({
        disMyPageMess: 'none',
        disMyPageFocus: '',
        disMyPageBannerSet: 'none',
        disMyPageShares: 'none',
      })
    } else if (n == 3) { //主推设置
      this.setData({
        disMyPageBannerSet: '',
        disMyPageFocus: 'none',
        disMyPageMess: 'none',
        disMyPageShares: 'none',
      })
      db.collection('bannerProjects').get({
        success: res => {
          this.setData({
            bannerProjects: res.data,
          })
        }
      })
    } else if (n == 4) { //资讯管理
      this.setData({
        disMyPageMess: 'none',
        disMyPageFocus: 'none',
        disMyPageBannerSet: 'none',
        disMyPageShares: '',
      })
      db.collection('SHares').get({
        success: res => {
          var myShares = [];
          res.data.forEach(s => {
            if (s._userID == app.globalData.id) {
              myShares.push(s);
            }
          })
          this.setData({
            myShares: myShares,
          })
        }
      })
    }
  },

  /* 离开管理资讯面板 */
  onTapCancelSharesSet: function () {
    this.setData({
      disMyPageShares: 'none',
    })
  },

  onUserWordsInput: function (e) {
    this.setData({
      userWordsTemp: e.detail.value,
    })
  },

  quitEditUserWords: function () {
    this.setData({
      disUserWords: '',
      disUserWordsInput: 'none',
    })
  },

  onTapEditUserWords: function (e) {
    if (this.data.disUserWordsInput == '') { //输入完成
      this.setData({
        disUserWords: '',
        disUserWordsInput: 'none',
        userWords: this.data.userWordsTemp,
      })
      db.collection('userInfo').doc(app.globalData.id).update({
        data: {
          userWords: this.data.userWordsTemp,
        },
        success: res => {
          console.log('[更新用户个性签名] 成功')
        }
      })
    } else {
      this.setData({
        disUserWords: 'none',
        disUserWordsInput: '',
        userWordsTemp: '',
      })
    }
  },

  /* 移除主推项目 */
  onDeleteBannerProject: function (e) {
    var index = e.currentTarget.dataset.index;
    var p = this.data.bannerProjects[index];
    console.log(index)
    wx.showModal({
      title: '提示',
      content: '是否从主推项目删除该项目',
      success: res => {
        if (res.confirm) {
          db.collection('bannerProjects').doc(p._id).remove({
            success: res => {
              console.log('[删除主推项目] 成功')
              wx.showToast({
                title: '成功移出该项目',
              })
              var bp = this.data.bannerProjects;
              bp.splice(index, 1);
              this.setData({
                bannerProjects: bp,
              })
            }
          })
        }
      }
    })
  },

  // 关闭消息面板
  onTapCancelMessMyPage: function (e) {
    this.setData({
      disMyPageMess: 'none',

    })
  },

  //关闭关注的用户面板
  onTapCancelFocusMyPage: function () {
    this.setData({
      disMyPageFocus: 'none'

    })
  },

  //关闭Banner设置面板
  onTapCancelBannerSetMyPage: function () {
    this.setData({
      disMyPageBannerSet: 'none',
    })
  },

  //点击消息，且消息为项目发布
  onTapProjectMessage: function (e) {
    var proid = e.target.dataset.proid;
    var n = e.currentTarget.dataset.n;

    if (proid != undefined && app.globalData._super) {
      wx.showModal({
        title: '提示',
        content: '是否进入项目详情页面',
        success: res => {
          if (res.confirm) {
            if (n == 1) { //项目管理的消息
              var e = {
                currentTarget: {
                  dataset: {
                    n: 1,
                    proid: proid
                  }
                }
              };
              this.onTapProjectListOne(e);
            } else {
              var e = {
                currentTarget: { //我的的消息
                  dataset: {
                    n: 3,
                    proid: proid
                  }
                }
              };
              this.onTapProjectListOne(e);
            }
          }
        }
      })
    }
  },

  /* 进行认证 */
  onTapToQualify: function (e) {
    wx.navigateTo({
      url: '../qualify/qualify',
    })
  },

  //社区********************************************************************************************************************
  /* 搜索框 */
  searchInput: function (e) {
    // console.log(e.detail.value)
    if (e.detail.vlaue != '') {
      var search = e.detail.value;
      console.log(search)
      this.setData({
        disQXIcon: '',
        searchInputW: '345rpx',
      })
      db.collection("Projects").where({
        projectName:search,
      }).get({
        success:res=>{
          this.setData({
            searchResultProjects:res.data,
          })
        }
      })
    }
  },

  onTapSearch: function () {
    this.setData({
      disHead: 'none',
      disBody: 'none',
      searchHolder: '使用项目完整名称搜索项目',
      searchInputW: '398rpx',
      searchContainerW: '',
      disSIcon: 'none',
      disQXText: '',
      disFootLine: 'none'
    })
  },

  onTapQXIcon: function () {
    this.setData({
      disQXIcon: 'none',
      inputValue: '',
      focusInput: true,
      searchInputW: '398rpx',
      searchResultProjects: [],
    })
  },

  onTapQXText: function (e) {
    this.setData({
      disHead: '',
      disBody: '',
      searchHolder: '搜索',
      searchContainerW: '174rpx',
      searchInputW: '140rpx',
      disSIcon: '',
      disQXIcon: 'none',
      disQXText: 'none',
      inputValue: '',
      searchResultProjects: [],
      disFootLine: '',
    })

  },

  /* 社区导航栏换页 */
  onTapDiscoverPageText: function () {
    this.setData({
      zixunText: "热门资讯",
      displayBanner: '',
      displayLabels: '',
      displayTopics: 'none',
      disZixun1: '',
      disZixun2: 'none',
      pageWeight: ['bold', '400', '400'],
      pageBorder: ['', 'hidden', 'hidden'],
      pageColor: ['#333', '#999', '#999'],
    })
  },

  onTapFavorPageText: function () {
    this.setData({
      displayBanner: 'none',
      displayLabels: 'none',
      displayTopics: 'none',
      pageWeight: ['400', 'bold', '400'],
      pageBorder: ['hidden', '', 'hidden'],
      pageColor: ['#999', '#333', '#999'],
      zixunText: '用户资讯',
      disZixun1: 'none',
      disZixun2: '',
    })
  },

  onTapTopicPageText: function () {
    this.setData({
      pageWeight: ['400', '400', 'bold'],
      pageBorder: ['hidden', 'hidden', ''],
      pageColor: ['#999', '#999', '#333'],
      zixunText: "热门话题",
      displayBanner: 'none',
      displayLabels: 'none',
      displayTopics: '',
      disZixun1: 'none',
      disZixun2: 'none'
    })
  },

  // 预览图片
  viewImage: function (e) {
    var url = e.currentTarget.dataset.imageurl;
    console.log("here", url);
    if (url != undefined) {
      wx.previewImage({
        urls: [url],
      })
    }
  },

  /* 点击项目标签，进入项目列表 */
  tapProjectLabel: function (e) {
    var n = e.target.dataset.n;
    this.setData({
      disCommunity: 'none',
      disCommentsHeight: 0,
      disComments: 'none',
      disProjectList: '',
      disFootLine: 'none'
    })
    var pro = this.data.cacheProjects;
    var cpro = this.data.projects;
    for (var i = 0; i < 4; ++i) {
      var proD = pro[i];
      proD.sort((a, b) => {
        var y1 = a.startDate.slice(0, 4);
        var y2 = b.startDate.slice(0, 4);
        if (y1 < y2) return -1;
        else if (y1 > y2) return 1;
        else {
          if (a.startDate < b.startDate) return -1;
          else return 1;
        }
      })
      pro[i] = proD;
    }
    /* 进行默认的排序-开始时间最近 */
    cpro.sort((a, b) => {
      var y1 = a.startDate.slice(0, 4);
      var y2 = b.startDate.slice(0, 4);
      if (y1 < y2) return -1;
      else if (y1 > y2) return 1;
      else {
        if (a.startDate < b.startDate) return -1;
        else return 1;
      }
    })
    this.setData({
      cacheProjects: pro,
      projects: cpro,
      WeightS: ['bold', '400', '400'],
      BorderS: ['', 'none', 'none'],
    })

    var e = {
      target: {
        dataset: {
          n: n
        }
      }
    };
    this.onTapPPageText(e);
  },

  /* 话题标签 */
  onClickTopic: function (event) {
    app.globalData.currentTopic = event.target.dataset.topic;
    wx.navigateTo({
      url: '../createShares/createShares',
    })
  },

  //项目列表JS******************************************************************************************************

  /* 选择排序规则 */
  onTapChooseSortRule: function (e) {
    var n = e.currentTarget.dataset.n;
    var pro = this.data.cacheProjects;
    var cpro = this.data.projects;
    if (n == 1 && this.data.BorderS[0] == 'none') { //开始时间最近
      for (var i = 0; i < 4; ++i) {
        var proD = pro[i];
        proD.sort((a, b) => {
          var y1 = a.startDate.slice(0, 4);
          var y2 = b.startDate.slice(0, 4);
          if (y1 < y2) return -1;
          else if (y1 > y2) return 1;
          else {
            if (a.startDate < b.startDate) return -1;
            else return 1;
          }
        })
        pro[i] = proD;
      }
      cpro.sort((a, b) => {
        var y1 = a.startDate.slice(0, 4);
        var y2 = b.startDate.slice(0, 4);
        if (y1 < y2) return -1;
        else if (y1 > y2) return 1;
        else {
          if (a.startDate < b.startDate) return -1;
          else return 1;
        }
      })
      this.setData({
        cacheProjects: pro,
        projects: cpro,
        WeightS: ['bold', '400', '400'],
        BorderS: ['', 'none', 'none'],
      })
    } else if (n == 2 && this.data.BorderS[1] == 'none') { //热度最高
      for (var i = 0; i < 4; ++i) {
        var proD = pro[i];
        proD.sort((a, b) => {
          return b.comments.length - a.comments.length;
        })
        pro[i] = proD;
      }
      cpro.sort((a, b) => {
        return b.comments.length - a.comments.length;
      })
      this.setData({
        cacheProjects: pro,
        projects: cpro,
        WeightS: ['400', 'bold', '400'],
        BorderS: ['none', '', 'none'],
      })
    } else if (n == 3 && this.data.BorderS[2] == 'none') { //更新时间最近
      for (var i = 0; i < 4; ++i) {
        var proD = pro[i];
        proD.sort((a, b) => {
          var y1 = a.updateTime.slice(0, 4);
          var y2 = b.updateTime.slice(0, 4);
          if (y1 < y2) return 1;
          else if (y1 > y2) return -1;
          else {
            if (a.updateTime < b.updateTime) return 1;
            else return -1;
          }
        })
        pro[i] = proD;
      }
      cpro.sort((a, b) => {
        var y1 = a.updateTime.slice(0, 4);
        var y2 = b.updateTime.slice(0, 4);
        if (y1 < y2) return 1;
        else if (y1 > y2) return -1;
        else {
          if (a.updateTime < b.updateTime) return 1;
          else return -1;
        }
      })
      this.setData({
        cacheProjects: pro,
        projects: cpro,
        WeightS: ['400', '400', 'bold'],
        BorderS: ['none', 'none', ''],
      })
    }
  },

  /* 用户点击顶部换页 */
  onTapPPageText: function (e) {
    var n = e.target.dataset.n;
    var weight = this.data.pageWeightP;
    var border = this.data.pageBorderP;
    var nC = this.data.setLabelValue;
    weight[nC] = '400';
    border[nC] = 'none';
    weight[n] = 'bold';
    border[n] = '';
    this.setData({
      pageWeightP: weight,
      pageBorderP: border,
      setLabelValue: n,
      projects: this.data.cacheProjects[n],
      projectLabelIntroImage: this.data.projectLabelIntroImages[n],
      projectLabelIntroName: this.data.projectLabelIntroNames[n],
      projectLabelIntroVHour: this.data.projectLabelIntroVHours[n],
      projectLabelIntroText: this.data.projectLabelIntroTexts[n],
    })
  },

  /* 从项目列表返回Community */
  onUnloadProjectList: function (e) {
    this.setData({
      disCommunity: '',
      disProjectList: 'none',
      disComments: 'none',
      disCommentsHeight: 0,
      disFootLine: '',
    })
  },

  /* 点击项目进入详情页 */
  onTapProjectListOne: function (e) {
    var n = e.currentTarget.dataset.n;
    var proid = e.currentTarget.dataset.proid;
    console.log('[进入项目详情]', proid)

    db.collection("Projects").doc(proid).get({
      success: res => {
        this.setData({
          chooseProject: res.data,
        })
        var sponsor = res.data.sponsor;
        var member = res.data.member;
        if (sponsor == app.globalData.id) {
          this.setData({
            isMine: true,
          })
        }
        db.collection("userInfo").doc(sponsor).get({
          success: res => {
            var info = res.data.userInfo;
            info.isQualified = res.data.isQualified;
            info.qualifyState = res.data.qualifyState;
            info.qualifyText = res.data.qualifyText;
            var c1 = "chooseProject.sponsorInfo";
            this.setData({
              [c1]: info,
            })
          }
        })
        var memberInfo = [];
        member.forEach(m => {
          if (member.id == app.globalData.id) {
            this.setData({
              isMember: true,
            })
          }
          db.collection("userInfo").doc(m.id).get({
            success: res => {
              var info = res.data.userInfo;
              info.isQualified = res.data.isQualified;
              info.qualifyState = res.data.qualifyState;
              info.qualifyText = res.data.qualifyText;
              var mem = {
                id: m.id,
                userInfo: info
              };
              memberInfo.push(mem);
            }
          })
        })
        var c2 = "chooseProject.member";
        this.setData({
          [c2]: memberInfo,
        })

        if (n == 1) { //从项目管理进入的
          this.setData({
            disComments: 'none',
            disCommentsHeight: 0,
            disProjectDetailBottomLine: '', //进入时应把改显示详情页面的底部按钮显示为默认
            disManageProjectPage: 'none',
            isManage: true,
            disFootLine: 'none',
          })
        } else if (n == 2) { //从搜索结果进入的
          this.setData({
            disComments: 'none',
            disCommentsHeight: 0,
            disProjectDetailBottomLine: '', //进入时应把改显示详情页面的底部按钮显示为默认
            disManageProjectPage: 'none',
            isSearch: true,
            disCommunity: 'none',
            disFootLine: 'none',
          })

        } else if (n == 3) { //从我的界面进入的
          this.setData({
            disComments: 'none',
            disCommentsHeight: 0,
            disProjectDetailBottomLine: '',
            disMyPage: 'none',
            isMyPage: true,
            disCommunity: 'none',
            disFootLine: 'none',
          })
        } else if (n == 4) { //从Banner进入的
          this.setData({
            disComments: 'none',
            disCommentsHeight: 0,
            disProjectDetailBottomLine: '',
            isBanner: true,
            disCommunity: 'none',
            disFootLine: 'none',
          })
        } else { //从项目列表进入的
          this.setData({
            disComments: 'none',
            disCommentsHeight: 0,
            disProjectList: 'none',
            disProjectDetailBottomLine: '',
          })
        }
        this.setData({
          disProjectDetailPage: '',
        })

        if (this.data.chooseProject.projectState == '组队中') {
          var m = this.data.chooseProject.memberNum;
          var mc = this.data.chooseProject.member.length;
          this.setData({
            projectDetailStateText: mc + '/' + m,
          })
        }
      }
    })

  },

  /* 从项目详情返回项目列表/项目管理页/搜索页/我的/社区 */
  onUnloadProjectDetailToProjectList: function (e) {
    if (this.data.isManage) {
      this.setData({
        chooseProject: {},
        disProjectDetailPage: 'none',
        disComments: 'none',
        disCommentsHeight: 0,
        projectDetailStateText: '', //组队情况，用后为保险清空
        disManageProjectPage: '',
        disFootLine: '',
        isManage: false,
      })
    } else if (this.data.isSearch) {
      this.setData({
        chooseProject: {},
        disProjectDetailPage: 'none',
        disComments: 'none',
        disCommentsHeight: 0,
        projectDetailStateText: '', //组队情况，用后为保险清空
        disCommunity: '',
        disFootLine: '',
        isSearch: false,
      })
    } else if (this.data.isMyPage) {
      this.setData({
        chooseProject: {},
        disProjectDetailPage: 'none',
        disComments: 'none',
        disCommentsHeight: 0,
        projectDetailStateText: '', //组队情况，用后为保险清空
        disProjectDetailBottomLine: '',
        disMyPage: '',
        disFootLine: '',
        isMypage: false,
      })
    } else if (this.data.isBanner) {
      this.setData({
        chooseProject: {},
        disProjectDetailPage: 'none',
        disComments: 'none',
        disCommentsHeight: 0,
        projectDetailStateText: '', //组队情况，用后为保险清空
        disProjectDetailBottomLine: '',
        disCommunity: '',
        disFootLine: '',
        isMypage: false,
      })
    } else {
      this.setData({
        chooseProject: {},
        disProjectDetailPage: 'none',
        disComments: 'none',
        disCommentsHeight: 0,
        projectDetailStateText: '',
        disProjectList: '',

      })
    }

    this.setData({
      isMine: false, //将这个状态去掉
      isMember: false,
    })
  },

  //评论区 -社区Shares评论 -项目列表Projects评论*******************************************************************************
  /* 点击评论 */
  tapComment: function (e) {
    var proid = e.currentTarget.dataset.proid;
    var shareid = e.currentTarget.dataset.shareid;
    var topicid = e.currentTarget.dataset.topicid;
    console.log('proid: ' + proid + ' shareid: ' + shareid + ' topicid: ' + topicid);
    if (proid != undefined) {
      this.data.projects.forEach(pro => {
        if (pro._id == proid) {
          this.setData({
            disCommentsHeight: '',
            disComments: '',
            commentTargetId: proid,
            comments: pro.comments,
            inputCommentReal: '',
            commentInputHeight: '55rpx',
            disProjectDetailBottomLine: 'none',
            isProisShrisTop:1
          })
          this.data.sponsorPro.forEach(p => {
            if (p._id == proid) p.comments = pro.comments;
          })
          this.data.memberPro.forEach(p => {
            if (p._id == proid) p.comments = pro.comments
          })
          this.data.collectPro.forEach(p => {
            if (p._id == proid) p.comments = pro.comments;
          })
          return;
        }
      })
    } else if (shareid != undefined) {
      this.data.shares.forEach(shr => {
        if (shareid == shr._id) {
          this.setData({
            disCommentsHeight: '',
            disComments: '',
            commentTargetId: shareid,
            comments: shr.comments,
            inputCommentReal: '',
            commentInputHeight: '55rpx',
            isProisShrisTop:2
          })
          return;
        }
      })
    } else if (topicid != undefined) {
      this.data.topics.forEach(t => {
        if (t._id == topicid) {
          this.setData({
            disCommentsHeight: '',
            disComments: '',
            commentTargetId: topicid,
            comments: t.comments,
            inputCommentReal: '',
            commentInputHeight: '55rpx',
            isProisShrisTop:3
          })
        }
      })
    }
  },

  /* 消除评论区 */
  onTapCancelOfComments: function (e) {
    this.setData({
      disCommentsHeight: 0,
      disComments: 'none',
      disProjectDetailBottomLine: '',
    })
  },

  onTapCommentInput: function (e) {
    this.setData({
      commentInputHeight: '165rpx',
    })
  },

  onCommentInput: function (e) {
    this.setData({
      inputComment: e.detail.value,
    })
  },

  quitCommentInput: function (e) {
    this.setData({
      inputCommentReal: '',
      commentInputHeight: '55rpx',
    })
  },

  /* 发表评论 */
  onTapSubmitComment: function () {
    var type = this.data.isProisShrisTop;

    if (this.data.inputComment != '') {
      wx.showModal({
        title: '提示',
        content: '是否发表评论',
        success: res => {
          if (res.confirm) {
            var comments = this.data.comments;
            var newComment = {
              comment: '',
              submiter: this.data.userInfo,
              submitTime: time.getFullYear() + '-' + (parseInt(time.getMonth()) + 1) + '-' + time.getDate(),
            };
            newComment.comment = this.data.inputComment;
            comments.push(newComment);

            if(type == 1){
              this.data.sponsorPro.forEach((p, index) => {
                if (p._id == this.data.commentTargetId) {
                  var chan = "sponsorPro[" + index + "].comments";
                  this.setData({
                    [chan]: comments,
                  })
                }
              })
              this.data.memberPro.forEach((p, index) => {
                if (p._id == this.data.commentTargetId) {
                  var chan = "memberPro[" + index + "].comments";
                  this.setData({
                    [chan]: comments,
                  })
                }
              })
              this.data.collectPro.forEach((p, index) => {
                if (p._id == this.data.commentTargetId) {
                  var chan = "collectPro[" + index + "].comments";
                  this.setData({
                    [chan]: comments,
                  })
                }
              }) //对这三个进行同步，当然也可能不是project哈
              
              this.data.manageProjectPageDisplayProjects.forEach((p, index) => {
                if (p._id == this.data.commentTargetId) {
                  var chan = "manageProjectPageDisplayProjects[" + index + "].comments"
                  this.setData({
                    [chan]: comments,
                  })
                }
              })
  
              /* 这个是项目列表的显示项目，需要进行同步 */
              this.data.projects.forEach((p, index) => {
                if (p._id == this.data.commentTargetId) {
                  var chan = "projects[" + index + "].comments"
                  this.setData({
                    [chan]: comments,
                  })
                }
              })
  
              /* 还有缓存的项目 */
              for (var i = 0; i < 4; ++i) {
                this.data.cacheProjects[i].forEach((p, index) => {
                  if (p._id == this.data.commentTargetId) {
                    var chan = "cacheProjects[" + i + "][" + index + "].comments"
                    this.setData({
                      [chan]: comments,
                    })
                  }
                })
              }

              /* 写回 */
              db.collection('Projects').doc(this.data.commentTargetId).update({
                data: {
                  comments: _.push(newComment),
                },
                success: res => {
                  console.log('[更新数据库Projects] [添加评论] 成功: [target]' + this.data.commentTargetId);
                }
              })
            }

            else if(type == 2){
              //检索shares
              this.data.shares.forEach((s, index) => {
                if (s._id == this.data.commentTargetId) {
                  var chan = "shares[" + index + "].comments";
                  this.setData({
                    [chan]: comments,
                  })
                }
              })

              /* 写回 */
              db.collection('Shares').doc(this.data.commentTargetId).update({
                data: {
                  comments: _.push(newComment),
                },
                success: res => {
                  console.log("发布资讯评论 成功");
                }
              })
            }

            else if(type == 3){
              this.data.topics.forEach((t,index)=>{
                if (t._id == this.data.commentTargetId) {
                  var chan = "topics[" + index + "].comments";
                  this.setData({
                    [chan]: comments,
                  })
                }
              })

              db.collection("shareTopics").doc(this.data.commentTargetId).update({
                data:{
                  comments:_.push(newComment),
                },
                success:res=>{
                  console.log("发布话题评论 成功");
                }
              })
            }

            this.setData({
              comments: comments,
              inputCommentReal: '',
              commentInputHeight: '55rpx',
            })
          }
        }
      })
    }
  },

  /* 点赞 */
  tapGood: function (e) {
    var proid = e.currentTarget.dataset.proid;
    var shareid = e.currentTarget.dataset.shareid;
    var n = e.currentTarget.dataset.n;
    console.log('proid ' + proid + ' shareid ' + shareid);
    if (proid != undefined) {
      this.data.cacheProjectsR.forEach((pro, index) => {
        if (pro._id == proid) {
          var goodPro = 'projects[' + index + '].isGood';
          this.setData({
            [goodPro]: true,
          });
          if (n == 1) { //这是在项目详情页点的赞，所以chooseProject也要变化
            var goodPro = 'chooseProject.isGood';
            this.setData({
              [goodPro]: true,
            });
          } else if (n == 2) { //这是用户项目管理中点的赞，所以manageProjectPageDisplayProjects也要变化
            this.data.manageProjectPageDisplayProjects.forEach((pro, index) => {
              if (pro._id == proid) {
                var goodPro = 'manageProjectPageDisplayProjects[' + index + '].isGood';
                this.setData({
                  [goodPro]: true,
                });
              }
            })
          }
          db.collection('userInfo').doc(app.globalData.id).get({
            success: res => {
              var goodPro = res.data.goodProjects;
              /* 这里的只有一条数据 */
              var ret = goodPro.filter(gproid => {
                return gproid == proid
              });
              if (goodPro.length == 0 || ret.length == 0) {
                /* 为显示添加 写穿 */
                var goodNum = 'projects[' + index + '].goodNum';
                var num = parseInt(pro.goodNum) + 1;
                this.setData({
                  [goodNum]: num,
                })
                if (n == 1) { //这是在项目详情页点的赞，所以chooseProject也要变化
                  var goodNum = 'chooseProject.goodNum';
                  this.setData({
                    [goodNum]: num,
                  });
                }
                /* 添加数据库 */
                db.collection('userInfo').doc(app.globalData.id).update({
                  data: {
                    goodProjects: _.push(proid),
                  },
                  success: res => {
                    console.log('[增加用户点赞项目] 成功');
                  }
                })
                db.collection('Projects').doc(proid).update({
                  data: {
                    goodNum: num,
                  },
                  success: res => {
                    console.log('[更新项目点赞数] 成功');
                  }
                })
              } else {
                wx.showToast({
                  title: '您已经点过赞了',
                })
              }
            }
          })
        }
      })
    } else if (shareid != undefined) {
      var alreadyGood = false;
      this.data.shares.forEach((shr, index) => {
        if (shareid == shr._id) {
          var goodShr = 'shares[' + index + '].isGood';
          this.setData({
            [goodShr]: true,
          });
          db.collection('userInfo').doc(app.globalData.id).get({
            success: res => {
              var goodShr = res.data.goodShares;
              var ret = goodShr.filter(gshrid => {
                return gshrid == shareid
              });
              if (goodShr.length == 0 || ret.length == 0) {
                /* 写穿 */
                var goodNum = 'shares[' + index + '].goodNum';
                var num = parseInt(shr.goodNum) + 1
                this.setData({
                  [goodNum]: num,
                })
                /* 添加数据库 */
                db.collection('userInfo').doc(app.globalData.id).update({
                  data: {
                    goodShares: _.push(shareid),
                  },
                  success: res => {
                    console.log('[增加用户点赞资讯] 成功');
                  }
                })
                /* 更新资讯点赞数 */
                db.collection('Shares').doc(shareid).update({
                  data: {
                    goodNum: num,
                  },
                  success: res => {
                    console.log('[更新资讯点赞数] 成功');
                  }
                })
              } else {
                wx.showToast({
                  title: '您已经点过赞了',
                })
              }
            }
          })

          return;
        }
      })
    }
  },

  /* 收藏 */
  tapCollect: function (e) {
    console.log("here");
    var proid = e.currentTarget.dataset.proid;
    var n = e.currentTarget.dataset.n;
    if (proid != undefined) {
      /* 图标的改变 无需看数据库所以放外面 */
      this.data.cacheProjectsR.forEach((pro, index) => {
        if (pro._id == proid) {
          var collectedPro = 'projects[' + index + '].isCollected';
          this.setData({
            [collectedPro]: true,
          });
          if (n == 1) { //这是在项目详情页收藏，所以chooseProject也要变化
            var collectPro = 'chooseProject.isCollected';
            this.setData({
              [collectPro]: true,
            });
          } else if (n == 2) { //这是用户项目管理中点的收藏，所以manageProjectPageDisplayProjects也要变化
            this.data.manageProjectPageDisplayProjects.forEach((pro, index) => {
              if (pro._id == proid) {
                var collectPro = 'manageProjectPageDisplayProjects[' + index + '].isCollected';
                this.setData({
                  [collectPro]: true,
                });
              }
            })
          }
          /* 数目的改变 */
          db.collection('userInfo').doc(app.globalData.id).get({
            success: res => {
              /* 这里的只有一条数据 */
              var collectedPro = res.data.favorProjects;
              var ret = collectedPro.filter(cproid => {
                return cproid == proid
              }); //检查是否已经收藏
              if (collectedPro.length == 0 || ret.length == 0) {
                /* 为显示添加 写穿 */
                var collectNum = 'projects[' + index + '].collectNum';
                var num = parseInt(pro.collectNum) + 1;
                this.setData({
                  [collectNum]: num,
                  collectPro: _.push(pro),
                })
                if (n == 1) { //这是在项目详情页收藏，所以chooseProject也要变化
                  var collectNum = 'chooseProject.collectNum';
                  this.setData({
                    [collectNum]: num,
                  });
                }
                /* 添加数据库 */
                db.collection('userInfo').doc(app.globalData.id).update({
                  data: {
                    favorProjects: _.push(proid),
                  },
                  success: res => {
                    console.log('[增加用户收藏项目] 成功');
                  }
                })
                db.collection('Projects').doc(proid).update({
                  data: {
                    collectNum: num,
                  },
                  success: res => {
                    console.log('[更新项目收藏数] 成功');
                  }
                })
              } else {
                wx.showToast({
                  title: '您已经收藏过了',
                })
              }
            }
          })
        }
      })
    }
  },

  //项目详情***************************************************************************************************
  /* 开始项目 */
  onTapStartProject: function (e) {
    var proid = e.currentTarget.dataset.proid;
    wx.showModal({
      title: '提示',
      content: '是否开始项目',
      success: res => {
        if (res.confirm) {
          db.collection('Projects').doc(proid).update({
            data: {
              projectState: '进行中',
            },
            success: res => {
              wx.showToast({
                title: '项目已开始，将停止组队',
              })
            }
          })
          /* 还要把缓存的也处理一下吧 */
          var cha = 'chooseProject.projectState';
          this.setData({
            [cha]: '进行中'
          })
          /* 1 */
          var pro = this.data.projects;
          var index = undefined;
          pro.forEach((p, ind) => {
            if (p._id == proid) {
              index = ind;
            }
          })
          if (index != undefined) {
            var cp = 'projects[' + index + '].projectState';
            this.setData({
              [cp]: "进行中",
            })
          }
          /* 2 */
          var pro = this.data.cacheProjectsR;
          var index = undefined;
          pro.forEach((p, ind) => {
            if (p._id == proid) {
              index = ind;
            }
          })
          if (index != undefined) {
            var cp = 'projects[' + index + '].projectState';
            this.setData({
              [cp]: "进行中",
            })
          }
          /* 3 */
          var pro = this.data.sponsorPro;
          var index = undefined;
          pro.forEach((p, ind) => {
            if (p._id == proid) {
              index = ind;
            }
          })
          if (index != undefined) {
            var cp = 'sponsorPro[' + index + '].projectState';
            this.setData({
              [cp]: "进行中",
              projectDetailStateText: '',
            })
          }
          /* 先这样吧 */
        }
      }
    })
  },

  /* 申请加入项目 */
  onTapJoinProject: function (e) {
    var proid = e.currentTarget.dataset.proid;
    var proname = e.currentTarget.dataset.proname;
    db.collection('Projects').doc(proid).get({
      success: res => {
        var sponsor_id = res.data.sponsor;
        var members = res.data.member;
        var num = res.data.memberNum;
        if (sponsor_id == app.globalData.id /* false */ ) {
          wx.showToast({
            icon: 'none',
            title: '不能参与自己的项目'
          })
        } else if (members.length >= num) {
          wx.showToast({
            icon: 'none',
            title: '该项目已经满员啦',
          })
        } else {
          var ret = members.filter(mem => {
            return mem.id == app.globalData.id;
          })
          if (ret.length != 0) {
            wx.showToast({
              icon: 'none',
              title: '已经是该项目的成员',
            })
          } else {
            var mess = {
              userInfo: app.globalData.userInfo,
              user_id: app.globalData.id,
              proid: proid,
              state: 1,
              type: '申请加入项目',
              needAgreeButton: true,
              content: '申请加入项目' + ' [' + proname + ']',
              time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
            }
            db.collection('userInfo').doc(sponsor_id).update({
              data: {
                messages: _.push(mess),
              },
              success: res => {
                console.log('[发送申请加入项目信息] 成功');
                wx.showToast({
                  title: '申请成功',
                })
              },
              fail: res => {
                console.log('[失败]' + res.data);
                wx.showToast({
                  icon: 'none',
                  title: '出错啦',
                })
              }
            })
          }
        } // 仅仅发送消息
      }
    })
  },

  /* 退出项目 */
  /* !!!未测试 */
  onTapQuitProject: function (e) {
    var proid = e.currentTarget.dataset.proid;
    var proname = e.currentTarget.dataset.proname;
    var prostate = e.currentTarget.dataset.prostate;
    if (prostate == '进行中') {
      wx.showModal({
        title: '提示',
        content: '退出将没有任何公益时奖励',
        success: res => {
          if (res.confirm) {
            this.setData({
              isMember: false,
            })
            var mem = e.currentTarget.member;
            var index;
            mem.forEach((m, ind) => {
              if (m.id == app.globalData.id) index = ind;
            })
            mem.splice(index, 1);
            db.collection('Projects').doc(proid).update({
              data: {
                member: mem,
              }
            })

          }
        }
      })
    }
  },

  /* 结束项目 */
  onTapFinishProject: function (e) {
    wx.showModal({
      title: '提示',
      content: '是否结束项目',
      success: res => {
        if (res.confirm) {
          var proid = e.currentTarget.dataset.proid;
          var proname = e.currentTarget.dataset.proname;
          db.collection('Projects').doc(proid).get({
            success: res => {
              var sponsor_id = res.data.sponsor;
              var members = res.data.member;
              var mess = {
                userInfo: app.globalData.userInfo,
                user_id: app.globalData.id,
                proid: proid,
                state: 1,
                needAgreeButton: true,
                content: '申请结束项目' + ' [' + proname + ']',
                type: '结束项目',
                sponsor: sponsor_id,
                time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
              }
              db.collection('userInfo').doc(sponsor_id).update({
                data: {
                  messages: _.push(mess),
                },
                success: res => {
                  console.log('[发送申请完成项目] 成功');
                  wx.showToast({
                    title: '已发送申请',
                  })
                },
                fail: res => {
                  console.log('[失败]' + res.data);
                  wx.showToast({
                    icon: 'none',
                    title: '出错啦',
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  /* 修改项目简介/正文/配图 */
  onTapChangeProjectDetailText: function (e) {
    var n = e.currentTarget.dataset.n;
    var pro = this.data.chooseProject;
    if (n == 1) {
      this.setData({
        detailTextInputSet: pro.projectInformation,
        disChangeInformationOrContent: '',
        changeInformation: true,
      })
    } else if (n == 2) {
      this.setData({
        detailTextInputSet: pro.projectContent,
        disChangeInformationOrContent: '',
        changeInformation: false,
      })
    } else if (n == 3) {
      console.log('aaaa', this.data.chooseProject.projectImagesID);
      var imagesID = [];
      this.data.chooseProject.projectImagesID.forEach(p => {
        imagesID.push(p);
      })
      if (imagesID.length < 9) imagesID.push('../../images/jiahao2.png')
      var cover = this.data.chooseProject.projectCoverImageID;
      this.setData({
        disChangeImage: '',
        projectImages: imagesID,
        coverImage: cover,
      })
      console.log('bbb', this.data.chooseProject.projectImagesID);
    }
  },

  onInputInformationOrContent: function (e) {
    var n = e.currentTarget.dataset.n;
    if (n == 1) {
      this.setData({
        inputInformation: e.detail.value,
      })
    } else if (n == 2) {
      this.setData({
        inputContent: e.detail.value,
      })
    }
  },

  onTapCancelInformationOrContentInput: function () {
    this.setData({
      disChangeInformationOrContent: 'none',
      detailTextInputSet: '',
    })
  },

  onTapCoverImg: function () { //修改项目封面
    wx.showModal({
      title: '提示',
      content: '是否修改项目封面',
      success: res => {
        if (res.confirm) {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
              // 上传图片
              wx.showLoading({
                title: '上传图片中',
                duration: 1000,
              })
              const cloudPath = 'projectImages-' + app.globalData.id + '-' + time.getFullYear() + (time.getMonth() + 1) + time.getDate() + time.getHours() + time.getMinutes() + time.getSeconds() + Math.random() * 100; /* 上传图片的云地址(加时间保证独立性) */
              const filePath = res.tempFilePaths[0];
              wx.cloud.uploadFile({
                cloudPath,
                filePath, //这个名字不能改
                success: res => {
                  console.log('[上传文件] 成功：', res.fileID)
                  this.setData({
                    coverImage: res.fileID,
                  })
                  db.collection("Projects").doc(this.data.chooseProject._id).update({
                    data: {
                      projectCoverImageID: res.fileID,
                      updateTime: time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + "-" + time.getHours() + "-" + time.getMinutes(),
                    }
                  })
                  wx.showToast({
                    title: '修改成功',
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
      }
    })
  },

  /* 用户长按图片 */
  onLongTapImgC: function (e) {
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
              fileList: [this.data.chooseProject.projectImagesID[n]],
              /* 这里要传数组来的 */
              success: res => {
                console.log("删除服务器图片成功");
                var imgsID = this.data.chooseProject.projectImagesID;
                imgsID.splice(n, 1);
                var cha = 'chooseProject.projectImagesID';
                this.setData({
                  [cha]: imgsID,
                })
                db.collection("Projects").doc(this.data.chooseProject._id).update({
                  data: {
                    projectImagesID: imgsID,
                  },
                  success: res => {
                    console.log('[删除配图] 成功')
                  }
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

  /* 用户点击图片进行修改 */
  onTapImgC: function (e) {
    var n = e.target.dataset.n;
    if (this.data.projectImages[n] == '../../images/jiahao2.png') {
      wx.chooseImage({
        count: 9 - n,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          res.tempFilePaths.forEach(tempImg => {
            const cloudPath = 'projectImages-' + app.globalData.id + '-' + time.getFullYear() + (time.getMonth() + 1) + time.getDate() + time.getHours() + time.getMinutes() + time.getSeconds() + this.data.chooseProject.projectImagesID.length + Math.random() * 100; /* 上传图片的云地址(加时间保证独立性) */
            const filePath = tempImg; /* 这里好像非要const才传的进去 */
            // 上传图片
            wx.showLoading({
              title: '上传图片中',
            })
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log('[上传文件] 成功：', res.fileID)
                var imgs = this.data.chooseProject.projectImagesID;
                imgs.push(res.fileID);
                var cha = 'chooseProject.projectImagesID';
                this.setData({
                  [cha]: imgs,
                })
                db.collection("Projects").doc(this.data.chooseProject._id).update({
                  data: {
                    projectImagesID: imgs,
                    updateTime: time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + "-" + time.getHours() + "-" + time.getMinutes(),
                  },
                  success: res => {
                    console.log('[项目配图] 修改成功');
                    var imgs = this.data.chooseProject.projectImagesID;
                    if (imgs.length < 9) imgs.push('../../images/jiahao2.png')
                    this.setData({
                      projectImages: imgs,
                    })
                    console.log(this.data.projectImages);
                  }
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
    } else if (n < this.data.projectImages.length) {
      wx.previewImage({
        urls: [this.data.projectImages[n]],
      })
    }
  },

  /* 退出项目配图编辑 */
  onTapCancelChangeImage: function (e) {
    this.setData({
      disChangeImage: 'none',
      projectImages: [],
    })
  },

  onTapSubmitDetailChange: function (e) {
    var n = e.currentTarget.dataset.n;
    if (n == 1) {
      if (this.data.changeInformation) {
        var info = this.data.inputInformation;
        db.collection("Projects").doc(this.data.chooseProject._id).update({
          data: {
            projectInformation: info,
            updateTime: time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + "-" + time.getHours() + "-" + time.getMinutes(),
          },
          success: res => {
            console.log('[更新项目详情] 成功')
            wx.showToast({
              title: '修改成功',
            })
            var chan = 'chooseProject.projectInformation';
            this.setData({
              [chan]: info,
              disChangeInformationOrContent: 'none',
              detailTextInputSet: '',
              inputInformation: '',
            })
          }
        })
      } else {
        var con = this.data.inputContent;
        db.collection("Projects").doc(this.data.chooseProject._id).update({
          data: {
            projectContent: con,
            updateTime: time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + "-" + time.getHours() + "-" + time.getMinutes(),
          },
          success: res => {
            console.log('[更新项目详情] 成功')
            wx.showToast({
              title: '修改成功',
            })
            var chan = 'chooseProject.projectContent';
            this.setData({
              [chan]: con,
              disChangeInformationOrContent: 'none',
              detailTextInputSet: '',
              inputContent: '',
            })
          }
        })
      }
    }
  },

  /* 管理项目成员 */
  manageProjectMember: function () {
    this.setData({
      disManageMember: '',
    })
  },

  /* 移除项目成员 */
  onLongTapMember: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否确定移除该成员？',
      success: res => {
        if (res.confirm) {
          console.log('确认删除项目成员');
          var member = this.data.chooseProject.member;
          var id = this.data.chooseProject.member[index].id;
          member.splice(index, 1);
          var c = 'chooseProject.member';
          this.setData({
            [c]: member,
          })
          db.collection("Project").doc(this.data.chooseProject._id).update({
            data: {
              member: member,
            },
            success: res => {
              console.log("数据库移除项目成员 成功");
            }
          })
          var Mess = {
            userInfo: app.globalData.userInfo,
            user_id: app.globalData.id,
            proid: this.data.chooseProject._id,
            state: 1,
            type: '请离项目',
            content: '很抱歉，您被项目发起人请离项目：' + this.data.chooseProject.projectName,
            time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
          }
          db.collection("userInfo").doc(id).update({
            data: {
              messages: _.push(Mess),
            },
            success: res => {
              wx.showToast({
                icon: 'none',
                content: "已通知相关成员"
              });
              console.log("发送请离项目信息成功");
            }
          })
        } else if (res.cancel) {
          console.log('点击取消了');
        }
      }
    })
  },

  onTapQuitManageMember: function () {
    this.setData({
      disManageMember: 'none',
    })
  },

  //项目管理页面*****************************************************************************************
  /* 用户点击我的项目 */
  onTapMyProject: function () {
    this.setData({
      isMine: true,
      mpageWeight: ['bold', '400', '400'],
      mpageBorder: ['', 'hidden', 'hidden'],
      manageProjectPageDisplayProjects: this.data.sponsorPro,
    })
  },

  /* 用户点击我参与的项目 */
  onTapParticipateProject: function () {
    this.setData({
      isMine: false,
      mpageWeight: ['400', 'bold', '400'],
      mpageBorder: ['hidden', '', 'hidden'],
      manageProjectPageDisplayProjects: this.data.memberPro,
    })
  },

  /* 用户点击我收藏的项目 */
  onTapFavorProject: function () {
    this.setData({
      isMine: false,
      mpageWeight: ['400', '400', 'bold'],
      mpageBorder: ['hidden', 'hidden', ''],
      manageProjectPageDisplayProjects: this.data.collectPro,
    })
  },

  /* 打开消息面板 */
  onTapMessageIcon: function () {
    this.setData({
      disMessage: '',
    })
  },

  /* 关闭消息面板 */
  onTapCancelMess: function () {
    this.setData({
      disMessage: 'none',
    })
  },

  /* 点击消息的按钮 */
  onTapMessButton: function (e) { //未读信息
    var n = e.currentTarget.dataset.n;
    var index = e.currentTarget.dataset.index;
    var userInfo = e.currentTarget.dataset.userinfo;
    var um = this.data.unreadMess;
    var user_id = um[index].user_id; //保留发送方的id  
    var proid = um[index].proid;
    var thisMess = um[index]; //直接留着当前的信息呗
    var rm = this.data.readedMess;
    if (n != 1 && n != 2) {
      thisMess.state = 0; //改为已读状态
      rm.push(thisMess);
    } //忽略

    um.splice(index, 1);
    this.setData({
      unreadMess: um,
      readedMess: rm,
    })
    if (um.length == 0) {
      this.setData({
        disUnread: 'none', //消除未读Icon
      })
    }
    var messages = um;
    rm.forEach(m => {
      messages.push(m);
    }) //重新连接两个信息
    db.collection('userInfo').doc(app.globalData.id).update({
      data: {
        messages: messages,
      },
      success: res => {
        console.log('[更新userInfo] [更改消息状态] 成功')
      }
    }) //更新信息

    if (thisMess.type == "用户认证") {
      if (n == 1) {
        var Mess2 = {
          userInfo: app.globalData.userInfo,
          user_id: app.globalData.id,
          state: 1,
          needAgreeButton: false,
          needImg: false,
          content: '认证成功',
          time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
        }
        db.collection('userInfo').doc(user_id).update({
          data: {
            isQualified: true,
            qualifyState: thisMess.schoolState,
            qualifyText: thisMess.schoolName,
            messages: _.push(Mess2),
          }
        })
        this.setData({
          isQualified: true,
          qualifyState: thisMess.schoolState,
          qualifyText: thisMess.schoolName,
        })
      } else if (n == 2) {
        var Mess2 = {
          userInfo: app.globalData.userInfo,
          user_id: app.globalData.id,
          state: 1,
          needAgreeButton: false,
          needImg: false,
          content: '认证失败，请注意检查学信网截图是否规范',
          time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
        }
        db.collection('userInfo').doc(user_id).update({
          data: {
            messages: _.push(Mess2),
          },
          success: res => {
            wx.showToast({
              title: '已发送回信',
            })
            console.log('[回信] 成功')
          }
        })
      }
    } else if (thisMess.type == "发布项目") {
      db.collection('Projects').doc(proid).get({
        success: res => {
          var proname = res.data.projectName;
          var messBack = undefined;
          var num = res.data.memberNum;
          if (n == 1) { //同意了
            messBack = {
              userInfo: app.globalData.userInfo,
              user_id: app.globalData.id,
              proid: proid,
              state: 1,
              needAgreeButton: false,
              content: '申请发布项目' + ' [' + proname + '] 成功',
              time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
            };
            var stateN = '组队中'
            if (num == 0) stateN = '进行中'
            db.collection('Projects').doc(proid).update({
              data: {
                projectState: stateN,
              },
              success: res => {
                wx.showToast({
                  title: '已回信',
                })
                console.log('回信 成功');
              }
            })
          } else if (n == 2) { //拒绝了
            messBack = {
              userInfo: app.globalData.userInfo,
              user_id: app.globalData.id,
              proid: proid,
              state: 1,
              needAgreeButton: false,
              content: '申请发布项目' + ' [' + proname + '] 被拒绝了',
              time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
            };
          }

          if (messBack != undefined) {
            db.collection('userInfo').doc(user_id).update({
              data: {
                messages: _.push(messBack)
              },
              success: res => {
                wx.showToast({
                  title: '消息已发送',
                })
                console.log('[userInfo] [回信] 成功');
              }
            })
          }
        }
      })
    } else if (thisMess.type == "结束项目") {
      db.collection('Projects').doc(proid).get({
        success: res => {
          var proname = res.data.projectName;
          var messBack = undefined;
          var num = res.data.memberNum;
          var label = res.data.projectLabel;
          var sponsor = res.data.sponsor;
          var members = res.data.member; //注意.id
          if (n == 1) { //同意了
            console.log('同意了', label, num);
            messBack = {
              userInfo: app.globalData.userInfo,
              user_id: app.globalData.id,
              proid: proid,
              state: 1,
              needAgreeButton: false,
              content: '申请完成项目' + ' [' + proname + '] 成功',
              time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
            };
            console.log(messBack)
            var vHour;
            if (label == '乡村教育') {
              vHour = 10;
            } else if (label == '志愿招募') {
              vHour = 60;
            } else if (label == '乡村振兴') {
              vHour = 30;
            } else if (label == '基层调研') {
              vHour = 50;
            }
            console.log('vHour', vHour);
            //增加公益时
            db.collection('userInfo').doc(sponsor).get({
              success: res => {
                var hour = parseInt(res.data.vHour) + parseInt(vHour);
                db.collection('userInfo').doc(sponsor).update({
                  data: {
                    vHour: hour,
                  },
                  success: res => {
                    console.log('[更新发起者公益时] 成功');
                  }
                })
              }
            }) //发起者
            members.forEach((m) => {
              db.collection('userInfo').doc(m.id).get({
                success: res => {
                  var hour = parseInt(res.data.vHour) + parseInt(vHour);
                  db.collection('userInfo').doc(m.id).update({
                    data: {
                      vHour: hour,
                    },
                    success: res => {
                      console.log('[更新参与者公益时] 成功');
                    }
                  })
                }
              })
            }) //参与者
            db.collection('Projects').doc(proid).update({
              data: {
                projectState: '已完成',
              },
              success: res => {
                wx.showToast({
                  title: '顺利结束项目',
                })
              }
            })

            /* 还要把缓存的也处理一下吧 */
            /* 1 */
            var pro = this.data.projects;
            var index;
            pro.forEach((p, ind) => {
              if (p._id == proid) {
                index = ind;
              }
            })
            if (index != undefined) pro.splice(index, 1);
            this.setData({
              projects: pro,
            })
            /* 2 */
            var pro = this.data.cacheProjectsR;
            var index;
            pro.forEach((p, ind) => {
              if (p._id == proid) {
                index = ind;
              }
            })
            if (index != undefined) pro.splice(index, 1);
            this.setData({
              cacheProjectsR: pro,
            })
            /* 先这样吧 */
          } else if (n == 2) { //拒绝了
            messBack = {
              userInfo: app.globalData.userInfo,
              user_id: app.globalData.id,
              proid: proid,
              state: 1,
              needAgreeButton: false,
              content: '申请结束项目' + ' [' + proname + '] 被拒绝了，请继续完善项目的内容',
              time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
            };
          }

          if (messBack != undefined) {
            db.collection('userInfo').doc(user_id).update({
              data: {
                messages: _.push(messBack)
              },
              success: res => {
                wx.showToast({
                  title: '消息已发送',
                })
                console.log('[userInfo] [回信] 成功');
              }
            })
          }
        }
      })
    } else if (thisMess.type == "申请加入项目") {
      db.collection('Projects').doc(proid).get({
        success: res => {
          var proname = res.data.projectName;
          var messBack = undefined;
          if (n == 1) { //同意了
            messBack = {
              userInfo: app.globalData.userInfo,
              user_id: app.globalData.id,
              proid: proid,
              state: 1,
              needAgreeButton: false,
              content: '加入项目' + ' [' + proname + '] 成功，可在“参与”的项目中查看已参与的项目',
              time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
            };

            var mem = {
              id: user_id,
            };
            db.collection('Projects').doc(proid).update({
              data: {
                member: _.push(mem),
              },
              success: res => {
                wx.showToast({
                  title: '添加成员成功',
                })
                console.log('[Projects] [添加成员] 成功');
              }
            })
          } else if (n == 2) { //拒绝了
            messBack = {
              userInfo: app.globalData.userInfo,
              user_id: app.globalData.id,
              proid: proid,
              state: 1,
              needAgreeButton: false,
              content: '加入项目' + ' [' + proname + '] 被拒绝了',
              time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
            };
          }

          if (messBack != undefined) {
            db.collection('userInfo').doc(user_id).update({
              data: {
                messages: _.push(messBack)
              },
              success: res => {
                wx.showToast({
                  title: '消息已发送',
                })
                console.log('[userInfo] [回信] 成功');
              }
            })
          }
        }
      })
    }
  },

  onTaprMessButton: function (e) { //已读信息
    var n = e.currentTarget.dataset.n;
    var index = e.currentTarget.dataset.index;
    var rm = this.data.readedMess;
    var user_id = rm[index].user_id; //保留发送方的id  
    var userInfo = e.currentTarget.dataset.userinfo
    var proid = rm[index].proid;

    rm.splice(index, 1);
    this.setData({
      readedMess: rm,
    })
    console.log(this.data.unreadMess)
    var messages = this.data.unreadMess;
    rm.forEach(m => {
      messages.push(m);
    }) //重新连接两个信息
    console.log('messages  ', messages)

    db.collection('userInfo').doc(app.globalData.id).update({
      data: {
        messages: messages,
      },
      success: res => {
        console.log('[更新userInfo] [更改消息状态] 成功')
      }
    }) //更新信息

    db.collection('Projects').doc(proid).get({
      success: res => {
        var proname = res.data.projectName;
        var messBack = undefined;
        var num = res.data.memberNum;
        if (thisMess.type = '发布项目') {
          if (n == 1) { //同意了
            messBack = {
              userInfo: app.globalData.userInfo,
              user_id: app.globalData.id,
              proid: proid,
              state: 1,
              needAgreeButton: false,
              content: '加入项目' + ' [' + proname + '] 成功，可在“参与”的项目中查看已参与的项目',
              time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
            }
            var stateN = '组队中';
            if (num == 0) stateN = '进行中';
            db.collection('Projects').doc(proid).update({
              data: {
                projectState: stateN,
              },
              success: res => {
                console.log(mem)
                wx.showToast({
                  title: '回信成功',
                })
                console.log('回信 成功');
              }
            })
          } else if (n == 2) { //拒绝了
            messBack = {
              userInfo: app.globalData.userInfo,
              user_id: app.globalData.id,
              proid: proid,
              state: 1,
              needAgreeButton: false,
              content: '申请发布项目' + ' [' + proname + '] 被拒绝了',
              time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
            };
          }

          if (messBack != undefined) {
            db.collection('userInfo').doc(user_id).update({
              data: {
                messages: _.push(messBack)
              },
              success: res => {
                wx.showToast({
                  title: '消息已发送',
                })
                console.log('[userInfo] [回信] 成功');
              }
            })
          }
        } else if (thisMess.type == "结束项目") {
          db.collection('Projects').doc(proid).get({
            success: res => {
              var proname = res.data.projectName;
              var messBack = undefined;
              var num = res.data.memberNum;
              var label = res.data.projectLabel;
              if (n == 1) { //同意了
                messBack = {
                  userInfo: app.globalData.userInfo,
                  user_id: app.globalData.id,
                  proid: proid,
                  state: 1,
                  needAgreeButton: false,
                  content: '申请完成项目' + ' [' + proname + '] 成功',
                  time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
                };
                var vHour = new Int();
                if (label == '乡村教育') {
                  vHour = 10;
                } else if (label == '志愿招募') {
                  vHour = 60;
                } else if (label == '乡村振兴') {
                  vHour = 30;
                } else if (label == '基层调研') {
                  vHour = 50;
                }
                var sponsor = res.data.sponsor;
                var members = res.data.member; //注意.id
                //增加公益时
                db.collection('userInfo').doc(sponsor).get({
                  success: res => {
                    var hour = parseInt(res.data.vHour) + parseInt(vHour);
                    db.collection('userInfo').doc(sponsor).update({
                      data: {
                        vHour: hour,
                      }
                    })
                  }
                }) //发起者
                members.forEach(m => {
                  db.collection('userInfo').doc(m.id).get({
                    success: res => {
                      var hour = parseInt(res.data.vHour) + parseInt(vHour);
                      db.collection('userInfo').doc(m.id).update({
                        data: {
                          vHour: hour,
                        }
                      })
                    }
                  })
                }) //参与者
                db.collection('Projects').doc(proid).remove({
                  success: res => {
                    wx.showToast({
                      title: '已从数据库删除该项目',
                    })
                  }
                })

                /* 还要把缓存的也处理一下吧 */
                /* 1 */
                var pro = this.data.projects;
                var index;
                pro.forEach((p, ind) => {
                  if (p._id == proid) {
                    index = ind;
                  }
                })
                if (index != undefined) pro.splice(index, 1);
                this.setData({
                  projects: pro,
                })
                /* 2 */
                var pro = this.data.cacheProjectsR;
                var index;
                pro.forEach((p, ind) => {
                  if (p._id == proid) {
                    index = ind;
                  }
                })
                if (index != undefined) pro.splice(index, 1);
                this.setData({
                  cacheProjectsR: pro,
                })
                /* 先这样吧 */
              } else if (n == 2) { //拒绝了
                messBack = {
                  userInfo: app.globalData.userInfo,
                  user_id: app.globalData.id,
                  proid: proid,
                  state: 1,
                  needAgreeButton: false,
                  content: '申请结束项目' + ' [' + proname + '] 被拒绝了，请继续完善项目的内容',
                  time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
                };
              }

              if (messBack != undefined) {
                db.collection('userInfo').doc(user_id).update({
                  data: {
                    messages: _.push(messBack)
                  },
                  success: res => {
                    wx.showToast({
                      title: '消息已发送',
                    })
                    console.log('[userInfo] [回信] 成功');
                  }
                })
              }
            }
          })
        } else {
          if (n == 1) { //同意了
            messBack = {
              userInfo: app.globalData.userInfo,
              user_id: app.globalData.id,
              proid: proid,
              state: 1,
              needAgreeButton: false,
              content: '加入项目' + ' [' + proname + '] 成功，可在“参与”的项目中查看已参与的项目',
              time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
            }
            var mem = {
              id: user_id,
              avatarUrl: userInfo.avatarUrl,
              nickName: userInfo.nickName,
            };
            db.collection('Projects').doc(proid).update({
              data: {
                member: _.push(mem),
              },
              success: res => {
                console.log(mem)
                wx.showToast({
                  title: '添加成员成功',
                })
                console.log('[Projects] [添加成员] 成功');
              }
            })
          } else if (n == 2) { //拒绝了
            messBack = {
              userInfo: app.globalData.userInfo,
              user_id: app.globalData.id,
              proid: proid,
              state: 1,
              needAgreeButton: false,
              content: '加入项目' + ' [' + proname + '] 被拒绝了',
              time: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
            };
          }

          if (messBack != undefined) {
            db.collection('userInfo').doc(user_id).update({
              data: {
                messages: _.push(messBack)
              },
              success: res => {
                wx.showToast({
                  title: '消息已发送',
                })
                console.log('[userInfo] [回信] 成功');
              }
            })
          }
        }
      }
    })

  },

  onTapMessButtonOk: function (e) { //无需回复的未读信息
    var index = e.currentTarget.dataset.index;
    var um = this.data.unreadMess;
    var rm = this.data.readedMess;
    um.splice(index, 1);
    if (um.length == 0) {
      this.setData({
        disUnread: 'none',
      })
    }
    this.setData({
      unreadMess: um,
    })
    var messages = um;
    rm.forEach(m => {
      messages.push(m);
    }) //重新连接两个信息
    db.collection('userInfo').doc(app.globalData.id).update({
      data: {
        messages: messages,
      },
      success: res => {
        console.log('[更新userInfo] [消除已读消息] 成功');
      }
    })
  },

  /* 点击预览图片 */
  onTapImg: function (e) {
    var ID = e.target.dataset.imgid;
    wx.previewImage({
      urls: [ID],
    })
  },

  //systemJS*************************************************************************************
  onTapSetProjectToBanner: function (e) {
    wx.showModal({
      title: '提示',
      content: '是否将项目设为主推',
      success: res => {
        if (res.confirm) {
          var proid = e.currentTarget.dataset.proid;
          db.collection('bannerProjects').get({
            success: res => {
              var isSetted = false;
              res.data.forEach(p => {
                if (p.pro._id == proid) {
                  isSetted = true;
                  wx.showToast({
                    title: '你已经设置过了哦',
                    icon: 'none',
                  })
                }
              })
              if (!isSetted) {
                db.collection('Projects').doc(proid).get({
                  success: res => {
                    var pro = res.data;
                    console.log(pro);
                    db.collection('bannerProjects').add({
                      data: {
                        pro
                      },
                      success: res => {
                        wx.showToast({
                          title: '设置成功',
                        })
                        console.log('[添加主推项目] 成功');
                        console.log(res.data)
                        this.setData({
                          bannerProjects: _.push(pro),
                        })
                      }
                    })
                  }
                })
              }
            }
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 主推项目缓存 */
    db.collection('bannerProjects').get({
      success: res => {
        this.setData({
          bannerProjects: res.data,
        })
      }
    })
    /* 话题缓存 */
    db.collection("shareTopics").get({
      success: res => {
        this.setData({
          topics: res.data,
        })
        console.log('[数据库shareTopics] [查询记录] 成功: ', res)
      }
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
    this.setData({
      disCreateButton: 'none',
    })
    this.communitySharePullDownToRefresh();
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
   * 页面相关事件处理函数--监听用户下拉动作  // 禁用
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
      duration: 1000,
    })
    wx.reLaunch({
      url: '../community/community',
    })
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

  },

  /* 点击显示发布按钮 */
  tapAddButton: function () {
    if (this.data.disCreateButton == 'none') {
      this.setData({
        disCreateButton: '',
      })
    } else {
      this.setData({
        disCreateButton: "none",
      })
    }
  },

  leaveAddButton: function () {
    this.setData({
      disCreateButton: 'none',
    })
  },

  /* 点击创建按钮 */
  onTapCreateButton: function (e) {
    var n = e.currentTarget.dataset.n;
    if (n == 1) {
      wx.navigateTo({
        url: '../createProject/createProject',
      })
    } else if (n == 2) {
      wx.navigateTo({
        url: '../createShares/createShares',
      })
    } else if (n == 3) {
      this.setData({
        disCTopicHeight: '',
        disCreateTopic:'',
      })
      db.collection('shareTopics').get({
        success: res => {
          this.setData({
            topics: res.data,
          })
        }
      }) //拿到现有话题
    }
  },

  /* 退出话题编辑 */
  onTapCancelOfCTopic: function () {
    this.setData({
      disCTopicHeight: 0,
      disCreateTopic:'none',
      createTopicInput: '',
    })
  },

  /* 删除话题 */
  onLongTapTopic: function (e) {
    wx.showModal({
      title: '提示',
      content: '是否删除话题',
      success: res => {
        if (res.confirm) {
          var index = e.currentTarget.dataset.index;
          var removeTopic = this.data.topics[index];
          var topics = this.data.topics;
          topics.splice(index, 1);
          this.setData({
            topics: topics,
          })
          db.collection('shareTopics').doc(removeTopic._id).remove({
            success: res => {
              wx.showToast({
                title: '删除话题成功',
              })
              console.log('[删除话题] 成功')
            }
          })
        }
      }

    })
  },

  /* 发布话题输入 */
  onTopicInput: function (e) {
    this.setData({
      inputTopic: e.detail.value,
    })
  },

  /* 话题发布 */
  onTapCreateTopic: function (e) {
    wx.showModal({
      title: '提示',
      content: '是否发布话题',
      success: res => {
        if (res.confirm) {
          var topic = this.data.inputTopic;
          var newTopic = {
            topic: topic,
            createTime: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
            comments:[],
          }
          var topics = this.data.topics;
          
          db.collection('shareTopics').add({
            data: {
              topic: topic,
              createTime: time.getFullYear() + '.' + (parseInt(time.getMonth()) + 1) + '.' + time.getDate(),
              comments: [],
            },
            success: res => {
              wx.showToast({
                title: '发布话题成功',
              })
              console.log('[创建话题] 成功')
              db.collection('shareTopics').get({
                success:res=>{
                  this.setData({
                    topics: res.data,
                    createTopicInput: '',
                  })
                }
              })
            }
          })

        }
      }
    })
  },

  /* 点击用户须知 */
  onTapAttention: function () {
    this.setData({
      disAttention: '',
    })
  },

  onTapPrivacy: function () {
    this.setData({
      disPrivacy: '',
    })
  },

  onTapCancelAttentionOrPrivacy: function () {
    this.setData({
      disAttention: 'none',
      disPrivacy: 'none',
    })
  }

})