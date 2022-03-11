<template>
  <section class="page-container  padding-left padding-right">
      <el-menu mode="horizontal" default-active="overview"  @select="onMenuToolBarSelect">
        <el-menu-item index="overview">
          <span slot="title">项目概览</span>
        </el-menu-item>
        <el-menu-item index="detail">
          <span slot="title">项目详情</span>
        </el-menu-item> 
        <el-menu-item index="productProjectLink"> 
          <span slot="title">关联产品</span>
        </el-menu-item>    
        <el-menu-item index="iterationProjectLink"> 
          <span slot="title">关联迭代</span>
        </el-menu-item>   
      </el-menu>
       <xm-project-overview  v-if="showPanelName=='overview'" :sel-project="selProject"></xm-project-overview>
        <xm-project-detail  v-if="showPanelName=='detail'" :sel-project="selProject" @submit="afterEditSubmit"></xm-project-detail> 
        <xm-product-project-link-mng v-if="showPanelName=='productProjectLink'" :sel-project="selProject"></xm-product-project-link-mng>
        <xm-iteration-link-for-project v-if="showPanelName=='iterationProjectLink'" :sel-project="selProject"></xm-iteration-link-for-project>
  </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex";
import { listXmProjectState } from '@/api/xm/core/xmProjectState';
import XmProjectOverview from './XmProjectOverview.vue';
import XmProjectDetail from './XmProjectDetail.vue';
import XmProductProjectLinkMng from '../xmProductProjectLink/XmProductProjectLinkMng.vue';
import XmIterationLinkForProject from '../xmIterationLink/XmIterationLinkForProject.vue';


export default {
  components: { XmProjectOverview, XmProjectDetail, XmProductProjectLinkMng ,XmIterationLinkForProject},
  computed: {
    ...mapGetters(["userInfo"]),
  },

  props:['selProject'],
  watch:{
  },
  data() {
    return {
      showPanelName:'overview'
    };
  },

  methods:{
    afterEditSubmit(project){
      this.$emit('submit',project)
    },
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
