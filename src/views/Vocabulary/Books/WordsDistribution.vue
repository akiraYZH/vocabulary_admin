<template>
  <div class="frame">
    <div class="transfer">
      <h3 class="title">{{ updateFormObj.title }}</h3>
      <div>
        <el-transfer
          style="text-align:left"
          class="el-transfer"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入单词字母"
          v-model="selectedWords"
          :data="words"
          :props="{
            key: 'id',
            label: 'spelling',
          }"
          @change="handleChange"
        >
          <div class="transfer-footer" slot="left-footer" size="small"></div>
          <el-button
            class="transfer-footer"
            slot="right-footer"
            size="small"
            @click="submit"
            >Submit</el-button
          >
        </el-transfer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
//type
// eslint-disable-next-line
type word = { id: number; spelling: string; primary_explaination: string };

@Component
export default class WordsDistribution extends Vue {
  @Prop() private updateForm:
    | {
        id: number;
        title: string;
        count: number;
      }
    | undefined;
  updateFormObj: {
    id: number;
    title: string;
    count: number;
  };
  words: word[];
  selectedWords: number[];
  originalBookWords: word[];
  originalUnincludedWords: word[];
  filterMethod: Function;
  constructor() {
    super();
    if (this.updateForm != undefined) {
      this.updateFormObj = {
        id: this.updateForm.id,
        title: this.updateForm.title,
        count: this.updateForm.count,
      };
    } else {
      this.updateFormObj = {
        id: -1,
        title: "",
        count: 0,
      };
    }
    this.words = [];
    this.selectedWords = [];
    this.originalBookWords = [];
    this.originalUnincludedWords = [];
    this.filterMethod = function(query: string, item: any) {
      return item.spelling.indexOf(query) > -1;
    };
  }

  async submit() {
    const result = await this.$axios
      .post("/api/books/distribute-words", {
        id: this.updateFormObj.id,
        toAdd: this.toAdd.length ? this.toAdd : [],
        toRemove: this.toRemove.length ? this.toRemove : [],
      })
      .then((data: { data: {} }) => data.data);

    if (result.code == 1) {
      this.$notify({
        title: "成功",
        message: result.msg,
        type: "success",
      });
      // this.$store.commit("layout/CLOSE_DIALOG");
      this.getList();
    } else {
      this.$notify({
        title: "失败",
        message: result.msg,
        type: "warning",
      });
    }
  }

  handleChange(value: any, direction: string, movedKeys: any) {
    console.log(value, direction, movedKeys);
    console.log(this.toAdd);
  }

  get toAdd() {
    return this.selectedWords.filter((id) => {
      return this.originalUnincludedWords.some((word) => {
        return word.id == id;
      });
    });
  }

  get toRemove() {
    const leftSideWords = this.words.filter((word: word) => {
      return !this.selectedWords.some((id) => {
        return word.id == id;
      });
    });

    const toRemoveWords = leftSideWords.filter((word: word) => {
      return this.originalBookWords.some((word2) => {
        return word.id == word2.id;
      });
    });

    return toRemoveWords.map((word: word) => word.id);
  }
  created() {
    this.getList();
  }

  async getList() {
    const result = await this.$axios
      .get(`/api/books/get-words?id=${this.updateFormObj.id}`)
      .then((data: { data: {} }) => data.data);
    console.log(result);
    this.originalUnincludedWords = result.unincluded;
    this.words = JSON.parse(JSON.stringify(this.originalUnincludedWords));
    this.originalBookWords = JSON.parse(JSON.stringify(result.included));
    this.originalBookWords.forEach((word: word) => {
      this.words.push(word);
      this.selectedWords.push(word.id);
    });
  }
}
</script>

<style lang="scss" scoped>
.frame {
  width: inherit;
  overflow: scroll;
  .transfer {
    text-align: center;
    min-width: 582px;
    .title {
      margin-bottom: 20px;
    }
    .el-transfer {
      display: inline-block;
    }
  }
  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
}
</style>
