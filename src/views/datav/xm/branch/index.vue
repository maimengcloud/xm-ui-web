<template>
  <div id="data-view">
    <dv-full-screen-container>

      <top-header :title="'唛盟项目管理综合数据监控'"/>

      <div class="main-content">
        <digital-flop :data="digitalFlopData" :title="'汇总数据'" />

        <div class="block-left-right-content">
          <ranking-board :data="rankingBoardData" :title="'项目进度'" />

          <div class="block-top-bottom-content">
            <div class="block-top-content">
              <rose-chart :data="roseChartData" :title="'资金分布'"/>

              <water-level-chart :data="waterLevelChartData" :title="'计划资金累计完成情况'"/>

              <scroll-board  :data="scrollBoardData" :title="'动态'" :header="['时间','操作人','动作','备注']"/>
            </div>

            <cards :data="cardsData" :title="'产品'" />
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
  import { listXmBranchState  } from '@/api/xm/core/xmBranchState'; 
  import { listXmProjectState} from '@/api/xm/core/xmProjectState';
	import { listXmBranchTaskTypeState } from '@/api/xm/core/xmBranchTaskTypeState';
  import { listXmRecord } from '@/api/xm/core/xmRecord';
  import { listXmProductState } from '@/api/xm/core/xmProductState';


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
       if(!this.xmBranchState){
        return null;
      }
      var digitalFlopData = [
        {
          title: '累计金额',
          number: {
            number: [(this.floatValue(this.xmBranchState.totalBudgetNouserAmount) + this.floatValue(this.xmBranchState.totalBudgetInnerUserAmount) + this.floatValue(this.xmBranchState.totalBudgetOutUserAmount))/10000],
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
            number: [this.xmBranchState.totalTaskCnt ],
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
          title: '项目',
          number: {
            number: [this.xmBranchState.projectCnt ],
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
          title: '参与人数',
          number: {
            number: [this.xmBranchState.totalStaffCnt],
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
            number: [this.xmBranchState.productCnt],
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
            number: [this.xmBranchState.menuCnt],
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
            number: [this.xmBranchState.productCnt],
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
            number: [this.xmBranchState.testCases],
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
            number: [this.xmBranchState.iterationCnt],
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
      if( !this.xmProjectStates || this.xmProjectStates.length==0 ){
        return [];
      }
      var rankingBoardData=this.xmProjectStates.map(i=>{
        return {name:i.projectName,value:i.totalProgress+'%'}
      })
      return rankingBoardData
    },
    roseChartData(){
      var taskTypeList=this.options.taskType 
      if(this.xmBranchTaskTypeStates && this.xmBranchTaskTypeStates.length>0){
        var xmBranchTaskTypeStates=this.xmBranchTaskTypeStates.filter(i=>i.planAmount>0);
        var roseChartData=xmBranchTaskTypeStates.map(i=>{
           
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
      if(this.xmBranchState){
        var data={}
        var allAmount=this.floatValue(this.xmBranchState.totalBudgetNouserAmount) + this.floatValue(this.xmBranchState.totalBudgetInnerUserAmount) + this.floatValue(this.xmBranchState.totalBudgetOutUserAmount);
        data.finishNum= this.floatValue(this.xmBranchState.totalCostNouserAmount) + this.floatValue(this.xmBranchState.totalCostInnerUserAmount) +this.floatValue(this.xmBranchState.totalCostOutUserAmount) 
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
      if(this.xmProductStates && this.xmProductStates.length>0){
         var totalPlanWorkload=this.floatValue(this.xmBranchState.totalPlanWorkload)  
        
        return this.xmProductStates.map(i=>{
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

      xmBranchState:null,
      xmProjectStates:[],
      xmBranchTaskTypeStates:[],
      xmRecords:[],
      xmProductStates:[],
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
      
      xmProjectStatePageInfo:{//分页数据
        total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize:20,//每页数据
        count:false,//是否需要重新计算总记录数
        pageNum:1,//当前页码、从1开始计算
        orderFields:["calc_time"],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs:["desc"]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      
      
      xmProductStatePageInfo:{//分页数据
        total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize:20,//每页数据
        count:false,//是否需要重新计算总记录数
        pageNum:1,//当前页码、从1开始计算
        orderFields:["calc_time"],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs:["desc"]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
    }
  },
  methods: {
    getXmBranchState(){
      var params = {
        branchId:this.userInfo.branchId
      }
      listXmBranchState(params).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          if(res.data.data.length>0){
             this.xmBranchState=res.data.data[0]
          }
        }
      });
    },
    getXmProjectStates(){
      let params = {
					pageSize: this.xmProjectStatePageInfo.pageSize,
					pageNum: this.xmProjectStatePageInfo.pageNum,
					total: this.xmProjectStatePageInfo.total,
					count:this.xmProjectStatePageInfo.count
				};
				if(this.xmProjectStatePageInfo.orderFields!=null && this.xmProjectStatePageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.xmProjectStatePageInfo.orderFields.length;i++){ 
						orderBys.push(this.xmProjectStatePageInfo.orderFields[i]+" "+this.xmProjectStatePageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}  
      params.branchId=this.userInfo.branchId
      listXmProjectState(params).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          if(res.data.data.length>0){
             this.xmProjectStates=res.data.data
          }
        }
      });
    },
    
    getXmBranchTaskTypeStates(){
      var params = {
        branchId:this.userInfo.branchId
      }
      listXmBranchTaskTypeState(params).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          if(res.data.data.length>0){
             this.xmBranchTaskTypeStates=res.data.data
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
    //获取列表 XmProductState 功能状态表,无需前端维护，所有数据由汇总统计得出
    getXmProductStates() {
      let params = {
        pageSize: this.xmProductStatePageInfo.pageSize,
        pageNum: this.xmProductStatePageInfo.pageNum,
        total: this.xmProductStatePageInfo.total,
        count:this.xmProductStatePageInfo.count
      };
      if(this.xmProductStatePageInfo.orderFields!=null && this.xmProductStatePageInfo.orderFields.length>0){
        let orderBys=[];
        for(var i=0;i<this.xmProductStatePageInfo.orderFields.length;i++){ 
          orderBys.push(this.xmProductStatePageInfo.orderFields[i]+" "+this.xmProductStatePageInfo.orderDirs[i])
        }  
        params.orderBy= orderBys.join(",")
      } 
      params.branchId=this.userInfo.branchId
       listXmProductState(params).then((res) => {
        var tips=res.data.tips;
        if(tips.isOk){ 
          this.xmProductStatePageInfo.total = res.data.total;
          this.xmProductStatePageInfo.count=false;
          this.xmProductStates = res.data.data;
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
    this.getXmBranchState();
    this.getXmProjectStates();
    this.getXmBranchTaskTypeStates();
    this.getXmRecords();
    this.getXmProductStates();
    listOption([{categoryId:'all',itemCode:'taskType'}] ).then(res=>{
      if(res.data.tips.isOk){ 
        this.options=res.data.data
      }
    });
  }
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
