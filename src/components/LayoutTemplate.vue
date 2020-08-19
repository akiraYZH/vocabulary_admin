<template>
  <div>
    <div v-if="!isRecursiveComputed">
      <el-container class="layout">
        <el-header
          class="header"
          :style="`color:` + headerText + `;background:` + headerBg"
          ><i
            class="el-icon-menu menu-btn"
            @click="drawer = true"
            :style="'color:' + headerText"
          />
          <h2>{{ this.title }}</h2>
          <el-tooltip
            class="item"
            effect="dark"
            content="注销"
            placement="bottom-end"
          >
            <i
              class="el-icon-switch-button logout-btn"
              @click="$emit('logout')"
              :style="'color:' + headerText"
            />
          </el-tooltip>
        </el-header>
        <el-container>
          <el-drawer
            title="我是标题"
            :visible.sync="drawer"
            :with-header="false"
            :direction="sideDirection"
            class="drawer"
            size="70%"
          >
            <div :style="`height:100vh;background:` + sideBg">
              <el-menu
                :default-active="sideDefaultActive"
                class="el-menu-vertical-demo menu"
                @open="handleOpen"
                @close="handleClose"
                :background-color="sideBg"
                :text-color="sideText"
                :active-text-color="sideText"
                :router="true"
              >
                <div v-for="(route, index) in routesForSidebar" :key="index">
                  <el-submenu :index="route.path" v-if="route.children">
                    <template slot="title">
                      <i :class="route.meta.icon"></i>
                      <span slot="title">{{ route.meta.title }}</span>
                    </template>
                    <LayoutTemplate
                      :routesForSidebar="route.children"
                      :isRecursive="true"
                      @close-drawer="drawer = false"
                    />
                  </el-submenu>
                  <el-menu-item
                    :index="route.path"
                    v-else
                    :style="
                      route.path == $route.path
                        ? `color:` + sideActive
                        : sideText
                    "
                    @click="drawer = false"
                  >
                    <i :class="route.meta.icon"></i>
                    <span slot="title">{{ route.meta.title }}</span>
                  </el-menu-item>
                </div>
              </el-menu>
            </div>
          </el-drawer>
          <!-- 移动菜单 -->

          <el-aside width="200px" class="aside" :style="`background:` + sideBg">
            <el-menu
              :default-active="sideDefaultActive"
              class="el-menu-vertical-demo menu"
              @open="handleOpen"
              @close="handleClose"
              :background-color="sideBg"
              :text-color="sideText"
              :active-text-color="sideText"
              :router="true"
            >
              <div v-for="(route, index) in routesForSidebar" :key="index">
                <el-submenu :index="route.path" v-if="route.children">
                  <template slot="title">
                    <i :class="route.meta.icon"></i>
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
                  :style="
                    route.path == $route.path ? `color:` + sideActive : sideText
                  "
                  @click="drawer = false"
                >
                  <i :class="route.meta.icon"></i>
                  <span slot="title">{{ route.meta.title }}</span>
                </el-menu-item>
              </div>
            </el-menu>
          </el-aside>
          <!-- 侧边栏 -->
          <el-container>
            <!-- main content -->
            <el-main class="main"><slot name="mainContent"></slot></el-main>
            <!-- main content -->
            <el-footer><slot name="mainFooter"></slot></el-footer>
          </el-container>
        </el-container>
      </el-container>
      <!-- content of popup dialog -->
      <el-dialog
        :visible.sync="dialogVisible"
        :width="dialogWidth"
        :before-close="closeDialog"
        center
        :destroy-on-close="true"
      >
        <!-- dinamic prop name and component -->
        <component
          :is="dialogContent"
          :[dialogPropName]="_dialogProp"
        ></component>
      </el-dialog>
      <!-- content of popup dialog -->
    </div>

    <!-- content for recursive -->
    <div v-else>
      <div v-for="(route, index) in routesForSidebar" :key="index">
        <el-submenu :index="route.path" v-if="route.children">
          <template slot="title">
            <i :class="route.meta.icon"></i>
            <span slot="title">{{ route.meta.title }}</span>
          </template>

          <LayoutTemplate
            :routesForSidebar="route.children"
            :isRecursive="true"
            @close-drawer="drawer = false"
          />
        </el-submenu>

        <div v-else>
          <el-menu-item
            :index="route.path"
            :style="
              route.path == $route.path ? `color:` + sideActive : sideText
            "
            @click="$emit('close-drawer')"
          >
            <i :class="route.meta.icon"></i>
            <span slot="title">{{ route.meta.title }}</span>
          </el-menu-item>
        </div>
      </div>
    </div>
    <!-- content for recursive -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

//register component name for recursive component
@Component({ name: "LayoutTemplate" })
export default class LayoutTemplate extends Vue {
  // props to receive
  @Prop() private routesForSidebar!: Array<{
    path: string;
    meta?: { title: string; icon: string };
    children?: Array<{ path: string }>;
  }>;
  @Prop() private isRecursive: boolean | undefined;
  @Prop() private title!: string;
  @Prop() private sideBgColor: string | undefined;
  @Prop() private sideTextColor: string | undefined;
  @Prop() private sideActiveColor: string | undefined;
  @Prop() private headerBgColor: string | undefined;
  @Prop() private headerTextColor: string | undefined;
  @Prop() private sideSlideDirection: string | undefined;
  @Prop() private dialogVisible: boolean | undefined;
  @Prop() private dialogContent: Vue | undefined;
  @Prop() private dialogProp: { [propName: string]: string } | undefined;

  // properties in the component
  drawer: boolean;
  sideDefaultActive: string | undefined;
  timer: boolean;
  width: number;
  height: number;
  dialogWidth: string;
  constructor() {
    super();
    const viewPortSize = this.getViewportSize();
    this.drawer = false;
    this.timer = false;

    this.width = viewPortSize.width;
    this.height = viewPortSize.height;
    this.dialogWidth = "50%";
    if (
      this.routesForSidebar.length > 0 &&
      this.routesForSidebar[0] !== undefined
    ) {
      this.sideDefaultActive = this.routesForSidebar[0].path;
    } else {
      this.sideDefaultActive = undefined;
    }
  }

  get sideBg(): string {
    return this.sideBgColor ? this.sideBgColor : "#545c64";
  }
  get sideText(): string {
    return this.sideTextColor ? this.sideTextColor : "#fff";
  }
  get sideActive(): string {
    return this.sideActiveColor ? this.sideActiveColor : "#ffd04b";
  }
  get headerBg(): string {
    return this.headerBgColor ? this.headerBgColor : "white";
  }
  get headerText(): string {
    return this.headerTextColor ? this.headerTextColor : "#545c64";
  }
  get sideDirection(): string {
    return this.sideSlideDirection ? this.sideSlideDirection : "ltr";
  }
  get isRecursiveComputed() {
    return this.isRecursive == undefined || this.isRecursive == false
      ? false
      : true;
  }
  get _dialogProp() {
    return this.dialogProp == undefined
      ? {}
      : this.dialogProp[this.dialogPropName];
  }

  get dialogPropName() {
    return this.dialogProp == undefined ? "" : Object.keys(this.dialogProp)[0];
  }

  getViewportSize() {
    return {
      width:
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth,
      height:
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight,
    };
  }
  setViewportSize() {
    const viewPortSize = this.getViewportSize();
    this.width = viewPortSize.width;
    this.height = viewPortSize.height;
  }

  setDialogWidth() {
    const size = this.getViewportSize();
    if (size.width > 1024) {
      this.dialogWidth = "50%";
    } else if (size.width > 768) {
      this.dialogWidth = "60%";
    } else if (size.width > 500) {
      this.dialogWidth = "70%";
    } else {
      this.dialogWidth = "90%";
    }
  }
  handleOpen(key: string, keyPath: string) {
    console.log(key, keyPath);
  }
  handleClose(key: string, keyPath: string) {
    console.log(key, keyPath);
  }

  closeDialog(done: Function) {
    if (this.dialogVisible) {
      this.$emit("closeDialog");
    } else {
      done();
    }
  }
  mounted() {
    // initialize dialog width
    this.setDialogWidth();
    window.onresize = () => {
      if (!this.timer) {
        this.timer = true;

        setTimeout(() => {
          this.setViewportSize();
          this.setDialogWidth();
          this.timer = false;
        }, 400);
      }
    };
  }
}
</script>

<style scoped lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  height: inherit;
}

.layout {
  min-height: 100vh;
  .main {
    padding: 0;
  }
  .header {
    box-shadow: 0 2px 4px grey;
    display: flex;
    justify-content: center;
    align-items: center;
    .menu-btn {
      display: none;
      font-size: 36px;
      cursor: pointer;
      position: absolute;
      left: 20px;
      transition: 1s cubic-bezier(0.36, -0.2, 0.47, 0.92);
      &:hover {
        text-shadow: 0 0 5px rgb(182, 182, 182);
        transform: rotate(360deg);
      }
    }
    .logout-btn {
      font-size: 36px;
      cursor: pointer;
      position: absolute;
      right: 20px;
      transition: 0.3s cubic-bezier(0.36, -0.2, 0.47, 0.92);
      &:hover {
        color: white;
        text-shadow: 0 0 5px rgb(255, 167, 167);
        transform: scale(1.1);
      }
    }
  }

  .menu {
    border: 0;
  }
}

@media screen and (max-width: 700px) {
  .layout {
    .header {
      .menu-btn {
        display: block;
      }
    }

    .aside {
      display: none;
    }
  }
}
</style>
