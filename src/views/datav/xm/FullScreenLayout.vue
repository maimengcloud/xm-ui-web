<template>
  <div class="app-wrapper">
    <router-view></router-view>
  </div>
</template>

<script>
 
export default {
  name: 'fullScreenLayout',
  components: { 
  },
  computed: { 
  }
}
</script>

<style lang="less" scoped>
.app-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: rgb(2, 3, 8);
}

//   @import "src/styles/mixin.scss";
//   .app-wrapper {
//     @include clearfix;
//     position: relative;
//     height: 100%;
//     width: 100%;
//   }
</style>
