<template>
  <section>
    <top-nav v-if="xmIteration&&xmIteration.id"/> 
    <keep-alive><router-view v-if="xmIteration && xmIteration.id"></router-view></keep-alive> 
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
import { mapGetters } from "vuex"; 
import topNav from './top-nav.vue' 
import store from '@/store' 
import { listXmIterationWithState } from '@/api/xm/core/xmIteration';  

export default { 
  computed: {
    ...mapGetters(["userInfo", "roles","xmIteration"]), 
  },
  watch: {},
  data() {
    return { 
    };
  }, //end data
  methods: {
     
  }, //end methods
  components: {
    topNav
    //在下面添加其它组件
  }, 
  mounted() {   
    
    if(!this.$route.query.iterationId){
      this.$message.error("地址不合规")
      this.$router.back(-1)
    }
    if(!this.xmIteration||this.xmIteration.id!=this.$route.query.iterationId){  
      listXmIterationWithState({id:this.$route.query.iterationId}).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk ){
          if( res.data.data.length==1){
            store.dispatch('setXmIteration',res.data.data[0])
          }else{
            this.$message.error("迭代编号不存在，请确保迭代编号正确")
            this.$router.push({
              path:'/xm/core/iteration/mng'
            })
          }
          
        }else{
          this.$message.error(tips.msg)
          this.$router.push({
            path:'/xm/core/iteration/mng'
          })
        }
      })
    }
  },
  beforeDestroy(){  
    store.dispatch('setXmIteration',null)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
