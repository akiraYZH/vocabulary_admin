<template>
  <el-select v-model="chosenId" placeholder="请选择">
    <el-option label="1:初级" :value="1"> </el-option>
    <el-option label="2:中级" :value="2"> </el-option>
    <el-option label="3:高级" :value="3"> </el-option>
  </el-select>
</template>

<script lang="ts">
import { Component, Watch, Vue, Prop } from "vue-property-decorator";

@Component
export default class DifficultyDropdown extends Vue {
  @Prop() private chosen: number | undefined;
  chosenId: number | null;
  constructor() {
    super();

    if (this.chosen != undefined && this.chosen > 0) {
      this.chosenId = this.chosen;
    } else {
      this.chosenId = null;
    }

    // this.chosenId = 1;
  }

  @Watch("chosenId")
  emitChange(newVal: number, oldVal: number) {
    // this.addFormObj.permissions = newVal;
    this.$emit("change", newVal);
  }
}
</script>
