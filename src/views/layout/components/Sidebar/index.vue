<template> 
  <section>
  <logo :collapse="isCollapse"/>
  <scroll-bar> 
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    > 
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Logo from './Logo'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar,Logo },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .logo {
    height: 56px;
    width: 100%;
    // padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 100%;
    }
    .logo-text {
      display: flex;
      align-items: center;
      //justify-content: center;
      color: #fff;
      img { 
        //margin-left: 2px;
        width: 35%;
      }
      .main-title {
        font-size: 14px;
        font-weight: bold;
        font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
      }
      .sub-title {
        font-size: 14px;
        font-weight: bold;
        transform: scale(0.8);
        // transform-origin: (left, center);
        transform-origin: left center;
        margin-left: 2px;
      }
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
