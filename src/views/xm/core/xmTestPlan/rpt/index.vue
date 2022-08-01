<template>
  <div class="m_container">
    <div class="m_content">
      <div class="m_top">  
        <el-button class="m_btn" type="primary" @click="compsSetVisible = true">模块编辑</el-button>
      </div> 
      <comps-card ref="compsCard" />
    </div>
    <comps-set v-model="compsSetVisible" @submit="onCompsSet"/>
  </div>
</template>

<script>
import NProgress from 'nprogress' // progress bar
 
import compsCard from './CompsCard'
import compsSet from './CompsSet'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
  components: {compsSet, compsCard},
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
      compsSetVisible: false
    }
  },

  methods: {

    gotolink(context,path) { 
      if(context==process.env.CONTEXT){
        this.$router.push({path:path});
      }else{
        var prefixUrl=window.location.protocol+"//"+window.location.host+"/"+context+"/"+process.env.VERSION+"/#"; //   返回https://mp.csdn.net
        window.open(prefixUrl+path)
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
      }

    },
    onCompsSet(){
      this.$refs.compsCard.getFMenus();
    }

  },


  mounted() {

  }
}
</script>

<style lang="scss" scoped>
@import './common.scss';
@import './index.scss';
</style>
