<template>
  <div id="ranking-board">
    <div class="ranking-board-title">{{title}}</div>
    <dv-scroll-ranking-board :config="config" />
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
         
         var config={
           data:data
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
        rowNum: 9
      }
    }
  }
}
</script>

<style lang="less">
#ranking-board {
  width: 20%;
  box-shadow: 0 0 3px blue;
  display: flex;
  flex-direction: column;
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(1, 153, 209, .5);
  box-sizing: border-box;
  padding: 0px 30px;

  .ranking-board-title {
    font-weight: bold;
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 20px;
  }

  .dv-scroll-ranking-board {
    flex: 1;
  }
}
</style>
