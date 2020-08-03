<template>
  <div>
    <el-form
      label-position="left"
      label-width="80px"
      status-icon
      :model="updateFormObj"
      :rules="rules"
      ref="updateForm"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="updateFormObj.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="updateFormObj.password"></el-input>
      </el-form-item>
      <el-form-item label="角色" required prop="roleId">
        <RolesDropdown
          :chosen="updateFormObj.roleId"
          @chooseRole="chooseRole($event)"
        >
          ></RolesDropdown
        >
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
import rolesDropdown from "./RolesDropdown.vue";

@Component({
  components: {
    RolesDropdown: rolesDropdown,
  },
})
export default class AdminUpdate extends Vue {
  @Prop() private updateForm:
    | {
        id: number;
        email: string;
        password: string;
        roleId: number;
      }
    | undefined;
  roleList: Array<{ name: string; id: number }>;
  rules: object;
  updateFormObj: {
    id: number;
    email: string;
    password: string;
    roleId: number;
  };

  constructor() {
    super();
    this.roleList = [];
    this.rules = {
      password: [{ validator: this.checkPassword, trigger: "change" }],
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
    if (this.updateForm !== undefined) {
      this.updateFormObj = {
        id: this.updateForm.id,
        email: this.updateForm.email,
        password: this.updateForm.password,
        roleId: this.updateForm.roleId,
      };
    } else {
      this.updateFormObj = {
        id: -1,
        email: "",
        password: "",
        roleId: -1,
      };
    }
  }

  chooseRole(roleId: number) {
    this.updateFormObj.roleId = roleId;
  }

  // get updateFormObj() {

  // }
  async submit() {
    (this.$refs["updateForm"] as any).validate(async (valid: boolean) => {
      if (valid && typeof this.updateFormObj.roleId == "number") {
        const result = await this.$axios
          .put("/api/admins/update", {
            id: this.updateFormObj.id,
            email: this.updateFormObj.email,
            password: this.updateFormObj.password,
            // eslint-disable-next-line
            role_id: this.updateFormObj.roleId,
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

  async checkEmail(rule: any, value: string, callback: Function) {
    const result = await this.$axios
      .post("/api/admins/check-email", {
        email: this.updateFormObj.email,
        id: this.updateFormObj.id,
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
