<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator";
import { mapActions } from "vuex"; // 注意是mapActions

@Component
export default class App extends Vue {
  async created() {
    if (localStorage.getItem("authentication")) {
      this.$store.dispatch("admin/loginToken");
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

// reset
* {
  // reset
  margin: 0;
  padding: 0;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
