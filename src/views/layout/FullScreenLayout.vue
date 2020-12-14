<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
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

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
