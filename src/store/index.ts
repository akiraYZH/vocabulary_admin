import Vue from "vue";
import Vuex from "vuex";
import admin from "./modules/admin";
import layout from "./modules/layout";
Vue.use(Vuex);


Vue.use(Vuex)

export default new Vuex.Store({
  strict: false,
  modules: {
    admin,layout
  }
})