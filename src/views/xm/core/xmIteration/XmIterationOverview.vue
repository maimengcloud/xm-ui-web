<template>
  <section>
    <el-row :style="{overflowX: 'hidden',height:maxTableHeight+'px'}" ref="table">
      <el-row style="margin-bottom:10px">
        <el-card class="box-card" style="padding:0px ;height:100px">
          <div>
            <el-row style="padding:10px">
              <el-steps :active="calcIterationCurrStep" align-center finish-status="success">
                <el-step :title="item.name" v-for="(item,index) in dicts['iterationStatus']" :key="index"></el-step> 
              </el-steps>
            </el-row>
          </div>
        </el-card>
      </el-row>
      <el-row :gutter="10" style="margin-bottom:10px">
          <el-col :span="8" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header" class="clearfix">
                <span>迭代信息</span>
              </div>
              <el-row style="margin-bottom:18px">
                <el-row>
                  <span>负责人</span> <span v-text="this.xmIteration.adminUsername"></span>
                </el-row> 
              </el-row>
              <el-row style="margin-bottom:18px">
                <el-col :span="8" @click="">
                  <div class="item">
                    <div class="icon" style="background-color:  rgb(79, 140, 255);">
                      <i class="el-icon-right"></i>
                    </div>
                    <div class="info">
                      <div v-text="this.xmIteration.taskCnt"></div>
                      <div class="title">总任务量</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="item">
                    <div class="icon" style="background-color:  rgb(255, 153, 51);">
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
                    <div class="icon" style="background-color:  rgb(0, 153, 51);">
                      <i class="el-icon-check"></i>
                    </div>
                    <div class="info">
                      <div v-text="this.xmIteration.taskFinishCnt" >
                      </div>
                      <div class="title">已完成</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row style="margin-bottom:18px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-date"></i>
                  </div>
                  <div class="info">
                    <div v-text="iterationStartTime+'~'+iterationEndTime">
                    </div>
                    <div class="title">迭代计划周期</div>
                  </div>
                </div>
              </el-row>
              <el-row style="margin-bottom:18px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-star-off"></i>
                  </div>
                  <div class="info">
                    <div class="title"> 需求数： {{this.xmIteration.menuCnt}}</div>
                  </div>
                </div>
              </el-row>
              <el-row style="margin-bottom:18px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-refresh"></i>
                  </div>
                  <div class="info">
                    <div class="title"> 产品数： {{(this.xmIteration.productCnt)}} </div>
                  </div>
                </div>
              </el-row>
              <el-row style="margin-bottom:18px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-alarm-clock"></i>
                  </div>
                  <div>
                    <div class="progress-item">
                      <el-progress :percentage="taskProgress"></el-progress>
                      <div class="title">任务进度</div>
                    </div>
                  </div>
                </div>
              </el-row>
            </el-card>
          </el-col>
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
                <span>缺陷情况</span>
              </div>
              <div>
                <div id="bugPieChart" :style="{width: '100%', height: '410px'}"></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      <el-row :gutter="10" style="margin-bottom:10px">
        <el-col :span="8" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header" class="clearfix">
                <span>迭代工时</span>
              </div>
              <div>
                <el-row >
                  <div class="item">
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.xmIteration.estimateWorkload"></span>
                          <span style="font-size:5px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">预估工时</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.xmIteration.actWorkload"></span>
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
                <el-row  >
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
                  <el-progress style="width: 90%;margin-left:20px;margin-top: 10px;margin-bottom: 20px;"   :stroke-width="14" :percentage="planProgress"></el-progress>
                </el-row>
                <el-row>
                  <span style="margin-left:20px;">项目实际进度</span>
                  <el-progress style="width: 90%;margin-left:20px;margin-top: 10px;" color="#47CBF6"    :stroke-width="14" :percentage="realProgress"></el-progress>
                </el-row>

              </div>
            </el-card>
          </el-col>
        <el-col :span="8" >
          <el-card class="box-card" style="padding:0px ;height:425px">
            <div slot="header" class="clearfix">
              <span>迭代相关联产品与项目数</span>
            </div>
            <div>
              <div id="productAndProject" :style="{width: '100%', height: '350px'}"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8" >
          <el-card class="box-card" style="height:425px">
            <div slot="header" class="clearfix">
              <span>案例情况</span>
            </div>
            <div>
              <div id="casePie" :style="{width: '100%', height: '410px'}"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"]),
    notStart: function() {
      return this.xmIteration.taskCnt-this.xmIteration.taskFinishCnt;
    },
    taskProgress: function (){
      return this.xmIteration.finishRate||0;
    },
    iterationStartTime: function (){
      return this.xmIteration.startTime?this.xmIteration.startTime.substring(0,10):'';
    },
    iterationEndTime: function (){
      return this.xmIteration.endTime?this.xmIteration.endTime.substring(0,10):'';
    },
    workloadProgress:function (){
      if(!this.xmIteration.budgetWorkload || !this.xmIteration.actWorkload){
        return 0;
      }
      return Math.round(this.xmIteration.actWorkload/this.xmIteration.budgetWorkload*100);
    },
    deviation:function (){ 
        return this.xmIteration.actWorkload -this.xmIteration.estimateWorkload
    },
    deviationRate:function (){
      if(!this.xmIteration.estimateWorkload){
        return 0;
      }
      return Math.round(this.deviation/this.xmIteration.estimateWorkload*100);
    },
    remainWorkload:function (){
      return this.xmIteration.budgetWorkload - this.xmIteration.actWorkload;
    },
    planProgress:function (){
      if(!this.xmIteration.budgetWorkload){
        return 0;
      }
        return Math.round(this.xmIteration.estimateWorkload/this.xmIteration.budgetWorkload*100)
    },
    realProgress:function (){
      if(this.xmIteration.actWorkload < this.xmIteration.budgetWorkload){
        return Math.round(this.xmIteration.actWorkload/this.xmIteration.budgetWorkload*100)
      }else{
        return 100;
      }
    },
    xmIterationStateCpd(){
      return this.xmIteration
    },
    calcIterationCurrStep(){
				var istatus= this.dicts.iterationStatus
				if(!istatus){
					return 1;
				}else{
					var status=istatus.findIndex(i=>this.xmIteration.iphase==i.id)
					if(status>=0){
						return status+1;
					}else{
						return 1;
					}
				}
			} 
  },

  props:['xmIteration'],
  watch:{
    xmIterationStateCpd:function(){
      this.drawAllBar();
      this.drawPieBug();
      this.drawProductAndProject();
      this.drawCasePie();
    }
  },
  data() {
    return {
      isActive: true,
      maxTableHeight:300,
      dicts:{},
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
                value: this.xmIteration.menuCnt,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
                  }
                }
              },
              {
                value: this.xmIteration.taskCnt,
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
            center:['55%','40%'],
            type: 'pie',
            radius: '50%',
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
              {value: this.xmIteration.closedBugs,
                itemStyle: {
                  normal:{
                    color: '#5470C6'
                  }
                },
                name: '已关闭'},
              {value: this.xmIteration.resolvedBugs,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                },
                name: '已解决'},
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
    drawProductAndProject() {
      let productAndProject = this.$echarts.init(document.getElementById("productAndProject"));
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
          data: ['产品数', '项目数']
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
          data: [this.xmIteration.productCnt, this.xmIteration.projectCnt],
          type: 'bar',
          showBackground: true,
          itemStyle: {
            normal:{
              color: '#99CCFF'
            }
          },
          backgroundStyle: {
            color: '#FFFFFF'
          }
        }]
      };

      // 绘制图表
      productAndProject.setOption(option);
    },
    drawCasePie() {
      let casePie = this.$echarts.init(document.getElementById("casePie"));
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
              {value: this.xmIteration.execCases,
                itemStyle: {
                  normal:{
                    color: '#73C0DE'
                  }
                },
                name: '测试中案例'},
              {value: this.xmIteration.designCases,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                },
                name: '设计中案例'},
              {value: this.xmIteration.finishCases,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                },
                name: '完成案例'},
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
      casePie.setOption(option);
    },
  },

  mounted() {
    
    initSimpleDicts('all',['iterationStatus'] ).then(res=>{
      this.dicts=res.data.data;
    })
    this.$nextTick(() => { 
      this.maxTableHeight=util.calcTableMaxHeight(this.$refs.table.$el)
    });
    this.drawAllBar();
    this.drawPieBug();
    this.drawProductAndProject();
    this.drawCasePie();
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
