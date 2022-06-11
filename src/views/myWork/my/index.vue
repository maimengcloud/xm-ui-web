<template>
  <div class="m_container">
    <div class="m_content">
      <div class="m_top">
        <el-avatar class="m_avatar" :src="userInfo.headimgurl">
          <img src="../../../assets/image/user_img.gif"/>
        </el-avatar>
        <div class="m_msg">
          <p>{{getDate}}</p>
          <p>{{getTimeStatus}}，{{userInfo.username}}，今天也要元气满满哦！</p>
        </div>
        <el-button class="m_btn" type="primary" @click="moduleSetVisible = true">模块编辑</el-button>
      </div>

      <div class="m_middle">
        <div class="m_left">
          <div class="m_left_1">
            <p>简介</p>
            <span>唛盟是新一代项目管理平台，提供一站式研发协作工具，帮助企业提升研发效能，使用于多种研发工作场景，支持多种角色协同管理。</span>
          </div>
          <div class="m_left_2">
            <img src="../img/l1.png" alt="">
          </div>
        </div>
        <div class="m_right">
          <div class="m_right_menu" @click="gotolink('xm','/xm/core/xmProduct/XmProductMng')">
            <img src="../img/cp.png" alt="">
            <span>产品管理</span>
          </div>
           <div class="m_right_menu" @click="gotolink('xm','/xm/core/xmMenu/XmMenuMng')">
            <img src="../img/xqgl.png" alt="">
            <span>需求管理</span>
          </div>
           <div class="m_right_menu" @click="gotolink('xm','/xm/core/xmProject/XmProjectAllMng')">
            <img src="../img/xmgl.png" alt="">
            <span>项目管理</span>
          </div>
           <div class="m_right_menu" @click="gotolink('xm','/xm/core/xmGroup/XmGroupAllMng')">
            <img src="../img/tdgl.png" alt="">
            <span>团队管理</span>
          </div>
           <div class="m_right_menu" @click="gotolink('xm','/xm/core/xmTask/XmTaskCenter')">
            <img src="../img/kfrw.png" alt="">
            <span>开发任务</span>
          </div>
           <div class="m_right_menu" @click="gotolink('xm','/xm/core/xmQuestion/XmQuestionMng')">
            <img src="../img/qx.png" alt="">
            <span>缺陷管理</span>
          </div>
        </div>
      </div>
      <box-card />
    </div>
    <module-set v-model="moduleSetVisible" />
  </div>
</template>

<script>
import NProgress from 'nprogress' // progress bar

import moduleSet from './components/moduleSet'
import boxCard from './components/boxCard'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
  components: {moduleSet, boxCard},
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    getDate() {
      return dayjs().format('YYYY/M/D');
    },
    getTimeStatus() {
      let hour = dayjs().hour();
      let msg = '早上好';
      if(hour >= 13 || hour <= 18) {
        msg = '下午好';
      }else if (hour >= 19 || hour <= 24){
        msg = '晚上好';
      }
      return msg;
    }
  },

  watch: {
  },

  data() {
    return {
      moduleSetVisible: false
    }
  },

  methods: {

    gotolink(context,path) {
      ;
      if(context==process.env.CONTEXT){
        this.$router.push({path:path});
      }else{
        var prefixUrl=window.location.protocol+"//"+window.location.host+"/"+context+"/"+process.env.VERSION+"/#"; //   返回https://mp.csdn.net
        window.open(prefixUrl+path)
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }

    },

  },


  mounted() {

  }
}
</script>

<style lang="scss" scoped>
@import '../common.scss';
@import './index.scss';
</style>
