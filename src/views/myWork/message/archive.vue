<template>
  <div class="m_container">  
    <div class="message_content">
      <div class="message_content_box" v-for="(item, index) in arcArchives" :key="index" @click="goToArchive(item)">
        <p class="title">{{item.archiveTitle||item.tagNames||item.authorName}}</p> 
        <p class="date"> 作者: <span style="font-size:14px;">{{item.authorName}}</span>  &nbsp;&nbsp;时间：  <span style="font-size:14px;">{{item.archivingDate}}</span>  </p> 

        <span class="text">{{item.archiveAbstract||item.archiveContext}}</span>
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
import {listArchive} from '@/api/mdp/arc/archive'
import { mapGetters } from 'vuex'
export default { 
  computed: {
      ...mapGetters(['userInfo']),

  },
  props:['archiveType'],
  data() {
    return {  
      arcArchives:[],
      
      pageInfo:{//分页数据
          total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
          pageSize:10,//每页数据
          count:false,//是否需要重新计算总记录数
          pageNum:1,//当前页码、从1开始计算
          orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
          orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
    }
  },

  methods:{
    
    handleSizeChange(pageSize) {
        this.pageInfo.pageSize=pageSize;
        this.getArchives();
    },
    handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getArchives();
    },
    searcArchives(){
      this.pageInfo.count=true;
      this.getArchives();
    },
    getArchives(){
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
      params.archiveType=this.archiveType||"3"
      listArchive(params).then(res=>{
        this.arcArchives=res.data.data;
        this.pageInfo.total=res.data.total
        this.pageInfo.count=false;
      })
    },
    goToArchive(item){
      var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
      window.open(curlDomain+"/api/"+process.env.VERSION+"/arc/arc/archive/showArchive?id="+item.id)
    }
  },

  mounted() {
     this.searcArchives();
  }

}
</script>

<style lang="scss" scoped>
@import '../common.scss';
@import './index.scss';
</style>