<template>
  <el-tabs v-model="activeName" type="border-card" @tab-remove="removeTab">
    <el-tab-pane label="Words List 单词列表" name="words" :closable="false"
      ><List
        @toAdd="toAdd"
        @newUpdate="addTab($event)"
        :needRefresh="needRefresh"
        @refreshed="needRefresh = false"
    /></el-tab-pane>
    <el-tab-pane label="Add New Word 新增单词" name="add"
      ><WordPanel mode="add" @needRefresh="needRefresh = true"
    /></el-tab-pane>
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      :closable="true"
    >
      <WordPanel
        mode="update"
        :updateForm="item.prop"
        @needRefresh="needRefresh = true"
      />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import List from "./List.vue";
import WordPanel from "@/views/Vocabulary/Words/WordPanel.vue";

type prop = {
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
};

@Component({
  components: {
    List: List,
    WordPanel: WordPanel,
  },
})
export default class Words extends Vue {
  activeName: string;
  // editableTabsValue: string;
  editableTabs: Array<{ title: string; name: string; prop: prop }>;
  needRefresh: boolean;
  constructor() {
    super();
    this.activeName = "words";
    // this.editableTabsValue = "2";
    this.editableTabs = [];
    this.needRefresh = false;
  }

  addTab(prop: prop) {
    let isMatched = false;
    for (let i = 0; i < this.editableTabs.length; i++) {
      if (this.editableTabs[i].name == prop.spelling) {
        //已存在
        isMatched = true;
      }
    }
    if (!isMatched) {
      this.editableTabs.push({
        title: "修改" + prop.spelling,
        name: prop.spelling,
        prop: prop,
      });
    }

    this.activeName = prop.spelling;
  }

  removeTab(targetName: string) {
    const tabs = this.editableTabs;
    let activeName = this.activeName;

    if (activeName === targetName) {
      if (tabs.length > 1) {
        // 如果只有一个不固定的tab
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      } else {
        // 删掉最后一个不固定tab, 跳回单词列表
        activeName = "words";
      }
    }

    this.activeName = activeName;
    this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
  }

  toAdd() {
    this.activeName = "add";
  }
}
</script>
