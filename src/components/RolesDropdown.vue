<template>
  <div class="block">
    <el-cascader
      v-model="chosenId"
      :options="_roleList"
      @change="handleChange"
    ></el-cascader>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Prop } from "vue-property-decorator";

@Component
export default class RolesDropdown extends Vue {
  @Prop() private chosen: number | undefined;
  roleList: Array<{ name: string; id: number }>;
  chosenId: number | undefined;
  constructor() {
    super();
    this.roleList = [];
    this.chosenId = this.chosen;
  }

  openModifyDialog() {
    this.$store.commit("layout/OPEN_DIALOG");
  }

  get _roleList() {
    return this.roleList.map((role) => {
      return { label: role.name, value: role.id };
    });
  }

  async created() {
    const result = await this.$axios
      .get("/api/roles/get")
      .then((data: { data: {} | [] }) => data.data);
    this.roleList = result.data;
  }
  handleChange(roleId: Array<number>) {
    this.$emit("chooseRole", roleId[0]);
  }
}
</script>
