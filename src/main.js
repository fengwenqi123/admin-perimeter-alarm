import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import './icons'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './permission'
import './styles/index.scss'
import * as filters from './filters' // global filters
import './assets/font/font.css'
import VDragged from 'v-dragged'

Vue.use(VDragged)
Vue.config.productionTip = false
Vue.use(Element, {
  size: 'medium'
})
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app')
