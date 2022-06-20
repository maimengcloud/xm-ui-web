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
		editSomeFieldsNotifyMsg
	} from '@/api/mdp/sys/notifyMsg'
	import {
		getNoticeMsg,goToPage
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
  watch:{
    unreadMsgCount(count,old){ 
       var that = this;
       if(old>count){
        return;
       }
      if(count>1){
        this.$notify.warning({title:'未读消息',message:'有'+count+'条未读消息待处理',showClose:true,position:'bottom-right',
          onClick:function(){
            that.goToMsgCenter();
          }
        })
      }else if(count==1){
        var msgObj=this.noticeMsg.filter(k=>k.hadRead!='1')[0]
         that.$notify.warning({title:'未读消息',message:msgObj.msg,showClose:true,position:'bottom-right',
          onClick:function(){
            that.goToPage(msgObj);
          }
        })
      }
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
    goToPage(item){
      if(item.hadRead!='1'){
        editSomeFieldsNotifyMsg({ids:[item.id],hadRead:'1'}).then(res=>{
          item.hadRead="1"
          this.$store.dispatch("setNoticeMsg",this.notifyMsgs)
        })
      }
      goToPage(this,item);
    },
    doGetNoticeMsgNoTips(){
      this.load.list=true;
       getNoticeMsg({pageSize:20,pageNum:1,count:false,orderBy:'oper_time desc'}).then(res=>{
         this.load.list=false;
           var tips = res.data.tips;
           if(tips.isOk){
             this.$store.dispatch("setNoticeMsg",res.data.data)
           }else{
             this.$message.error(tips.msg)
           }
         })
    }, 
    doGetNoticeMsgNoRead(){
      this.load.list=true;
       getNoticeMsg({hadRead:'0',pageSize:20,pageNum:1,count:false,orderBy:'oper_time desc'}).then(res=>{
         this.load.list=false;
           var tips = res.data.tips;
           if(tips.isOk&&res.data.data.length>0){
             this.$store.dispatch("setNoticeMsg",res.data.data)
           }else if(!tips.isOk){
             this.$message.error(tips.msg)
           }
         })
    }, 
  },
  mounted(){
    this.doGetNoticeMsgNoTips()
    //setInterval(this.doGetNoticeMsgNoRead, 60000 * 5);
    setInterval(this.doGetNoticeMsgNoRead, 5000);
  }
}
</script>

<style rel="stylesheet/scss"  lang="scss" scoped>
.notify-box {
  margin-top:0px;
  margin-right:10px;
}
</style>


