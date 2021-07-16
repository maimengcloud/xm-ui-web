<template>
  <section class="page-container page-height-90 padding-left padding-right">  
      <el-menu mode="horizontal" default-active="overiew"  @select="onMenuToolBarSelect"> 
        <el-menu-item index="overiew"> 
          <span slot="title">项目概览</span>
        </el-menu-item>
        <el-menu-item index="detail"> 
          <span slot="title">项目详情</span>
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
       <xm-project-overview  v-if="showPanelName=='overiew'" :sel-project="selProject"></xm-project-overview>
        <xm-project-detail  v-if="showPanelName=='detail'" :sel-project="selProject"></xm-project-detail>
  </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex";
import { listXmProjectState } from '@/api/xm/core/xmProjectState';
import XmProjectOverview from './XmProjectOverview.vue';
import XmProjectDetail from './XmProjectDetail.vue';


export default {
  components: { XmProjectOverview, XmProjectDetail },
  computed: {
    ...mapGetters(["userInfo"]), 
  },

  props:['selProject'],
  watch:{ 
  },
  data() {
    return { 
      showPanelName:'overiew'
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
