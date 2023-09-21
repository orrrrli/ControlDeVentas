import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'mdi/css/materialdesignicons.min.css'
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL = 'https://localhost:7267'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
