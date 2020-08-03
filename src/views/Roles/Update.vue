<template>
  <div>
    <el-form
      label-position="left"
      label-width="80px"
      status-icon
      :model="updateFormObj"
      ref="addForm"
    >
      <el-form-item label="角色名" prop="name">
        <el-input v-model="updateFormObj.name"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-checkbox
          v-model="item.selected"
          v-for="item in permissionList"
          :key="item.name"
          >{{ item.name }}</el-checkbox
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
import { Component, Watch, Vue, Prop } from "vue-property-decorator";
import { asyncRoutes } from "../../router/routes";
import { RouteConfig } from "vue-router";

@Component
export default class RoleUpdate extends Vue {
  // rules: object;
  @Prop() private updateForm:
    | {
        id: number;
        name: string;
        permissions: string[];
      }
    | undefined;
  updateFormObj: {
    id: number;
    name: string;
    permissions: Array<string>;
  };
  permissionList: Array<{ name: string; selected: boolean }>;
  constructor() {
    super();
    // this.rules = {
    //   account: [{ validator: this.checkAccount, trigger: ["blur", "change"] }],
    //   password: [
    //     { validator: this.checkPassword, trigger: ["blur", "change"] },
    //   ],
    //   email: [
    //     { required: true, message: "请输入邮箱地址", trigger: "blur" },
    //     {
    //       type: "email",
    //       message: "请输入正确的邮箱地址",
    //       trigger: ["blur", "change"],
    //     },
    //     { validator: this.checkEmail, trigger: ["blur", "change"] },
    //   ],
    // };
    const routesTotal = asyncRoutes;
    this.permissionList = this.createPermissionList(routesTotal);
    // this.updateFormObj = {
    //   name: "",
    //   permissions: this.permissions,
    // };
    if (this.updateForm !== undefined) {
      this.updateFormObj = {
        id: this.updateForm.id,
        name: this.updateForm.name,
        permissions: this.updateForm.permissions,
      };
    } else {
      this.updateFormObj = {
        id: -1,
        name: "",
        permissions: [],
      };
    }
  }

  createPermissionList(
    routes: RouteConfig[],
    list?: Array<{ name: string; selected: boolean }>
  ): Array<{ name: string; selected: boolean }> {
    let permissionList: Array<{ name: string; selected: boolean }> = [];

    for (let i = 0; i < routes.length; i++) {
      if (list) {
        permissionList = list;
      }
      const name = routes[i].name;
      if (name !== undefined) {
        if (
          this.updateForm != undefined &&
          this.updateForm.permissions.some((item) => item == name)
        ) {
          permissionList.push({ name: name, selected: true });
        } else {
          permissionList.push({ name: name, selected: false });
        }
      }
      const children = routes[i].children;
      if (children != undefined && children.length > 0) {
        // console.log("enter");
        // console.log(routes[i].children, permissionList);
        this.createPermissionList(children, permissionList);
      }
      // console.log(permissionList, 123);
    }
    return permissionList;
  }

  get permissions() {
    const permissions: string[] = [];
    this.permissionList.forEach((item) => {
      if (item.selected) {
        permissions.push(item.name);
      }
    });
    return permissions;
  }
  @Watch("permissions")
  refresh(newVal: [], oldVal: []) {
    this.updateFormObj.permissions = newVal;
  }
  // }
  async submit() {
    (this.$refs["addForm"] as any).validate(async (valid: boolean) => {
      if (valid) {
        const result = await this.$axios
          .put("/api/roles/update", this.updateFormObj)
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

  // checkPassword(rule: any, value: string, callback: Function) {
  //   if (value.length < 6) {
  //     callback(new Error("密码不能少于6位"));
  //   } else {
  //     callback();
  //   }
  // }
  // async checkAccount(rule: any, value: string, callback: Function) {
  //   const result = await this.$axios
  //     .post("/api/admins/check-account", {
  //       account: this.addFormObj.account,
  //     })
  //     .then((data: { data: object }) => data.data);
  //   console.log(result);

  //   if (value.length < 6) {
  //     callback(new Error("账号不能少于5位"));
  //   } else if (result.code != 1) {
  //     callback(new Error(result.msg));
  //   } else {
  //     callback();
  //   }
  // }
  // async checkEmail(rule: any, value: string, callback: Function) {
  //   const result = await this.$axios
  //     .post("/api/admins/check-email", {
  //       email: this.addFormObj.email,
  //     })
  //     .then((data: { data: object }) => data.data);
  //   console.log(result);

  //   if (result.code != 1) {
  //     callback(new Error(result.msg));
  //   } else {
  //     callback();
  //   }
  // }
}
</script>
