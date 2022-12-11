<template>
  <section class="page-container">
    <div class="page-main">
      <div class="row_1">
        <div class="r r1">
          <span style="color: #4779F6">{{formatNum(xmBranchState.projectCnt,0) || 0}}</span>
          <p>项目数</p>
        </div>
        <div class="r r2">
          <span style="color: #4779F6">{{formatNum(xmBranchState.budgetWorkload,0) || 0}}</span>
          <p>项目总工时</p>
        </div>
        <div class="r r3">
          <span style="color: #F6AE47">{{formatNum(xmBranchState.productCnt,0) || 0}}</span>
          <p>产品数</p>
        </div>
        <div class="r r4">
          <span style="color: #F6AE47">{{formatNum(xmBranchState.productBudgetWorkload,0) || 0}}</span>
          <p>产品总工时</p>
        </div>
        <div class="r r5">
          <span style="color: #47CBF6">{{formatNum(xmBranchState.phaseCnt,0) || 0}}</span>
          <p>计划数</p>
        </div>
        <div class="r r6">
          <span style="color: #47CBF6">{{formatNum(xmBranchState.iterationCnt,0) || 0}}</span>
          <p>迭代数</p>
        </div>
        <div class="r r7">
          <span style="color: #F68D47">{{formatNum(xmBranchState.planWorkerCnt,0) || 0}}</span>
          <p>总人数</p>
        </div>
        <div class="r r8">
          <span style="color: #7D7D7D">{{formatNum(xmBranchState.taskCnt,0) || 0}}</span>
          <p>任务数</p>
        </div>
        <div class="r r9">
          <span style="color: #7D7D7D">{{formatNum(xmBranchState.menuCnt,0) || 0}}</span>
          <p>需求数</p>
        </div>
      </div>

      <div class="row_2">
        <div class="r1">
          <p class="r_text">项目进度</p>
          <div class="message">
            <div>
              <span>{{formatNum(this.xmBranchState.estimateWorkload,0) || 0}}h</span>
              <p>预估工时</p>
            </div>
            <div>
              <span>{{formatNum(this.xmBranchState.actWorkload,0) || 0}}h</span>
              <p>登记工时</p>
            </div>
            <div>
              <span>{{ formatNum(workloadProgress,0) || 0}}%</span>
              <p>工时进度</p>
            </div>
            <div>
              <span>{{ formatNum(remainWorkload,0) || 0}}h</span>
              <p>剩余工时</p>
            </div>
            <div>
              <span>{{ formatNum(deviation,0)|| 0}}h</span>
              <p>预估偏差</p>
            </div>
            <div>
              <span>{{ formatNum(deviationRate,0) || 0}}%</span>
              <p>预估偏差率</p>
            </div>
          </div>
          <div style="padding: 0 40px">
            <el-divider></el-divider>
          </div>
          <div class="chart">
            <div class="desc">
              <span>项目预计进度</span>
              <span>项目实际进度</span>
            </div>
            <div class="process">
              <el-progress class="pc" :stroke-width="14" :percentage="planProgress"></el-progress>
              <el-progress class="pc" :stroke-width="14" color="#47CBF6" :percentage="realProgress"></el-progress>
            </div>
          </div>
        </div>

        <div class="r2">
          <p class="r_text">工作量分布</p>
          <div class="chart">
            <div id="workloadDistribution" :style="{width: '100%', height: '250px'}"></div>
          </div>
        </div>
      </div>

      <div class="row_3">
        <div class="r1">
          <p class="r_text">任务每日状态趋势</p>
          <div class="chart">
            <div id="taskChart" :style="{width: '100%', height: '320px'}"></div>
          </div>
        </div>
        <div class="r2">
          <p class="r_text">工作项数量分布</p>
          <div class="chart">
            <div id="allChart" :style="{width: '100%', height: '320px'}"></div>
          </div>
        </div>
      </div>

      <div class="row_4">
        <div class="r4_1">
          <p class="r_text">总预算情况</p>
          <div class="chart">
            <div id="planTotalCostPie" :style="{width: '100%', height: '410px'}"></div>
          </div>
        </div>
        <div class="r4_2">
          <p class="r_text">总缺陷情况</p>
          <div class="chart">
            <div id="bugPieChart" :style="{width: '100%', height: '410px'}"></div>
          </div>
        </div>
        <div class="r4_3">
          <p class="r_text">所含产品和迭代情况</p>
          <div class="chart">
            <div id="iterationAndProduct" :style="{width: '100%', height: '320px'}"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
import { mapGetters } from "vuex"; 
import { listXmBranchState  } from '@/api/xm/core/xmBranchState'; 
import { listXmBranchFiveDayTaskCnt  } from '@/api/xm/core/xmBranchStateHis';
import Guider from '@/components/Guider/Index.js';
export default {
  computed: {
    ...mapGetters(["userInfo"]),
    finish: function (){
      return this.xmBranchState.taskFinishCnt;
    },
    notStart: function() {
      return this.xmBranchState.taskCnt-this.xmBranchState.taskFinishCnt;
    },
    totalTask: function() {
      return this.xmBranchState.taskCnt;
    },
    taskProgress: function (){
      return this.xmBranchState.finishRate;
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
      if(!this.xmBranchState.budgetWorkload){
        return 0;
      }
      if(this.xmBranchState.actWorkload < this.xmBranchState.budgetWorkload){
        return Math.round(this.xmBranchState.actWorkload/this.xmBranchState.budgetWorkload*100)
      }else{
        return 100;
      }
    },
    deviation:function (){
      return Math.round(this.xmBranchState.actWorkload-this.xmBranchState.estimateWorkload);
    },
    deviationRate:function (){
      return Math.round((this.xmBranchState.actWorkload-this.xmBranchState.estimateWorkload)/this.xmBranchState.estimateWorkload*100);
    },
    remainWorkload:function (){
      return this.xmBranchState.budgetWorkload - this.xmBranchState.actWorkload;
    },

    planProgress:function (){
      if(!this.xmBranchState.budgetWorkload){
        return 0;
      }
      return Math.round( this.xmBranchState.estimateWorkload/this.xmBranchState.budgetWorkload*100)
    },

    realProgress:function (){
      if(!this.xmBranchState.budgetWorkload){
        return 0;
      }
      if(this.xmBranchState.actWorkload < this.xmBranchState.budgetWorkload){
        return Math.round(this.xmBranchState.actWorkload/this.xmBranchState.budgetWorkload*100)
      }else{
        return 100;
      }
    },
    xmTaskFiveDaysCpd(){
      if(this.xmBranchFiveDayTaskCnts.length==0){
        return [
          ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          [120, 132, 101, 134, 90, 230, 210],
          [220, 182, 191, 234, 290, 330, 310]
        ]
      }else{ 
        var datas=this.xmBranchFiveDayTaskCnts;
         datas.sort((a,b)=>Date.parse(a.bizDate) - Date.parse(b.bizDate));
          var datas2=[
            datas.map(i=>this.getWeek(i.bizDate)),
            datas.map(i=>i.taskUnstartCnt),
            datas.map(i=>i.taskExecCnt)
          ]
          return datas2;
      }
      
    },
    xmBranchStateCpd(){
      return this.xmBranchState
    },

  },
  watch:{
    xmBranchStateCpd:function(){
      this.drawWorkload();
      this.drawAllBar();
      this.drawCostPie();
      this.drawPieBug();
      this.drawIterationProduct();
    },
    xmTaskFiveDaysCpd:function(){ 
      this.drawTaskByDate();
    }
  },
  data() {
    return {
      isActive: true,
      xmBranchState:{},
      maxTableHeight:300,
      xmBranchFiveDayTaskCnts:[],
     // options: getDefOptions(),//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
    };
  },

  methods:{
    drawAllBar() {
      // 基于准备好的dom，初始化echarts实例
      let allChart = this.$echarts.init(document.getElementById("allChart"));
      let option = {
        color:['#A3BCFA', '#A3BCFA', '#A3BCFA'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }, 
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: ['需求', '任务', '缺陷'], 
        },
        series: [
          {
            name: '需求',
            type: 'line',
            stack: 'Total', 
            emphasis: {
              focus: 'series'
            },
            data: [this.xmBranchState.menuCnt],
            markPoint: {
              data: [{
                type: 'max',
                name: 'max'
              }],
            }
          },
          {
            name: '任务',
            type: 'line',
            stack: 'Total', 
            emphasis: {
              focus: 'series'
            },
            data: [0, this.xmBranchState.taskCnt],
            markPoint: {
              data: [{
                type: 'max',
                name: 'max'
              }],
            },
          },
          {
            name: '缺陷',
            type: 'line',
            stack: 'Total', 
            emphasis: {
              focus: 'series'
            },
            data: [0,  0, this.xmBranchState.bugCnt],
            markPoint: {
              data: [{
                type: 'max',
                name: 'max'
              }],
            },
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
        color:['#76AEF7', '#A8E5FA'],
        legend: {
          data: ['未开始', '进行中']
        },
        grid: {
          left: '1%',
          right: '3%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xmTaskFiveDaysCpd[0],
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, .05)'
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, .1)'
            }
          },
          axisTick: {
            lineStyle: {
              color: 'rgba(0, 0, 0, .1)'
            }
          },
          axisLabel: {
            color: '#555'
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, .05)'
            }
          }
        },
        series: [
          {
            name: '未开始',
            type: 'line',
            smooth: true,
            data: this.xmTaskFiveDaysCpd[1],
            areaStyle: {},
            label: {
              show: true,
              position: 'right',
              color: '#888',
              formatter: ({
                data
              }) => data == 0 ? '' : `${data}`
            },
            markPoint: {
              data: [
                {
                  type: 'min',
                  name: 'min'
                },
                {
                  type: 'max',
                  name: 'max'
                }
              ],
            },
            areaStyle: {
              normal: {
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "rgba(118,174,247,.4)"
                      },
                      {
                        offset: 1,
                        color: "rgba(118,174,247,0)"
                      }
                    ]
                }
              }
            },
          },
          {
            name: '进行中',
            type: 'line',
            smooth: true,
            data: this.xmTaskFiveDaysCpd[2],
            areaStyle: {
              opacity: 0.8,
              color: 'rgb(55, 162, 255)'
            },
            label: {
              show: true,
              position: 'right',
              color: '#888',
              formatter: ({
                data
              }) => data == 0 ? '' : `${data}次`
            },
            markPoint: {
              data: [
                {
                  type: 'min',
                  name: 'min'
                },
                {
                  type: 'max',
                  name: 'max'
                }
              ],
            },
            areaStyle: {
              normal: {
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "rgba(35,184,210,.2)"
                      },
                      {
                        offset: 1,
                        color: "rgba(35,184,210,0)"
                      }
                    ]
                }
              }
            },
          },
        ],
      };
      // 绘制图表
      taskChart.setOption(option);
    },

    formatNum(num,defVal){
      if(num){
       return parseInt(num)
      }else{
        return defVal
      }
    },
    drawPieBug() {
      let bugPieChart = this.$echarts.init(document.getElementById("bugPieChart"));
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: '80',
          data: ['已关闭', '已解决', '已激活', '已确认'],
          itemGap: 30,
        },
        series: [
          {
            center:['48%','40%'],//饼图位置
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
              {value: this.xmBranchState.closedBugs,
                itemStyle: {
                  normal:{
                    color: '#47CBF6'
                  }
                },
                name: '已关闭',
                label: {
                  normal: {
                    color: '#47CBF6'
                  }
                },
                labelLine: {
                  normal: {
                    position: "inner",
                    show: false
                  }
                }
              },
              {value: this.xmBranchState.resolvedBugs,
                itemStyle: {
                  normal:{
                    color: '#88B0BA'
                  }
                },
                name: '已解决',
                label: {
                  normal: {
                    color: '#88B0BA'
                  }
                },
                labelLine: {
                  normal: {
                    position: "inner",
                    show: false
                  }
                }
              },
              {value: this.xmBranchState.activeBugs,
                itemStyle: {
                  normal:{
                    color: '#F6AD48'
                  }
                },
                name: '已激活',
                label: {
                  normal: {
                    color: '#F6AD48'
                  }
                },
                labelLine: {
                  normal: {
                    position: "inner",
                    show: false
                  }
                }
              },
              {value: this.xmBranchState.confirmedBugs,
                itemStyle: {
                  normal:{
                    color: '#467AF6'
                  }
                },
                name: '已确认',
                label: {
                  normal: {
                    color: '#467AF6'
                  }
                },
                labelLine: {
                  normal: {
                    position: "inner",
                    show: false
                  }
                }
              },
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
          orient: 'horizontal',
          bottom: '80',
          data: ['非人力', '内部人力', '外购人力'],
          itemGap: 30,
        },
        series: [
          {
            center:['48%','40%'],//饼图位置
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
              {
                value: this.xmBranchState.budgetNouserAt,
                itemStyle: {
                  normal:{
                    color: '#46CBF6'
                  }
                },
                name: '非人力',
                label: {
                  normal: {
                    color: '#46CBF6'
                  },
                },
                labelLine: {
                  normal: {
                    position: "inner",
                    show: false
                  }
                }
              },
              {value: this.xmBranchState.budgetIuserAt,
                itemStyle: {
                  normal:{
                    color: '#F7AE48'
                  }
                },
                name: '内部人力',
                label: {
                  normal: {
                    color: '#F7AE48'
                  },
                },
                labelLine: {
                  normal: {
                    position: "inner",
                    show: false
                  }
                }
              },
              {value: this.xmBranchState.budgetOuserAt,
                itemStyle: {
                  normal:{
                    color: '#4679F6'
                  }
                },
                name: '外购人力',
                label: {
                  normal: {
                    color: '#4679F6'
                  }
                },
                labelLine: {
                  normal: {
                    position: "inner",
                    show: false
                  }
                }
              },
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
      let that = this;
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} :<br/> {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: '20',
          right: '60',
          data: ['内部人力', '外购人力'],
          itemGap: 30,
          textStyle: {
            rich: {
              name: {
                color: '#7D7D7D',
                fontWeight: 'bold',
                fontSize: 18
              },
              val: {
                fontSize: '14',
                color: '#7D7D7D'
              },
              desc: {
                lineHeight: 20,
                color: '#7D7D7D'
              }
            }
          },
          formatter(params) {
            console.log(params);
            let total = that.xmBranchState.budgetIuserWorkload + that.xmBranchState.budgetOuserWorkload;
            if(params == '内部人力') {
              let p = ((that.xmBranchState.budgetIuserWorkload / total) * 100).toFixed(2)
              return [
                `{name|${that.xmBranchState.budgetIuserWorkload}}/{val|${p}%}`,
                `{desc|${params}}`
              ].join('\n')
            }
            if(params == '外购人力') {
              let p = ((that.xmBranchState.budgetOuserWorkload / total) * 100).toFixed(2)
              return [
                `{name|${that.xmBranchState.budgetOuserWorkload}}/{val|${p}%}`,
                `{desc|${params}}`
              ].join('\n')
            }
            return params;
          },

        },
        series: [
          {
            center:['30%','40%'],//饼图位置
            type: 'pie',
            radius: ['40%', '70%'],//饼图半径大小
            label:{            //饼图图形上的文本标签
              show: false,
              position: 'center'
            },
            data: [
              {
                value: this.xmBranchState.budgetIuserWorkload,
                itemStyle: {
                  normal:{
                    color: '#3AC2ED'
                  }
                },
                name: '内部人力',
                label: {
                  normal: {
                    position: "inner",
                    show: false
                  }
                },
                labelLine: {
                  normal: {
                    position: "inner",
                    show: false
                  }
                }
              },
              {value: this.xmBranchState.budgetOuserWorkload,
                itemStyle: {
                  normal:{
                    color: '#4072F5'
                  }
                },
                name: '外购人力',
                label: {
                  normal: {
                    position: "inner",
                    show: false
                  }
                },
                labelLine: {
                  normal: {
                    position: "inner",
                    show: false
                  }
                }
              },
            ],

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
        grid: {
          left: '1%',
          right: '3%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, .05)'
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, .1)'
            }
          },
          axisTick: {
            lineStyle: {
              color: 'rgba(0, 0, 0, .1)'
            }
          },
          axisLabel: {
            color: '#555'
          }
        },
        yAxis: {
          type: 'category',
          data: ['产品数', '迭代数'],
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(0, 0, 0, .05)'
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, .1)'
            }
          },
          axisTick: {
            lineStyle: {
              color: 'rgba(0, 0, 0, .1)'
            }
          },
          axisLabel: {
            color: '#555'
          }
        },
        series: [{
          label: {
            normal:{
              show: true,
              position: 'inside',
              color:'#fff',
              fontSize: '14'
            }
          },
          data: [this.xmBranchState.productCnt, this.xmBranchState.iterationCnt],
          type: 'bar',
          showBackground: true,
          itemStyle: {
            normal:{
              color: '#467AF6'
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

    searchXmBranchState(callBack){
      listXmBranchState({branchId:this.userInfo.branchId}).then(res=>{
        var tips=res.data.tips;
        if(tips.isOk && res.data.data.length>0){
          this.xmBranchState=res.data.data[0]
        }
        if(callBack){
          this.$nextTick(()=>{
            callBack();
          })
        }
      });
    },

    searchXmBranchFiveDayTaskCnt(callBack){
      listXmBranchFiveDayTaskCnt({branchId:this.userInfo.branchId}).then(res=>{
        var tips=res.data.tips;
        if(tips.isOk && res.data.data.length>0){
          this.xmBranchFiveDayTaskCnts=res.data.data
        }
        if(callBack){
          this.$nextTick(()=>{
            callBack();
          })
        }
      });
    },


    //路由跳转
    gotolink(link) {
      this.$router.replace(link);
    },

    /**end 自定义函数请在上面加**/
    guiderStart(forceDisplayWhileClosed) { // 初始化引导页
      Guider.startByName('xmHomePage',forceDisplayWhileClosed);
    },
    getWeek(dateString) {
        var dateArray = dateString.split("-");
        var date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
        return "周" + "日一二三四五六".charAt(date.getDay());
    }
  },

  mounted() {
    //this.searchXmBranchState( this.guiderStart );
    this.searchXmBranchState();
    this.searchXmBranchFiveDayTaskCnt();
    this.drawWorkload();
    this.drawTaskByDate();
    this.drawAllBar();
    this.drawCostPie();
    this.drawPieBug();
    this.drawIterationProduct();
  },

};
</script>

<style scoped lang="scss">
.page-container {
  width: 100%;
  height: 100%;
  background-color: #F4F5F8;
  .page-main {
    padding: 18px;
    overflow: hidden;
    h2 {
      margin-top: 16px;
      font-size: 24px;
      color: #7D7D7D;
    }
    h2:before {
      content: " ";
      border-left: 10px #AEB8CE solid;
      margin-right: 12px;
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

    .row_2 {
      height: 354px;
      margin-top: 22px;
      display: flex;
      flex-direction: row;
      .r1 {
        flex: 2;
        background-color: #fff;
        margin-right: 20px;
        .message {
          display: flex;
          margin: 0 43px;
          div {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            span {
              margin-bottom: 8px;
              font-weight: bold;
              color: #7D7D7D;
            }
            p {
              color: #7D7D7D;
              opacity: 0.55;
            }
          }
        }
        .chart {
          display: flex;
          flex-direction: row;
          margin: 0 47px 0 47px;
          height: 120px;
          .desc {
            display: flex;
            flex-direction: column;
            margin-right: 20px;
            font-size: 18px;
            color: #7D7D7D;
            justify-content: center;
            span:nth-child(1) {
              margin-bottom: 20px;
            }
          }
          .process {
            display: flex;
            flex-direction: column;
            flex: 1;
            justify-content: center;
            .pc:nth-child(1) {
              margin-bottom: 20px;
            }
          }
          .tj {
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
          }
          .chart {
            flex: 1;
          }
        }
      }

      .r2 {
        width: 540px;
        background-color: #fff;
        .r2 {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .row_3 {
      height: 450px;
      display: flex;
      flex-direction: row;
      margin-top: 24px;
      .r1 {
        display: flex;
        flex: 1;
        background-color: #fff;
        flex-direction: column;
        margin-right: 20px;
      }
      .r2 {
        flex: 1;
        background-color: #fff;
        display: flex;
        flex-direction: column;
      }
    }

    .row_4 {
      height: 445px;
      display: flex;
      margin-top: 21px;
      .r4_1 {
        flex: 1;
        background-color: #fff;
        margin-right: 25px;
        display: flex;
        flex-direction: column;
      }
      .r4_2 {
        flex: 1;
        background-color: #fff;
        margin-right: 25px;
        display: flex;
        flex-direction: column;
      }
      .r4_3 {
        display: flex;
        flex-direction: column;
        background-color: #fff;
        flex: 1;
      }

    }

    .r_text  {
      font-size: 20px;
      color: #7D7D7D;
      margin: 26px 0 50px 28px;
    }

  }




}


</style>
