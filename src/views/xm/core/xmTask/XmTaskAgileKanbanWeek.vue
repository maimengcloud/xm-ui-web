<template>
  <section class="menu-box">
    <el-table
      ref="table"
      :data="weeksCpd"
      header-cell-class-name="head-row"
      border
      :height="tableHeight"
      style="width: 100%" 
    >
      <el-table-column
        :label="'计划周 (' + weeks.length + ')'"
        class-name="menu-name"
        width="200"
      >
        <template slot-scope="scope">
          <div class="menu">
            {{scope.row.weekId}}
          </div>
        </template>
      </el-table-column>
      <template v-for="(type, tt) in taskStateCpd" style="min-width:200px;">
        <el-table-column 
          :label="type.label + '(' + type.number + ')'"
          :key="tt"
          width="250"
        >
          <template slot-scope="scope">
            <el-row class="my-cell-bar">
              <el-button
                icon="el-icon-plus"
                @click="showAddTask(scope.row, type)"
                type="primary"
                plain
                >任务</el-button
              >
            </el-row>
            <draggable
              :name="scope.row.weekId"
              :sort="false"
              @start="onStart"
              @end="onEnd"
              @move="onMove"
              :options="{ group: scope.row.weekId }"
              class="draggable"
              animation="300"
              scroll
              scrollSensitivity="80"
              scrollSpeed="80"
            >
              <transition-group
                class="transition-group"
                :data-week-id="scope.row.weekId"
                :data-task-state="type.status"
              >
                <!-- <template v-if="drag.menuId && drag.menuId === scope.row.menuId && drag.taskState !== type.status">
									<div class="drag-to-box">{{type.label}}</div>
								</template> -->
                <template v-if="tasks && tasksCpd[scope.row.weekId][tt].length">
                  <div @click.stop="showTaskEdit(task)"
                    :data-week-id="scope.row.weekId"
                    :data-task-id="task.id"
                    :data-task-state="task.taskState"
                    class="task" 
                    v-for="(task, t) in tasks[scope.row.weekId][tt]"
                    :key="task.id + t" 
                  >
                  <el-row >
                    <el-tag
                        title="优先级"
                        v-for="(item, index) in formatDictsWithClass(
                          dicts,
                          'priority',
                          task.level
                        )"
                        :key="task.id + index"
                        :type="item.className"
                        >{{ item.name }}</el-tag
                      > 
                      <el-tag
                        title="进度"
                        style="border-radius: 30px"
                        :type="task.rate >= 100 ? 'success' : 'warning'"
                      >
                        {{ (task.rate != null ? task.rate : 0) + "%" }}
                      </el-tag>  
				  	        <span class="my-cell-btn"><el-button    type="danger" icon="el-icon-delete" plain @click.stop="handleDel(task,tt)"></el-button></span>
                  </el-row>
                    <el-row>
                      <span title="执行人" class="label-font-color">
                      {{
                        task.executorUsername
                          ? task.executorUsername
                          : "未设置执行人"
                      }}
                    </span>
                    </el-row>
                     <el-row>
                       <div class="title">{{ task.name }}</div> 
                     </el-row>
                   
                  </div>
                </template>
              </transition-group>
            </draggable>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-dialog
      title="编辑任务"
      :visible.sync="editFormVisible"
      :with-header="false"
      fullscreen
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-task-edit
        :xm-project="
          editForm && editForm.projectId ? { id: editForm.projectId } : null
        "
        :xm-task="editForm"
        :visible="editFormVisible"
        @cancel="editFormVisible = false"
        @after-add-submit="afterExecEditSubmit"
        @after-edit-submit="afterExecEditSubmit"
        @submit="afterEditSubmit" 
        @edit-fields="onEditSomeFields"
      ></xm-task-edit>
    </el-dialog>

    <el-dialog
      title="新增任务"
      :visible.sync="addFormVisible"
      append-to-body
      modal-append-to-body
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addForm">
        <el-form-item label="上级计划" prop="parentTaskname">
          {{ addForm.parentTaskname ? addForm.parentTaskname : "无上级" }}
          <el-button
            @click="selectParentTaskVisible = true"
            title="选择上级计划"
            type="text"
            icon="el-icon-upload2"
          >
            选择上级计划
          </el-button>
        </el-form-item>
        <el-form-item label="任务名称" prop="name">
          <template slot="label">
            <div class="icon" style="background-color: #1cc7ea">
              <i class="el-icon-s-operation"></i>
            </div>
            任务名称
          </template>
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="addXmTask">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="选择新的上级计划"
      append-to-body
      :visible.sync="selectParentTaskVisible"
      width="60%"
      top="20px"
    >
      <xm-phase-select
        :sel-project="selProject"
        @select="onSelectedParentTask"
      ></xm-phase-select>
    </el-dialog>
	

	<el-dialog append-to-body title="需求明细"  :visible.sync="menuDetailVisible" width="80%"  top="20px"  :close-on-click-modal="false">
		<xm-menu-edit :visible="menuDetailVisible"  :reload="true" :xm-menu="{menuId:editForm.menuId,menuName:editForm.menuName}" ></xm-menu-edit>
	</el-dialog>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import draggable from "vuedraggable";
import { initDicts, editXmTaskSomeFields, addTask,delXmTask } from "@/api/xm/core/xmTask";
import XmTaskEdit from "./XmTaskEdit"; //修改界面
import XmPhaseSelect from "../xmTask/XmPhaseSelect.vue";

	import XmMenuEdit from '../xmMenu/XmMenuEdit.vue';
import { mapGetters } from "vuex";

export default {
  name: "XmTaskAgileKanban",
  props: ["xmTasks", "tableHeight", "selProject"],

  data() {
    return {
		load:{add:false,edit:false,list:false,del:false},
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
        rate: 0,
        budgetAt: 0,
        budgetWorkload: 0,
        actAt: 0,
        actWorkload: 0,
        taskState: "0",
        taskType: "4",
        taskClass: "",
        toTaskCenter: "0",
        actStartTime: "",
        actEndTime: "",
        bizProcInstId: "",
        bizFlowState: "",
        phaseId: "",
        phaseName: "",
        taskSkillNames: "",
        exeUsernames: "",
        taskSkillIds: "",
        exeUserids: "",
        taskOut: "0",
        planType: "w2",
        settleSchemel: "1",
        menuId: "",
        menuName: "",
        productId: "",
        cbranchId: "",
        cdeptid: "",
        tagIds: "",
        tagNames: "",
        ntype: "",
        childrenCnt: "",
        ltime: "",
        pidPaths: "",
        lvl: "",
        isTpl: "",
        keyPath: "",
        uniInnerPrice: 80,
        uniOutPrice: 100,
        calcType: "",
        ptype: "",
        wtype: "",
        bctrl: "",
        initWorkload: "",
        shareFee: "",
        oshare: "",
        crowd: "",
        browseUsers: "",
        execUsers: "",
        cityId: "",
        cityName: "",
        regionType: "",
        browseTimes: "",
        capaLvls: "",
        tranMode: "",
        supRequires: "",
        hot: "0",
        top: "0",
        urgent: "0",
        crmSup: "0",
        bidStep: "0",
        interestLvls: "",
        filePaths: "",
        estate: "0",
        efunds: 0,
        etoPlatTime: "",
        etoDevTime: "",
        ebackTime: "",
        topStime: "",
        topEtime: "",
        hotStime: "",
        hotEtime: "",
        urgentStime: "",
        urgentEtime: "",
      },

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
        rate: 0,
        budgetAt: 0,
        budgetWorkload: 0,
        actAt: 0,
        actWorkload: 0,
        taskState: "0",
        taskType: "4",
        taskClass: "",
        toTaskCenter: "0",
        actStartTime: "",
        actEndTime: "",
        bizProcInstId: "",
        bizFlowState: "",
        phaseId: "",
        phaseName: "",
        taskSkillNames: "",
        exeUsernames: "",
        taskSkillIds: "",
        exeUserids: "",
        taskOut: "0",
        planType: "w2",
        settleSchemel: "1",
        menuId: "",
        menuName: "",
        productId: "",
        cbranchId: "",
        cdeptid: "",
        tagIds: "",
        tagNames: "",
        ntype: "",
        childrenCnt: "",
        ltime: "",
        pidPaths: "",
        lvl: "",
        isTpl: "",
        keyPath: "",
        uniInnerPrice: 80,
        uniOutPrice: 100,
        calcType: "",
        ptype: "",
        wtype: "",
        bctrl: "",
        initWorkload: "",
        shareFee: "",
        oshare: "",
        crowd: "",
        browseUsers: "",
        execUsers: "",
        cityId: "",
        cityName: "",
        regionType: "",
        browseTimes: "",
        capaLvls: "",
        tranMode: "",
        supRequires: "",
        hot: "0",
        top: "0",
        urgent: "0",
        crmSup: "0",
        bidStep: "0",
        interestLvls: "",
        filePaths: "",
        estate: "0",
        efunds: 0,
        etoPlatTime: "",
        etoDevTime: "",
        ebackTime: "",
        topStime: "",
        topEtime: "",
        hotStime: "",
        hotEtime: "",
        urgentStime: "",
        urgentEtime: "",
      },
      addFormRules: {
        name: [
          { required: true, message: "任务名称不能为空", trigger: "change" },
          {
            min: 2,
            max: 150,
            message: "长度在 2 到 150 个字符",
            trigger: "change",
          }, //长度
        ],
      },
      editFormVisible: false,
      addFormVisible: false,
      selectParentTaskVisible: false,
	  menuDetailVisible:false,
      taskState: [
        { label: "待领取", status: "0", number: 0 },
        { label: "执行中", status: "1", number: 0 },
        { label: "已完工", status: "2", number: 0 },
        { label: "已验收", status: "3", number: 0 },
        { label: "已结算", status: "4", number: 0 },
        { label: "已关闭", status: "9", number: 0 },
      ],
      taskStateInit: [],
      dicts: {
        priority: [],
        taskType: [],
        planType: [],
        xmTaskSettleSchemel: [],
        taskState: [],
        xm_plan_lvl: [],
      },
      tasks: {},
      weeks: [],
      drag: {
        weekId: "",
        state: "",
      },
    };
  },
  components: { draggable, XmTaskEdit, XmPhaseSelect,XmMenuEdit },
  watch: {
    xmTasks() {
      this.initData();
    },
  },
  computed: {
    ...mapGetters(["userInfo", "roles"]),
    weeksCpd() {
      return this.weeks;
    },
    tasksCpd() {
      return this.tasks;
    },
    taskStateCpd() {
      return this.taskState;
    },
  },
  methods: {
    ...util,
    onMove(e) {
      console.log("onMove--e==", e);

      let targetEl = { ...e.dragged.dataset };
      let toEl = { ...e.to.dataset };
      if (
        targetEl.weekId === toEl.weekId &&
        targetEl.taskState != toEl.taskState
      ) {
        console.log("onMove--true");
        return true;
      }
      console.log("onMove--false");
      return false;
    },
    onStart(e) {
      console.log("onStart--e==", e);
      let targetEl = { ...e.item.dataset };
      this.drag = { ...targetEl };
      console.log("onStart--targetEl==", targetEl);
    },
    onEnd(e) {
      console.log("onEnd--e==", e);
      this.drag = {};
      // targetEl：拖拽的任务数据; toEl拖拽后的位置.
      let targetEl = { ...e.item.dataset };
      let toEl = { ...e.to.dataset };
      if (
        targetEl.weekId === toEl.weekId &&
        targetEl.taskState != toEl.taskState
      ) {
        let task = this.xmTasks.find((d) => d.id === targetEl.taskId);
        let taskIndex = this.xmTasks.findIndex((d) => d.id === targetEl.taskId);
        //const params = { ...task, taskState: toEl.taskState };
        const params = { ids: [task.id], taskState: toEl.taskState };
        editXmTaskSomeFields(params).then((res) => {
          //this.$emit('submit');
          var tips = res.data.tips;
          if (tips.isOk) {
            var taskStateIndex = this.getTaskStateIndex(task.taskState);
            this.taskState[taskStateIndex].number =
              this.taskState[taskStateIndex].number - 1;
            var toTaskStateIndex = this.getTaskStateIndex(params.taskState);
            this.taskState[toTaskStateIndex].number =
              this.taskState[toTaskStateIndex].number + 1;
            task.taskState = params.taskState;
            this.$set(this.xmTasks, taskIndex, task);
          } else {
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: tips.msg,
              type: "error",
            });
          }
          return res.data.tips.isOk;
        });
      } else {
        return false;
      }
    },

    getWeekIdByDateStr(dateStr){
      var date=util.parseDate(dateStr,"yyyy-MM-dd HH:mm:ss")
      var year=date.getFullYear();
      var month=date.getMonth();
      var w=date.getDay();//星期几
      var days=date.getDate();//当前属于当月的几号
      var week= Math.ceil((days+6-w)/7)//当月的第几周
      return year+"年"+(month+1)+"月第"+week+"周"

    },

    initData() {
      var xmTasks = this.xmTasks;
      this.taskState = JSON.parse(JSON.stringify(this.taskStateInit));
      let weeks = [],
        weekIds = {},
        tasks = {};
      xmTasks.forEach((d, i) => {
        if (!d.startTime) {
          d.weekId = this.getWeekIdByDateStr(d.createTime) ;
          d.weekName = "未设置计划时间";
        }else{
          d.weekId=this.getWeekIdByDateStr(d.startTime) 
          d.weekName = d.weekId;
        }
        if (!weeks.length || !weekIds[d.weekId]) {
          weeks.push(d);
          weekIds[d.weekId] = true;
        }
        if (!tasks[d.weekId]) {
          tasks[d.weekId] = [[], [], [], [], [], []];
        }
        var taskStateIndex = this.getTaskStateIndex(d.taskState);
        tasks[d.weekId][taskStateIndex].push(d);
        this.taskState[taskStateIndex].number += 1;
      });
      this.tasks = tasks;
	  weeks.sort((v1,v2)=>{
        
		return util.parseDate(v2.startTime?v2.startTime:v2.createTime,'yyyy-MM-dd HH:mm:ss').getTime()-util.parseDate(v1.startTime?v1.startTime:v1.createTime,'yyyy-MM-dd HH:mm:ss').getTime()
	  })
      this.weeks = weeks;
    },
    showTaskEdit(task) {
      this.editForm = task;
      this.editFormVisible = true;
    },
    afterEditSubmit(task) {
      let taskIndex = this.xmTasks.findIndex((d) => d.id === task.id);
      this.$set(this.xmTasks, taskIndex, task);
    },
    
    onEditSomeFields(params){
      var id=params.ids[0]
      let taskIndex = this.xmTasks.findIndex((d) => d.id === id);
      var task=this.xmTasks[taskIndex]
      Object.assign(task,params )
      this.$set(this.xmTasks, taskIndex, task); 
    },
    getTaskStateIndex(taskState) {
      return this.taskState.findIndex((i) => i.status == taskState);
    },
    afterExecEditSubmit() {},
	showMenuEdit(task){
		this.editForm=task;
		if(task.menuId=='noMenuId'||!task.menuId){
			this.$notify({
              position: "bottom-left",
              showClose: true,
              message: '没有关联任务故事',
              type: "error",
            });
			return;
		}
		this.menuDetailVisible=true;
	},
    addXmTask() {
		this.load.add=true;
      this.$refs.addForm.validate().then((valid) => {
        var task = { ...this.addForm };
        addTask(task)
          .then((res) => {
            this.load.add = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              //this.$emit("submit", res.data.data); //  @submit="afterAddSubmit"
              this.xmTasks.push(res.data.data);
            }
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.add = false));
      });
    },
    onSelectedParentTask(task) {
      this.addForm.parentTaskid = task.id;
      this.addForm.parentTaskname = task.name;
      this.selectParentTaskVisible = false;
    },
    showAddTask(task, type) {
      this.addForm.menuId = task.menuId;
      this.addForm.menuName = task.menuName;
      this.addForm.productId = task.productId;
      this.addForm.taskState = type.status;
      this.addForm.projectId = task.projectId;
      this.addForm.parentTaskid = task.parentTaskid;
      this.addForm.parentTaskname = task.parentTaskname;
      this.addForm.priority = task.priority;
      this.addForm.sortLevel = task.sortLevel;
      this.addForm.verNum = task.verNum;
      this.addForm.pverNum = task.pverNum;
      this.addForm.createUserid = this.userInfo.userid;
      this.addForm.createUsername = this.userInfo.username;
      this.addForm.startTime=task.startTime
      this.addForm.endTime=task.endTime
      this.addForm.qtype = "1";
      this.addForm.ntype = "0";
      this.addForm.ptype = "0";
      this.addFormVisible = true;
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
				var index=this.xmTasks.findIndex(k=>k.id==row.id)
				this.xmTasks.splice(index,1)
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
  },
  mounted() {
    initDicts(this);
    this.taskStateInit = JSON.parse(JSON.stringify(this.taskState));
    this.initData();
  },
};
</script>
<style lang='scss' scoped>
.menu-box {
  height: 100%;
  width: 100%;
  overflow: hidden;
} 

.draggable {
  display: flex;
  flex-wrap: wrap;
  min-height: 100px;
  width: 100%;
}
.el-table {
  /deep/ .el-table__row {
    background: #f6f6f6;
    .menu-name {
      background: #fff !important;
    }
    td {
      height: 100%;
      vertical-align: top;
    }
  }
}
.transition-group {   
  width: 100%;
  cursor: pointer;
  .task {  
    border:1px solid white;
  	min-height: 100px;
    background: #fff;
    margin: 0px 0px 10px 0px;
	  padding: 5px;
  }
}
.my-cell-btn {
  visibility: hidden;
  float: right;
}
.my-cell-bar {
  visibility: hidden;
  float: right;
}

.el-table__row td:hover {
  cursor: pointer;
  .my-cell-bar {
    visibility: visible;
    .u-btn {
      float: right;
    }
  }
  .my-cell-text {
    display: none;
  }
}
.task:hover .my-cell-btn{
   visibility: visible;
}

.task:hover{ 
  border:1px solid blue;
}
.title { 
    height: 40px;
    overflow: hidden; //超出隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
    // 控制行数
    -webkit-line-clamp: 2; //超出两行隐藏
    -webkit-box-orient: vertical; // 从上到下垂直排列子元素
    //（设置伸缩盒子的子元素排列方式）
} 
</style>
