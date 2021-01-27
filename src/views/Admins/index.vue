<template>
  <div class="container">
    <template>
      <!-- top bar with add-btn and search-input  -->
      <div class="top-bar">
        <el-button type="primary" class="addBtn" @click="openAdd"
          >Add</el-button
        >
        <div class="frame">
          <el-input
            v-model="input"
            class="searchBar"
            placeholder="Please enter"
            v-on:keyup.native.enter="
              current = 1;
              keyword = input;
              getList();
            "
          >
            <el-button
              slot="append"
              class="icon"
              icon="el-icon-search"
              @click="
                current = 1;
                keyword = input;
                getList();
              "
            ></el-button
          ></el-input>
        </div>
      </div>
      <!-- top bar with add-btn and search-input  -->
      <!-- table -->
      <el-table :data="adminList" height="400" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column prop="account" label="Account" width="100">
        </el-table-column>
        <el-table-column prop="email" label="E-mail" width="180">
        </el-table-column>
        <el-table-column prop="password" label="Password"> </el-table-column>
        <el-table-column prop="role.name" label="Role"> </el-table-column>
        <el-table-column label="Controls">
          <template slot-scope="scope">
            <div class="ctls">
              <el-button
                type="primary"
                size="mini"
                class="btn"
                @click="openUpdate(scope.row)"
                >Update</el-button
              >
              <el-popconfirm
                title="Confirm?"
                @onConfirm="delThis(scope.row)"
              >
                <el-button
                  type="primary"
                  size="mini"
                  class="btn"
                  slot="reference"
                  >Delete</el-button
                >
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- table -->
      <!-- pagination -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="size"
        @current-change="turnPage"
        class="pagination"
        :current-page="current"
      >
      </el-pagination>
      <!-- pagination -->
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import AdminUpdate from "@/components/AdminUpdate.vue";
import Add from "@/views/Admins/Add.vue";

// import update from "./update";

@Component
export default class Admins extends Vue {
  adminList: [];
  size: number;
  input: string;
  keyword: string;
  current: number;
  // eslint-disable-next-line
  updateObj: { id: number; account: string; password: string; role_id: number };
  constructor() {
    super();
    this.adminList = [];
    this.size = 0;
    this.input = "";
    this.keyword = "";
    this.current = 1;
    this.updateObj = {
      id: 0,
      account: "",
      password: "",
      // eslint-disable-next-line
      role_id: 0,
    };
  }
  turnPage(current: number) {
    this.current = current;
    this.getList();
  }

  get query(): string {
    if (this.keyword.length) {
      return `?current=${this.current}&keyword=${this.keyword}`;
    } else {
      return `?current=${this.current}`;
    }
  }

  get dialogVisible() {
    return this.$store.state.layout.dialogVisible;
  }
  @Watch("dialogVisible")
  refresh(newVal: boolean, oldVal: boolean) {
    console.log(newVal, oldVal);
    if (oldVal == true && newVal == false) {
      this.getList();
    }
  }

  async getList() {
    const res = await this.$axios
      .get("/api/admins/get" + this.query)
      .then((data: any) => data.data);
    console.log(res);

    if (res.code == 1) {
      this.adminList = res.data;
      if (res.pagging) {
        this.size = res.pagging.total;
      } else {
        this.size = 0;
      }
    }
  }

  openAdd() {
    this.$store.commit("layout/OPEN_DIALOG", {
      component: Add,
    });
  }
  openUpdate(updateRow: any) {
    console.log(updateRow);
    const roleId = updateRow.role ? updateRow.role.id : "";
    this.$store.commit("layout/OPEN_DIALOG", {
      component: AdminUpdate,
      prop: {
        updateForm: {
          id: updateRow.id,
          email: updateRow.email,
          password: updateRow.password,
          roleId: roleId,
        },
      },
    });
  }
  async delThis(rowObj: { id: number }) {
    const result = await this.$axios
      .delete("/api/admins/del?id=" + rowObj.id)
      .then((data: { data: [] | {} }) => data.data);
    console.log(result);
    if (result.code == 1) {
      this.$message({
        message: result.msg,
        type: "success",
      });
      this.getList();
    } else {
      this.$message({
        message: result.msg,
        type: "warning",
      });
    }
  }
  async created() {
    this.getList();
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 50px;
  text-align: center;
  .top-bar {
    display: flex;
    margin-bottom: 20px;
    .frame {
      width: 100%;
    }
    .addBtn {
      margin-right: 10px;
    }
  }

  .ctls {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: space-around;
    .btn {
      margin: 5px;
    }
  }
  .pagination {
    margin-top: 30px;
  }
}
</style>
