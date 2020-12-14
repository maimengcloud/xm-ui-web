<template>
  <div class="menu-wrapper">
    <!-- <template>
      <router-link to="/">
        <div class="logo" :class="{'has-logo': isCollapse}">
          <img v-if="isCollapse" src="../../../../assets/image/logo1.png" alt="" />
          <img v-else src="../../../../assets/image/logo2.png" alt="" />
        </div>
      </router-link> 
    </template> -->
    <template v-for="item in routes" v-if="!item.hidden&&item.children">

      <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow&&!item.path" to="/" :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" class="logo" :class="{'submenu-title-noDropdown-logo':!isNest, 'has-logo': isCollapse}">
          <img v-if="isCollapse" src="../../../../assets/image/logo1.png" alt="" />
          <img v-else src="../../../../assets/image/logo2.png" alt="" />
        </el-menu-item>
      </router-link>
      <router-link v-else-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow" :to="item.path+'/'+item.children[0].path"
        :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{generateTitle(item.children[0].meta.title)}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" slot="title">{{generateTitle(item.meta.title)}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="{path:item.path+'/'+child.path,query:child.query}" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title" slot="title">{{generateTitle(child.meta.title)}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

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
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    generateTitle
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .logo {
    height: 56px;
    width: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 100%;
    }
  }
  .has-logo {
    width: 100%;
    padding: 0;
    img {
      width: 80%;
    }
  }
  #app .hideSidebar .submenu-title-noDropdown-logo {
    padding: 0 !important;
  }
</style>

