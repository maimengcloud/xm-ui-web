<template>
  <div class="m_container">  
    <div class="message_content">
      <div class="message_content_box" v-for="(item, index) in imGroupMessages" :key="index" @click="goToImGroupMessage(item)">
        <p class="title">{{item.sendUsername}}</p>
        <p class="date">{{item.sendTime}}</p>
        <span class="text">{{item.sendContent}}</span>
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
  </div>
</template>

<script>
import {listImGroupMessage} from '@/api/mdp/im/group/imGroupMessage'
import { mapGetters } from 'vuex'
export default {
  props:['msgClass'],
  computed: {
      ...mapGetters(['userInfo']),

  },
  data() {
    return {  
      imGroupMessages:[],
      
      pageInfo:{//分页数据
          total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
          pageSize:10,//每页数据
          count:false,//是否需要重新计算总记录数
          pageNum:1,//当前页码、从1开始计算
          orderFields:['SEND_TIME'],//排序列 如 ['sex','student_id']，必须为数据库字段
          orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
    }
  },

  methods:{
    
    handleSizeChange(pageSize) {
        this.pageInfo.pageSize=pageSize;
        this.getImGroupMessages();
    },
    handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getImGroupMessages();
    },
    searchImGroupMessages(){
      this.pageInfo.count=true;
      this.getImGroupMessages();
    },
    getImGroupMessages(){
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
      params.msgClass=this.msgClass||''
      listImGroupMessage(params).then(res=>{
        this.imGroupMessages=res.data.data;
        this.pageInfo.total=res.data.total
        this.pageInfo.count=false;
      })
    },
    goToImGroupMessage(item){
      var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
      window.open(curlDomain+"/im/"+process.env.VERSION+"/#/group?msgClass="+this.msgClass+"&groupId="+item.groupId)
    }
  },

  mounted() {
     this.searchImGroupMessages();
  }

}
</script>

<style lang="scss" scoped>
@import '../common.scss';
@import './index.scss';
</style>