<template>
  <section class="page-container padding">
<!--    <el-row  class="page-header page-height-10">
      <el-col :xs="22" :sm="22" :md="23" :lg="23" :xl="23">
          <span >项目总览</span>
      </el-col>
    </el-row>-->
    <el-row class="page-main page-height-75" style="overflow-x: hidden;">
      <el-row :gutter="10" style="margin-bottom:10px">
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
                      <div v-text="totalTask"></div>
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
                      <div v-text="finish" >
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
                    <div v-text="taskStartTime+'~'+taskEndTime">
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
                    <div class="title"> 需求数： {{this.selProject.menuCnt}}</div>
                  </div>
                </div>
              </el-row>
              <el-row style="margin-bottom:18px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-refresh"></i>
                  </div>
                  <div class="info">
                    <div class="title"> 迭代数： {{(this.selProject.iterationCnt==null?0:this.selProject.iterationCnt)}} </div>
                  </div>
                </div>
              </el-row>
              <el-row style="margin-bottom:18px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                    <i class="el-icon-alarm-clock"></i>
                  </div>
                  <div>
                    <div class="info">
                      <el-progress v-if="progress1" :percentage="progress1"></el-progress>
                    </div>
                    <div class="title">任务进度</div>
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
                <div id="allChart" :style="{width: '425px', height: '350px'}"></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <div slot="header" class="clearfix">
                <span>缺陷情况</span>
              </div>
              <div>
                <div id="bugPieChart" :style="{width: '425px', height: '400px'}"></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      <el-row :gutter="10" style="margin-bottom:10px">
          <el-col :span="12" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header" class="clearfix">
                <span>任务每日状态趋势</span>
              </div>
              <div>
                <div id="taskChart" :style="{width: '630px', height: '320px'}"></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <div slot="header" class="clearfix">
                <span>项目工时</span>
              </div>
              <div>
                <el-row style="padding:25px;">
                  <div class="item">
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.selProject.totalPlanWorkload"></span>
                          <span style="font-size:5px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:5px;">预估工时</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.selProject.totalActWorkload"></span>
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
                  <el-progress style="width: 600px;margin-left:20px;margin-top: 10px;margin-bottom: 20px;" :text-inside="true" :stroke-width="24" :percentage="planProgress"></el-progress>
                </el-row>
                <el-row>
                  <span style="margin-left:20px;">项目实际进度</span>
                  <el-progress style="width: 600px;margin-left:20px;margin-top: 10px;" :text-inside="true" :stroke-width="24" :percentage="realProgress"></el-progress>
                </el-row>

              </div>
            </el-card>
          </el-col>
        </el-row>
      <el-row style="margin-bottom:10px">
        <el-card class="box-card" style="padding:0px ;height:200px">
          <div slot="header" class="clearfix" style="margin-bottom:10px">
            <span>项目阶段</span>
          </div>
          <div>
            <el-row style="padding:10px">
              <el-steps :active="calcProjectStatusStep" finish-status="success">
                <el-step  v-for="(i,index) in options['projectStatus']" :title="i.optionName" :key="index">
                  <el-row slot="title" @click.native.stop="editForm.status=i.optionValue">
                    {{i.optionName}}
                  </el-row>
                </el-step>
              </el-steps>
            </el-row>
          </div>
        </el-card>
      </el-row>
    </el-row>

  </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex";
//import { listXmProjectState } from '@/api/xm/core/xmProjectState';
import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询


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
    taskStartTime: function (){
      return this.selProject.startTime.substring(0,10);
    },
    taskEndTime: function (){
      return this.selProject.endTime.substring(0,10);
    },
    taskMng: function (){
      return this.selProject.createUsername;
    },
    workloadProgress:function (){
      return Math.round(this.selProject.totalActWorkload/this.selProject.totalPlanWorkload*100);
    },
    deviation:function (){
      let now = new Date();
      let taskStartTime = new Date(this.selProject.startTime);
      let taskEndTime = new Date(this.selProject.endTime);
      if(now<=taskEndTime){
        let allDays=taskEndTime-taskStartTime;
        return this.selProject.totalActWorkload - Math.round((now-taskStartTime)/allDays*this.selProject.totalPlanWorkload)
      }else{
        return this.selProject.totalActWorkload - this.selProject.totalPlanWorkload;
      }
    },
    deviationRate:function (){
      return Math.round(this.deviation/this.selProject.totalPlanWorkload*100);
    },
    remainWorkload:function (){
      return this.selProject.totalPlanWorkload - this.selProject.totalActWorkload;
    },
    planProgress:function (){
      let now = new Date();
      let taskStartTime = new Date(this.selProject.startTime);
      let taskEndTime = new Date(this.selProject.endTime);
      if(now<=taskEndTime){
        let allDays=taskEndTime-taskStartTime;
        return Math.round((now-taskStartTime)/allDays*100)
      }else{
        return 100;
      }
    },
    realProgress:function (){
      if(this.selProject.totalActWorkload < this.selProject.totalPlanWorkload){
        return Math.round(this.selProject.totalActWorkload/this.selProject.totalPlanWorkload*100)
      }else{
        return 100;
      }
    },
    xmProjectStateCpd(){
      return this.selProject
    },
    calcProjectStatusStep(){
      if(this.options['projectStatus'] && this.selProject){
        var index=this.options['projectStatus'].findIndex(i=>{
          if(i.optionValue==this.selProject.status){
            return true;
          }else{
            return false;
          }
        })
        return index+1;
      }else{
        return 0;
      }
    }

  },

  props:['selProject'],
  watch:{
    xmProjectStateCpd:function(){
      this.drawAllBar();
      this.drawTaskByDate();
      this.drawPieBug();
    }
  },
  data() {
    return {
      isActive: true,
      load:{ list: false},
      selProject:[],
      //xmProjectState: [],//查询结果
      options:{
        projectType:[],
        urgencyLevel:[],
        priority:[],
        projectStatus:[],
      },//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
    };
  },

  methods:{
    //获取对应的xmProjectsTate
    /*getXmProjectState(){
      let params = {
        projectId:this.selProject.id,
        branchId:this.userInfo.branchId
      };
      this.load.list = true;
      listXmProjectState(params).then((res) => {
        let tips=res.data.tips;
        if(tips.isOk){
          this.xmProjectState = res.data.data[0];
        }else{
          this.$message({showClose: true, message: tips.msg, type: 'error' });
        }
        this.load.list = false;
      }).catch( err => this.load.list = false );
    },*/

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
            data: [
              {
                value: this.selProject.menuCnt,
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
            radius: '68%',//饼图半径大小
            label:{            //饼图图形上的文本标签
              normal:{
                show:true,
                position:'inner', //标签的位置:内部
                textStyle : {
                  fontWeight : 120 ,
                  fontSize: document.body.clientWidth / 150, //标签字体大小
                  color: "#000000"
                },
                formatter:'{b} : {c} ({d}%)',//b：name,c:value,d:占比
                alignTo:'edge',
                margin:10
              }
            },
            data: [
              {value: this.selProject.totalClosedBugCnt,
                itemStyle: {
                  normal:{
                    color: '#5470C6'
                  }
                },
                name: '已关闭'},
              {value: this.selProject.totalResolvedBugCnt,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                },
                name: '已解决'},
              {value: this.selProject.totalActiveBugCnt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                },
                name: '已激活'},
              {value: this.selProject.totalConfirmedBugCnt,
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
    }
  },

  mounted() {
    this.$nextTick(() => {
      //this.getXmProjectState();
    });
    listOption([{categoryId:'all',itemCode:'projectType'},{categoryId:'all',itemCode:'urgencyLevel'},{categoryId:'all',itemCode:'priority'},{categoryId:'all',itemCode:'projectStatus'}] ).then(res=>{
      if(res.data.tips.isOk){
        this.options['projectType']=res.data.data.projectType
        this.options['urgencyLevel']=res.data.data.urgencyLevel
        this.options['priority']=res.data.data.priority
        this.options['projectStatus']=res.data.data.projectStatus
      }
    });
    this.drawAllBar();
    this.drawTaskByDate();
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
  width: 350px;
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
