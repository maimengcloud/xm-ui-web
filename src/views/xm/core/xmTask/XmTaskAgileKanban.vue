<template>
  <section class="menu-box">
		<el-table 
			ref="table"
			:data="menus"
			header-cell-class-name="head-row"
			border
			:height="tableHeight"
			style="width: 100%">
			<el-table-column :label="'需求 ('+menus.length + ')'" class-name="menu-name" width="200">
				<template slot-scope="scope">
					<div class="menu">{{scope.row.name}}</div>
				</template>
			</el-table-column>
			<template v-for="(type, tt) in taskState">
				<el-table-column :label="type.label + '('+ type.number + ')'" :key="tt" width="450">
					<template slot-scope="scope">
						<draggable
							:name="scope.row.menuId"
							:sort="false"
							@start="onStart" @end="onEnd"
							:move="onMove"
							:dicts="{group: scope.row.menuId}"
							class="draggable"
							animation="300"
							scroll
							scrollSensitivity="80"
							scrollSpeed="80"
						>
							<transition-group class="transition-group" :data-menu-id="scope.row.menuId" :data-task-state="type.status">
								<!-- <template v-if="drag.menuId && drag.menuId === scope.row.menuId && drag.taskState !== type.status">
									<div class="drag-to-box">{{type.label}}</div>
								</template> -->
								<template
									v-if="tasks && tasks[scope.row.menuId][tt].length"
								>
									<div
										:data-menu-id="scope.row.menuId"
										:data-task-id="task.id"
										:data-task-state="task.taskState"
										class="task"
										v-for="(task, t) in tasks[scope.row.menuId][tt]"
										:key="task.id"
									>
										<span>
											{{task.sortLevel}}&nbsp;
											<el-tag v-if="task.level<='2'" type="info">轻微</el-tag>
											<el-tag v-else-if="task.level=='3'" type="warning">一般</el-tag>
											<el-tag v-else-if="task.level=='4'" type="danger">紧急</el-tag>
											<el-tag v-else type="danger">特急</el-tag> 
											<span v-for="(item ,index) in [formatExeUsernames(task)]" :key="index">

												<el-tooltip :content="item.exeUsernames" ><el-link     :type="item.type"     @click.stop="showExecusers(task)">{{item.showMsg}}</el-link></el-tooltip>
												
											</span>
											<el-tooltip content="进度"><el-link style="border-radius:30px;" :type="task.rate>=100?'success':'warning'" @click="drawerVisible=true"> {{ (task.rate!=null?task.rate:0)+'%'}} </el-link></el-tooltip>
											<el-tooltip content="预算金额、工时"><el-tag type="info">{{parseFloat(task.budgetCost/10000).toFixed(2)}}万,{{task.budgetWorkload}}人时</el-tag></el-tooltip>
											<el-link  type="primary"  @click.stop="showDrawer(task)">{{task.name}}</el-link>
										</span>
									</div>
								</template>
							</transition-group>
						</draggable>
					</template>
				</el-table-column>
			</template>
		</el-table> 
  </section>
</template>

<script>
import draggable from "vuedraggable";
import { editXmTask } from '@/api/xm/core/xmTask';

export default {
  name: "XmTaskAgileKanban",
  props: ["xmTasks", "tableHeight"],
  data() {
    return {
      taskState: [
        { label: "待领取", status: 0, number: 0 },
        { label: "已领取执行中", status: 1, number: 0 },
        { label: "已完工", status: 2, number: 0 },
        { label: "已结算", status: 3, number: 0 },
      ],
      tasks: {},
			drag: {
				menuId: '',
				state: '',
			},
    };
  },
  components: { draggable },
  watch: {},
  computed: {
    menus() {
      let xmTasks = JSON.parse(JSON.stringify(this.xmTasks || []));
	  xmTasks=xmTasks.filter(i=>i.ntype=='0') 

      let menus = [], menuIds = {}, tasks = {};
			this.taskState.map(d => {
				d.number = 0;
				return d;
			})
      xmTasks.forEach((d, i) => {
        if (!menus.length || !menuIds[d.menuId]) {
          menus.push(d);
          menuIds[d.menuId] = true;
        }
        if (!tasks[d.menuId]) {
					tasks[d.menuId] = [[], [], [], []];
        }
        tasks[d.menuId][parseInt(d.taskState)].push(d);
				this.taskState[parseInt(d.taskState)].number += 1;
			});
      this.tasks = tasks;
      return menus;
    },
  },
  methods: {
		onMove(e) {
			console.log('onMove--e==', e);
			let targetEl = { ...e.dragged.dataset };
			let toEl = { ...e.to.dataset };
			if (targetEl.menuId === toEl.menuId && targetEl.taskState !== toEl.taskState) {
				console.log('onMove--true');
				return true;
			}
			console.log('onMove--false');
			return false;
		},
    onStart(e) {
			console.log('onStart--e==', e);
			let targetEl = { ...e.item.dataset };
			this.drag = { ...targetEl };
			console.log('onStart--targetEl==', targetEl);
		},
		onEnd(e) {
			console.log('onEnd--e==', e);
      this.drag = {};
			// targetEl：拖拽的任务数据; toEl拖拽后的位置.
			let targetEl = { ...e.item.dataset };
			let toEl = { ...e.to.dataset }; 
			if (targetEl.menuId === toEl.menuId && targetEl.taskState !== toEl.taskState) {
 				let task = this.xmTasks.find(d => d.id === targetEl.taskId);
				const params = { ...task, taskState: toEl.taskState };
				editXmTask(params).then(res => { 
					//this.$emit('submit');
				})
 			} else {
 				return false
			}
		},
		formatExeUsernames(row){
			var exeUsernames=row.exeUsernames;
			var respons={
				type:'info',
				executorUsername:row.executorUsername,
				showMsg:'',
				exeUsernames:exeUsernames,
				executorUserid:row.executorUserid,
			}
			if(!row.executorUserid && exeUsernames){
				var exeStatuss=exeUsernames.split(",")
				respons.showMsg=exeStatuss.length+"人候选中"
				return respons;
			}else if(!row.executorUserid && !exeUsernames){
				respons.showMsg="候选中"
				return respons;
			}
			if(row.executorUserid && exeUsernames && exeUsernames.length>0){
				var exeStatuss=exeUsernames.split(",").filter(i=>{
					return i.indexOf(row.executorUsername)>=0
				})
				if(exeStatuss.length<=0){
					respons.showMsg="去设置"
					return respons;
				}
				respons.showMsg=exeStatuss.join(",")
				if(respons.showMsg.indexOf('验收不过')>=0){
					respons.type="danger"
				}else if(respons.showMsg.indexOf('已验收')>=0){
					respons.type="success"
				}
			}else{
				respons.showMsg="去设置"
			}
			return respons
		}
  },
  mounted(){ 	
  }
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
