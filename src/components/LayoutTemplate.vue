<template>
  <div>
    <div v-if="!isRecursiveComputed">
      <el-container class="layout">
        <el-header class="header"
          ><h2>{{ this.title }}</h2></el-header
        >
        <el-container >
          <!-- 侧边栏 -->
          <el-aside width="200px" class="aside" :style="`background:`+sideBg">
            <el-menu
              :default-active="
                routesForSidebar ? routesForSidebar[0].path : undefined
              "
              class="el-menu-vertical-demo menu"
              @open="handleOpen"
              @close="handleClose"
              :background-color="sideBg"
              text-color="#fff"
              active-text-color="#ffd04b"
            >
              <div v-for="(route, index) in routesForSidebar" :key="index">
                <el-submenu :index="route.path" v-if="route.children">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span slot="title">{{ route.meta.title }}</span>
                  </template>
                  <LayoutTemplate
                    :routesForSidebar="route.children"
                    :isRecursive="true"
                  />
                </el-submenu>
                <el-menu-item
                  :index="route.path"
                  v-else
                  @click="go(route.path)"
                >
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{ route.meta.title }}</span>
                </el-menu-item>
              </div>
            </el-menu>
          </el-aside>
          <el-container>
            <el-main>Main</el-main>
            <el-footer>Footer</el-footer>
          </el-container>
        </el-container>
      </el-container>
    </div>

    <div v-else>
      <div v-for="(route, index) in routesForSidebar" :key="index">
        <el-submenu :index="route.path" v-if="route.children">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">{{ route.meta.title }}</span>
          </template>
          <LayoutTemplate
            :routesForSidebar="route.children"
            :isRecursive="true"
          />
        </el-submenu>
        <el-menu-item :index="route.path" v-else @click="go(route.path)">
          <i class="el-icon-menu"></i>
          <span slot="title">{{ route.meta.title }}</span>
        </el-menu-item>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import layoutTemplate from "./LayoutTemplate.vue";
// import { log } from "util";
// import store from "../store";

@Component({
  components: {
    LayoutTempate: layoutTemplate,
  },
})
export default class LayoutTemplate extends Vue {
  @Prop() private routesForSidebar!: [];
  @Prop() private isRecursive: boolean | undefined;
  @Prop() private title!: string;
  // routes:[];
  sideBg:string;
  constructor() {
    super();
    this.sideBg="#545c64";
    // this.routes=[];
  }
  get isRecursiveComputed() {
    return this.isRecursive == undefined || this.isRecursive == false
      ? false
      : true;
  }

  @Watch("routesForSidebar")
  onChangeValue(newV: [], oldV: []) {
    console.log("changed");

    console.log(newV, oldV);
  }

  handleOpen(key: string, keyPath: string) {
    console.log(key, keyPath);
  }
  handleClose(key: string, keyPath: string) {
    console.log(key, keyPath);
  }

  go(path: string) {
    this.$router.push(path);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.layout {
  // display: flex;
  // border:0;
  min-height: 100vh;
  .header {
    box-shadow: 0 2px 4px grey;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .aside {
    .menu {
      border: 0;
    }
  }
}
</style>
