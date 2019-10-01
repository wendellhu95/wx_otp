const utils = require('../../utils/util');
const app = getApp();

let recentUpdated = false;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    codes: [],
    accounts: [],
    secondsLeft: 30,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },
  onShow: function() {
    this.loadAccounts();
  },
  onHide: function() {
    this.stopTimer();
  },
  loadAccounts: function() {
    const vm = this;
    handleLoadingAccounts(function (accounts) {
      vm.setData({
        accounts
      });
      vm.updateCodes();
      vm.startTimer();
    })
  },
  copyAuthenticationInfo: function(e) {
    wx.showToast({
      title: '已复制验证码'
    });
  },
  scanQRCode: function() {
    wx.scanCode({
      success: res => {
        const result = res.result;

        if (result.indexOf('otpauth') !== 0) {
          wx.showModal({
            title: '非两步验证码',
            content: '请扫描两步验证码'
          });
        } else {
          app.globalData.accountToAdd = utils.getParametersFromResult(result);
          wx.navigateTo({
            url: '/pages/add/add'
          });
        }
      }
    });
  },
  editAuthenticationInfo: function() {
    wx.navigateTo({
      url: '/pages/detail/detail'
    });
  },
  startTimer: function() {
    const vm = this;
    vm.stopTimer();

    if (this.data.accounts.length) {
      vm.timer = setInterval(() => {
        const date = new Date();
        const current = date.getSeconds();

        vm.setData({
          secondsLeft: (59 - current) % 30 + (1000 - date.getMilliseconds()) / 1000
        });

        if ((current === 0 || current === 30) && !recentUpdated) {
          vm.updateCodes();
          recentUpdated = true;
          setTimeout(() => recentUpdated = false, 1000);
        }
      }, 16);
    }
  },
  stopTimer: function() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  updateCodes: function() {
    const vm = this;
    const codes = vm.data.accounts.map(a => utils.getCodeFromSecretKey(a.secret));

    console.log(codes);
    vm.setData({
      codes
    });
  },
  onCellTap: function (e) {
    const id = +(e.target.id);
    const code = this.data.codes[id];

    wx.setClipboardData({
      data: code,
    });
    wx.showToast({
      title: '已复制验证码',
    });
  },
  onEdit: function (e) {
    const id = +(e.target.id.replace('account-', ''))
    console.log(id)
  }, 
  onDelete: function (e) {
    const vm = this;
    const id = +(e.target.id.replace('account-', ''))
    const account = this.data.accounts[id];
    wx.showModal({
      title: '删除账户',
      content: `删除名为 ${account.title} 的账户？`,
      success: function() {
        handleLoadingAccounts((accounts) => {
          const deleteIndex = accounts.findIndex(a => a.title === account.title);
          if (deleteIndex !== -1) {
            accounts.splice(deleteIndex, 1);
            wx.setStorage({
              key: 'accounts',
              data: JSON.stringify(accounts),
            });
          }
          vm.loadAccounts();
        })
      }
    })
  }
});

function handleLoadingAccounts(cb) {
  function handler(accounts) {
    cb(JSON.parse(accounts));
  }

  wx.getStorage({
    key: 'accounts',
    success: function(res) {
      handler(res.data);
    },
    fail: function(res) {
      handler('[]')
    }
  })
}

function deleteAccountWithTitle() {

}