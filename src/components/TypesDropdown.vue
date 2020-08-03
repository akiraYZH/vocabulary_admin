<template>
  <el-select v-model="chosenId" placeholder="请选择">
    <el-option
      v-for="item in typeList"
      :key="item.id"
      :label="item.type_cn + ' ' + item.type_abbr"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { Component, Watch, Vue, Prop } from "vue-property-decorator";

@Component
export default class TypesDropdown extends Vue {
  @Prop() private chosen: number | undefined;
  // eslint-disable-next-line
  typeList: Array<{ type_cn: string; id: number }>;
  chosenId: number | null;
  constructor() {
    super();
    this.typeList = [];
    if (this.chosen != undefined && this.chosen > 0) {
      this.chosenId = this.chosen;
    } else {
      this.chosenId = null;
    }

    // this.chosenId = 1;
  }

  async created() {
    const result = await this.$axios
      .get("/api/types/get")
      .then((data: { data: {} | [] }) => data.data);
    console.log(result);

    this.typeList = result.data;
  }

  @Watch("chosenId")
  emitChange(newVal: number, oldVal: number) {
    // this.addFormObj.permissions = newVal;
    this.$emit("change", newVal);
  }

  handleChange(roleId: Array<number>) {
    console.log(roleId, 123);
    this.$emit("chooseRole", roleId[0]);
  }
}
</script>
