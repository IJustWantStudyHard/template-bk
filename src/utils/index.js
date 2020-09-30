/**
 * Created by PanJiaChen on 16/11/18.
 */
import {
  MessageBox
} from 'element-ui'
import router from '@/router'
import store from '@/store'
import Vue from 'vue'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

// 将完整的路由转换成下拉菜单可用的数据
export function getAuthorityOption(arr, result, before) {
  if (!result) {
    result = [{
      id: 0,
      title: '顶级权限',
      type: 0,
      name: null
    }]
  }
  if (!before) before = ''
  for (let item in arr) {
    item = arr[item]
    if (item.meta.type !== 2) {
      result.push({
        id: item.id,
        title: before + item.meta.title,
        type: item.meta.type,
        name: item.name
      })
    }
    if (item.children) {
      result = getAuthorityOption(item.children, result, '|--')
    }
  }
  return result
}

// 将完整的路由转换成分组数据
export function getAGroupOption(arr) {
  var result = []
  for (let item in arr) {
    item = arr[item]
    if (item.meta.type === 1) {
      result.push({
        id: item.id,
        title: item.meta.title
      })
    }
  }
  return result
}

// 将完整的路由转换成页面
export function getAPageOption(arr, result, before) {
  if (!result) {
    result = []
  }
  if (!before) before = ''
  for (let item in arr) {
    item = arr[item]
    if (item.meta.type === 3) {
      result.push({
        id: item.id,
        title: before + item.meta.title,
        name: item.name
      })
    }
    if (item.children) {
      result = getAuthorityOption(item.children, result, item.meta.title + '  /  ')
    }
  }
  return result
}

// 将完整的路由转换成tree可用的数据
export function getAuthorityTree(arr) {
  for (let item in arr) {
    item = arr[item]
    if (item.children && item.children.length > 0) {
      Vue.set(item, 'label', item.meta.title)
      Vue.set(item, 'children', getAuthorityTree(item.children))
    } else {
      Vue.set(item, 'label', item.meta.title)
    }
  }
  return arr
}

// 旧方法 将完整的路由转换成tree可用的数据 （作废）
export function getAuthorityTree1(arr) {
  const result = []
  for (let item in arr) {
    item = arr[item]
    if (item.children && item.children.length > 0) {
      result.push({
        id: item.id,
        label: item.meta.title,
        children: getAuthorityTree(item.children)
      })
    } else {
      result.push({
        id: item.id,
        label: item.meta.title
      })
    }
  }
  return result
}

// 遍历数组再添加元素至最后一个
export function addArrayToLast(allData, data) {
  allData = allData.push(data)
}

// 遍历数组添加指定元素
export function addArrayById(allData, data) {
  let flag = false
  const addChild = function(allData, data) {
    let i = 0
    while (!flag && i < allData.length) {
      if (allData[i].id === data.pid) {
        flag = true
        if (!allData[i].children) Vue.set(allData[i], 'children', [])
        allData[i].children.push(data)
        break
      }
      if (allData[i].children && allData[i].children.length > 0) {
        addChild(allData[i].children, data)
      }
      i++
    }
  }
  addChild(allData, data)
}

// 遍历数组修改指定元素
export function modifyArrayById(allData, data) {
  let flag = false
  const updateChild = function(allData, data) {
    let i = 0
    while (!flag && i < allData.length) {
      if (allData[i].id === data.id) {
        flag = true
        for (const j in allData[i]) {
          if (Object.prototype.hasOwnProperty.call(data, j)) Vue.set(allData[i], j, data[j])
        }
        break
      }
      if (allData[i].children && allData[i].children.length > 0) {
        updateChild(allData[i].children, data)
      }
      i++
    }
  }
  updateChild(allData, data)
}

// 遍历数组删除指定元素
export function deleteArrayById(allData, id) {
  let flag = false
  const deleteChild = function(allData, id) {
    let i = 0
    while (!flag && i < allData.length) {
      if (allData[i].id === id) {
        flag = true
        allData.splice(i, 1)
        break
      }
      if (allData[i].children && allData[i].children.length > 0) {
        deleteChild(allData[i].children, id)
        Vue.set(allData[i], 'children', allData[i].children)
      }
      i++
    }
  }
  deleteChild(allData, id)
}

// 删除提示封装
export function defalultConfirm(msg, callBack, catchBack) {
  MessageBox.confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    callBack()
  }).catch(() => {
    if (catchBack) catchBack()
  })
}

// 查找数组中id最大值
export function checkIdBiggest(pData) {
  let num = pData[0]['id']
  // 数组
  for (const data of pData) {
    if (data.id > num) num = data.id
    if (data.children) {
      const cnum = checkIdBiggest(data.children)
      if (cnum > num) num = cnum
    }
  }
  return num
}

export function datedifference(sDate1, sDate2) {
  // sDate1和sDate2是2006-12-18格式
  var dateSpan, iDays
  sDate1 = Date.parse(sDate1)
  sDate2 = Date.parse(sDate2)
  dateSpan = sDate2 - sDate1
  dateSpan = Math.abs(dateSpan)
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
  return iDays + 1
}

// 按钮跳转页面
export function toRedirect(name, query) {
  var path = store.getters.btnPage[name]
  router.push({
    path,
    query
  })
}

export function toRedirectByName(name, params) {
  router.push({
    name: name,
    params
  })
}

export function formatTimeLength(o, lengthTo) {
  var obj = o
  switch (typeof (o)) {
    case 'number':
      obj = lengthTo(o)
      break
    case 'string':
      obj = lengthTo(o)
      break
    case 'object':
      obj = []
      o.forEach(item => {
        obj.push(lengthTo(item))
      })
      break
  }
  return obj
}

// 将时间戳转为10位
export function formatTime10(o) {
  var lengthTo10 = (num) => num ? Number((num + '').substring(0, 10)) : ''
  return formatTimeLength(o, lengthTo10)
}

// 将时间戳转为13位
export function formatTime13(o) {
  var lengthTo13 = (num) => num ? Number(num) * 1000 : ''
  return formatTimeLength(o, lengthTo13)
}

// 格式化按钮格式
const btnKey = ['roles', 'btnType', 'path', 'method', 'api']
export function formatPermiBtn(res, per) {
  for (let i = 0; i < res.length; i++) {
    var obj = res[i]
    // 获取权限名称
    const name = res[i]['name']
    // 初始化权限对象
    per[name] = {}
    // 为权限对象赋属性
    btnKey.forEach(item => {
      if (obj.meta[item]) {
        per[name][item] = obj.meta[item]
      }
    })
  }
  return per
}

// 删除属性为空的值
export function removeProperty(object) {
  for (const prop in object) {
    // if (object[prop] === 0) break
    if ((!object[prop] || object[prop].length === 0) && object[prop] !== 0) {
      delete object[prop]
    }
    if (typeof (object[prop]) === 'object') removeProperty(object[prop])
  }
  return object
}

// 获取上传文件（图片）的宽高
export function getPicSize(file) {
  return new Promise((resolve, reject) => {
    // 创建对象
    var fReader = new FileReader()
    // 读取图片
    fReader.readAsDataURL(file)
    const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png')
    if (isJPG) {
      // 读取图片过程
      fReader.onload = function() {
        var img = new Image()
        img.src = fReader.result
        img.onload = function() {
          resolve({ res: 'success', el: img, width: img.width, height: img.height })
        }
      }
    } else reject({ res: 'error', message: '图片类型只能是 JPG 或 PNG 格式' })
  })
}
