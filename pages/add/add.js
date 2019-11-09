const app = getApp();

// pages/add/add.js
Page({
  data: {
    accountToAdd: null,
    title: ''
  },

  onLoad: function(options) {
    const data = app.globalData.accountToAdd;
    app.globalData.accountToAdd = null;

    this.setData({
      accountToAdd: data
    });
  },

  onAdd: function () {
    const vm = this;

    wx.showLoading({
      title: '添加中',
    });
    wx.getStorage({
      key: 'accounts',
      fail: function (e) {
        handleAdd({}, vm.data);
      },
      success: function(res) {
        handleAdd(res, vm.data);
      },
    });
  }
})

function handleAdd(res, data) {
  console.log(res, data);
  res = JSON.parse(res.data || '[]');
  res.push({
    title: data.title || data.accountToAdd.issuer,
    secret: data.accountToAdd.secret.toUpperCase(),
    issuer: data.accountToAdd.issuer
  });
  console.log(res);
  wx.hideLoading();
  wx.setStorage({
    key: 'accounts',
    data: JSON.stringify(res),
    success: function () {
      wx.navigateTo({
        url: '/pages/index/index',
      });
      wx.showToast({
        title: '账户已添加',
      });
    }
  });
}