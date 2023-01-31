<template>
  <section class="padding-left padding-right">
    <el-row ref="pageMainRef">
      <el-col
        :span="4"
        class="padding border"
        :style="{  overflowY: 'auto' }"
      >
        <h4 class="padding-bottom">常用功能导航</h4>
        <el-steps
          :active="calcIterationStatusStep"
          finish-status="success"
          direction="vertical"
        >
          <el-step
            v-for="(i, index) in dicts['iterationStatus']"
            :title="i.name"
            :key="index"
          >
            <el-row slot="description">
              <el-row v-if="i.id == '0'"
                ><!--打开-->
                <span v-if="xmIteration.istatus == i.id">
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationMenu')"
                    >需求管理</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="showPanelName='iterationMenuMng'"
                    >配置需求范围</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="danger"
                    
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '1')"
                    >开启需求评审</el-button
                  > 
                </span>
                <span v-if="xmIteration.istatus != i.id">
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationMenu')"
                    >需求管理</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="showPanelName='iterationMenuMng'"
                    >需求范围</el-button
                  > 
                </span>
              </el-row>
              <el-row v-else-if="i.id == '1'"
                ><!--需求评审-->
                <span v-if="xmIteration.istatus == i.id"> 
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="showPanelName='iterationMenuMng'"
                    >确认需求范围</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationQuestion')"
                    >缺陷登记</el-button
                  >
                  <el-button
                    class="step-btn"
                    type="danger"
                    
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '2')"
                    >进入计划会</el-button
                  >
                </span>
                <span v-if="xmIteration.istatus != i.id">
                   
                </span>
              </el-row>
              <el-row v-else-if="i.id == '2'"
                ><!--计划会-->
                <span v-if="xmIteration.istatus == i.id">
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="showPanelName='detail'"
                    >迭代计划</el-button
                  >
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationTask')"
                    >任务管理</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="danger"
                    
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '3')"
                    >设为研发中</el-button
                  >
                </span>
                <span v-if="xmIteration.istatus != i.id">
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="showPanelName='detail'"
                    >迭代计划</el-button
                  >
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationTask')"
                    >任务管理</el-button
                  > 
                </span>
              </el-row>
              <el-row v-else-if="i.id == '3'"
                ><!--研发中-->
                <span v-if="xmIteration.istatus == i.id"> 
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationTask')"
                    >任务管理</el-button
                  >  
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationReport')"
                    >效能分析</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="danger"
                    
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '4')"
                    >设为测试中</el-button
                  >
                </span>
                <span v-if="xmIteration.istatus != i.id"> 
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationReport')"
                    >效能分析</el-button
                  > 
                </span>
              </el-row>
              <el-row v-else-if="i.id == '4'"
                ><!--测试中-->
                <span v-if="xmIteration.istatus == i.id"> 
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationQuestion')"
                    >缺陷管理</el-button
                  >  
                  <el-button
                    class="step-btn"
                    type="danger"
                    
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '5')"
                    >设为待上线</el-button
                  >
                </span>
              </el-row>
              <el-row v-else-if="i.id == '5'"
                ><!--上线中-->
                <span v-if="xmIteration.istatus == i.id">
                  
                  <el-button
                    class="step-btn"
                    type="danger"
                    
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '6')"
                    >设为已完成</el-button
                  >
                </span>
                <span v-if="xmIteration.istatus != i.id">
                  
                </span>
              </el-row>
              <el-row v-else-if="i.id == '6'"
                ><!--已完成-->
                <span v-if="xmIteration.istatus == i.id">
                  <el-button
                    class="step-btn"
                    type="danger"
                    
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '7')"
                    >设为已关闭</el-button
                  >
                </span>
                <span v-if="xmIteration.istatus != i.id"> 
				   
				</span>
              </el-row>
              <el-row v-else-if="i.id == '7'"
                ><!--已关闭-->
                <span v-if="xmIteration.istatus == i.id">
                  <el-button
                    class="step-btn"
                    type="danger"
                    
                    plain
										icon="el-icon-d-caret"
                    @click="editSomeFields(xmIteration, 'istatus', '0')"
                    >重新打开</el-button
                  >
                </span> 
              </el-row> 
            </el-row>
          </el-step>
        </el-steps>
      </el-col>
      <el-col :span="20">
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
    </el-col>
    </el-row>
   </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex";
 import XmIterationOverview from './XmIterationOverview.vue';
import XmIterationEdit from './XmIterationEdit.vue'; 
import XmIterationMenuMng from '../xmIterationMenu/XmIterationMenuMng.vue';  
	import {  loadTasksToXmIterationState } from '@/api/xm/core/xmIterationState';
import {  listXmIterationWithState } from "@/api/xm/core/xmIteration";
import {initDicts,editSomeFieldsXmIteration } from '@/api/xm/core/xmIteration'; 
import store from '@/store'

export default {
  components: {XmIterationOverview,XmIterationEdit, XmIterationMenuMng },
  computed: {
    ...mapGetters(["userInfo","xmIteration"]), 
    calcIterationStatusStep() {
      if (this.dicts["iterationStatus"] && this.xmIteration) {
        var index = this.dicts["iterationStatus"].findIndex((i) => {
          if (i.id == this.xmIteration.istatus) {
            return true;
          } else {
            return false;
          }
        });
        return index + 1;
      } else {
        return 0;
      }
    },
  },

  watch:{
  },
  data() {
    return {
      dicts:{iterationStatus:[]},
      load:{calcIteration:false,},
      showPanelName:'overview'
    };
  },

  methods:{
      jumpTo(name){
        this.$router.push({
          name:name,
          query:{
            iterationId:this.xmIteration.id
          }
        })
      },
			loadTasksToXmIterationState(){ 
				this.load.edit=true;
				loadTasksToXmIterationState({id:this.xmIteration.id}).then(res=>{
					this.load.edit=false;
					var tips =res.data.tips; 
          if(tips.isOk){
            listXmIterationWithState({id:this.xmIteration.id}).then(res2=>{
              var tips2=res2.data.tips;
              if(tips2.isOk && res2.data.data.length>0){
                var data=res2.data.data[0]
                Object.assign(this.xmIteration,data);
                 this.$emit('edit-fields',data)
              }
            })
          }
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
				});
			},
    onMenuToolBarSelect(menuIndex){
      this.showPanelName=menuIndex;
    },
    onEditFields(row){
      Object.assign(this.xmIteration,row)
      this.$emit('edit-fields',row)
    }, 
    editSomeFields(row,fieldName,$event){ 
      let params={};
      params['ids']=[row].map(i=>i.id)
      params[fieldName]=$event
      var func = editSomeFieldsXmIteration
      func(params).then(res=>{
        let tips = res.data.tips;
        if(tips.isOk){
          Object.assign(row,params)
          store.dispatch("setXmIteration",row)
          this.$emit('edit-fields',params)
        }else{ 
          this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
        }
      }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
    },
  },

  mounted() {
    initDicts(this)
    this.$nextTick(() => {
    });
  },

};
</script>

<style scoped lang="scss">
.menus {
  .el-menu-item {
    padding-left: 0px !important;
  }
}
/* 超过宽度则用...代替 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.step-btn{
	margin-left:0px;margin-bottom: 5px;
}

</style>
