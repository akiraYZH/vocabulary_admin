import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//导入声明
import vuePrototype from "./ vue-prototype";
import protoInstall from "./utils/protoInstall";
import axios from "./utils/_axios.js";


//Element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(protoInstall("$axios", axios));


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

