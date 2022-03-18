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
        <el-menu-item index="productCalc"> 
          <span slot="title">执行数据汇总计划</span>
        </el-menu-item> 
      </el-menu>
       <xm-product-overview  v-if="showPanelName=='overview'" :xm-product="xmProduct"></xm-product-overview>
        <xm-product-edit  v-if="showPanelName=='detail'" :xm-product="xmProduct"></xm-product-edit>
        <xm-iteration-link-for-product v-if="showPanelName=='iterationProductLink'" :xm-product="xmProduct"></xm-iteration-link-for-product>
        <xm-product-project-link-mng  v-if="showPanelName=='productProjectLink'" :xm-product="xmProduct"></xm-product-project-link-mng>
        <div v-if="showPanelName=='productCalc'" class="padding">
          <el-row>
            <el-button type="primary" @click="loadTasksToXmProductState" v-loading="load.calcProduct">计算产品汇总数据</el-button>
            <br>
              <font color="red" style="font-size:10px;">将从项目任务及产品任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到产品统计表</font>
          </el-row>
          <el-row>
            <el-button  type="primary" @click="loadTasksToXmMenuState"  v-loading="load.calcMenu">计算所有需求数据</el-button>
            <br>
              <font color="red"  style="font-size:10px;">将从项目任务汇总进度、预算工作量、实际工作量、预算金额、实际金额等数据到需求统计表</font>
          </el-row>
        </div>
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
	import { loadTasksToXmProductState } from '@/api/xm/core/xmProductState';
	import { loadTasksToXmMenuState} from '@/api/xm/core/xmMenuState';

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
      showPanelName:'overview',
      load:{calcProduct:false,calcMenu:false}
    };
  },

  methods:{ 
			loadTasksToXmProductState: function () {
				this.load.calcProduct=true;

				let params = { productId: this.xmProduct.id };
				loadTasksToXmProductState(params).then((res) => {
					this.load.calcProduct=false;
					var tips=res.data.tips; 
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err  => this.load.calcProduct=false );
			},
      
			 
			loadTasksToXmMenuState: function () {  
				this.load.calcMenu=true; 
				let params = { productId: this.xmProduct.id };
				loadTasksToXmMenuState(params).then((res) => {
					this.load.calcMenu=false;
					var tips=res.data.tips; 
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch( err  => this.load.calcMenu=false ); 
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
