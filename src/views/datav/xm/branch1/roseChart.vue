<template>
  <div class="rose-chart">
    <div class="rose-chart-title">{{title}}</div>
    <Echart
      :options="option"
      id="dv_roseChart"
      height="340px"
      width="100%"
    ></Echart>
  </div>
</template>
 
<script>
import Echart from '../common'
export default {
  name: 'RoseChart',
  props:['data','title'],
  components: {Echart},
  computed:{
    option(){
      if( !this.data || this.data.length==0){
        return this.defaultOption;
      }else{
         this.createData()
         let tempData = this.data.slice(0, 5);
         let obj = {name: '其它', value : 0};
         let v = 0;
         this.data.forEach((element,index) => {
            if(index > 5) {
              v += element.value;
            }
         });
         obj.value = v;
         if(obj.value > 0) {
          tempData.push(obj);
         }
         var option = JSON.parse(JSON.stringify(this.options))
         option.series[0].data = tempData
         option.legend.data = tempData
         return option 
      }
    }
  },
  data () {
    return {
      defaultOption: {},
      options : {
          color: [
            "#37a2da",
            "#32c5e9",
            "#9fe6b8",
            "#ffdb5c",
            "#ff9f7f",
            "#fb7293",
            "#e7bcf3"
          ],
          tooltip: {
            trigger: "item",
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            orient: "horizontal",
            icon: "circle",
            bottom: 0,
            x: "center",
            data:
              [
                { value: 40, name: 'rose 1' },
                { value: 38, name: 'rose 2' },
                { value: 32, name: 'rose 3' },
                { value: 30, name: 'rose 4' },
                { value: 28, name: 'rose 5' },
              ],
            textStyle: {
              color: "#fff",
              fontSize: 18
            }
          },
          calculable: true,
          series: [
            {
              type: 'pie',
              radius: [35, 80],
              center: ['50%', '45%'],
              roseType: 'area',
              data: [
                { value: 40, name: 'rose 1' },
                { value: 38, name: 'rose 2' },
                { value: 32, name: 'rose 3' },
                { value: 30, name: 'rose 4' },
                { value: 28, name: 'rose 5' },
              ]
            }
          ]
      }
    }
  },
  methods: {
    createData () {
      const { randomExtend } = this

      this.defaultOption = {
        series: [
          {
            type: 'pie',
            radius: '50%',
            roseSort: false,
            data: [
              { name: '需求', value: randomExtend(40, 70) },
              { name: '开发', value: randomExtend(20, 30) },
              { name: '测试', value: randomExtend(10, 50) },
              { name: '设计', value: randomExtend(5, 20) },
              { name: '运营', value: randomExtend(40, 50) },
              { name: '客服', value: randomExtend(20, 30) },
              { name: '管理', value: randomExtend(5, 10) },
              { name: '产品', value: randomExtend(20, 35) },
              { name: '运维', value: randomExtend(5, 10) }
            ],
            insideLabel: {
              show: false
            },
            outsideLabel: {
              formatter: '{name} {percent}%',
              labelLineEndLength: 20,
              style: {
                fill: '#fff'
              },
              labelLineStyle: {
                stroke: '#fff'
              }
            },
            roseType: true
          }
        ],
        color: ['#da2f00', '#fa3600', '#ff4411', '#ff724c', '#541200', '#801b00', '#a02200', '#5d1400', '#b72700']
      }
    },
    randomExtend (minNum, maxNum) {
      if (arguments.length === 1) {
        return parseInt(Math.random() * minNum + 1, 10)
      } else {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      }
    }
  },
  mounted () {
    const { createData } = this
    createData()
    setInterval(createData, 30000)
  }
}
</script>

<style lang="less">
.rose-chart {
  width: 450px;
  height: 400px;
  margin: 0 0px 0 15px;
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(1, 153, 209, .5);
  box-sizing: border-box;
  .rose-chart-title {
    height: 50px;
    font-weight: bold;
    text-indent: 20px;
    font-size: 20px;
    display: flex;
    align-items: center;
  }

  .dv-charts-container {
    height: calc(~"100% - 20px");
  }
}
</style>

