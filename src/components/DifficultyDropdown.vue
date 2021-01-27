<template>
  <el-select v-model="chosenId" placeholder="Please select">
    <el-option label="1:Elementary" :value="1"> </el-option>
    <el-option label="2:Intermediate" :value="2"> </el-option>
    <el-option label="3:Advanced" :value="3"> </el-option>
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
  }

  @Watch("chosenId")
  emitChange(newVal: number, oldVal: number) {
    this.$emit("change", newVal);
  }
}
</script>
