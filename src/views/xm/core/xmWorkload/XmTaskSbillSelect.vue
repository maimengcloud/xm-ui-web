<template>
  <section>
    <el-popover
      placement="bottom"
      width="500"
      trigger="manual"
      v-model="sbillVisible">

      <el-row >
        <!--列表 XmTaskSbill 结算表-->
        <el-table  ref="table" height="100px" v-adaptive="{bottomOffset:50}" :data="xmTaskSbills" :row-class-name="tableRowClassName" @sort-change="sortChange" :highlight-current-row="true" current-row-key="id" v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
          <el-table-column prop="name"  label="结算单名称">
            <template slot="header" slot-scope="scope">
              结算单名称
              <span style="float:right;">
												<el-button type="text" @click="clearSelect">清空</el-button>&nbsp;&nbsp;
												<el-button type="text" @click="close">关闭</el-button>&nbsp;&nbsp;
												<el-popover
                          placement="top-start"
                          title=""
                          width="500"
                          v-model="moreVisible"
                          trigger="manual" >
													<el-row>
														<el-col  :span="24"  style="padding-top:5px;">
															<font class="more-label-font">结算单编号:</font>
															<el-input   v-model="filters.id" style="width:100%;"  placeholder="输入结算编号" @keyup.enter.native="searchXmTaskSbills">
															</el-input>
														</el-col>

														<el-col  :span="24"  style="padding-top:5px;">
															<font class="more-label-font">创建时间:</font>
															<el-date-picker
                                v-model="dateRanger"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="完成日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :default-time="['00:00:00','23:59:59']"
                                :picker-options="pickerOptions"
                              ></el-date-picker>
														</el-col>

														<el-col  :span="24"  style="padding-top:5px;">
															<font class="more-label-font">
																结算单标题:
															</font>
															<el-input   v-model="filters.title" style="width:100%;"  placeholder="输入结算单标题关键字">
															</el-input>
														</el-col>
														<el-col  :span="24"  style="padding-top:5px;">
															<font class="more-label-font">
																创建人:
															</font>
															<el-tag v-if="filters.pmUser" closable @click="selectFiltersPmUser" @close="clearFiltersPmUser()">{{filters.pmUser.username}}</el-tag>
															<el-button   v-else @click="selectFiltersPmUser()">选择</el-button>
															<el-button    @click="setFiltersPmUserAsMySelf()">我的</el-button>
														</el-col>
														<el-col  :span="24"  style="padding-top:5px;">
															<el-button type="text"  @click="moreVisible=false" >关闭</el-button><el-button type="primary"  @click="searchXmTaskSbills" >查询</el-button>
														</el-col>
													</el-row>
													<el-button type="text" slot="reference" @click="moreVisible=!moreVisible" style="float:right;">更多条件</el-button>
												</el-popover>
												</span>
            </template>
            <template slot-scope="scope">
              <font>{{scope.row.title}}</font>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination  layout="total, prev, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
      </el-row>
      <span slot="reference" @click="referenceClick">
        <slot name="reference"><el-link title="结算单，点击选择、清除选择"  type="warning"    icon="el-icon-search"><span style="font-size:14px;"><slot name="title">{{editForm && editForm.id?editForm.title:'选择结算单'}}</slot></span></el-link> </slot>
			</span>
    </el-popover>
    <el-drawer title="选择员工" :visible.sync="selectFiltersPmUserVisible" size="60%" append-to-body>
      <users-select  @confirm="onFiltersPmUserSelected" ref="usersSelect"></users-select>
    </el-drawer>
  </section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import { mapGetters } from 'vuex'
import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
import {listXmTaskSbill} from "@/api/xm/core/xmTaskSbill";

export default {
  props:['autoSelect','projectId'],
  computed: {
    ...mapGetters([
      'userInfo','roles'
    ])
  },
  watch:{
    projectId(){
      this.initData();
    }
  },
  data() {
    const beginDate = new Date();
    const endDate = new Date();
    beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
    return {
      filters: {
        title: '',
        id:'',
        pmUser:null,//创建人
      },
      xmTaskSbills: [],//查询结果
      pageInfo:{//分页数据
        total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize:10,//每页数据
        count:true,//是否需要重新计算总记录数
        pageNum:1,//当前页码、从1开始计算
        orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load:{ list: false, edit: false, del: false, add: false },//查询中...
      sels: [],//列表选中数据
      dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      //xmTaskSbills初始化数据
      editForm: {
        id:'',title:''
      },
      selectFiltersPmUserVisible:false,
      maxTableHeight:300,
      dateRanger: [ ],
      pickerOptions:  util.getPickerOptions('datarange'),
      sbillVisible:false,
      moreVisible:false,
      hadInit:false,
    }
  },//end data
  methods: {
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize=pageSize;
      this.getXmTaskSbills();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getXmTaskSbills();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange( obj ){
      var dir='asc';
      if(obj.order=='ascending'){
        dir='asc'
      }else{
        dir='desc';
      }
      if(obj.prop=='xxx'){
        this.pageInfo.orderFields=['xxx'];
        this.pageInfo.orderDirs=[dir];
      }
      this.getXmTaskSbills();
    },
    searchXmTaskSbills(){
      this.pageInfo.count=true;
      this.getXmTaskSbills();
    },
    //获取列表 XmTaskSbill 项目表
    getXmTaskSbills() {
      console.log(JSON.stringify(this.dateRanger));
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count:this.pageInfo.count,
        projectId: this.projectId,
        status:'0'
      };
      if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
        let orderBys=[];
        for(let i=0;i<this.pageInfo.orderFields.length;i++){
          orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
        }
        params.orderBy= orderBys.join(",")
      }
      if(this.filters.title){
        params.title=  this.filters.title 
      }
      if(this.filters.id){
        params.id = this.filters.id;
      }
      if(this.filters.pmUser){
        params.cuserid = this.filters.pmUser.userid;
      }
      if(this.dateRanger){
        params.startTime = this.dateRanger[0];
        params.endTime = this.dateRanger[1];
      }

      this.load.list = true;
      listXmTaskSbill(params).then((res) => {
        var tips=res.data.tips;
        if(tips.isOk){
          this.pageInfo.total = res.data.total;
          this.pageInfo.count=false;
          this.xmTaskSbills = res.data.data;
        }else{
          this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
        }
        this.load.list = false;
      }).catch( err => this.load.list = false );
    },

    //选择行xmTaskSbill
    selsChange: function (sels) {
      this.sels = sels;
    },

    rowClick: function(row, event, column){
      this.editForm=row
      this.$emit('row-click',row, event, column);//  @row-click="rowClick"
      this.selectedXmTaskSbill(row)
      this.sbillVisible=false;
      this.moreVisible=false;
    },
    selectedXmTaskSbill:function(row){
      this.editForm=row
      this.$emit('selected',row);
      this.sbillVisible=false;
      this.moreVisible=false;
    },

    /**begin 自定义函数请在下面加**/
    clearFiltersPmUser:function(){
      this.filters.pmUser=null;
      this.searchXmTaskSbills();
    },
    selectFiltersPmUser(){
      this.selectFiltersPmUserVisible=true;
    },
    onFiltersPmUserSelected(users){
      if(users && users.length>0){
        this.filters.pmUser=users[0]
      }else{
        this.filters.pmUser=null;
      }
      this.selectFiltersPmUserVisible=false;
      this.searchXmTaskSbills();
    },
    setFiltersPmUserAsMySelf(){
      this.filters.pmUser=this.userInfo;
      this.searchXmTaskSbills();
    },

    tableRowClassName({row, rowIndex}) {
      if (row && this.editForm && row.id == this.editForm.id) {
        return 'success-row';
      }
      return '';
    },
    clearSelect(){
      this.$refs.table.setCurrentRow();
      this.$emit("clear-select");
      this.selectedXmTaskSbill(null);
      this.sbillVisible=false;
      this.moreVisible=false;
    },
    close(){
      this.sbillVisible=false;
      this.moreVisible=false;
      this.$emit("close");
    },

    initData(){
      this.searchXmTaskSbills();
    },

    referenceClick(){
      if(!this.hadInit){
        this.initData();
        this.hadInit=true;
      }
      this.sbillVisible=!this.sbillVisible;
    }
  },//end methods
  components: {
    UsersSelect,
    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      if(this.$refs.table){
        this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);
      }

      if(this.autoSelect!==false){
        this.initData();
        this.hadInit=true;
      }
    });
  }
}

</script>
<style scoped>


.more-label-font{
  text-align:center;
  float:left;
  padding-top:5px;
}
.align-right{
  float: right;
}
</style>
