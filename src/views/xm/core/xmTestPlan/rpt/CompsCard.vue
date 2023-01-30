<template>
<section>
    <el-row  class="page-center border" v-if="printVisible==false">
        <el-col :span="6" :style="{height:maxTableHeight+'px',overflow:'auto'}">
            <comps-set v-if="rptConfigVisible" :comp-ids="compIds" @row-click="onCompSelect"></comps-set>
        </el-col>
        <el-col :span="18" :style="{height:maxTableHeight+'px',overflow:'auto'}" ref="table" class="border">
            <div>
                <div class="empty" v-if="compCfgList.length == 0" >
                    <el-empty description="暂未选择模块"></el-empty>
                </div>
                <div v-else>
                    <grid-layout
                        :layout.sync="compCfgList"
                        :col-num="layoutColNum"
                        :row-height="120"
                        :is-draggable="true"
                        :is-resizable="true"
                        :is-mirrored="false"
                        :vertical-compact="true"
                        :margin="[10, 10]"
                        :use-css-transforms="true"
                    > 
                        <grid-item
                            v-for="(item,index) in compCfgList"
                            :x="item.x"
                            :y="item.y"
                            :w="item.w"
                            :h="item.h"
                            :i="item.i"
                            :key="index" @resize="sizeAutoChange(item)">
                            <component :is="item.compId" :xm-test-plan="xmTestPlan" :comp-cfg="item" :ref="item.id" @delete="doDelete"></component>
                        </grid-item>
                    </grid-layout>
                </div>
            </div>
        </el-col> 
    </el-row> 
    <el-row v-if="printVisible" class="page-center border" style="width:1000px;">
        <el-row>
           <span style="float:right;"><el-button @click="printVisible=false">取消打印</el-button> <el-button v-print="'#printBody'">打印</el-button></span> 
        </el-row>
        <el-row id="printBody">
            <el-row v-for="(item,index) in compCfgList" :key="index">
                <component  :is="item.compId" :xm-test-plan="xmTestPlan" :comp-cfg="item" :ref="item.id" @delete="doDelete"></component>
            </el-row> 
        </el-row>
    </el-row>
    </section>
</template>

<script>  
 
import util from '@/common/js/util';//全局公共库
import seq from '@/common/js/sequence';//全局公共库
import VueGridLayout from 'vue-grid-layout';
import { mapGetters } from 'vuex'
import XmTestPlanMng from '@/views/xm/core/xmTestPlan/XmTestPlanMng'
import CompsSet from '@/views/xm/core/xmTestPlan/rpt/CompsSet'
import XmQuestionAgeDist from '@/views/xm/core/xmTestPlan/rpt/biz/questionAgeDist' 
import xmQuestionAttDist from '@/views/xm/core/xmTestPlan/rpt/biz/questionAttDist' 
import xmQuestionRetestDist from '@/views/xm/core/xmTestPlan/rpt/biz/questionRetestDist' 
import xmQuestionHandlerUserSort from '@/views/xm/core/xmTestPlan/rpt/biz/questionHandlerUserSort'
import xmQuestionAskUserSort from '@/views/xm/core/xmTestPlan/rpt/biz/questionAskUserSort'
import xmQuestionMenuSort from '@/views/xm/core/xmTestPlan/rpt/biz/questionMenuSort'
import xmQuestionFuncSort from '@/views/xm/core/xmTestPlan/rpt/biz/questionFuncSort'
import xmTestPlanCaseExecStatusDist from '@/views/xm/core/xmTestPlan/rpt/biz/testPlanCaseExecStatusDist'
import xmTestPlanCaseUserDist from '@/views/xm/core/xmTestPlan/rpt/biz/testPlanCaseUserDist'
import xmTestCaseToPlanCalc from '@/views/xm/core/xmTestPlan/rpt/biz/testCaseToPlanCalc'
import xmTestDayTimesCalc from '@/views/xm/core/xmTestPlan/rpt/biz/testDayTimesCalc'

import xmTestRptOverview from '@/views/xm/core/xmTestPlan/xmTestRptOverview'

import { initDicts,listXmRptConfig, delXmRptConfig,editXmRptConfig,addXmRptConfig,batchDelXmRptConfig,editSomeFieldsXmRptConfig } from '@/api/xm/core/xmRptConfig';
 
export default {
    components: { 
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem,
        XmTestPlanMng,
        XmQuestionAgeDist, 
        xmQuestionAttDist,
        xmQuestionHandlerUserSort,xmQuestionAskUserSort,xmQuestionMenuSort,xmQuestionFuncSort,
        xmTestPlanCaseExecStatusDist,
        xmTestPlanCaseUserDist,
        CompsSet,
        xmTestRptOverview,
        xmQuestionRetestDist,
        xmTestCaseToPlanCalc,
        xmTestDayTimesCalc,
        
        "xmQuestionBugReasonDist":()=>import("./biz/questionBugReasonDist.vue"), 
        "xmQuestionBugStatusDist":()=>import("./biz/questionBugStatusDist.vue"), 
        "xmQuestionBugTypeDist":()=>import("./biz/questionBugTypeDist.vue"), 
        "xmQuestionRepRateDist":()=>import("./biz/questionRepRateDist.vue"), 
        "xmQuestionBugSeverityDist":()=>import("./biz/questionBugSeverityDist.vue"), 
        "xmQuestionPriorityDist":()=>import("./biz/questionPriorityDist.vue"), 

    },
    props:['xmTestPlan','rptConfigVisible'],
    computed: {
        ...mapGetters(['userInfo']), 
        compIds(){
           return this.compCfgList.map(k=>k.compId)
        },
        
    },

    watch: {
        xmRptConfig:{
            handler(){
                this.initCompCfgList();
            },
            deep:true,
        },
        rptConfigVisible(){
            if(this.rptConfigVisible==true){
                this.$nextTick(()=>{
                    this.compCfgList.forEach(k=>{
                        this.sizeAutoChange(k);
                    })
                })
                
            }
        }
    },

    data() {
        return {
            xmRptConfig:null,
            compCfgList:[],
            maxTableHeight:300,
            // 布局位置数据
            initCompCfg: [
                
                 { i:0, x: 0,  y: 12,  w: 12, h: 6,  id:'xmTestRptOverview',name:'测试计划总览',compId:'xmTestRptOverview', params:{} }, 
                 { i: 1, x: 0,  y: 12,  w: 12, h: 6,   id:'xmTestCaseToPlanCalc',name:'用例规划分析', compId:'xmTestCaseToPlanCalc',  }, 
                 { i: 2, x: 0,  y: 12,  w: 12, h: 6,   id:'xmTestDayTimesCalc',name:'用例每日执行统计', compId:'xmTestDayTimesCalc',  },  
                 { i: 3, x: 0,  y: 12,  w: 12, h: 6,   id:'xmTestPlanCaseExecStatusDist',name:'用例执行结果分布', compId:'xmTestPlanCaseExecStatusDist',  }, 
                 { i: 4, x: 0,  y: 12,  w: 12, h: 6,   id:'xmTestPlanCaseUserDist',name:'用例执行人情况分布', compId:'xmTestPlanCaseUserDist',  },  
                 { i:5, x: 0,  y: 12,  w: 12, h: 6,   id:'xmQuestionMenuSort',name:'缺陷需求分布', compId:'xmQuestionMenuSort',  }, 
                 { i: 6, x: 0,  y: 12,  w: 12, h: 6,   id:'xmQuestionFuncSort',name:'缺陷模块分布', compId:'xmQuestionFuncSort',  },  
                 { i: 7, x: 0,  y: 12,  w: 12, h: 6, id:'xmQuestionBugStatusDist',name:'缺陷状态分布',compId:'xmQuestionBugStatusDist',  },
                 { i:8, x: 0,  y: 12,  w: 12, h: 6,  id:'xmQuestionAgeDist',name:'缺陷年龄分布',compId:'xmQuestionAgeDist', params:{} },  
                 { i:9, x: 0,  y: 12,  w: 12, h: 6,  id:'xmQuestionBugReasonDist',name:'缺陷原因分布',compId:'xmQuestionBugReasonDist', params:{} },  
                 { i:10, x: 0,  y: 12,  w: 12, h: 6,  id:'xmQuestionPriorityDist',name:'缺陷紧急程度分布',compId:'xmQuestionPriorityDist', params:{} }, 
                 { i: 11, x: 0,  y: 12,  w: 12, h: 6,   id:'xmQuestionAskUserSort',name:'缺陷提出人排行榜', compId:'xmQuestionAskUserSort',  }, 
                 { i: 12, x: 0,  y: 12,  w: 12, h: 6,   id:'xmQuestionHandlerUserSort',name:'缺陷负责人排行榜',compId:'xmQuestionHandlerUserSort',  }, 
                 
                 
            ],
            // 布局列数
            layoutColNum: 12, 
            printVisible:false,
        }
    },

    methods: {  
        initData(){
           this.getXmRptConfig();
        },
        getXmRptConfig(){
            if(!this.xmTestPlan){
                return;
            }
            listXmRptConfig({bizId:this.xmTestPlan.id}).then(res=>{
                this.xmRptConfig=res.data.data[0] 
            })
        },
        initCompCfgList(){
            if(this.xmRptConfig && this.xmRptConfig.cfg){
                var cfgJson=JSON.parse(this.xmRptConfig.cfg) 
                this.compCfgList=cfgJson;
            }else{
                this.compCfgList=JSON.parse(JSON.stringify(this.initCompCfg))
            }
        },
        onCompSelect(comp){ 
            var compCfgListTemp=JSON.parse(JSON.stringify(this.compCfgList))
            compCfgListTemp.sort((i1,i2)=>{
                return i2.i-i1.i
            })
            var maxI=(compCfgListTemp.length>0?(compCfgListTemp[0].i+1):1);
            compCfgListTemp.sort((i1,i2)=>{
                return i2.y-i1.y
            })
            var maxY=(compCfgListTemp.length>0?(compCfgListTemp[0].y+6):0);
            var compCfg={i:maxI, x: 0,  y: maxY,  w: 12, h: 6, compId:comp.compId,name:comp.name,id:comp.compId+seq.sn(),params:{}} 
                this.compCfgList.push(compCfg) 
        },
        submitXmPrtConfig(callback){
            
            if(this.xmRptConfig==null){
                var xmRptConfig={name:this.xmTestPlan.name,bizId:this.xmTestPlan.id,cfg:[]}
                var compCfgList=JSON.parse(JSON.stringify(this.compCfgList))
                compCfgList.forEach(k=>{
                    if(this.$refs[k.id] && this.$refs[k.id][0].$refs && this.$refs[k.id][0].$refs[k.id]){ 
                         k.params=this.$refs[k.id][0].$refs[k.id].filters
                    }else{ 
                         k.params=this.$refs[k.id][0].filters
                    }
                   
                })
                xmRptConfig.cfg=JSON.stringify(compCfgList)
                addXmRptConfig(xmRptConfig).then(res=>{
                    this.xmRptConfig=xmRptConfig;
                    callback()
                })
            }else{
                var xmRptConfig={id:this.xmRptConfig.id,name:this.xmTestPlan.name,bizId:this.xmTestPlan.id,cfg:[]}
                var compCfgList=JSON.parse(JSON.stringify(this.compCfgList))
                compCfgList.forEach(k=>{
                    if(this.$refs[k.id] && this.$refs[k.id][0].$refs && this.$refs[k.id][0].$refs[k.id]){ 
                         k.params=this.$refs[k.id][0].$refs[k.id].filters
                    }else{ 
                         k.params=this.$refs[k.id][0].filters
                    }
                })
                xmRptConfig.cfg=JSON.stringify(compCfgList)
                editXmRptConfig(xmRptConfig).then(res=>{
                    this.xmRptConfig=xmRptConfig; 
                    callback()
                })
            }
        },
        doDelete(compCfg){
            if(this.rptConfigVisible==false){
                 this.$notify({ position:'bottom-left', showClose:true, message: "当前报告为预览模式，不能删除，请切换为配置报告模式", type:  'error' });
                 return;
            }
            var index=this.compCfgList.findIndex(k=>k.id==compCfg.id) 
            if(index>=0){ 
                this.compCfgList.splice(index,1)
            }
        },
        sizeAutoChange(k){ 
             if(this.$refs[k.id] && this.$refs[k.id][0].$refs && this.$refs[k.id][0].$refs[k.id]){ 
                   this.$refs[k.id][0].$refs[k.id].sizeAutoChange();
            }else{ 
                   this.$refs[k.id][0].sizeAutoChange();
            }
            
        }
         
    },

    mounted() {
        this.$nextTick(() => {
            this.initData();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
        })
    },

}
</script>

<style> 

</style>
