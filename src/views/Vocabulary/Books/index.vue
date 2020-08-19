<template>
  <el-tabs v-model="activeName" type="border-card" @tab-remove="removeTab">
    <el-tab-pane label="Books List 单词书列表" name="books" :closable="false"
      ><List
        @newUpdate="addTab($event)"
        :needRefresh="needRefresh"
        @refreshed="needRefresh = false"
    /></el-tab-pane>
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      :closable="true"
    >
      <WordsDistribution
        :updateForm="item.prop"
        @needRefresh="needRefresh = true"
      />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import List from "./List.vue";
// import WordPanel from "@/views/Vocabulary/Words/WordPanel.vue";
import WordsDistribution from "@/views/Vocabulary/Books/WordsDistribution.vue";
interface Input {
  id: number | undefined;
  title: string;
}

@Component({
  components: {
    List: List,
    WordsDistribution: WordsDistribution,
  },
})
export default class Words extends Vue {
  activeName: string;
  // editableTabsValue: string;
  editableTabs: Array<{ title: string; name: string; prop: Input }>;
  needRefresh: boolean;
  constructor() {
    super();
    this.activeName = "books";
    this.editableTabs = [];
    this.needRefresh = false;
  }

  addTab(prop: Input) {
    let isMatched = false;
    for (let i = 0; i < this.editableTabs.length; i++) {
      if (this.editableTabs[i].name == prop.title) {
        //已存在
        isMatched = true;
      }
    }
    if (!isMatched) {
      this.editableTabs.push({
        title: "修改" + prop.title,
        name: prop.title,
        prop: prop,
      });
    }
    this.activeName = prop.title;
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
        activeName = "books";
      }
    }

    this.activeName = activeName;
    this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
  }

  toModifyWords() {
    this.activeName = "modifyWords";
  }
}
</script>
