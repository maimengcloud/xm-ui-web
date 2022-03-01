<template>
  <section>
    <el-row class="page-main page-height-70" style="overflow-x: hidden;">
      <el-row :gutter="10" style="margin-bottom:10px">
        <el-col :span="12" >
          <el-card class="box-card" style="padding:0px ;height:425px">
            <div slot="header" class="clearfix">
              <span>团队信息</span>
            </div>
            <el-row style="margin-bottom:18px">
              <el-row>
                <span>团队名称:</span>
                <span v-text="this.xmProjectGroupState.groupName"></span>
              </el-row>
            </el-row>
            <el-row style="margin-bottom:18px">
              <el-col :span="8">
                <div class="item">
                  <div class="icon" style="background-color:  rgb(79, 140, 255);">
                    <i class="el-icon-right"></i>
                  </div>
                  <div class="info">
                    <div v-text="this.xmProjectGroupState.taskCnt"></div>
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
                    <div v-text="this.xmProjectGroupState.finishTaskCnt" >
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
                  <div v-text="planStartTime+'~'+planEndTime">
                  </div>
                  <div class="title">计划周期</div>
                </div>
              </div>
            </el-row>
            <el-row style="margin-bottom:18px">
              <div class="item">
                <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                  <i class="el-icon-star-off"></i>
                </div>
                <div class="info">
                  <div class="title"> 汇总时间： {{this.calcTime}}</div>
                </div>
              </div>
            </el-row>
            <el-row style="margin-bottom:18px">
              <div class="item">
                <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                  <i class="el-icon-refresh"></i>
                </div>
                <div class="info">
                  <div class="title"> 关联迭代数： {{(this.xmProjectGroupState.iterationCnt)}} </div>
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
                    <el-progress v-if="!isNaN(finishRate)" :percentage="finishRate"></el-progress>
                    <div class="title">任务进度</div>
                  </div>
                </div>
              </div>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="12" >
          <el-card class="box-card" style="height:425px">
            <div slot="header" class="clearfix">
              <span>所有工作项数量分布</span>
            </div>
            <div>
              <div id="allChart" :style="{width: '100%', height: '350px'}"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-bottom:10px">
        <el-col :span="12">
          <el-card class="box-card" style="padding:0px ;height:425px">
            <div slot="header" class="clearfix">
              <span>工作量情况</span>
            </div>
            <div>
              <el-row style="padding:25px;">
                <div class="item">
                  <el-col :span="8">
                    <div>
                      <div style="text-align:center;">
                        <span style="font-size:24px;" v-text="this.xmProjectGroupState.planWorkload"></span>
                        <span style="font-size:5px;">h</span>
                      </div>
                      <div style="text-align:center;font-size:5px;">计划工作量</div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <div style="text-align:center;">
                        <span style="font-size:24px;" v-text="this.xmProjectGroupState.actWorkload"></span>
                        <span style="font-size:5px;">h</span>
                      </div>
                      <div style="text-align:center;font-size:5px;">完成工作量</div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <div style="text-align:center;">
                        <span style="font-size:24px;" v-text="workloadProgress"></span>
                        <span style="font-size:5px;">%</span>
                      </div>
                      <div style="text-align:center;font-size:5px;">工作量进度</div>
                    </div>
                  </el-col>
                </div>
              </el-row>
              <el-row style="padding:25px;">
                <div class="item">
                  <el-col :span="8">
                    <div>
                      <div style="text-align:center;">
                        <span style="font-size:24px;" v-text="remainWorkload"></span>
                        <span style="font-size:5px;">h</span>
                      </div>
                      <div style="text-align:center;font-size:5px;">剩余工作量</div>
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
                <span style="margin-left:20px;">工作量预计进度</span>
                <el-progress style="width: 90%;margin-left:20px;margin-top: 10px;margin-bottom: 20px;" :text-inside="true"
                             :stroke-width="24" :percentage="planProgress"></el-progress>
              </el-row>
              <el-row>
                <span style="margin-left:20px;">工作量实际进度</span>
                <el-progress style="width: 90%;margin-left:20px;margin-top: 10px;" :text-inside="true" :stroke-width="24"
                             :percentage="realProgress"></el-progress>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12" >
          <el-card class="box-card" style="height:425px">
            <div slot="header" class="clearfix">
              <span>缺陷情况</span>
            </div>
            <div style="'100%'">
              <div id="bugPieChart" :style="{width: '100%', height: '300px'}"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import { mapGetters } from 'vuex'


export default {
  computed: {
    ...mapGetters(['userInfo','roles']),
    finishRate:function (){
      return parseFloat(this.xmProjectGroupState.finishRate);
    },
    notStart: function() {
      return this.xmProjectGroupState.taskCnt-this.xmProjectGroupState.finishTaskCnt;
    },
    planStartTime: function (){
      if(this.xmProjectGroupState.planStartTime){
        return this.xmProjectGroupState.planStartTime.substring(0,10);
      } else{
        return '暂无';
      }
    },
    planEndTime: function (){
      if(this.xmProjectGroupState.planEndTime){
        return this.xmProjectGroupState.planEndTime.substring(0,10);
      } else{
        return '暂无';
      }
    },
    calcTime:function (){
      if(this.xmProjectGroupState.calcTime){
        return this.xmProjectGroupState.calcTime.substring(0,10);
      }else{
        return '暂无';
      }
    },
    workloadProgress:function (){
      if(this.xmProjectGroupState && this.xmProjectGroupState.actWorkload){
        return Math.round(this.xmProjectGroupState.actWorkload/this.xmProjectGroupState.planWorkload*100);
      }else{
        return 0;
      }
    },
    deviation:function (){
      let now = new Date();
      let startTime = new Date(this.xmProjectGroupState.planStartTime);
      let endTime = new Date(this.xmProjectGroupState.planEndTime);
      let allDays=endTime-startTime;
      if(now<=endTime && allDays){
        return this.xmProjectGroupState.planWorkload - Math.round((now-startTime)/allDays*this.xmProjectGroupState.planWorkload)
      }else{
        return this.xmProjectGroupState.actWorkload - this.xmProjectGroupState.planWorkload;
      }
    },
    deviationRate:function (){
      if(this.xmProjectGroupState.planWorkload){
        return Math.round(this.deviation/this.xmProjectGroupState.planWorkload*100);
      }else{
        return '暂无';
      }
    },
    remainWorkload:function (){
      return this.xmProjectGroupState.planWorkload - this.xmProjectGroupState.actWorkload;
    },
    planProgress:function (){
      let now = new Date();
      let startTime = new Date(this.xmProjectGroupState.planStartTime);
      let endTime = new Date(this.xmProjectGroupState.planEndTime);
      let allDays=endTime-startTime;
      if(now<=endTime && allDays){
        return Math.round((now-startTime)/allDays*100);
      }else{
        return 100;
      }
    },
    realProgress:function (){
      if(this.xmProjectGroupState.actWorkload < this.xmProjectGroupState.planWorkload && this.xmProjectGroupState.planWorkload){
        return Math.round(this.xmProjectGroupState.actWorkload/this.xmProjectGroupState.planWorkload*100);
      }else{
        return 100;
      }
    },
    xmProjectGroupStateCpd(){
      return this.xmProjectGroupState
    },

  },

  props:['xmProjectGroupState'],
  watch:{
    xmProjectGroupStateCpd:function(){
      this.drawAllBar();
      this.drawPieBug();
    }
  },
  data() {
    return {
      isActive:true,
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
          data: ['测试案例', '任务', '缺陷']
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
                value: this.xmProjectGroupState.testCases,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
                  }
                }
              },
              {
                value: this.xmProjectGroupState.taskCnt,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
                  }
                }
              },
              {
                value: this.xmProjectGroupState.bugCnt,
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
              {value: this.xmProjectGroupState.closedBugs,
                itemStyle: {
                  normal:{
                    color: '#5470C6'
                  }
                },
                name: '已关闭'},
              {value: this.xmProjectGroupState.resolvedBugs,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                },
                name: '已解决'},
              {value: this.xmProjectGroupState.activeBugs,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                },
                name: '已激活'},
              {value: this.xmProjectGroupState.confirmedBugs,
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
              {value: this.xmProjectGroupState.execCases,
                itemStyle: {
                  normal:{
                    color: '#73C0DE'
                  }
                },
                name: '测试中案例'},
              {value: this.xmProjectGroupState.designCases,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                },
                name: '设计中案例'},
              {value: this.xmProjectGroupState.finishCases,
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
    this.$nextTick(() => {
    });
    this.drawAllBar();
    this.drawPieBug();
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


.value {
  cursor: pointer;
}


.click {
  background: #e9f7ff;
}

</style>

<style>
.app-container{
  padding: 20px;
  padding-bottom: 0;
}
</style>
