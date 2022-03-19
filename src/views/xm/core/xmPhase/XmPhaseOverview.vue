<template>
  <section>
    <el-row class="page-main " style="overflow-x: hidden;">
      <el-row style="margin-bottom:10px">
        <el-card class="box-card" style="padding:0px ;height:100px">
          <div>
            <el-row style="padding:10px">
              <el-steps :active="this.xmPhase.phaseStatus" finish-status="success" align-center>
                <el-step title="初始"></el-step>
                <el-step title="执行中"></el-step>
                <el-step title="完工"></el-step>
                <el-step title="关闭"></el-step>
                <el-step title="删除中"></el-step>
                <el-step title="已删除"></el-step>
                <el-step title="暂停"></el-step>
              </el-steps>
            </el-row>
          </div>
        </el-card>
      </el-row>
      <el-row :gutter="10" style="margin-bottom:10px">
        <el-col :span="12" >
          <el-card class="box-card" style="padding:0px ;height:425px">
            <div slot="header" class="clearfix">
              <span>计划信息</span>
            </div>
            <el-row style="margin-bottom:18px">
              <el-row>
                <span v-text="this.xmPhase.mngUsername"></span>
              </el-row>
              <el-row>
                <span>计划管理员</span>
              </el-row>
            </el-row>
            <el-row style="margin-bottom:18px">
              <el-col :span="8" @click="">
                <div class="item">
                  <div class="icon" style="background-color:  rgb(79, 140, 255);">
                    <i class="el-icon-right"></i>
                  </div>
                  <div class="info">
                    <div v-text="this.xmPhase.taskCnt"></div>
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
                    <div v-text="this.xmPhase.finishTaskCnt" >
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
                  <div v-text="phaseBeginDate+'~'+phaseEndDate">
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
                  <div class="title"> 创建时间： {{this.phaseCreateDate}}</div>
                </div>
              </div>
            </el-row>
            <el-row style="margin-bottom:18px">
              <div class="item">
                <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                  <i class="el-icon-refresh"></i>
                </div>
                <div class="info">
                  <div class="title"> 关联迭代数： {{(this.xmPhase.iterationCnt)}} </div>
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
        <el-col :span="12" >
          <el-card class="box-card" style="padding:0px ;height:425px">
            <div slot="header" class="clearfix">
              <span>计划工时</span>
            </div>
            <div>
              <el-row style="padding:25px;">
                <div class="item">
                  <el-col :span="8">
                    <div>
                      <div style="text-align:center;">
                        <span style="font-size:24px;" v-text="this.xmPhase.budgetWorkload"></span>
                        <span style="font-size:5px;">h</span>
                      </div>
                      <div style="text-align:center;font-size:5px;">预估工时</div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <div style="text-align:center;">
                        <span style="font-size:24px;" v-text="this.xmPhase.actWorkload"></span>
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
              <el-row style="padding:25px;">
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
      </el-row>
      <el-row :gutter="10" style="margin-bottom:10px">
        <el-col :span="12" >
          <el-card class="box-card" style="height:425px">
            <div slot="header" class="clearfix">
              <span>总预算情况</span>
            </div>
            <div style="'100%'">
              <div id="costPieChart" :style="{width: '100%', height: '300px'}"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12" >
          <el-card class="box-card" style="height:425px">
            <div slot="header" class="clearfix">
              <span>工作量分布</span>
            </div>
            <div>
              <div id="workloadPie" :style="{width: '100%', height: '300px'}"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
import { mapGetters } from 'vuex'


export default {
  computed: {
    ...mapGetters(['userInfo','roles']),
    notStart: function() {
      return this.xmPhase.taskCnt-this.xmPhase.finishTaskCnt;
    },
    taskProgress: function (){
      if(this.xmPhase.actRate){
        return this.xmPhase.actRate;
      }else{
        return 0;
      }
    },
    phaseBeginDate: function (){
      if(this.xmPhase.beginDate){
        return this.xmPhase.beginDate.substring(0,10);
      } else{
        return '暂无';
      }
    },
    phaseEndDate: function (){
      if(this.xmPhase.endDate){
        return this.xmPhase.endDate.substring(0,10);
      } else{
        return '暂无';
      }
    },
    phaseCreateDate: function (){
      if(this.xmPhase.ctime){
        return this.xmPhase.ctime.substring(0,10);
      } else{
        return '暂无';
      }
    },
    workloadProgress:function (){
      return Math.round(this.xmPhase.actWorkload/this.xmPhase.budgetWorkload*100);
    },
    deviation:function (){
      let now = new Date();
      let startTime = new Date(this.xmPhase.beginDate);
      let endTime = new Date(this.xmPhase.endDate);
      if(now<=endTime){
        let allDays=endTime-startTime;
        return this.xmPhase.budgetWorkload - Math.round((now-startTime)/allDays*this.xmPhase.budgetWorkload)
      }else{
        return this.xmPhase.actWorkload - this.xmPhase.budgetWorkload;
      }
    },
    deviationRate:function (){
      return Math.round(this.deviation/this.xmPhase.budgetWorkload*100);
    },
    remainWorkload:function (){
      return this.xmPhase.budgetWorkload - this.xmPhase.actWorkload;
    },
    planProgress:function (){
      let now = new Date();
      let startTime = new Date(this.xmPhase.beginDate);
      let endTime = new Date(this.xmPhase.endDate);
      if(now<=endTime){
        let allDays=endTime-startTime;
        return Math.round((now-startTime)/allDays*100)
      }else{
        return 100;
      }
    },
    realProgress:function (){
      if(this.xmPhase.actWorkload < this.xmPhase.budgetWorkload){
        return Math.round(this.xmPhase.actWorkload/this.xmPhase.budgetWorkload*100)
      }else{
        return 100;
      }
    },
    xmPhaseCpd(){
      return this.xmPhase
    },

  },

  props:['xmPhase'],
  watch:{
    xmPhaseCpd:function(){
      this.drawCostPie();
      this.drawWorkloadPie();
    }
  },
  data() {
    return {
    };
  },

  methods:{
    drawCostPie() {
      let costPieChart = this.$echarts.init(document.getElementById("costPieChart"));
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
              {value: this.xmPhase.budgetNouserAt,
                itemStyle: {
                  normal:{
                    color: '#5470C6'
                  }
                },
                name: '非人力'},
              {value: this.xmPhase.budgetIuserAt,
                itemStyle: {
                  normal:{
                    color: '#73C0DE'
                  }
                },
                name: '内部人力'},
              {value: this.xmPhase.budgetOuserAt,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
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
      costPieChart.setOption(option);
    },
    drawWorkloadPie() {
      let workloadPie = this.$echarts.init(document.getElementById("workloadPie"));
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
              {value: this.xmPhase.budgetIuserWorkload,
                itemStyle: {
                  normal:{
                    color: '#5470C6'
                  }
                },
                name: '内部人力'},
              {value: this.xmPhase.budgetOuserWorkload,
                itemStyle: {
                  normal:{
                    color: '#73C0DE'
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
      workloadPie.setOption(option);
    },
  },

  mounted() {
    this.$nextTick(() => {
    });
    this.drawCostPie();
    this.drawWorkloadPie();
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
