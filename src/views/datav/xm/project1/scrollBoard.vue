<template>
  <div class="scroll-board">
    <dv-scroll-board :config="myConfig" />
  </div>
</template>

<script>
export default {
  name: 'ScrollBoard1',
  props:['data','header'],
  computed:{
    myConfig(){
      if(this.data && this.data.length>0){
        var config=JSON.parse(JSON.stringify(this.config));
        this.data.forEach(d => {
          d.forEach((text, index) => {
            d[index] = `<span style="font-size:16px;">${text}</span>`;
          });
        });
        config.header=this.header
        config.data=this.data
        return config; 
      }else{
        return this.config
      }
    }
  },
  data () {
    return {
      config: {
        header: ['时间', '项目', '金额', '变动情况'],
        data: [
          ['2019-07-01 19:25:00', '唛萌项目管理工具', '500万元', '立项'],
          ['2019-07-02 17:25:00', '唛盟商城项目', '300万元', '通过验收'],
          ['2019-07-03 16:25:00', '唛萌营销项目', '200万元', '测试完成'],
          ['2019-07-04 15:25:00', '组织管理系统项目', '100万', '竞标中'],
          ['2019-07-05 14:25:00', '支付管理系统', '700万元', '完成第一里程碑'],
          ['2019-07-06 13:25:00', '溯源系统', '300万元', '系统对接完成'],
          ['2019-07-07 12:25:00', '智能办公系统', '400万元', '试运行中'],
          ['2019-07-08 11:25:00', '数据可视化系统', '600万元', '开发中'],
          ['2019-07-09 10:25:00', '党建系统', '500万元', '上线成功'],
          ['2019-07-10 09:25:00', '智慧社区系统', '300万元', '运营中']
        ],
        index: true,
        columnWidth: [50, 150, 100,200,200],
        align: ['center'],
        rowNum: 7,
        headerBGC: '#1981f6',
        headerHeight: 45,
        oddRowBGC: 'rgba(0, 44, 81, 0.8)',
        evenRowBGC: 'rgba(10, 29, 50, 0.8)',
      }
    }
  }
}
</script>

<style lang="less">
.scroll-board {
  width: 100%;
  box-sizing: border-box;
  margin-left: 10px;
  height: 100%;
  overflow: hidden;
}
</style>
