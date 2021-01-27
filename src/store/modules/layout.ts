import store from "@/store";
import { Vue } from "vue-property-decorator";

const state = {
  // if dialog shows up
  dialogVisible: false,
  dialogContent: null,
  dialogProp: undefined
};

const getters = {};

const mutations = {
  OPEN_DIALOG(state: { dialogVisible: boolean, dialogContent: Vue, dialogProp: object }, params: any) {
    state.dialogVisible = true;

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
