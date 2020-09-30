// 行政区域
export function setAreaStorage(list) {
  const CircularJSON = require('circular-json')
  return localStorage.setItem('area', CircularJSON.stringify(list))
}

export function getAreaStorage(params, list) {
  if (localStorage.getItem('area')) {
    return JSON.parse(localStorage.getItem('area'))
  } else {
    return []
  }
}

// 活动设置
export function setActivityStorage(form) {
  return localStorage.setItem('activity', JSON.stringify(form))
}

export function getActivityStorage() {
  if (localStorage.getItem('activity')) {
    return JSON.parse(localStorage.getItem('activity'))
  } else {
    return null
  }
}

export function removeActivityStorage(form) {
  return localStorage.removeItem('activity')
}

