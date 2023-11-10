<template>
  <section>
        <el-row v-show="!batchVisible">
          <div style="display:flex;justify-content: space-between;">
               <xm-project-select style="display:inline;" v-if="!selProject||!selProject.id" :auto-select="isTaskCenter?false:true"  :link-iteration-id="xmIteration?xmIteration.id:null" :link-product-id="xmProduct?xmProduct.id:null"  @row-click="onProjectRowClick" @clear="onProjectClear" ></xm-project-select>
              <el-input v-else v-model="filters.key" placeholder="名称模糊查询"  clearable @keyup.enter.native="searchXmTasks()"></el-input>
             <span style="display:flex;">
             <el-popover
              style="margin-left:5px;"
              placement="top-start"
              title="选择创建计划/任务的方式"
              width="300"
              trigger="click"
            >
              <el-row>
                <el-row>

                  <div    class="icon" :style="{backgroundColor:   '#E6A23C'}">
                    <i :class=" 'el-icon-time' " ></i>
                  </div>
                  <el-button
                    @click="showEpicFeaturesForCreateTask"
                    icon="el-icon-plus"
                    >由史诗特性快速创建计划 (推荐)</el-button
                  >
                </el-row>
                <el-row>

                  <div    class="icon" :style="{backgroundColor:   '#E6A23C'}">
                    <i :class=" 'el-icon-time' " ></i>
                  </div>
                  <el-button
                    @click="showTaskTemplate"
                    icon="el-icon-plus"
                    >从模板快速导入计划 </el-button
                  >
                </el-row>
                <el-row>

                  <div    class="icon" :style="{backgroundColor:   '#E6A23C'}">
                    <i :class=" 'el-icon-time' " ></i>
                  </div>
                  <el-button
                    @click="showAdd('1')"
                    icon="el-icon-plus"
                    >直接创建计划</el-button
                  >
              </el-row>
              </el-row>
              <el-button
                slot="reference"
                type="primary"
                circle
                plain
                icon="el-icon-plus"
                title="新建计划"
              ></el-button>
            </el-popover>
            <el-popover
              style="margin-left:5px;"
              placement="top-start"
              title="更多条件、操作"
              width="400"
              trigger="manual"
              v-model="moreVisible"
            >
                    <el-button  style="float:right;margin-top:-40px;"
                    icon="el-icon-close"
                    @click="moreVisible=false"
                    type="text"
                    >关闭</el-button
                    >
                <el-divider></el-divider>
                <el-row>
                  <el-button type="danger"
                      @click="batchDel"
                      v-loading="load.del"
                      icon="el-icon-delete"
                      title="批量删除"
                      >批量删除</el-button
                    >
                  <el-button
                    @click="showParentTaskList"
                    title="更换任务的上级，实现任务搬家功能"
                    icon="el-icon-upload2"
                    v-loading="load.edit"
                  > 更换上级</el-button>
                  <span style="float:right;">
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="searchXmTasks"
                    >查询</el-button
                  >
                  </span>
                </el-row>
              <el-button slot="reference" @click="moreVisible=!moreVisible" icon="el-icon-more" circle plain></el-button>
            </el-popover>
          </span>
           </div>

        </el-row>
        <el-row v-show="batchVisible">
              <el-button type="danger"
                      @click="batchDel"
                      v-loading="load.del"
                      icon="el-icon-delete"
                      title="批量删除"
                      >删除</el-button
                    >
                  <el-button
                    @click="showParentTaskList"
                    title="更换任务的上级，实现任务搬家功能"
                    icon="el-icon-upload2"
                    v-loading="load.edit"
                  > 更换上级</el-button>
        </el-row>
        <el-row class="padding-top">
            <el-table
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
              <template v-if="batchVisible">
                <el-table-column
                  label="全选"
                  type="selection"
                  width="50"
                >
                </el-table-column>
              </template>

              <el-table-column
                prop="name"
                label="计划名称"
              >
              <template slot="header" slot-scope="scope">
									<div style="display:flex;">
										<div style="width:40%;text-align: left;line-height: 32px;">计划名称</div>
                     <div style="line-height: 32px;width:60%;display: flex;justify-content: right;">
                      <el-checkbox title="您可以批量删除、批量更换上级等操作" v-model="batchVisible"><span style="color:#C0C4CC;">批量</span></el-checkbox>
                      <el-input v-if="!selProject||!selProject.id"  v-model="filters.key" size="mini" style="margin-left:5px;"  placeholder="名称模糊查询"  clearable></el-input>
                    </div>

                  </div>
              </template>
                <template slot-scope="scope">
                  <!--
                  <div    class="icon" :style="{backgroundColor:  scope.row.ntype==='1'?'#E6A23C':'#409EFF'}">
									<i :class="scope.row.ntype==='1'?'el-icon-time':'el-icon-s-operation'" ></i>
									</div>
                  -->
                  <span class="hidden-md-and-down">
                    {{ scope.row.sortLevel }}&nbsp;
                  </span>
                  <span style="font-size:14px;"> {{ scope.row.name }}
                    </span>
                        <el-popover class="hidden-bar" @click.stop
                          placement="top-start"
                          :open-delay=500
                          trigger="hover"
                        >
                          <el-row>
                            <el-row>

                              <el-button
                                @click="showEpicFeaturesForCreateSubTask(scope.row)"
                                icon="el-icon-plus"
                                >由史诗特性快速创建子计划 (推荐)</el-button
                              >
                            </el-row>
                            <el-row>

                              <el-button
                                @click="showTaskTemplate"
                                icon="el-icon-plus"
                                >从模板快速导入子计划 </el-button
                              >
                            </el-row>
                            <el-row>

                              <el-button type="primary"  @click.stop="showSubAdd( scope.row,scope.$index,'1')" icon="el-icon-plus" title="新建子计划">直接创建子计划 </el-button>
                           </el-row>
                          </el-row>
                          <el-row>

                            <el-button      @click.stop="showEdit( scope.row,scope.$index)" icon="el-icon-edit" title="编辑"  > 编辑计划</el-button>
                          </el-row>
                          <el-button type="text" slot="reference" icon="el-icon-setting" size="mini" circle plain></el-button>

                        </el-popover>
                  <el-button type="text" size="mini" circle plain v-if="editForm&&editForm.id==scope.row.id" @click.stop="unselectRow()" title="取消选中状态" icon="el-icon-circle-close"></el-button>
                  <mdp-select show-style="tag" style="float: right;" class="hidden-md-and-down" item-code="taskState"  v-model="scope.row.taskState" :disabled="true"/>
 
                  <el-link
                    style="float: right;line-height: 24px;height: 24px;"
                    :type="scope.row.rate >= 100 ? 'success' : 'warning'"
                    @click.stop="calcProgress(scope.row)"
                    class="el-icon-refresh"
                  >
                    {{ (scope.row.rate != null ? scope.row.rate : 0) + "%" }}
                  </el-link>

                </template>
              </el-table-column>
            </el-table>
        </el-row>
            <el-pagination
              ref="pagination"
              layout="total, sizes, prev, pager, next"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :page-sizes="[10, 20, 50, 100, 500]"
              :current-page="pageInfo.pageNum"
              :page-size="pageInfo.pageSize"
              :total="pageInfo.total"
              style="float: right;"
            ></el-pagination>
    <!--编辑 XmTask xm_task界面-->
    <el-dialog
      title="编辑计划"
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
      title="新增计划"
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

    <el-dialog title="选择新的上级计划" append-to-body :visible.sync="selectParentTaskVisible" width="60%" top="20px">
      <xm-phase-select :sel-project="filters.selProject" @select="onSelectedParentTask"></xm-phase-select>
    </el-dialog>

    <el-drawer
      append-to-body
      title="史诗特性选择"
      :visible.sync="epicFeaturesForImportTaskVisible"
      size="70%"
      :close-on-click-modal="false"
    >
      <xm-epic-features-select
        :visible="epicFeaturesForImportTaskVisible"
        :is-select-menu="true"
        :multi="true"
         :xm-product="filters.product"
         :sel-project="filters.selProject"
        @menus-selected="onEpicFeaturesForImportTask"
      ></xm-epic-features-select>
    </el-drawer>
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

import XmEpicFeaturesSelect from "../xmMenu/XmEpicFeaturesSelect";

export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]),
    tasksTreeData() {
      let xmTasks = JSON.parse(JSON.stringify(this.xmTasks || []));
      if(this.filters.key){
        xmTasks=xmTasks.filter(k=>k.name.indexOf(this.filters.key)>=0)
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
    },
    xmProduct: function () {
      this.filters.product = this.xmProduct;
    },
    xmIteration: function () {
    },
    toSearchCpd:function(){
      this.loadDatasFirstCache();
    }
  },
  data() {
    return {
      batchVisible:false,
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
        lvls:[],
      },
      xmTasks: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 500, //每页数据
        count:false, //是否需要重新计算总记录数
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
      taskTemplateVisible: false,
      parentTask: null,
      pickerOptions: util.getPickerOptions(),
       tableHeight: 300,
       selectParentTaskVisible:false,
      execUserVisible:false,
      epicFeaturesForImportTaskVisible:false,
      moreVisible:false,
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
      this.load.list=true
      getTask(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            var xmTasks = res.data.data;
            this.xmTasks = xmTasks;
            this.setDatasToCache(this.xmTasks)
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

    showEpicFeaturesForCreateSubTask: function (parentTask) {
      if(!this.checkCanAdd(parentTask)){
        return;
      }
      this.parentTask = parentTask;
      this.epicFeaturesForImportTaskVisible = true;
    },
    showEpicFeaturesForCreateTask(){
      if(!this.checkCanAdd(null)){
        return;
      }
      this.parentTask = null;
      this.epicFeaturesForImportTaskVisible = true;
    },
    onEpicFeaturesForImportTask(menus) {
      if (menus == null || menus.length == 0) {
        this.epicFeaturesForImportTaskVisible = false;
        return;
      }
      var menus2 = JSON.parse(JSON.stringify(menus));
      menus2.forEach((i) => {
        i.id = i.menuId;
        i.parentTaskid = i.pmenuId;
        i.name = i.menuName;
        i.ntype="1"
      });
      this.onTaskTemplatesSelected(menus2);
      this.epicFeaturesForImportTaskVisible = false;
    },
    unselectRow(){
      this.$refs.table.setCurrentRow();
      this.editForm=null;
      this.$emit("row-click",null)
    },
    //显示编辑界面 XmTask xm_task
    showEdit: function (row, index) {

      if(this.editForm && row.id!=this.editForm.id){
        this.$refs.table.setCurrentRow(row);
        this.$emit("row-click",row)
      }
      this.editForm=row
      this.editFormVisible = true;
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
      if(this.editForm && row.id!=this.editForm.id){
        this.$refs.table.setCurrentRow(row);
        this.$emit("row-click",row)
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

      this.addForm.taskOut="0";
      this.addForm.crowd="0";
      this.addForm.toTaskCenter="0";
      this.addFormVisible = true;
    },
    afterAddSubmit(row) {
      this.addFormVisible = false;
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
      var data=this.xmTasks.find(k=>k.id==this.editForm.id)
      if(data){
        var dataRaw=JSON.parse(JSON.stringify(params))
        dataRaw.children=null;
        Object.assign(data,dataRaw)
        this.setDatasToCache(this.xmTasks)
      }
    },
    //选择行xmTask
    selsChange: function (sels) {
      this.sels = sels;
    },
    //批量删除xmTask
    batchDel: function () {
      if(!this.batchVisible){
        this.$notify.warning("请先开启【批量】操作模式")
        return;
      }
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
    rowClick: function (row,column) {
      if(this.editForm && row.id===this.editForm.id){
        return;
      }
      this.editForm = row;
      this.editFormBak=Object.assign({},row)
      this.$emit('row-click',row,);//  @row-click="rowClick"
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
      if(this.parentTask && this.parentTask.id){
        projectId=this.parentTask.projectId
      }else{
        projectId=this.filters.selProject.id
      }
      if(this.filters.xmProduct && this.filters.xmProduct.id){
        productId=this.filters.xmProduct.id
      }else{
        if(taskTemplates2.some(k=>k.productId && k.isTpl!=='1')){
          productId=taskTemplates2.find(k=>k.productId).productId
        }
      }

      taskTemplates2.forEach((i) => {
          i.ptype="0"
          if(i.isTpl=='1'){
            i.productId=productId;
            i.menuId=null;
            i.menuName=null;

          }
        i.ntype="1"
        i.projectId=projectId
        i.budgetAt = 0;
        i.budgetWorkload = 80;
        i.level = i.level ? i.level : "3";
        i.planType = i.planType ? i.planType : "w2";
        i.actAt = 0;
        i.actWorkload = 0;
        i.taskState = "0";
        i.rate = 0;
        i.sortLevel=i.seqNo;
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
        ptype:"0"
      }
      params.projectId=projectId
      if(this.parentTask && this.parentTask.id){
        params.parentTaskid=this.parentTask.id
      }
      //////////////////
      batchImportTaskFromTemplate(params)
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
    onProductSelected(product) {
      this.filters.product = product;
      this.productSelectVisible = false;
    },
    onProjectRowClick: function (project) {
      this.filters.selProject = project;
      this.projectVisible=false;
      this.$emit("project-row-click",project)
      this.loadDatasFirstCache();
    },
    onProjectClear(){
      this.filters.selProject=null;
      this.projectVisible=false;
      this.xmTasks=[]
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

      if (this.filters.taskOut) {
        params.taskOut = this.filters.taskOut;
      }
      if (this.filters.createUser) {
        params.createUserid = this.filters.createUser.userid;
      }
      if (this.filters.executor) {
        params.executorUserid = this.filters.executor.userid;
      }
      if (this.filters.product) {//上级不需要按产品过滤
        //params.productId = this.filters.product.id;
      }
      if (this.xmIteration) {//上级不需要按迭代过滤
        //params.iterationId = this.xmIteration.id;
      }
      if (this.filters.tags && this.filters.tags.length>0) {
        params.tagIdList = this.filters.tags.map(i=>i.tagId);
      }
      if(this.filters.lvls.length>0){
        params.lvls=this.filters.lvls
      }
      return params;
    },
    showParentTaskList(){
      if(!this.batchVisible){
        this.$notify.warning("请先开启【批量】操作模式")
        return;
      }
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

      onProductClearSelect(){
        this.filters.xmProduct=null;
        this.searchXmTasks();
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
    XmEpicFeaturesSelect,
    //在下面添加其它组件
  },
  mounted() {
    this.initData();
    this.$nextTick(() => {
      initDicts(this)
      this.loadDatasFirstCache();
      this.tableHeight = this.source == 'GZT' ? this.tableHeight : util.calcTableMaxHeight(this.$refs.table.$el);

    });
  },
};
</script>

<style lang="scss" scoped>
</style>
