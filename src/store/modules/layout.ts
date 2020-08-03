// import axios from "axios";
import store from "@/store";
// import { newAddRoutes, doFilter } from '@/router/router'
import { Vue } from "vue-property-decorator";

const state = {
  // 是否弹出框框
  dialogVisible: false,
  dialogContent: null,
  dialogProp: undefined
};

const getters = {};

const mutations = {
  OPEN_DIALOG(state: { dialogVisible: boolean, dialogContent: Vue, dialogProp: object }, params: any) {
    // const constructor = Vue.extend(params.default);
    // const instance= new constructor();
    // instance.$mount("#dialogContent");
    state.dialogVisible = true;
    console.log(params);

    state.dialogContent = params.component;
    state.dialogProp = params.prop;
  },
  CLOSE_DIALOG(state: { dialogVisible: boolean, dialogContent: Vue | null }) {
    state.dialogVisible = false;

    state.dialogContent = null;
  },

};

const actions = {

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
