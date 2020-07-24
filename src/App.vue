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
    // let result: object={};
    if (localStorage.getItem("authentication")) {
      // result = await this.$axios
      // .post("/api/admins/login-token")
      // .then((result: { data:{}|[] }) => result.data);
      console.log(mapActions);

      this.$store.dispatch("admin/loginToken");
      
    }
    
    // console.log(result);
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
*{
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
