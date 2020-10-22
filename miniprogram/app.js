//app.js
var WXBizDataCrypt = require('./utils/cryptojs-master/cryptojs-master/RdWXBizDataCrypt.js');
// var AppId='wx5d581499ee7eb9ba';
// var AppSecret='fe07b5ea91dde8edf6a12d4cd130c8ba';

App({
  globalData: {
    openid: '',
    id: undefined,
    userInfo: undefined,
    isQualified: false,
    _super: true,
    favorPeo: [],
    currentTopic: ""   /* 社区中资讯流点击话题时进入相应话题的资讯发布界面 */,
  },

  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData={};

  }
})
