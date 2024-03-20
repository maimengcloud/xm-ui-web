<template>
  <section>
    <top-nav v-if="xmProduct&&xmProduct.id"/>
    <keep-alive><router-view v-if="xmProduct && xmProduct.id"></router-view></keep-alive>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件

import { mapGetters } from "vuex";
import topNav from './top-nav.vue'
import store from '@/store'
import { listXmProductWithState } from '@/api/xm/core/xmProduct';

export default {
  computed: {
    ...mapGetters(["userInfo", "roles","xmProduct"]),
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

    if(!this.$route.query.productId){
      this.$message.error("地址不合规")
      this.$router.back(-1)
    }
    if(!this.xmProduct||this.xmProduct.id!=this.$route.query.productId){
      listXmProductWithState({id:this.$route.query.productId,isTpl:this.$route.query.isTpl}).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk ){
          if( res.data.data.length==1){
            store.dispatch('setXmProduct',res.data.data[0])
          }else{
            this.$message.error("产品不存在，请确保产品编号正确")
            this.$router.push({
              path:'/xm/core/product/mng'
            })
          }

        }else{
          this.$message.error(tips.msg)
          this.$router.push({
            path:'/xm/core/product/mng'
          })
        }
      })
    }
  },
  beforeDestroy(){
    store.dispatch('setXmProduct',null)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
