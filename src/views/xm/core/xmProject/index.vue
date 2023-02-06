<template>
  <section>
    <top-nav v-if="projectInfo && projectInfo.id"/> 
    <keep-alive><router-view v-if="projectInfo && projectInfo.id"></router-view></keep-alive> 
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
import { mapGetters } from "vuex"; 
import topNav from './top-nav.vue' 
import store from '@/store' 
import { listXmProject } from '@/api/xm/core/xmProject'; 

export default { 
  computed: {
    ...mapGetters(["userInfo", "roles","projectInfo"]), 
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
    if(!this.$route.query.projectId){
      this.$message.error("地址不合规")
      this.$route.back(-1)
    }
    if(!this.projectInfo||this.projectInfo.id!=this.$route.query.projectId){  
      listXmProject({id:this.$route.query.projectId}).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk ){
          if( res.data.data.length==1){
            store.dispatch('setProjectInfo',res.data.data[0])
          }else{
            this.$message.error("项目不存在，请确保项目编号正确")
            this.$router.push({
              path:'/xm/core/project/mng/me'
            })
          }
          
        }else{
          this.$message.error(tips.msg)
          this.$router.push({
            path:'/xm/core/project/mng/me'
          })
        }
      })
    }
  },
  beforeDestroy(){ 
    store.dispatch('setProjectInfo',null)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
