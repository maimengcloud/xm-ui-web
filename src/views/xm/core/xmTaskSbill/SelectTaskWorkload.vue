<template>
  <section class="page-container border padding">
    <el-row>
      <el-input v-model="filters.key" style="width: 30%;" placeholder="模糊查询任务ID/名称/员工ID/员工名称"></el-input>
      <el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTaskWorkloads" icon="el-icon-search">查询</el-button>
    </el-row>
    <el-row class="padding-top">
      <!--列表 XmTaskWorkload 工时登记表-->
      <el-table ref="xmTaskWorkloadTable" :data="xmTaskWorkloads" :height="maxTableHeight" highlight-current-row v-loading="load.list" border
                @selection-change="selsChange" style="width: 100%;" :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}">
        <el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
<!--        <el-table-column sortable type="index" width="55" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="id" label="编号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userid" label="员工编号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="username" label="姓名" min-width="80" show-overflow-tooltip></el-table-column>
<!--        <el-table-column prop="ctime" label="创建日期" min-width="80" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="taskId" label="任务编号" min-width="80" show-overflow-tooltip></el-table-column>
<!--        <el-table-column prop="cuserid" label="创建人编号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bizDate" label="业务日期yyyy-MM-dd" min-width="80" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="wstatus" label="登记状态" min-width="80" show-overflow-tooltip>
<!--          0-待确认，1-已确认，2-无效-->
          <template slot-scope="scope">
            <span v-if="scope.row.wstatus=='0'">待确认</span>
            <span v-else-if="scope.row.wstatus=='1'">已确认</span>
          </template>
        </el-table-column>
<!--        <el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ttype" label="任务类型-关联字典taskType" min-width="80" show-overflow-tooltip></el-table-column>-->
<!--        <el-table-column prop="sbillId" label="结算单据编号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="stime" label="结算提交时间" min-width="80" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="sstatus" label="结算状态" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
<!--            0-无需结算，1-待结算2-已提交3-已通过4-已结算-->
            <span v-if="scope.row.sstatus=='0'">无需结算</span>
            <span v-else-if="scope.row.sstatus=='1'">待结算</span>
            <span v-else-if="scope.row.sstatus=='2'">已提交</span>
            <span v-else-if="scope.row.sstatus=='3'">已通过</span>
            <span v-else-if="scope.row.sstatus=='4'">已结算</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="amt" label="工时金额" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="samt" label="结算金额" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="workload" label="工时" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template scope="scope">
            <el-button :disabled="!(scope.row.sstatus=='1'&&scope.row.wstatus=='1')" @click="selectRow( scope.row,scope.$index)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
    </el-row>
    <el-row>

    </el-row>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import { listXmTaskWorkload, delXmTaskWorkload, batchDelXmTaskWorkload } from '@/api/xm/core/xmTaskWorkload';

import { mapGetters } from 'vuex'
import {listByProject} from "../../../../api/xm/core/xmTaskWorkload";

export default {
  name:'xmTaskWorkloadMng',
  components: {

  },
  props:['visible','xmTaskSbill'],
  computed: {
    ...mapGetters(['userInfo']),

  },
  watch:{
    visible(val){
      if(val==true){
        this.initData();
        this.searchXmTaskWorkloads()
      }
    }
  },
  data() {
    return {
      filters: {
        key: ''
      },
      xmTaskWorkloads: [],//查询结果
      pageInfo:{//分页数据
        total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize:10,//每页数据
        count:false,//是否需要重新计算总记录数
        pageNum:1,//当前页码、从1开始计算
        orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load:{ list: false, edit: false, del: false, add: false },//查询中...
      sels: [],//列表选中数据
      dicts:{
        //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
      },//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
      addFormVisible: false,//新增xmTaskWorkload界面是否显示
      addForm: {
        userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:''
      },

      editFormVisible: false,//编辑界面是否显示
      editForm: {
        userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:''
      },
      maxTableHeight:300,
    }
  },//end data
  methods: {
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize=pageSize;
      this.getXmTaskWorkloads();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getXmTaskWorkloads();
    },
    searchXmTaskWorkloads(){
      this.pageInfo.count=true;
      this.getXmTaskWorkloads();
    },
    //获取列表 XmTaskWorkload 工时登记表
    getXmTaskWorkloads() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count:this.pageInfo.count,
        projectId:this.xmTaskSbill.projectId
      };
      if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
        let orderBys=[];
        for(var i=0;i<this.pageInfo.orderFields.length;i++){
          orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
        }
        params.orderBy= orderBys.join(",")
      }
      if(this.filters.key){
        params.key= "%" + this.filters.key + "%"
      }

      this.load.list = true;
      listByProject(params).then((res) => {
        var tips=res.data.tips;
        if(tips.isOk){
          this.pageInfo.total = res.data.total;
          this.pageInfo.count=false;
          this.xmTaskWorkloads = res.data.data;
        }else{
          this.$notify({ showClose:true, message: tips.msg, type: 'error' });
        }
        this.load.list = false;
      }).catch( err => this.load.list = false );
    },
    //选择行xmTaskWorkload
    selsChange: function (sels) {
      this.sels = sels;
    },
    selectRow(row,index){
      this.$emit("submit",row);
    },
    initData: function(){

    },

  },//end methods
  mounted() {
    this.$nextTick(() => {
      //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
      this.initData()
      this.searchXmTaskWorkloads();
      this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmTaskWorkloadTable.$el)

    });
  }
}

</script>

<style scoped>
</style>

