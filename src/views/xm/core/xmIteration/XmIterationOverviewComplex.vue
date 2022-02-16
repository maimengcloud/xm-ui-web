<template>
  <section class="page-container page-height-90 padding-left padding-right">
      <el-menu mode="horizontal" default-active="overview"  @select="onMenuToolBarSelect">
        <el-menu-item index="overview">
          <span slot="title">迭代概览</span>
        </el-menu-item>
        <el-menu-item index="detail">
          <span slot="title">迭代详情</span>
        </el-menu-item>
        <el-menu-item index="iterationProductLink">
          <span slot="title">配置可见产品</span>
        </el-menu-item> 
        <el-menu-item index="iterationMenuMng">
          <span slot="title">配置可见需求</span>
        </el-menu-item>
        <el-submenu index="project-change">
          <template slot="title">
            <span slot="title">项目变更</span>
          </template>
            <el-menu-item index="project-change-base-info">
              <span slot="title">基础信息修改</span>
            </el-menu-item>
            <el-menu-item index="project-change-start">
              <span slot="title">立项申请</span>
            </el-menu-item>
            <el-menu-item index="project-change-budget">
              <span slot="title">预算+-</span>
            </el-menu-item>
            <el-menu-item index="project-change-cost">
              <span slot="title">成本+-</span>
            </el-menu-item>
            <el-menu-item index="project-change-collection">
              <span slot="title">收款</span>
            </el-menu-item>
            <el-menu-item index="project-change-conclusion">
              <span slot="title">结项申请</span>
            </el-menu-item>
            <el-menu-item index="project-change-suspend">
              <span slot="title">暂停申请</span>
            </el-menu-item>
            <el-menu-item index="project-change-activation">
              <span slot="title">激活申请</span>
            </el-menu-item>
            <el-menu-item index="project-change-to-after-sales">
              <span slot="title">转售后申请</span>
            </el-menu-item>
            <el-menu-item index="project-change-new-pm">
              <span slot="title">项目经理变更申请</span>
            </el-menu-item>
            <el-menu-item index="project-change-new-leader">
              <span slot="title">组长变更申请</span>
            </el-menu-item>
        </el-submenu>
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
            <span slot="title">阶段计划变更</span>
          </template>
            <el-menu-item index="phase-change-review">
              <span slot="title">计划评审</span>
            </el-menu-item>
            <el-menu-item index="phase-change-border-review">
              <span slot="title">预算变更</span>
            </el-menu-item>
        </el-submenu>
      </el-menu>
       <xm-iteration-overview  v-if="showPanelName=='overview'" :xm-iteration="xmIteration"></xm-iteration-overview>
        <xm-iteration-edit v-if="showPanelName=='detail'" :xm-iteration="xmIteration"></xm-iteration-edit>
      <xm-iteration-product-link-mng  v-if="showPanelName=='iterationProductLink'" :xm-iteration="xmIteration"></xm-iteration-product-link-mng>
      <xm-iteration-menu-mng v-if="showPanelName=='iterationMenuMng'" :xm-iteration="xmIteration"></xm-iteration-menu-mng>
   </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex";
 import XmIterationOverview from './XmIterationOverview.vue';
import XmIterationEdit from './XmIterationEdit.vue';
 import XmIterationProductLinkMng from '../xmIterationProductLink/XmIterationProductLinkMng.vue';
import XmIterationMenuMng from '../xmIterationMenu/XmIterationMenuMng.vue';


export default {
  components: {XmIterationOverview,XmIterationEdit, XmIterationProductLinkMng, XmIterationMenuMng },
  computed: {
    ...mapGetters(["userInfo"]),
  },

  props:['xmIteration'],
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
