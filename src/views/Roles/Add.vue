<template>
  <div>
    <el-form
      label-position="left"
      label-width="80px"
      status-icon
      :model="addFormObj"
      ref="addForm"
    >
      <el-form-item label="Role name" prop="name">
        <el-input v-model="addFormObj.name"></el-input>
      </el-form-item>
      <el-form-item label="Permissions">
        <el-checkbox
          v-model="item.selected"
          v-for="item in permissionList"
          :key="item.name"
          >{{ item.name }}</el-checkbox
        >
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
import { Component, Watch, Vue, Prop } from "vue-property-decorator";
import { asyncRoutes } from "../../router/routes";
import { RouteConfig } from "vue-router";

@Component
export default class RoleAdd extends Vue {
  // rules: object;
  addFormObj: {
    name: string;
    permissions: Array<string>;
  };
  permissionList: Array<{ name: string; selected: boolean }>;
  constructor() {
    super();
    const routesTotal = asyncRoutes;
    this.permissionList = this.createPermissionList(routesTotal);
    this.addFormObj = {
      name: "",
      permissions: this.permissions,
    };
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
        permissionList.push({ name: name, selected: false });
      }
      const children = routes[i].children;
      if (children != undefined && children.length > 0) {
        this.createPermissionList(children, permissionList);
      }
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
    this.addFormObj.permissions = newVal;
  }
  // }
  async submit() {
    (this.$refs["addForm"] as any).validate(async (valid: boolean) => {
      if (valid) {
        const result = await this.$axios
          .post("/api/roles/add", this.addFormObj)
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
}
</script>
