<template>
<section>
    <el-row  class="padding-left padding-right">
        <el-col :span="6">
            <comps-set :comp-ids="compIds" :category="category" @row-click="onCompSelect" ref="compsSet" :show-checked-only="isRptShow"></comps-set>
        </el-col>
        <el-col :span="18"> 
            <el-row  class="padding">
                <span class="rpt-name">{{ xmRptData && xmRptData.id?xmRptData.rptName:(xmRptConfig&&xmRptConfig.id?xmRptConfig.name: rptConfigParamsCpd.name+'-报告')}}</span>
                <span style="float:right;">
                    <el-button type="text" v-if="isRptShow==true && isRptCfg==false" @click="toQueryRptData" icon="el-icon-time">查看历史报告</el-button>  
                    <el-button type="primary" v-if="isRptShow==true && isRptCfg==false && (!xmRptData||!xmRptData.id)" @click="showCreateRptData()" icon="el-icon-time">保存报告(可供历史查询)</el-button>  
                    <el-button type="text" v-if="isRptShow==false && isRptCfg==false" @click="isRptShow=true" icon="el-icon-time">查看报告</el-button>  
                    <el-button type="warning" v-if="isRptShow==true" @click="undoRptShow" icon="el-icon-error">退出报告</el-button>  
                    <el-button type="text" v-if="isRptCfg==false&&isRptShow==false" @click="toRptCfg" icon="el-icon-setting">制作报告</el-button>  
                    <el-button type="primary" v-if="isRptCfg==true" @click="undoRptCfg" icon="el-icon-error">取消制作</el-button> 
                    <el-button type="warning" v-if="isRptCfg==true" @click="toSaveRptCfg">保存报告</el-button>  
                    <el-button type="text" v-if="paramsVisible==true" @click="paramsVisible=false">隐藏过滤条件</el-button>  
                    <el-button type="text" v-if="paramsVisible==false" @click="paramsVisible=true">显示过滤条件</el-button> 
                    <el-button type="text" v-if="isRptShow==true && isRptCfg==false && xmRptData && xmRptData.id" @click="toShareRpt" icon="el-icon-share">分享</el-button>  
                    <el-button type="text" v-print="{id:'printBody',popTitle:xmRptData && xmRptData.id?xmRptData.rptName:(xmRptConfig&&xmRptConfig.id?xmRptConfig.name: rptConfigParamsCpd.name+'-报告')}" icon="el-icon-printer"></el-button>
                    <el-button type="text" @click="exportToPdf">pdf</el-button> 
                </span> 
            </el-row>
            <el-row :style="{height:maxTableHeight+'px',overflowY:'auto',overflowX:'hidden',}" ref="table">
                <div class="empty" v-if="compCfgList.length == 0" >
                    <el-empty description="暂未选择报表，请至少选择一个报表"></el-empty>
                </div>
                <div v-else id="printBody" ref="rptBox"> 
                    <component style="margin-bottom:80px;" v-for="(item,index) in compCfgList" :key="index" :is="item.compId" :xm-test-plan="xmTestPlan" :xm-product="xmProduct" :xm-project="xmProject" :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :category="category" :cfg="item.cfg" :ref="item.id" @delete="doDelete(item)" :init-group-by="item.initGroupBy" :show-tool-bar="false" :id="item.id" :rpt-data="item.rawDatas" :show-params="paramsVisible"></component>
                         
                </div>
            </el-row>
        </el-col> 
    </el-row>   
    <el-dialog append-to-body modal-append-to-body :visible.sync="rptDataListVisible" top="20px" width="60%">
        <rpt-data-list :xm-rpt-config="xmRptConfig" v-if="rptDataListVisible" @select="onRptDataSelect"/>
    </el-dialog> 
    
    <el-dialog title="请确认" append-to-body modal-append-to-body :visible.sync="createRptConfigVisible">
        <el-form :model="xmRptConfig">
            <el-form-item label="报告名称">
                <el-input v-model="xmRptConfig.name"></el-input>
            </el-form-item>
        </el-form> 
        <div slot="footer" class="dialog-footer">
            <el-button @click="createRptConfigVisible = false">取 消</el-button>
            <el-button type="primary" @click="finishRptCfg">确 定</el-button>
        </div>
    </el-dialog> 
    
    <el-dialog title="请确认" append-to-body modal-append-to-body :visible.sync="createRptDataVisible">
        <el-form :model="xmRptData">
            <el-form-item label="报告名称">
                <el-input v-model="xmRptData.rptName"></el-input>
            </el-form-item>
        </el-form> 
        <div slot="footer" class="dialog-footer">
            <el-button @click="createRptDataVisible = false">取 消</el-button>
            <el-button type="primary" @click="createRptData">确 定</el-button>
        </div>
    </el-dialog> 
    </section>
</template>

<script>  
 
import util from '@/common/js/util';//全局公共库
import seq from '@/common/js/sequence';//全局公共库
import VueGridLayout from 'vue-grid-layout';
import { mapGetters } from 'vuex' 
import CompsSet from '@/views/xm/rpt/CompsSet'  
import rptDataList from '@/views/xm/rpt/his/rptDataList'  
import { addXmRptData  } from '@/api/xm/core/xmRptData';


import {  listXmRptConfig,editXmRptConfig,addXmRptConfig } from '@/api/xm/core/xmRptConfig';
 
export default {
    components: { 
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem, 
        CompsSet,  rptDataList,
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
        xmQuestionBugReasonDist:()=>import('./product/questionAttDist.vue'),
        xmQuestionBugTypeDist:()=>import('./product/questionAttDist.vue'),
        xmQuestionPriorityDist:()=>import('./product/questionAttDist.vue'),
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
    props:['xmTestCasedb','xmTestPlan','xmProduct','xmProject','xmIteration','category','showParams'],
    computed: {
        ...mapGetters(['userInfo']), 
        compIds(){
           return this.compCfgList.map(k=>k.compId)
        },
        rptConfigParamsCpd(){
            //业务类型1-产品报告，2-迭代报告，3-测试计划报告，4-项目报告，5-企业报告 
			var params={bizType:'5',bizId:this.userInfo.branchId,name:this.userInfo.branchName}
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
            isRptCfg:false,
            isRptShow:false,
            xmRptConfig:{},
            xmRptData:{id:'',rptName:'',bizId:'',bizType:'',bizDate:''},
            xmRptDataInit:{id:'',rptName:'',bizId:'',bizType:'',bizDate:''},
            compCfgList:[],
            maxTableHeight:300, 
            // 布局列数
            layoutColNum: 12,  
            paramsVisible:true,
            rptDataListVisible:false,
            createRptDataVisible:false,
            createRptConfigVisible:false,
        }
    },

    methods: {  
        initData(){
            if(this.showParams!=undefined){
                this.paramsVisible=this.showParams
            } 
            if(!this.toLoadXmRptConfigCpd){
                this.initCompCfgList();
             }else{
                this.getXmRptConfig();
            }
           
        },
        toShareRpt(){
            if(!this.xmRptData||!this.xmRptData.id){
                this.$message.error("只能分享历史报告")
                return;
            }
             
            var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
            var link=curlDomain+"/"+process.env.CONTEXT+"/"+process.env.VERSION+"/#/xm/rpt/hisRpt?id="+this.xmRptData.id
            this.$copyText(link).then(e => {
                this.$notify({position:'bottom-left',showClose:true,message:"拷贝链接成功，您可以黏贴到任何地方",type:'success'})
            }); 
        },
        showCreateRptData(){
            if(this.xmRptConfig==null){
                this.$message.error("还没制作报告，请先制作报告")
                return;
            }  
            this.xmRptData.rptName=this.xmRptConfig.name
            this.createRptDataVisible=true
           
        },
        toSaveRptCfg(){
            this.createRptConfigVisible=true
            if(!this.xmRptConfig.name){
                this.xmRptConfig.name=this.rptConfigParamsCpd.name+"-报告"
            }

        },
        toQueryRptData(){
            this.rptDataListVisible=true;
        },
        createRptData(){
            if(this.xmRptConfig==null){
                this.$message.error("还没制作报告，请先制作报告")
                return;
            }  
            if(!this.xmRptData.rptName){
                this.$message.error("请输入报告名称")
                return;
            }
            var xmRptData={...this.xmRptData,cfgId:this.xmRptConfig.id,rptData:[]}   
            this.compCfgList.forEach(k=>{
                if(this.$refs[k.id] && this.$refs[k.id][0].$refs && this.$refs[k.id][0].$refs[k.id]){ 
                    var com=this.$refs[k.id][0].$refs[k.id]
                    var comData={compId:k.compId,params:com.params,title:com.title,remark:com.remark} 
                    xmRptData.rptData.push(comData)
                }else{ 
                    var com=this.$refs[k.id][0]
                    var comData={compId:k.compId,params:com.params,title:com.title,remark:com.remark} 
                    xmRptData.rptData.push(comData)
                }
            })
            xmRptData.rptData=JSON.stringify(xmRptData.rptData)
            addXmRptData(xmRptData).then(res=>{  
                var tips = res.data.tips
                if(tips.isOk){
                    this.$message.success("报告保存成功") 
                    this.createRptDataVisible=false
                }else{
                    this.$message.error(tips.msg)
                }
            }) 
        },
        undoRptCfg(){
            this.xmRptConfig={};
            this.isRptCfg=false;
        },
        undoRptShow(){
            this.isRptShow=false;
            this.xmRptConfig={};
            this.xmRptData={...this.xmRptDataInit};
        },
        toRptCfg(){
            this.isRptCfg=true;
            this.$message.success("切换到报告制作模式成功。请选择报表加入报告中。")
        },
        finishRptCfg(){
            
            this.submitXmPrtConfig((res)=>{
                var tips = res.data.tips;
                if(tips.isOk){
                    this.isRptCfg=false
                    this.xmRptConfig={};
                    this.createRptConfigVisible=false;
                    this.$message.success("报告保存成功。将退出报告制作模式")
                }else{
                   
                    this.$message.error(tips.msg)
                } 
            });
        },
        getXmRptConfig(){   
            if(!this.toLoadXmRptConfigCpd){
                return;
            }
            if(this.rptDatas){
					this.rawDatas=this.rptDatas
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
                cfgJson.forEach(k=>k.id=k.compId+seq.sn())
                this.compCfgList=cfgJson;
            }else{ 
                var defList=this.$refs['compsSet'].rptListCpd
                if(defList && defList.length>3){
                    defList=defList.slice(0,3);
                } 
                defList.forEach(k=>k.id=k.compId+seq.sn())
                this.compCfgList=JSON.parse(JSON.stringify(defList))
            }
        },
        onCompSelect(comp){  
            if(this.compCfgList.some(k=>k.compId==comp.compId)){ 
                var compCfg=this.compCfgList.find(k=>k.compId==comp.compId)
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
            if(!this.xmRptConfig||!this.xmRptConfig.name){
                this.$message.error("请输入报告名称")
                return 
            }
            if(!this.xmRptConfig.id){
                var xmRptConfig={...this.rptConfigParamsCpd,name:this.xmRptConfig.name,cfg:[]}  
                this.compCfgList.forEach(k=>{
                    if(this.$refs[k.id] && this.$refs[k.id][0].$refs && this.$refs[k.id][0].$refs[k.id]){ 
                        var com=this.$refs[k.id][0].$refs[k.id]
                        var comData={compId:k.compId,params:com.params,title:com.title,remark:com.remark} 
                        xmRptConfig.cfg.push(comData)
                    }else{ 
                        var com=this.$refs[k.id][0]
                        var comData={compId:k.compId,params:com.params,title:com.title,remark:com.remark} 
                        xmRptConfig.cfg.push(comData)
                    }
                   
                })
                xmRptConfig.cfg=JSON.stringify(xmRptConfig.cfg)
                
                addXmRptConfig(xmRptConfig).then(res=>{
                    this.xmRptConfig=xmRptConfig;
                    callback(res)
                })
            }else{
                var xmRptConfig={...this.xmRptConfig,cfg:[]} 
                this.compCfgList.forEach(k=>{
                    if(this.$refs[k.id] && this.$refs[k.id][0].$refs && this.$refs[k.id][0].$refs[k.id]){ 
                        var com=this.$refs[k.id][0].$refs[k.id]
                        var comData={compId:k.compId,params:com.params,title:com.title,remark:com.remark} 
                        xmRptConfig.cfg.push(comData)
                    }else{ 
                         var com=this.$refs[k.id][0]
                        var comData={compId:k.compId,params:com.params,title:com.title,remark:com.remark} 
                        xmRptConfig.cfg.push(comData)
                    }
                })
                xmRptConfig.cfg=JSON.stringify(xmRptConfig.cfg)
                editXmRptConfig(xmRptConfig).then(res=>{
                    this.xmRptConfig=xmRptConfig; 
                    callback(res)
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
             
            
        },
        onRptDataSelect(rptData){
            this.xmRptData=rptData
            this.rptDataListVisible=false;
            if(this.xmRptData && this.xmRptData.id ){
                if( this.xmRptData.cfgId==this.xmRptConfig.id){
                    this.xmRptConfig.name=this.xmRptData.rptName
                    var cfgList=JSON.parse(this.xmRptData.rptData)
                    cfgList.forEach(k=>k.id=k.compId+seq.sn())
                    this.compCfgList=cfgList
                }
            }
        },
        exportToPdf(){
            this.paramsVisible=false
            this.$nextTick(()=>{
                this.$PDFSave(this.$refs.rptBox, this.rptConfigParamsCpd.name+"-报告");  
            })
            
        }, 
         
    },

    mounted() {
        this.$nextTick(() => {
            this.initData();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
        })
    },

}
</script>

<style lang="less" scoped>
.toolbar{
    z-index: 999;
    position:absolute;
    top:0px;
    right:20px;
}
.rpt-name{
    text-align: center;
    font-size: 18px;
    font-weight: 600;
}
</style> 
