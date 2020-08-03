<template>
  <div>
    <LayoutTemplate
      :routesForSidebar="routesForSidebar"
      title="单词管理系统"
      sideBgColor="#545c64"
      sideTextColor="white"
      sideActiveColor="orange"
      headerBgColor="white"
      headerColor="#545c64"
      :dialogVisible="$store.state.layout.dialogVisible"
      :dialogContent="dialogContent"
      :dialogProp="dialogProp"
      @closeDialog="$store.commit('layout/CLOSE_DIALOG')"
      @logout="logout"
    >
      <router-view slot="mainContent"></router-view>
      <!-- <div slot="dialog" id="dialogContent">
        <component :is="dialogContent" />
      </div> -->
    </LayoutTemplate>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator";
import LayoutTemplate from "@/components/LayoutTemplate.vue";
import store from "../store";
// import about from "./About.vue"
// const dialogContent:any="./Vocabulary/Words/index.vue";

@Component({
  components: {
    LayoutTemplate: LayoutTemplate,
    // dialogContent:()=>import(`${dialogContent}`)
  },
})
export default class Layout extends Vue {
  // loginForm: { account: string; password: string };
  // dialogContent:any;
  constructor() {
    super();
    // this.routesForSidebar=[];
    // this.routes=
    // console.log(store.state);
  }
  get dialogContent() {
    return this.$store.state.layout.dialogContent;
  }

  get dialogProp() {
    return this.$store.state.layout.dialogProp;
  }

  get routesForSidebar() {
    return this.$store.state.admin.routesForSidebar
      ? this.$store.state.admin.routesForSidebar
      : [];
  }

  set routesForSidebar(val) {
    this.routesForSidebar = val;
  }

  logout() {
    this.$store.dispatch("admin/logout");
  }

  registerComponent(comName: string, com: any) {
    const constructor = Vue.extend(com.default);
    const instance = new constructor();
    instance.$mount("#dialogContent");
  }
}
</script>
<style lang="scss" scoped></style>
