<template>
	<section> 
			<el-row> 
				<el-col :span="24">
					<el-row class="page-main padding-left">  
						<el-popover
							placement="bottom"
							width="400"
							trigger="click"> 
							<xm-project-select v-if="ptype!=='1' && (!selProject||!selProject.id)" :auto-select="true"  :xm-iteration="xmIteration" :xm-product="xmProduct"  @row-click="onProjectRowClick" @clear-select="onProjectClear"></xm-project-select>
								<el-link type="warning" slot="reference" v-if="ptype!=='1' && (!selProject||!selProject.id)"  icon="el-icon-search"><font style="font-size:14px;">{{filters.selProject?filters.selProject.name:'选择项目'}}</font></el-link> 
						</el-popover> 
						
						<el-select v-model="filters.taskType" placeholder="请选择任务类型" clearable @change="changeTaskType">
							<el-option class="showall" value="all"  label="全部类型">全部类型</el-option>
							<el-option  v-for="(i,index) in dicts.taskType" :value="i.id" :label="i.name" :key="index">{{i.name}}</el-option>
						</el-select>   
						<el-input v-model="filters.key" style="width:20%;" placeholder="任务、需求名称模糊查询">  
						</el-input>
						<el-button @click="searchXmTasks" icon="el-icon-search">查询</el-button> 
						<el-button v-if="isMultiSelect" @click="selectedTasks" type="primary">确认选择</el-button>
					</el-row>
					<el-row  class="page-main">
						<el-table
							ref="taskTable" 
							lazy
							:load="loadXmTaskLazy"
							:data="tasksTreeData"
							@sort-change="sortChange"
							v-loading="load.list"
							@row-click="rowClick"
							@selection-change="selsChange" 
							highlight-current-row
							stripe
							fit
							border
							:tree-props="{children: 'children', hasChildren: 'childrenCnt'}"
							row-key="id"
							 :height="tableHeight"
							>
							<el-table-column v-show="isMultiSelect"  sortable width="70" type="selection"></el-table-column>
							<el-table-column prop="name" label="任务名称"  min-width="260" show-overflow-tooltip>
								<template slot-scope="scope">
								<span>
									{{ scope.row.sortLevel }}&nbsp;
									<el-tag v-if="scope.row.level <= '2'" type="info"
									>轻微</el-tag
									>
									<el-tag v-else-if="scope.row.level == '3'" type="warning"
									>一般</el-tag
									>
									<el-tag v-else-if="scope.row.level == '4'" type="danger"
									>紧急</el-tag
									>
									<el-tag v-else type="danger">特急</el-tag> 
									{{ scope.row.name }}
									</span>
								</template>
							</el-table-column> 
							<el-table-column prop="menuName" min-width="150" label="需求"  show-overflow-tooltip></el-table-column>
							<el-table-column   prop="startTime" label="任务起止时间" min-width="260"  show-overflow-tooltip>
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
							
							<el-table-column   v-if="!isMultiSelect"  header-align="center" label="操作" fixed="right" width="100">
								<template slot-scope="scope">
									<el-button  :disabled="(checkScope=='plan' && scope.row.ntype!='1')||(checkScope=='task' && scope.row.ntype=='1')"  type="primary" @click.stop="selectedTask(scope.row)" >选择</el-button> 	
								</template>
							</el-table-column>
						</el-table>
						<el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
						
					</el-row>
				</el-col>
			</el-row>  
	</section>
</template>

<script>
	import Vue from 'vue'
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { getTask ,listXmTask,editXmTask,editRate, delXmTask, batchDelXmTask,batchImportTaskFromTemplate,batchSaveBudget } from '@/api/xm/core/xmTask'; 
	import { mapGetters } from 'vuex';  
	import XmProjectSelect from '../xmProject/XmProjectSelect';

	export default { 
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),  
			tasksTreeData() {
				
				var d=JSON.parse(JSON.stringify(this.xmTasks))
				 var data= treeTool.translateDataToTree(d,"parentTaskid","id");
				 return data;
			},
			  
		},
		props: ["selProject",'isMultiSelect','xmProduct','xmIteration','checkScope'/**task/planTask/plan */,'queryScope'/**task/planTask/plan */,"ptype"],
		watch: {
			"selkey": function(val) {
				// console.log("任务类型");
			},
			"selProject": function(oval,val) { 
				this.filters.selProject=this.selProject
				 this.changeSelKey("all"); 
			}, 
			"xmProduct":function(){ 
				 this.changeSelKey("all"); 
			}
		},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
			return {
				filters: {
					key: '',
					taskType:'all',
					isMyTask: '0',//0不区分我的，1 时我的任务
					selProject:null,
				},
				xmTasks: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:20,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					urgencyLevel:[],
					taskType:[],
					planType:[],
					priority:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmTask界面是否显示
				//新增xmTask界面初始化数据
				addForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',
					rate:'',budgetCost:'',budgetWorkload:'',actCost:'',actWorkload:'',taskState:'',taskType:'',taskClass:'',toTaskCenter:'',actStartTime:'',actEndTime:'', 
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmTask界面初始化数据
				editForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',
					rate:'',budgetCost:'',budgetWorkload:'',actCost:'',actWorkload:'',taskState:'',taskType:'',taskClass:'',toTaskCenter:'',actStartTime:'',actEndTime:'', 
				},  

				selkey: "all",   
 				projectPhase: null,  
				tableHeight:300,
				dateRanger: [ ],  
				pickerOptions:  util.pickerOptions('datarange'),
      			maps:new Map(),
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
			showProjectInfo(row){
				this.editForm=row
				this.projectInfoVisible=true;
			},
			changeShowInfo(){
				this.projectInfoVisible=false;
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
				
				
				params=this.getParams(params) 
				if(this.queryScope=='planTask'){
					params.isTop="1" 
					params.withParents="1"
				}else if(this.queryScope=='plan'){
					params.isTop="1" 
					params.withParents="1"
					params.ntype="1"
				}else if(this.queryScope=='task'){
					params.ntype="0"
				}else{
					params.isTop="1" 
					params.withParents="1"
				}
				if(this.ptype){ 
					params.ptype=this.ptype
				}
				if(params.ptype!=='1'){
					if(!params.projectId){
						this.$notify({showClose:true,message:'请选择一个项目',type:'warning'})
						return;
					}
				}else{
					if(!params.productId){
						this.$notify({showClose:true,message:'请选择一个产品',type:'warning'})
						return;
					}
				}
				getTask(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						var xmTasks=res.data.data;
						this.xmTasks=xmTasks;  
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
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
			loadXmTaskLazy(tree, treeNode, resolve) {    
			this.maps.set(tree.id, { tree, treeNode, resolve }) //储存数据
				var params={parentTaskid:tree.id}
				params=this.getParams(params);
				params.isTop=""
				this.load.list = true;
				var func=listXmTask 
				func(params).then(res=>{
				this.load.list = false
				var tips = res.data.tips;
				if(tips.isOk){
					var xmTasks=this.xmTasks.filter(i=>i.parentTaskid!=tree.id)
					xmTasks.push(...res.data.data)
					this.xmTasks=xmTasks;
					resolve(res.data.data) 
				}else{
					resolve([])
				}
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
			selectedTask:function(row){
				this.$emit("task-selected", row,);
			},

			selectedTasks:function(){
				this.$emit("tasks-selected", this.sels);
			}, 
			projectPhaseRowClick:function(projectPhase){
				this.projectPhase=projectPhase
				this.getXmTasks();
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
				var budgetCost=this.getFloatValue(row.budgetCost);
				if(row.taskOut=='1'){
					 row.taskBudgetOuserAt=budgetCost
					 row.taskBudgetIuserAt=0
					 row.taskBudgetNouserAt=0;
				}else{
					 row.taskBudgetOuserAt=0
					 row.taskBudgetIuserAt=budgetCost
					 row.taskBudgetNouserAt=0;
				} 
				return budgetCost;
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
			clearSelectTask(task){
				this.$refs.taskTable.toggleRowSelection(task)
			},
			onProjectRowClick:function(project){
				this.filters.selProject=project 
				this.getXmTasks();
			},  
			onProjectClear(){
				this.filters.selProject=null;
				this.xmTasks=[];
				this.searchXmTasks();
			}
		},//end methods
		components: {   
			 XmProjectSelect
		    //在下面添加其它组件
		},
		mounted() {
			this.filters.selProject=this.selProject
			debugger;
			this.$nextTick(()=>{  
				this.tableHeight = util.calcTableMaxHeight(this.$refs.taskTable.$el); 
				this.getXmTasks(); 
			});
				initSimpleDicts('all',['planType','taskType','urgencyLevel','priority']).then(res=>{
					this.dicts=res.data.data;
				})		
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