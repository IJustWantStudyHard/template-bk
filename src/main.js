import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import '@/common/mixin'
import * as filters from './common/filter' // global filters
import has from '@/directive/btn_authority'

// 剪切板
import VueClipboard from 'vue-clipboard2'

// 带有灰色底的标题
import Tip from '@/components/Tool/Tip'

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.use(ElementUI)
Vue.use(VueClipboard)
// 挂载标题组件至全局
Vue.component('tip', Tip)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  directives: has,
  render: h => h(App)
})
