<template>
  <section class="menu-box">
    <el-table
      ref="table"
      :data="menusCpd"
      header-cell-class-name="head-row"
      border
      :height="tableHeight"
      style="width: 100%"
    >
      <el-table-column
        :label="'用户故事 (' + menus.length + ')'"
        class-name="menu-name"
        width="200"
      >
        <template slot-scope="scope">
          <div class="menu">{{ scope.row.menuName }}</div>
        </template>
      </el-table-column>
      <template v-for="(type, tt) in taskStateCpd">
        <el-table-column
          :label="type.label + '(' + type.number + ')'"
          :key="tt"
          width="450"
        >
          <template slot-scope="scope">
            <draggable
              :name="scope.row.menuId"
              :sort="false"
              @start="onStart"
              @end="onEnd"
              @move="onMove"
              :options="{ group: scope.row.menuId }"
              class="draggable"
              animation="300"
              scroll
              scrollSensitivity="80"
              scrollSpeed="80"
            >
              <transition-group
                class="transition-group"
                :data-menu-id="scope.row.menuId"
                :data-task-state="type.status"
              >
                <!-- <template v-if="drag.menuId && drag.menuId === scope.row.menuId && drag.taskState !== type.status">
									<div class="drag-to-box">{{type.label}}</div>
								</template> -->
                <template v-if="tasks && tasksCpd[scope.row.menuId][tt].length">
                  <div
                    :data-menu-id="scope.row.menuId"
                    :data-task-id="task.id"
                    :data-task-state="task.taskState"
                    class="task"
                    v-for="(task, t) in tasks[scope.row.menuId][tt]"
                    :key="task.id + t"
                  >
                    <span>
                      {{ task.sortLevel }}&nbsp;
                      <el-tag v-if="task.level <= '2'" type="info">轻微</el-tag>
                      <el-tag v-else-if="task.level == '3'" type="warning"
                        >一般</el-tag
                      >
                      <el-tag v-else-if="task.level == '4'" type="danger"
                        >紧急</el-tag
                      >
                      <el-tag v-else type="danger">特急</el-tag>
                      <span
                        v-for="(item, index) in [formatExeUsernames(task)]"
                        :key="index"
                      >
                        <el-tooltip :content="item.exeUsernames"
                          ><el-link
                            :type="item.type"
                            @click.stop="showEditForm(task)"
                            >{{ item.showMsg }}</el-link
                          ></el-tooltip
                        >
                      </span>
                      <el-tooltip content="进度"
                        ><el-link
                          style="border-radius: 30px"
                          :type="task.rate >= 100 ? 'success' : 'warning'"
                          @click.stop="showEditForm(task)"
                        >
                          {{ (task.rate != null ? task.rate : 0) + "%" }}
                        </el-link></el-tooltip
                      >
                      <el-tooltip content="预算金额、工时"
                        ><el-tag type="info"
                          >{{
                            parseFloat(task.budgetAt / 10000).toFixed(2)
                          }}万,{{ task.budgetWorkload }}人时</el-tag
                        ></el-tooltip
                      >
                      <el-link
                        type="primary"
                        @click.stop="showEditForm(task)"
                        >{{ task.name }}</el-link
                      >
                    </span>
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
      width="80%"
      top="20px"
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
      ></xm-task-edit>
    </el-dialog>
  </section>
</template>

<script>
import draggable from "vuedraggable";
import { editXmTaskSomeFields } from "@/api/xm/core/xmTask";
import XmTaskEdit from "./XmTaskEdit"; //修改界面

export default {
  name: "XmTaskAgileKanban",
  props: ["xmTasks", "tableHeight"],
  data() {
    return {
      editForm: null,

      editFormVisible: false,
      taskState: [
        { label: "待领取", status: "0", number: 0 },
        { label: "执行中", status: "1", number: 0 },
        { label: "已完工", status: "2", number: 0 },
        { label: "已验收", status: "3", number: 0 },
        { label: "已结算", status: "4", number: 0 },
        { label: "已关闭", status: "9", number: 0 },
      ],
      taskStateInit:  [],
      tasks: {},
      menus: [],
      drag: {
        menuId: "",
        state: "",
      },
    };
  },
  components: { draggable, XmTaskEdit },
  watch: {
    xmTasks() {
      this.initData();
    },
  },
  computed: {
    menusCpd() {
      return this.menus;
    },
    tasksCpd() {
      return this.tasks;
    },
    taskStateCpd() {
      return this.taskState;
    },
  },
  methods: {
    onMove(e) {
      console.log("onMove--e==", e);

      let targetEl = { ...e.dragged.dataset };
      let toEl = { ...e.to.dataset };
      if (
        targetEl.menuId === toEl.menuId &&
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
        targetEl.menuId === toEl.menuId &&
        targetEl.taskState != toEl.taskState
      ) {
        let task = this.xmTasks.find((d) => d.id === targetEl.taskId);
        let taskIndex = this.xmTasks.findIndex((d) => d.id === targetEl.taskId);
        //const params = { ...task, taskState: toEl.taskState };
		const params = { ids:[task.id], taskState: toEl.taskState };
        editXmTaskSomeFields(params).then((res) => {
          //this.$emit('submit');
          var tips = res.data.tips;
          if (tips.isOk) {
			var taskStateIndex=this.getTaskStateIndex(task.taskState)
            this.taskState[taskStateIndex].number =
              this.taskState[taskStateIndex].number - 1;
			  var toTaskStateIndex=this.getTaskStateIndex(params.taskState)
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
    formatExeUsernames(row) {
      var exeUsernames = row.exeUsernames;
      var respons = {
        type: "info",
        executorUsername: row.executorUsername,
        showMsg: "",
        exeUsernames: exeUsernames,
        executorUserid: row.executorUserid,
      };
      if (!row.executorUserid && exeUsernames) {
        var exeStatuss = exeUsernames.split(",");
        respons.showMsg = exeStatuss.length + "人候选中";
        return respons;
      } else if (!row.executorUserid && !exeUsernames) {
        respons.showMsg = "候选中";
        return respons;
      }
      if (row.executorUserid && exeUsernames && exeUsernames.length > 0) {
        var exeStatuss = exeUsernames.split(",").filter((i) => {
          return i.indexOf(row.executorUsername) >= 0;
        });
        if (exeStatuss.length <= 0) {
          respons.showMsg = "去设置";
          return respons;
        }
        respons.showMsg = exeStatuss.join(",");
        if (respons.showMsg.indexOf("验收不过") >= 0) {
          respons.type = "danger";
        } else if (respons.showMsg.indexOf("已验收") >= 0) {
          respons.type = "success";
        }
      } else {
        respons.showMsg = "去设置";
      }
      return respons;
    },
    initData() {
      var xmTasks = this.xmTasks;
	  this.taskState=JSON.parse(JSON.stringify(this.taskStateInit))
      let menus = [],
        menuIds = {},
        tasks = {}; 
      xmTasks.forEach((d, i) => {
        if (!d.menuId) {
          d.menuId = "noMenuId";
          d.menuName = "未关联需求的任务";
        }
        if (!menus.length || !menuIds[d.menuId]) {
          menus.push(d);
          menuIds[d.menuId] = true;
        }
        if (!tasks[d.menuId]) {
          tasks[d.menuId] = [[], [], [], [],[],[]];
        }
		var taskStateIndex=this.getTaskStateIndex(d.taskState)
        tasks[d.menuId][taskStateIndex].push(d);
        this.taskState[taskStateIndex].number += 1;
      });
      this.tasks = tasks;
      this.menus = menus;
    },
    showEditForm(task) {
      this.editForm = task;
      this.editFormVisible = true;
    },
    afterEditSubmit(task) {
      let taskIndex = this.xmTasks.findIndex((d) => d.id === task.id);
      this.$set(this.xmTasks, taskIndex, task);
    },
	getTaskStateIndex(taskState){
		return this.taskState.findIndex(i=>i.status==taskState)
	},
    afterExecEditSubmit() {},
  },
  mounted() { 
	this.taskStateInit=JSON.parse(JSON.stringify(this.taskState))
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
.row {
  width: 2000px;
  display: flex;
  flex-direction: row;
  overflow: scroll;
  border-top: 1px solid #ccc;
  .item {
    width: 200px;
    padding: 10px;
    border-left: 1px solid #ccc;
    display: flex;
    flex-wrap: wrap;
    &.status {
      width: 450px;
    }
    &:last-child {
      border-right: 1px solid #ccc;
    }
  }
  &:last-child {
    border-bottom: 1px solid #ccc;
  }
  &.head-row {
    font-size: 14px;
    font-weight: 500;
    background: #efefef;
    color: #303030;
  }
  &.menu—row {
    background: #f6f6f6;
    .item-menu {
      background: #ffffff;
    }
    .task {
      width: 200px;
      height: 100px;
      margin: 10px 0 0 10px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border-radius: 3px;
      background-color: #fff;
    }
  }
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
  display: flex;
  flex-wrap: wrap;
  min-height: 100px;
  width: 100%;
  .task {
    width: 200px;
    background: #fff;
    margin: 10px 0 0 10px;
  }
}
</style>
