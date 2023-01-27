<template>
	<section class="padding">
		<el-row class="page-main "> 
            <el-select v-model="filters.category" clearable>
                <el-option v-for="(item,index) in categorys" :label="item" :value="item" :key="index"></el-option>
            </el-select>
		</el-row>
		<el-row class="padding">
			 <el-row  :style="{overflowX:'hidden',height:maxTableHeight+'px'}"  ref="table" :gutter="5">
                <el-col  v-cloak v-for="(p,i) in rptListCpd" :key="i" :xl="4" :lg="6" :md="8" :sm="12" :body-style="{ padding: '0px' }">
                    <el-card @click.native="intoInfo(p,i)" class="project-card" shadow="always" id="prj-view-box">
                        <img :src="p.img" class="image" style="width:100%;float:center;">
                        <div style="padding: 14px;">
                            <span>{{p.rptName}}</span> 
                            <div class="bottom clearfix">
                            <time class="time">{{ p.desc }}</time>
                            <el-button type="text" class="button"></el-button>
                            </div> 
                        </div>
                    </el-card>
                </el-col>
            </el-row>
		</el-row>
        <xm-iteration-burnout ref="xmIterationBurnout" :xm-iteration="xmIteration" :xm-product="xmProduct" :xm-project="xmProject"></xm-iteration-burnout>
        <xm-menu-day-trend ref="xmMenuDayTrend" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-menu-day-trend>
        <xm-menu-day-accumulate ref="xmMenuDayAccumulate" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-menu-day-accumulate>
        <xm-iteration-xm-menu-day-trend ref="xmIterationXmMenuDayTrend" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-iteration-xm-menu-day-trend>
        <xm-iteration-xm-menu-day-accumulate ref="xmIterationXmMenuDayAccumulate" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-iteration-xm-menu-day-accumulate>
        <xm-menu-att-dist ref="xmMenuAttDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-menu-att-dist>
        <xm-menu-age-dist ref="xmMenuAgeDist" :xm-product="xmProduct" :xm-project="xmProject" :xm-iteration="xmIteration"></xm-menu-age-dist>
        <xm-menu-sort ref="xmMenuSort" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-menu-sort>

        
        <xm-task-day-trend ref="xmTaskDayTrend" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-task-day-trend>
        <xm-task-day-accumulate ref="xmTaskDayAccumulate" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-task-day-accumulate>
        <xm-task-att-dist ref="xmTaskAttDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-task-att-dist>
        <xm-task-age-dist ref="xmTaskAgeDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-task-age-dist>
        <xm-task-sort ref="xmTaskSort" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-task-sort>
        <xm-project-work-item-day-list ref="xmProjectWorkItemDayList" :xm-product="xmProduct" :xm-project="xmProject" ></xm-project-work-item-day-list>
        <xm-project-workload-set-day-list ref="xmProjectWorkloadSetDayList" :xm-product="xmProduct" :xm-project="xmProject"></xm-project-workload-set-day-list>
        <xm-project-workload-set-month-list ref="xmProjectWorkloadSetMonthList" :xm-product="xmProduct" :xm-project="xmProject"></xm-project-workload-set-month-list>
        

        <xm-iteration-xm-question-day-trend ref="xmIterationXmQuestionDayTrend" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-iteration-xm-question-day-trend>
        <xm-iteration-xm-question-day-accumulate ref="xmIterationXmQuestionDayAccumulate" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-iteration-xm-question-day-accumulate>
        <xm-question-day-trend ref="xmQuestionDayTrend" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-question-day-trend>
        <xm-question-day-accumulate ref="xmQuestionDayAccumulate" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-question-day-accumulate>
        <xm-question-att-dist ref="xmQuestionAttDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-question-att-dist>
        <xm-question-state-dist ref="xmQuestionStateDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-question-state-dist>

        <xm-question-age-dist ref="xmQuestionAgeDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-question-age-dist>
        <xm-question-sort ref="xmQuestionSort" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-question-sort>
        <xm-question-ask-user-sort ref="xmQuestionAskUserSort" init-group-by="ask_userid" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-question-ask-user-sort>
        <xm-question-handler-user-sort ref="xmQuestionHandlerUserSort" init-group-by="handler_userid"  :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-question-handler-user-sort>
        <xm-question-func-sort ref="xmQuestionFuncSort" init-group-by="func_id"  :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-question-func-sort>
        <xm-question-menu-sort ref="xmQuestionMenuSort" init-group-by="menu_id"  :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-question-menu-sort>
        
        <xm-question-retest-dist ref="xmQuestionRetestDist" :xm-product="xmProduct" :xm-project="xmProject"  :xm-iteration="xmIteration"></xm-question-retest-dist>
        <xm-product-work-item-day-list ref="xmProductWorkItemDayList" :xm-product="xmProduct" :xm-project="xmProject"></xm-product-work-item-day-list>
        <xm-iteration-work-item-day-list ref="xmIterationWorkItemDayList" :xm-product="xmProduct" :xm-project="xmProject" :xm-iteration="xmIteration"></xm-iteration-work-item-day-list>
	
        <!--测试计划-->
        <xm-test-plan-case-exec-status-dist ref="xmTestPlanCaseExecStatusDist" :xm-product="xmProduct" :xm-project="xmProject" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan"></xm-test-plan-case-exec-status-dist> 
        <xm-test-plan-case-user-dist ref="xmTestPlanCaseUserDist" :xm-product="xmProduct" :xm-project="xmProject" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan"></xm-test-plan-case-user-dist>


    </section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	
    import xmIterationBurnout from './iteration/burnout'
    import xmMenuDayTrend from './product/menuDayTrend'
    import xmMenuDayAccumulate from './product/menuDayAccumulate'
    import xmIterationXmMenuDayTrend from './iteration/menuDayTrend'
    import xmIterationXmMenuDayAccumulate from './iteration/menuDayAccumulate'
	import xmMenuAttDist from './product/menuAttDist'
	import xmMenuAgeDist from './product/menuAgeDist'
	import xmMenuSort from './product/menuSort'
	import xmProductWorkItemDayList from './product/productWorkItemDayList'
	import xmIterationWorkItemDayList from './iteration/iterationWorkItemDayList'


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
    import xmIterationXmQuestionDayTrend from './iteration/questionDayTrend'
    import xmIterationXmQuestionDayAccumulate from './iteration/questionDayAccumulate'
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
    
    import pieSimple from './images/pie-simple.png'
    import lineStack from './images/line-stack.png'
    import areaStack from './images/area-stack.png'
    import ranjintu from './images/ranjintu.png'
    import datasetLink from './images/dataset-link.png'
    import bar from './images/bar.png'
    
	export default { 
        
		components: {   
            xmIterationBurnout,xmMenuDayTrend,xmMenuDayAccumulate,xmMenuAttDist,xmMenuAgeDist,xmMenuSort,xmProductWorkItemDayList,xmTaskDayTrend,xmTaskDayAccumulate,xmTaskAttDist,xmTaskAgeDist,xmTaskSort,xmProjectWorkItemDayList,xmProjectWorkloadSetDayList,xmProjectWorkloadSetMonthList,xmQuestionDayTrend,xmQuestionDayAccumulate,xmQuestionAttDist,xmQuestionAgeDist,xmQuestionSort,
            xmIterationXmMenuDayTrend,xmIterationXmMenuDayAccumulate,xmIterationWorkItemDayList,xmIterationXmQuestionDayTrend,xmIterationXmQuestionDayAccumulate,
            
            xmTestPlanCaseExecStatusDist,xmTestPlanCaseUserDist,xmQuestionRetestDist,xmQuestionStateDist,
            xmQuestionAskUserSort,xmQuestionHandlerUserSort,xmQuestionFuncSort,xmQuestionMenuSort,
        
        },
        props:['xmProduct','xmIteration','xmProject','xmTestCasedb','xmTestPlan'],
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
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300,
                rptList:[/**{name:'报表名称',category:'报表分类，组织级、产品级、项目级、迭代级、需求、测试、任务',path:'路由路径',imgUrl:'图片路径',query:{参数}} */
                    //迭代报表
                    {rptName:'迭代燃尽图',category:'迭代级',ref:'xmIterationBurnout',desc:'跟踪迭代的剩余工作量按日期变化趋势，识别迭代当前进度情况',img:ranjintu },
                    {rptName:'需求每日趋势',category:'迭代级',ref:'xmIterationXmMenuDayTrend',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期变化趋势，识别需求工作情况',img:lineStack  },
                    {rptName:'需求每日累积',category:'迭代级',ref:'xmIterationXmMenuDayAccumulate',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期累积情况，识别需求工作的瓶颈',img:areaStack  },
                    {rptName:'迭代工作项每日趋势',category:'迭代级',ref:'xmIterationWorkItemDayList',desc:'统计迭代每日工作项数量分布情况',img:datasetLink  },  
        
                    //产品报表
                    {rptName:'需求每日趋势',category:'产品级',ref:'xmMenuDayTrend',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期变化趋势，识别需求工作情况',img:lineStack  },
                    {rptName:'需求每日累积',category:'产品级',ref:'xmMenuDayAccumulate',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期累积情况，识别需求工作的瓶颈',img:areaStack  },
                    {rptName:'需求属性分布',category:'产品级,迭代级',ref:'xmMenuAttDist',desc:'统计所有需求任意属性数量分布情况（实时数据）',img:pieSimple  },
                    {rptName:'需求年龄分布',category:'产品级,迭代级',ref:'xmMenuAgeDist',desc:'统计所有需求年龄分布情况（实时数据）',img:pieSimple  },
                    {rptName:'需求排行榜',category:'产品级,迭代级',ref:'xmMenuSort',desc:'需求提出人、负责人的用户故事数量排行（实时数据）',img:bar  },
                    {rptName:'产品工作项每日趋势',category:'产品级',ref:'xmProductWorkItemDayList',desc:'统计产品每日工作项数量分布情况',img:datasetLink  },  

                    //项目报表
                    {rptName:'任务每日趋势',category:'项目级',ref:'xmTaskDayTrend',desc:'跟踪未开始、执行中、已完成、已关闭状态的任务数量按日期变化趋势，识别任务工作情况',img:lineStack  },
                    {rptName:'任务每日累积',category:'项目级',ref:'xmTaskDayAccumulate',desc:'跟踪未开始、执行中、已完成、已关闭状态的任务数量按日期累积情况，识别任务工作的瓶颈',img:areaStack  },
                    {rptName:'任务属性分布',category:'项目级',ref:'xmTaskAttDist',desc:'统计所有任务任意属性数量分布情况（实时数据）',img:pieSimple  },
                    {rptName:'任务年龄分布',category:'项目级',ref:'xmTaskAgeDist',desc:'统计所有任务年龄分布情况（实时数据）',img:pieSimple  },
                    {rptName:'任务排行榜',category:'项目级',ref:'xmTaskSort',desc:'任务提出人、负责人的用户故事数量排行（实时数据）',img:bar  },
                    {rptName:'项目工作项每日趋势',category:'项目级',ref:'xmProjectWorkItemDayList',desc:'统计项目每日工作项数量分布情况',img:datasetLink  },
                    {rptName:'项目结算工时每日趋势',category:'项目级',ref:'xmProjectWorkloadSetDayList',desc:'统计项目每日登记工时、结算工时数量分布情况',img:datasetLink  },
                    {rptName:'项目结算工时每月趋势',category:'项目级',ref:'xmProjectWorkloadSetMonthList',desc:'统计项目每月登记工时、结算工时数量分布情况',img:datasetLink  },

                    //测试计划报表
                    {rptName:'缺陷排行榜',category:'测试计划级,项目级,产品级,迭代级',ref:'xmQuestionSort',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                    {rptName:'缺陷提出人排行榜',category:'测试计划级,项目级,产品级,迭代级',ref:'xmQuestionAskUserSort',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                    {rptName:'缺陷负责人排行榜',category:'测试计划级,项目级,产品级,迭代级',ref:'xmQuestionHandlerUserSort',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                    {rptName:'缺陷模块排行榜',category:'测试计划级,项目级,产品级,迭代级',ref:'xmQuestionFuncSort',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                    {rptName:'缺陷需求排行榜',category:'测试计划级,项目级,产品级,迭代级',ref:'xmQuestionMenuSort',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },

                    {rptName:'测试用例执行状态分布',category:'测试计划级,项目级,产品级,迭代级',ref:'xmTestPlanCaseExecStatusDist',desc:'按测试用例执行结果统计，通过、失败、忽略、阻塞',img:pieSimple  },
                    
                    {rptName:'测试用例执行用户分布',category:'测试计划级,项目级,产品级,迭代级',ref:'xmTestPlanCaseUserDist',desc:'统计测试用例负责人用例执行情况',img:bar  },
                    {rptName:'缺陷回归分布',category:'测试计划级,项目级,产品级,迭代级',ref:'xmQuestionRetestDist',desc:'统计项目中缺陷在回归测试中分布情况，跟踪缺陷的重新打开率；',img:pieSimple  },
                    {rptName:'测试次数每日统计',category:'测试计划级,项目级,产品级,迭代级',ref:'xmTestDayTimesCalc',desc:'跟踪新提出、执行中、已解决、已关闭状态的缺陷数量按日期变化趋势，识别缺陷处理工作情况',img:lineStack  },
                    {rptName:'缺陷状态分布',category:'测试计划级,项目级,产品级,迭代级',ref:'xmQuestionStateDist',desc:'跟踪新提出、执行中、已解决、已关闭状态的缺陷数量按日期变化趋势，识别缺陷处理工作情况',img:pieSimple  },

                    {rptName:'缺陷每日趋势',category:'测试计划级,项目级,产品级,迭代级',ref:'xmQuestionDayTrend',desc:'跟踪新提出、执行中、已解决、已关闭状态的缺陷数量按日期变化趋势，识别缺陷处理工作情况',img:lineStack  },
                    {rptName:'缺陷每日累积',category:'测试计划级,项目级,产品级,迭代级',ref:'xmQuestionDayAccumulate',desc:'跟踪一段时间内，各种程度和类别的缺陷累积情况，监控缺陷的变化趋势',img:areaStack  },
                    {rptName:'缺陷属性分布',category:'测试计划级,项目级,产品级,迭代级',ref:'xmQuestionAttDist',desc:'统计所有缺陷任意属性数量分布情况（实时数据）',img:pieSimple  },
                    {rptName:'缺陷年龄分布',category:'测试计划级,项目级,产品级,迭代级',ref:'xmQuestionAgeDist',desc:'统计所有缺陷按照年龄的分布情况，跟踪缺陷的生命周期和响应情况',img:pieSimple  },

                    
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
                this.$refs[row.ref].open(params);
			},
				
			
		},//end method
		mounted() {
			/**
 			initSimpleDicts('all',['demandSource','demandLvl','demandType','priority','menuStatus'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
             */
            if(this.xmIteration && this.xmIteration.id){
                this.filters.category="迭代级"
            }else if(this.xmTestCasedb && this.xmTestCasedb.id){
                this.filters.category="测试计划级"
            }else if(this.xmProject && this.xmProject.id){
                this.filters.category="项目级"
            }else if(this.xmProduct && this.xmProduct.id){
                this.filters.category="产品级"
            }
            this.maxTableHeight = this.source == 'GZT' ? this.maxTableHeight : util.calcTableMaxHeight(this.$refs.table.$el); 
			
		}//end mounted
	}

</script>

<style scoped> 
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
    height: 30px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {  
    object-fit:cover;
    width: 100%;    
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>