<template>
  <div id="data-view">
    <dv-full-screen-container>

      <top-header :title="xmProjectState?xmProjectState.projectName:''+'综合数据监控'"/>

      <div class="main-content">
        <digital-flop :data="digitalFlopData" :title="'汇总数据'" />

        <div class="block-left-right-content">
          <ranking-board :data="rankingBoardData" :title="'团队进度'" />

          <div class="block-top-bottom-content">
            <div class="block-top-content">
              <rose-chart :data="roseChartData" :title="'资金分布'"/>

              <water-level-chart :data="waterLevelChartData" :title="'计划资金累计完成情况'"/>

              <scroll-board  :data="scrollBoardData" :title="'动态'" :header="['时间','操作人','动作','备注']"/>
            </div>

            <cards :data="cardsData" :title="'阶段计划'" />
          </div>
        </div>
      </div>
    </dv-full-screen-container>
  </div>
</template>

<script>
import Vue from 'vue'  
import topHeader from './topHeader'
import digitalFlop from './digitalFlop'
import rankingBoard from './rankingBoard'
import roseChart from './roseChart'
import waterLevelChart from './waterLevelChart'
import scrollBoard from './scrollBoard'
import cards from './cards'
	import dataV from '@jiaminghi/data-view' 
  Vue.use(dataV)
  import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import { listXmProjectState  } from '@/api/xm/core/xmProjectState'; 
  import { listXmProjectGroupState} from '@/api/xm/core/xmProjectGroupState';
	import { listXmProjectTaskTypeState } from '@/api/xm/core/xmProjectTaskTypeState';
  import { listXmRecord } from '@/api/xm/core/xmRecord';
  import { listXmProjectPhase } from '@/api/xm/core/xmProjectPhase';


  import { mapGetters } from 'vuex'
  

export default {
  name: 'BranchDataView',
  components: {
    topHeader,
    digitalFlop,
    rankingBoard,
    roseChart,
    waterLevelChart,
    scrollBoard,
    cards
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    digitalFlopData(){
       if(!this.xmProjectState){
        return null;
      }
      var digitalFlopData = [
        {
          title: '累计金额',
          number: {
            number: [(this.floatValue(this.xmProjectState.totalBudgetNouserAmount) + this.floatValue(this.xmProjectState.totalBudgetInnerUserAmount) + this.floatValue(this.xmProjectState.totalBudgetOutUserAmount))/10000],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#40faee',
              fontWeight: 'bold'
            }
          },
          unit: '万元'
        },
        {
          title: '发布总任务数',
          number: {
            number: [this.xmProjectState.totalTaskCnt ],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '项目进度',
          number: {
            number: [this.xmProjectState.totalProgress ],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#f46827',
              fontWeight: 'bold'
            }
          },
          unit: '%'
        },
        {
          title: '参与人数',
          number: {
            number: [this.xmProjectState.totalStaffCnt],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#40faee',
              fontWeight: 'bold'
            }
          },
          unit: '人'
        },
        {
          title: '客户',
          number: {
            number: [this.xmProjectState.productCnt],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '需求',
          number: {
            number: [this.xmProjectState.menuCnt],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#f46827',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '产品',
          number: {
            number: [this.xmProjectState.productCnt],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#40faee',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '测试用例',
          number: {
            number: [this.xmProjectState.testCases],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '迭代',
          number: {
            number: [this.xmProjectState.iterationCnt],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#f46827',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        }
      ]
      return digitalFlopData;
    },
    rankingBoardData(){
      if( !this.xmProjectGroupStates || this.xmProjectGroupStates.length==0 ){
        return [];
      }
      var rankingBoardData=this.xmProjectGroupStates.map(i=>{
        return {name:i.groupName,value:i.finishRate+'%'}
      })
      return rankingBoardData
    },
    roseChartData(){
      var taskTypeList=this.options.taskType 
      if(this.xmProjectTaskTypeStates && this.xmProjectTaskTypeStates.length>0){
        var xmProjectTaskTypeStates=this.xmProjectTaskTypeStates.filter(i=>i.planAmount>0);
        var roseChartData=xmProjectTaskTypeStates.map(i=>{
           
          if(!taskTypeList || taskTypeList.length==0){
            return {
              name:i.taskType?i.taskType:'其它',
              value:i.planAmount?i.planAmount:0
            }
          }else{
            var taskTypes=taskTypeList.filter(k=>k.optionValue==i.taskType)
            if(taskTypes && taskTypes.length>0){
              var taskType=taskTypes[0]
              return {
                name:taskType.optionName,
                value:i.planAmount?i.planAmount:0
              }
            }else{
              return {
                name:i.taskType?i.taskType:'其它',
                value:i.planAmount?i.planAmount:0
              }
            }
          }
        })
        return roseChartData
      }else{
        return null;
      }
        
    },
    waterLevelChartData(){
      if(this.xmProjectState){
        var data={}
        var allAmount=this.floatValue(this.xmProjectState.totalBudgetNouserAmount) + this.floatValue(this.xmProjectState.totalBudgetInnerUserAmount) + this.floatValue(this.xmProjectState.totalBudgetOutUserAmount);
        data.finishNum= this.floatValue(this.xmProjectState.totalCostNouserAmount) + this.floatValue(this.xmProjectState.totalCostInnerUserAmount) +this.floatValue(this.xmProjectState.totalCostOutUserAmount) 
        data.finishPercent= parseFloat(data.finishNum/allAmount * 100).toFixed(0)
        return data;
     }else{
        return null;
      }
    },
    scrollBoardData(){
       if(this.xmRecords && this.xmRecords.length>0){
           var data = this.xmRecords.map(i=>{
             return [i.operTime,i.operUsername,i.action,i.remarks]
           })
           return data;
      }else{
          return null;
        }
    },
    cardsData(){
      if(this.xmProjectPhases && this.xmProjectPhases.length>0){
         var totalPlanWorkload=this.floatValue(this.xmProjectState.totalPlanWorkload)  
        
        return this.xmProjectPhases.map(i=>{
           i.totalPlanWorkload=totalPlanWorkload
           return i;
        })
      }else{
        return null;
      }
    }
    
  },
  data () {
    return {
      filters:{
        projectId:null,
      },
      xmProjectState:null,
      xmProjectGroupStates:[],
      xmProjectTaskTypeStates:[],
      xmRecords:[],
      xmProjectPhases:[],
      options:{
        taskType:[],
      },
      
      xmRecordPageInfo:{//分页数据
        total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize:20,//每页数据
        count:false,//是否需要重新计算总记录数
        pageNum:1,//当前页码、从1开始计算
        orderFields:["oper_time"],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs:["desc"]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      
      xmProjectGroupStatePageInfo:{//分页数据
        total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize:5,//每页数据
        count:false,//是否需要重新计算总记录数
        pageNum:1,//当前页码、从1开始计算
        orderFields:["calc_time"],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs:["desc"]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      
      
      xmProjectPhasePageInfo:{//分页数据
        total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize:5,//每页数据
        count:false,//是否需要重新计算总记录数
        pageNum:1,//当前页码、从1开始计算
        orderFields:["calc_time"],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs:["desc"]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
    }
  },
  methods: {
    getXmProjectState(){
      var params = {
        projectId:this.filters.projectId
      }
      listXmProjectState(params).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          if(res.data.data.length>0){
             this.xmProjectState=res.data.data[0]
          }
        }
      });
    },
    getXmProjectGroupStates(){
      let params = {
					pageSize: this.xmProjectGroupStatePageInfo.pageSize,
					pageNum: this.xmProjectGroupStatePageInfo.pageNum,
					total: this.xmProjectGroupStatePageInfo.total,
					count:this.xmProjectGroupStatePageInfo.count
				};
				if(this.xmProjectGroupStatePageInfo.orderFields!=null && this.xmProjectGroupStatePageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.xmProjectGroupStatePageInfo.orderFields.length;i++){ 
						orderBys.push(this.xmProjectGroupStatePageInfo.orderFields[i]+" "+this.xmProjectGroupStatePageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}  
      params.branchId=this.userInfo.branchId
      params.projectId=this.filters.projectId
      listXmProjectGroupState(params).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          if(res.data.data.length>0){
             this.xmProjectGroupStates=res.data.data
          }
        }
      });
    },
    
    getXmProjectTaskTypeStates(){
      var params = {
       }
      params.projectId=this.filters.projectId

      listXmProjectTaskTypeState(params).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          if(res.data.data.length>0){
             this.xmProjectTaskTypeStates=res.data.data
          }
        }
      });
    },//获取列表 XmRecord xm_record
			getXmRecords() {
				let params = {
					pageSize: this.xmRecordPageInfo.pageSize,
					pageNum: this.xmRecordPageInfo.pageNum,
					total: this.xmRecordPageInfo.total,
					count:this.xmRecordPageInfo.count
        };
        params.projectId=this.filters.projectId

				if(this.xmRecordPageInfo.orderFields!=null && this.xmRecordPageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.xmRecordPageInfo.orderFields.length;i++){ 
						orderBys.push(this.xmRecordPageInfo.orderFields[i]+" "+this.xmRecordPageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				} 
 				listXmRecord(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.xmRecordPageInfo.total = res.data.total;
						this.xmRecordPageInfo.count=false;
						this.xmRecords = res.data.data;
					}else{
 					} 
 				}) ;
      },
    //获取列表 XmProjectPhase 功能状态表,无需前端维护，所有数据由汇总统计得出
    getXmProjectPhases() {
      let params = {
        pageSize: this.xmProjectPhasePageInfo.pageSize,
        pageNum: this.xmProjectPhasePageInfo.pageNum,
        total: this.xmProjectPhasePageInfo.total,
        count:this.xmProjectPhasePageInfo.count
      };
      if(this.xmProjectPhasePageInfo.orderFields!=null && this.xmProjectPhasePageInfo.orderFields.length>0){
        let orderBys=[];
        for(var i=0;i<this.xmProjectPhasePageInfo.orderFields.length;i++){ 
          orderBys.push(this.xmProjectPhasePageInfo.orderFields[i]+" "+this.xmProjectPhasePageInfo.orderDirs[i])
        }  
        params.orderBy= orderBys.join(",")
      } 

      params.projectId=this.filters.projectId
       listXmProjectPhase(params).then((res) => {
        var tips=res.data.tips;
        if(tips.isOk){ 
          this.xmProjectPhasePageInfo.total = res.data.total;
          this.xmProjectPhasePageInfo.count=false;
          this.xmProjectPhases = res.data.data;
        }else{
         } 
       }) ;
    },
    floatValue(value){
      if(!value){
        return 0.0;
      }else{
        return value
      }
    }
  },
  mounted(){
    if(this.$route.params){
				this.filters.projectId=this.$route.params.projectId;
		}
    this.getXmProjectState();
    this.getXmProjectGroupStates();
    this.getXmProjectTaskTypeStates();
    this.getXmRecords();
    this.getXmProjectPhases();
    listOption([{categoryId:'all',itemCode:'taskType'}] ).then(res=>{
      if(res.data.tips.isOk){ 
        this.options=res.data.data
      }
    });
  }, 
}
</script>

<style lang="less">
#data-view {
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #fff;

  #dv-full-screen-container {
    background-image: url('../../../../assets/image/datav_bg.png');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .block-left-right-content {
    flex: 1;
    display: flex;
    margin-top: 20px;
  }

  .block-top-bottom-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-left: 20px;
  }

  .block-top-content {
    height: 55%;
    display: flex;
    flex-grow: 0;
    box-sizing: border-box;
    padding-bottom: 20px;
  }
}
</style>
