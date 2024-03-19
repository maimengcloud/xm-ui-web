<template>
  <div class="m_container">  
     
    <div class="message_content" v-if="notifyMsgs.length>0" v-loading="load.list" 
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
       <el-row>
            <el-button @click="filters.hadRead=''">全部</el-button><el-button @click="filters.hadRead='0'">未读消息</el-button><el-button @click="filters.hadRead='1'">已读信息</el-button><el-button @click="setAllHadRead" v-if="filters.hadRead!='1'">全部标记为已读</el-button>
      </el-row>
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
      
       <el-row>
            <el-button @click="filters.hadRead=''">全部</el-button><el-button @click="filters.hadRead='0'">未读消息</el-button><el-button @click="filters.hadRead='1'">已读信息</el-button><el-button @click="setAllHadRead" v-if="filters.hadRead!='1'">全部标记为已读</el-button>
      </el-row>
      <el-result icon="success"  subTitle="暂时没有消息"> 
      </el-result>
    </div>
    
  </div>
</template>

<script>    
import { mapGetters } from 'vuex'
export default {
  props:['msgClass'],
  computed: {
      ...mapGetters(['userInfo']),
  },
  data() {
    return {  
      load:{list:false},
      notifyMsgs:[],
      filters:{
        hadRead:'',
      },
      
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
  watch:{
    'filters.hadRead':function(){
      this.searchNoticeMsg();
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
      if(this.filters.hadRead){
        params.hadRead=this.filters.hadRead
      }
      params.toUserid=this.userInfo.userid 
      this.load.list=true
      this.$mdp.listNotifyMsg(params).then(res=>{
        this.load.list=false
        this.notifyMsgs=res.data.data;
        this.pageInfo.total=res.data.total
        this.pageInfo.count=false;
        if(this.filters.hadRead=='0'){ 
           this.$store.dispatch("setNoticeMsg",res.data)
        }
      })
    },
    /**
     * objType:对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代-6/团队-7
     * 
     */
    goToPage(item){
      if(item.hadRead!='1'){
        this.$mdp.editSomeFieldsNotifyMsg({$pks:[item.id],hadRead:'1'}).then(res=>{
          item.hadRead="1"
          var storeTotal=this.$store.getters.notifyMsg.total
          this.$store.dispatch("setNoticeMsg",{data:this.notifyMsgs,total:storeTotal>0?storeTotal-1:storeTotal})
        })
      }
      if(item.url){
        this.$mdp.openWin(item.url)
      }
    },
    setAllHadRead(){
      var ids=this.notifyMsgs.filter(k=>k.hadRead!=='1').map(i=>i.id)
      if(ids.length<=0){
        return;
      }
      this.$mdp.editSomeFieldsNotifyMsg({$pks:ids,hadRead:'1'}).then(res=>{ 
        var tips = res.data.tips
        this.searchNoticeMsg(); 
        this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})

      })
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