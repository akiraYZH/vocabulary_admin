<template>
  <div>
    <LayoutTemplate :routesForSidebar="routesForSidebar" title="单词管理系统" />
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator";
import LayoutTemplate from "../components/LayoutTemplate.vue";

@Component({
  components: {
    LayoutTemplate: LayoutTemplate,
  },
})
export default class Layout extends Vue {
  // loginForm: { account: string; password: string };

  constructor() {
    super();
    // this.routesForSidebar=[];
    // this.routes=
  }

  get routesForSidebar() {
    return this.$store.state.admin.routesForSidebar
      ? this.$store.state.admin.routesForSidebar
      : [];
  }

  set routesForSidebar(val) {
    this.routesForSidebar = val;
  }

  public async mounted() {
    //  this.routes=this.$store.state.admin.routes;
    // const routes = this.$store.getters["admin/getRoutes"];
    // console.log(JSON.stringify(this.$store.state.admin.routes));
  }
}
</script>
<style lang="scss" scoped></style>
