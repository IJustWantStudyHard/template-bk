const state = {
  tip: {

  },
  // 客户
  agent: {
    formSearch: {
      role_id: '',
      status: '',
      review: '',
      inputtime: [],
      agent_id: 0
    },
    otherSearch: {
      keywords: '',
      user_id: ''
    },
    agentSelect: [], // 下拉选择框、代理
    pagination: {
      total: 0, // 总条数
      size: 10, // 每页显示条目个数
      page: 1 // 当前页数
    }
  },
  profit: {

  },
  // 活动页面
  activity: {
    formSearch: {
      status: 0,
      view_fake: '', // 浏览量 正序倒序
      exposure_fake: ''// 分享量 正序倒序
    },
    otherSearch: {
      keywords: '',
      store: '',
      agent: ''
    },
    pagination: {
      total: 0, // 总条数
      size: 10, // 每页显示条目个数
      page: 1 // 当前页数
    }
  },
  goods: {

  },
  card: {

  },
  cash: {

  },
  order: {

  },
  rebate: {

  },
  sum: {

  },
  ad: {

  }
}

const mutations = {
  // 更新搜索项
  SearchUpdate: (state, a) => {
    state[a.name][a.key] = a.value
  }
}

const actions = {

}

export default {
  namespaced: false,
  state,
  mutations,
  actions
}
