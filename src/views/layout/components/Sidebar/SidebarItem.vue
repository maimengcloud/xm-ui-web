<template>
  <div class="menu-wrapper">  
      <template v-for="(item,index) in routes" >
        <div v-if="!item.hidden&&item.children" :key="index" class="menu-item">
          <router-link v-if="hasOneShowingChildren(item.children)" :to="item.path+'/'+item.children[0].path">
            <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
              <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
              <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{generateTitle(item.children[0].meta.title)}}</span>
            </el-menu-item>
          </router-link>

          <el-submenu v-else :index="item.name||item.path">
            <template slot="title">
              <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
              <span v-if="item.meta&&item.meta.title" slot="title">{{generateTitle(item.meta.title)}}</span>
            </template>

            <template v-for="(child,idx) in item.children"> 
                <div v-if="!child.hidden" :key="'idx-'+idx">
                  <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]"></sidebar-item>
                  <router-link v-else :to="{path:item.path+'/'+child.path,query:child.query}">
                    <el-menu-item :index="item.path+'/'+child.path">
                      <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                      <span v-if="child.meta&&child.meta.title" slot="title">{{generateTitle(child.meta.title)}}</span>
                    </el-menu-item>
                  </router-link>
                </div> 
            </template>
          </el-submenu> 
        </div> 
    </template>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'

export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isCollapse() {
      return !this.$store.state.app.sidebar.opened;
    }
  },
  data(){
    return {
      isFirstMenuItem:false,
    }
  },
  methods: {
    hasOneShowingChildren(children) {
      if(!children){
        return false;
      }
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {  
        if(showingChildren[0].children && showingChildren[0].children.length>0){
          return false;
        }else{
          return true;
        } 
      }
      return false
    },
    generateTitle
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  #app .hideSidebar .submenu-title-noDropdown-logo {
    padding: 0 !important;
  }
</style>

