<template>
  <section class="padding-right">
    <el-row>
      <el-col
        :span="24"
        class="padding-left" 
      >
        <el-row>     
          
          <span style="float:left;"> 
           <xm-project-select style="display:inline;" v-if="!selProject||!selProject.id" :auto-select="isTaskCenter?false:true"  :link-iteration-id="xmIteration?xmIteration.id:null" :link-product-id="xmProduct?xmProduct.id:null"  @row-click="onProjectRowClick" @clear="onProjectClear" ></xm-project-select>
           <el-input style="width:120px;" v-model="filters.key" placeholder="名称模糊查询"  clearable></el-input>
           <el-button icon="el-icon-search" @click="searchXmTasks()"></el-button> 
          <el-popover
            placement="top-start"
            title="选择创建计划/任务的方式"
            width="300"
            trigger="hover"
          >
            <el-row>
              <el-col :span="24" style="padding-top: 5px">
                
                <div    class="icon" :style="{backgroundColor:   '#E6A23C'}">
                  <i :class=" 'el-icon-odometer' " ></i>
                </div>  
                <el-button
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="showMenu"
                  type="primary"
                  icon="el-icon-plus"
                  >由用户故事快速创建计划 (推荐)</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                
                <div    class="icon" :style="{backgroundColor:   '#E6A23C'}">
                  <i :class=" 'el-icon-odometer' " ></i>
                </div>  
                <el-button
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="showTaskTemplate"
                  icon="el-icon-plus"
                  >从模板快速导入计划 </el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                
                <div    class="icon" :style="{backgroundColor:   '#E6A23C'}">
                  <i :class=" 'el-icon-odometer' " ></i>
                </div>  
                <el-button
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="showAdd('1')"
                  icon="el-icon-plus"
                  >直接创建计划</el-button
                >
              </el-col> 
            </el-row>
            <el-button
              slot="reference" 
              type="primary"
              round
              icon="el-icon-plus"
              title="新建计划、任务"
            ></el-button>
          </el-popover>
          <el-button
            @click="showParentTaskList"  
            title="更换任务的上级，实现任务搬家功能"
            icon="el-icon-upload2"
            v-loading="load.edit"
          > </el-button> 
          <el-button type="danger"
            v-if="isTaskCenter != '1' && isMy != '1'"
            @click="batchDel"
            v-loading="load.del"
            icon="el-icon-delete"
            title="批量删除"
            ></el-button
          >

          <el-popover
            placement="top-start"
            title=""
            width="400"
            trigger="click"
          >
            <el-row>
              <el-col :span="24" style="padding-top: 5px">
                <font class="more-label-font">产品:</font
                > <xm-product-select :auto-select="false" :link-project-id="filters.selProject && filters.selProject.id?filters.selProject.id:null" @row-click="onProductSelected" @clear="onProductClearSelect"></xm-product-select>
              </el-col> 
              <el-col :span="24" style="padding-top: 5px">
                <font class="more-label-font">责任人:</font>
                <el-tag
                  v-if="filters.createUser"
                  closable
                  @click="showMenuGroupUser"
                  @close="clearFiltersCreateUser"
                  >{{ this.filters.createUser.username }}</el-tag
                >
                <el-button v-else @click="showMenuGroupUser" type="plian"
                  >选责任人</el-button
                >
                <el-button
                  v-if="
                    !filters.createUser ||
                    filters.createUser.userid != userInfo.userid
                  "
                  @click="setFiltersCreateUserAsMySelf"
                  >我的</el-button
                >
              </el-col>  
              <el-col :span="24" style="padding-top: 5px">
                <font class="more-label-font">标签:</font>
                <el-button
                  v-if="!filters.skillTags || filters.skillTags.length == 0"
                  icon="el-icon-search"
                  @click="showSkillSelect"
                  >选择标签</el-button
                >
                <el-tag
                  v-else
                  closable
                  v-for="(skill, index) in filters.skillTags"
                  :key="index"
                  @click="showSkillSelect"
                  @close="skillTagClear(skill)"
                  >{{ skill.skillName }}</el-tag
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="searchXmTasks"
                  >查询</el-button
                >
              </el-col>
            </el-row> 
            <el-row> 
              <el-col :span="24" style="padding-top: 5px">
                <el-button  title="一般情况下默认半个小时会统一更新一次，不需要手动更新，如需要立即汇总数据到上级计划，可以手动执行刷新操作"
                   
                  @click="calcProjectProgress"
                  v-loading="load.edit"
                  icon="el-icon-edit"
                  type="warning"
                  >刷新全部计划进度数据</el-button
                >
              </el-col>
            </el-row>
            <el-button style="margin-top: 10px;" slot="reference">更多</el-button>
          </el-popover> 
          </span>
        </el-row>

        <el-row class="padding-top"> 
            <el-table class="task-table" 
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
              :height="tableHeight"
              :tree-props="{ children: 'children'  }"
              row-key="id"
              ref="table"
              :row-style="{height:'60px'}"
            >
              <el-table-column
                label="全选"
                type="selection"
                width="50"
                fixed="left"
              >
              </el-table-column> 
              <el-table-column
                sortable
                prop="name"
                class-name="title"
                fixed="left"
                label="计划名称"
                min-width="300"
              >
                <template slot-scope="scope">
                  <div    class="icon" :style="{backgroundColor:  scope.row.ntype==='1'?'#E6A23C':'#409EFF'}">
									<i :class="scope.row.ntype==='1'?'el-icon-odometer':'el-icon-s-operation'" ></i>
									</div>  
                  <span>
                    {{ scope.row.sortLevel }}&nbsp;  {{ scope.row.name }}
                    </span>
                  <el-link  
                    style="border-radius: 30px"
                    :type="scope.row.rate >= 100 ? 'success' : 'warning'"
                    @click="calcProgress(scope.row)"
                    class="el-icon-refresh"
                  >
                    {{ (scope.row.rate != null ? scope.row.rate : 0) + "%" }}
                  </el-link>  
									<div class="tool-bar">
                    <span class="u-btn">
                         <el-button   :style="{backgroundColor:  '#E6A23C'}"  @click="showSubAdd( scope.row,scope.$index,'1')" icon="el-icon-plus" title="新建计划" circle plain size="mini"> </el-button>   
                        <el-button      @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit" title="编辑" circle plain size="mini"> </el-button>     
                     </span>
									</div>
                </template>
              </el-table-column>
              
              <el-table-column
                label="状态"
                type="taskState"
                width="100"
              >  
								<template slot-scope="scope">
									<div class="cell-text">
										<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'taskState',scope.row.taskState)" :key="index" :type="item.className">{{item.name}}</el-tag>
   
									</div>
									<span class="cell-bar">
										 <el-select @visible-change="selectVisible(scope.row,$event)"  v-model="scope.row.taskState" placeholder="任务状态"  style="display:block;"  @change="editXmTaskSomeFields(scope.row,'taskState',$event)">
												<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.taskState" :key="index"></el-option>
										 </el-select>
									</span>
								</template>
              </el-table-column> 
            </el-table>
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
      </el-col>
    </el-row>  
    <!--编辑 XmTask xm_task界面-->
    <el-dialog
      title="编辑任务"
      :visible.sync="editFormVisible"
      width="90%"
      top="20px"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-task-edit
        :xm-project="filters.selProject"
        :xm-task="editForm"
        :visible="editFormVisible"
        @cancel="editFormVisible = false"
        @after-add-submit="afterExecEditSubmit"
        @after-edit-submit="afterExecEditSubmit"
        @submit="afterEditSubmit"
        @edit-fields="onEditSomeFields"
      ></xm-task-edit>
    </el-dialog>
     

    <!-- 新增 XmTask xm_task界面-->
    <el-dialog
      class="xm-task-add"
      title="新增任务"
      :visible.sync="addFormVisible" 
      width="90%"
      top="20px"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-task-add
        :xm-project="filters.selProject"
        :xm-product="xmProduct"
        :xm-task="addForm"
        :parent-task="parentTask"
        :ptype="ptype"
        :visible="addFormVisible"
        @cancel="addFormVisible = false"
        @submit="afterAddSubmit"
      ></xm-task-add>
    </el-dialog>
 
 			<tag-dialog ref="tagDialog"   @select-confirm="onTagSelected">
			</tag-dialog>
    <!-- <el-drawer :title="'技能要求——'+currTaskName" :visible.sync="skillVisible"  size="80%" append-to-body  :close-on-click-modal="false">
			<xm-skill-mng :visible="skillVisible" :task-id="currTaskId" :task-name="currTaskName"></xm-skill-mng>
		</el-drawer> -->
 

    <el-drawer
      title="任务模板"
      :with-header="false"
      :visible.sync="taskTemplateVisible"
      size="80%"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-task-template-mng
        :is-select="true"
        @select-confirm="onTaskTemplatesSelected"
      ></xm-task-template-mng>
    </el-drawer>
  

 			<xm-group-dialog ref="xmGroupDialog" :isSelectSingleUser="true" :sel-project="filters.selProject" :xm-product="filters.xmProduct" @user-confirm="selectCreateUserConfirm">
			</xm-group-dialog>  
     
    <el-dialog title="选择新的上级计划" append-to-body :visible.sync="selectParentTaskVisible" width="60%" top="20px">
      <xm-phase-select :sel-project="filters.selProject" @select="onSelectedParentTask"></xm-phase-select>
    </el-dialog>
  </section>
</template>

<script>
import Vue from "vue";
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
import { initSimpleDicts } from '@/api/mdp/meta/item'; //下拉框数据查询
import {
  getTask, 
  delXmTask,
  batchDelXmTask,
  batchImportTaskFromTemplate,  
  batchChangeParentTask,
  editXmTaskSomeFields,
  calcProgress,
  calcProjectProgress,
} from "@/api/xm/core/xmTask";
import XmTaskAdd from "./XmTaskAdd"; //新增界面
import XmTaskEdit from "./XmTaskEdit"; //修改界面
 import XmTaskAgileKanban from "./XmTaskAgileKanban"; //敏捷看板
import { mapGetters } from "vuex";    
import { sn } from "@/common/js/sequence";
import xmTaskTemplateMng from "../xmTaskTemplate/XmTaskTemplateMng";  

import XmProjectSelect from "@/views/xm/core/components/XmProjectSelect";
import XmProductSelect from "@/views/xm/core/components/XmProductSelect";  
 

import XmPhaseSelect from "./XmPhaseSelect.vue"; 
 
	import  XmTableConfig from '@/views/xm/core/components/XmTableConfig';//修改界面
	import  XmGroupDialog from '@/views/xm/core/xmGroup/XmGroupDialog';//修改界面
  
  	import TagDialog from "@/views/mdp/arc/tag/TagDialog"; 

export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]), 
    tasksTreeData() {
      let xmTasks = JSON.parse(JSON.stringify(this.xmTasks || []));
      const tasksTreeData = treeTool.translateDataToTree(xmTasks,"parentTaskid","id");
      return tasksTreeData;
    },

  },
  props: [
    "selProject",
    "isTaskCenter",
    "isMy",
    "menuId",
    "menuName",
    "xmProduct",
    "xmIteration",
    "ptype",//0-项目，1-产品，all/空为不区分
    "queryScope",//planTask,task,plan,分别为计划及任务，纯任务,纯计划
    "source" //来源 "GZT:工作台"
  ],
  watch: {
    selProject: function (oval, val) {
      this.filters.selProject = this.selProject; 
      this.searchXmTasks();
    },  
    xmProduct: function () {
      this.filters.product = this.xmProduct;
      this.searchXmTasks();
    },
    xmIteration: function () {
      this.searchXmTasks();
    },
  },
  data() { 
    return {
      filters: {
        key: "",
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
        pageSize: this.queryScope==='plan' || this.queryScope==='planTask'?50:20, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ["sort_level"], //排序列 如 ['sex','student_id']，必须为数据库字段
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
      taskTemplateVisible: false,
      parentTask: null,   
      pickerOptions: util.getPickerOptions(), 
       tableHeight: 300, 
       selectParentTaskVisible:false, 
      execUserVisible:false,  
    };
  }, //end data
  methods: {  
    calcProjectProgress(){
      calcProjectProgress().then(res=>{
        this.searchXmTasks();
      })
    },
    calcProgress(row){ 
      this.load.calcProgress=true
      calcProgress({id:row.id}).then(res=>{  
        this.load.calcProgress=false
        var tips =res.data.tips;
        this.$notify({
              showClose: true,
              message: tips.msg,
              type: tips.isOk?"success":"error",
            });
        this.getXmTasks();
      })
    }, 

    ...util,
    changeTaskType(index) {
      this.filters.taskType = index;
      this.getXmTasks();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getXmTasks();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getXmTasks();
    },
    showProjectInfo(row) {
      this.editForm = row;
      this.projectInfoVisible = true;
    }, 
    clearFiltersCreateUser() {
      this.filters.createUser = null;
      this.searchXmTasks();
    },
    clearFiltersExecutor() {
      this.filters.executor = null;
      this.searchXmTasks();
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
      this.pageInfo.count = true;
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
      if(this.queryScope==='planTask'){ 
			  params.withParents="1"
      }else if(this.queryScope==='plan'){ 
			  params.withParents="1"
        params.ntype="1"
      }else if(this.queryScope==='task'){
        params.ntype="0"
      }

        if(!params.projectId){
          this.$notify.warning("请先选中项目")
          return;
        }
      //params.ptype=this.ptype

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
       
    showMenu: function (parentTask) {
      if(!this.checkCanAdd(parentTask)){
        return;
      }
      this.parentTask = parentTask;
      this.menuVisible = true;
    },
    //显示编辑界面 XmTask xm_task
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm=row 
    },
    showTaskTemplate: function (row) {
      if(!this.checkCanAdd(row)){
        return;
      }
      this.taskTemplateVisible = true;
    },
    checkCanAdd( parentTask){

      if(parentTask && parentTask.id){
        if(parentTask.ntype=='0'){
           this.$notify({
              showClose: true,
              message: "当前为任务节点，任务节点下不能再创建新的子项",
              type: "warning",
            });
            return false;
        }
        return true;
      }else{
        if(this.ptype==='0'){
          if(!this.filters.selProject || !this.filters.selProject.id){
            this.$notify({
                showClose: true,
                message: "请先选择项目",
                type: "warning",
              });
              this.projectVisible=true;
              return false;
          }else if(this.ptype==='1'){
            if( !this.filters.product && this.filters.product.id){
               this.$notify({
                showClose: true,
                message: "请先选择产品",
                type: "warning",
              });

              this.productSelectVisible=true;
              return false;
            }
          }
        }

      }
      return true;


    },
    showSubAdd(row,index,ntype) {
      if(!this.checkCanAdd(row)){
        return;
      }
      this.parentTask = row;
      this.editForm = row;
      this.addForm.ntype=ntype;
      this.addFormVisible = true;
    },
    //显示新增界面 XmTask xm_task
    showAdd: function (ntype) {
      if(!this.checkCanAdd()){
        return;
      }  
      this.parentTask = null;
      this.addForm.ntype=ntype;
      this.addFormVisible = true;
    },
    afterAddSubmit(row) {
      this.addFormVisible = false;
      this.pageInfo.count = true;
        this.getXmTasks()
     },
    afterEditSubmit() {
      this.editFormVisible = false;
      var row=this.editForm
      this.getXmTasks()
     },

    afterExecEditSubmit() {
      var row=this.editForm
      this.getXmTasks()
     },
    onEditSomeFields(params){
      Object.assign(this.editForm,params )
    },
    //选择行xmTask
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除xmTask
    handleDel: function (row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        let params = Object.assign({}, row);
        delXmTask(params)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getXmTasks()
             }
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
    },
    //批量删除xmTask
    batchDel: function () {
      if(this.sels.length==0){
        this.$notify.warning("请先选中要删除的记录")
        return;
      }
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        batchDelXmTask(this.sels)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
							this.searchXmTasks()
             }
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
    },
    rowClick: function (row) { 
      this.editForm = row; 
      this.editFormBak=Object.assign({},row) 
      this.$emit('row-click',row,);//  @row-click="rowClick"
    }, 
    selectVisible(row,visible){
      if(visible==true){
        this.rowClick(row);
      }
    }, 
    showSkill(row) {
      this.editForm = row;
      this.skillVisible = true;
    },
    showSkillSelect() {
      this.showSkillSearchVisible = true;
    },
     
    skillTagClear(skill) {
      this.filters.skillTags = this.filters.skillTags.filter(
        (i) => i.skillId != skill.skillId
      );
      this.searchXmTasks();
    },
      
    onTaskTemplatesSelected(taskTemplates) {

      if (taskTemplates == null || taskTemplates.length == 0) {
        this.taskTemplateVisible = false;
        this.parentTask = null;
        return;
      }
      var taskTemplates2 = JSON.parse(JSON.stringify(taskTemplates));
      taskTemplates2.forEach(i=>{
        if(!i.parentTaskid){
          i.parentTaskid=this.parentTask?this.parentTask.id:null;
          i.parentTaskname=this.parentTask?this.parentTask.name:null;
        } else if(!taskTemplates2.some(k=>k.id==i.parentTaskid)){
          i.parentTaskid=this.parentTask?this.parentTask.id:null;
          i.parentTaskname=this.parentTask?this.parentTask.name:null;
        }
      })
      this.load.add = true;
      var projectId=null;
      var productId=null;
      if(this.ptype==='0'){
        if(this.parentTask && this.parentTask.id){
          projectId=this.parentTask.projectId
        }else{
          projectId=this.filters.selProject.id
        } 
      }else{
         if(this.parentTask && this.parentTask.id){
          productId=this.parentTask.productId
        }else{
          productId=this.filters.product.id
        }
      }
      taskTemplates2.forEach((i) => {
        if(this.ptype==='1'){
          i.ptype="1"
          i.projectId=null;
          i.projectName=null;
          if(productId!=i.productId){
            i.menuId=null;
            i.menuName=null;
          }
          i.productId=productId
        }else if(this.ptype==='0'){
          i.ptype="0"
          if(i.isTpl=='1'){
            i.productId=null;
            i.menuId=null;
            i.menuName=null;
          }
          i.projectId=projectId
        }
        i.budgetAt = 0;
        i.budgetWorkload = 80;
        i.level = i.level ? i.level : "3";
        i.planType = i.planType ? i.planType : "w2";
        i.actAt = 0;
        i.actWorkload = 0;
        i.taskState = "0";
        i.rate = 0;
        i.taskOut = i.taskOut ? i.taskOut : "0";
        i.taskClass = i.taskClass ? i.taskClass : "1";
        i.toTaskCenter = i.toTaskCenter ? i.toTaskCenter : "1";
        i.settleSchemel = i.settleSchemel ? i.settleSchemel : "1";
        i.createUserid = this.userInfo.userid;
        i.createUsername = this.userInfo.username;
        const createTime = new Date();
        var startTime = new Date();
        const endTime = new Date();
        endTime.setTime(startTime.getTime() + 3600 * 1000 * 24 * 7 * 2); //两周后
        i.createTime = util.formatDate(
          createTime,
          "yyyy-MM-dd HH:mm:ss"
        );
        i.startTime = util.formatDate(startTime, "yyyy-MM-dd HH:mm:ss");
        i.endTime = util.formatDate(endTime, "yyyy-MM-dd HH:mm:ss");
      });
      var params={
        xmTasks:taskTemplates2,
        ptype:this.ptype
      }
      if(this.ptype==='0'){
        params.projectId=projectId
      }else{
        params.productId=productId
      }
      if(this.parentTask && this.parentTask.id){
        params.parentTaskid=this.parentTask.id
      }
      //////////////////
      batchImportTaskFromTemplate(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.getXmTasks();
            if(this.parentTask && this.parentTask.id){
              treeTool.reloadChildren(this.$refs.table,this.maps,this.parentTask.id,'parentTaskid',this.loadXmTaskLazy)
            }

          }
          this.taskTemplateVisible = false;
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((e) => {
          this.taskTemplateVisible = false;
        });
    },      
    onProductSelected(product) {
      this.filters.product = product;
      this.productSelectVisible = false;
      this.searchXmTasks();
    },
    onProjectRowClick: function (project) {
      this.filters.selProject = project;
      this.projectVisible=false;
      this.$emit("project-row-click",project)
      this.searchXmTasks();
    },
    onProjectClear(){
      this.filters.selProject=null;
      this.projectVisible=false;
      this.xmTasks=[]
      this.searchXmTasks();
    },   
    //查询时选择责任人
    selectCreateUserConfirm(groupUsers,option) { 
      if(option && option.action==='createUserid'){
        if (groupUsers && groupUsers.length > 0) {
          var user= groupUsers[0];
          this.editXmTaskSomeFields(option.data,option.action,user)
        }  
      }else if(option.action=='filtersCreateUserid'){
        if (groupUsers && groupUsers.length > 0) {
          this.filters.createUser = groupUsers[0];
        } else {
          this.filters.createUser = null;
        }
        this.searchXmTasks(); 
      }else{
        if (groupUsers && groupUsers.length > 0) {
          this.filters.executor = groupUsers[0];
        } else {
          this.filters.executor = null;
        }
        this.searchXmTasks(); 
      }
      
    }, 
    setFiltersCreateUserAsMySelf() {
      this.filters.createUser = this.userInfo;
      this.searchXmTasks();
    },
    setFiltersExecutorAsMySelf() {
      this.filters.executor = this.userInfo;
      this.searchXmTasks();
    },    
    onTagSelected(tags,option){
				if(option && option.action=='editTagIds'){
					this.editXmTaskSomeFields(option.data,"tagIds",tags)
				}else{
					if (!tags || tags.length == 0) {
						this.filters.tags=[]
					}else{
						this.filters.tags=tags
					}
					this.searchXmTasks();
				}

			},
    getParams(params) {

      if (this.dateRanger && this.dateRanger.length == 2) {
        params.createTimeStart = this.dateRanger[0];
        params.createTimeEnd = this.dateRanger[1];
      }
      if (
        this.filters.taskType != "all" &&
        this.filters.taskType != "" &&
        this.filters.taskType != null
      ) {
        params.taskType = this.filters.taskType;
      } 
      if(this.filters.taskState){
        params.taskState=this.filters.taskState
      }
      if (this.filters.selProject) {
        params.projectId = this.filters.selProject.id;
      }
      params.workexec = "true";
      if (this.isMy == "1") {
        params.userid = this.userInfo.userid;
        params.isMy = "1";
      }
      if (this.menuId) {
        params.menuId = this.menuId;
      }
      if (this.filters.menus && this.filters.menus.length == 1) {
        params.menuId = this.filters.menus[0].menuId;
      } else if (this.filters.menus && this.filters.menus.length > 1) {
        params.menuIds = this.filters.menus.map((i) => i.menuId);
      }
      if (this.filters.skillTags && this.filters.skillTags.length > 0) {
        params.skillIds = this.filters.skillTags.map((i) => i.skillId);
      }
      if (this.filters.key) {
        params.key = "%" + this.filters.key + "%";
      }
      if (this.filters.taskOut) {
        params.taskOut = this.filters.taskOut;
      }
      if (this.filters.createUser) {
        params.createUserid = this.filters.createUser.userid;
      }
      if (this.filters.executor) {
        params.executorUserid = this.filters.executor.userid;
      }
      if (this.filters.product) {
        params.productId = this.filters.product.id;
      }
      if (this.xmIteration) {
        params.iterationId = this.xmIteration.id;
      }
      if (this.filters.tags && this.filters.tags.length>0) {
        params.tagIdList = this.filters.tags.map(i=>i.tagId);
      }
      if(this.queryScope=="planTask"||this.queryScope=='plan'){
        params.lvls=this.filters.lvls
      }
      return params;
    }, 
    showParentTaskList(){
      if(this.sels.length==0){
        this.$notify({position:'bottom-left',showClose:true,message:"请先选择一个或者多个需要更换上级的计划/任务",type:'warning'})
        return;
      }
      if(this.ptype==='0'){
        if( !this.filters.selProject|| !this.filters.selProject.id){
           this.$notify({position:'bottom-left',showClose:true,message:"请先选择项目",type:'warning'})
           return;
        }
      }else if(this.ptype==='1'){
        if( !this.filters.product|| !this.filters.product.id){
           this.$notify({position:'bottom-left',showClose:true,message:"请先选择产品",type:'warning'})
           return;
        }
      }
      this.selectParentTaskVisible=true

    },
    
			editXmTaskSomeFields(row,fieldName,$event){
				var params={ids:[row.id]};
				if(this.sels.length>0){
					if(!this.sels.some(k=>k.id==row.id)){
						this.$notify({position:'bottom-left',showClose:true,message:'请操作选中的行或者取消选中的行再操作其它行',type:'warning'})
						return;
					}
					params.ids=this.sels.map(i=>i.id)
				}
				if(fieldName==='menuId'){
					if($event){
						params[fieldName]=$event.menuId;
						params.menuName=$event.menuName
            params.productId=$event.productId
					}else{
						return;
					}
				}else if(fieldName==='tagIds'){
					if($event){
						params[fieldName]=$event.map(i=>i.tagId).join(",");
						params.tagNames=$event.map(i=>i.tagName).join(",");
					}else{
						return;
					}
				}else if(fieldName==='workload'){
					params={...params,...$event}
				}else if(fieldName==='executorUserid'){
					params.executorUserid=$event[0].userid
					params.executorUsername=$event[0].username
				}else if(fieldName==='createUserid'){
					params.createUserid=$event.userid
					params.createUsername=$event.username
				}else{
					params[fieldName]=$event
				}

				editXmTaskSomeFields(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						if(this.sels.length>0){
							 this.sels.forEach(i=>{
								 this.fieldTagVisible=false;
								Object.assign(i,params)
							 })
						}else{
							  Object.assign(row,params)
						}
            Object.assign(this.editFormBak,this.editForm)
					}else{
            Object.assign(this.editForm,this.editFormBak)
						this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
					}
				})
			},
    onSelectedParentTask(task){
      if(this.sels.length==0){
         this.$notify({position:'bottom-left',showClose:true,message:"请先选择一个或者多个需要更换上级的计划/任务",type:'warning'})
         this.selectParentTaskVisible=true
        return;
      }else if(task==null || !task.id){
         this.$notify({position:'bottom-left',showClose:true,message:"请选择上级计划/任务",type:'warning'})
        return;
      }

      var params={taskIds:this.sels.map(i=>i.id),parentTaskid:task.id}
      this.$confirm("确认批量更新以下"+this.sels.length+"个任务的上级为【"+task.name+"】吗?", "提示", {
        type: "warning",
      }).then(() => {
        batchChangeParentTask(params).then(res=>{
          var tips = res.data.tips;
          if(tips.isOk){
            this.searchXmTasks();
            
            var rows=[...this.sels,{id:'xxxxx',parentTaskid:task.id}]
            //treeTool.reloadAllChildren(this.$refs.table,this.maps,rows,'parentTaskid',this.loadXmTaskLazy)
          }
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        });
      })
    },
    initData(){
      if (this.selProject) {
        this.filters.selProject = this.selProject;
      }
      if (this.xmProduct) {
        this.filters.product = this.xmProduct;
      }
    },
     
    showMenuGroupUser() { 
      this.$refs.xmGroupDialog.open({data:null,action:'filtersCreateUserid'})
    },
      onProductClearSelect(){
        this.filters.xmProduct=null;
        this.searchXmTasks();
      },
      
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "xm-task-add": XmTaskAdd,
    "xm-task-edit": XmTaskEdit,
    XmTaskAgileKanban,   
    xmTaskTemplateMng,
    XmProjectSelect,     
    XmProductSelect, 
    TagDialog,
    XmGroupDialog,
    XmTableConfig, 
    XmPhaseSelect,
    //在下面添加其它组件
  },
  mounted() {
    this.initData();
    this.$nextTick(() => {
      if( this.selProject && this.selProject.id){
        this.getXmTasks();
      } 
      this.tableHeight = this.source == 'GZT' ? this.tableHeight : util.calcTableMaxHeight(this.$refs.table.$el);
      initSimpleDicts( "all", ["planType","taskType","priority","xmTaskSettleSchemel","priority","taskState",'xm_plan_lvl' ]).then((res) => { 
        Object.assign(this.dicts,res.data.data)
      });
    });
  },
};
</script>

<style scoped>
.more-label-font {
  text-align: center;
  float: left;
  padding-top: 5px;
}
.align-right {
  float: right;
}
</style>
<style lang="scss" scoped>
.extra {
  border-bottom: 1px solid #dedede;
  padding: 8px;
}
.field-label {
  display: inline-block;
  width: 60px;
  font-size: 12px;
  font-weight: bold;
}
.task-header {
  border-top: 1px solid #dedede;
}
.title {
  font-size: 18px;
  font-weight: bold;
  line-height: 36px;
}
.compact {
  font-size: 12px;
  color: #8c92a4;
}
.compact > span {
  color: #00b2f3;
}
.remarks {
  margin-top: 10px;
  font-size: 16px;
  overflow-x: auto;
  overflow-y: hidden;
}
  
</style>
