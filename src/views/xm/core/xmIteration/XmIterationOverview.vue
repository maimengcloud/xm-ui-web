<template>
  <section>
    <el-row :style="{overflowX: 'hidden',height:(maxTableHeight-24)+'px'}" ref="table">
      <el-row :gutter="10" style="margin-bottom:10px">
          <el-col :span="8" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header">
                <span>迭代信息</span>

                <el-popover
                  placement="bottom"
                  title="标题"
                  width="200"
                  trigger="click" >

                  <el-row>
                    <el-button type="primary" @click="loadTasksToXmIterationState" v-loading="load.calcProduct">计算迭代汇总数据</el-button>
                    <br>
                      <font color="blue" style="font-size:10px;">将从项目任务及迭代任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到迭代统计表</font>
                  </el-row>

                  <el-button slot="reference" style="float:right;" icon="el-icon-video-play" type="text">统计</el-button>
                </el-popover>

              </div>
              <el-row style="margin-bottom:10px">
                <el-row>
                  <span>迭代负责人</span>&nbsp;<span><b>{{pmUsername}}</b></span>
                 </el-row>
              </el-row>
              <el-row style="margin-bottom:10px">
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
              <el-row style="margin-bottom:10px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-date"></i>
                  </div>
                  <div class="info">
                    <div v-text="taskStartTime+'~'+taskEndTime">
                    </div>
                    <div class="title">迭代计划周期</div>
                  </div>
                </div>
              </el-row>
              <el-row style="margin-bottom:10px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-star-off"></i>
                  </div>
                  <div class="info">
                    <div class="title"> 需求数： {{this.xmIteration.menuCnt||0}}</div>
                  </div>
                </div>
              </el-row>
              <el-row style="margin-bottom:10px">
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
                <span>关联迭代和迭代情况</span>
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
                <span>迭代工时</span>
              </div>
              <div>
                <el-row  >
                  <div class="item">
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.xmIteration.budgetWorkload"></span>
                          <span style="font-size:5px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">总估工时</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.xmIteration.estimateWorkload"></span>
                          <span style="font-size:5px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">应完成工时</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.xmIteration.actWorkload"></span>
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

	import { listXmIterationWithState} from '@/api/xm/core/xmIteration';
import { loadTasksToXmMenuState} from '@/api/xm/core/xmMenuState';
  import {  loadTasksToXmIterationState} from '@/api/xm/core/xmIterationState';
  import store from '@/store'
export default {
  computed: {
    ...mapGetters(["userInfo"]),
    competeTasks: function (){
      return this.xmIteration.taskCnt-this.xmIteration.taskUnstartCnt-this.xmIteration.taskExecCnt;
    },
    notStart: function() {
      return  this.xmIteration.taskUnstartCnt+this.xmIteration.taskExecCnt;
    },
    totalTask: function() {
      return this.xmIteration.taskCnt;
    },
    taskStartTime: function (){
      return this.xmIteration.startTime?this.xmIteration.startTime.substring(0,10):'';
    },
    taskEndTime: function (){
      return this.xmIteration.endTime?this.xmIteration.endTime.substring(0,10):'';
    },
    pmUsername: function (){
      return this.xmIteration.pmUsername;
    },
    workloadProgress:function (){
      if(!this.xmIteration.actWorkload||!this.xmIteration.budgetWorkload){
        return 0;
      }
      return Math.round(this.xmIteration.actWorkload/this.xmIteration.budgetWorkload*100);
    },
    deviation:function (){

        return  this.xmIteration.actWorkload-this.xmIteration.estimateWorkload

    },
    deviationRate:function (){
      return Math.round(this.deviation/this.xmIteration.estimateWorkload*100);
    },
    remainWorkload:function (){
      return this.xmIteration.budgetWorkload - this.xmIteration.actWorkload;
    },
    planProgress:function (){
      if(!this.xmIteration.estimateWorkload||!this.xmIteration.budgetWorkload){
        return 0;
      }
        return Math.round(this.xmIteration.estimateWorkload/this.xmIteration.budgetWorkload*100);
    },
    realProgress:function (){
      if(!this.xmIteration.actWorkload||!this.xmIteration.budgetWorkload){
        return 0;
      }
      if(this.xmIteration.actWorkload < this.xmIteration.budgetWorkload){
        return Math.round(this.xmIteration.actWorkload/this.xmIteration.budgetWorkload*100)
      }else{
        return 100;
      }
    },
    xmIterationStateCpd(){
      return this.xmIteration
    },

  },

  props:['xmIteration'],
  watch:{
    xmIterationStateCpd:function(){
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
      load:{list:false,add:false,calcProject:false,calcSettle:false},
      isActive: true,
      maxTableHeight:300,
      dicts:{
        xmIterationPstatus:[]
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
                value: this.xmIteration.menuCnt,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                }
              },
              {
                value: this.xmIteration.taskCnt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                }
              },
              {
                value: this.xmIteration.testCases,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
                  }
                }
              },
              {
                value: this.xmIteration.bugCnt,
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
								'需求数'+this.xmIteration.menuCnt,

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
							data:[{name:'打开',value:this.xmIteration.menuUnstartCnt},{name:'执行中',value:this.xmIteration.menuExecCnt},{name:'已完成',value:this.xmIteration.menuFinishCnt},{name:'已关闭',value:this.xmIteration.menuCloseCnt}],
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
								'用例数'+this.xmIteration.testCases,

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
							data:[{name:'设计中',value:this.xmIteration.designCases},{name:'执行中',value:this.xmIteration.execCases},{name:'已完成',value:this.xmIteration.finishCases}],
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
                {name:'未开始',value:this.xmIteration.taskUnstartCnt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                }
                },
                {name:'执行中',value:this.xmIteration.taskExecCnt,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                }},
                {name:'已完工',value:this.xmIteration.taskFinishCnt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                }},
                {name:'已结算',value:this.xmIteration.taskSetCnt,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
                  }
                }},
                {name:'已关闭',value:this.xmIteration.taskCloseCnt,
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
            '缺陷数'+this.xmIteration.bugCnt,

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
              {value: this.xmIteration.activeBugs,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                },
                name: '已激活'},
              {value: this.xmIteration.confirmedBugs,
                itemStyle: {
                  normal:{
                    color: '#EE6666'
                  }
                },
                name: '已确认'},
              {value: this.xmIteration.resolvedBugs,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                },
                name: '已解决'},
              {value: this.xmIteration.closedBugs,
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
              {value: this.xmIteration.budgetNouserAt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                },
                name: '非人力'},
              {value: this.xmIteration.budgetIuserAt,
                itemStyle: {
                  normal:{
                    color: '#73C0DE'
                  }
                },
                name: '内部人力'},
              {value: this.xmIteration.budgetOuserAt,
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
            '总工时:'+this.xmIteration.budgetWorkload,

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
              {value: this.xmIteration.budgetIuserWorkload,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                },
                name: '内部人力'},
              {value: this.xmIteration.budgetOuserWorkload,
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
          data: ['项目数', '产品数']
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
                value: this.xmIteration.projectCnt,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                }
              },
              {
                value: this.xmIteration.productCnt,
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


    loadTasksToXmIterationState(){
        var row=this.xmIteration;
        var params={productId:row.id}
        this.load.calcProject=true;
      loadTasksToXmIterationState(params).then((res1) => {
          this.load.calcProject=false;
          this.load.list=true;
          listXmIterationWithState({id:row.id}).then(res=>{
            this.load.list=false;
            var tips = res.data.tips;
            if(tips.isOk){
              var xmIteration=res.data.data[0]
              if(this.xmIteration && this.xmIteration.id){
                store.dispatch('setXmIteration',xmIteration)
              }
              Object.assign(this.xmIteration,xmIteration)
              this.$emit("edit-fields",xmIteration);
            }
            this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
          })

        }).catch( err  => this.load.calcProject=false );
    },
    loadTasksToXmMenuState(){
        var row=this.xmIteration;
        var params={productId:row.id}
      loadTasksToXmMenuState(params).then((res) => {
          this.load.calcProject=false;
          var tips=res.data.tips;
          this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
        }).catch( err  => this.load.calcProject=false );
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.maxTableHeight=util.calcMaxHeight(this.$refs.table.$el)
    });

			initSimpleDicts('all',['xmIterationPstatus']).then(res=>{
				this.dicts=res.data.data;
			})
    this.drawAllBar();
    this.drawMenuPie();
    this.drawTask();
    this.drawTestCasePie();
    this.drawPieBug();
    this.drawCostPie();
    this.drawWorkload();
    this.drawIterationProduct();

  },

};
</script>

<style scoped lang="scss">
.container {
  margin: 10px;
}

.header {
  display: flex;
  justify-content: flex-start;
  padding: 10px;

  span {
    padding-right: 15px;
  }
}

.col {
  margin-bottom: 20px;
}

.icon1 {
  color: #fff;
  border-radius: 15px;
  text-align: center;
  font-size: 20px;
  display: inline-block;
  margin-right: 5px;
}

.icon2 {
  color: #000000;
  border-radius: 15px;
  text-align: center;
  font-size: 20px;
  display: inline-block;
  margin-right: 5px;
  margin-left: 5px;
}

.item {
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
</style>

