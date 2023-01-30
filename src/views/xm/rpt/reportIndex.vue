<template>
	<section class="padding">
		<el-row gutter="5">
            <el-col :span="6"> 
                <el-row> 
                    <el-select v-model="filters.category" clearable @change="onCategroySelect" style="width:100%;" :disabled="category">
                        <el-option v-for="(item,index) in categorys" :label="item" :value="item" :key="index"></el-option>
                    </el-select>
                </el-row> 
                <el-row :style="{overflowX:'hidden',height:maxTableHeight+'px'}" ref="table"> 
                        <div class="moduleset"> 
                            <div class="nav">
                            <div class="nav_item" :class="{itemActive: item.isChecked}" v-for="(item, index) in rptListCpd" :key="index" @click="intoInfo(item, index)">
                                <img :src="item.img" alt="">
                                <div class="desc">
                                    <p>{{index+1}} {{item.rptName}}</p>
                                    <span>
                                        {{item.desc}}
                                    </span>
                                </div>
                                <i v-if="item.isChecked" class="el-icon-success"></i>
                            </div>
                            </div>  
                        </div>
                </el-row>
            </el-col>
            <el-col :span="18">
                <xm-iteration-burnout  v-if="showRptRef=='xmIterationBurnout'" :category="filters.category" ref="xmIterationBurnout" :xm-iteration="xmIteration" :xm-product="xmProduct" :xm-project="xmProject"></xm-iteration-burnout>
                <xm-menu-day-trend  v-if="showRptRef=='xmMenuDayTrend'" :category="filters.category" ref="xmMenuDayTrend" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-menu-day-trend>
                <xm-menu-day-accumulate  v-if="showRptRef=='xmMenuDayAccumulate'" :category="filters.category" ref="xmMenuDayAccumulate" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-menu-day-accumulate>
                <xm-iteration-menu-day-trend  v-if="showRptRef=='xmIterationMenuDayTrend'" :category="filters.category" ref="xmIterationMenuDayTrend" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-iteration-menu-day-trend>
                <xm-iteration-menu-day-accumulate  v-if="showRptRef=='xmIterationMenuDayAccumulate'" :category="filters.category" ref="xmIterationMenuDayAccumulate" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-iteration-menu-day-accumulate>
                <xm-menu-att-dist  v-if="showRptRef=='xmMenuAttDist'" :category="filters.category" ref="xmMenuAttDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-menu-att-dist>
                <xm-menu-age-dist  v-if="showRptRef=='xmMenuAgeDist'" :category="filters.category" ref="xmMenuAgeDist" :xm-product="xmProduct" :xm-project="xmProject" :xm-iteration="xmIteration"></xm-menu-age-dist>
                <xm-menu-sort  v-if="showRptRef=='xmMenuSort'" :category="filters.category" ref="xmMenuSort" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-menu-sort>

                
                <xm-task-day-trend  v-if="showRptRef=='xmTaskDayTrend'" :category="filters.category" ref="xmTaskDayTrend" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-task-day-trend>
                <xm-task-day-accumulate  v-if="showRptRef=='xmTaskDayAccumulate'" :category="filters.category" ref="xmTaskDayAccumulate" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-task-day-accumulate>
                <xm-task-att-dist  v-if="showRptRef=='xmTaskAttDist'" :category="filters.category" ref="xmTaskAttDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-task-att-dist>
                <xm-task-age-dist  v-if="showRptRef=='xmTaskAgeDist'" :category="filters.category" ref="xmTaskAgeDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-task-age-dist>
                <xm-task-sort  v-if="showRptRef=='xmTaskSort'" :category="filters.category" ref="xmTaskSort" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-task-sort>
                <xm-project-work-item-day-list  v-if="showRptRef=='xmProjectWorkItemDayList'" :category="filters.category" ref="xmProjectWorkItemDayList" :xm-product="xmProduct" :xm-project="xmProject" ></xm-project-work-item-day-list>
                <xm-project-workload-set-day-list  v-if="showRptRef=='xmProjectWorkloadSetDayList'" :category="filters.category" ref="xmProjectWorkloadSetDayList" :xm-product="xmProduct" :xm-project="xmProject"></xm-project-workload-set-day-list>
                <xm-project-workload-set-month-list  v-if="showRptRef=='xmProjectWorkloadSetMonthList'" :category="filters.category" ref="xmProjectWorkloadSetMonthList" :xm-product="xmProduct" :xm-project="xmProject"></xm-project-workload-set-month-list>
                

                <xm-iteration-question-day-trend  v-if="showRptRef=='xmIterationQuestionDayTrend'" :category="filters.category" ref="xmIterationQuestionDayTrend" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-iteration-question-day-trend>
                <xm-iteration-question-day-accumulate  v-if="showRptRef=='xmIterationQuestionDayAccumulate'" :category="filters.category" ref="xmIterationQuestionDayAccumulate" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-iteration-question-day-accumulate>
                <xm-question-day-trend  v-if="showRptRef=='xmQuestionDayTrend'" :category="filters.category" ref="xmQuestionDayTrend" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-question-day-trend>
                <xm-question-day-accumulate  v-if="showRptRef=='xmQuestionDayAccumulate'" :category="filters.category" ref="xmQuestionDayAccumulate" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-question-day-accumulate>
                <xm-question-att-dist  v-if="showRptRef=='xmQuestionAttDist'" :category="filters.category" ref="xmQuestionAttDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan"></xm-question-att-dist>
                <xm-question-state-dist  v-if="showRptRef=='xmQuestionStateDist'" :category="filters.category" ref="xmQuestionStateDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan"></xm-question-state-dist>

                <xm-question-age-dist  v-if="showRptRef=='xmQuestionAgeDist'" :category="filters.category" ref="xmQuestionAgeDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan"></xm-question-age-dist>
                <xm-question-sort v-if="showRptRef=='xmQuestionSort'" :category="filters.category" ref="xmQuestionSort" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan"></xm-question-sort>
                <xm-question-ask-user-sort v-if="showRptRef=='xmQuestionAskUserSort'" :category="filters.category" ref="xmQuestionAskUserSort" init-group-by="ask_userid" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan"></xm-question-ask-user-sort>
                <xm-question-handler-user-sort v-if="showRptRef=='xmQuestionHandlerUserSort'" :category="filters.category" ref="xmQuestionHandlerUserSort" init-group-by="handler_userid"  :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan"></xm-question-handler-user-sort>
                <xm-question-func-sort v-if="showRptRef=='xmQuestionFuncSort'" :category="filters.category" ref="xmQuestionFuncSort" init-group-by="func_id"  :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan"></xm-question-func-sort>
                <xm-question-menu-sort v-if="showRptRef=='xmQuestionMenuSort'" :category="filters.category" ref="xmQuestionMenuSort" init-group-by="menu_id"  :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan"></xm-question-menu-sort>
                
                <xm-question-retest-dist  v-if="showRptRef=='xmQuestionRetestDist'" :category="filters.category" ref="xmQuestionRetestDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan"></xm-question-retest-dist>
                <xm-product-work-item-day-list  v-if="showRptRef=='xmProductWorkItemDayList'" :category="filters.category" ref="xmProductWorkItemDayList" :xm-product="xmProduct" :xm-project="xmProject"></xm-product-work-item-day-list>
                <xm-iteration-work-item-day-list  v-if="showRptRef=='xmIterationWorkItemDayList'" :category="filters.category" ref="xmIterationWorkItemDayList" :xm-product="xmProduct" :xm-project="xmProject" :xm-iteration="xmIteration"></xm-iteration-work-item-day-list>
            
                <!--测试计划-->
                <xm-test-plan-case-exec-status-dist  v-if="showRptRef=='xmTestPlanCaseExecStatusDist'" :category="filters.category" ref="xmTestPlanCaseExecStatusDist" :xm-product="xmProduct" :xm-project="xmProject" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan" :xm-iteration="xmIteration"></xm-test-plan-case-exec-status-dist> 
                <xm-test-plan-case-user-dist  v-if="showRptRef=='xmTestPlanCaseUserDist'" :category="filters.category" ref="xmTestPlanCaseUserDist" :xm-product="xmProduct" :xm-project="xmProject" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan" :xm-iteration="xmIteration"></xm-test-plan-case-user-dist>
                <xm-test-day-times-calc  v-if="showRptRef=='xmTestDayTimesCalc'" :category="filters.category" ref="xmTestDayTimesCalc" :xm-product="xmProduct" :xm-project="xmProject" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan" :xm-iteration="xmIteration"></xm-test-day-times-calc>
                <xm-test-case-to-plan-calc  v-if="showRptRef=='xmTestCaseToPlanCalc'" :category="filters.category" ref="xmTestCaseToPlanCalc" :xm-product="xmProduct" :xm-project="xmProject" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan" :xm-iteration="xmIteration"></xm-test-case-to-plan-calc>
                
                <!--企业级报表-->
                <xm-branch-question-day-trend  v-if="showRptRef=='xmBranchQuestionDayTrend'" :category="filters.category" ref="xmBranchQuestionDayTrend" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-branch-question-day-trend>
                <xm-branch-question-day-accumulate  v-if="showRptRef=='xmBranchQuestionDayAccumulate'" :category="filters.category" ref="xmBranchQuestionDayAccumulate" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-branch-question-day-accumulate>
                <xm-branch-work-item-day-list  v-if="showRptRef=='xmBranchWorkItemDayList'" :category="filters.category" ref="xmBranchWorkItemDayList" :xm-product="xmProduct" :xm-project="xmProject" :xm-iteration="xmIteration"></xm-branch-work-item-day-list>
                <xm-branch-menu-day-trend  v-if="showRptRef=='xmBranchMenuDayTrend'" :category="filters.category" ref="xmBranchMenuDayTrend" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-branch-menu-day-trend>
                <xm-branch-menu-day-accumulate  v-if="showRptRef=='xmBranchMenuDayAccumulate'" :category="filters.category" ref="xmBranchMenuDayAccumulate" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-branch-menu-day-accumulate>
                
            </el-col>
		</el-row>
        

    </section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	
    import xmMenuDayTrend from './product/menuDayTrend'
    import xmMenuDayAccumulate from './product/menuDayAccumulate'
	import xmMenuAttDist from './product/menuAttDist'
	import xmMenuAgeDist from './product/menuAgeDist'
	import xmMenuSort from './product/menuSort'
	import xmProductWorkItemDayList from './product/productWorkItemDayList'


    import xmTaskDayTrend from './project/taskDayTrend'
    import xmTaskDayAccumulate from './project/taskDayAccumulate'
	import xmTaskAttDist from './project/taskAttDist'
	import xmTaskAgeDist from './project/taskAgeDist'
	import xmTaskSort from './project/taskSort'
	import xmProjectWorkItemDayList from './project/projectWorkItemDayList'
	import xmProjectWorkloadSetDayList from './project/projectWorkloadSetDayList'
	import xmProjectWorkloadSetMonthList from './project/projectWorkloadSetMonthList'

    import xmQuestionDayTrend from './product/questionDayTrend'
    import xmQuestionDayAccumulate from './product/questionDayAccumulate'
	import xmQuestionAttDist from './product/questionAttDist'
	import xmQuestionStateDist from './product/questionAttDist'
	import xmQuestionAgeDist from './product/questionAgeDist'
	import xmQuestionSort from './product/questionSort'
	import xmQuestionAskUserSort from './product/questionSort'
	import xmQuestionHandlerUserSort from './product/questionSort' 
	import xmQuestionFuncSort from './product/questionSort'
	import xmQuestionMenuSort from './product/questionSort' 
	import xmQuestionRetestDist from './product/questionRetestDist'

    
	import xmTestPlanCaseExecStatusDist from './testPlan/testPlanCaseExecStatusDist'
	import xmTestPlanCaseUserDist from './testPlan/testPlanCaseUserDist'
	import xmTestDayTimesCalc from './testPlan/testDayTimesCalc'
	import xmTestCaseToPlanCalc from './testPlan/testCaseToPlanCalc'

    
    import xmIterationMenuDayTrend from './iteration/menuDayTrend'
    import xmIterationMenuDayAccumulate from './iteration/menuDayAccumulate'
    import xmIterationBurnout from './iteration/burnout'
	import xmIterationWorkItemDayList from './iteration/iterationWorkItemDayList'
    import xmIterationQuestionDayTrend from './iteration/questionDayTrend'
    import xmIterationQuestionDayAccumulate from './iteration/questionDayAccumulate'

    
	import xmBranchWorkItemDayList from './branch/branchWorkItemDayList'
    import xmBranchQuestionDayTrend from './branch/questionDayTrend'
    import xmBranchQuestionDayAccumulate from './branch/questionDayAccumulate'
    import xmBranchMenuDayTrend from './branch/menuDayTrend'
    import xmBranchMenuDayAccumulate from './branch/menuDayAccumulate'
    
    import pieSimple from './images/pie-simple.png'
    import lineStack from './images/line-stack.png'
    import areaStack from './images/area-stack.png'
    import ranjintu from './images/ranjintu.png'
    import datasetLink from './images/dataset-link.png'
    import bar from './images/bar.png'
    
	export default { 
        
		components: {   
            xmIterationBurnout,xmMenuDayTrend,xmMenuDayAccumulate,xmMenuAttDist,xmMenuAgeDist,xmMenuSort,xmProductWorkItemDayList,xmTaskDayTrend,xmTaskDayAccumulate,xmTaskAttDist,xmTaskAgeDist,xmTaskSort,xmProjectWorkItemDayList,xmProjectWorkloadSetDayList,xmProjectWorkloadSetMonthList,xmQuestionDayTrend,xmQuestionDayAccumulate,xmQuestionAttDist,xmQuestionAgeDist,xmQuestionSort,
            xmIterationMenuDayTrend,xmIterationMenuDayAccumulate,xmIterationWorkItemDayList,xmIterationQuestionDayTrend,xmIterationQuestionDayAccumulate,
            
            xmTestPlanCaseExecStatusDist,xmTestPlanCaseUserDist,xmQuestionRetestDist,xmQuestionStateDist,
            xmQuestionAskUserSort,xmQuestionHandlerUserSort,xmQuestionFuncSort,xmQuestionMenuSort,xmTestDayTimesCalc,xmTestCaseToPlanCalc,

            xmBranchWorkItemDayList,xmBranchQuestionDayTrend,xmBranchQuestionDayAccumulate,xmBranchMenuDayTrend,xmBranchMenuDayAccumulate
        
        },
        props:['xmProduct','xmIteration','xmProject','xmTestCasedb','xmTestPlan','category'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),
			rptListCpd(){
                if(!this.filters.category){
                    return this.rptList;
                }else{
                     return this.rptList.filter(i=>i.category.indexOf(this.filters.category)>=0)
                }
               
            },
            
			 categorys:function(){
                var map={}; 
                var list=[];
                this.rptList.forEach(e => { 
                    var cateList=e.category.split(",")
                    cateList.forEach(cate=>{
                        if(!map[cate]){
                            list.push(cate);
                            map[cate]=cate
                        }
                    }) 
                   
                }); 
                return list;
            },
            
        }, 
		watch: {  
	    },
		data() {
			return {
                filters:{
                    category:'项目级', 
                },
                showRptRef:'',
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300,
                rptList:[/**{name:'报表名称',category:'报表分类，组织级、产品级、项目级、迭代级、需求、测试、任务',path:'路由路径',imgUrl:'图片路径',query:{参数}} */
                    //迭代报表
                    {isChecked:false,rptName:'迭代燃尽图',category:'迭代级',ref:'xmIterationBurnout',desc:'跟踪迭代的剩余工作量按日期变化趋势，识别迭代当前进度情况',img:ranjintu },
                    {isChecked:false,rptName:'需求每日趋势',category:'迭代级',ref:'xmIterationMenuDayTrend',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期变化趋势，识别需求工作情况',img:lineStack  },
                    {isChecked:false,rptName:'需求每日累积',category:'迭代级',ref:'xmIterationMenuDayAccumulate',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期累积情况，识别需求工作的瓶颈',img:areaStack  },
                    {isChecked:false,rptName:'迭代工作项每日趋势',category:'迭代级',ref:'xmIterationWorkItemDayList',desc:'统计迭代每日工作项数量分布情况',img:datasetLink  },  
                    {isChecked:false,rptName:'迭代缺陷每日趋势',category:'迭代级',ref:'xmIterationQuestionDayTrend',desc:'跟踪新提出、执行中、已解决、已关闭状态的缺陷数量按日期变化趋势，识别缺陷处理工作情况',img:lineStack  },
                    {isChecked:false,rptName:'迭代缺陷每日累积',category:'迭代级',ref:'xmIterationQuestionDayAccumulate',desc:'跟踪一段时间内，各种程度和类别的缺陷累积情况，监控缺陷的变化趋势',img:areaStack  },
                   
                    //企业级报表
                    {isChecked:false,rptName:'企业工作项每日趋势',category:'企业级',ref:'xmBranchWorkItemDayList',desc:'统计迭代每日工作项数量分布情况',img:datasetLink  },  
                    {isChecked:false,rptName:'企业缺陷每日趋势',category:'企业级',ref:'xmBranchQuestionDayTrend',desc:'跟踪新提出、执行中、已解决、已关闭状态的缺陷数量按日期变化趋势，识别缺陷处理工作情况',img:lineStack  },
                    {isChecked:false,rptName:'企业缺陷每日累积',category:'企业级',ref:'xmBranchQuestionDayAccumulate',desc:'跟踪一段时间内，各种程度和类别的缺陷累积情况，监控缺陷的变化趋势',img:areaStack  },
                    {isChecked:false,rptName:'需求每日趋势',category:'企业级',ref:'xmBranchMenuDayTrend',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期变化趋势，识别需求工作情况',img:lineStack  },
                    {isChecked:false,rptName:'需求每日累积',category:'企业级',ref:'xmBranchMenuDayAccumulate',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期累积情况，识别需求工作的瓶颈',img:areaStack  },
                   
                    //产品报表
                    {isChecked:false,rptName:'产品工作项每日趋势',category:'产品级',ref:'xmProductWorkItemDayList',desc:'统计产品每日工作项数量分布情况',img:datasetLink  },  
                    {isChecked:false,rptName:'需求每日趋势',category:'产品级',ref:'xmMenuDayTrend',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期变化趋势，识别需求工作情况',img:lineStack  },
                    {isChecked:false,rptName:'需求每日累积',category:'产品级',ref:'xmMenuDayAccumulate',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期累积情况，识别需求工作的瓶颈',img:areaStack  },
                    {isChecked:false,rptName:'需求属性分布',category:'产品级,迭代级,企业级',ref:'xmMenuAttDist',desc:'统计所有需求任意属性数量分布情况（实时数据）',img:pieSimple  },
                    {isChecked:false,rptName:'需求年龄分布',category:'产品级,迭代级,企业级',ref:'xmMenuAgeDist',desc:'统计所有需求年龄分布情况（实时数据）',img:pieSimple  },
                    {isChecked:false,rptName:'需求排行榜',category:'产品级,迭代级,企业级',ref:'xmMenuSort',desc:'需求提出人、负责人的用户故事数量排行（实时数据）',img:bar  },
                    {isChecked:false,rptName:'产品缺陷每日趋势',category:'产品级',ref:'xmQuestionDayTrend',desc:'跟踪新提出、执行中、已解决、已关闭状态的缺陷数量按日期变化趋势，识别缺陷处理工作情况',img:lineStack  },
                    {isChecked:false,rptName:'产品缺陷每日累积',category:'产品级',ref:'xmQuestionDayAccumulate',desc:'跟踪一段时间内，各种程度和类别的缺陷累积情况，监控缺陷的变化趋势',img:areaStack  },
                    
                    //项目报表
                    {isChecked:false,rptName:'项目工作项每日趋势',category:'项目级',ref:'xmProjectWorkItemDayList',desc:'统计项目每日工作项数量分布情况',img:datasetLink  },
                    {isChecked:false,rptName:'任务每日趋势',category:'项目级',ref:'xmTaskDayTrend',desc:'跟踪未开始、执行中、已完成、已关闭状态的任务数量按日期变化趋势，识别任务工作情况',img:lineStack  },
                    {isChecked:false,rptName:'任务每日累积',category:'项目级',ref:'xmTaskDayAccumulate',desc:'跟踪未开始、执行中、已完成、已关闭状态的任务数量按日期累积情况，识别任务工作的瓶颈',img:areaStack  },
                    {isChecked:false,rptName:'任务属性分布',category:'项目级,企业级',ref:'xmTaskAttDist',desc:'统计所有任务任意属性数量分布情况（实时数据）',img:pieSimple  },
                    {isChecked:false,rptName:'任务年龄分布',category:'项目级,企业级',ref:'xmTaskAgeDist',desc:'统计所有任务年龄分布情况（实时数据）',img:pieSimple  },
                    {isChecked:false,rptName:'任务排行榜',category:'项目级,企业级',ref:'xmTaskSort',desc:'任务提出人、负责人的用户故事数量排行（实时数据）',img:bar  },
                    {isChecked:false,rptName:'项目结算工时每日趋势',category:'项目级',ref:'xmProjectWorkloadSetDayList',desc:'统计项目每日登记工时、结算工时数量分布情况',img:datasetLink  },
                    {isChecked:false,rptName:'项目结算工时每月趋势',category:'项目级',ref:'xmProjectWorkloadSetMonthList',desc:'统计项目每月登记工时、结算工时数量分布情况',img:datasetLink  },


                    //测试级报表 
                    {isChecked:false,rptName:'测试用例规划分析',category:'测试级,项目级,产品级,迭代级,企业级',ref:'xmTestCaseToPlanCalc',desc:'显示用例被规划到测试计划中的次数统计',img:pieSimple  },
 
                    {isChecked:false,rptName:'测试用例执行状态分布',category:'测试级,项目级,产品级,迭代级,企业级',ref:'xmTestPlanCaseExecStatusDist',desc:'按测试用例执行结果统计，通过、失败、忽略、阻塞',img:pieSimple  },
                    {isChecked:false,rptName:'测试用例执行用户分布',category:'测试级,项目级,产品级,迭代级,企业级',ref:'xmTestPlanCaseUserDist',desc:'统计测试用例负责人用例执行情况',img:bar  },
                    {isChecked:false,rptName:'缺陷回归分布',category:'测试级,项目级,产品级,迭代级,企业级',ref:'xmQuestionRetestDist',desc:'统计项目中缺陷在回归测试中分布情况，跟踪缺陷的重新打开率；',img:pieSimple  },
                    {isChecked:false,rptName:'测试次数每日统计',category:'测试级,项目级,产品级,迭代级,企业级',ref:'xmTestDayTimesCalc',desc:'统计每日测试用例执行数量',img:bar  },
                    {isChecked:false,rptName:'缺陷状态分布',category:'测试级,项目级,产品级,迭代级,企业级',ref:'xmQuestionStateDist',desc:'跟踪新提出、执行中、已解决、已关闭状态的缺陷数量按日期变化趋势，识别缺陷处理工作情况',img:pieSimple  },

                    {isChecked:false,rptName:'缺陷排行榜',category:'测试级,项目级,产品级,迭代级,企业级',ref:'xmQuestionSort',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                    {isChecked:false,rptName:'缺陷提出人排行榜',category:'测试级,项目级,产品级,迭代级,企业级',ref:'xmQuestionAskUserSort',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                    {isChecked:false,rptName:'缺陷负责人排行榜',category:'测试级,项目级,产品级,迭代级,企业级',ref:'xmQuestionHandlerUserSort',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                    {isChecked:false,rptName:'缺陷模块排行榜',category:'测试级,项目级,产品级,迭代级,企业级',ref:'xmQuestionFuncSort',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                    {isChecked:false,rptName:'缺陷需求排行榜',category:'测试级,项目级,产品级,迭代级,企业级',ref:'xmQuestionMenuSort',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                    {isChecked:false,rptName:'缺陷属性分布',category:'测试级,项目级,产品级,迭代级,企业级',ref:'xmQuestionAttDist',desc:'统计所有缺陷任意属性数量分布情况（实时数据）',img:pieSimple  },
                    {isChecked:false,rptName:'缺陷年龄分布',category:'测试级,项目级,产品级,迭代级,企业级',ref:'xmQuestionAgeDist',desc:'统计所有缺陷按照年龄的分布情况，跟踪缺陷的生命周期和响应情况',img:pieSimple  },
                    

                ],
			}//end return
		},//end data
		methods: {
			intoInfo(row) {   
                var params={...row}
                params.xmProduct=this.xmProduct
                params.xmProject=this.xmProject
                params.xmIteration=this.xmIteration 
                params.xmTestCasedb=this.xmTestCasedb
                params.category=this.filters.category 
                this.rptList.forEach(k=>k.isChecked=false)
                row.isChecked=true
                this.showRptRef=row.ref
			},
				
			onCategroySelect(){
                this.intoInfo(this.rptListCpd[0])
            }
		},//end method
		mounted() {
			/**
 			initSimpleDicts('all',['demandSource','demandLvl','demandType','priority','menuStatus'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
             */
            if(this.category){
                this.filters.category=this.category
            }else{
                if(this.xmIteration && this.xmIteration.id){
                    this.filters.category="迭代级"
                }else if(this.xmTestCasedb && this.xmTestCasedb.id){
                    this.filters.category="测试级"
                }else if(this.xmProject && this.xmProject.id){
                    this.filters.category="项目级"
                }else if(this.xmProduct && this.xmProduct.id){
                    this.filters.category="产品级"
                }else{
                    this.filters.category="企业级"
                }
            } 
            this.maxTableHeight = this.source == 'GZT' ? this.maxTableHeight : util.calcTableMaxHeight(this.$refs.table.$el); 
            
            this.intoInfo(this.rptListCpd[0])
			
		}//end mounted
	}

</script>

 

<style lang="scss" scoped>
  .moduleset {
    .dialog-title {
        font-size: 22px;
        font-weight: bold;
        color: #7D7D7D;
        height: 68px;
        p {
           line-height: 68px;
           margin-left: 28px;
        }
    }
    .toolBox {
        display: flex;
        flex-direction: column;
        .selectItem {
            display: flex;
            flex-direction: row;
            height: 70px;
            .item {
                display: flex;
                flex-direction: row;
                margin-right: 120px;
                cursor: pointer;
                margin: 25px 50px 0 20px;
                img {
                    width: 45px;
                    height: 45px;
                }
                span {
                    margin-left: 8px;
                }
            }
        }
    }

    .nav { 
        overflow: auto;
        padding:0px 10px 0 20px;
        display:flex;
        align-items:center;
        justify-content: space-between;
        flex-wrap:wrap;
        .nav_item {
            display: flex;
            height: 138px;
            flex-direction: row; 
            border: 2px solid #EDF0F9;
            box-shadow: 0px 3px 4px 0px rgba(186, 184, 184, 0.1);
            border-radius: 8px;
            align-items: center;
            position: relative;
            cursor: pointer;
            margin-top: 10px;
            width:100%;
            img {
                width: 94px;
                height: 94px;
                margin: 0 18px;
            }
            p {
                font-size: 20px;
                font-weight: bold;
                color: #7D7D7D;
                margin-bottom: 10px;
            }
            span {
                font-size: 14px;
                color: #7D7D7D;
                line-height: 26px;
            }
            i {
                position: absolute;
                top: 10px;
                right: 20px;
                font-size: 36px;
                color: #90B1F4;
            }
        }
        .itemActive {
            border: 2px solid #90B1F4;
            box-shadow: 0px 3px 4px 0px rgba(186, 184, 184, 0.1);
        }
    }
}
</style>