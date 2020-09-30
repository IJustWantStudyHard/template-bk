// github https://github.com/kamranahmedse/driver.js
export const stepFirst = [
  {
    element: '.activity-name',
    popover: {
      title: '活动名称',
      description: '字数在20个以内',
      position: 'top'
    }
  },
  // {
  //   element: '.activity-time',
  //   popover: {
  //     title: '活动时间',
  //     description: '设置活动的开始时间与结束时间',
  //     position: 'top'
  //   }
  // },
  {
    element: '.activity-is_message',
    popover: {
      title: '开启留言',
      description: '默认关闭用户留言功能，如需用户留言请自行开启。' + '<br />',
      position: 'top'
    }
  },
  // {
  //   element: '.activity-type',
  //   popover: {
  //     title: '活动类型',
  //     description: '请先选择活动类型并填写活动详情；',
  //     position: 'top'
  //   }
  // },
  {
    element: '.activity-detail',
    popover: {
      title: '活动详情',
      description: '设置活动详情',
      position: 'top'
    }
  },
  {
    element: '.activity-share_title',
    popover: {
      title: '分享标题',
      description: '推荐40个汉字以内',
      position: 'top'
    }
  }, {
    element: '.activity-share_desc',
    popover: {
      title: '分享描述',
      description: '1.推荐30个汉字以内；',
      position: 'top'
    }
  }, {
    element: '.activity-share_pic',
    popover: {
      title: '分享图片',
      description: '1.图片尺寸：1:1；' + '<br />' +
                   '2.图片大小必须小于100KB',
      position: 'top'
    }
  }, {
    element: '.submit-btn',
    popover: {
      title: '下一步',
      description: '点击后可完成活动其他设置',
      position: 'top'
    }
  }
]

export const stepSecond = [
  {
    element: '.activity-activity_type',
    popover: {
      title: '红包领取模式',
      description: '请选择红包领取模式，若选择推广赚钱，需要填写推广人数',
      position: 'top'
    }
  },
  {
    element: '.activity-get_type',
    popover: {
      title: '红包领取次数',
      description: '用户领取红包的次数限制',
      position: 'top'
    }
  },
  {
    element: '.activity-area',
    popover: {
      title: '红包领取地区',
      description: '指定地区内的用户可参与活动；' + '<br />',
      position: 'top'
    }
  },
  {
    element: '.activity-redpacket_type',
    popover: {
      title: '红包模式',
      description: '1.请选择红包模式' + '<br />' +
                   '2.选择随机模式的活动需要填写随机最小金额与随机最大金额' + '<br />' +
                   '3.选择等额模式的活动需要填写相应模式的金额和概率',
      position: 'top'
    }
  },
  // {
  //   element: '.activity-redpacket_process',
  //   popover: {
  //     title: '红包领取流程',
  //     description: '请选择红包领取流程',
  //     position: 'top'
  //   }
  // },
  // {
  //   element: '.activity-banner',
  //   popover: {
  //     title: '顶部背景图',
  //     description: '1.图片尺寸宽750px，高任意，底部留白区域为40px；' + '<br />' +
  //                  '2.图片大小必须小于1M',
  //     position: 'top'
  //   }
  // }, {
  //   element: '.activity-bg_color',
  //   popover: {
  //     title: '背景色',
  //     description: '首页的背景主色调',
  //     position: 'top'
  //   }
  // },
  {
    element: '.activity-is_music',
    popover: {
      title: '背景音乐',
      description: '1.开启上传背景音乐后需要上传音乐；' + '<br />' +
                   '1.文件格式为mp3；' + '<br />' +
                   '2.文件大小必须小于5M',
      position: 'top'
    }
  },
  {
    element: '.activity-bg_time',
    popover: {
      title: '红包领取倒计时',
      description: '用户进入页面阅读文章多长时间后分享红包有效。',
      position: 'top'
    }
  },
  {
    element: '.activity-is_card',
    popover: {
      title: '是否开启卡劵',
      description: '1.卡劵默认关闭' + '<br />' +
                    '2.若开启卡劵后，请设置卡劵' + '<br />' +
                    '3.用户将在购买套餐成功后获得卡劵',
      position: 'top'
    }
  }, {
    element: '.activity-first_screen',
    popover: {
      title: '首屏广告',
      description: '1.图片尺寸：750px*1334px' + '<br />' +
                    '2.图片大小必须小于1000KB' + '<br />' +
                    '3.不传则显示默认广告',
      position: 'top'
    }
  }, {
    element: '.activity-template_type',
    popover: {
      title: '页面风格',
      description: '不同的模式展示不同的页面风格样式',
      position: 'top'
    }
  }, {
    element: '.submit-btn',
    popover: {
      title: '下一步',
      description: '点击后可提交活动',
      position: 'top'
    }
  }
]
