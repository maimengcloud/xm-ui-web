<template>
	<section>
		<el-row class="xm-task">
			<el-menu  active-text-color="#00abfc" :default-active="filters.taskType" @select="changeTaskType" class="el-menu-demo" mode="horizontal">
				<el-menu-item index="all">全部任务类型</el-menu-item>
				<el-menu-item v-for="(i,index) in dicts.taskType" :index="i.id" :key="index">{{i.name}}</el-menu-item>
			</el-menu>
			<el-row>
				<el-col :span="24">
					<el-table
						show-summary
						:data="tasksTreeData"
						@sort-change="sortChange"
						v-loading="load.list"
						@row-click="rowClick"
						@selection-change="selsChange"
						highlight-current-row
						stripe
						fit
						default-expand-all
						:tree-props="{children: 'children' }"
						row-key="id"
						 height="100px" v-adaptive="{bottomOffset:50}"
						 ref="table"
						>
 						<el-table-column v-show="isMultiSelect" sortable width="60" type="selection"></el-table-column>
						<el-table-column prop="name" label="任务名称"  min-width="260"  show-overflow-tooltip>
							<template slot-scope="scope">
								<div    class="icon" :style="{backgroundColor:  scope.row.ntype==='1'?'#E6A23C':'#409EFF'}">
									<i :class="scope.row.ntype==='1'?'el-icon-time':'el-icon-s-operation'" ></i>
								</div>
								{{scope.row.sortLevel}}&nbsp;{{scope.row.name}}
							</template>
						</el-table-column>
						<el-table-column    prop="menuName" label="需求名"  min-width="160"  show-overflow-tooltip> </el-table-column>
						<el-table-column    prop="projectName" label="项目名称"  min-width="160"  show-overflow-tooltip>
						</el-table-column>

						<el-table-column label="预算" prop="budgetAt" width="120" >
							<template slot-scope="scope">
								<el-tag  type= 'info' >{{parseFloat(scope.row.budgetAt/10000).toFixed(2)}}万,{{scope.row.budgetWorkload}}人时</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="执行人" prop="exeUsernames" min-width="120" >
						</el-table-column>
						<el-table-column prop="rate" label="进度" width="100">
							<template slot-scope="scope">
								 <div>
								 <el-tag style="border-radius:30px;"> {{ (scope.row.rate!=null?scope.row.rate:0)+'%'}} </el-tag>
								</div>
							</template>
						</el-table-column>
						<el-table-column   prop="startTime" label="任务起止时间" width="300"  show-overflow-tooltip>
							<template slot-scope="scope">

									<div  style="display:flex;align-items:center;">
										<div>
											<div>{{getDateString(scope.row.startTime)}}~{{getDateString(scope.row.endTime)}}</div>
										</div>
										<div v-for="(item,index) in [calcTaskStateByTime(scope.row.startTime,scope.row.endTime,scope.row)]" :key="index ">
											<el-tag :type="item.type">{{item.desc}}</el-tag>
										</div>
									</div>

								</template>
						</el-table-column>
						<!--
						<el-table-column label="外购" prop="taskOut" width="80">
							<template slot-scope="scope">
								<el-checkbox  :disabled="true" v-model="scope.row.taskOut" :false-label="0" :true-label="1"  ></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column label="结算方案" prop="settleSchemel" width="120" :formatter="formatterOption">
						</el-table-column>
						-->
						<el-table-column label="任务技能需求" prop="taskSkillNames" min-width="120"  show-overflow-tooltip>
						</el-table-column>
						<el-table-column   v-if="isMultiSelect==false"  header-align="center" label="操作" fixed="right" width="100">
							<template slot-scope="scope">
								<el-button  :disabled="scope.row.ntype=='1'"  type="primary" @click.stop="selectedTask(scope.row)" >选择</el-button>
							</template>
						</el-table-column>
					</el-table>

				</el-col>
			</el-row>
			<el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

		</el-row>
	</section>
</template>

<script>
	import Vue from 'vue'
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { getTask ,listXmTask,editXmTask,editRate, delXmTask, batchDelXmTask,batchImportTaskFromTemplate,batchSaveBudget } from '@/api/xm/core/xmTask';
	import { mapGetters } from 'vuex';
 	export default {
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),

			tasksTreeData() {
				 return this.xmTasks;
			},

		},
		props: ["menuId",'isMultiSelect'],
		watch: {
			menuId:function(menuId){
				this.getXmTasks()
			}
		},
		data() {
			return {
				filters: {
					name: '',
					isMyTask: '0',//0不区分我的，1 时我的任务
				},
				xmTasks: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					taskType:[],
					planType:[],
					priority:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增xmTask界面是否显示
				//新增xmTask界面初始化数据
				addForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',
					rate:'',budgetAt:'',budgetWorkload:'',actAt:'',actWorkload:'',taskState:'',taskType:'',taskClass:'',toTaskCenter:'',actStartTime:'',actEndTime:'',
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmTask界面初始化数据
				editForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',
					rate:'',budgetAt:'',budgetWorkload:'',actAt:'',actWorkload:'',taskState:'',taskType:'',taskClass:'',toTaskCenter:'',actStartTime:'',actEndTime:'',
				},

				selkey: "all",
 				pickerOptions:  util.getPickerOptions(),
				tableHeight:300,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {

			changeSelKey(index){
				this.selkey = index;
				this.getXmTasks();
			},
			changeTaskType(index){
				this.filters.taskType = index;
				this.getXmTasks();
			},
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmTasks();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmTasks();
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
				this.getXmTasks();
			},
			searchXmTasks(){
				 this.pageInfo.count=true;
				 this.getXmTasks();
			},
			//获取列表 XmTask xm_task
			getXmTasks() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}

				if(this.filters.name){
					params.name=this.filters.name
				}
				if(this.filters.taskType!="all" && this.filters.taskType!="" && this.filters.taskType!=null){
					params.taskType=this.filters.taskType
				}
				this.load.list = true;
				if(this.isMy=='1'){
					params.userid=this.userInfo.userid
					params.isMy="1"
				}
				params.menuId=this.menuId

				params.ntype="0"
				//params.withParents="1"
				getTask(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						var xmTasks=res.data.data;
						this.xmTasks=xmTasks;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			calcTaskStateByTime(startTime,endTime,row){
				var obj={
					type:'',
					desc:''
				}
				if(startTime==null || startTime=="" || endTime==null || endTime ==""){
					obj={
						type:'info',
						desc:"未配置日期"
					}
					return obj;
				}
				var curDate=new Date();
				var start=new Date(startTime);
				var end=new Date(endTime);
				var rate=row.rate;
				var isOver=row.rate>=100;
				var days=this.getDaysBetween(curDate, start);
				if(days<=0){
					obj={
						type:'info',
						desc:this.toFixed(this.getDaysBetween(start,curDate))+"天后开始"
					}
					return obj;
				}else if( this.getDaysBetween(curDate, start) > 0 &&  this.getDaysBetween(curDate, end) <= 0 ){
					obj={
						type:'primary',
						desc:this.toFixed(this.getDaysBetween(end, curDate))+"天后结束"
					}
					return obj;
				}else if( this.getDaysBetween(curDate, end) > 0 ){
					if(!isOver){
						obj={
							type:'danger',
							desc:"逾期"+( this.toFixed(this.getDaysBetween(curDate, end)) )+"天"
						}
					}else{
						obj={
							type:'success',
							desc:"完工"+( this.toFixed(this.getDaysBetween(curDate, end)) )+"天"
						}
					}

					return obj;
				}
			},
			/**
			 * 计算两个日期之间的天数
			 * @param dateString1  开始日期 yyyy-MM-dd
			 * @param dateString2  结束日期 yyyy-MM-dd
			 */
			  getDaysBetween(startDate,endDate){
				if (startDate==endDate){
					return 0;
				}
				var days=(startDate - endDate )/(1*24*60*60*1000);
				return  days;
			},

			//选择行xmTask
			selsChange: function (sels) {
				this.sels = sels;
			},
			rowClick: function(row){
				this.editForm=row;
				// this.$emit('row-click',row,);//  @row-click="rowClick"
			},

			isEmpty(str) {
				return str == null || "" == str;
			},
			translateDataToTree(data2) {
				var data=JSON.parse(JSON.stringify(data2));

				let parents = data.filter(value =>{

					value.taskBudgetCostAt=this.getRowSum(value);
					//如果我的上级为空，则我是最上级
					if(value.parentTaskid == 'undefined' || value.parentTaskid == null  || value.parentTaskid == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.parentTaskid==i.id)){
						return false;
					}else {
						return true
					}

				})
				let children = data.filter(value =>{
					if(data.some(i=>value.parentTaskid==i.id)){
						return true;
					}else{
						return false;
					}
				})
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.parentTaskid === parent.id) {
								let temp = JSON.parse(JSON.stringify(children))
								temp.splice(index, 1)
								translator([current], temp)
								typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
							}
						}
						)
					}
					)
				}

				translator(parents, children)

				return parents
			},
			getDateString(dateStr){
				if(dateStr==null || dateStr=="" || dateStr==undefined){
					return ""
				}else{
					return dateStr.substr(0,10);
				}
			},
			toFixed(floatValue,xsd){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					if(xsd){
						return parseFloat(floatValue).toFixed(xsd);
					}else{
						return parseFloat(floatValue).toFixed(0);
					}

				}
			},

			getRowSum(row){
				var budgetAt=this.getFloatValue(row.budgetAt);
				if(row.taskOut=='1'){
					 row.taskBudgetOuserAt=budgetAt
					 row.taskBudgetIuserAt=0
					 row.taskBudgetNouserAt=0;
				}else{
					 row.taskBudgetOuserAt=0
					 row.taskBudgetIuserAt=budgetAt
					 row.taskBudgetNouserAt=0;
				}
				return budgetAt;
			},
			getFloatValue(value,digit){

				if(isNaN(value)){
					return 0;
				}
				if(value==null ||  value=='' || value==undefined ){
					return 0;
				}
				return parseFloat(value);
			},
			/**end 自定义函数请在上面加**/

		},//end methods
		components: {

		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(()=>{
				this.tableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);
				this.getXmTasks();
			});

		}
	}

</script>

<style scoped>
.xm-task{
	width: 100%;
}
.xm-task>.el-menu-demo{
	height: 50px;
	padding-left: 10px;
	background: #fafbfc;
}
.xm-task>.el-menu-demo>li{
	height: 100%;
	line-height: 50px;
	color: #303133;
}
.xm-task>.el-menu-demo>li:hover{
	background: transparent;
}
.xm-task>.el-menu-demo>.is-active{
	background: transparent;
}
</style>
