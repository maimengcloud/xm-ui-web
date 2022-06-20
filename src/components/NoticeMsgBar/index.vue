<template v-loadding="load.list">
    <!--
    <el-dropdown trigger="hover"  class="avatar-container"  @command="handleNoticeMsgClick">
      <div class="avatar-wrapper" @click="goToMsgCenter">
          <i class="el-icon-bell"></i>
          <span>消息中心</span> 
      </div> 
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="toPay" >待付款订单(<font color=red>{{noticeMsg.toPayNum || 0}}</font>)</el-dropdown-item>
        <el-dropdown-item command="toSend" >待发货订单(<font color=red>{{noticeMsg.toSendNum || 0}}</font>)</el-dropdown-item>
        <el-dropdown-item command="toRece" >待收货订单(<font color=red>{{noticeMsg.hadSendNum || 0}}</font>)</el-dropdown-item>
        <el-dropdown-item command="hadFinish" >已完成订单(<font color=red>{{noticeMsg.hadFinishNum}}</font>)</el-dropdown-item>
        <el-dropdown-item command="hadCancel" >已取消订单(<font color=red>{{noticeMsg.hadCancelNum}}</font>)</el-dropdown-item>
        <el-dropdown-item command="toApprova" >待审核订单(<font color=red>{{noticeMsg.toApprovaNum || 0}}</font>)</el-dropdown-item>
       <el-dropdown-item command="hadApprova" >已审核订单(<font color=red>{{noticeMsg.hadApprovaNum}}</font>)</el-dropdown-item>
        <el-dropdown-item command="doGetNoticeMsg" >刷新 </el-dropdown-item>
      </el-dropdown-menu> 
    </el-dropdown>
    -->
    
      <div class="notify-box" > 
          <el-link @click="goToMsgCenter"><el-badge :value="unreadMsgCount"><i class="el-icon-bell"></i>消息中心</el-badge></el-link> 
      </div>  
</template>

<script>
	import {
		getNoticeMsg
	} from '@/api/cpd'
export default {
  computed: {
    noticeMsg() {
      return this.$store.getters.noticeMsg
    },
    unreadMsgCount(){
      var msgs=this.$store.getters.noticeMsg
      if(!msgs){
        return 0;
      }
      return msgs.filter(k=>k.hadRead!='1').length;
    }
  },
  data(){
    return {
      load:{list:false}, 
    }
  },
  methods: {
    goToMsgCenter(){ 
      this.$router.push({path:"/my/work/message"});
    },  
     
    doGetNoticeMsgNoTips(){
      this.load.list=true;
       getNoticeMsg({}).then(res=>{
         this.load.list=false;
           var tips = res.data.tips;
           if(tips.isOk){
             this.$store.dispatch("setNoticeMsg",res.data.data)
           }else{
             this.$message.error(tips.msg)
           }
         })
    }, 
  },
  mounted(){
    this.doGetNoticeMsgNoTips()
  }
}
</script>

<style rel="stylesheet/scss"  lang="scss" scoped>
.notify-box {
  margin-top:0px;
  margin-right:10px;
}
</style>


