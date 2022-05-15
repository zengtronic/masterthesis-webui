import Vue from 'vue'
import LoadScript from "vue-plugin-load-script";
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  LoadScript,
  render: h => h(App)
}).$mount('#app')
