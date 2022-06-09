<template>
  <div id="index" ref="appRef">
      <div class="bg">
        <dv-loading v-if="loading">加载中</dv-loading>
        <div v-else class="host-body">
          <!-- 第一行 -->
          <div class="row_1">
            <dv-decoration-10 class="dv-dec-10" />
            <div class="middle">
              <dv-decoration-8 class="dv-dec-8" :color="['#568aea', '#000000']" />
              <div class="title">
                <span class="title-text">项目综合数据监控</span>
                <dv-decoration-6 class="dv-dec-6" :reverse="true" :color="['#50e3c2', '#67a1e5']"></dv-decoration-6>
              </div>
              <dv-decoration-8 class="dv-dec-8" :reverse="true" :color="['#568aea', '#000000']" />
            </div>
            <dv-decoration-10 class="dv-dec-10-s" />
          </div>

          <!-- 第二行 -->
          <div class="row_2">
            <digital-flop />
          </div>

          <!-- 第三行 -->
          <div class="row_3">
            <div class="left">
              <ranking-board :data="rankingBoardData" :title="'团队进度'" />
            </div>
            <div class="right">
              <div class="r_top">
                <div class="top_1">
                  <rose-chart :data="roseChartData" :title="'资金分布'"/>
                </div>
                <div class="top_2">
                  <water-level-chart :data="waterLevelChartData" :title="'计划资金累计完成情况'"/>
                </div>
                <div class="top_3">
                  <scroll-board  :data="scrollBoardData" :title="'动态'" :header="['时间','操作人','动作','备注']"/>
                </div>
              </div>
              <div class="r_bottom">
                <cards :data="cardsData" :title="'阶段计划'" />
              </div>
            </div>
          </div>
        
        </div>
      </div>
  </div>
</template>

<script> 
import digitalFlop from './digitalFlop';
import drawMixin from "../utils/drawMixin";
import rankingBoard from './rankingBoard'
import roseChart from './roseChart'
import waterLevelChart from './waterLevelChart'
import scrollBoard from './scrollBoard'
import cards from './cards'
import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import { listXmProjectState  } from '@/api/xm/core/xmProjectState'; 
import { listXmGroupState} from '@/api/xm/core/xmGroupState';
import { listXmProjectTaskTypeState } from '@/api/xm/core/xmProjectTaskTypeState';
import { listXmRecord } from '@/api/xm/core/xmRecord'; 
import { mapGetters } from 'vuex'

import Vue from 'vue' 
import dataV from '@jiaminghi/data-view' 
Vue.use(dataV)

export default {
  mixins: [ drawMixin ],
  components: {digitalFlop, rankingBoard, roseChart, waterLevelChart, scrollBoard, cards},
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
            number: [(this.floatValue(this.xmProjectState.totalBudgetNouserAmount) + this.floatValue(this.xmProjectState.totalBudgetIuserAmount) + this.floatValue(this.xmProjectState.totalBudgetOuserAmount))/10000],
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
      if( !this.xmGroupStates || this.xmGroupStates.length==0 ){
        return [];
      }
      var rankingBoardData=this.xmGroupStates.map(i=>{
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
        var allAmount=this.floatValue(this.xmProjectState.totalBudgetNouserAmount) + this.floatValue(this.xmProjectState.totalBudgetIuserAmount) + this.floatValue(this.xmProjectState.totalBudgetOuserAmount);
        data.finishNum= this.floatValue(this.xmProjectState.totalCostNouserAmount) + this.floatValue(this.xmProjectState.totalCostIuserAmount) +this.floatValue(this.xmProjectState.totalCostOuserAmount) 
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
      if(this.xmPhases && this.xmPhases.length>0){
         var totalPlanWorkload=this.floatValue(this.xmProjectState.totalPlanWorkload)  
        return this.xmPhases.map(i=>{
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
      loading: true,
      filters:{
        projectId:null,
      },
      xmProjectState:null,
      xmGroupStates:[],
      xmProjectTaskTypeStates:[],
      xmRecords:[],
      xmPhases:[],
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
      
      xmGroupStatePageInfo:{//分页数据
        total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize:5,//每页数据
        count:false,//是否需要重新计算总记录数
        pageNum:1,//当前页码、从1开始计算
        orderFields:["calc_time"],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs:["desc"]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      
      
      xmPhasePageInfo:{//分页数据
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
          setTimeout(() => {
            this.loading = false;
          }, 100);
        }
      });
    },
    getXmGroupStates(){
      let params = {
					pageSize: this.xmGroupStatePageInfo.pageSize,
					pageNum: this.xmGroupStatePageInfo.pageNum,
					total: this.xmGroupStatePageInfo.total,
					count:this.xmGroupStatePageInfo.count
				};
				if(this.xmGroupStatePageInfo.orderFields!=null && this.xmGroupStatePageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.xmGroupStatePageInfo.orderFields.length;i++){ 
						orderBys.push(this.xmGroupStatePageInfo.orderFields[i]+" "+this.xmGroupStatePageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}  
      params.branchId=this.userInfo.branchId
      params.projectId=this.filters.projectId
      listXmGroupState(params).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          if(res.data.data.length>0){
             this.xmGroupStates=res.data.data
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
    //获取列表 XmPhase 功能状态表,无需前端维护，所有数据由汇总统计得出
    getXmPhases() {
       
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
    if(this.$route.query && this.$route.query.projectId){
				this.filters.projectId=this.$route.query.projectId;
		}else{
      return;
    }

    this.getXmProjectState();
    this.getXmGroupStates();
    this.getXmProjectTaskTypeStates();
    this.getXmRecords();
    this.getXmPhases();

    listOption([{categoryId:'all',itemCode:'taskType'}] ).then(res=>{
      if(res.data.tips.isOk){ 
        this.options=res.data.data
      }
    });
  }, 
}
</script>

<style lang="less">
@import './index.less';
</style>