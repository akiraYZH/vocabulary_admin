<template>
  <div class="container">
    <template>
      <!-- top bar with add-btn and search-input  -->
      <div class="top-bar">
        <el-button type="primary" class="searchBtn" @click="openAdd"
          >新增</el-button
        >
        <div class="frame">
          <el-input
            v-model="input"
            placeholder="请输入内容"
            v-on:keyup.native.enter="
              current = 1;
              keyword = input;
              getList();
            "
          >
            <el-button
              slot="append"
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
      <el-table :data="wordList" height="400" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="50"> </el-table-column>
        <el-table-column label="Spelling" min-width="100">
          <template slot-scope="scope">
            <div class="spelling">
              {{ scope.row.spelling }}
            </div>
            <div class="phonetic">
              {{ scope.row.phonetic }}
            </div>
            <div class="primary_type">
              {{ scope.row.primary_type.type_abbr }}
            </div>
            <div>
              m:{{ scope.row.spelling_m ? scope.row.spelling_m : "None" }}
            </div>
            <div>
              f:{{ scope.row.spelling_f ? scope.row.spelling_f : "None" }}
            </div>
            <div>
              difficulty:{{
                scope.row.difficulty ? scope.row.difficulty : "None"
              }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Explaination" min-width="250">
          <template slot-scope="scope">
            <el-collapse accordion>
              <el-collapse-item
                v-for="item in scope.row.explainations"
                :key="item.id"
                :title="item.explaination_cn + ' - ' + item.type.type_abbr"
              >
                <div style="color:#001528">
                  {{ item.sentence_fr }}
                </div>
                <div>{{ item.sentence_cn }}</div>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-table-column>
        <el-table-column label="Img" width="200">
          <!-- 上传图片 -->
          <template slot-scope="scope">
            <uploadImg
              :urlTemp="scope.row.image"
              :size="500"
              @uploaded="
                uploaded({
                  id: scope.row.id,
                  oldImg: scope.row.image,
                  newImg: $event.path,
                })
              "
              @uploadFail="uploadFail($event)"
            ></uploadImg>
            <!-- 上传图片 -->
          </template>
        </el-table-column>
        <el-table-column label="Controls">
          <template slot-scope="scope">
            <div class="ctls">
              <el-button
                type="primary"
                size="mini"
                class="btn"
                @click="openUpdate(scope.row)"
                >修改</el-button
              >
              <el-popconfirm
                title="确定删除吗？"
                @onConfirm="delThis(scope.row)"
              >
                <el-button
                  type="primary"
                  size="mini"
                  class="btn"
                  slot="reference"
                  >删除</el-button
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
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import uploadImg from "@/components/uploadImg.vue";
// import Update from "./Update.vue";

@Component({
  components: {
    uploadImg: uploadImg,
  },
})
export default class WordList extends Vue {
  @Prop() private needRefresh: boolean | undefined;
  wordList: [];
  size: number;
  input: string;
  keyword: string;
  current: number;

  constructor() {
    super();
    this.wordList = [];
    this.size = 0;
    this.input = "";
    this.keyword = "";
    this.current = 1;
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

  get _needRefresh() {
    return this.needRefresh == undefined ? false : this.needRefresh;
  }
  @Watch("_needRefresh")
  refresh(newVal: boolean, oldVal: boolean) {
    if (oldVal == false && newVal == true) {
      this.getList();
    }
  }

  async getList() {
    const res = await this.$axios
      .get("/api/words/get" + this.query)
      .then((data: any) => data.data);
    console.log(res);

    if (res.code == 1) {
      this.wordList = res.data;
      if (res.pagging) {
        this.size = res.pagging.total;
      } else {
        this.size = 0;
      }
    }
    this.$emit("refreshed");
  }

  openAdd() {
    this.$emit("toAdd");
  }
  openUpdate(updateRow: any) {
    // eslint-disable-next-line
    updateRow.primary_type_id = updateRow.primary_type.id;
    updateRow.explainations.forEach((explaination: any) => {
      // eslint-disable-next-line
      explaination.type_id = explaination.type.id;
    });
    this.$emit("newUpdate", updateRow);
  }
  async delThis(rowObj: { id: number }) {
    const result = await this.$axios
      .delete("/api/words/del?id=" + rowObj.id)
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

  async uploaded(args: any) {
    console.log(args);

    const reuslt = await this.$axios
      .post("/api/words/img", args)
      .then((data: { data: { code: number; msg: string } }) => {
        this.$message.success(data.data.msg);
      });
  }
  uploadFail(res: any) {
    this.$message.error(res.msg);
  }
  // handleRemove(file, fileList) {
  //   console.log(file, fileList);
  // }

  // handlePreview(file) {
  //   console.log(file);
  // }
  // handleExceed(files, fileList) {
  //   this.$message.warning(
  //     `当前限制选择 3 个文件，本次选择了 ${
  //       files.length
  //     } 个文件，共选择了 ${files.length + fileList.length} 个文件`
  //   );
  // }
  // beforeRemove(file, fileList) {
  //   return this.$confirm(`确定移除 ${file.name}？`);
  // }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 50px;
  text-align: center;
  .top-bar {
    display: flex;
    margin-bottom: 20px;
    .searchBtn {
      margin-right: 10px;
    }
    .frame {
      width: 100%;
    }
  }

  .spelling {
    font-weight: bold;
    font-size: 18px;
  }
  .phonetic {
    font-size: 14px;
    color: rgb(190, 190, 190);
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
