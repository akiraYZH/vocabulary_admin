<template>
  <div>
    <el-form
      label-position="left"
      label-width="80px"
      status-icon
      :model="updateFormObj"
      :rules="rules"
      ref="addForm"
    >
      <el-form-item label="E-mail" prop="email">
        <el-input v-model="updateFormObj.email"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="updateFormObj.password"></el-input>
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

@Component
export default class UserUpdate extends Vue {
  @Prop() private updateForm:
    | {
        id: number;
        email: string;
        password: string;
      }
    | undefined;
  rules: object;

  updateFormObj: {
    id: number | undefined;
    email: string | undefined;
    password: string | undefined;
  };

  constructor() {
    super();
    this.rules = {
      password: [
        { validator: this.checkPassword, trigger: ["blur", "change"] },
      ],
      email: [
        { required: true, message: "Please enter e-mail address.", trigger: "blur" },
        {
          type: "email",
          message: "Please enter e-mail with right format",
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
      };
    } else {
      this.updateFormObj = {
        id: undefined,
        email: undefined,
        password: undefined,
      };
    }
  }

  async submit() {
    (this.$refs["addForm"] as any).validate(async (valid: boolean) => {
      if (valid) {
        const result = await this.$axios
          .put("/api/users/update", this.updateFormObj)
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

  async checkEmail(rule: any, value: string, callback: Function) {
    const result = await this.$axios
      .post("/api/users/check-email", {
        email: this.updateFormObj.email,
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
