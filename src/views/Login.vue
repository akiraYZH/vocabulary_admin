<template>
  <div class="container">
    <el-row type="flex" class="row-bg row" justify="center" align="middle">
      <el-col :lg="8" :sm="14" :span="20">
        <el-form
          :model="loginForm"
          label-width="100px"
          class="demo-dynamic form"
        >
          <h2 class="title">单词管理系统</h2>
          <el-form-item
            prop="account"
            label="Account"
            :rules="[
              {
                required: true,
                message: 'Please enter your account.',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="loginForm.account"></el-input>
          </el-form-item>
          <el-form-item
            label="Password"
            prop="password"
            :rules="{
              required: true,
              message: 'Please enter you password.',
              trigger: 'blur',
            }"
          >
            <el-input v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-button type="primary" @click="login()">Login</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator";
import { asyncRoutes, doFilter } from "../router/routes";

@Component
export default class Login extends Vue {
  loginForm: { account: string; password: string };
  constructor() {
    super();
    this.loginForm = {
      account: "",
      password: "",
    };
  }

  public async login() {
    const result: any = await this.$axios
      .post("/api/admins/login", this.loginForm)
      .then((result: { data: {} | [] }) => result.data);
    // console.log(result);

    if (result.code == 1) {
      this.$store.commit("admin/SET_ADMIN", result.data);
      const newRoutes = doFilter(asyncRoutes, result.data.role.router);
      this.$router.addRoutes(newRoutes);
      const _router: any = this.$router;
      const routes = newRoutes.concat(_router.options.routes);
      this.$store.commit("admin/SET_ROUTER", routes);
      this.$router.push("/");
      
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: rgb(189, 212, 255);
  min-height: 100vh;
  .row {
    min-height: 100vh;
    .form {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      background: rgb(255, 255, 255);
      border-radius: 10px;
      padding: 20px;
      .title {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
