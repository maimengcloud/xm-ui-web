<template>
  <section class="menu-box">
		<!-- <div class="itxst">
			<div class="col">
					<div class="title">A列</div>
					<draggable v-model="arr1" group="site" animation="300" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chosenClass" @start="onStart" @end="onEnd">
							<transition-group>
									<div class="item" v-for="item in arr1" :key="item.id">{{item.name}}</div>
							</transition-group>
					</draggable>
			</div>
			<div class="col">
					<div class="title">B列</div>
					<draggable v-model="arr2" group="site" animation="100" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chosenClass" @start="onStart" @end="onEnd">
							<transition-group>
									<div class="item" v-for="item in arr2" :key="item.id">{{item.name}}</div>
							</transition-group>
					</draggable>
			</div>
			<div class="col">
					<div class="title">C列</div>
					<draggable v-model="arr3" group="c" animation="100" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chosenClass" @start="onStart" @end="onEnd">
							<transition-group>
									<div class="item" v-for="item in arr3" :key="item.id">{{item.name}}</div>
							</transition-group>
					</draggable>
			</div>
		</div> -->
    <div class="row head-row">
      <div class="item">故事({{ menus.length }})</div>
			<template v-for="(type, tt) in taskType">
      	<div class="item status" :key="tt">{{type.label}} ({{ type.number }})</div>
			</template>
    </div>
    <div class="menu-body">
      <div class="row menu—row" v-for="(menu, index) in menus" :key="index">
        <div class="item item-menu">
        	<span>
						{{menu.sortLevel}}&nbsp;
						<!-- <el-dropdown @command="handleCommand" v-if=" isTaskCenter!='1'   && isMy!='1'">
							<span class="el-dropdown-link">
								<el-button size="mini" circle><i class="el-icon-plus"></i></el-button>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item :command="{type:'showMenu',data:menu}">+由故事创建子任务(推荐)</el-dropdown-item>
								<el-dropdown-item :command="{type:'showSubAdd',data:menu}">+子任务</el-dropdown-item>
								<el-dropdown-item :command="{type:'showTaskTemplate',data:menu}">+从模板批量导入子任务</el-dropdown-item>
								<el-dropdown-item :command="{type:'handleDel',data:menu}" icon="el-icon-delete">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown> -->
						<el-tag v-if="menu.level<='2'" type="info">轻微</el-tag>
						<el-tag v-else-if="menu.level=='3'" type="warning">一般</el-tag>
						<el-tag v-else-if="menu.level=='4'" type="danger">紧急</el-tag>
						<el-tag v-else type="danger">特急</el-tag> 
						<span v-for="(item ,index) in [formatExeUsernames(menu)]" :key="index">

							<el-tooltip :content="item.exeUsernames" ><el-link     :type="item.type"     @click.stop="showExecusers(menu)">{{item.showMsg}}</el-link></el-tooltip>
								
						</span>
						<el-tooltip content="进度"><el-link style="border-radius:30px;" :type="menu.rate>=100?'success':'warning'" @click="drawerVisible=true"> {{ (menu.rate!=null?menu.rate:0)+'%'}} </el-link></el-tooltip>
						<el-tooltip content="预算金额、工时"><el-tag type="info">{{parseFloat(menu.budgetCost/10000).toFixed(2)}}万,{{menu.budgetWorkload}}人时</el-tag></el-tooltip>
						<el-link  type="primary"  @click.stop="showDrawer(menu)">{{menu.name}}</el-link>
					</span>
        </div>
        <div class="item status" v-for="(type, tt) in taskType" :key="tt">
          <draggable
						v-model="tasks[menu.menuId][tt]"
            :name="menu.menuId"
						@start="onStart" @end="onEnd" :move="onMove"
						:options="{group: menu.menuId}"
						class="draggable"
						animation="300"
						scroll
          >
            <transition-group class="transition-group" :data-menu-id="menu.menuId" :data-task-state="type.status">
              <template
                v-if="tasks && tasks[menu.menuId][tt].length"
              >
                <div
									:data-menu-id="menu.menuId"
									:data-task-id="task.id"
									:data-task-state="task.taskState"
                  class="task"
                  v-for="(task, t) in tasks[menu.menuId][tt]"
                  :key="t"
                >
									<span>
										{{task.sortLevel}}&nbsp;
										<!-- <el-dropdown @command="handleCommand" v-if=" isTaskCenter!='1'   && isMy!='1'">
											<span class="el-dropdown-link">
												<el-button size="mini" circle><i class="el-icon-plus"></i></el-button>
											</span>
											<el-dropdown-menu slot="dropdown">
												<el-dropdown-item :command="{type:'showMenu',data:task}">+由故事创建子任务(推荐)</el-dropdown-item>
												<el-dropdown-item :command="{type:'showSubAdd',data:task}">+子任务</el-dropdown-item>
												<el-dropdown-item :command="{type:'showTaskTemplate',data:task}">+从模板批量导入子任务</el-dropdown-item>
												<el-dropdown-item :command="{type:'handleDel',data:task}" icon="el-icon-delete">删除</el-dropdown-item>
											</el-dropdown-menu>
										</el-dropdown> -->
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
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import draggable from "vuedraggable";
import { editXmTask } from '@/api/xm/core/xmTask';

export default {
  name: "XmTaskAgileKanban",
  props: ["xmTasks"],
  data() {
    return {
      taskType: [
        { label: "待领取", status: 0, number: 0 },
        { label: "已领取执行中", status: 1, number: 0 },
        { label: "已完工", status: 2, number: 0 },
        { label: "已结算", status: 3, number: 0 },
      ],
      tasks: {},
			drag: false,
			arr1: [
					{ id: 1, name: 'www.itxst.com' },
					{ id: 2, name: 'www.jd.com' },
					{ id: 3, name: 'www.baidu.com' },
					{ id: 4, name: 'www.taobao.com' }
			],
			arr2: [
					{ id: 1, name: 'www.google.com' },
					{ id: 2, name: 'www.msn.com' },
					{ id: 3, name: 'www.ebay.com' },
					{ id: 4, name: 'www.yahoo.com' }
			],
			arr3: [
					{ id: 1, name: 'item 1' },
					{ id: 2, name: 'item 2' },
					{ id: 3, name: 'item 3' },
					{ id: 4, name: 'item 4' }
			]
    };
  },
  components: { draggable },
  watch: {
		tasks: {
			handler(val, oldVal) {
				console.log('tasks--val==', val);
				console.log('tasks--oldVal==', oldVal);
			},
			deep: true,
			immediate: true
		}
	},
  computed: {
    menus() {
      let xmTasks = JSON.parse(JSON.stringify(this.xmTasks || []));
			console.log('--xmTasks==', xmTasks);

      let menus = [], menuIds = {}, tasks = {};
			this.taskType.map(d => {
				d.number = 0;
				return d;
			})
      xmTasks.forEach((d, i) => {
        if (!menus.length || !menuIds[d.menuId]) {
          menus.push(d);
          menuIds[d.menuId] = true;
        } else {
					console.log('i==', i);
				}
        if (!tasks[d.menuId]) {
					tasks[d.menuId] = [[], [], [], []];
        }
        tasks[d.menuId][parseInt(d.taskState)].push(d);
				this.taskType[parseInt(d.taskState)].number += 1;
			});
      this.tasks = tasks;
			console.log('this.tasks==', this.tasks);
      return menus;
    },
  },
  methods: {
    onStart(e) {
			console.log('onStart--e==', e);
			this.drag = true;
		},
		onEnd(e) {
			console.log('onEnd--e==', e);
      this.drag = false;
			// targetEl：拖拽的任务数据; toEl拖拽后的位置.
			let targetEl = { ...e.item.dataset };
			let toEl = { ...e.to.dataset };
			console.log('onEnd--targetEl==', targetEl, toEl);
			if (targetEl.menuId === toEl.menuId && targetEl.taskState !== toEl.taskState) {
				let task = this.xmTasks.find(d => d.id === targetEl.taskId);
				console.log('onEnd--task==', task);
				const params = { ...task, taskState: toEl.taskState };
				editXmTask(params).then(res => {
					console.log('onEnd--editXmTask--res==', res);
					this.$emit('submit');
				})
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
};
</script>
<style lang='scss' scoped>
.menu-box {
  width: 100%;
  overflow: scroll;
}
.row {
  width: 2000px;
  display: flex;
  flex-direction: row;
  overflow: scroll !important;
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
      // padding: 10px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border-radius: 3px;
      // box-shadow: 0 2px 12px 0 rgb(48 48 48 / 5%), 0 2px 4px 0 rgb(48 48 48 / 10%);

      background-color: #fff;
    }
  }
}

.draggable {
	min-height: 100px;
	width: 100%;
}
.transition-group {
	display: flex;
	flex-wrap: wrap;
	min-height: 100px;
	width: 100%;
}
</style>
