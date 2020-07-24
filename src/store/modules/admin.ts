import axios from "@/utils/_axios.js";
import store from "@/store";
import { asyncRoutes, doFilter } from '@/router/routes';
import router from "@/router/index";

type state = {
  adminInfo: object,
  routesForSidebar: []
}
const state:state = {
  //管理者信息
  adminInfo: {},
  routesForSidebar: []

};

const getters = {
  // getAdminInfo: (state:state) => {
  //   return state.adminInfo;
  // },

  // getRoutes: (state:state) => {
  //   return state.routes;
  // }
};

const mutations = {
  SET_ADMIN(state: { adminInfo: object }, params: object) {
    state.adminInfo = params;
  },
  SET_ROUTER(state: { routesForSidebar: [] }, params: []) {
    state.routesForSidebar = params;
  },

};

const actions = {
  loginToken(context: { commit: Function }, payload: any) {

    return axios
      .post("/api/admins/login-token")
      .then((result: { data: { code: number, data: { role: { router: [] } }, msg: string } }) => {
        console.log(result);
        if (result.data.code == 1) {
          context.commit("SET_ADMIN", result.data.data);
          const newRoutes = doFilter(asyncRoutes, result.data.data.role.router);
          router.addRoutes(newRoutes);
          const _router: any = router;
          const routes = newRoutes.concat(_router.options.routes);
          const routesForSideBar = routes.filter(route=>route.name=="Layout")[0].children;

          context.commit("SET_ROUTER", routesForSideBar);
        } else if (result.data.code == -1) {
          const url =
            window.location.protocol + "//" + window.location.host + "/login";
          alert(result.data.msg);
          window.localStorage.clear();
          self.location.href = url;
        }


      });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
