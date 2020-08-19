<template>
  <div>
    <el-form
      label-position="left"
      label-width="80px"
      status-icon
      :model="formObj"
      ref="addForm"
    >
      <el-form-item label="拼写" prop="spelling">
        <el-input v-model="formObj.spelling"></el-input>
      </el-form-item>
      <el-form-item label="拼写(阳性)" prop="spelling_m">
        <el-input v-model="formObj.spelling_m"></el-input>
      </el-form-item>
      <el-form-item label="拼写(阴性)" prop="spelling_f">
        <el-input v-model="formObj.spelling_f"></el-input>
      </el-form-item>
      <el-form-item label="主要含义" prop="primary_explaination">
        <el-input v-model="formObj.primary_explaination"></el-input>
      </el-form-item>
      <el-form-item label="音标" prop="phonetic">
        <el-input v-model="formObj.phonetic"></el-input> </el-form-item
      ><el-form-item label="难度" prop="difficulty">
        <DifficultyDropdown
          :chosen="formObj.difficulty"
          @change="formObj.difficulty = $event"
        ></DifficultyDropdown>
      </el-form-item>
      <el-form-item label="词性" prop="primary_type_id">
        <TypesDropdown
          :chosen="formObj.primary_type_id"
          @change="formObj.primary_type_id = $event"
        ></TypesDropdown>
      </el-form-item>
      <el-form-item label="用法">
        <!-- 释义 -->
        <el-form
          label-position="left"
          label-width="80px"
          v-for="(item, index) in formObj.explainations"
          :key="index"
          class="explaination"
        >
          <i
            class="el-icon-error deleteBtn"
            @click="formObj.explainations.splice(index, 1)"
          ></i>
          <el-form-item label="词性" prop="type_id" class="form-item">
            <TypesDropdown
              :chosen="item.type_id"
              @change="item.type_id = $event"
            ></TypesDropdown>
          </el-form-item>
          <el-form-item
            label="中文释义"
            prop="explaination_cn"
            class="form-item"
          >
            <el-input v-model="item.explaination_cn"></el-input>
          </el-form-item>
          <el-form-item label="法语例句" prop="sentence_fr" class="form-item">
            <el-input v-model="item.sentence_fr"></el-input>
          </el-form-item>
          <el-form-item label="例句释义" prop="sentence_cn" class="form-item">
            <el-input v-model="item.sentence_cn"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort" class="form-item">
            <el-input v-model="item.sort" type="number" min="1"></el-input>
          </el-form-item>
        </el-form>
        <i class="el-icon-circle-plus addBtn" @click="addExplaination"></i>
        <!-- 释义 -->
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
import { asyncRoutes } from "../../../router/routes";
import { RouteConfig } from "vue-router";
import TypesDropdown from "../../../components/TypesDropdown.vue";
import DifficultyDropdown from "../../../components/DifficultyDropdown.vue";

@Component({
  components: {
    TypesDropdown: TypesDropdown,
    DifficultyDropdown: DifficultyDropdown,
  },
})
export default class WordPanel extends Vue {
  @Prop() private mode: string | undefined;
  @Prop() private updateForm:
    | {
        /* eslint-disable */
        id: number;
        spelling: string;
        spelling_m: string;
        spelling_f: string;
        phonetic: string;
        difficulty: number;
        primary_type_id: number;
        primary_explaination: string;
        explainations: Array<{
          type_id: number;
          explaination_cn: string;
          sentence_fr: string;
          sentence_cn: string;
          sort: number;
        }>;
        /* eslint-enable*/
      }
    | undefined;
  /* eslint-disable */
  formObj: {
    id?: number;
    spelling: string;
    spelling_m: string;
    spelling_f: string;
    phonetic: string;
    difficulty: number;
    primary_type_id: number;
    primary_explaination: string;
    explainations: Array<{
      type_id: number;
      explaination_cn: string;
      sentence_fr: string;
      sentence_cn: string;
      sort: number;
    }>;
  };
  /* eslint-enable*/
  constructor() {
    super();

    if (this._mode == "update" && this.updateForm != undefined) {
      this.formObj = this.updateForm;
    } else {
      this.formObj = {
        /* eslint-disable */
        spelling: "",
        spelling_m: "",
        spelling_f: "",
        phonetic: "",
        difficulty: 1,
        primary_type_id: 1,
        primary_explaination: "",
        explainations: [],
        /* eslint-enable*/
      };
    }
  }
  get _mode() {
    if (this.mode == "update") {
      return this.mode;
    } else {
      return "add";
    }
  }
  addExplaination() {
    this.formObj.explainations.push({
      /* eslint-disable */
      type_id: this.formObj.primary_type_id ? this.formObj.primary_type_id : 1,
      explaination_cn: "",
      sentence_fr: "",
      sentence_cn: "",
      sort: 1,
      /* eslint-enable*/
    });
  }

  async submit() {
    (this.$refs["addForm"] as any).validate(async (valid: boolean) => {
      if (valid) {
        let result = null;
        if (this.mode == "update") {
          result = await this.$axios
            .put("/api/words/update", this.formObj)
            .then((data: { data: {} }) => data.data);
        } else {
          result = await this.$axios
            .post("/api/words/add", this.formObj)
            .then((data: { data: {} }) => data.data);
        }

        if (result.code == 1) {
          this.$notify({
            title: "成功",
            message: result.msg,
            type: "success",
          });
          // this.$store.commit("layout/CLOSE_DIALOG");
          this.$emit("needRefresh");
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

<style lang="scss" scoped>
.explaination {
  border: 1px solid rgb(219, 219, 219);
  background: rgb(245, 245, 245);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-sizing: border-box;
  position: relative;
  .deleteBtn {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      color: hotpink;
    }
  }
  .form-item {
    margin-bottom: 10px;
  }
}

.addBtn {
  margin-top: 10px;
  font-size: 36px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    color: hotpink;
  }
}
</style>
