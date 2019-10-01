const otp = require('./otp.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const generateAccountItem = ({ secret, issuer }) => {
  return {
    issuer,
    secret
  };
}

const getParametersFromResult = (result) => {
  const paramString = result.split('?')[1];
  const paramSubStrings = paramString.split('&');
  const params = {};

  paramSubStrings.forEach((s) => {
    const [key, value] = s.split('=');
    params[key] = value;
  });

  return params;
}

/** It does not support configs now. */
const getCodeFromSecretKey = (secret) => {
  return otp.totp.gen(secret);
}

module.exports = {
  formatTime: formatTime,
  getParametersFromResult,
  getCodeFromSecretKey
}