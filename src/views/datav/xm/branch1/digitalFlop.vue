<template>
  <div class="flop">
    <div
      class="digital-flop-item" 
      v-for="item in myData"
      :key="item.title"
    >
      <p class="digital-flop-title">{{ item.title }}</p>
      <div class="digital-flop">
        <dv-digital-flop
          :config="item.number"
          style="width:100px; height:50px;"
        />
          <span class="unit">{{ item.unit }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DigitalFlop',
  data () {
    return {
      defaultDigitalFlopData: []
    }
  },
  computed:{
    myData(){
      if(this.data){
        return this.data
      }else{
        return  this.defaultDigitalFlopData
      }
    }
  },
  props:['data'],
  methods: {
    createData () {
      const { randomExtend } = this
      
      this.defaultDigitalFlopData = [ 
        {
          title: '累计金额',
          number: {
            number: [randomExtend(5000000, 10000000000000)],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#40faee',
              fontWeight: 'bold'
            }
          },
          unit: '元'
        },
        {
          title: '发布总任务数',
          number: {
            number: [randomExtend(20000, 30000)],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '项目',
          number: {
            number: [randomExtend(200, 300)],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#f46827',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '参与人数',
          number: {
            number: [randomExtend(2000, 3000)],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#40faee',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '客户',
          number: {
            number: [randomExtend(100, 200)],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '需求',
          number: {
            number: [randomExtend(5000, 100000)],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#f46827',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '产品',
          number: {
            number: [randomExtend(50, 100)],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#40faee',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '测试用例',
          number: {
            number: [randomExtend(5000, 100000)],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '迭代',
          number: {
            number: [randomExtend(500, 10000)],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#f46827',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        }
      ]
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

<style lang="less" scoped>
.flop {
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: space-between;
  background-color: rgba(13,20,39,0.5);
  .digital-flop-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-left: 3px solid rgb(6, 30, 93);
    border-right: 3px solid rgb(6, 30, 93);
  }

  .digital-flop-title {
    font-size: 24px;
    margin:20px 20px 10px 20px;
  }

  .digital-flop {
    display: flex;
    text-align: center;
  }

  .unit {
    margin-left: 10px;
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
    padding-bottom: 13px;
  }
}
</style>
