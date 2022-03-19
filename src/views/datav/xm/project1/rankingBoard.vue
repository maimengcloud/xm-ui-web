<template>
  <div class="ranking-board">
    <span class="ranking-board-title">{{title}}</span>
    <dv-scroll-ranking-board  :config="config"/>
  </div>
</template>

<script>
export default {
  name: 'RankingBoard',
  props:['data','title'],
  computed:{
    config(){
      if( !this.data || this.data.length==0){
        return this.defaultConfig;
      }else{
        var data=this.data;
        data.forEach(element => {
          element.name = `<span style="font-size:16px;">${element.name}</span>`
        });
        var config={
          data:data,
          carousel: "page"
        }
        return config
      }
    }
  },
  data () {
    return {
      defaultConfig: {
        data: [
          {
            name: '商城项目',
            value: '30%'
          },
          {
            name: '营销项目',
            value: '40%'
          },
          {
            name: '支付项目',
            value: '50%'
          },
          {
            name: '短信项目',
            value: '60%'
          },
          {
            name: '党建项目',
            value: '50%'
          },
          {
            name: '协同办公项目',
            value: '90%'
          },
          {
            name: '即聊项目',
            value: '40%'
          },
          {
            name: '审计项目',
            value: '60%'
          },
          {
            name: '溯源项目',
            value: '90%'
          }
        ],
        rowNum: 9,

      }
    }
  }
}
</script>

<style lang="less" scoped>
.ranking-board {
  width: 300px;
  height: 100%;
  box-shadow: 0 0 3px blue;
  display: flex;
  flex-direction: column;
  background-color: rgba(10, 13, 28, 0.5);
  border-top: 2px solid rgba(1, 153, 209, .5);
  box-sizing: border-box;
  padding: 0px 30px;

  .ranking-board-title {
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 700;
  }

  .dv-scroll-ranking-board {
    flex: 1;
  }
}
</style>
