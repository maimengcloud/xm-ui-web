<template>
  <div class="m_container">  
    <div class="message_content" v-if="notifyMsgs.length>0">
      <div class="message_content_box" v-for="(item, index) in notifyMsgs" :key="index" @click="goToPage(item)">
         <p class="date"><strong>发送者:</strong><span style="font-size:14px;">{{item.sendUsername}}</span> <strong>&nbsp;&nbsp;发送时间：</strong> <span style="font-size:14px;">{{item.operTime}}</span> <el-tag :type="item.hadRead=='1'?'primary':'danger'">{{item.hadRead=='1'?'已读':'未读'}}</el-tag> </p> 
        <span class="text">{{item.msg}}</span>
        <div class="line"></div>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        layout="total, prev, pager, next"
        :total="pageInfo.total">
      </el-pagination>
    </div> 
    <div  class="message_content_box" v-else>
      <el-result icon="success"  subTitle="暂时没有消息"> 
      </el-result>
    </div>
  </div>
</template>

<script>  
	import {
		getNoticeMsg
	} from '@/api/cpd'
  
	import {
		editSomeFieldsNotifyMsg
	} from '@/api/mdp/sys/notifyMsg'
import { mapGetters } from 'vuex'
export default {
  props:['msgClass'],
  computed: {
      ...mapGetters(['userInfo']),

  },
  data() {
    return {  
      notifyMsgs:[],
      
      pageInfo:{//分页数据
          total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
          pageSize:10,//每页数据
          count:false,//是否需要重新计算总记录数
          pageNum:1,//当前页码、从1开始计算
          orderFields:['oper_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
          orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
    }
  },

  methods:{
    
    handleSizeChange(pageSize) {
        this.pageInfo.pageSize=pageSize;
        this.getNoticeMsg();
    },
    handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getNoticeMsg();
    },
    searchNoticeMsg(){
      this.pageInfo.count=true;
      this.getNoticeMsg();
    },
    getNoticeMsg(){
      let params = {
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum,
          total: this.pageInfo.total,
          count:this.pageInfo.count
      };
      if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
          let orderBys=[];
          for(var i=0;i<this.pageInfo.orderFields.length;i++){
              orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
          }
          params.orderBy= orderBys.join(",")
      }  
      params.toUserid=this.userInfo.userid 
      getNoticeMsg(params).then(res=>{
        this.notifyMsgs=res.data.data;
        this.pageInfo.total=res.data.total
        this.pageInfo.count=false;
      })
    },
    /**
     * objType:对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代-6/团队-7
     * 
     */
    goToPage(item){
      if(item.hadRead!='1'){
        editSomeFieldsNotifyMsg({ids:[item.id],hadRead:'1'}).then(res=>{
          item.hadRead="1"
        })
      }
      var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net 
      if(item.objType=='1'){
        if(process.env.CONTEXT=='xm'){
          this.$router.push({path:"/xm/core/xmProject/XmProjectInfoRoute",query:{id:item.bizId}})
        }else{
          window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmProject/XmProjectInfoRoute?id="+item.bizId)
        }
      }else if(item.objType=='2'){
        if(process.env.CONTEXT=='xm'){
          this.$router.push({path:"/xm/core/xmTask/XmTaskDetailRoute",query:{id:item.bizId}})
        }else{
          window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmTask/XmTaskDetailRoute?id="+item.bizId)
        }
      }else if(item.objType=='3'){
        if(process.env.CONTEXT=='xm'){
          this.$router.push({path:"/xm/core/xmProduct/XmProductInfoRoute",query:{id:item.bizId}})
        }else{
          window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmProduct/XmProductInfoRoute?id="+item.bizId)
        }
      }else if(item.objType=='4'){
        if(process.env.CONTEXT=='xm'){
          this.$router.push({path:"/xm/core/xmMenu/XmMenuDetailRoute",query:{menuId:item.bizId}})
        }else{
          window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmMenu/XmMenuDetailRoute?menuId="+item.bizId)
        }
      }else if(item.objType=='5'){
        if(process.env.CONTEXT=='xm'){
          this.$router.push({path:"/xm/core/xmQuestion/XmQuestionDetailRoute",query:{id:item.bizId}})
        }else{
          window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmQuestion/XmQuestionDetailRoute?id="+item.bizId)
        }
      }else if(item.objType=='6'){
        if(process.env.CONTEXT=='xm'){
          this.$router.push({path:"/xm/core/xmIteration/XmIterationInfoRoute",query:{id:item.bizId}})
        }else{
          window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmIteration/XmIterationInfoRoute?id="+item.bizId)
        }
      }else if(item.objType=='7'){
        if(process.env.CONTEXT=='xm'){
          this.$router.push({path:"/xm/core/xmGroup/xmGroupRoute",query:{projectId:item.pbizId}})
        }else{
          window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmGroup/xmGroupRoute?projectId="+item.pbizId)
        }
      }
    }
  },

  mounted() {
     this.searchNoticeMsg();
  }

}
</script>

<style lang="scss" scoped>
@import '../common.scss';
@import './index.scss';
</style>