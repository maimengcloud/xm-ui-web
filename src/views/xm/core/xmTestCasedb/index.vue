<template>
  <section>
    <top-nav v-if="testCasedb&&testCasedb.id"/> 
    <keep-alive><router-view v-if="testCasedb && testCasedb.id"></router-view></keep-alive> 
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
import { mapGetters } from "vuex"; 
import topNav from './top-nav.vue' 
import store from '@/store'  
import { listXmTestCasedb } from '@/api/xm/core/xmTestCasedb';

export default { 
  computed: {
    ...mapGetters(["userInfo", "roles","testCasedb"]), 
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
    
    if(!this.$route.query.casedbId){
      this.$message.error("地址不合规")
      this.$router.back(-1)
    }
    if(!this.testCasedb||this.testCasedb.id!=this.$route.query.casedbId){  
      listXmTestCasedb({id:this.$route.query.casedbId}).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk ){
          if( res.data.data.length==1){
            store.dispatch('setTestCasedb',res.data.data[0])
          }else{
            this.$message.error("测试用例库不存在，请确保测试用例库编号正确")
            this.$router.back(-1)
          }
          
        }else{
          this.$message.error(tips.msg)
          this.$router.back(-1)
        }
      })
    }
  },
  beforeDestroy(){  
    store.dispatch('setTestCasedb',null)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
