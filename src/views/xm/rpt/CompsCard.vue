<template>
<section>
    <el-row  class="padding-left padding-right">
        <el-col :span="6" :style="{height:maxTableHeight+'px',overflow:'auto'}">
            <comps-set :comp-ids="compIds" :category="category" @row-click="onCompSelect"></comps-set>
        </el-col>
        <el-col :span="18" ref="table" class="border">
            <el-row  v-if="exportToolBarVisible">
                <span style="float:right;">
                    <el-button @click="exportToolBarVisible=false">取消</el-button> 
                    <el-button v-print="{id:'printBody',popTitle:rptConfigParamsCpd.name+'-报告'}">打印</el-button>
                    <el-button @click="exportToPdf">pdf</el-button> 
                </span> 
            </el-row>
            <div :style="{height:maxTableHeight+'px',overflow:'auto'}">
                <div class="empty" v-if="compCfgList.length == 0" >
                    <el-empty description="暂未选择模块"></el-empty>
                </div>
                <div v-else id="printBody" ref="rptBox"> 
                    <component v-for="(item,index) in compCfgList" :key="index" :is="item.compId" :xm-test-plan="xmTestPlan" :xm-product="xmProduct" :xm-project="xmProject" :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :category="category" :cfg="item.cfg" :ref="item.id" @delete="doDelete(item)" :init-group-by="item.initGroupBy" :id="item.id" :show-tool-bar="showToolBar" :show-params="paramsVisible"></component>
                         
                </div>
            </div>
        </el-col> 
    </el-row>  
    </section>
</template>

<script>  
 
import util from '@/common/js/util';//全局公共库
import seq from '@/common/js/sequence';//全局公共库
import VueGridLayout from 'vue-grid-layout';
import { mapGetters } from 'vuex' 
import CompsSet from '@/views/xm/rpt/CompsSet'  


import { initDicts,listXmRptConfig, delXmRptConfig,editXmRptConfig,addXmRptConfig,batchDelXmRptConfig,editSomeFieldsXmRptConfig } from '@/api/xm/core/xmRptConfig';
 
export default {
    components: { 
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem, 
        CompsSet,  
        xmTestRptOverview:()=>import("../core/xmTestPlan/xmTestRptOverview.vue"),   
        xmMenuDayTrend:()=>import("./product/menuDayTrend.vue"),   
        xmMenuDayAccumulate:()=>import("./product/menuDayTrend.vue"),  
        xmMenuAttDist:()=>import('./product/menuAttDist'),
        xmMenuAgeDist:()=>import('./product/menuAgeDist.vue'),
        xmMenuSort:()=>import('./product/menuSort.vue'), 
        xmMenuFuncSort:()=>import('./product/menuSort.vue'),
        xmMenuProductSort:()=>import('./product/menuSort.vue'),
        xmMenuIterationSort:()=>import('./product/menuSort.vue'), 
        xmProductWorkItemDayList:()=>import('./product/productWorkItemDayList.vue'),


        xmTaskDayTrend:()=>import('./project/taskDayTrend.vue'),
        xmTaskDayAccumulate:()=>import('./project/taskDayAccumulate.vue'),
        xmTaskAttDist:()=>import('./project/taskAttDist.vue'),
        xmTaskAgeDist:()=>import('./project/taskAgeDist.vue'),
        xmTaskSort:()=>import('./project/taskSort.vue'),
        xmProjectWorkItemDayList:()=>import('./project/projectWorkItemDayList.vue'),
        xmProjectWorkloadSetDayList:()=>import('./project/projectWorkloadSetDayList.vue'),
        xmProjectWorkloadSetMonthList:()=>import('./project/projectWorkloadSetMonthList.vue'),

        xmQuestionDayTrend:()=>import('./product/questionDayTrend.vue'),
        xmQuestionDayAccumulate:()=>import('./product/questionDayAccumulate.vue'),
        xmQuestionAttDist:()=>import('./product/questionAttDist.vue'),
        xmQuestionStateDist:()=>import('./product/questionAttDist.vue'),
        xmQuestionAgeDist:()=>import('./product/questionAgeDist.vue'),
        xmQuestionSort:()=>import('./product/questionSort.vue'),
        xmQuestionAskUserSort:()=>import('./product/questionSort.vue'),
        xmQuestionHandlerUserSort:()=>import('./product/questionSort.vue'),
        xmQuestionFuncSort:()=>import('./product/questionSort.vue'),
        xmQuestionMenuSort:()=>import('./product/questionSort.vue'),
        xmQuestionRetestDist:()=>import('./product/questionRetestDist.vue'),

        
        xmTestPlanCaseExecStatusDist:()=>import('./testPlan/testPlanCaseExecStatusDist.vue'),
        xmTestPlanCaseUserDist:()=>import('./testPlan/testPlanCaseUserDist.vue'),
        xmTestDayTimesCalc:()=>import('./testPlan/testDayTimesCalc.vue'),
        xmTestCaseToPlanCalc:()=>import('./testPlan/testCaseToPlanCalc.vue'),
        xmTestCaseSort:()=>import('./testCase/testCaseSort.vue'),
        xmTestCaseCuserSort:()=>import('./testCase/testCaseSort.vue'),
        xmTestCaseFuncSort:()=>import('./testCase/testCaseSort.vue'),
        xmTestCaseMenuSort:()=>import('./testCase/testCaseSort.vue'),

        
        xmIterationMenuDayTrend:()=>import('./iteration/menuDayTrend.vue'),
        xmIterationMenuDayAccumulate:()=>import('./iteration/menuDayAccumulate.vue'),
        xmIterationBurnout:()=>import('./iteration/burnout.vue'),
        xmIterationWorkItemDayList:()=>import('./iteration/iterationWorkItemDayList.vue'),
        xmIterationQuestionDayTrend:()=>import('./iteration/questionDayTrend.vue'),
        xmIterationQuestionDayAccumulate:()=>import('./iteration/questionDayAccumulate.vue'),

        
        xmBranchWorkItemDayList:()=>import('./branch/branchWorkItemDayList.vue'),
        xmBranchQuestionDayTrend:()=>import('./branch/questionDayTrend.vue'),
        xmBranchQuestionDayAccumulate:()=>import('./branch/questionDayAccumulate.vue'),
        xmBranchMenuDayTrend:()=>import('./branch/menuDayTrend.vue'),
        xmBranchMenuDayAccumulate:()=>import('./branch/menuDayAccumulate.vue'),
        
    },
    props:['xmTestCasedb','xmTestPlan','xmProduct','xmProject','xmIteration','showToolBar','category','showParams','isRptCfg','isRptShow'],
    computed: {
        ...mapGetters(['userInfo']), 
        compIds(){
           return this.compCfgList.map(k=>k.compId)
        },
        rptConfigParamsCpd(){
            //业务类型1-产品报告，2-迭代报告，3-测试计划报告，4-项目报告，5-企业报告
            var params={bizType:'5',bizId:this.userInfo.branchId,name:''}
             if(this.category=='企业级'){
                params.bizType='5';
                params.bizId=this.userInfo.branchId
                params.name=this.userInfo.branchName
             }else if(this.category=='产品级'){
                params.bizType='1';
                params.bizId=this.xmProduct.id
                params.name=this.xmProduct.productName
             }else  if(this.category=='迭代级'){
                params.bizType='2';
                params.bizId=this.xmIteration.id
                params.name=this.xmIteration.iterationName
             }else if(this.category=='项目级'){
                params.bizType='4';
                params.bizId=this.xmProject.id
                params.name=this.xmProject.name
             }else if(this.category=='测试级'){
                if(this.xmTestPlan && this.xmTestPlan.id){
                    params.bizType='3';
                    params.bizId=this.xmTestPlan.id
                    params.name=this.xmTestPlan.name
                }else{
                    params.bizType='6';
                    params.bizId=this.xmTestCasedb.id
                    params.name=this.xmTestCasedb.name
                }
               
                
             }else {
                return params;
             }
             return params;
        },
        toLoadXmRptConfigCpd(){
            return this.isRptCfg || this.isRptShow
        }
        
    },

    watch: {
        xmRptConfig:{
            handler(){
                this.initCompCfgList();
            },
            deep:true,
        },
        toLoadXmRptConfigCpd(){ 
            this.getXmRptConfig();
            this.$nextTick(()=>{
                this.compCfgList.forEach(k=>{
                    this.sizeAutoChange(k);
                })
            }) 
        }, 
        rptConfigParamsCpd(){
            if(this.isRptCfg ||this.isRptShow){
                this.getXmRptConfig()
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
                
                 { i:0, x: 0,  y: 12,  w: 12, h: 6,  name:'测试计划总览',compId:'xmTestRptOverview', params:{} }, 
                 { i: 1, x: 0,  y: 12,  w: 12, h: 6,   name:'用例规划分析', compId:'xmTestCaseToPlanCalc',  }, 
                 { i: 2, x: 0,  y: 12,  w: 12, h: 6,  name:'用例每日执行统计', compId:'xmTestDayTimesCalc',  },  
                 { i: 3, x: 0,  y: 12,  w: 12, h: 6,   name:'用例执行结果分布', compId:'xmTestPlanCaseExecStatusDist',  }, 
                 { i: 4, x: 0,  y: 12,  w: 12, h: 6,   name:'用例执行人情况分布', compId:'xmTestPlanCaseUserDist',  },  
                 { i:5, x: 0,  y: 12,  w: 12, h: 6,   name:'缺陷需求分布', compId:'xmQuestionMenuSort',  }, 
                 { i: 6, x: 0,  y: 12,  w: 12, h: 6,   name:'缺陷模块分布', compId:'xmQuestionFuncSort',  },  
                 { i: 7, x: 0,  y: 12,  w: 12, h: 6, name:'缺陷状态分布',compId:'xmQuestionBugStatusDist',  },
                 { i:8, x: 0,  y: 12,  w: 12, h: 6,  name:'缺陷年龄分布',compId:'xmQuestionAgeDist', params:{} },  
                 { i:9, x: 0,  y: 12,  w: 12, h: 6,  name:'缺陷原因分布',compId:'xmQuestionBugReasonDist', params:{} },  
                 { i:10, x: 0,  y: 12,  w: 12, h: 6,  name:'缺陷紧急程度分布',compId:'xmQuestionPriorityDist', params:{} }, 
                 { i: 11, x: 0,  y: 12,  w: 12, h: 6,  name:'缺陷提出人排行榜', compId:'xmQuestionAskUserSort',  }, 
                 { i: 12, x: 0,  y: 12,  w: 12, h: 6,  name:'缺陷负责人排行榜',compId:'xmQuestionHandlerUserSort',  }, 
                 
                 
            ],
            // 布局列数
            layoutColNum: 12,  
            paramsVisible:false,
            exportToolBarVisible:true,
        }
    },

    methods: {  
        initData(){
            this.paramsVisible=this.showParams
           this.getXmRptConfig();
        },
        getXmRptConfig(){  
            if(!this.toLoadXmRptConfigCpd){
                return;
            }
            var params={bizType:this.rptConfigParamsCpd.bizType,bizId:this.rptConfigParamsCpd.bizId}
            listXmRptConfig(params).then(res=>{
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
            if(this.compCfgList.some(k=>k.id==comp.id)){ 
                var compCfg=this.compCfgList.find(k=>k.id==comp.id)
                this.$nextTick(()=>{
                    this.scrollToComp(compCfg)   
                }) 
                 return;
            }
            var compCfgListTemp=JSON.parse(JSON.stringify(this.compCfgList))
            compCfgListTemp.sort((i1,i2)=>{
                return i2.i-i1.i
            })
            var maxI=(compCfgListTemp.length>0?(compCfgListTemp[0].i+1):1);
            compCfgListTemp.sort((i1,i2)=>{
                return i2.y-i1.y
            })
            var maxY=(compCfgListTemp.length>0?(compCfgListTemp[0].y+6):0);
            var compCfg={...comp,i:maxI, x: 0,  y: maxY,  w: 12, h: 6,id:comp.compId+seq.sn()} 
            this.compCfgList.push(compCfg) 
            this.$nextTick(()=>{ 
                setTimeout(()=>{
                    this.scrollToComp(compCfg) 
                },200)
            })
           
        },
        scrollToComp(compCfg){    
            var doc=document.getElementById(compCfg.id)
            if(doc){
                doc.scrollIntoView(true)
            }  
        },
        submitXmPrtConfig(callback){ 
            if(this.xmRptConfig==null){
                var xmRptConfig={...this.rptConfigParamsCpd,cfg:[]}
                var compCfgList=JSON.parse(JSON.stringify(this.compCfgList))
                compCfgList.forEach(k=>{
                    if(this.$refs[k.id] && this.$refs[k.id][0].$refs && this.$refs[k.id][0].$refs[k.id]){ 
                        var com=this.$refs[k.id][0].$refs[k.id]
                         k.params=com.params
                         k.title=com.title
                         k.remark=com.remark
                    }else{ 
                        var com=this.$refs[k.id][0]
                         k.params=com.params
                         k.title=com.title
                         k.remark=com.remark
                    }
                   
                })
                xmRptConfig.cfg=JSON.stringify(compCfgList)
                addXmRptConfig(xmRptConfig).then(res=>{
                    this.xmRptConfig=xmRptConfig;
                    callback()
                })
            }else{
                var xmRptConfig={...this.xmRptConfig,cfg:[]}
                var compCfgList=JSON.parse(JSON.stringify(this.compCfgList))
                compCfgList.forEach(k=>{
                    if(this.$refs[k.id] && this.$refs[k.id][0].$refs && this.$refs[k.id][0].$refs[k.id]){ 
                        var com=this.$refs[k.id][0].$refs[k.id]
                         k.params=com.params
                         k.title=com.title
                         k.remark=com.remark
                    }else{ 
                         var com=this.$refs[k.id][0]
                         k.params=com.params
                         k.title=com.title
                         k.remark=com.remark
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
            
        },
        exportToPdf(){
            this.paramsVisible=false
            this.$PDFSave(this.$refs.rptBox, this.rptConfigParamsCpd.name+"-报告");  
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
