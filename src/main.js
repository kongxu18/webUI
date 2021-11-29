import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

//导入全局样式
import '@/assets/css/global.css'

// 全局js
import settings from '@/assets/js/settings'

Vue.prototype.$settings = settings;

// 配置 axios
import axios from 'axios'
Vue.prototype.$axios = axios;

// cookies
import cookies from 'vue-cookies'

Vue.prototype.$cookies = cookies;
// elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);


//bootstrap3
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
