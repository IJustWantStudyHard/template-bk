import { apiBtn } from '@/api/default'

const state = {
  status: 0, // 当前活动状态
  stepActive: 0, // 当前创建的步数
  formValid: { // 表单验证
    first: {
      base: false,
      share: false
    },
    second: {
      red: false,
      // coupon: false,
      else: false
    }
  },
  form: {
    reason: '', // 驳回原因

    name: '', // 活动名称
    // time: [], // 活动时间

    type: 1, // 活动类型 1 文章 2 易企秀
    detail: '', // 详情
    link: '', // 易企秀链接

    is_message: false, // 预约留言 true开启 false不开启

    share_title: '', // 分享标题
    share_desc: '', // 分享描述
    share_image: { id: 0, path: '' }, // 分享图片

    activity_type: 1, // 活动流程 1分享朋友圈赚钱 2 分享好友赚钱（推广赚钱） 3 1+2
    share_money: 0.1, // 分享好友获得金额
    is_fans: 0, // 0不开启吸粉 1开启吸粉
    get_type: 1, // 1:每人只能领取一次 2:每人每天领取一次
    get_limit: 1, // 领取上限
    redpacket_type: 1, // 1随机红包  2单个红包
    max_redpacket: 0.8, // 随机红包最大金额
    min_redpacket: 0.3, // 随机红包最小金额
    single_money: [
      {
        money: 0.3,
        rate: 50
      },
      {
        money: 0.5,
        rate: 30
      },
      {
        money: 1,
        rate: 20
      }
    ], // 单个红包金额
    is_click: 0, // 开启点击赚钱

    area_type: 1, // 地区类型 1选地区 2选范围
    is_fast: false, // 开启地区快速选择
    area: [], // 地区限制
    location: '', // 范围位置
    location_range: 1, // 范围大小
    is_open_province: 1, // 0=否 1=省级 2=市级

    redpacket_process: 1, // 红包领取流程 1 分享朋友圈直接到账 2 分享朋友圈再点击文章到账
    // total_money: '', // 总金额
    // num: 0, // 红包总数量

    // banner: { id: 0, path: '' }, // 顶部背景图
    // bg_color: '#ff0000', // 背景色
    is_music: false, // 是否开启音乐上传 true开启 false不开启
    bg_music: { id: 0, path: '', name: '' }, // 音乐
    bg_time: 0, // 倒计时时间 不给就写0

    is_card: false, // 是否开启卡劵 true开启 false不开启
    card_probability: 0,
    cards: [], // 卡劵
    is_article_card: false, // 是否开启文章卡券
    article_card: { card_id: '', num: 0, type: 2 }, // 文章卡券ID

    first_screen: { id: 0, path: '' }, // 首屏广告

    template_type: 1 // 模板类型
  },
  disabled: false,
  init_virtual_order_num: 0, // 初始化虚拟人数，用于判断虚拟人数是否增加

  template_type: 1 // 模板类型
}

const mutations = {
  ACTIVITY_STATUS: (state, val) => {
    state.status = val
  },
  // 创建流程：当前step
  STEP_ACTIVE: (state, val) => {
    state.stepActive = val
  },
  // 表单校验结果
  VALID_FIRST: (state, val) => {
    state.formValid.first[val.key] = val.value
  },
  VALID_SECOND: (state, val) => {
    state.formValid.second[val.key] = val.value
  },
  // 数据初始化
  INIT_FORM: function(state, val) {
    /**
     * 创建两个相同obj
     * state中用于存储数据，此处obj用于初始化数据
     * 在检测是否有上次未保存内容时，两者作比较
    */
    const obj = {
      reason: '', // 驳回原因

      name: '', // 活动名称
      // time: [], // 活动时间

      type: 1, // 活动类型 1 文章 2 易企秀
      detail: '', // 详情
      link: '', // 易企秀链接

      is_message: false, // 预约留言 true开启 false不开启

      share_title: '', // 分享标题
      share_desc: '', // 分享描述
      share_image: { id: 0, path: '' }, // 分享图片

      activity_type: 1, // 活动流程 1分享朋友圈赚钱 2 分享好友赚钱（推广赚钱） 3 1+2
      share_money: 0.1, // 分享好友获得金额
      is_fans: 0, // 0不开启吸粉 1开启吸粉
      get_type: 1, // 1:每人只能领取一次 2:每人每天领取一次
      get_limit: 1, // 领取上限
      redpacket_type: 1, // 1随机红包  2单个红包
      max_redpacket: 0.8, // 随机红包最大金额
      min_redpacket: 0.3, // 随机红包最小金额
      single_money: [
        {
          money: 0.3,
          rate: 50
        },
        {
          money: 0.5,
          rate: 30
        },
        {
          money: 1,
          rate: 20
        }
      ], // 单个红包金额
      is_click: 0, // 开启点击赚钱

      area_type: 1, // 地区类型 1选地区 2选范围
      is_fast: false, // 开启地区快速选择
      area: [], // 地区限制
      location: '', // 范围位置
      location_range: 1, // 范围大小
      is_open_province: 1, // 0=否 1=省级 2=市级

      redpacket_process: 1, // 红包领取流程 1 分享朋友圈直接到账 2 分享朋友圈再点击文章到账
      // total_money: '', // 总金额
      // num: 0, // 红包总数量

      // banner: { id: 0, path: '' }, // 顶部背景图
      // bg_color: '#ff0000', // 背景色
      is_music: false, // 是否开启音乐上传 true开启 false不开启
      bg_music: { id: 0, path: '', name: '' }, // 音乐
      bg_time: 0, // 倒计时时间 不给就写0

      is_card: false, // 是否开启卡劵 true开启 false不开启
      card_probability: 0,
      cards: [], // 卡劵
      is_article_card: false, // 是否开启文章卡券
      article_card: { card_id: '', num: 0, type: 2 }, // 文章卡券ID

      first_screen: { id: 0, path: '' }, // 首屏广告

      template_type: 1 // 模板类型
    }

    if (val) {
      Object.keys(obj).forEach(function(key) {
        if (val[key] || val[key] === 0 || val[key] === false) obj[key] = val[key]
        // 根据音乐添加开启字段
        if (key === 'bg_music') {
          if (val[key] && val[key].id) obj.is_music = true
          else {
            obj.is_music = false
            obj[key] = { id: 0, path: '', name: '' }
          }
        }
        // 初始化 开启快速选择地区 字段
        if (key === 'area' && [0, 2].includes(val[key])) {
          obj.is_fast = true
        }

        // 初始化 卡劵格式
        if (key === 'article_card') obj['article_card'] = obj['article_card'].length ? obj['article_card'][0] : { card_id: '', num: 0, type: 2 }
      })
    }

    // if (obj.area && typeof (obj.area) === 'string') obj.area = JSON.parse(obj.area)

    state.form = obj

    state.init_virtual_order_num = val ? val.virtual_order_num : obj.virtual_order_num
  },
  // 更新活动表单
  ACTIVITY_FORM: (state, newVal) => {
    // newVal为obj类型，接受key, val, type
    const key = newVal.key
    const val = newVal.val
    const type = newVal.type || ''
    for (const item in state.form) {
      if ((type && type === 'num') && key === item) { // Number类型
        state.form[key] = Number(val)
        return
      }
      if (key === 'is_music') { // 重置音乐
        state.form.is_music = val
        if (!val) state.form.bg_music = { id: 0, path: '', name: '' }
        return
      }
      if (key === 'is_card') { // 重置红包卡劵
        state.form.is_card = val
        if (!val) {
          state.form.card_probability = 0
          state.form.cards = []
        }
        return
      }

      if (key === 'is_article_card ') { // 重置文章卡劵
        state.form.is_card = val
        if (!val) {
          state.form.article_card = { card_id: '', num: 0, type: 2 }
        }
        return
      }

      if (key === 'is_fast') { // 快速选择活动范围
        if (val) {
          state.form.area = 0
          state.form.is_open_province = 0 // 开启快速选择 对 is_open_province的影响
        } else {
          state.form.area = []
          state.form.is_open_province = 1 // 关闭快速选择 对 is_open_province的影响
        }
        state.form[key] = val
        return
      }

      if (key === 'is_fans') { // 开启吸粉后卡劵功能不可用
        if (val) {
          state.form.is_card = false
          state.form.card_probability = 0
          state.form.cards = []
        }
        state.form[key] = val
        return
      }

      if (key === 'area') { // 快速选择地区 对 is_open_province的影响
        switch (val) {
          case 0:
            state.form.is_open_province = 0
            break
          case 2:
            state.form.is_open_province = 1
            break
        }
      }

      if (key === item) {
        state.form[key] = val
        return
      }
    }
  },
  // 是否禁用
  ACTIVITY_DISABLED: (state, val) => {
    state.disabled = val
  }
}

const actions = {
  // 创建活动
  CreateActivity({ commit, state }) {
    return new Promise((resolve, reject) => {
      const form = utils.formateDel({ ...state.form })

      apiBtn('ActivityStore', form)
        .then(res => {
          resolve(res)
        })
        .catch(res => {
          reject(res)
        })
    })
  },

  // 编辑活动
  UpdateActivity({ commit, state }, id) {
    return new Promise((resolve, reject) => {
      const form = utils.formateDel({ ...state.form })
      form.id = id
      // form.music = form.music || 0

      apiBtn('ActivityUpdate', form)
        .then(res => {
          resolve(res)
        })
        .catch(res => {
          reject(res)
        })
    })
  }
}

const utils = {
  //  删除活动未使用字段
  formateDel: (form) => {
    if (form.area.length === 0) form.area = 0
    // form.music = form.music || 0

    // 删除活动类型未使用字段
    switch (form.type) {
      case 1 :
        delete form.link
        break
      case 2:
        delete form.detail
        break
    }

    // 删除红包类型未使用字段
    switch (form.redpacket_type) {
      case 1:
        delete form.single_money
        break
      case 2 :
        delete form.max_redpacket
        delete form.min_redpacket
        break
    }

    // 删除红包领取地区类型 未使用字段
    switch (form.area_type) {
      case 1:
        delete form.location
        delete form.location_range
        break
      case 2:
        delete form.area
        break
    }

    form.share_image = form.share_image.id
    // form.banner = form.banner.id
    // form.area = JSON.stringify(form.area)

    form.bg_music = form.is_music ? form.bg_music.id : 0
    delete form.is_music
    if (!form.bg_time) form.bg_time = 0

    if (!form.reason) delete form.reason
    if (!form.is_card) {
      delete form.card_probability
      delete form.cards
    }
    if (!form.is_article_card) delete form.article_card
    else form.article_card = [form.article_card]

    form.first_screen = form.first_screen.id

    delete form.upload
    return form
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
