<template>
  <div>
    <el-form
      label-position="left"
      label-width="80px"
      status-icon
      :model="addFormObj"
      :rules="rules"
      ref="addForm"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addFormObj.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addFormObj.password"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="addFormObj.nickname"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="confirm-btn" @click="submit"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Prop } from "vue-property-decorator";

@Component
export default class UserAdd extends Vue {
  rules: object;
  addFormObj: {
    nickname: string;
    email: string;
    password: string;
  };

  constructor() {
    super();
    this.rules = {
      nickname: [{ validator: this.checkNick, trigger: ["blur", "change"] }],
      password: [
        { validator: this.checkPassword, trigger: ["blur", "change"] },
      ],
      email: [
        { required: true, message: "请输入邮箱地址", trigger: "blur" },
        {
          type: "email",
          message: "请输入正确的邮箱地址",
          trigger: ["blur", "change"],
        },
        { validator: this.checkEmail, trigger: ["blur", "change"] },
      ],
    };

    this.addFormObj = {
      nickname: "",
      email: "",
      password: "",
    };
  }

  // get updateFormObj() {

  // }
  async submit() {
    (this.$refs["addForm"] as any).validate(async (valid: boolean) => {
      if (valid) {
        const result = await this.$axios
          .post("/api/users/add", {
            nickname: this.addFormObj.nickname,
            email: this.addFormObj.email,
            password: this.addFormObj.password,
          })
          .then((data: { data: {} }) => data.data);

        if (result.code == 1) {
          this.$notify({
            title: "成功",
            message: result.msg,
            type: "success",
          });
          this.$store.commit("layout/CLOSE_DIALOG");
        } else {
          this.$notify({
            title: "失败",
            message: result.msg,
            type: "warning",
          });
        }
      } else {
        this.$message.error("参数错误");
        return false;
      }
    });
  }

  checkPassword(rule: any, value: string, callback: Function) {
    if (value.length < 6) {
      callback(new Error("密码不能少于6位"));
    } else {
      callback();
    }
  }
  async checkNick(rule: any, value: string, callback: Function) {
    const result = await this.$axios
      .post("/api/users/check-nickname", {
        nickname: this.addFormObj.nickname,
      })
      .then((data: { data: object }) => data.data);
    console.log(result);

    if (result.code != 1) {
      callback(new Error(result.msg));
    } else {
      callback();
    }
  }
  async checkEmail(rule: any, value: string, callback: Function) {
    const result = await this.$axios
      .post("/api/users/check-email", {
        email: this.addFormObj.email,
      })
      .then((data: { data: object }) => data.data);
    console.log(result);

    if (result.code != 1) {
      callback(new Error(result.msg));
    } else {
      callback();
    }
  }
}
</script>
