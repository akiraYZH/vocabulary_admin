<template>
  <div class="container">
    <template>
      <!-- top bar with add-btn -->
      <div class="top-bar">
        <el-button type="primary" class="searchBtn" @click="openAdd"
          >Add</el-button
        >
      </div>
      <!-- top bar with add-btn  -->
      <!-- table -->
      <el-table :data="bookList" height="400" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="50"> </el-table-column>
        <el-table-column label="Title" min-width="100">
          <template slot-scope="scope">
            <div
              v-show="!updateList[scope.$index].show"
              @click="showUpdateColumn(scope.$index)"
            >
              {{ scope.row.title }}
            </div>
            <div @click.stop="showUpdateColumn(scope.$index)">
              <el-form class="modify" v-show="updateList[scope.$index].show">
                <el-form-item
                  :required="true"
                  prop="title"
                  :model="updateList[scope.$index]"
                >
                  <div @click.stop="">
                    <el-input
                      v-model="updateList[scope.$index].title"
                      placeholder="Please enter"
                      class="input"
                      :autofocus="true"
                    ></el-input>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    size="small"
                    @click="update(updateList[scope.$index])"
                    >Save</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="Count" width="80">
        </el-table-column>
        <el-table-column label="Controls">
          <template slot-scope="scope">
            <div class="ctls">
              <el-button
                type="primary"
                size="mini"
                class="btn"
                @click="openModifyWords(scope.row)"
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
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import Add from "./Add.vue";

interface Input {
  id: number | undefined;
  title: string;
}
interface UpdateItem extends Input {
  show: boolean;
}
@Component
export default class BookList extends Vue {
  @Prop() private needRefresh: boolean | undefined;

  bookList: Input[];
  updateList: UpdateItem[];
  constructor() {
    super();
    this.bookList = [];
    this.updateList = [];
  }

  get _needRefresh() {
    return this.needRefresh == undefined ? false : this.needRefresh;
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
      .get("/api/books/get")
      .then((data: any) => data.data);

    if (res.code == 1) {
      this.bookList = res.data;
      this.updateList = JSON.parse(JSON.stringify(this.bookList));
      this.updateList.forEach((item: { show: boolean }) => (item.show = false));
    }
    this.$emit("refreshed");
  }

  openModifyWords(row: Input) {
    this.$emit("newUpdate", row);
  }

  showUpdateColumn(index: number) {
    this.updateList[index].show = !this.updateList[index].show;
    this.updateList.splice(0, 0);
  }
  async update(updateObj: Input) {
    const result = await this.$axios
      .put("api/books/update", updateObj)
      .then((data: { data: [] | {} }) => data.data);

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
  async delThis(rowObj: { id: number }) {
    const result = await this.$axios
      .delete("/api/books/del?id=" + rowObj.id)
      .then((data: { data: [] | {} }) => data.data);
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

  openAdd(updateObj: Input) {
    this.$store.commit("layout/OPEN_DIALOG", { component: Add });
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
  }

  .titleColumn {
    width: 100%;
    height: 100%;
  }
  .primary_type {
    color: hotpink;
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
