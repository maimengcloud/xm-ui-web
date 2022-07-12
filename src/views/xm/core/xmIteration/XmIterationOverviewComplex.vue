<template>
  <section class="padding-left padding-right">
      <el-menu mode="horizontal" :default-active="showPanelName"  @select="onMenuToolBarSelect">
        <el-menu-item index="overview">
          <span slot="title">迭代概览</span>
        </el-menu-item>
        <el-menu-item index="iterationCalc">
          <span slot="title">执行统计</span>
        </el-menu-item>
        <el-menu-item index="detail">
          <span slot="title">迭代详情</span>
        </el-menu-item>
        <!--
        <el-menu-item index="iterationProductLink">
          <span slot="title">配置可见产品</span>
        </el-menu-item> 
        -->
        <el-menu-item index="iterationMenuMng">
          <span slot="title">配置需求范围</span>
        </el-menu-item> 
        <!--
        <el-menu-item index="iterationProjectLink">
          <span slot="title">配置可见项目</span>
        </el-menu-item> 
        -->
      </el-menu> 
       <xm-iteration-overview class="padding-top" v-if="showPanelName=='overview'" :xm-iteration="xmIteration"></xm-iteration-overview>
        <xm-iteration-edit v-if="showPanelName=='detail'" :xm-iteration="xmIteration" @edit-fields="onEditFields"></xm-iteration-edit>
      <xm-iteration-link-for-product  v-if="showPanelName=='iterationProductLink'" :xm-iteration="xmIteration"></xm-iteration-link-for-product>
      <xm-iteration-link-for-project  v-if="showPanelName=='iterationProjectLink'" :xm-iteration="xmIteration"></xm-iteration-link-for-project>
      <xm-iteration-menu-mng v-if="showPanelName=='iterationMenuMng'" :xm-iteration="xmIteration"  ref="iterationMenuMng"  class="padding-top"></xm-iteration-menu-mng>
      <div v-if="showPanelName=='iterationCalc'" class="padding">
        <el-row>
          <el-button type="primary" @click="loadTasksToXmIterationState" v-loading="load.calcIteration">计算迭代统计数据</el-button>
          <br>
            <font color="blue" style="font-size:10px;">将从项目任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到迭代统计表;
            <br/>
            <strong>注意：</strong>该统计实时统计迭代涉及到的各方面数据，执行量较大，一般更改了任务进度数据、重新调整了需求范围，需要迭代的实时数据的情况下，再手动执行。
            
            </font>
        </el-row> 
      </div>
   </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex";
 import XmIterationOverview from './XmIterationOverview.vue';
import XmIterationEdit from './XmIterationEdit.vue'; 
import XmIterationMenuMng from '../xmIterationMenu/XmIterationMenuMng.vue';
	import { loadTasksToXmIterationState } from '@/api/xm/core/xmIteration';


export default {
  components: {XmIterationOverview,XmIterationEdit, XmIterationMenuMng },
  computed: {
    ...mapGetters(["userInfo"]),
  },

  props:['xmIteration'],
  watch:{
  },
  data() {
    return {
      load:{calcIteration:false,},
      showPanelName:'overview'
    };
  },

  methods:{
			loadTasksToXmIterationState(){ 
				this.load.edit=true;
				loadTasksToXmIterationState({id:this.xmIteration.id}).then(res=>{
					this.load.edit=false;
					var tips =res.data.tips; 
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
				});
			},
    onMenuToolBarSelect(menuIndex){
      this.showPanelName=menuIndex;
    },
    onEditFields(row){
      Object.assign(this.xmIteration,row)
      this.$emit('edit-fields',row)
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
