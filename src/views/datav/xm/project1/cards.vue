<template>
  <div class="d_cards"> 
    <div
      class="card-item"
      v-for="(card, i) in myData"
      :key="card.title"
    >
      <div class="card-header">
        <div class="card-header-left">{{ card.title }}</div>
        <div class="card-header-right">{{ '0' + (i + 1) }}</div>
      </div>
      <dv-charts class="ring-charts" :option="card.ring" />
      <div class="card-footer">
        <div class="card-footer-item">
          <div class="footer-title">总工作量</div>
          <div class="footer-detail">
            <dv-digital-flop :config="card.total" style="width:65%;height:35px;" />
            <span style="font-size: 16px">人时</span>
          </div>
        </div>
        <div class="card-footer-item">
          <div class="footer-title">当前进度</div>
          <div class="footer-detail">
            <dv-digital-flop :config="card.num" style="width:65%;height:35px;" />%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cards',
  props:['data'],
  computed:{
    myData(){
      if(this.data && this.data.length>0){
       var cards= this.data.map(i=>{
           var card=JSON.parse(JSON.stringify(this.cardConfig))
           card.title=i.name 
           card.total.number=[i.budgetWorkload];//累计工作量 人月
           card.num.number=[i.actRate];//当前进度
           //资金占比
           card.ring.series[0].data[0].value=(i.budgetWorkload/i.totalPlanWorkload) //工作量占比
           console.log(card, "");
           return card
        });
        return cards;
      }else{
        return this.cards;
      }
    }
  },
  data () {
    return {
      cards: [],
      cardConfig:{
        title: '',
        total: {
          number: [10],
          content: '{nt}',
          textAlign: 'right',
          style: {
            fill: '#ea6027',
            fontWeight: 'bold',
            fontSize: 24
          }
        },
        num: {
          number: [20],
          content: '{nt}',
          textAlign: 'right',
          style: {
            fill: '#26fcd8',
            fontWeight: 'bold',
            fontSize: 26
          }
        },
        ring: {
          series: [
            {
              type: 'gauge',
              startAngle: -Math.PI / 2,
              endAngle: Math.PI * 1.5,
              arcLineWidth: 13,
              radius: '80%',
              data: [
                { name: '工作量占比', value: 22 }
              ],
              axisLabel: {
                show: false
              },
              axisTick: {
                show: false
              },
              pointer: {
                show: false
              },
              backgroundArc: {
                style: {
                  stroke: '#224590'
                }
              },
              details: {
                show: true,
                formatter: '工作量占比{value}%',
                style: {
                  fill: '#1ed3e5',
                  fontSize: 20
                }
              }
            }
          ],
          color: ['#03d3ec']
        }
      }
    }
  },
  methods: {
    createData () {
      const { randomExtend } = this
      const productNames=['商城','营销','项目管理工具','支付','智慧党建']
      this.cards = new Array(5).fill(0).map((foo, i) => ({
        title: productNames[i],
        total: {
          number: [randomExtend(90, 100)],
          content: '{nt}',
          textAlign: 'right',
          style: {
            fill: '#ea6027',
            fontWeight: 'bold'
          }
        },
        num: {
          number: [randomExtend(30, 60)],
          content: '{nt}',
          textAlign: 'right',
          style: {
            fill: '#26fcd8',
            fontWeight: 'bold'
          }
        },
        ring: {
          series: [
            {
              type: 'gauge',
              startAngle: -Math.PI / 2,
              endAngle: Math.PI * 1.5,
              arcLineWidth: 13,
              radius: '80%',
              data: [
                { name: '资金占比', value: randomExtend(40, 60) }
              ],
              axisLabel: {
                show: false
              },
              axisTick: {
                show: false
              },
              pointer: {
                show: false
              },
              backgroundArc: {
                style: {
                  stroke: '#224590'
                }
              },
              details: {
                show: true,
                formatter: '资金占比{value}%',
                style: {
                  fill: '#1ed3e5',
                  fontSize: 20
                }
              }
            }
          ],
          color: ['#03d3ec']
        }
      }))
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
    setInterval(this.createData, 300)
  }
}
</script>

<style lang="less">
.d_cards {
  display: flex;
  width: 100%;
  justify-content: space-between;
  height: 100%;
  margin-left: 15px;
  margin-top: 10px;

  .card-item {
    background-color: rgba(6, 30, 93, 0.5);
    border-top: 2px solid rgba(1, 153, 209, .5);
    width: 19%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .card-header {
    display: flex;
    height: 20%;
    align-items: center;
    justify-content: space-between;

    .card-header-left {
      font-size: 18px;
      font-weight: bold;
      padding-left: 20px;
    }

    .card-header-right {
      padding-right: 20px;
      font-size: 40px;
      color: #03d3ec;
    }
  }

  .ring-charts {
    height: 55%;
  }

  .card-footer {
    height: 25%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .card-footer-item {
    // padding: 5px 5px 0px 10px;
    box-sizing: border-box;
    width: 46% !important;
    background-color: rgba(6, 30, 93, 0.7);
    border-radius: 3px;

    .footer-title {
      font-size: 15px;
      margin-bottom: 5px;
    }
    .footer-detail {
      color: #1294fb;
      display: flex;
      font-size: 18px;
      align-items: center;
      .dv-digital-flop {
        margin-right: 5px;
      }
    }
  }
}
</style>
