<template>
	<section class="page-container padding border">
		<el-row> 
			<el-row    v-if="projectPhase">   
 					<el-button type="warning"   @click="saveBatchEdit" v-loading="load.edit" icon="el-icon-finished">保存</el-button>
					<el-button type="success"  @click="handlePopover(null,'add')" icon="el-icon-plus" ></el-button>
					<el-button type="primary"   @click="searchXmTasks" v-loading="load.list" icon="el-icon-search"></el-button>  
					<el-button     @click="noBatchEdit" v-loading="load.edit" icon="el-icon-back">返回</el-button>  
					<el-button type="danger"   @click="batchDel" v-loading="load.edit" icon="el-icon-delete"></el-button>    
					<span class="hidden-lg-and-down" style="margin-left:10px;font-size:14px;">计划总预算：</span><el-tag class="hidden-lg-and-down" type='success'> {{((projectPhase.phaseBudgetNouserAt+projectPhase.phaseBudgetInnerUserAt+projectPhase.phaseBudgetOutUserAt)/10000).toFixed(2)}}万，剩{{(taskBudgetData.surplusPhaseBudgetCostAt/10000).toFixed(2)}}万</el-tag> 
					<span class="hidden-lg-and-down" style="margin-left:10px;font-size:14px;">非人力总预算：</span><el-tag class="hidden-lg-and-down" :type="taskBudgetData.surplusPhaseBudgetNouserAt>0?'warning':'danger'">{{(projectPhase.phaseBudgetNouserAt/10000).toFixed(2)}}万，剩{{(taskBudgetData.surplusPhaseBudgetNouserAt/10000).toFixed(2)}}万</el-tag>  
					<span style="margin-left:10px;font-size:14px;">内部人力总预算：</span><el-tag :type="taskBudgetData.surplusPhaseBudgetInnerUserAt>0?'warning':'danger'">{{(projectPhase.phaseBudgetInnerUserAt/10000).toFixed(2)}}万，剩{{(taskBudgetData.surplusPhaseBudgetInnerUserAt/10000).toFixed(2)}}万</el-tag>  
					<span style="margin-left:10px;font-size:14px;">外购人力总预算：</span><el-tag :type="taskBudgetData.surplusPhaseBudgetOutUserAt>0?'warning':'danger'">{{(projectPhase.phaseBudgetOutUserAt/10000).toFixed(2)}}万，剩{{(taskBudgetData.surplusPhaseBudgetOutUserAt/10000).toFixed(2)}}万</el-tag>   
	
			</el-row> 
			<el-row style="padding-top:12px;" >  
						<!-- show-summary -->
					<el-table
						size="small"
						ref="table"
						:height="tableHeight"
          				show-summary
            			class="drag-table2"
						:data="tasksTreeData"
						@sort-change="sortChange"
						v-loading="load.list"
						@row-click="rowClick"
						@selection-change="selsChange" 
						highlight-current-row
						stripe
						fit
						border
						default-expand-all
						:tree-props="{children: 'children', hasChildren: 'childrenCnt'}"
						row-key="id"
						>
						<el-table-column  type="selection" width="60"></el-table-column> 
  						<el-table-column  prop="sortLevel"  label="序号" width="300">
 							<template slot-scope="scope">
									<el-popover
										placement="top"
										width="400"
										trigger="click">
										<div style="text-align: center; margin: 0">
                      						<div :ref="'task_'+scope.$index" :data-task-id="scope.row.id"></div>
										  <el-button type="primary"    @click="handlePopover(scope.row,'highestPmenuId')">成为顶级节点</el-button> 
											<el-button type="danger"    @click="handlePopover(scope.row,'delete')">删除当前行</el-button> 
											<el-button type="success"    @click="handlePopover(scope.row,'addSub')">增加子行</el-button> 
										</div>
										<el-button slot="reference" :type="scope.row.opType?'success':'plain'"   icon="el-icon-edit"></el-button> 
									</el-popover>
									<el-input   style="width:100px;"   v-model="scope.row.sortLevel"  @change="fieldChange(scope.row,'sortLevel')"></el-input>	
							</template>
						</el-table-column>
						<!-- <el-table-column sortable width="40" type="selection"></el-table-column> -->
						<el-table-column prop="name" label="任务名称"  min-width="150"> 
							<template slot-scope="scope">
								<el-input   v-model="scope.row.name"  @change="fieldChange(scope.row,'name')"></el-input>  								
							</template>
						</el-table-column> 
						<el-table-column   prop="startTime" label="任务起止时间" width="300">
							<template slot-scope="scope">
								<el-row>
									<el-col :span="12">
									<el-date-picker 
										v-model="scope.row.startTime"
										size="small"
										style="width:99%;"
										align="left"
										type="date"
										value-format="yyyy-MM-dd HH:mm:ss"
										format="yyyy-MM-dd"
										placeholder="选择日期"
										:picker-options="pickerOptions" @change="fieldChange(scope.row,'startTime')">
									</el-date-picker>  
									</el-col>
									<el-col :span="12">
									<el-date-picker 
										v-model="scope.row.endTime"
										size="small"
										style="width:99%;"
										align="right"
										type="date"
										value-format="yyyy-MM-dd HH:mm:ss"
										format="yyyy-MM-dd"
										placeholder="选择日期"
										:picker-options="pickerOptions" @change="fieldChange(scope.row,'endTime')">
									</el-date-picker> 
									</el-col> 
								</el-row> 

							</template>
						</el-table-column> 
						<el-table-column label="预计工作量" prop="budgetWorkload" width="140" >
							<template slot-scope="scope">
								<el-input   v-model="scope.row.budgetWorkload" type="number" ::precision="2"  @change="fieldChange(scope.row,'budgetWorkload')"></el-input>
 							</template>
						</el-table-column>
						<el-table-column label="预算金额.元" prop="budgetCost" width="140" >
							<template slot-scope="scope">
								<el-input   v-model="scope.row.budgetCost" type="number" ::precision="2"  @change="fieldChange(scope.row,'budgetCost')"></el-input>
 							</template>
						</el-table-column> 
						<el-table-column prop="rate" label="进度" width="100">
							<template slot-scope="scope">
								<el-input   type="number" :precision="0" v-model="scope.row.rate" min="0" max="100" @change="fieldChange(scope.row,'rate')"></el-input>
 
							</template>
						</el-table-column>
						<el-table-column label="外购" prop="taskOut" width="80">
							<template slot-scope="scope">
								<el-checkbox    v-model="scope.row.taskOut" false-label="0" true-label="1"  @change="fieldChange(scope.row,'taskOut')"></el-checkbox> 
							</template>
						</el-table-column>   
						<el-table-column label="结算方案" prop="settleSchemel" width="160">
							<template slot-scope="scope"> 
								<el-select v-model=" scope.row.settleSchemel" @change="fieldChange(scope.row,'settleSchemel')">
									<el-option v-for="i in options.xmTaskSettleSchemel" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
								</el-select>
							</template>
						</el-table-column>  
						<el-table-column prop="description" label="任务描述" min-width="150"> 
							<template slot-scope="scope">
								<el-input   type="textarea"   v-model="scope.row.description"  @change="fieldChange(scope.row,'description')"></el-input>
 
							</template>
						</el-table-column> 
					</el-table> 
					<el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
					 
			</el-row>
		</el-row> 
	</section>
</template>

<script>
	import Vue from 'vue'
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { getTask ,listXmTask,editXmTask,editRate, delXmTask, batchDelXmTask,batchImportTaskFromTemplate,batchSaveBudget } from '@/api/xm/core/xmTask'; 
 
	import { mapGetters } from 'vuex';   
 	import {sn} from '@/common/js/sequence' 
  
 	export default { 
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),
			currentProject(){
				 return this.selProject
			},
			currentProjectPhase(){
				 return this.selProjectPhase
			}, 
			progress_disable() {
				if((this.isEmpty(this.editForm.preTaskid) || this.editForm.prerate == "100") && this.isEmpty(this.editForm.children)) {
					return false;
				}
				else {
					return true;
				}
			}, 
			tasksTreeData() {
				let xmTasks = JSON.parse(JSON.stringify(this.xmTasks || [])); 
				const tasksTreeData = treeTool.translateDataToTree(xmTasks); 
				//this.rowDrop(); 
				 return tasksTreeData;
			},
			
			taskBudgetData(){ 
				var rows=this.xmTasks
				var surplusPhaseBudgetCostAt = this.getFloatValue(this.projectPhase.phaseBudgetInnerUserAt)+ this.getFloatValue(this.projectPhase.phaseBudgetOutUserAt)+ this.getFloatValue(this.projectPhase.phaseBudgetNouserAt)
				var surplusPhaseBudgetInnerUserAt=this.getFloatValue(this.projectPhase.phaseBudgetInnerUserAt)
				var surplusPhaseBudgetOutUserAt=this.getFloatValue(this.projectPhase.phaseBudgetOutUserAt)
				var surplusPhaseBudgetNouserAt=this.getFloatValue(this.projectPhase.phaseBudgetNouserAt) 
				var surplusPhaseBudgetUserAt=this.getFloatValue(this.projectPhase.phaseBudgetInnerUserAt)+this.getFloatValue(this.projectPhase.phaseBudgetOutUserAt)

				var total={
					surplusPhaseBudgetCostAt: surplusPhaseBudgetCostAt, 
					surplusPhaseBudgetInnerUserAt: surplusPhaseBudgetInnerUserAt,
					surplusPhaseBudgetOutUserAt: surplusPhaseBudgetOutUserAt,
					surplusPhaseBudgetNouserAt: surplusPhaseBudgetNouserAt,
					surplusPhaseBudgetUserAt: surplusPhaseBudgetUserAt,

					taskBudgetNouserAt:0,
					taskBudgetInnerUserAt:0,
					taskBudgetOutUserAt:0,
					taskBudgetUserAt: 0,


				}; 
				//phaseBudgetHours:'',phaseBudgetStaffNu:'',ctime:'',phaseBudgetNouserAt:'',phaseBudgetInnerUserAt:'',phaseBudgetOutUserAt
				rows.forEach((row2)=>{
					var row=row2;
					if(this.valueChangeRows.length!=0){
						var changeRows=this.valueChangeRows.filter(i=>i.id==row2.id);
						if(changeRows && changeRows.length>0){
							row=changeRows[0]
						}
					}

					var budgetCost=this.getFloatValue(row.budgetCost);
					if(row.taskOut=='1'){
						row.taskBudgetOutUserAt=budgetCost
						row.taskBudgetInnerUserAt=0
						row.taskBudgetNouserAt=0;
					}else{
						row.taskBudgetOutUserAt=0
						row.taskBudgetInnerUserAt=budgetCost
						row.taskBudgetNouserAt=0;
					}  
					total.taskBudgetNouserAt=total.taskBudgetNouserAt+row.taskBudgetNouserAt
					total.taskBudgetInnerUserAt=total.taskBudgetInnerUserAt+ row.taskBudgetInnerUserAt
					total.taskBudgetOutUserAt=total.taskBudgetOutUserAt+ row.taskBudgetOutUserAt
				})
				total.taskBudgetUserAt=total.taskBudgetInnerUserAt+total.taskBudgetOutUserAt  
				total.surplusPhaseBudgetCostAt=total.surplusPhaseBudgetCostAt-total.taskBudgetNouserAt-total.taskBudgetUserAt 
				total.surplusPhaseBudgetInnerUserAt=total.surplusPhaseBudgetInnerUserAt-total.taskBudgetInnerUserAt
				total.surplusPhaseBudgetOutUserAt=total.surplusPhaseBudgetOutUserAt-total.taskBudgetOutUserAt
				total.surplusPhaseBudgetNouserAt=total.surplusPhaseBudgetNouserAt-total.taskBudgetNouserAt 
				total.surplusPhaseBudgetUserAt=total.surplusPhaseBudgetUserAt-total.taskBudgetUserAt
				return total;

			}
		},
		props: ["selProject","selProjectPhase","visible"],
		watch: { 
			"selProject": function(oval,val) { 
				this.filters.selProject=this.selProject;
				 //this.changeSelKey("all");
			}, 
			'selProjectPhase':function(selProjectPhase){
				this.projectPhase=this.selProjectPhase
				 //this.projectPhaseRowClick(selProjectPhase)
			},
			visible:function(visible){
				if(visible==true){ 
					
					this.searchXmTasks();
				}
			}
		},
		data() {
			return {
				filters: {
					key: '',
					isMyTask: '0',//0不区分我的，1 时我的任务
					selProject:null,
				},
				xmTasks: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{
					urgencyLevel:[],
					taskType:[],
					planType:[],
					priority:[],
					xmTaskSettleSchemel:[],
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
				searchTask: '',
				/**begin 自定义属性请在下面加 请加备注**/
				taskStateList: ["待领取","已领取执行中","已完工","已结算"],   

				selkey: "all",
				drawerVisible: false, 
				progress_show: true,
				isChild: false,
				oldrate: "",
				drawerkey: '',

				execUserVisible: false,
				currTaskId: '',
				currTaskName: '',

				skillVisible: false,
				skillIds: [],
				taskSkills:[],
				projectPhase: null,
				taskTemplateVisible:false,
				parentTask:null,
				projectInfoVisible:false,
				batchEditVisible:false,
				valueChangeRows:[],//批量修改时，存储修改过的行
				selectProjectVisible:false,
				menuVisible:false,
				menuDetailVisible:false,
				pickerOptions:  util.pickerOptions(),
				gstcVisible:false,
				tableHeight:300,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			   
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
				if(obj.order==null){
					this.pageInfo.orderFields=['create_time'];
					this.pageInfo.orderDirs=['desc'];
 				}else{
					var dir='asc';
					if(obj.order=='ascending'){
						dir='asc'
					}else{
						dir='desc';
					}
					 
					this.pageInfo.orderFields=[util.toLine(obj.prop)]; 
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
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}   
				 
				this.load.list = true;
				if(this.filters.selProject){
					params.projectId = this.filters.selProject.id;
				} 
				params.workexec="true";
				if(this.projectPhase){{
					params.projectPhaseId=this.projectPhase.id
				}}
				params.isTop="1"
				params.withParents="1"
				getTask(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						var xmTasks=res.data.data;
						this.xmTasks=xmTasks;  
						if(this.editForm!=null){
							var index=this.xmTasks.findIndex(i=>i.id==this.editForm.id);
							if(index>=0){
								this.editForm=this.xmTasks[index]
							}
						}
						
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
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
 
			showTaskTemplate:function(){
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin')){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return;
				}
				if(this.currentProjectPhase==null){
					this.$message({showClose: true, message: "请先选择项目计划", type: 'error' }); 
					return false;
				}
				this.taskTemplateVisible=true;
			},
			showSubAdd(row) { 
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin')){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return;
				}
				this.parentTask=row; 
				this.editForm=row;
				this.showAdd();
			},
			//显示新增界面 XmTask xm_task
			showAdd: function () {
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin')){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return;
				}
				if(!this.currentProjectPhase){
					this.$message({showClose: true, message: "请先选择项目计划", type: 'error' }); 
					return;
				}
				this.addFormVisible = true;
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmTasks();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getXmTasks();
			},
			//选择行xmTask
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmTask
			handleDel: function (row,index) { 
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin')){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return;
				}
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = Object.assign({},row);
					delXmTask(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmTasks();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmTask
			batchDel: function () {
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin')){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return;
				}
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmTask(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmTasks(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row){
				this.editForm=row;
				// this.$emit('row-click',row,);//  @row-click="rowClick"
			},
			 
			 
			isEmpty(str) {
				return str == null || "" == str;
			},
   
			onSelectedMenus(menus){
				if(menus==null || menus.length==0){
					this.menuVisible=false;
					return;
				}
				var menus2=JSON.parse(JSON.stringify(menus))
				menus2.forEach(i=>{
					i.id=i.menuId
					i.parentTaskid=i.pmenuId
					i.name=i.menuName 
				})
				this.onTaskTemplatesSelected(menus2);
				this.menuVisible=false;
				 
			},
			onTaskTemplatesSelected(taskTemplates) {
				   
				 ///////////////////
				if(taskTemplates==null || taskTemplates.length==0){
					this.taskTemplateVisible=false;
					this.parentTask=null
					return;
				}
				var taskTemplates2=JSON.parse(JSON.stringify(taskTemplates))
				this.load.add=true
				let parents = taskTemplates2.filter(value =>{
					//如果我的上级为空，则我是最上级
					if(value.parentTaskid == 'undefined' || value.parentTaskid == null  || value.parentTaskid == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(taskTemplates2.some(i=>value.parentTaskid==i.id)){
						return false;
					}else {
						return true
					}
				 
				})
				if(this.parentTask!=null &&  this.parentTask!=undefined){
					parents.forEach(i=>i.parentTaskid=this.parentTask.id);
				}else{
					parents.forEach(i=>i.parentTaskid=null);
				}
				let children = taskTemplates2.filter(value =>{
					if(taskTemplates2.some(i=>value.parentTaskid==i.id)){
						return true;
					}else{
						return false;
					} 
				}) 
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						var newId=sn();
						var myChildren=[];
						if(children!=null && children.length>0){
							myChildren=children.filter(current=>current.parentTaskid===parent.id);
						}  
						myChildren.forEach((current, index) => {
							 current.parentTaskid=newId;
							 var mySubChildren=children.filter(c=>c.parentTaskid===current.id);
							 translator([current],mySubChildren)
						})
						parent.id=newId;
					})
				}

				translator(parents, children)
				taskTemplates2.forEach(i=>{
					i.branchId=this.selProject.branchId
					i.projectId=this.selProject.id
					i.projectName=this.selProject.name
					if(this.projectPhase==null){

						i.projectPhaseId=this.parentTask.projectPhaseId
						i.projectPhaseName=this.parentTask.projectPhaseName 
						i.sortLevel=i.sortLevel?i.sortLevel:this.parentTask.sortLevel
						i.taskType=i.taskType?i.taskType:this.parentTask.taskType
						i.taskClass=i.taskClass?i.taskClass:this.parentTask.taskClass

						
					}else{
						i.projectPhaseId=this.projectPhase.id
						i.projectPhaseName=this.projectPhase.phaseName 
						i.sortLevel=i.sortLevel?i.sortLevel:this.projectPhase.seqNo
						i.taskType=i.taskType?i.taskType:this.projectPhase.taskType
					} 
					i.budgetCost=0
					i.budgetWorkload=80;
					i.level=i.level?i.level:'3'
					i.planType=i.planType?i.planType:"w2"
					i.actCost=0
					i.actWorkload=0
					i.taskState='0'
					i.rate=0
					i.taskOut=i.taskOut?i.taskOut:"0"
					i.taskClass=i.taskClass?i.taskClass:"1"
					i.toTaskCenter=i.toTaskCenter?i.toTaskCenter:"1"
					i.settleSchemel=i.settleSchemel?i.settleSchemel:"quotePrice"
					i.createUserid=this.userInfo.userid
					i.createUsername=this.userInfo.username 
					const createTime = new Date();
					var startTime=new Date();
					const endTime=new Date();
					endTime.setTime(startTime.getTime() + 3600 * 1000 * 24 * 7 *2);//两周后
					i.createTime=util.formatDate.format(createTime,'yyyy-MM-dd HH:mm:ss')
					i.startTime=util.formatDate.format(startTime,'yyyy-MM-dd HH:mm:ss')
					i.endTime=util.formatDate.format(endTime,'yyyy-MM-dd HH:mm:ss')

				});
				 //////////////////
				 batchImportTaskFromTemplate(taskTemplates2).then(res=>{
					 var tips=res.data.tips;
					 if(tips.isOk){
						 this.getXmTasks();

					 }
					 this.taskTemplateVisible=false;
					 this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
				 }).catch(e=>{this.taskTemplateVisible=false;});
			},
			onTaskSkillsSelected(skills) {
				skills.forEach(i=>{
					i.taskId=this.editForm.id
					i.taskName=this.editForm.name 
					i.taskSkillId=i.skillId
					i.taskSkillName=i.skillName
					i.skillRemarks=i.skillRemarks
				})
				batchAddSkill(skills).then((res) => {
					this.load.add=false
					var tips=res.data.tips;
					if(tips.isOk){
						this.skillVisible = false;
						this.getXmTasks();
					}
					this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch( err  => this.load.add=false);
			},

			handleSelect(key, keyPath) {
				this.drawerkey = key;
			},
			translateDataToTree(data2) { 
				var data=JSON.parse(JSON.stringify(data2));

				let parents = data.filter(value =>{
					value.startDate=value.startTime?value.startTime.substr(0,10):null
					value.endDate=value.endTime?value.endTime.substr(0,10):null
					value.realStartDate=value.actStartTime?value.actStartTime.substr(0,10):null
					value.realEndDate=value.actEndTime?value.actEndTime.substr(0,10):null
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
			projectPhaseRowClick:function(projectPhase){
				this.projectPhase=projectPhase
				this.getXmTasks();
			},
			clearSelectPhase:function(){
				this.projectPhase=null;
				this.getXmTasks();
			},
			getDateString(dateStr){
				if(dateStr==null || dateStr=="" || dateStr==undefined){
					return ""
				}else{
					return dateStr.substr(0,10);
				}
			},
			formateOption:function(itemCode,value){
				if(this.options[itemCode]){
					var options=this.options[itemCode].filter(i=>i.optionValue==value);
					if(options && options.length > 0){
						return options[0].optionName
					}else{
						return value;
					}
				}else{
					return value
				} 
			},
			
			formatterOption: function(row,column,cellValue, index){ 
				var columnName=column.property;
				var key="";
				if(columnName=='settleSchemel'){
					key="xmTaskSettleSchemel"
				}else{
					return cellValue
				}
				if(this.options[key]==undefined || this.options[key]==null || this.options[key].length==0   ){
					return cellValue;
				}
				var list=this.options[key].filter(i=>i.optionValue==cellValue)
				if(list.length>0){
					return list[0].optionName
				}else{
					return cellValue;
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
			decrease:function(){
				if(parseFloat(this.editForm.rate)-20 <0){
					this.editForm.rate=0;
				}else{
					this.editForm.rate=parseFloat(this.editForm.rate)-20
				}
				
			},
			increase:function(){
				if(parseFloat(this.editForm.rate)+20 >100){
					this.editForm.rate=100;
				}else{
					this.editForm.rate=parseFloat(this.editForm.rate)+20
				} 
			},
			
			focusOrUnfocus:function(row){
				if(this.selkey=="myFocus"){
					delXmMyFocus({projectId:row.projectId,focusType:'task',taskId:row.id,taskName:row.name,userid:this.userInfo.userid,username:this.userInfo.username}).then(res=>{
						var tips=res.data.tips;
						if(tips.isOk){
							this.getXmTasks(); 
						} 
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					})
				}else{
					addXmMyFocus({projectId:row.projectId,projectName:row.projectName,focusType:'task',taskId:row.id,taskName:row.name,userid:this.userInfo.userid,username:this.userInfo.username}).then(res=>{
						var tips=res.data.tips;
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					})
				}
			}, 
			saveBatchEdit:function(){
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin')){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return;
				}
				console.log(JSON.stringify(this.taskBudgetData))
				if(this.valueChangeRows.length==0){
					this.$message({showClose: true, message:"没有改变任何数据，无需保存", type: 'success'});
					return;
				}else {
					if(this.taskBudgetData.surplusPhaseBudgetInnerUserAt<0){
						this.$message({showClose: true, message:"内部人力预算不足，请调整", type: 'error'});
						return;
					}
					if(this.taskBudgetData.surplusPhaseBudgetOutUserAt<0){
						this.$message({showClose: true, message:"外购人力预算不足，请调整", type: 'error'});
						return;
					}
					if(this.taskBudgetData.surplusPhaseBudgetNouserAt<0){
						this.$message({showClose: true, message:"非人力预算不足请调整",type: 'error'});
						return;
					}
					
					this.load.edit=true;
					batchSaveBudget(this.valueChangeRows).then(res=>{ 
						this.load.edit=false;
						var tips =res.data.tips;
						if(tips.isOk){
							this.valueChangeRows=[]
							this.getXmTasks();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'}); 
						
					}).catch(e=>this.load.edit=false);
				}
				
			},
			noBatchEdit(){
				this.batchEditVisible=false;
				if(this.valueChangeRows.length>0){
					this.valueChangeRows=[];
					this.$emit("back",true)
				}else{
					this.$emit("back",false)
				}
				
			},
			fieldChange:function(row,fieldName, nextReplace){
			if(nextReplace) {
				row.nextReplace = nextReplace;
			} 
				if(fieldName=='startTime' || fieldName=='endTime'){
					if(row.startTime && row.endTime){
						
						var start=new Date(row.startTime);
						var end=new Date(row.endTime);
						var days=this.getDaysBetween(end,start)
						if(row.taskOut=='1' && this.projectPhase.phaseBudgetOutUserPrice && !row.budgetWorkload ){
							row.budgetWorkload=parseFloat((days*8).toFixed(2))
							row.budgetCost=row.budgetWorkload*this.projectPhase.phaseBudgetOutUserPrice 
						}else if( row.taskOut!='1' && this.projectPhase.phaseBudgetInnerUserPrice && !row.budgetWorkload){ 
							row.budgetWorkload=parseFloat((days*8).toFixed(2))
							row.budgetCost=row.budgetWorkload*this.projectPhase.phaseBudgetInnerUserPrice 
						}
					}
				}
				if(fieldName=='budgetWorkload' || fieldName=='taskOut'){
					if(row.taskOut=='1' && this.projectPhase.phaseBudgetOutUserPrice ){
						row.budgetCost=row.budgetWorkload*this.projectPhase.phaseBudgetOutUserPrice 
					}else if( row.taskOut!='1' && this.projectPhase.phaseBudgetInnerUserPrice){
						row.budgetCost=row.budgetWorkload*this.projectPhase.phaseBudgetInnerUserPrice  
					}
				}
				if(row.opType){
					var index=this.valueChangeRows.findIndex(i=>i.id==row.id);
					
					if(index>=0){
						this.valueChangeRows.splice(index,1);
						this.valueChangeRows.push(row)
					}else{
						this.valueChangeRows.push(row)
					}
				}else{

					var oneRow=this.valueChangeRows.find(i=>i.id==row.id);
					if( oneRow  ){
						if(oneRow.nextReplace){ 
							var index=this.valueChangeRows.findIndex(i=>i.id==row.id);
							this.valueChangeRows.splice(index,1);
							this.valueChangeRows.push(row)
						}else{
							return;
						}
					}else{
						this.valueChangeRows.push(row)
					}
				} 
			},
			getRowSum(row){
				var budgetCost=this.getFloatValue(row.budgetCost);
				if(row.taskOut=='1'){
					 row.taskBudgetOutUserAt=budgetCost
					 row.taskBudgetInnerUserAt=0
					 row.taskBudgetNouserAt=0;
				}else{
					 row.taskBudgetOutUserAt=0
					 row.taskBudgetInnerUserAt=budgetCost
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
			showProjectList:function(){
				this.selectProjectVisible=true;
			},
			onPorjectConfirm:function(project){
				this.filters.selProject=project
				this.selectProjectVisible=false;
				this.getXmTasks();
			},  
			handleCommand(command) { 
				if(command.type=='showSubAdd'){
					this.showSubAdd(command.data);
				}else if(command.type=='showTaskTemplate'){
					this.parentTask=command.data
					this.showTaskTemplate(command.data);
				}else if(command.type=='showMenu'){
					this.parentTask=command.data
					this.showMenu(command.data);
				}else if(command.type=='showDrawer'){
					this.showDrawer(command.data);
				}else if(command.type=='showEdit'){
					this.showEdit(command.data);
				}else if(command.type=='showExecusers'){
					this.showExecusers(command.data);
				}else if(command.type=='showSkill'){
					this.showSkill(command.data);
				}else if(command.type=='focusOrUnfocus'){
					this.focusOrUnfocus(command.data);
				}else if(command.type=='handleDel'){
					this.handleDel(command.data);
				}
			},
			toMenu(task){
				this.editForm=task
				if(task.menuId){ 
					this.menuDetailVisible=true 
				}else{
					this.showEdit(task);
				}
			},
			handlePopover:function(row,opType){
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin')){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return; 
				}
				if('add'==opType){
					var subRow=JSON.parse(JSON.stringify(this.addForm));
					subRow.parentTaskid=null
					subRow.id=sn();
					subRow.sortLevel="1"
					subRow.opType=opType
					subRow.branchId=this.selProject.branchId
					subRow.projectId=this.selProject.id
					subRow.projectName=this.selProject.name
					if(this.projectPhase==null){

						subRow.projectPhaseId=this.parentTask.projectPhaseId
						subRow.projectPhaseName=this.parentTask.projectPhaseName 
						subRow.sortLevel=subRow.sortLevel?subRow.sortLevel:this.parentTask.sortLevel
						subRow.taskType=subRow.taskType?subRow.taskType:this.parentTask.taskType
						subRow.taskClass=subRow.taskClass?subRow.taskClass:this.parentTask.taskClass

						
					}else{
						subRow.projectPhaseId=this.projectPhase.id
						subRow.projectPhaseName=this.projectPhase.phaseName 
						subRow.sortLevel=subRow.sortLevel?subRow.sortLevel:this.projectPhase.seqNo
						subRow.taskType=subRow.taskType?subRow.taskType:this.projectPhase.taskType
					} 
					subRow.budgetCost=0
					subRow.budgetWorkload=80;
					subRow.level=subRow.level?subRow.level:'3'
					subRow.planType=subRow.planType?subRow.planType:"w2"
					subRow.actCost=0
					subRow.actWorkload=0
					subRow.taskState='0'
					subRow.rate=0
					subRow.taskOut=subRow.taskOut?subRow.taskOut:"0"
					subRow.taskClass=subRow.taskClass?subRow.taskClass:"1"
					subRow.toTaskCenter=subRow.toTaskCenter?subRow.toTaskCenter:"1"
					subRow.settleSchemel=subRow.settleSchemel?subRow.settleSchemel:"quotePrice"
					subRow.createUserid=this.userInfo.userid
					subRow.createUsername=this.userInfo.username 
					const createTime = new Date();
					var startTime=new Date();
					const endTime=new Date();
					endTime.setTime(startTime.getTime() + 3600 * 1000 * 24 * 7 *2);//两周后
					subRow.createTime=util.formatDate.format(createTime,'yyyy-MM-dd HH:mm:ss')
					subRow.startTime=util.formatDate.format(startTime,'yyyy-MM-dd HH:mm:ss')
					subRow.endTime=util.formatDate.format(endTime,'yyyy-MM-dd HH:mm:ss')

					this.fieldChange(subRow,'sortLevel');
					this.xmTasks.unshift(subRow);
				}else if('addSub'==opType){
					var subRow=JSON.parse(JSON.stringify(row));
					subRow.children=[];
					subRow.parentTaskid=row.id
					subRow.id=sn();
					subRow.sortLevel=row.sortLevel+".1"
					subRow.opType=opType
					this.fieldChange(subRow,'sortLevel');
					this.xmTasks.unshift(subRow);
				}else if('delete'==opType){
					if(row.opType && (row.opType=='addSub' || row.opType=='add')){
						if(row.children && row.children.length>0){
							this.$message.error("请先删除子元素");
							return;
						}else{ 

							var index=this.xmTasks.findIndex(i=>i.id==row.id)
							var indexValueChanges=this.valueChangeRows.findIndex(i=>i.id==row.id)
							this.valueChangeRows.splice(indexValueChanges,1);
							this.xmTasks.splice(index,1);
						}
					}else{
						this.$message.error("只能删除未保存的行");
						return;
					}
					 
				} else if ('highestPmenuId' === opType) {  
					if (row.id) {
						this.xmTasks.find(d => {
							
							if (d.id === row.id) { 
								d.parentTaskid = '';
								this.fieldChange(d,'seqNo'); 
							}
						});
					}
				} 
			},
			afterExecuserSubmit(){ 

				this.getXmTasks(); 
			},
			toJoin(){
				if(this.editForm.exeUserids && this.editForm.exeUserids.indexOf(this.userInfo.userid)>=0){
					this.$message.success("你已经加入该任务了");
					return;
				}
				this.execUserVisible=true;
				this.$nextTick(()=>{
					this.$refs.execuserMng.toJoin();

				})
			},
			clearProject(){
				this.filters.selProject=null;
				this.getXmTasks()
      }, 
      // 行拖拽
      rowDrop() {
        console.log('rowDrop===');
        
        const _this = this
        // 被拖动的元素的索引
        let dragged = null;
        // 被拖动的元素的索引
        let draggedIndex = -1;

        // 目标元素
        let target = document.querySelector('.drag-table2 .el-table__body-wrapper .el-table__body tbody');
          console.log('rowDrop--target==', target);
		if(target==null){
			return;
		}
        let rows = 0;//行数
        setTimeout(function () {
          rows = target.childElementCount
          console.log('rowDrop--rows==', rows);
          
          for (let i = 0; i < target.childElementCount; i++) {
            const child = target.children[i]
            child.draggable = true
            // child.style.cursor = 'copy'
            child.ondragstart = function(e){
              console.log('开始--ondragstart--e==', e);
              
              dragged = e.path[0]
              draggedIndex = e.path[0].rowIndex
              console.log('child'+i+'开始拖拽'+draggedIndex);
              _this.cellMouseIndex = -1
              dragged.style.cursor = 'grabbing'
            }
            child.ondragend = function(){
              console.log('child'+i+'拖拽结束');
            }
          }
        },0)

        // 被拖动的元素正在那个容器里
        let dragIndex = -1

        target.ondragenter = function(e){
          clearTimeout(loop)

          // 由于被拖动的元素 经过tbody中的每一元素都会触发该事件, 但是我们只需要它正在那一行上就行了
          if(e.path[0].nodeName === 'TD'){
            // throughRow 表示被拖动的元素正在哪一行上
            const throughRow = e.path.find(path => {
              if(path.className.split(' ').includes('el-table__row')){
                return path
              }
            })
            if(dragIndex !== throughRow.rowIndex){
              if(dragIndex > -1){
                // 清除上次进入的容器的状态
                const last = target.children[dragIndex];
                clearClass(last)
              }
              // console.log('拖动进入目标元素'+selectRow.rowIndex);
              // 不是自己或未文件夹时才改变状态
              if(draggedIndex !== throughRow.rowIndex ){
                // 改变本次进入的容器的状态
                dragged.style.cursor = 'copy'
                throughRow.style.height = 60+'px'
                throughRow.style.backgroundColor = '#e9fdcf'
              }
              dragIndex = throughRow.rowIndex
            }
          }
          leaveIndex = -1
        }
        target.ondragover = function(e){
          // console.log('目标元素中拖拽...');
          e.preventDefault();
          leaveIndex = -1
        }

        let loop = null
        let leaveIndex = -1 // 是否拖出了整个table, -1表示还在table内

        target.ondragleave = function(e){
          console.log('ondragleave--e==', e);

          clearTimeout(loop)

          if(e.path[0].nodeName){
            const throughRow = e.path.find(path => {
              if(path.className.split(' ').includes('el-table__row')){
                return path;
              }
            })
            if(throughRow && dragIndex !== throughRow.rowIndex){
              // console.log('拖动离开目标元素'+selectRow.rowIndex);
              // selectRow.style.height = 'unset'
              // selectRow.style.backgroundColor = '#fff'
              // dragIndex = selectRow.rowIndex
            }
            if(throughRow.rowIndex === 0 || throughRow.rowIndex === rows-1){
              // 离开第一行或最后一行
              leaveIndex = throughRow.rowIndex
              loop = setTimeout(function () {
                if(leaveIndex > -1){
                  console.log("离开了",leaveIndex)
                  const leave = target.children[leaveIndex];
                  clearClass(leave)
                  dragIndex = -1
                }
              },100)
            }``
          }
        }
        target.ondrop = function(){
          console.log('ondrop--放下了'+draggedIndex);
          // 清除上次进入的容器的状态
          const last = target.children[dragIndex];
          clearClass(last)
          dragged.style.cursor = 'default'

          console.log('ondrop--draggedIndex==', draggedIndex);
          console.log('ondrop--dragIndex==', dragIndex);
          
          const startId = _this.$refs['task_'+draggedIndex].dataset.taskId;
          const endId = _this.$refs['task_'+dragIndex].dataset.taskId;

          if (startId !== endId) {
            _this.changePmenuId(startId, endId)
          }
        }

        let clearClass = function (node) {
          if(node){
            node.style.height = 'unset'
            node.style.backgroundColor = '#fff'
          }
          dragged.style.cursor = 'grabbing'
        }
        // if(last && form.menuId !== to.menuId && to.isFolder){
        //   // 移动文件/文件夹
        //   _this.copyOrMoveApi('move', form.menuId, to.menuId)
        // }
      },
      // 判断前后两个数据是否存在同一回路里面
      // dict 为字典；sId拖拽到menuId; ePmeuId 是放置位置的祖先 menuId;
      judgePmenuId(dict, sId, ePmeuId) {
        if (sId === ePmeuId) {
          return true;
        } else if (dict[ePmeuId]) {
          return this.judgePmenuId(dict, sId, dict[ePmeuId]);
        } else {
          return false;
        }
      },
      changePmenuId(sId, eId) {
        let dict = {};
        this.xmTasks.forEach(d => {
          dict[d.id] = d.parentTaskid || '';
        });
        if (!dict[eId]) {
          this.xmTasks.find(d => {
            if (d.id === sId) {
              d.parentTaskid = eId;
              console.log('更新关系1');
              this.fieldChange(d,'pmenuId',true);
            }
          })
        } else {
          const isSynezesis = this.judgePmenuId(dict, sId, dict[eId]);
          if (!isSynezesis) {
            this.xmTasks.find(d => {
              if (d.id === sId) {
                d.parentTaskid = eId;
                console.log('更新关系2');
                this.fieldChange(d,'pmenuId',true);
              }
            })
          } else {
            console.log('形成闭合回路--拖拽不更新');
            
          }
        }
			}, 
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {   
		    //在下面添加其它组件
		},
		mounted() {
			
			if(this.selProject){
				this.filters.selProject=this.selProject
			}
			if(this.selProjectPhase){ 
				this.projectPhase=this.selProjectPhase
			}
			if(this.visible==true){
				this.getXmTasks();
			}
			this.$nextTick(()=>{ 
				var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=70/1000 * window.innerHeight;
				if(this.isTaskCenter){
					subHeight=50/1000 * window.innerHeight;
				}
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight; 
				listOption([{categoryId:'all',itemCode:'planType'}
				,{categoryId:'all',itemCode:'taskType'}
				,{categoryId:'all',itemCode:'urgencyLevel'}
				,{categoryId:'all',itemCode:'xmTaskSettleSchemel'}
				,{categoryId:'all',itemCode:'priority'}]).then(res=>{
					this.options=res.data.data;
				})		
      });
      // 阻止默认行为
      document.body.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
      };
      this.rowDrop();
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

.xm-task-add >>> .el-drawer__body{
	padding: 0 20px;
}
.xm-task >>> .el-drawer__close-btn{
	display: none !important;
}
.xm-task >>> .el-drawer__header{
	background-color: #fafbfc;
	border-bottom: 1px solid #efefef;
	padding: 8px 16px;
}
/* .xm-task .progress-form >>> .el-form-item__label{ */
	/* line-height: 1.15; */
/* } */
.xm-task >>> .el-drawer__body{
	overflow: auto;
	padding: 0 20px;
}
.xm-task .el-progress--without-text{
	display: flex;
	align-items: center;
}
.xm-task >>> .el-progress-bar__inner{
	transition: none !important;
}
.xm-task .progress-bar{
	padding: 10px 0;
}
.xm-task .progress-btn{
	line-height:0;
	position:absolute;
	top:7px;
}
.xm-task .progress-disable >>> .el-progress-bar__inner{
	background-color: #ccc !important;
}
 

small{
	font-size: 12px;
	/* float:right; */
	color: #6c757d!important;
	margin-left:20px;
}

.extra{
	border-bottom: 1px solid #dedede;
	padding: 8px;
}
.field-label{
	display: inline-block;
	width: 60px;
	font-size: 12px;
	font-weight: bold;
}
.task-header{
	border-top: 1px solid #dedede;
}
.title{
	font-size: 18px;
	font-weight: bold;
	line-height: 36px;
}
.compact{
	font-size:12px;
	color:#8c92a4;
}
.compact>span{
	color: #00b2f3;
}
.remarks{
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
</style>