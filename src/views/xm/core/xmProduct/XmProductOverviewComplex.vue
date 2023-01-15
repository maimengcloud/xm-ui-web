<template>
  <section class="page-container padding-left padding-right">
    <el-row ref="pageBody">
        <el-col
          :span="4"
          class="padding border" :style="{ maxHeight: maxTableHeight + 'px', overflowY: 'auto' }"
        >
          <h4 class="padding-bottom">常用功能导航</h4>
          <el-steps
            :active="calcProductPstatusStep"
            finish-status="success"
            direction="vertical"
          >
            <el-step
              v-for="(i, index) in dicts['xmProductPstatus']"
              :title="i.name"
              :key="index"
            >
              <el-row slot="description">
                <el-row v-if="i.id == '0'"
                  ><!--打开-->
                  <span v-if="xmProduct.pstatus == i.id">
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="jumpTo('productMenu')"
                      >需求管理</el-button
                    >
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="linkProject()"
                      >关联项目</el-button
                    >
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="
                        editXmProductSomeFields(xmProduct, 'pstatus', '1')
                      "
                      >设为研发中</el-button
                    >
                  </span>
                  <span v-if="xmProduct.pstatus != i.id">
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="jumpTo('productMenu')"
                      >需求管理</el-button
                    >
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="linkProject()"
                      >关联项目</el-button
                    > 
                  </span>
                </el-row>
                <el-row v-else-if="i.id == '1'"
                  ><!--研发中-->
                  <span v-if="xmProduct.pstatus == i.id">
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="jumpTo('productIteration')"
                      >迭代管理</el-button
                    >
					<el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="jumpTo('productQuestion')"
                      >缺陷管理</el-button
                    >
					<el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="jumpTo('productProjectLink')"
                      >项目管理</el-button
                    >
					<el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="jumpTo('productReport')"
                      >效能分析</el-button
                    >
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="
                        editXmProductSomeFields(xmProduct, 'pstatus', '2')
                      "
                      >设为已完成</el-button
                    >
                  </span>
                  <span v-if="xmProduct.pstatus != i.id"> 
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="jumpTo('productIteration')"
                      >迭代管理</el-button
                    >
					<el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="jumpTo('productQuestion')"
                      >缺陷管理</el-button
                    >
					<el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="jumpTo('productProjectLink')"
                      >项目管理</el-button
                    >
					<el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="jumpTo('productReport')"
                      >效能分析</el-button
                    >
                  </span>
                </el-row>
                <el-row v-else-if="i.id == '2'"
                  ><!--已完成-->
                  <span v-if="xmProduct.pstatus == i.id"> 
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="
                        editXmProductSomeFields(xmProduct, 'pstatus', '3')
                      "
                      >设为已关闭</el-button
                    >
                  </span>
                  <span v-if="xmProduct.pstatus != i.id">
                     
                  </span>
                </el-row>
                <el-row v-else-if="i.id == '3'"
                  ><!--已关闭-->
                  <span v-if="xmProduct.pstatus == i.id"> 
                    <el-button
                      class="step-btn"
                      type="warning"
                      size="mini"
                      plain
                      @click="
                        editXmProductSomeFields(xmProduct, 'pstatus', '0')
                      "
                      >重新打开</el-button
                    >
                  </span>
                  <span v-if="xmProduct.pstatus != i.id">
                     
                  </span>
                </el-row> 
              </el-row>
            </el-step>
          </el-steps>
        </el-col>
        <el-col :span="20">
         <el-menu mode="horizontal" :default-active="showPanelName"  @select="onMenuToolBarSelect">
        <el-menu-item index="overview">
          <span slot="title">产品概览</span>
        </el-menu-item>
        <el-menu-item index="detail">
          <span slot="title">产品详情</span>
        </el-menu-item>  
        <!--
        <el-menu-item index="iterationProductLink"> 
          <span slot="title">配置关联迭代</span>
        </el-menu-item>
        -->
        <el-menu-item index="productProjectLink"> 
          <span slot="title">配置关联项目</span>
        </el-menu-item> 
        <el-menu-item index="productCalc"> 
          <span slot="title">执行数据汇总计划</span>
        </el-menu-item> 

        <el-menu-item index="currFlow"> 
          <span slot="title">当前审批流</span>
        </el-menu-item> 

        <el-menu-item index="hisFlow"> 
          <span slot="title">历史审批流</span>
        </el-menu-item> 

        </el-menu>

        <xm-product-overview  v-if="showPanelName=='overview' && xmProduct && xmProduct.id" :xm-product="xmProduct"></xm-product-overview>
        <xm-product-edit  v-if="showPanelName=='detail'" :xm-product="xmProduct"></xm-product-edit>
        <xm-iteration-link-for-product v-if="showPanelName=='iterationProductLink'" :xm-product="xmProduct"></xm-iteration-link-for-product>
        <xm-product-project-link-mng  v-if="showPanelName=='productProjectLink'" :xm-product="xmProduct"></xm-product-project-link-mng>
        <div v-if="showPanelName=='productCalc'" class="padding">
          <el-row>
            <el-button type="primary" @click="loadTasksToXmProductState" v-loading="load.calcProduct">计算产品汇总数据</el-button>
            <br>
              <font color="blue" style="font-size:10px;">将从项目任务及产品任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到产品统计表</font>
          </el-row>
          <el-row>
            <el-button  type="primary" @click="loadTasksToXmMenuState"  v-loading="load.calcMenu">计算所有需求数据</el-button>
            <br>
              <font color="blue"  style="font-size:10px;">将从项目任务汇总进度、预算工作量、实际工作量、预算金额、实际金额等数据到需求统计表</font>
          </el-row>
        </div> 
        <task-mng v-if="showPanelName === 'currFlow' " ref="currFlow" :biz-parent-pkid="xmProduct.id" > </task-mng>  
        <procinst-mng v-if="showPanelName === 'hisFlow' " ref="hisFlow" isAll="true" :biz-parent-pkid="xmProduct.id"></procinst-mng>   
        </el-col>
      </el-row>
   </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex";
import XmProductOverview from './XmProductOverview.vue';
import XmProductEdit from './XmProductEdit.vue'; 
import XmProductProjectLinkMng from '../xmProductProjectLink/XmProductProjectLinkMng.vue'; 
import { loadTasksToXmProductState } from '@/api/xm/core/xmProductState';
import { listXmProductWithState } from '@/api/xm/core/xmProduct';
import { loadTasksToXmMenuState} from '@/api/xm/core/xmMenuState'; 
import TaskMng from '@/views/mdp/workflow/ru/task/TaskMng'; 
import ProcinstMng from '@/views//mdp/workflow/hi/procinst/ProcinstMng';

import { initDicts,editXmProductSomeFields } from "@/api/xm/core/xmProduct";

export default {
  components: { XmProductOverview, XmProductEdit, XmProductProjectLinkMng,TaskMng,ProcinstMng,},
  computed: {
    ...mapGetters(["userInfo","xmProduct"]),
    calcProductPstatusStep() {
      if (this.dicts["xmProductPstatus"] && this.xmProduct) {
        var index = this.dicts["xmProductPstatus"].findIndex((i) => {
          if (i.id == this.xmProduct.pstatus) {
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
      
	    dicts:{xmProductPstatus:[]},
      maxTableHeight:500,
      showPanelName:'overview',
      load:{calcProduct:false,calcMenu:false}
    };
  },

  methods:{ 
    
    jumpTo(name){
      this.$router.push({
        name:name,
        query:{
          productId:this.xmProduct.id
        }
      })
    },
			loadTasksToXmProductState: function () {
				this.load.calcProduct=true;

				let params = { productId: this.xmProduct.id };
				loadTasksToXmProductState(params).then((res) => {
					this.load.calcProduct=false;
					var tips=res.data.tips; 
          if(tips.isOk){
            this.getProduct(this.xmProduct.id)
          }
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err  => this.load.calcProduct=false );
			},
      
			 getProduct(id){
				 listXmProductWithState({id:id}).then(res=>{
					 var tips = res.data.tips;
					 if(tips.isOk){ 
             Object.assign(this.xmProduct,res.data.data[0])
						 localStorage.setItem("xm-product-info-route",JSON.stringify(this.xmProduct)) 
             this.$emit('edit-fields',this.xmProduct)
						this.showInfo=true;
					 }else{

					 }
				 })
			 },
			 
			loadTasksToXmMenuState: function () {  
				this.load.calcMenu=true; 
				let params = { productId: this.xmProduct.id };
				loadTasksToXmMenuState(params).then((res) => {
					this.load.calcMenu=false;
					var tips=res.data.tips; 
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch( err  => this.load.calcMenu=false ); 
			},
    onMenuToolBarSelect(menuIndex){
      this.showPanelName=menuIndex;
    },
    showCurrFlow() {
      this.showPanelName = "currFlow";
    },
    showHisFlow() {
      this.showPanelName = "hisFlow";
    },
    showDetail() {
      this.showPanelName = "detail";
    },
    showProjectGaiSuan() {
      this.showPanelName = "detail";
      this.$nextTick(() => {
        this.$refs[
          "projectEdit"
        ].currTabPane = "4";
      });
    },
    showProjectShouYi() {
      this.showPanelName = "detail";
      this.$nextTick(() => {
        this.$refs[
          "projectEdit"
        ].currTabPane = "5";
      });
    }, 
    linkProject() {
      this.showPanelName = "productProjectLink";
    },
    createProduct() {
      this.infotype = "产品";
      this.$nextTick(() => {
        this.addProductVisible = true;
      });
    },
    

    editXmProductSomeFields(row,fieldName,$event){ 
      var that=this;
      var func=(params)=>{
        editXmProductSomeFields(params).then(res=>{
          var tips = res.data.tips;
          if(tips.isOk){
            this.$emit('edit-fields',params)
            Object.assign(row,params) 
            this.xmProductBak=Object.assign({},row)
          }else{   
            Object.assign(this.xmProduct,this.xmProductBak)
            this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
          }
        })
      }
      var params={ids:[row.id]}; 
        
      params[fieldName]=$event 
      
      
      if(fieldName=='description'){
        this.$refs.xmProduct.validateField('description',err=>{
          if(err){ 
            this.$notify({position:'bottom-left',showClose:true,message: err,type: 'error'})
            return;
          }else{
            func(params)
          }
        })
      }else if(fieldName=='name'){  
        this.$refs.xmProduct.validateField('name',err=>{
          if(err){
            this.$notify({position:'bottom-left',showClose:true,message: err,type: 'error'})
            return;
          }else{
            func(params)
          }
        })
      }else{
        func(params)
      }
    }, 
  },

  mounted() {
    
    this.$nextTick(() => { 
      this.maxTableHeight  = util.calcTableMaxHeight(this.$refs.pageBody.$el);
    });
    initDicts(this)
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

.step-btn {
  margin-left: 0px;
  margin-bottom: 5px;
}
</style>
