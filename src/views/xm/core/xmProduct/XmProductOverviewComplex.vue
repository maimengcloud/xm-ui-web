<template>
  <section class="page-container  padding-left padding-right">
      <el-menu mode="horizontal" default-active="overview"  @select="onMenuToolBarSelect">
        <el-menu-item index="overview">
          <span slot="title">产品概览</span>
        </el-menu-item>
        <el-menu-item index="detail">
          <span slot="title">产品详情</span>
        </el-menu-item>  
        <el-menu-item index="iterationProductLink"> 
          <span slot="title">配置可见迭代</span>
        </el-menu-item>
        <el-menu-item index="productProjectLink"> 
          <span slot="title">配置可见项目</span>
        </el-menu-item> 
      </el-menu>
       <xm-product-overview  v-if="showPanelName=='overview'" :xm-product="xmProduct"></xm-product-overview>
        <xm-product-edit  v-if="showPanelName=='detail'" :xm-product="xmProduct"></xm-product-edit>
        <xm-iteration-link-for-product v-if="showPanelName=='iterationProductLink'" :xm-product="xmProduct"></xm-iteration-link-for-product>
        <xm-product-project-link-mng  v-if="showPanelName=='productProjectLink'" :xm-product="xmProduct"></xm-product-project-link-mng>
   </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex";
import XmProductOverview from './XmProductOverview.vue';
import XmProductEdit from './XmProductEdit.vue';
import XmIterationLinkForProduct from '../xmIterationLink/XmIterationLinkForProduct.vue';
import XmProductProjectLinkMng from '../xmProductProjectLink/XmProductProjectLinkMng.vue';


export default {
  components: { XmProductOverview, XmProductEdit, XmIterationLinkForProduct, XmProductProjectLinkMng },
  computed: {
    ...mapGetters(["userInfo"]),
  },

  props:['xmProduct'],
  watch:{
  },
  data() {
    return {
      showPanelName:'overview'
    };
  },

  methods:{

    onMenuToolBarSelect(menuIndex){
      this.showPanelName=menuIndex;
    }
  },

  mounted() {
    this.$nextTick(() => {
    });
  },

};
</script>

<style scoped lang="scss">

</style>
