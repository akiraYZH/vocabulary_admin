<template>
  <div>
    <el-form
      label-position="left"
      label-width="80px"
      status-icon
      :model="addFormObj"
      ref="addForm"
    >
      <el-form-item label="单词书名" prop="title" required>
        <el-input v-model="addFormObj.title"></el-input>
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
export default class BookAdd extends Vue {
  addFormObj: {
    title: string;
  };

  constructor() {
    super();
    this.addFormObj = {
      title: "",
    };
  }

  async submit() {
    (this.$refs["addForm"] as any).validate(async (valid: boolean) => {
      if (valid) {
        const result = await this.$axios
          .post("/api/books/add", this.addFormObj)
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
}
</script>
