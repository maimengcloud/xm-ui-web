<template>
  <section class="page-container page-height-90 padding-left padding-right">
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
        <el-submenu index="menu-change">
          <template slot="title">
            <span slot="title">需求变更</span>
          </template>
            <el-menu-item index="menu-change-review">
              <span slot="title">需求评审</span>
            </el-menu-item>
            <el-menu-item index="menu-change-border-review">
              <span slot="title">需求边界异动</span>
            </el-menu-item>
        </el-submenu>

        <el-submenu index="iteration-change">
          <template slot="title">
            <span slot="title">迭代变更</span>
          </template>
            <el-menu-item index="iteration-change-review">
              <span slot="title">迭代计划评审</span>
            </el-menu-item>
            <el-menu-item index="iteration-change-border-review">
              <span slot="title">迭代上线申请</span>
            </el-menu-item>
        </el-submenu>

        <el-submenu index="phase-change">
          <template slot="title">
            <span slot="title">计划变更</span>
          </template>
            <el-menu-item index="phase-change-review">
              <span slot="title">计划评审</span>
            </el-menu-item>
            <el-menu-item index="phase-change-border-review">
              <span slot="title">预算变更</span>
            </el-menu-item>
        </el-submenu>
      </el-menu>
       <xm-product-overview  v-if="showPanelName=='overview'" :xm-product="xmProduct"></xm-product-overview>
        <xm-product-edit  v-if="showPanelName=='detail'" :xm-product="xmProduct"></xm-product-edit>
        <xm-iteration-product-link-mng v-if="showPanelName=='iterationProductLink'" :xm-product="xmProduct"></xm-iteration-product-link-mng>
        <xm-product-project-link-mng  v-if="showPanelName=='productProjectLink'" :xm-product="xmProduct"></xm-product-project-link-mng>
   </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex";
import XmProductOverview from './XmProductOverview.vue';
import XmProductEdit from './XmProductEdit.vue';
import XmIterationProductLinkMng from '../xmIterationProductLink/XmIterationProductLinkMng.vue';
import XmProductProjectLinkMng from '../xmProductProjectLink/XmProductProjectLinkMng.vue';


export default {
  components: { XmProductOverview, XmProductEdit, XmIterationProductLinkMng, XmProductProjectLinkMng },
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
