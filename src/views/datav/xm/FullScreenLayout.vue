<template>
             <router-view></router-view> 
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

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
