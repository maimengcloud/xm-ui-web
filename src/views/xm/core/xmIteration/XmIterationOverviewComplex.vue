<template>
  <section class="page-container  padding-left padding-right">
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
        <el-menu-item index="iterationProjectLink">
          <span slot="title">配置可见项目</span>
        </el-menu-item> 
      </el-menu>
       <xm-iteration-overview  v-if="showPanelName=='overview'" :xm-iteration="xmIteration"></xm-iteration-overview>
        <xm-iteration-edit v-if="showPanelName=='detail'" :xm-iteration="xmIteration"></xm-iteration-edit>
      <xm-iteration-link-mng  v-if="showPanelName=='iterationProductLink'" :xm-iteration="xmIteration"></xm-iteration-link-mng>
      <xm-iteration-menu-mng v-if="showPanelName=='iterationMenuMng'" :xm-iteration="xmIteration"></xm-iteration-menu-mng>
   </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex";
 import XmIterationOverview from './XmIterationOverview.vue';
import XmIterationEdit from './XmIterationEdit.vue';
 import XmIterationLinkMng from '../xmIterationLink/XmIterationLinkMng.vue';
import XmIterationMenuMng from '../xmIterationMenu/XmIterationMenuMng.vue';


export default {
  components: {XmIterationOverview,XmIterationEdit, XmIterationLinkMng, XmIterationMenuMng },
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
