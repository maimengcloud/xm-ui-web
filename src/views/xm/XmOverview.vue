<template>
  <section class="page-container padding">
    <el-row class="page-main " :style="{overflowX: 'hidden',height:maxTableHeight+'px'}" ref="table"> 
      <el-row :gutter="10" style="margin-bottom:10px">
          <el-col :span="16" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header" class="clearfix">
                <span class="el-icon-s-data" style=" color: #3E68fe;">数据汇总</span>
              </div>
              <el-row style="margin-bottom:18px">
                <el-col :span="8">
                  <div class="item">
                    <div class="icon" style="background-color:  rgb(79, 140, 255);">
                      <i class="el-icon-alarm-clock"></i>
                    </div>
                    <div class="info">
                      <div v-text="xmBranchState.totalPlanWorkload"></div>
                      <div class="title">项目总工时</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="item">
                    <div class="icon" style="background-color:  rgb(255, 153, 51);">
                      <i class="el-icon-alarm-clock"></i>
                    </div>
                    <div class="info">
                      <div v-text="xmBranchState.productBudgetWorkload">
                      </div>
                      <div class="title">产品总工时</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="item">
                    <div class="icon" style="background-color:  rgb(0, 153, 51);">
                      <i class="el-icon-s-custom"></i>
                    </div>
                    <div class="info">
                      <div v-text="xmBranchState.totalStaffCnt" >
                      </div>
                      <div class="title">总人数</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row style="margin-bottom:18px">
                <el-col :span="8">
                  <div class="item">
                    <div class="icon" style="background-color:  rgb(79, 140, 255);">
                      <i class="el-icon-s-unfold"></i>
                    </div>
                    <div class="info">
                      <div v-text="xmBranchState.projectCnt"></div>
                      <div class="title">项目数</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="item">
                    <div class="icon" style="background-color:  rgb(255, 153, 51);">
                      <i class="el-icon-date"></i>
                    </div>
                    <div class="info">
                      <div v-text="xmBranchState.totalPhaseCnt">
                      </div>
                      <div class="title">计划数</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="item">
                    <div class="icon" style="background-color:  rgb(0, 153, 51);">
                      <i class="el-icon-s-operation"></i>
                    </div>
                    <div class="info">
                      <div v-text="xmBranchState.totalTaskCnt" >
                      </div>
                      <div class="title">任务数</div>
                    </div>
                  </div>
                </el-col>
              </el-row> 
              <el-row style="margin-bottom:18px">
                <el-col :span="8">
                <div class="item">
                  <div class="icon" style="background-color:  rgb(79, 140, 255);">
                    <i class="el-icon-star-off"></i>
                  </div>
                    <div class="info">
                      <div v-text="xmBranchState.productCnt" >
                      </div>
                      <div class="title">产品数</div>
                    </div>
                </div> 
                
                </el-col>
                <el-col :span="8">
                <div class="item">
                  <div class="icon" style="background-color:   rgb(255, 153, 51);">
                    <i class="el-icon-refresh"></i>
                  </div> 
                    <div class="info">
                      <div v-text="xmBranchState.iterationCnt" >
                      </div>
                      <div class="title">迭代数</div>
                    </div> 
                </div> 
                
                </el-col>
                <el-col :span="8">
                <div class="item">
                  <div class="icon" style="background-color:  rgb(0, 153, 51);">
                    <i class="el-icon-loading"></i>
                  </div> 
                    <div class="info">
                      <div v-text="xmBranchState.menuCnt" >
                      </div>
                      <div class="title">需求数</div>
                    </div> 
                </div>
                
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8" >
          <el-card class="box-card" style="height:425px">
            <div slot="header" class="clearfix">
              <span class="el-icon-document" style=" color: #3E68fe;">&nbsp;快捷菜单</span>
            </div> 
            <div class="menu"> 
              <div class="menu-content">
                <div class="quick-menu" @click="gotolink('/xm/core/xmProject/XmProjectAllMng')">
                  <div class="quick-menu-icon-outer">
                    <img src="../../assets/image/platform/module-project.png" />
                  </div>
                  <div class="quick-menu-text">项目管理</div>
                </div> 
                
                <div class="quick-menu" @click="gotolink('/xm/core/xmProduct/XmProductAllMng')">
                  <div class="quick-menu-icon-outer">
                    <img src="../../assets/image/platform/module-attendance.png" />
                  </div>
                  <div class="quick-menu-text">产品管理</div>
                </div> 
                
                <div class="quick-menu" @click="gotolink('/xm/core/xmMenu/XmMenuMng')">
                  <div class="quick-menu-icon-outer">
                    <img src="../../assets/image/platform/module-contract.png" />
                  </div>
                  <div class="quick-menu-text">需求管理</div>
                </div> 
                
                <div class="quick-menu" @click="gotolink('/xm/core/xmQuestion/XmQuestionMng')">
                  <div class="quick-menu-icon-outer">
                    <img src="../../assets/image/platform/module-fake.png" />
                  </div>
                  <div class="quick-menu-text">缺陷管理</div>
                </div> 
                
                <div class="quick-menu" @click="gotolink('/xm/core/xmProjectGroup/XmProjectGroupAllMng')">
                  <div class="quick-menu-icon-outer">
                    <img src="../../assets/image/platform/module-organization.png" />
                  </div>
                  <div class="quick-menu-text">团队管理</div>
                </div> 
                
                <div class="quick-menu" @click="gotolink('/mdp/workflow/ru/task/TaskListAssigneeToMe')">
                  <div class="quick-menu-icon-outer">
                    <img src="../../assets/image/platform/module-task.png" />
                  </div>
                  <div class="quick-menu-text">待审事项</div>
                </div> 
                
                <div class="quick-menu" @click="gotolink('/xm/core/xmTask/XmMyTaskCenter')">
                  <div class="quick-menu-icon-outer">
                    <img src="../../assets/image/platform/module-code.png" />
                  </div>
                  <div class="quick-menu-text">开发任务</div>
                </div>  
              </div>
            </div>
          </el-card>
        </el-col> 
        
        </el-row>
        <el-row :gutter="10" style="margin-bottom:10px">
          <el-col :span="16" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header" class="clearfix">
                <span class="el-icon-s-operation" style=" color: #3E68fe;">项目进度</span>
              </div>
              <div>
                <el-row style="padding-top:15px;padding-left:25px;">
                  <div class="item">
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.xmBranchState.estimateWorkload"></span>
                          <span style="font-size:5px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">预估工时</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.xmBranchState.totalActWorkload"></span>
                          <span style="font-size:5px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">登记工时</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="workloadProgress"></span>
                          <span style="font-size:5px;">%</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">工时进度</div>
                      </div>
                    </el-col>
                  </div>
                </el-row>
                <el-row style="padding-top:15px;padding-left:25px;">
                  <div class="item">
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="remainWorkload"></span>
                          <span style="font-size:5px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">剩余工时</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="deviation"></span>
                          <span style="font-size:5px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">预估偏差</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
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
                  <span style="margin-left:20px;">项目预计进度</span>
                  <el-progress style="width: 90%;margin-left:20px;margin-top: 10px;margin-bottom: 20px;" :text-inside="true" :stroke-width="24" :percentage="planProgress"></el-progress>
                </el-row>
                <el-row>
                  <span style="margin-left:20px;">项目实际进度</span>
                  <el-progress style="width: 90%;margin-left:20px;margin-top: 10px;" :text-inside="true" :stroke-width="24" :percentage="realProgress"></el-progress>
                </el-row>

              </div>
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span class="el-icon-document"  style=" color: #3E68fe;">工作量分布</span>
              </div>
              <div>
                <div id="workloadDistribution" :style="{width: '100%', height: '410px'}"></div>
              </div>
            </el-card>
          </el-col> 
        </el-row>
      <el-row :gutter="10" style="margin-bottom:10px">

          
          <el-col :span="16" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header" class="clearfix">
                <span  class="el-icon-document"  style=" color: #3E68fe;">任务每日状态趋势</span>
              </div>
              <div>
                <div id="taskChart" :style="{width: '100%', height: '320px'}"></div>
              </div>
            </el-card>
          </el-col>  
         <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span  class="el-icon-document"  style=" color: #3E68fe;">工作项数量分布</span>
              </div>
              <div>
                <div id="allChart" :style="{width: '100%', height: '350px'}"></div>
              </div>
            </el-card>
          </el-col> 
      </el-row>
      
      <el-row :gutter="10" style="margin-bottom:10px"> 
        <el-col :span="8" >
          <el-card class="box-card" style="height:425px">
            <div slot="header" class="clearfix">
              <span  class="el-icon-document"  style=" color: #3E68fe;">总预算情况</span>
            </div>
            <div>
              <div id="planTotalCostPie" :style="{width: '100%', height: '410px'}"></div>
            </div>
          </el-card>
        </el-col> 
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span  class="el-icon-document"  style=" color: #3E68fe;">缺陷情况</span>
              </div>
              <div>
                <div id="bugPieChart" :style="{width: '100%', height: '410px'}"></div>
              </div>
            </el-card>
          </el-col>
        <el-col :span="8" >
          <el-card class="box-card" style="height:425px">
            <div slot="header" class="clearfix">
              <span  class="el-icon-document"  style=" color: #3E68fe;">所含产品和迭代情况</span>
            </div>
            <div>
              <div id="iterationAndProduct" :style="{width: '100%', height: '350px'}"></div>
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
import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询  
	import { listXmBranchState,loadProjectStateToXmBranchState } from '@/api/xm/core/xmBranchState';
export default {
  computed: {
    ...mapGetters(["userInfo"]),
    finish: function (){
      return this.xmBranchState.totalCompleteTaskCnt;
    },
    notStart: function() {
      return this.xmBranchState.totalTaskCnt-this.xmBranchState.totalCompleteTaskCnt;
    },
    totalTask: function() {
      return this.xmBranchState.totalTaskCnt;
    },
    taskProgress: function (){
      return this.xmBranchState.totalProgress;
    },
    taskStartTime: function (){
      return this.xmBranchState.startTime.substring(0,10);
    },
    taskEndTime: function (){
      return this.xmBranchState.endTime.substring(0,10);
    },
    taskMng: function (){
      return this.xmBranchState.createUsername;
    },
    workloadProgress:function (){
      return Math.round(this.xmBranchState.totalActWorkload/this.xmBranchState.estimateWorkload*100);
    },
    deviation:function (){
      return Math.round(this.xmBranchState.totalActWorkload-this.xmBranchState.estimateWorkload);
    },
    deviationRate:function (){
      return Math.round((this.xmBranchState.totalActWorkload-this.xmBranchState.estimateWorkload)/this.xmBranchState.estimateWorkload*100);
    },
    remainWorkload:function (){
      return this.xmBranchState.totalPlanWorkload - this.xmBranchState.totalActWorkload;
    },
    planProgress:function (){
      if(!this.xmBranchState.totalPlanWorkload){
        return 0;
      }
      return parseInt( this.xmBranchState.estimateWorkload/this.xmBranchState.totalPlanWorkload*100)
    },
    realProgress:function (){
      if(!this.xmBranchState.totalPlanWorkload){
        return 0;
      }
      if(this.xmBranchState.totalActWorkload < this.xmBranchState.totalPlanWorkload){
        return Math.round(this.xmBranchState.totalActWorkload/this.xmBranchState.totalPlanWorkload*100)
      }else{
        return 100;
      }
    },
    xmBranchStateCpd(){
      return this.xmBranchState
    }, 

  }, 
  watch:{
    xmBranchStateCpd:function(){
      this.drawAllBar();
      this.drawTaskByDate();
      this.drawPieBug();
      this.drawCostPie();
      this.drawWorkload();
      this.drawIterationProduct();
    }
  },
  data() {
    return {
      isActive: true,
      xmBranchState:{},
      maxTableHeight:300,
     // options: getDefOptions(),//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
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
          data: ['需求', '任务', '缺陷']
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
                value: this.xmBranchState.menuCnt,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
                  }
                }
              },
              {
                value: this.xmBranchState.totalTaskCnt,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
                  }
                }
              },
              {
                value: this.xmBranchState.totalBugCnt,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
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
    drawTaskByDate() {
      let taskChart = this.$echarts.init(document.getElementById("taskChart"));
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        color:['rgb(0, 153, 255)','#6699CC'],
        legend: {
          data: ['未开始', '进行中']
        },
        grid: {
          left: '1%',
          right: '3%',
          bottom: '5%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '未开始',
            type: 'line',
            //stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210],
            areaStyle: {
              normal:{
                color:"rgb(153, 204, 255)" , //设置折线图颜色
              }
            },
            lineStyle:{
              normal:{
                color:'rgb(0, 153, 255)'
              }
            },
          },
          {
            name: '进行中',
            type: 'line',
            //stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310],
            areaStyle: {
              normal:{
                color:"rgb(153, 204, 255)", //设置折线图颜色
              }
            },
            lineStyle:{
              normal:{
                color:'#6699CC'
              }
            },
          },
        ],
      };

      // 绘制图表
      taskChart.setOption(option);
    },
    drawPieBug() {
      let bugPieChart = this.$echarts.init(document.getElementById("bugPieChart"));
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            center:['55%','40%'],//饼图位置
            type: 'pie',
            radius: '50%',//饼图半径大小
            label:{            //饼图图形上的文本标签
              normal:{
                show:true,
                position:'outer', //标签的位置:内部
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
              {value: this.xmBranchState.totalClosedBugCnt,
                itemStyle: {
                  normal:{
                    color: '#5470C6'
                  }
                },
                name: '已关闭'},
              {value: this.xmBranchState.totalResolvedBugCnt,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                },
                name: '已解决'},
              {value: this.xmBranchState.totalActiveBugCnt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                },
                name: '已激活'},
              {value: this.xmBranchState.totalConfirmedBugCnt,
                itemStyle: {
                  normal:{
                    color: '#EE6666'
                  }
                },
                name: '已确认'},
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
              {value: this.xmBranchState.totalBudgetNouserAmount,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                },
                name: '非人力'},
              {value: this.xmBranchState.totalBudgetInnerUserAmount,
                itemStyle: {
                  normal:{
                    color: '#73C0DE'
                  }
                },
                name: '内部人力'},
              {value: this.xmBranchState.totalBudgetOutUserAmount,
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
              {value: this.xmBranchState.totalPlanInnerUserWorkload,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                },
                name: '内部人力'},
              {value: this.xmBranchState.totalPlanOutUserWorkload,
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
          data: ['产品数', '迭代数']
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
          data: [this.xmBranchState.productCnt, this.xmBranchState.iterationCnt],
          type: 'bar',
          showBackground: true,
          itemStyle: {
            normal:{
              color: '#87CEFA'
            }
          },
          backgroundStyle: {
            color: '#FFFFFF'
          }
        }]
      };

      // 绘制图表
      iterationAndProduct.setOption(option);
    },
    searchXmBranchState(){
      listXmBranchState({branchId:this.userInfo.branchId}).then(res=>{
        var tips=res.data.tips;
        if(tips.isOk && res.data.data.length>0){
          this.xmBranchState=res.data.data[0]
        }
      });
    },
    
    //路由跳转
    gotolink(link) {
      this.$router.replace(link);
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.maxTableHeight=util.calcTableMaxHeight(this.$refs.table.$el)
    }); 
    this.drawAllBar();
    this.drawTaskByDate();
    this.drawPieBug();
    this.drawCostPie();
    this.drawWorkload();
    this.drawIterationProduct();
    this.searchXmBranchState();
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

.icon {
  color: #fff;
  height: 30px;
  width: 30px;
  border-radius: 15px;
  text-align: center;
  line-height: 30px;
  font-size: 20px;
  display: inline-block;
  margin-right: 5px;
}

.icon2 {
  color: #000000;
  height: 30px;
  width: 30px;
  border-radius: 15px;
  text-align: center;
  line-height: 30px;
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

<style>
.app-container{
  padding: 20px;
  padding-bottom: 0;
}
</style>
<style scoped lang="scss" >
 .menu {
    background: white;
    min-height: 280px;
    margin-top: 10px;
    .menu-content {
      display: flex;
      justify-content: flex-start;
      padding: 10px;
      flex-wrap: wrap;
      .quick-menu {
        height: 80px;
        width: 60px;
        margin-right: 15px;
        cursor: pointer;
        margin-bottom: 20px;
        .quick-menu-icon-outer {
          width: 52px;
          height: 52px;
          padding: 6px;
          border: 1px solid transparent;
          border-radius: 5px;
          text-align: center;
          line-height: 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            width: 30px;
            color: white;
          }
        }
        .quick-menu-text {
          height: 30px;
          width: 60px;
          line-height: 30px;
          font-size: 12px;
          color: #333;
          float: left;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          text-align: center;
        }
      }
      .quick-menu:hover {
        opacity: 0.8;
        .quick-menu-text {
          color: rgb(3, 169, 244);
        }
      }
    }
  }
</style>