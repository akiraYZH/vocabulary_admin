<template>
  <div class="dashboard">
    <div class="img_box">
      <el-image
        class="img"
        :src="require('../../assets/994b6f2ely1fike1gmlnig208c067dr7.gif')"
        fit="cover"
      ></el-image>
    </div>
    <el-card class="box-card" shadow="hover">
      <h2 class="welcome">Welcome back, {{ adminInfo.account }}!</h2>
      <p>E-mail: {{ adminInfo.email }}</p>
      <p>Your role: {{ adminInfo.role.name }}</p>
      <i class="el-icon-edit-outline modify-btn" @click="openModifyDialog"></i>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator";
import update from "@/components/AdminUpdate.vue";

@Component
export default class DashBoard extends Vue {
  adminInfo: {};
  constructor() {
    super();
    this.adminInfo = this.$store.state.admin.adminInfo;
  }

  openModifyDialog() {
    this.$store.commit("layout/OPEN_DIALOG", {
      component: update,
      prop: {
        updateForm: {
          id: this.$store.state.admin.adminInfo.id,
          email: this.$store.state.admin.adminInfo.email,
          password: "",
          roleId: this.$store.state.admin.adminInfo.role.id,
        },
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.dashboard {
  padding: 5vh 10vw 0;
  box-sizing: border-box;
  text-align: left;
  .box-card {
    text-align: center;
    .welcome {
      margin-bottom: 20px;
    }
    .modify-btn {
      font-size: 30px;
      margin-top: 30px;
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        color: rgb(92, 136, 202);
      }
    }
  }

  .img_box {
    margin: 0 auto 30px;
    width: 30%;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    &::before {
      content: "";
      display: block;
      padding-top: 100%;
    }
    .img {
      position: absolute;
      top: 0;
      left: 0;
      // width: 100%;
      height: 100%;
      overflow: visible;
    }
  }
}
</style>
