const state = {
  card_type_list: {
    'GROUPON': '团购',
    'CASH': '代金券',
    'DISCOUNT': '折扣',
    'GIFT': '兑换券',
    'GENERAL_COUPON': '优惠卷'
  },
  color_list: {
    'Color010': '#63b359',
    'Color020': '#2c9f67',
    'Color030': '#509fc9',
    'Color040': '#5885cf',
    'Color050': '#9062c0',
    'Color060': '#d09a45',
    'Color070': '#e4b138',
    'Color080': '#ee903c',
    'Color081': '#f08500',
    'Color082': '#a9d92d',
    'Color090': '#DD6549',
    'Color100': '#CC463D',
    'Color101': '#cf3e36',
    'Color102': '#5E6671'
  },
  status_list: {
    1: '待审核',
    2: '审核失败',
    3: '通过审核',
    4: '卡券被商户删除',
    'CARD_STATUS_DISPATCH': '在公众平台投放过的卡券'
  },
  code_type_list: {
    'CODE_TYPE_TEXT': '文本',
    'CODE_TYPE_BARCODE': '一维码',
    'CODE_TYPE_QRCODE': '二维码',
    'CODE_TYPE_ONLY_BARCODE': '一维码,无code显示',
    'CODE_TYPE_ONLY_QRCODE': '二维码,无code显示',
    'CODE_TYPE_NONE': '不显示code和条形码类型'
  },
  date_info_type_list: {
    'DATE_TYPE_FIX_TIME_RANGE': '固定日期区间',
    'DATE_TYPE_FIX_TERM': '固定时长 （自领取后按天)'
  },
  week_list: {
    MONDAY: '周一',
    TUESDAY: '周二',
    WEDNESDAY: '周三',
    THURSDAY: '周四',
    FRIDAY: '周五',
    SATURDAY: '周六',
    SUNDAY: '周日'
  },
  week_list_rule: {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 5,
    SUNDAY: 6
  },
  business_service_list: {
    'BIZ_SERVICE_DELIVER': '外卖服务',
    'BIZ_SERVICE_FREE_PARK': '停车位',
    'BIZ_SERVICE_WITH_PET': '可带宠物',
    'BIZ_SERVICE_FREE_WIFI': '免费wifi'
  }

}

export default {
  namespaced: true,
  state
}
