import request from '@/utils/request'

// 验证码
export function getCaptcha() {
  return request({
    url: '/captcha',
    method: 'get'
  })
}

// 登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取登录信息
export function getInfo(params) {
  return request({
    url: '/common/info',
    method: 'get',
    params
  })
}

// 微信绑定jump
export function authback(params) {
  return request({
    url: '/wechat/authback',
    method: 'get',
    params
  })
}

// 微信 登录 没有权限也可以进
export function callback(params) {
  return request({
    url: '/wechat/callback',
    method: 'get',
    params
  })
}

// 地图的脚本
export function TMap(key) {
  return new Promise(function(resolve, reject) {
    window.init = function() {
      resolve(window.qq) // 注意这里
    }
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://map.qq.com/api/js?v=2.exp&callback=init&key=' + key
    script.onerror = reject
    document.head.appendChild(script)
  })
}
