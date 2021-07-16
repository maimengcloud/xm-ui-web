<template>
  <section class="page-container padding">
    <el-row  class="page-header page-height-10">
      <el-col :xs="22" :sm="22" :md="23" :lg="23" :xl="23">
          <span >项目总览</span>
      </el-col>
    </el-row>
    <el-row class="page-main page-height-75" style="overflow-x: hidden;">
        <el-row :gutter="10">
          <el-col :span="8" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header" class="clearfix">
                <span>项目信息</span>
              </div>
              <el-row style="margin-bottom:18px">
                <el-row>
                  <span v-text="taskMng"></span>
                </el-row>
                <el-row>
                  <span>项目负责人</span>
                </el-row>
              </el-row>
              <el-row style="margin-bottom:18px">
                <el-col :span="8" @click="">
                  <div class="item">
                    <div class="icon" style="background-color:  rgb(79, 140, 255);">
                      <i class="el-icon-right"></i>
                    </div>
                    <div class="info">
                      <div class="value" v-text="totalTask"></div>
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
                      <div class="value" v-text="notStart">
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
                      <div class="value" v-text="finish" >
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
                    <div class="value" v-text="startTime1+'~'+endTime1">
                    </div>
                    <div class="title">项目计划周期</div>
                  </div>
                </div>
              </el-row>
              <el-row style="margin-bottom:18px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-star-off"></i>
                  </div>
                  <div class="info">
                    <div class="value" v-text="'无参数'">
                    </div>
                    <div class="title">需求数</div>
                  </div>
                </div>
              </el-row>
              <el-row style="margin-bottom:18px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-refresh"></i>
                  </div>
                  <div class="info">
                    <div class="value" v-text="'无参数'">
                    </div>
                    <div class="title">迭代数</div>
                  </div>
                </div>
              </el-row>
              <el-row style="margin-bottom:18px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-alarm-clock"></i>
                  </div>
                  <div class="value">
                    <div class="info">
                      <el-progress v-if="progress1" :percentage="progress1"></el-progress>
                    </div>
                    <div class="title">项目进度</div>
                  </div>
                </div>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span>所有工作项及其完成情况</span>
              </div>
              <div>
                <div id="myChart1" :style="{width: '400px', height: '300px'}"></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span>缺陷情况</span>
              </div>
              <div>
                <div id="myChart3" :style="{width: '400px', height: '300px'}"></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header" class="clearfix">
                <span>任务每日状态趋势</span>
              </div>
              <div>
                <div id="myChart2" :style="{width: '400px', height: '300px'}"></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header" class="clearfix">
                <span>项目工时</span>
              </div>
              <div>
                <el-row>
                  <div class="item" style="margin-bottom:18px">
                      <div>
                        <div class="title" v-text="'可绑定工时'">200</div>
                        <div style="text-align:center">预估工时</div>
                      </div>
                      <div style="margin-left:10px">
                        <div class="title" v-text="'可绑定工时'">200</div>
                        <div style="text-align:center">登记工时</div>
                      </div>
                      <div style="margin-left:10px;border-left:2px solid gray"></div>
                      <div style="margin-left:10px">
                        <div class="title" v-text="'可绑定进度'">200</div>
                        <div style="text-align:center">工时进度</div>
                      </div>
                  </div>
                  <div class="item" style="margin-bottom:18px">
                    <div>
                      <div class="title" v-text="'可绑定工时'">200</div>
                      <div style="text-align:center">剩余工时</div>
                    </div>
                    <div style="margin-left:10px">
                      <div class="title" v-text="'可绑定偏差'">200</div>
                      <div style="text-align:center">预估偏差</div>
                    </div>
                    <div style="margin-left:10px;border-left:2px solid gray"></div>
                    <div style="margin-left:10px">
                      <div class="title" v-text="'1.08%'">200</div>
                      <div style="text-align:center">预估偏差率</div>
                    </div>
                  </div>
                </el-row>
                <el-row>
                  //预估工时
                </el-row>
                <el-row>
                  //实际工时
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
    </el-row>

  </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex";
import { listXmProjectState } from '@/api/xm/core/xmProjectState';


export default {
  computed: {
    ...mapGetters(["userInfo"]),
    finish: function (){
      return this.selProject.totalCompleteTaskCnt;
    },
    notStart: function() {
      return this.selProject.totalTaskCnt-this.selProject.totalCompleteTaskCnt;
    },
    totalTask: function() {
      return this.selProject.totalTaskCnt;
    },
    progress1: function (){
      return Math.round(this.selProject.totalCompleteTaskCnt/this.selProject.totalTaskCnt*100);
    },
    startTime1: function (){
      return this.selProject.startTime.substring(0,10);
    },
    endTime1: function (){
      return this.selProject.endTime.substring(0,10);
    },
    taskMng: function (){
      return this.selProject.createUsername;
    },
    xmProjectStateCpd(){
      return this.xmProjectState
    }

  },

  props:['selProject'],
  watch:{
    xmProjectStateCpd:function(){
      this.drawLine1();
      this.drawLine2();
      this.drawLine3();
    }
  },
  data() {
    return {
      isActive: true,
      load:{ list: false},
      xmProjectState: []//查询结果
    };
  },

  methods:{
    //获取对应的xmProjectsTate
    getXmProjectState(){
      let params = {
        projectId:this.selProject.id,
        branchId:this.userInfo.branchId
      };
      this.load.list = true;
      listXmProjectState(params).then((res) => {
        debugger;
        let tips=res.data.tips;
        if(tips.isOk){
          this.xmProjectState = res.data.data;
        }else{
          this.$message({showClose: true, message: tips.msg, type: 'error' });
        }
        this.load.list = false;
      }).catch( err => this.load.list = false );
    },

    drawLine1() {
      // 基于准备好的dom，初始化echarts实例
      let myChart1 = this.$echarts.init(document.getElementById("myChart1"));
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
          bottom: '3%',
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
            data: [
              {
                value: 90,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
                  }
                }
              },
              {
                value: this.selProject.totalTaskCnt,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
                  }
                }
              },
              {
                value: this.selProject.totalBugCnt,
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
      myChart1.setOption(option);
    },
    drawLine2() {
      let myChart2 = this.$echarts.init(document.getElementById("myChart2"));
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        color:['rgb(0, 153, 255)','#6699CC'],
        legend: {
          data: ['未开始', '进行中']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
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
      myChart2.setOption(option);
    },
    drawLine3() {
      let myChart3 = this.$echarts.init(document.getElementById("myChart3"));
      let option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: [
              {value: this.selProject.totalClosedBugCnt,
                itemStyle: {
                  normal:{
                    color: '#99CC33'
                  }
                },
                name: '已关闭'},
              {value: this.selProject.totalResolvedBugCnt,
                itemStyle: {
                  normal:{
                    color: '#FF9900'
                  }
                },
                name: '已解决'},
              {value: this.selProject.totalActiveBugCnt,
                itemStyle: {
                  normal:{
                    color: '#66CCCC'
                  }
                },
                name: '已激活'},
              {value: this.selProject.totalConfirmedBugCnt,
                itemStyle: {
                  normal:{
                    color: '#FF6666'
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
      myChart3.setOption(option);
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.getXmProjectState();
    });
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

.el-progress {
  width: 220px;
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
