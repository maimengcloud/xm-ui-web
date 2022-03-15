<template>
  <section class="page-container padding border">
    <el-row>
      <el-row>  
        <el-button
          type="warning"
          @click="saveBatchEdit"
          v-loading="load.edit"
          icon="el-icon-finished"
          >保存</el-button
        >
        <el-button
          @click="noBatchEdit"
          v-loading="load.edit"
          icon="el-icon-back"
          >返回</el-button
        > 
      </el-row>
      <el-row style="padding-top: 12px">
        <!-- show-summary -->
        <el-table
          size="small"
          ref="table"
          :height="tableHeight"  
          :data="tasksTreeData" 
          v-loading="load.list"
          @row-click="rowClick"
          @selection-change="selsChange"
          highlight-current-row
          stripe
          fit
          border
          lazy
          :load="loadXmTaskLazy"
          :tree-props="{ children: 'children', hasChildren: 'childrenCnt' }"
          row-key="id"
        >
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column prop="sortLevel" label="序号/名称" width="350" fixed="left">
            <template slot-scope="scope">  
              <el-input
                style="width: 100px"
                v-model="scope.row.sortLevel"
                @change="fieldChange(scope.row, 'sortLevel')"
              ></el-input>
              <el-input style="width: 100%"
                v-model="scope.row.name"
                @change="fieldChange(scope.row, 'name')"
              ></el-input> 
            </template>
          </el-table-column>
          <el-table-column  width="100" prop="createUsername">
              <template slot="header">
                <el-button type="text" icon="el-icon-user" title="批量修改负责人人" @click="showBatchCreateUserSelectVisible">负责人</el-button>
              </template>
          </el-table-column>
          <el-table-column  width="100" prop="executorUsername">
              <template slot="header">
                <el-button type="text" icon="el-icon-user" title="批量修改执行人" @click="showBatchExecUserSelectVisible">执行人</el-button>
              </template>
          </el-table-column> 
          <el-table-column  width="100" prop="menuName">
              <template slot="header">
                <el-button type="text" icon="el-icon-link" title="批量关联需求" @click="showMenu">关联需求</el-button>
              </template>
          </el-table-column>
          <el-table-column label="预估工作量与金额">
          <el-table-column prop="startTime" label="起止时间" width="300">
            <template slot-scope="scope"> 
                  <el-date-picker
                    v-model="scope.row.startTime"
                    size="small"
                    style="width: 99%"
                    align="left"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                    @change="fieldChange(scope.row, 'startTime')"
                  >
                  </el-date-picker> 
                  <el-date-picker
                    v-model="scope.row.endTime"
                    size="small"
                    style="width: 99%"
                    align="right"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :picker-options="pickerOptions"
                    @change="fieldChange(scope.row, 'endTime')"
                  >
                  </el-date-picker>  
            </template>
          </el-table-column>
          <el-table-column label="工作量(人时)" prop="budgetWorkload" width="140">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.budgetWorkload"
                type="number"
                ::precision="2"
                @change="fieldChange(scope.row, 'budgetWorkload')"
              ></el-input>
            </template>
          </el-table-column><el-table-column label="单价.元/人时" prop="uniInnerPrice" width="150">
            <template slot-scope="scope"> 
               
              <el-checkbox
                v-model="scope.row.taskOut"
                false-label="0"
                true-label="1"
                @change="fieldChange(scope.row, 'taskOut')"
              >外购</el-checkbox> 
              &nbsp;
              <el-row> 
              <el-col :span="24" v-if="scope.row.taskOut!='1'">
               <el-input style="width:100%;"
                v-model="scope.row.uniInnerPrice"
                type="number"
                ::precision="2"
                @change="fieldChange(scope.row, 'uniInnerPrice')"
              ></el-input> 
              </el-col>
              <el-col :span="24" v-else>
                <el-input  style="width:100%;"
                v-model="scope.row.uniOutPrice"
                type="number"
                ::precision="2"
                @change="fieldChange(scope.row, 'uniOutPrice')"
              ></el-input>
              </el-col>
              </el-row> 
            </template>
          </el-table-column>
          <el-table-column label="金额.元" prop="budgetCost" width="140">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.budgetCost"
                type="number"
                ::precision="2"
                @change="fieldChange(scope.row, 'budgetCost')"
              ></el-input>
            </template>
          </el-table-column>
           </el-table-column>
           <el-table-column label="实际工作量与应结算金额">
            <el-table-column prop="rate" label="进度" width="100">
              <template slot-scope="scope">
                <el-input
                  type="number"
                  :precision="0"
                  v-model="scope.row.rate"
                  min="0"
                  max="100"
                  @change="fieldChange(scope.row, 'rate')"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="actWorkload" label="工作量.人时" width="100">
              <template slot-scope="scope">
                <el-input
                  :disabled="scope.row.calcType=='1'"
                  type="number"
                  :precision="0"
                  v-model="scope.row.actWorkload"
                  min="0"
                  max="100"
                  @change="fieldChange(scope.row, 'actWorkload')"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="actCost" label="金额.元" width="100">
              <template slot-scope="scope">
                <el-input
                  :disabled="scope.row.calcType=='1'"
                  type="number"
                  :precision="0"
                  v-model="scope.row.actWorkload"
                  min="0"
                  max="100"
                  @change="fieldChange(scope.row, 'actWorkload')"
                ></el-input>
              </template>
            </el-table-column>
           </el-table-column>
          <el-table-column label="结算方案" prop="settleSchemel" width="160">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.settleSchemel"
                @change="fieldChange(scope.row, 'settleSchemel')"
              >
                <el-option
                  v-for="i in dicts.xmTaskSettleSchemel"
                  :label="i.name"
                  :key="i.id"
                  :value="i.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="任务描述" width="350">
            <template slot-scope="scope">
              <el-input
                type="textarea"
                v-model="scope.row.description"
                :rows="1"
                @change="fieldChange(scope.row, 'description')"
              ></el-input>
            </template>
          </el-table-column>
        </el-table> 
      </el-row>
    </el-row>
    
    <el-drawer
      append-to-body
      title="选择执行人"
      :visible.sync="batchExecUserSelectVisible"
      :size="650"
      :close-on-click-modal="false"
    >
      <xm-group-select
        :visible="batchExecUserSelectVisible"
        :sel-project="selProject"
        :isSelectSingleUser="1"
        :ptype="ptype"
        @user-confirm="batchExecUserSelectConfirm"
      ></xm-group-select>
    </el-drawer>

    <el-drawer
      append-to-body
      title="选择负责人"
      :visible.sync="batchGroupUserSelectVisible"
      :size="650"
      :close-on-click-modal="false"
    >
      <xm-group-select
        :visible="batchGroupUserSelectVisible"
        :sel-project="selProject"
        :isSelectSingleUser="1"
        :ptype="ptype"
        @user-confirm="batchCreateUserSelectConfirm"
      ></xm-group-select>
    </el-drawer>
    

		<el-drawer append-to-body title="需求选择"  :visible.sync="menuVisible" size="80%"   :close-on-click-modal="false">
			<xm-menu-select :is-select-menu="true"  @selected="onMenuSelected" :sel-project="xmProject"></xm-menu-select>
		</el-drawer>
    
    <el-drawer
      :title="'标签条件'"
      :visible.sync="tagSelectVisible"
      :size="750"
      append-to-body
      :close-on-click-modal="false"
    >
      <tag-mng
        :tagIds="filters.tags ? filters.tags.map((i) => i.tagId) : []"
        :jump="true"
        @select-confirm="onTagSelected"
      >
      </tag-mng>
    </el-drawer>
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
  listXmTask,
  editXmTask,
  editRate,
  delXmTask,
  batchDelXmTask,
  batchImportTaskFromTemplate,
  batchSaveBudget,
} from "@/api/xm/core/xmTask";

import { mapGetters } from "vuex";
import { sn } from "@/common/js/sequence"; 
import XmGroupSelect from "../xmGroup/XmGroupSelect.vue"; 
import xmMenuSelect from '../xmMenu/XmMenuSelect';

import TagMng from "@/views/mdp/arc/tag/TagMng";

export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]),
    currentProject() {
      return this.selProject;
    },
    currentProjectPhase() {
      return this.selProjectPhase;
    }, 
    tasksTreeData() {
      let xmTasks = JSON.parse(JSON.stringify(this.xmTasks || []));
      const tasksTreeData = treeTool.translateDataToTree(
        xmTasks,
        "parentTaskid",
        "id"
      ); 
      return tasksTreeData;
    },
 
  },
  props: ["selProject",  "visible","ptype","xmTasks","queryScope"],
  watch: {
    selProject: function (oval, val) {
      this.filters.selProject = this.selProject;
      //this.changeSelKey("all");
    }, 
    visible: function (visible) {
      if (visible == true) {
       this.valueChangeRows=[]
      }
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
      }, 
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ["create_time"], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ["desc"], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      dicts: {
        urgencyLevel: [],
        taskType: [],
        planType: [],
        priority: [],
        xmTaskSettleSchemel: [],
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
        budgetCost: "",
        budgetWorkload: "",
        actCost: "",
        actWorkload: "",
        taskState: "",
        taskType: "",
        taskClass: "",
        toTaskCenter: "",
        actStartTime: "",
        actEndTime: "",
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
        budgetCost: "",
        budgetWorkload: "",
        actCost: "",
        actWorkload: "",
        taskState: "",
        taskType: "",
        taskClass: "",
        toTaskCenter: "",
        actStartTime: "",
        actEndTime: "",
      },
      searchTask: "",
      /**begin 自定义属性请在下面加 请加备注**/
      taskStateList: ["待领取", "已领取执行中", "已完工", "已结算"],

      selkey: "",
      drawerVisible: false,
      progress_show: true,
      isChild: false,
      oldrate: "",
      drawerkey: "",

      execUserVisible: false,
      currTaskId: "",
      currTaskName: "",

      skillVisible: false,
      skillIds: [],
      taskSkills: [], 
      taskTemplateVisible: false,
      parentTask: null,
      projectInfoVisible: false,
      batchEditVisible: false,
      valueChangeRows: [], //批量修改时，存储修改过的行
      selectProjectVisible: false,
      menuVisible: false,
      menuDetailVisible: false,
      pickerOptions: util.pickerOptions(),
      gstcVisible: false,
      tableHeight: 300,  
      batchExecUserSelectVisible:false,
      batchGroupUserSelectVisible:false,
      
      tagSelectVisible: false,

	  maps:new Map(),
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {  
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
	  this.load.list=true
	  params=this.getParams(params)
    if(this.ptype=='projectPlan'){
      params.isTop = "1";
      params.withParents = "1";
    }else{ 
      params.ntype="0"
    }
     
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
    /**
     * 计算两个日期之间的天数
     * @param dateString1  开始日期 yyyy-MM-dd
     * @param dateString2  结束日期 yyyy-MM-dd
     */
    getDaysBetween(startDate, endDate) {
      if (startDate == endDate) {
        return 0;
      }
      var days = (startDate - endDate) / (1 * 24 * 60 * 60 * 1000);
      return days;
    },

    showTaskTemplate: function () {
      if (this.currentProjectPhase == null) {
        this.$notify({
          showClose: true,
          message: "请先选择项目计划",
          type: "error",
        });
        return false;
      }
      this.taskTemplateVisible = true;
    },
    showSubAdd(row) {
      this.parentTask = row;
      this.editForm = row;
      this.showAdd();
    },
    //显示新增界面 XmTask xm_task
    showAdd: function () {
      if (!this.currentProjectPhase) {
        this.$notify({
          showClose: true,
          message: "请先选择项目计划",
          type: "error",
        });
        return;
      }
      this.addFormVisible = true;
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getXmTasks();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
      this.getXmTasks();
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
              this.getXmTasks();
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
			  
              var parents=this.sels.filter(i=>!this.sels.some(k=>k.id==i.parentTaskid)); 
				var needLoadChlidList=parents.filter(i=>i.lvl>1) 
				this.searchXmTasks() 
				if(needLoadChlidList.length>0){
					needLoadChlidList.forEach(i=>{ 
							treeTool.reloadChildren(this.$refs.table,this.maps,i.parentTaskid,'parentTaskid',this.loadXmTaskLazy) 
					})
				} 
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
      // this.$emit('row-click',row,);//  @row-click="rowClick"
    },

    isEmpty(str) {
      return str == null || "" == str;
    }, 
    onTaskTemplatesSelected(taskTemplates) {
      ///////////////////
      if (taskTemplates == null || taskTemplates.length == 0) {
        this.taskTemplateVisible = false;
        this.parentTask = null;
        return;
      }
      var taskTemplates2 = JSON.parse(JSON.stringify(taskTemplates));
      this.load.add = true;
      let parents = taskTemplates2.filter((value) => {
        //如果我的上级为空，则我是最上级
        if (
          value.parentTaskid == "undefined" ||
          value.parentTaskid == null ||
          value.parentTaskid == ""
        ) {
          return true;

          //如果我的上级不在列表中，我作为最上级
        } else if (taskTemplates2.some((i) => value.parentTaskid == i.id)) {
          return false;
        } else {
          return true;
        }
      });
      if (this.parentTask != null && this.parentTask != undefined) {
        parents.forEach((i) => (i.parentTaskid = this.parentTask.id));
      } else {
        parents.forEach((i) => (i.parentTaskid = null));
      }
      let children = taskTemplates2.filter((value) => {
        if (taskTemplates2.some((i) => value.parentTaskid == i.id)) {
          return true;
        } else {
          return false;
        }
      });
      let translator = (parents, children) => {
        parents.forEach((parent) => {
          var newId = sn();
          var myChildren = [];
          if (children != null && children.length > 0) {
            myChildren = children.filter(
              (current) => current.parentTaskid === parent.id
            );
          }
          myChildren.forEach((current, index) => {
            current.parentTaskid = newId;
            var mySubChildren = children.filter(
              (c) => c.parentTaskid === current.id
            );
            translator([current], mySubChildren);
          });
          parent.id = newId;
        });
      };

      translator(parents, children);
      taskTemplates2.forEach((i) => {
        i.branchId = this.selProject.branchId;
        i.projectId = this.selProject.id;
        i.projectName = this.selProject.name;  
          i.sortLevel = i.sortLevel ? i.sortLevel : this.parentTask.sortLevel;
          i.taskType = i.taskType ? i.taskType : this.parentTask.taskType;
          i.taskClass = i.taskClass ? i.taskClass : this.parentTask.taskClass;
         
        i.budgetCost = 0;
        i.budgetWorkload = 80;
        i.level = i.level ? i.level : "3";
        i.planType = i.planType ? i.planType : "w2";
        i.actCost = 0;
        i.actWorkload = 0;
        i.taskState = "0";
        i.rate = 0;
        i.taskOut = i.taskOut ? i.taskOut : "0";
        i.taskClass = i.taskClass ? i.taskClass : "1";
        i.toTaskCenter = i.toTaskCenter ? i.toTaskCenter : "1";
        i.settleSchemel = i.settleSchemel ? i.settleSchemel : "quotePrice";
        i.createUserid = this.userInfo.userid;
        i.createUsername = this.userInfo.username;
        const createTime = new Date();
        var startTime = new Date();
        const endTime = new Date();
        endTime.setTime(startTime.getTime() + 3600 * 1000 * 24 * 7 * 2); //两周后
        i.createTime = util.formatDate.format(
          createTime,
          "yyyy-MM-dd HH:mm:ss"
        );
        i.startTime = util.formatDate.format(startTime, "yyyy-MM-dd HH:mm:ss");
        i.endTime = util.formatDate.format(endTime, "yyyy-MM-dd HH:mm:ss");
      });
      //////////////////
      batchImportTaskFromTemplate(taskTemplates2)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.getXmTasks();
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
    onTaskSkillsSelected(skills) {
      skills.forEach((i) => {
        i.taskId = this.editForm.id;
        i.taskName = this.editForm.name;
        i.taskSkillId = i.skillId;
        i.taskSkillName = i.skillName;
        i.skillRemarks = i.skillRemarks;
      });
      batchAddSkill(skills)
        .then((res) => {
          this.load.add = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.skillVisible = false;
            this.getXmTasks();
          }
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((err) => (this.load.add = false));
    }, 
    saveBatchEdit: function () {
      if (this.valueChangeRows.length == 0) {
        this.$notify({
          showClose: true,
          message: "没有改变任何数据，无需保存",
          type: "success",
        });
        return;
      } else {
         

        this.load.edit = true;
        batchSaveBudget(this.valueChangeRows)
          .then((res) => {
            this.load.edit = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              
			  var addOrSub=this.valueChangeRows.filter(i=>i.opType=='add'||i.opType=='addSub')
			  addOrSub.forEach(i=>{
				  treeTool.clearOpType(this.$refs.table,this.maps,i.parentTaskid,'parentTaskid',this.loadXmTaskLazy);
			  }) 
			  this.valueChangeRows = [];
			  this.xmTasks=[]
            }
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((e) => (this.load.edit = false));
      }
    },
    noBatchEdit() {
      if(this.valueChangeRows.length>0){
        this.$confirm('有'+this.valueChangeRows.length+'条数据被更改，但未保存，确认放弃未保存的更改吗？', '提示', {}).then(() => {
          this.batchEditVisible = false;
          if (this.valueChangeRows.length > 0) {
            this.valueChangeRows = [];
            this.$emit("back", true);
          } else {
            this.$emit("back", false);
          }
        })
      }else{
          this.batchEditVisible = false;
          this.$emit("back", false); 
      }
      
    },
    fieldChange: function (row, fieldName, nextReplace) {
      if (nextReplace) {
        row.nextReplace = nextReplace;
      }
      if (fieldName == "startTime" || fieldName == "endTime") {
        if (row.startTime && row.endTime) {
          var start = new Date(row.startTime);
          var end = new Date(row.endTime);
          var days = this.getDaysBetween(end, start);
          if (
            row.taskOut == "1" && row.uniOutPrice&&
            !row.budgetWorkload
          ) {
            row.budgetWorkload = parseFloat((days * 8).toFixed(2));
            row.budgetCost =  row.budgetWorkload * row.uniOutPrice;
          } else if (
            row.taskOut != "1" &&
            row.uniInnerPrice &&
            !row.budgetWorkload
          ) {
            row.budgetWorkload = parseFloat((days * 8).toFixed(2));
            row.budgetCost =
              row.budgetWorkload * row.uniInnerPrice;
          }
        }
      }
      if (fieldName == "budgetWorkload" || fieldName == "taskOut") {
        if (row.taskOut == "1" && row.uniOutPrice) {
          row.budgetCost =
            row.budgetWorkload * row.uniOutPrice;
        } else if (
          row.taskOut != "1" && row.uniInnerPrice
        ) {
          row.budgetCost =
            row.budgetWorkload * row.uniInnerPrice
        }
      }
      if (row.opType) {
        var index = this.valueChangeRows.findIndex((i) => i.id == row.id);

        if (index >= 0) {
          this.valueChangeRows.splice(index, 1);
          this.valueChangeRows.push(row);
        } else {
          this.valueChangeRows.push(row);
        }
      } else {
        var oneRow = this.valueChangeRows.find((i) => i.id == row.id);
        if (oneRow) {
          if (oneRow.nextReplace) {
            var index = this.valueChangeRows.findIndex((i) => i.id == row.id);
            this.valueChangeRows.splice(index, 1);
            this.valueChangeRows.push(row);
          } else {
            return;
          }
        } else {
          this.valueChangeRows.push(row);
        }
      }
    },  
    showMenu(){
      if(this.sels.length==0){
        this.$notify.error("请先选中一条或者多条记录")
        return;
      }else{
        this.menuVisible=true;
      }
    },
    onMenuSelected:function(menu){
      this.menuVisible=false; 
      if(!menu){
        return;
      }else{
        this.sels.forEach(i=>{
          i.menuId=menu.menuId;
          i.menuName=menu.menuName;
          i.productId=menu.productId;
          //i.productName=menu.productName;
        })
      }
      
    }, 
    handlePopover: function (row, opType) { 
      if ("add" == opType) {
        var subRow = JSON.parse(JSON.stringify(this.addForm));
        subRow.parentTaskid = null;
        subRow.id = sn();
        subRow.sortLevel = "1";
		subRow.lvl=1;
        subRow.opType = opType;
        subRow.branchId = this.selProject.branchId;
        subRow.projectId = this.selProject.id;
        subRow.projectName = this.selProject.name; 
          subRow.sortLevel = subRow.sortLevel
            ? subRow.sortLevel
            : this.parentTask.sortLevel;
          subRow.taskType = subRow.taskType
            ? subRow.taskType
            : this.parentTask.taskType;
          subRow.taskClass = subRow.taskClass
            ? subRow.taskClass
            : this.parentTask.taskClass; 
        subRow.budgetCost = 0;
        subRow.budgetWorkload = 80;
        subRow.level = subRow.level ? subRow.level : "3";
        subRow.planType = subRow.planType ? subRow.planType : "w2";
        subRow.actCost = 0;
        subRow.actWorkload = 0;
        subRow.taskState = "0";
        subRow.rate = 0;
        subRow.taskOut = subRow.taskOut ? subRow.taskOut : "0";
        subRow.taskClass = subRow.taskClass ? subRow.taskClass : "1";
        subRow.toTaskCenter = subRow.toTaskCenter ? subRow.toTaskCenter : "1";
        subRow.settleSchemel = subRow.settleSchemel
          ? subRow.settleSchemel
          : "quotePrice";
        subRow.createUserid = this.userInfo.userid;
        subRow.createUsername = this.userInfo.username;
        const createTime = new Date();
        var startTime = new Date();
        const endTime = new Date();
        endTime.setTime(startTime.getTime() + 3600 * 1000 * 24 * 7 * 2); //两周后
        subRow.createTime = util.formatDate.format(
          createTime,
          "yyyy-MM-dd HH:mm:ss"
        );
        subRow.startTime = util.formatDate.format(
          startTime,
          "yyyy-MM-dd HH:mm:ss"
        );
        subRow.endTime = util.formatDate.format(endTime, "yyyy-MM-dd HH:mm:ss");
		subRow.childrenCnt=0;
        this.fieldChange(subRow, "sortLevel");
        this.xmTasks.push(subRow);
      } else if ("addSub" == opType) {
        var subRow = JSON.parse(JSON.stringify(row));
        subRow.children = null;
        subRow.parentTaskid = row.id;
		subRow.childrenCnt=0;
        subRow.id = sn();
        subRow.sortLevel = row.sortLevel + ".1";
		subRow.lvl=row.lvl+1;
        subRow.opType = opType; 
		if(!row.childrenCnt){
			row.childrenCnt=0
		}
		row.childrenCnt=row.childrenCnt+1;
		this.fieldChange(subRow,"sortLevel")
		treeTool.reloadChildrenByOpType(this.$refs.table,this.maps,row.id,'parentTaskid',this.loadXmTaskLazy,opType)
        //this.xmTasks.push(subRow);
      } else if ("delete" == opType) {
        if (row.opType && (row.opType == "addSub" || row.opType == "add")) {
          if (row.children && row.children.length > 0) {
            this.$notify.error("请先删除子元素");
            return;
          } else {
            var index = this.xmTasks.findIndex((i) => i.id == row.id);
            var indexValueChanges = this.valueChangeRows.findIndex(
              (i) => i.id == row.id
            );
			if(indexValueChanges>=0){
				this.valueChangeRows.splice(indexValueChanges, 1);
				treeTool.reloadChildren(this.$refs.table,this.maps,row.parentTaskid,"parentTaskid",this.loadXmTaskLazy)
			}
            
			if(index>=0){ 
            	this.xmTasks.splice(index, 1);
			}
          }
        } else {
          this.$notify.error("只能删除未保存的行");
          return;
        }
      } else if ("highestPmenuId" === opType) {
        if (row.id) {
          this.xmTasks.find((d) => {
            if (d.id === row.id) {
              d.parentTaskid = "";
              this.fieldChange(d, "seqNo");
            }
          });
        }
      }
    }, 
     

    getParams(params) { 
      if (
        this.filters.taskType != "all" &&
        this.filters.taskType != "" &&
        this.filters.taskType != null
      ) {
        params.taskType = this.filters.taskType;
      }
      if (this.selkey == "work") {
        params.work = "work";
      } else if (this.selkey == "finish") {
        params.rate = 100;
      } else if (this.selkey == "myFocus") {
        params.myFocus = "1";
        params.userid = this.userInfo.userid;
      } else if (this.selkey == "myCreate") {
        params.createUserid = this.userInfo.userid;
        params.userid = this.userInfo.userid;
      } else if (this.selkey.indexOf("myExecuserStatus") >= 0) {
        params.userid = this.userInfo.userid;
        params.myExecuserStatus = this.selkey.substring(
          "myExecuserStatus".length
        );
      }
      if(this.filters.taskState){
        params.taskState=this.filters.taskState
      }
      if (this.filters.selProject) {
        params.projectId = this.filters.selProject.id;
      }
      params.workexec = "true";
      if (this.projectPhase) {
        {
          params.phaseId = this.projectPhase.id;
        }
      }
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
      return params;
    }, 
    loadXmTaskLazy(tree, treeNode, resolve,oldDatas,opType) {
      this.maps.set(tree.id, { tree, treeNode, resolve }); //储存数据
	  if( opType=='add'|| opType=='addSub'){
		var addSub=this.valueChangeRows.filter(i=>i.parentTaskid==tree.id)
		var oldDatas2=oldDatas.filter(k=>!addSub.some(i=>i.id==k.id))
		addSub.push(...oldDatas2)
		addSub.sort((a,b)=>a.sortLevel-b.sortLevel)
		resolve(addSub)
		return;
	  }
	  if(opType=='clearOpType'){
		  oldDatas.forEach(i=>i.opType="")
		  resolve(oldDatas)
		  return;
	  }
      var params = { parentTaskid: tree.id };
      params = this.getParams(params);
      params.isTop = "";
      this.load.list = true;
      var func = listXmTask;
      func(params)
        .then((res) => {
          this.load.list = false;
          var tips = res.data.tips;
          if (tips.isOk) {
			  var data=res.data.data;
			  var addSub=this.valueChangeRows.filter(i=>i.parentTaskid==tree.id)
			  addSub.push(...data) 
			  addSub.sort((a,b)=>a.sortLevel-b.sortLevel)
            resolve(addSub);
          } else {
            resolve([]);
          }
        })
        .catch((err) => (this.load.list = false));
    }, 
    //查询时选择责任人
    createUserSelectConfirm(groupUsers) {
      if (groupUsers && groupUsers.length > 0) { 
        this.editForm.createUserid = groupUsers[0].userid;
        this.editForm.createUsername = groupUsers[0].username;
      }else{
        this.editForm.createUserid = "";
        this.editForm.createUsername = "";
      }
      this.groupUserSelectVisible=false;
    },
    //查询时选择责任人
    showBatchCreateUserSelectVisible() {
       if(!this.sels||this.sels.length==0){
         this.$notify({showClose:true,message:'请先选中一条或多条数据',type:'error'})
         return;
       }else{
         this.batchGroupUserSelectVisible=true;
       }
    },
    //查询时选择责任人
    showBatchExecUserSelectVisible() {
       if(!this.sels||this.sels.length==0){
         this.$notify({showClose:true,message:'请先选中一条或多条数据',type:'error'})
         return;
       }else{
         this.batchExecUserSelectVisible=true;
       }
    },
     //查询时选择责任人
    batchCreateUserSelectConfirm(groupUsers) {
      var user={};
      if (groupUsers && groupUsers.length > 0) { 
        user=groupUsers[0]
      } 
      this.batchGroupUserSelectVisible=false;
      this.sels.forEach(i=>{
        i.createUserid=user.userid;
        i.createUsername=user.username; 
        this.fieldChange(i,"executorUsername")
      })
    },
     //查询时选择责任人
    batchExecUserSelectConfirm(groupUsers) {
      var user={};
      if (groupUsers && groupUsers.length > 0) { 
        user=groupUsers[0]
      } 
      this.batchExecUserSelectVisible=false;
      this.sels.forEach(i=>{
        i.executorUserid=user.userid;
        i.executorUsername=user.username;
        this.fieldChange(i,"executorUsername")
      })
    },
    
    clearFiltersTag(tag){
      var index=this.filters.tags.findIndex(i=>i.tagId==tag.tagId)
      this.filters.tags.splice(index,1);
      this.searchXmTasks();
    },
    onTagSelected(tags){
      
      this.tagSelectVisible = false; 
      if (!tags || tags.length == 0) { 
        this.filters.tags=[]
      }else{
        this.filters.tags=tags
      }
      this.searchXmTasks();
    }, 
  }, //end methods
  components: {
    //在下面添加其它组件
    XmGroupSelect,xmMenuSelect,TagMng,
  },
  mounted() {
    if (this.selProject) {
      this.filters.selProject = this.selProject;
    }
    if (this.selProjectPhase) {
      this.projectPhase = this.selProjectPhase;
    } 
    this.$nextTick(() => { 
      this.tableHeight = util.calcTableMaxHeight(this.$refs.table.$el); 
      initSimpleDicts( "all",["planType","taskType","urgencyLevel","xmTaskSettleSchemel","priority"]).then((res) => {
        this.dicts = res.data.data;
      });
    });
    // 阻止默认行为
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    }; 
  },
};
</script>

<style scoped>
.xm-task {
  width: 100%;
}
.xm-task > .el-menu-demo {
  height: 50px;
  padding-left: 10px;
  background: #fafbfc;
}
.xm-task > .el-menu-demo > li {
  height: 100%;
  line-height: 50px;
  color: #303133;
}
.xm-task > .el-menu-demo > li:hover {
  background: transparent;
}
.xm-task > .el-menu-demo > .is-active {
  background: transparent;
}

.xm-task-add >>> .el-drawer__body {
  padding: 0 20px;
}
.xm-task >>> .el-drawer__close-btn {
  display: none !important;
}
.xm-task >>> .el-drawer__header {
  background-color: #fafbfc;
  border-bottom: 1px solid #efefef;
  padding: 8px 16px;
}
/* .xm-task .progress-form >>> .el-form-item__label{ */
/* line-height: 1.15; */
/* } */
.xm-task >>> .el-drawer__body {
  overflow: auto;
  padding: 0 20px;
}
.xm-task .el-progress--without-text {
  display: flex;
  align-items: center;
}
.xm-task >>> .el-progress-bar__inner {
  transition: none !important;
}
.xm-task .progress-bar {
  padding: 10px 0;
}
.xm-task .progress-btn {
  line-height: 0;
  position: absolute;
  top: 7px;
}
.xm-task .progress-disable >>> .el-progress-bar__inner {
  background-color: #ccc !important;
}

small {
  font-size: 12px;
  /* float:right; */
  color: #6c757d !important;
  margin-left: 20px;
}

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

.clearfix::after {
  clear: both;
  content: "";
}
</style>
<style lang="scss" scoped>
.el-table {
  box-sizing: border-box;
  /deep/ .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-right: 10px;
    display: flex;
  }
}
</style>