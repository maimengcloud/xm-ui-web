<template>
  <div class="m_container">  
    <div class="message_content" v-if="notifyMsgs.length>0" v-loading="load.list" 
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <div class="message_content_box" v-for="(item, index) in notifyMsgs" :key="index" @click="goToPage(item)">
         <p class="date"> 发送者: <span style="font-size:14px;">{{item.sendUsername}}</span> &nbsp;&nbsp;发送时间： <span style="font-size:14px;">{{item.operTime}}</span> <el-tag :type="item.hadRead=='1'?'primary':'danger'">{{item.hadRead=='1'?'已读':'未读'}}</el-tag> </p> 
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
    <div  class="message_content_box" v-else v-loading="load.list"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-result icon="success"  subTitle="暂时没有消息"> 
      </el-result>
    </div>
    
  </div>
</template>

<script>  
	import {
		getNoticeMsg,goToPage
	} from '@/api/cpd'
  
	import {
		editSomeFieldsNotifyMsg
	} from '@/api/mdp/sys/notifyMsg'
import { mapGetters } from 'vuex'
export default {
  props:['msgClass'],
  computed: {
      ...mapGetters(['userInfo']),
      noticeMsg() {
        return this.$store.getters.noticeMsg
      },
  },
  data() {
    return {  
      load:{list:false},
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
      this.load.list=true
      getNoticeMsg(params).then(res=>{
        this.load.list=false
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
          this.$store.dispatch("setNoticeMsg",this.notifyMsgs)
        })
      }
      goToPage(this,item);
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