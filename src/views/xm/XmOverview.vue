<template>
  <section>
    <el-row class="padding" ref="table">
      <el-row class="row_1" style="margin-bottom:20px;">
        <div class="r r1">
          <span style="color: #4779F6">{{formatNum(xmBranch.projectCnt,0) || 0}}</span>
          <p>项目数</p>
        </div>
        <div class="r r2">
          <span style="color: #4779F6">{{formatNum(xmBranch.budgetWorkload,0) || 0}}</span>
          <p>项目总工时</p>
        </div>
        <div class="r r3">
          <span style="color: #F6AE47">{{formatNum(xmBranch.productCnt,0) || 0}}</span>
          <p>产品数</p>
        </div>
        <div class="r r4">
          <span style="color: #F6AE47">{{formatNum(xmBranch.productBudgetWorkload,0) || 0}}</span>
          <p>产品总工时</p>
        </div>
        <div class="r r5">
          <span style="color: #47CBF6">{{formatNum(xmBranch.phaseCnt,0) || 0}}</span>
          <p>计划数</p>
        </div>
        <div class="r r6">
          <span style="color: #47CBF6">{{formatNum(xmBranch.iterationCnt,0) || 0}}</span>
          <p>迭代数</p>
        </div>
        <div class="r r7">
          <span style="color: #F68D47">{{formatNum(xmBranch.planWorkerCnt,0) || 0}}</span>
          <p>总人数</p>
        </div>
        <div class="r r8">
          <span style="color: #7D7D7D">{{formatNum(xmBranch.taskCnt,0) || 0}}</span>
          <p>任务数</p>
        </div>
        <div class="r r9">
          <span style="color: #7D7D7D">{{formatNum(xmBranch.menuCnt,0) || 0}}</span>
          <p>需求数</p>
        </div>
      </el-row>
      <el-row :gutter="10" style="margin-bottom:10px">
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header">
                <span>企业</span>&nbsp;<span><b>{{userInfo.branchName}}</b></span>

                <el-popover
                  placement="bottom"
                  title="标题"
                  width="200"
                  trigger="click" >

                  <el-row>
                    <el-button type="primary" @click="loadProjectStateToXmBranchState" v-loading="load.calcProduct">计算企业汇总数据</el-button>
                    <br>
                      <font color="blue" style="font-size:10px;">将从项目任务及企业任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到企业统计表</font>
                  </el-row>

                  <el-button slot="reference" circle plain style="float:right;" icon="el-icon-video-play" type="text"></el-button>
                </el-popover>

              </div> 
              <el-row>
                <el-col :span="8">
                  <div class="item">
                    <div class="icon1" style="background-color:  rgb(79, 140, 255);">
                      <i class="el-icon-right"></i>
                    </div>
                    <div class="info">
                      <div v-text="totalTask"></div>
                      <div class="title">总任务量</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="item">
                    <div class="icon1" style="background-color:  rgb(255, 153, 51);">
                      <i class="el-icon-loading"></i>
                    </div>
                    <div class="info">
                      <div v-text="notStart">
                      </div>
                      <div class="title">待完成</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="item">
                    <div class="icon1" style="background-color:  rgb(0, 153, 51);">
                      <i class="el-icon-check"></i>
                    </div>
                    <div class="info">
                      <div v-text="competeTasks" >
                      </div>
                      <div class="title">已完成</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-date"></i>
                  </div>
                  <div class="info">
                    <div v-text="xmBranch.calcTime">
                    </div>
                    <div class="title">企业数据更新日期</div>
                  </div>
                </div>
              </el-row>
              <el-row>
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-star-off"></i>
                  </div>
                  <div class="info">
                    <div class="title"> 需求数： {{this.xmBranch.menuCnt||0}}</div>
                  </div>
                </div>
              </el-row>
              <el-row>
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-alarm-clock"></i>
                  </div>
                  <div>
                    <div class="progress-item">
                      <el-progress :percentage="realProgress">
                      </el-progress>

                      <el-tag v-if="planProgress>realProgress" type="danger" effect="dark">整体进度 落后{{ planProgress-realProgress }}%</el-tag>
                          <el-tag v-else-if="planProgress<realProgress" type="warning" effect="dark">整体进度 超前{{ realProgress-planProgress }}%</el-tag>
                          <el-tag v-else effect="dark" type="success">整体进度 理想</el-tag>
                      <div class="title">
                      </div>
                    </div>
                  </div>
                </div>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span>总预算情况</span>
              </div>
              <div>
                <div id="planTotalCostPie" :style="{width: '100%', height: '320px'}"></div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span>产品、项目、迭代个数统计</span>
              </div>
              <div>
                <div id="iterationAndProduct" :style="{width: '100%', height: '350px'}"></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-bottom:10px">
          <el-col :span="16" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header" class="clearfix">
                <span>企业工时</span>
              </div>
              <div>
                <el-row  >
                  <div class="item">
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.xmBranch.budgetWorkload"></span>
                          <span style="font-size:5px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">总估工时</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.xmBranch.estimateWorkload"></span>
                          <span style="font-size:5px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">应完成工时</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.xmBranch.actWorkload"></span>
                          <span style="font-size:5px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:5px;" title="已登记的工时">已完成工时</div>
                      </div>
                    </el-col>
                  </div>
                </el-row>
                <el-row  >
                  <div class="item">
                    <el-col :span="8">
                      <div title="总估工时-已完成工时">
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="remainWorkload"></span>
                          <span style="font-size:5px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">剩余工时</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div title="已完成工时-当前应完成工时">
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="deviation"></span>
                          <span style="font-size:5px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">预估偏差</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div title="（已完成工时-当前应完成工时）/ 当前应完成工时">
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="deviationRate"></span>
                          <span style="font-size:5px;">%</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">预估偏差率</div>
                      </div>
                    </el-col>
                  </div>
                </el-row>
                <el-row>
                  <span style="margin-left:20px;" title="应完成工时/总预估工时">预计进度</span>
                  <el-progress style="width: 90%;margin-left:20px;margin-top: 10px;margin-bottom: 20px;"   :stroke-width="14" :percentage="planProgress"></el-progress>
                </el-row>
                <el-row>
                  <span style="margin-left:20px;" title="实际工时/总预估工时">实际进度</span>
                  <el-progress style="width: 90%;margin-left:20px;margin-top: 10px;"  color="#47CBF6" :stroke-width="14" :percentage="realProgress"></el-progress>
                </el-row>

              </div>
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span>合作开发工作量分布</span>
              </div>
              <div>
                <div id="workloadDistribution" :style="{width: '100%', height: '320px'}"></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-bottom:10px">
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span>所有工作项数量分布</span>
              </div>
              <div>
                <div id="allChart" :style="{width: '100%', height: '350px'}"></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span>需求情况</span>
              </div>
              <div>
                <div id="menuChart" :style="{width: '100%', height: '320px'}"></div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header" class="clearfix">
                <span>任务状态分布</span>
              </div>
              <div>
                <div id="taskChart" :style="{width: '100%', height: '350px'}"></div>
              </div>
            </el-card>
          </el-col>

        </el-row>
        <el-row :gutter="10" style="margin-bottom:10px">
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span>测试用例情况</span>
              </div>
              <div>
                <div id="testCasePieChart" :style="{width: '100%', height: '320px'}"></div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span>缺陷情况</span>
              </div>
              <div>
                <div id="bugPieChart" :style="{width: '100%', height: '320px'}"></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
import { mapGetters } from "vuex";
import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmBranchState} from '@/api/xm/core/xmBranchState';
import { loadTasksToXmMenuState} from '@/api/xm/core/xmMenuState';
  import {  loadProjectStateToXmBranchState} from '@/api/xm/core/xmBranchState';
  import store from '@/store'
export default {
  computed: {
    ...mapGetters(["userInfo"]),
    competeTasks: function (){
      return this.xmBranch.taskCnt||0-this.xmBranch.taskUnstartCnt||0-this.xmBranch.taskExecCnt||0;
    },
    notStart: function() {
      return  this.xmBranch.taskUnstartCnt||0+this.xmBranch.taskExecCnt||0;
    },
    totalTask: function() {
      return this.xmBranch.taskCnt||0;
    },
    taskStartTime: function (){
      return this.xmBranch.startTime?this.xmBranch.startTime.substring(0,10):'';
    },
    taskEndTime: function (){
      return this.xmBranch.endTime?this.xmBranch.endTime.substring(0,10):'';
    },
    pmUsername: function (){
      return this.xmBranch.pmUsername;
    },
    workloadProgress:function (){
      if(!this.xmBranch.actWorkload||!this.xmBranch.budgetWorkload){
        return 0;
      }
      return Math.round(this.xmBranch.actWorkload/this.xmBranch.budgetWorkload*100);
    },
    deviation:function (){

        return  Math.round(this.xmBranch.actWorkload||0-this.xmBranch.estimateWorkload||0)

    },
    deviationRate:function (){
      if(!this.xmBranch.estimateWorkload||!this.deviation){
        return 0
      }
      return Math.round(this.deviation/this.xmBranch.estimateWorkload*100);
    },
    remainWorkload:function (){
      return Math.round(this.xmBranch.budgetWorkload||0 - this.xmBranch.actWorkload||0);
    },
    planProgress:function (){
      if(!this.xmBranch.estimateWorkload||!this.xmBranch.budgetWorkload){
        return 0;
      }
        return Math.round(this.xmBranch.estimateWorkload/this.xmBranch.budgetWorkload*100);
    },
    realProgress:function (){
      if(!this.xmBranch.actWorkload||!this.xmBranch.budgetWorkload){
        return 0;
      }
      if(this.xmBranch.actWorkload < this.xmBranch.budgetWorkload){
        return Math.round(this.xmBranch.actWorkload/this.xmBranch.budgetWorkload*100)
      }else{
        return 100;
      }
    },
    xmBranchStateCpd(){
      return this.xmBranch
    },

  },

   watch:{
    xmBranchStateCpd:function(){
      this.drawAllBar();
      this.drawTask();
      this.drawTestCasePie();
      this.drawPieBug();
      this.drawCostPie();
      this.drawWorkload();
      this.drawIterationProduct();
    }
  },
  data() {
    return {
      xmBranch:{},
      load:{list:false,add:false,calcProject:false,calcSettle:false},
      isActive: true,
      maxTableHeight:300,
      dicts:{
        xmBranchPstatus:[]
      },//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
    };
  },

  methods:{
    drawAllBar() {
      // 基于准备好的dom，初始化echarts实例
      let allChart = this.$echarts.init(document.getElementById("allChart"));
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: ['需求', '任务','用例', '缺陷']
        },
        series: [
          {
            label: {
              normal:{
                show: true,
                position: 'top',
                color:'#000000',
              }
            },
            data: [
              {
                value: this.xmBranch.menuCnt,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                }
              },
              {
                value: this.xmBranch.taskCnt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                }
              },
              {
                value: this.xmBranch.testCases,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
                  }
                }
              },
              {
                value: this.xmBranch.bugCnt,
                itemStyle: {
                  normal:{
                    color: '#EE6666'
                  }
                }
              },
            ],
            type: 'bar'
          }
        ]
      };

      // 绘制图表
      allChart.setOption(option);
    },

    drawMenuPie() {
      let taskChart = this.$echarts.init(document.getElementById("menuChart"));
      let option = {
						title: {
							left: 'center'
						},
						tooltip: {
							trigger: 'item',

						},
						calculable: true,

						legend:{
              show:true,
							bottom: 'bottom',
							data:['打开','执行中','已完成','已关闭'],
						},
						graphic: {
							type: 'text',
							left: 'center',
              top: '40%',
							style: {
							// text: '总数',
							text:
								'需求数'+this.xmBranch.menuCnt,

							textAlign: 'center',
							fill: '#333',
							width: 30,
							height: 30,
							fontSize: 14
							}
						},

						series: [
							{
							type: 'pie',
              center:['50%','40%'],
							radius: ['35%','60%'],
							data:[{name:'打开',value:this.xmBranch.menuUnstartCnt},{name:'执行中',value:this.xmBranch.menuExecCnt},{name:'已完成',value:this.xmBranch.menuFinishCnt},{name:'已关闭',value:this.xmBranch.menuCloseCnt}],
							emphasis: {
								itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},

							label: {
								show: true,
								formatter:'{b}: {c}  ({d}%)'
							},
							}
						]
      };

      // 绘制图表
      taskChart.setOption(option);
    },

    drawTestCasePie() {
      let taskChart = this.$echarts.init(document.getElementById("testCasePieChart"));
      let option = {
						title: {
							left: 'center'
						},
						tooltip: {
							trigger: 'item',

						},
						calculable: true,

						legend:{
              show:true,
							bottom: 'bottom',
							data:['设计中','执行中','已完成'],
						},
						graphic: {
							type: 'text',
							left: 'center',
              top: '40%',
							style: {
							// text: '总数',
							text:
								'用例数'+this.xmBranch.testCases,

							textAlign: 'center',
							fill: '#333',
							width: 30,
							height: 30,
							fontSize: 14
							}
						},

						series: [
							{
							type: 'pie',
              center:['50%','40%'],
							radius: ['35%','60%'],
							data:[{name:'设计中',value:this.xmBranch.designCases},{name:'执行中',value:this.xmBranch.execCases},{name:'已完成',value:this.xmBranch.finishCases}],
							emphasis: {
								itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},

							label: {
								show: true,
								formatter:'{b}: {c}  ({d}%)'
							},
							}
						]
      };

      // 绘制图表
      taskChart.setOption(option);
    },
    drawTask() {
      let taskChart = this.$echarts.init(document.getElementById("taskChart"));
      let option = {
						title: {
							left: 'center'
						},
						tooltip: {
							trigger: 'item',

						},
						calculable: true,

            grid: {
              left: '3%',
              right: '4%',
              bottom: '10%',
              containLabel: true
            },
            yAxis: {
              type: 'value'
            },
            xAxis: {
              type: 'category',
							data:['未开始','执行中','已完工','已结算','已关闭'],
            },
						series: [
							{
              label: {
                normal:{
                  show: true,
                  position: 'top',
                  color:'#000000',
                }
              },
							type: 'bar',
              center:['50%','40%'],

							data:[
                {name:'未开始',value:this.xmBranch.taskUnstartCnt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                }
                },
                {name:'执行中',value:this.xmBranch.taskExecCnt,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                }},
                {name:'已完工',value:this.xmBranch.taskFinishCnt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                }},
                {name:'已结算',value:this.xmBranch.taskSetCnt,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
                  }
                }},
                {name:'已关闭',value:this.xmBranch.taskCloseCnt,
                itemStyle: {
                  normal:{
                    color: '#EE6666'
                  }
                }}],
							}
						]
      };

      // 绘制图表
      taskChart.setOption(option);
    },
    drawPieBug() {
      let bugPieChart = this.$echarts.init(document.getElementById("bugPieChart"));
      let option = {
        title: {
							left: 'center'
						},
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          show:true,
					bottom: 'bottom',
          data:['已激活','已确认','已解决','已关闭']
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
          // text: '总数',
          text:
            '缺陷数'+this.xmBranch.bugCnt,

          textAlign: 'center',
          fill: '#333',
          width: 30,
          height: 30,
          fontSize: 14
          }
        },
        series: [
          {

            type: 'pie',
            center:['50%','40%'],
            radius: ['35%','60%'],
            label:{
								show: true,
								formatter:'{b}: {c}  ({d}%)'
            },
            data: [
              {value: this.xmBranch.activeBugs,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                },
                name: '已激活'},
              {value: this.xmBranch.confirmedBugs,
                itemStyle: {
                  normal:{
                    color: '#EE6666'
                  }
                },
                name: '已确认'},
              {value: this.xmBranch.resolvedBugs,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                },
                name: '已解决'},
              {value: this.xmBranch.closedBugs,
                itemStyle: {
                  normal:{
                    color: '#5470C6'
                  }
                },
                name: '已关闭'},
            ],
          }
        ]
      };

      // 绘制图表
      bugPieChart.setOption(option);
    },
    drawCostPie() {
      let planTotalCostPie = this.$echarts.init(document.getElementById("planTotalCostPie"));
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
        },
        series: [
          {
            center:['55%','40%'],//饼图位置
            type: 'pie',
            radius: '50%',//饼图半径大小
            label:{            //饼图图形上的文本标签
              normal:{
                show:true,
                position:'outer', //标签的位置:外部
                textStyle : {
                  fontWeight : 100 ,
                  fontSize: document.body.clientWidth / 120, //标签字体大小
                  color: "#000000"
                },
                formatter:'{b}\n{c}({d}%)',//b：name,c:value,d:占比
                alignTo:'edge',
                margin:10
              }
            },
            data: [
              {value: this.xmBranch.budgetNouserAt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                },
                name: '非人力'},
              {value: this.xmBranch.budgetIuserAt,
                itemStyle: {
                  normal:{
                    color: '#73C0DE'
                  }
                },
                name: '内部人力'},
              {value: this.xmBranch.budgetOuserAt,
                itemStyle: {
                  normal:{
                    color: '#5470C6'
                  }
                },
                name: '外购人力'},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      // 绘制图表
      planTotalCostPie.setOption(option);
    },
    drawWorkload() {
      let workloadDistribution = this.$echarts.init(document.getElementById("workloadDistribution"));
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} :<br/> {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
          // text: '总数',
          text:
            '总工时:'+this.xmBranch.budgetWorkload,

          textAlign: 'center',
          fill: '#333',
          width: 30,
          height: 30,
          fontSize: 14
          }
        },
        series: [
          {
            type: 'pie',
            center:['50%','40%'],
            radius: ['35%','60%'],
            label:{            //饼图图形上的文本标签
              normal:{
                show:true,
                position:'outer', //标签的位置:外部
                textStyle : {
                  fontWeight : 100 ,
                  fontSize: document.body.clientWidth / 120, //标签字体大小
                  color: "#000000"
                },
                formatter:'{b}\n{c}({d}%)',//b：name,c:value,d:占比
                alignTo:'edge',
                margin:10
              }
            },

            data: [
              {value: this.xmBranch.budgetIuserWorkload,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                },
                name: '内部人力'},
              {value: this.xmBranch.budgetOuserWorkload,
                itemStyle: {
                  normal:{
                    color: '#3BA272'
                  }
                },
                name: '外购人力'},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      // 绘制图表
      workloadDistribution.setOption(option);
    },
    drawIterationProduct() {
      let iterationAndProduct = this.$echarts.init(document.getElementById("iterationAndProduct"));
      let option = {
        tooltip: {
          trigger: 'axis',
          formatter: '{b} : {c}',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        xAxis: {
          type: 'category',
          data: ['产品数','项目数', '迭代数']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
            label: {
              normal:{
                show: true,
                position: 'top',
                color:'#000000',
              }
            },

          data: [
            {
                value: this.xmBranch.productCnt,
                itemStyle: {
                  normal:{
                    color: '#3BA272'
                  }
                }
              },
            {
                value: this.xmBranch.projectCnt,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                }
              },
              {
                value: this.xmBranch.iterationCnt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                }
              },

        ],
          type: 'bar',
        }]
      };

      // 绘制图表
      iterationAndProduct.setOption(option);
    },


    loadProjectStateToXmBranchState(){
        var row=this.xmBranch;
        var params={id:row.id}
        this.load.calcProject=true;
      loadProjectStateToXmBranchState(params).then((res1) => {
          this.load.calcProject=false;
          this.load.list=true;
          listXmBranchState({id:row.id}).then(res=>{
            this.load.list=false;
            var tips = res.data.tips;
            if(tips.isOk){
              this.xmBranch=res.data.data[0]
            }
            this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
          })

        }).catch( err  => this.load.calcProject=false );
    },
    loadTasksToXmMenuState(){
        var row=this.xmBranch;
        var params={productId:row.id}
      loadTasksToXmMenuState(params).then((res) => {
          this.load.calcProject=false;
          var tips=res.data.tips;
          this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
        }).catch( err  => this.load.calcProject=false );
    },


    formatNum(num,defVal){
      if(num){
       return parseInt(num)
      }else{
        return defVal
      }
    },
  },

  mounted() {

    listXmBranchState({id:this.userInfo.branchId}).then(res=>{
            this.load.list=false;
            var tips = res.data.tips;
            if(tips.isOk){
              this.xmBranch=res.data.data[0]

              this.drawAllBar();
              this.drawMenuPie();
              this.drawTask();
              this.drawTestCasePie();
              this.drawPieBug();
              this.drawCostPie();
              this.drawWorkload();
              this.drawIterationProduct();
            }
           })
    this.$nextTick(() => {
      this.maxTableHeight=util.calcTableMaxHeight(this.$refs.table.$el)
    });

			initSimpleDicts('all',['xmBranchPstatus']).then(res=>{
				this.dicts=res.data.data;
			})


  },

};
</script>

<style scoped lang="scss">
 
.icon1 {
  color: #fff;
  height: 30px;
  border-radius: 15px;
  text-align: center;
  font-size: 20px;
  display: inline-block;
  margin-right: 5px;
}

.icon2 {
  color: #000000;
  width: 30px;
  border-radius: 15px;
  text-align: center;
  font-size: 20px;
  display: inline-block;
  margin-right: 5px;
  margin-left: 5px;
}

.item {
  margin-top:10px;
  display: flex;
  justify-content: flex-start;
  position: relative;
  .progress-item{
    position:absolute; width:80%;
  }
}

.card-font {
  color: #000000;
  font-size: 12px;

  .el-col {
    margin-bottom: 20px;
  }
}

.calendar-header {
  display: flex;
  justify-content: space-between;

  .cal-header-boxs {
    flex: 1;
    display: flex;
    justify-content: flex-end;

    .cal-header-box {
      padding: 5px;
      height: 45px;
      margin-left: 10px;
    }

    .box-icon {
      text-align: center;
    }

    .box-info {
      text-align: center;
      font-size: 12px;
      color: #000000;
    }
  }
}

.el-tag:hover {
  cursor: pointer;
}

.value {
  cursor: pointer;
}

.reference {
  margin-top: 10px;
  font-size: 12px;
}

.click {
  background: #e9f7ff;
}

.calendar-box {
  display: flex;
  justify-content: flex-start;
}
.row_1 {
  background-color: #fff;
  display: flex;
  flex-direction: row;
  height: 120px;
  margin-top: 10px;
  .r {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span {
      margin-bottom: 14px;
      font-size: 24px;
      font-weight: bold;
    }
    p {
      font-size: 18px;
      color: #7D7D7D;
      font-weight: bold;
      opacity: 0.55;
    }
  }
}
</style>

