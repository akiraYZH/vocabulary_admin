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
      <el-form-item label="Account" prop="account">
        <el-input v-model="addFormObj.account"></el-input>
      </el-form-item>
      <el-form-item label="E-mail" prop="email">
        <el-input v-model="addFormObj.email"></el-input>
      </el-form-item>
      <el-form-item label="Passord" prop="password">
        <el-input v-model="addFormObj.password"></el-input>
      </el-form-item>
      <el-form-item label="Role">
        <RolesDropdown
          :chosen="addFormObj.roleId"
          @chooseRole="chooseRole($event)"
        ></RolesDropdown>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="confirm-btn" @click="submit"
          >Submit</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Prop } from "vue-property-decorator";
import rolesDropdown from "@/components/RolesDropdown.vue";

@Component({
  components: {
    RolesDropdown: rolesDropdown,
  },
})
export default class AdminAdd extends Vue {
  rules: object;
  addFormObj: {
    account: string;
    email: string;
    password: string;
    roleId: string;
  };

  constructor() {
    super();
    this.rules = {
      account: [{ validator: this.checkAccount, trigger: ["blur", "change"] }],
      password: [
        { validator: this.checkPassword, trigger: ["blur", "change"] },
      ],
      email: [
        { required: true, message: "请输入邮箱地址", trigger: "blur" },
        {
          type: "email",
          message: "Please enter email with right format",
          trigger: ["blur", "change"],
        },
        { validator: this.checkEmail, trigger: ["blur", "change"] },
      ],
    };

    this.addFormObj = {
      account: "",
      email: "",
      password: "",
      roleId: "",
    };
  }

  chooseRole(roleId: number) {
    this.addFormObj.roleId = String(roleId);
  }

  async submit() {
    (this.$refs["addForm"] as any).validate(async (valid: boolean) => {
      if (valid) {
        const result = await this.$axios
          .post("/api/admins/add", {
            account: this.addFormObj.account,
            email: this.addFormObj.email,
            password: this.addFormObj.password,
            // eslint-disable-next-line
            role_id: this.addFormObj.roleId,
          })
          .then((data: { data: {} }) => data.data);

        if (result.code == 1) {
          this.$notify({
            title: "Success",
            message: result.msg,
            type: "success",
          });
          this.$store.commit("layout/CLOSE_DIALOG");
        } else {
          this.$notify({
            title: "Failed",
            message: result.msg,
            type: "warning",
          });
        }
      } else {
        this.$message.error("Wrong params");
        return false;
      }
    });
  }

  checkPassword(rule: any, value: string, callback: Function) {
    if (value.length < 6) {
      callback(new Error("Password length not less than 6 letters"));
    } else {
      callback();
    }
  }
  async checkAccount(rule: any, value: string, callback: Function) {
    const result = await this.$axios
      .post("/api/admins/check-account", {
        account: this.addFormObj.account,
      })
      .then((data: { data: object }) => data.data);
    console.log(result);

    if (value.length < 6) {
      callback(new Error("Password length less than 6 letters"));
    } else if (result.code != 1) {
      callback(new Error(result.msg));
    } else {
      callback();
    }
  }
  async checkEmail(rule: any, value: string, callback: Function) {
    const result = await this.$axios
      .post("/api/admins/check-email", {
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
