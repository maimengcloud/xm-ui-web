<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <pan-thumb style="float: left" :image="userInfo.headimgurl"> Your roles:
        <span class="pan-info-roles" :key='item.roleid' v-for="item in roles">{{item.roleName}}</span>
      </pan-thumb>
      <github-corner></github-corner>
      <div class="info-container">
        <span class="display_name">{{userInfo.username}}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">editor : dashboard</span>
      </div>
    </div>
    <div>
      <img class="emptyGif" src="../../../assets/image/user_img.gif">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import GithubCorner from '@/components/GithubCorner'

export default {
  name: 'dashboard-editor',
  components: { PanThumb, GithubCorner },
  data() {
    return {
      emptyGif: '../../../assets/image/user_img.gif'
    }
  },
  computed: {
    ...mapGetters([
      'userInfo', 
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;
      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>
