<template v-loadding="load.list">

      <el-dropdown trigger="hover"  class="avatar-container"  @command="handleNoticeMsgClick">
         <div class="avatar-wrapper">
           <el-badge :value="noticeMsg.totalNum" class="item">
              <img class="user-avatar" src="../../assets/image/platform/module-notice.png">
           </el-badge>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="toPay" >待付款订单(<font color=red>{{noticeMsg.toPayNum}}</font>)</el-dropdown-item>
          <el-dropdown-item command="toSend" >待发货订单(<font color=red>{{noticeMsg.toSendNum}}</font>)</el-dropdown-item>
          <el-dropdown-item command="toRece" >待收货订单(<font color=red>{{noticeMsg.hadSendNum}}</font>)</el-dropdown-item>
          <!--<el-dropdown-item command="hadFinish" >已完成订单(<font color=red>{{noticeMsg.hadFinishNum}}</font>)</el-dropdown-item>-->
          <!-- <el-dropdown-item command="hadCancel" >已取消订单(<font color=red>{{noticeMsg.hadCancelNum}}</font>)</el-dropdown-item>-->
          <el-dropdown-item command="toApprova" >待审核订单(<font color=red>{{noticeMsg.toApprovaNum}}</font>)</el-dropdown-item>
          <!-- <el-dropdown-item command="hadApprova" >已审核订单(<font color=red>{{noticeMsg.hadApprovaNum}}</font>)</el-dropdown-item> -->
          <el-dropdown-item command="doGetNoticeMsg" >刷新 </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
</template>

<script>
	import {
		getNoticeMsg
	} from '@/api/cpd'
export default {
  computed: {
    noticeMsg() {
      return this.$store.getters.noticeMsg
    }
  },
  data(){
    return {
      load:{list:false},
      commandLinks:[
        {command:'toPay',path:'/mallm/OrderCenter/orders/OrdersMng',query:null,params:null},
        {command:'toSend',path:'/mallm/OrderCenter/orders/OrdersDeliver',query:null,params:null},
        {command:'toRece',path:'/mallm/OrderCenter/orders/OrdersReceiptConfirm',query:null,params:null},
        {command:'hadFinish',path:'/mallm/OrderCenter/orders/OrdersMng',query:null,params:null},
        {command:'hadCancel',path:'/mallm/OrderCenter/orders/OrdersMng',query:null,params:null},
        {command:'toApprova',path:'/mallm/OrderCenter/orders/OrdersMngBizFlow',query:null,params:null},
        {command:'hadApprova',path:'/mallm/OrderCenter/orders/OrdersMngBizFlow',query:null,params:null},
        {command:'hadclose',path:'/mallm/OrderCenter/orders/OrdersMng',query:null,params:null},
      ]
    }
  },
  methods: {
    doGetNoticeMsg(){
      this.load.list=true;
       getNoticeMsg({}).then(res=>{
         this.load.list=false;
           var tips = res.data.tips;
           if(tips.isOk){
             this.$message.success("刷新数据成功")
             this.$store.dispatch("setNoticeMsg",res.data.data)
           }else{
             this.$message.error(tips.msg)
           }
         })
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
    handleNoticeMsgClick(command) {
       if(command=='doGetNoticeMsg'){
        this.doGetNoticeMsg();
       }else{
         if(this.commandLinks.some(c=>c.command==command)){
          var link=this.commandLinks.find(c=>c.command==command)
          if(link==null || !link.path){
            return;
          }
          this.$store.dispatch("FindRouter",link.path).then(res=>{
            if(res==null){
              this.$message.error("该链接已不存在或者您无权限访问")
              return
            }else{
              this.$router.push({path:res.fullPath,query:res.query,params:res.params});
            }
          })
         }else{

         }
       }
    }
  },
  mounted(){
    this.doGetNoticeMsgNoTips()
  }
}
</script>

<style rel="stylesheet/scss"  lang="scss" scoped>
.avatar-container {
  height: 50px;
  .avatar-wrapper {
    cursor: pointer;
    margin-top: 8px;
    position: relative;
    .user-avatar {
      height: 30px;
      border-radius: 10px;
    }
    .el-icon-caret-bottom {
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
</style>


