<template>
  <section>
        <el-row class="padding-bottom">
          <div style="display:flex;justify-content: space-between;">
             <xm-project-select show-style="tag" style="display:inline;" v-if="!selProject||!selProject.id" :auto-select="isTaskCenter?false:true"  :link-iteration-id="xmIteration?xmIteration.id:null" :link-product-id="xmProduct?xmProduct.id:null"  @change2="onProjectRowClick" @clear="onProjectClear" ></xm-project-select>
           <el-input v-else v-model="filters.name" placeholder="名称模糊查询" clearable></el-input>
           <el-button style="margin-left:10px;" icon="el-icon-search" @click="searchXmTasks()">查询</el-button>
          </div>
        </el-row>

             <el-table class="task-table padding-top"
             element-loading-text="努力加载中" element-loading-spinner="el-icon-loading"
              :data="tasksTreeData"
              @sort-change="sortChange"
              v-loading="load.list"
              @row-click="rowClick"
              @selection-change="selsChange"
              highlight-current-row
              current-row-key="id"
              stripe
              fit
              border
              tooltip-effect="light"
              height="100px" v-adaptive="{bottomOffset:50}"
              :tree-props="{ children: 'children'  }"
              row-key="id"
              ref="table"
            >
              <el-table-column
                prop="name"
                class-name="title"
                fixed="left"
                label="计划名称"
                min-width="300" show-overflow-tooltip
              >


              <template slot="header" slot-scope="scope">
									<div style="display:flex;">
										<div style="width:50%;text-align: left;line-height: 32px;">计划名称</div>
                     <div style="line-height: 32px;width:50%;display: flex;justify-content: right;">
                       <el-input v-if="!selProject||!selProject.id"  v-model="filters.name" size="mini" style="margin-left:5px;"  placeholder="名称模糊查询"  clearable></el-input>
                    </div>

                  </div>
              </template>
                <template slot-scope="scope">
                  <div    class="icon" :style="{backgroundColor:  scope.row.ntype==='1'?'#E6A23C':'#409EFF'}">
									<i :class="scope.row.ntype==='1'?'el-icon-time':'el-icon-s-operation'" ></i>
									</div>
                  <span>
                    {{ scope.row.sortLevel }}&nbsp;  {{ scope.row.name }}
                    </span>
                 </template>
              </el-table-column>

              <el-table-column
                label="状态"
                type="taskState"
                width="100"
              >
								<template slot-scope="scope">
									<div>
										<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'taskState',scope.row.taskState)" :key="index" :type="item.className">{{item.name}}</el-tag>
									</div>
								</template>
              </el-table-column>

              <el-table-column
                label="操作"
                width="100"
                align="right"
              >
								<template slot-scope="scope">
									<div>
										 <el-button      @click="$emit('select', scope.row,scope.$index)"   title="选择" type="primary">选择 </el-button>
									</div>
								</template>
              </el-table-column>


            </el-table>
            <el-row>
            <el-pagination
              ref="pagination"
              layout="total, sizes, prev, pager, next"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :page-sizes="[10, 20, 50, 100, 500]"
              :current-page="pageInfo.pageNum"
              :page-size="pageInfo.pageSize"
              :total="pageInfo.total"
              style="float: right; margin-top: 10px;"
            ></el-pagination>
          </el-row>
  </section>
</template>

<script>
import Vue from "vue";
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件

import {

  initDicts,
  getTask,
  listXmTask,
  calcProgress,
  calcProjectProgress,
} from "@/api/xm/core/xmTask";
 import { mapGetters } from "vuex";
import { sn } from "@/common/js/sequence";
import XmProjectSelect from "@/views/xm/core/components/XmProjectSelect";


 	import  XmGroupDialog from '@/views/xm/core/xmGroup/XmGroupDialog';//修改界面


export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]),
    tasksTreeData() {
      let xmTasks = JSON.parse(JSON.stringify(this.xmTasks || []));
      if(this.filters.name){
        xmTasks=xmTasks.filter(k=>k.name.indexOf(this.filters.name)>=0)
      }
      const tasksTreeData = treeTool.translateDataToTree(xmTasks,"parentTaskid","id");
      return tasksTreeData;
    },

    toSearchCpd(){
      var key={iterationId:'',projectId:'',productId:'',parentTaskid:''};
      if(this.xmIteration&&this.xmIteration.id){
        key.iterationId=this.xmIteration.id
        key.productId=this.xmIteration.productId
      }else{
        key.iterationId=''
      }
      if(this.xmProduct&&this.xmProduct.id){
        key.productId=this.xmProduct.id
      }else{
        key.productId=''
      }

      if(this.selProject&&this.selProject.id){
        key.projectId=this.selProject.id
      }else{
        key.projectId=''
      }
      return key.iterationId+key.projectId+key.productId+key.parentTaskid
    }
  },
  props: [
    "selProject", "xmProduct","xmIteration"
  ],
  watch: {
    selProject: function (oval, val) {
      this.filters.selProject = this.selProject;
      this.changeSelKey("");
    },
    xmProduct: function () {
      this.filters.product = this.xmProduct;
    },
    xmIteration: function () {
    },
    toSearchCpd:function(){
      this.loadDatasFromCache();
    }
  },
  data() {
    return {
      filters: {
        name: "",
        isMyTask: "0", //0不区分我的，1 时我的任务
        selProject: null,
        skillTags: [],
        taskOut: "", //1只查众包任务，0//只查本机构任务
        menus: [],
        createUser: null, //负责人
        executor: null, //执行人
        taskType: "",
        tags: [],
        taskState:'',//任务状态
        lvls:['1','2'],
      },
      xmTasks: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 100, //每页数据
        count:true, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ["cast(sort_level as signed)"], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ["asc"], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false,calcProgress:false, }, //查询中...
      sels: [], //列表选中数据
      dicts: {
        priority: [],
        taskType: [],
        planType: [],
        priority: [],
        xmTaskSettleSchemel: [],
        taskState:[],
        xm_plan_lvl:[],
      }, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false, //新增xmTask界面是否显示
      //新增xmTask界面初始化数据
      addForm: {
        id: "",
        name: "",
        parentTaskid: "",
        parentTaskname: "",
        projectId: "",
        projectName: "",
        level: "",
        sortLevel: "",
        executorUserid: "",
        executorUsername: "",
        preTaskid: "",
        preTaskname: "",
        startTime: "",
        endTime: "",
        milestone: "",
        description: "",
        remarks: "",
        createUserid: "",
        createUsername: "",
        createTime: "",
        rate: "",
        budgetAt: "",
        budgetWorkload: "",
        actAt: "",
        actWorkload: "",
        taskState: "",
        taskType: "",
        taskClass: "",
        toTaskCenter: "",
        actStartTime: "",
        actEndTime: "",
        uniInnerPrice:80,uniOutPrice:100,
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑xmTask界面初始化数据
      editForm: {
        id: "",
        name: "",
        parentTaskid: "",
        parentTaskname: "",
        projectId: "",
        projectName: "",
        level: "",
        sortLevel: "",
        executorUserid: "",
        executorUsername: "",
        preTaskid: "",
        preTaskname: "",
        startTime: "",
        endTime: "",
        milestone: "",
        description: "",
        remarks: "",
        createUserid: "",
        createUsername: "",
        createTime: "",
        rate: "",
        budgetAt: "",
        budgetWorkload: "",
        actAt: "",
        actWorkload: "",
        taskState: "",
        taskType: "",
        taskClass: "",
        toTaskCenter: "",
        actStartTime: "",
        actEndTime: "",
        uniInnerPrice:80,uniOutPrice:100,
      },
      tableHeight: 300,
    };
  }, //end data
  methods: {
     ...util,
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getXmTasks();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getXmTasks();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      if (obj.order == null) {
        this.pageInfo.orderFields = ["create_time"];
        this.pageInfo.orderDirs = ["desc"];
      } else {
        var dir = "asc";
        if (obj.order == "ascending") {
          dir = "asc";
        } else {
          dir = "desc";
        }

        this.pageInfo.orderFields = [util.toLine(obj.prop)];
        this.pageInfo.orderDirs = [dir];
      }

      this.getXmTasks();
    },
    searchXmTasks() {
      //this.pageInfo.count = true;
      this.getXmTasks();
    },
    //获取列表 XmTask xm_task
    getXmTasks() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
      };
      if (
        this.pageInfo.orderFields != null &&
        this.pageInfo.orderFields.length > 0
      ) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(
            this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i]
          );
        }
        params.orderBy = orderBys.join(",");
      }
      params=this.getParams(params)

      getTask(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            var xmTasks = res.data.data;
            this.xmTasks = xmTasks;
            if (this.editForm != null) {
              var index = this.xmTasks.findIndex(
                (i) => i.id == this.editForm.id
              );
              if (index >= 0) {
                this.editForm = this.xmTasks[index];
              }
            }
          } else {
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: "error",
            });
          }
          this.load.list = false;
        })
        .catch((err) => (this.load.list = false));
    },

    //选择行xmTask
    selsChange: function (sels) {
      this.sels = sels;
    },
    unselectRow(){
       this.editForm=null;
        this.$emit('row-click',null)
        this.$refs.table.setCurrentRow();
        return;
    },
    rowClick: function (row) {
      this.editForm = row;
      this.editFormBak=Object.assign({},row)
      this.$emit('row-click',row,);//  @row-click="rowClick"
    },

    onProjectRowClick: function (project) {
      this.filters.selProject = project;
      this.$emit("project-row-click",project)
      this.searchXmTasks();
    },
    onProjectClear(){
      this.filters.selProject=null;
      this.xmTasks=[]
      this.searchXmTasks();
    },

    getParams(params) {
      if(this.filters.taskState){
        params.taskState=this.filters.taskState
      }
      if (this.filters.selProject) {
        params.projectId = this.filters.selProject.id;
      }

      params.ntype='1'
      return params;
    },

    initData(){
      if (this.selProject) {
        this.filters.selProject = this.selProject;
      }
      if (this.xmProduct) {
        this.filters.product = this.xmProduct;
      }
    },


    loadDatasFirstCache(){

        if(!this.filters.selProject || !this.filters.selProject.id){
          return;
        }
        var key="xm_phase_cache_"+this.filters.selProject.id
        var dataStr=sessionStorage.getItem(key)
        if(dataStr && dataStr!='null' && dataStr!='undefined'){
          this.xmTasks=JSON.parse(dataStr)
          this.pageInfo.total=this.xmTasks.length;
        }else{
          this.getXmTasks()
        }

      },
      setDatasToCache(datas){

        if(!this.filters.selProject || !this.filters.selProject.id){
          return;
        }
        var key="xm_phase_cache_"+this.filters.selProject.id
        if(!datas || datas.length==0){
          sessionStorage.removeItem(key)
        }else{
          sessionStorage.setItem(key,JSON.stringify(datas))
        }

      }
  }, //end methods
  components: {
    XmProjectSelect,
    XmGroupDialog,
    //在下面添加其它组件
  },
  mounted() {
    this.initData();
    this.$nextTick(() => {
      initDicts(this)
      if(this.isTaskCenter ||(this.selProject && this.selProject.id)){
        this.getXmTasks();
      }
      this.tableHeight = this.source == 'GZT' ? this.tableHeight : util.calcTableMaxHeight(this.$refs.table.$el)-40;

    });
  },
};
</script>

<style scoped>

</style>
