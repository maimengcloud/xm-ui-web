<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <tags-view></tags-view>
      <app-main ref="main" :style="{overflowY:'auto',maxHeight:maxHeight?maxHeight+'px':'90vh'}"></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  data(){
    return {
      maxHeight:null,
    }
  },
  methods:{
    
    calcMaxHeight(cssSelector) {     
    var table=cssSelector;
    debugger;
    if(typeof cssSelector == 'string'){
      table=document.querySelector(cssSelector);
    }  
    var innerHeight=window.innerHeight  
    var top=150;
    if(table!=null){  
      var rect=table.getBoundingClientRect()    
      if(rect && rect.top!=0){ 
        top=rect.top;
      } 
    } 
    var maxTableHeight =innerHeight-top;  
    return maxTableHeight;
  }, 
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  mounted(){
    this.maxHeight=this.calcMaxHeight(this.$refs.main.$el)
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
