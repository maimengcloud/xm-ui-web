<template>
	<section>
		<el-row class="app-container" v-if="!batchEditVisible">
        		<el-checkbox v-model="gstcVisible"  >甘特图</el-checkbox>
				<el-tag type="primary" v-if="this.filters.selProject && !selProject " closable @close="clearProject"  @click="showProjectList">{{ this.filters.selProject.name }}</el-tag>
				<el-button   v-if="!this.filters.selProject" @click="showProjectList">选择项目</el-button>
				<el-button v-if=" !filters.menus || filters.menus.length==0" @click="showMenu"> 选择故事</el-button>
				<el-tag v-else   closable @close="clearFiltersMneu(filters.menus[0])">{{filters.menus[0].menuName.substr(0,5)}}等({{filters.menus.length}})个</el-tag>
				<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询">
					<template slot="append">
						<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmTestCaseExecs" icon="el-icon-search"></el-button>  
					</template>
				</el-input> 
				<el-button  type="primary" @click="showCase" icon="el-icon-plus">由用例创建计划</el-button>
				<el-button   @click="showBatchEdit" icon="el-icon-right">批量修改</el-button>  
				<!--<el-button   type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete" :disabled="this.sels.length===0 || load.del==true"></el-button> 
				-->
		</el-row>
		<el-row class="app-container" v-else> 
				<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询">
					<template slot="append">
						<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmTestCaseExecs" icon="el-icon-search"></el-button>  
					</template>
				</el-input>  
				<el-button  type="warning" @click="batchEditXmTestCaseExec"  icon="el-icon-finished">批量保存</el-button>  
				<el-button   @click="noBatchEdit" icon="el-icon-back">返回</el-button>  
		</el-row>
		<el-row class="app-container"> 
			<!--列表 XmTestCaseExec xm_test_case_exec-->
			<el-table ref="table"  :max-height="tableHeight" v-if="!gstcVisible" :data="xmTestCaseExecs" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="45"></el-table-column>
				<el-table-column sortable type="index" width="45"></el-table-column>
 				<el-table-column prop="projectName" label="项目名称" min-width="100" >
					<template slot="header" v-if="!selProject">
						项目<el-button @click="showProjectList"  icon="el-icon-search" circle size="mini"></el-button>
 					</template>
				</el-table-column> 
				<el-table-column prop="caseName" label="用例(点击详情)" min-width="100" show-overflow-tooltip>
					<template slot-scope="scope"> 
						{{scope.row.caseId}}&nbsp;<el-link type="primary" @click="showCaseDetail(scope.row)">{{scope.row.caseName}}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="menuName" label="故事" min-width="100" >
					<template slot="header" slot-scope="scope">
						故事<el-button @click="showMenu"  icon="el-icon-search" circle size="mini"></el-button>
 					</template>

				</el-table-column>
				
				<el-table-column prop="taskName" label="任务" min-width="100" >
					<template slot-scope="scope">  
						{{scope.row.taskName?scope.row.taskName:'未关联任务'}}
						<el-button  v-if=" batchEditVisible==true "   type="warning"   @click="showSelectTask(scope.row)">选任务</el-button>  
					</template>
				</el-table-column> 
				<el-table-column prop="execUsername" label="执行人姓名" min-width="100" >
					<template slot-scope="scope">  
						{{scope.row.execUsername?scope.row.execUsername:'未设置'}}
						<el-button  v-if=" batchEditVisible==true "   type="warning"   @click="showGroupUsers(scope.row)">选人</el-button>  
					</template>
				</el-table-column>
				<el-table-column prop="startTime" label="起止时间" min-width="100" show-overflow-tooltip>
					<template slot-scope="scope">
						<div v-if="batchEditVisible">
							<el-date-picker  style="width:100%;"
								v-model="scope.row.startTime"
								
								align="right"
								type="date"
								value-format="yyyy-MM-dd HH:mm:ss"
								format="yyyy-MM-dd"
								placeholder="选择日期"
								:picker-options="pickerOptions" @change="fieldChange(scope.row,'startTime')">
							</el-date-picker>  
							<el-date-picker  style="width:100%;"
								v-model="scope.row.endTime"
								:disabled="!batchEditVisible"
								align="right"
								type="date"
								value-format="yyyy-MM-dd HH:mm:ss"
								format="yyyy-MM-dd"
								placeholder="选择日期"
								:picker-options="pickerOptions" @change="fieldChange(scope.row,'endTime')">
							</el-date-picker>  
						</div> 
						<div v-else>{{scope.row.startTime?scope.row.startTime.substr(0,10):""}} ~ {{scope.row.endTime?scope.row.endTime.substr(0,10):""}}</div> 
					</template>
				</el-table-column> 
  				<el-table-column prop="execStatus" label="状态" width="100" :formatter="formatterExecStatus" > 
					  	<template slot-scope="scope">
							  <el-select :disabled="!batchEditVisible" v-model="scope.row.execStatus" @change="fieldChange(scope.row,'execStatus')">
								  <el-option :value="'0'" label="新建"></el-option>
								  <el-option :value="'1'" label="测试中"></el-option>
								  <el-option :value="'2'" label="已完成"></el-option>
							  </el-select>
					  	</template> 
				 </el-table-column>
				<el-table-column v-if="!batchEditVisible" label="操作" width="300" fixed="right">
					<template scope="scope">
 						<el-button type="primary" @click="showAddBug(scope.row,scope.$index)" icon="el-icon-plus">bug</el-button>
						<el-button  @click="showBugs(scope.row,scope.$index)" icon="el-icon-s-data">查bug</el-button>
						<el-button type="danger" @click="handleDel(scope.row,$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-if="!gstcVisible"  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
      		<xm-gantt v-if="gstcVisible" :tree-data="xmTestCaseExecs" :project-phase="selProject" :columns="ganrrColumns" :useRealTime="false"></xm-gantt>
		
			<!--编辑 XmTestCaseExec xm_test_case_exec界面-->
			<el-dialog title="编辑xm_test_case_exec" :visible.sync="editFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-test-case-exec-edit :xm-test-case-exec="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-test-case-exec-edit>
			</el-dialog>
	
			<!--新增 XmTestCaseExec xm_test_case_exec界面-->
			<el-dialog title="新增xm_test_case_exec" :visible.sync="addFormVisible"  width="50%"  append-to-body  :close-on-click-modal="false">
				<xm-test-case-exec-add :xm-test-case-exec="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-test-case-exec-add>
			</el-dialog> 
			<el-dialog title="选择用例" :visible.sync="xmTestCaseMngVisible"  width="50%"  append-to-body  :close-on-click-modal="false">
				<xm-test-case-mng  :multi-select="true" :visible="xmTestCaseMngVisible"   @selected="onCaseSelected"></xm-test-case-mng>
			</el-dialog> 
			<el-dialog title="选中项目" :visible.sync="selectProjectVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-project-list    @project-confirm="onPorjectConfirm"></xm-project-list>
			</el-dialog> 
			<el-dialog append-to-body title="故事选择" :visible.sync="menuVisible" fullscreen     :close-on-click-modal="false">
				<xm-menu-select :visible="menuVisible" :is-select-menu="true" :multi="true"   @menus-selected="onSelectedMenus" ></xm-menu-select>
			</el-dialog>
			
			<el-dialog title="选中用户" :visible.sync="selectUserVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-group-mng  :sel-project=" filters.selProject " :is-select-single-user="1" @user-confirm="onUserConfirm"></xm-group-mng>
			</el-dialog> 
			<el-dialog title="选中任务" :visible.sync="selectTaskVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-task-list  :sel-project="filters.selProject"   @task-selected="onSelectedTask"></xm-task-list>
			</el-dialog> 	
			 
			<el-dialog title="查看用例" :visible.sync="caseVisible"  width="80%" fullscreen append-to-body  :close-on-click-modal="false">
				<xm-test-case-mng  :case-id="editForm.caseId" :visible="caseVisible"   ></xm-test-case-mng>
			</el-dialog> 
			<el-dialog title="测试用例" :visible.sync="caseVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				  <xm-test-case-edit :xm-test-case="xmTestCase"   :visible="caseVisible" @cancel="caseVisible=false" ></xm-test-case-edit>
			</el-dialog>
			<el-dialog title="问题列表" :visible.sync="bugsVisible"  width="80%"  append-to-body  fullscreen :close-on-click-modal="false">
				  <xm-question-mng :xm-test-case="xmTestCase" :xm-test-case-exec="editForm" :sel-project="filters.selProject" :visible="bugsVisible" @cancel="bugsVisible=false" ></xm-question-mng>
			</el-dialog>
			
			<!--新增 XmQuestion xm_question界面-->
			<el-dialog title="新增问题" :visible.sync="addBugVisible"  fullscreen width="100%"  append-to-body   :close-on-click-modal="false">
				<xm-question-add :xm-test-case-exec="editForm" :xm-test-case="xmTestCase" :qtype="'bug'" :sel-project=" filters.selProject "   :visible="addBugVisible" @cancel="addBugVisible=false"></xm-question-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import {sn} from '@/common/js/sequence';//全局公共库

	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmTestCaseExec, delXmTestCaseExec, batchDelXmTestCaseExec,batchAddXmTestCaseExec,batchEditXmTestCaseExec } from '@/api/xm/core/xmTestCaseExec';
	import { listXmTestCase} from '@/api/xm/core/xmTestCase';

	import  XmTestCaseExecAdd from './XmTestCaseExecAdd';//新增界面
	import  XmTestCaseExecEdit from './XmTestCaseExecEdit';//修改界面
	import  XmTestCaseMng from '../xmTestCase/XmTestCaseMng';//修改界面
	import XmProjectList from '../xmProject/XmProjectList';
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import XmGroupMng from '../xmProjectGroup/XmProjectGroupMng';
	import XmTaskList from '../xmTask/XmTaskList';
	import  XmTestCaseEdit from '../xmTestCase/XmTestCaseEdit';//修改界面
	import  XmQuestionMng from '../xmQuestion/XmQuestionMng';//修改界面
	import  XmQuestionAdd from '../xmQuestion/XmQuestionAdd';//修改界面
  import XmGantt from '../components/xm-gantt';

	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
        ]),
		},
		props:['selProject'],
		watch:{
			selProject(selProject){
				this.filters.selProject=selProject;
				this.getXmTestCaseExecs();
			}
		},
		data() {
			return {
				filters: {
					key: '',
					selProject:null,
					menus:[],
				},
				xmTestCaseExecs: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{
					//sex:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmTestCaseExec界面是否显示
				//新增xmTestCaseExec界面初始化数据
				addForm: {
					execUserid:'',startTime:'',id:'',projectId:'',projectName:'',caseId:'',caseName:'',endTime:'',remark:'',createUserid:'',createUsername:'',createTime:'',execStatus:'',iterationId:'',iterationName:'',execUsername:'',taskId:'',taskName:'',menuId:''
				},
				xmTestCase:null,
				editFormVisible: false,//编辑界面是否显示
				//编辑xmTestCaseExec界面初始化数据
				editForm: {
					execUserid:'',startTime:'',id:'',projectId:'',projectName:'',caseId:'',caseName:'',endTime:'',remark:'',createUserid:'',createUsername:'',createTime:'',execStatus:'',iterationId:'',iterationName:'',execUsername:'',taskId:'',taskName:'',menuId:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				xmTestCaseMngVisible:false,	
				selectProjectVisible:false,
				menuVisible:false,
				batchEditVisible:false,
				valueChangeRows:[],
				selectUserVisible:false,
				selectTaskVisible:false,
				caseVisible:false,
				bugsVisible:false,
				addBugVisible:false,
				nextAction:'',
        pickerOptions:  util.pickerOptions(),
        gstcVisible:false,
        ganrrColumns: {
            children: 'children',
            name: 'projectName',
            id: 'id',
            pid: 'parentPhaseId',
            startDate: 'startTime',
            endDate: 'endTime',

          },
			tableHeight:300,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmTestCaseExecs();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmTestCaseExecs();
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
				this.getXmTestCaseExecs();
			},
			searchXmTestCaseExecs(){
				 this.pageInfo.count=true; 
				 this.getXmTestCaseExecs();
			},
			//获取列表 XmTestCaseExec xm_test_case_exec
			getXmTestCaseExecs() {
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
				if(this.filters.selProject){
					params.projectId=this.filters.selProject.id
				}
				
				if(this.filters.menus && this.filters.menus.length==1){
					params.menuId=this.filters.menus[0].menuId
 				}else if(this.filters.menus && this.filters.menus.length>1){
					params.menuIds=this.filters.menus.map(i=>i.menuId)
 				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listXmTestCaseExec(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmTestCaseExecs = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmTestCaseExec xm_test_case_exec
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmTestCaseExec xm_test_case_exec
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmTestCaseExecs();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmTestCaseExec
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmTestCaseExec
			handleDel: function (row,index) {  
				if( !this.roles.some(i=>i.roleid=='testAdmin')  && !this.roles.some(i=>i.roleid=='testTeamAdmin') ){
					this.$message({message:"只有测试经理、测试组长可以操作",type:"error"});
					return ;
				}
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmTestCaseExec(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmTestCaseExecs();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmTestCaseExec
			batchDel: function () { 
				if( !this.roles.some(i=>i.roleid=='testAdmin')  && !this.roles.some(i=>i.roleid=='testTeamAdmin') ){
					this.$message({message:"只有测试经理、测试组长可以操作",type:"error"});
					return ;
				}
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmTestCaseExec(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmTestCaseExecs(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			onCaseSelected(cases){
				if(cases.length>0){
					this.load.add=true;
					var execs=JSON.parse(JSON.stringify(cases))
					execs.forEach(i=>{
						
						i.projectId=this.filters.selProject.id
						i.projectName=this.filters.selProject.name
						i.execUserid=this.userInfo.userid
						i.execUsername=this.userInfo.username
						i.caseId=i.id
						i.caseName=i.caseName
						i.remark=i.remark
						i.menuId=i.menuId
						i.menuName=i.menuName
						i.createUserid=this.userInfo.userid
						i.createUsername=this.userInfo.username,
						i.opType="add"
						i.id=sn('tce_');
					})
					batchAddXmTestCaseExec(execs).then(res=>{
						this.load.add=false;
						this.xmTestCaseMngVisible=false;

						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmTestCaseExecs(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					})
				}else{
					this.xmTestCaseMngVisible=false;
				}

			},
			showCase(){
				if( !this.roles.some(i=>i.roleid=='testAdmin')   && !this.roles.some(i=>i.roleid=='testTeamAdmin') ){
					this.$message({message:"只有测试经理、测试组长可以操作",type:"error"});
					return ;
				}
				if(!this.filters.selProject){
					this.$message({message:"请先选择项目",type:"success"});
					this.nextAction="showCase"
					this.showProjectList();
					return;
				}
				this.xmTestCaseMngVisible=true;
			},
			
			clearProject(){
				this.filters.selProject=null
				this.getXmTestCaseExecs()
			},
			showProjectList:function(){
				this.selectProjectVisible=true;
			},
			onPorjectConfirm:function(project){
				this.filters.selProject=project
				this.selectProjectVisible=false;
				this.getXmTestCaseExecs();
				if(this.nextAction=="showBatchEdit"){
					this.showBatchEdit();
				}else if(this.nextAction=="showCase"){
					this.showCase();
				}else if(this.nextAction=="showAddBug"){
					this.showAddBug(this.editForm);
				}else if(this.nextAction=="showBugs"){
					this.showBugs(this.editForm);
				}else if(this.nextAction=="showSelectTask"){
					this.showSelectTask(this.editForm);
				}
			},
			formatterExecStatus(row,column,cellValue, index){
				var columnName=column.property;
 				if(cellValue=="0"){
					return "新建"
				}if(cellValue=="1"){
					return "执行中"
				}else if(cellValue=="2"){
					return "已结束"
				}else {
					return "新建";
				}
			},
			showMenu(){
				this.menuVisible=true;
			},
			
			onSelectedMenus(menus){
				if(!menus || menus.length==0){
					this.menuVisible=false
					return;
				}
				this.menuVisible=false

				this.filters.menus=menus;
				this.getXmTestCaseExecs();
			},
			clearFiltersMneu(menu){
				var index=this.filters.menus.findIndex(i=>i.menuId==menu.menuId)
				this.filters.menus.splice(index,1);
				this.getXmTestCaseExecs();
			},	
			showBatchEdit:function(){ 
				if( !this.roles.some(i=>i.roleid=='testAdmin') && !this.roles.some(i=>i.roleid=='tester') && !this.roles.some(i=>i.roleid=='testTeamAdmin') ){
					this.$message({message:"只有测试经理、测试组长、测试员可以操作",type:"error"});
					return ;
				}
				if( !this.filters.selProject ){
					this.$message({ message:"请先选择项目", type: 'success'});
					this.nextAction="showBatchEdit"
					this.showProjectList();
					return ;
				}
				this.batchEditVisible=true
			},
			batchEditXmTestCaseExec:function(){
				
				if( !this.roles.some(i=>i.roleid=='testAdmin') && !this.roles.some(i=>i.roleid=='tester') && !this.roles.some(i=>i.roleid=='testTeamAdmin') ){
					this.$message({message:"只有测试经理、测试组长、测试员可以操作",type:"error"});
					return ;
				}
 				if(this.valueChangeRows.length==0){
					this.$message({ message:"没有改变任何数据，无需保存", type: 'success'});
					return;
				}else { 
					this.load.edit=true;
					batchEditXmTestCaseExec(this.valueChangeRows).then(res=>{ 
						this.load.edit=false;
						var tips =res.data.tips;
						if(tips.isOk){
							this.valueChangeRows=[]
							this.getXmTestCaseExecs();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'}); 
						
					}).catch(e=>this.load.edit=false);
				}
				
			},
			noBatchEdit(){
				this.batchEditVisible=false;
				if(this.valueChangeRows.length>0){
					this.valueChangeRows=[];
					this.getXmTestCaseExecs()
				}
				
			},
			fieldChange:function(row,fieldName){
				 
				if(this.valueChangeRows.some(i=>i.id==row.id)){
					return;
				}else{
					this.valueChangeRows.push(row)
				} 
			},
			
			showGroupUsers:function(row){
				this.editForm=row
 				this.selectUserVisible=true;
			},
			onUserConfirm:function(groupUsers){
				if(groupUsers==null || groupUsers.length==0){
					this.editForm.execUserid=""
					this.editForm.execUsername=""
				}else{
					var user=groupUsers[0] 
					this.editForm.execUserid=user.userid
					this.editForm.execUsername=user.username
				 
				} 
				this.fieldChange(this.editForm)
				this.selectUserVisible=false
			},
			showSelectTask:function(row){
				this.editForm=row
				if(this.filters.selProject==null){
					this.$message({ message: "请先选项目", type: 'success' }); 
					this.nextAction="showSelectTask"
					this.showProjectList();

					return ;
				}
				this.selectTaskVisible=true;
			},
			onSelectedTask(task){
				this.editForm.taskId=task.id
				this.editForm.taskName=task.name
				this.fieldChange(this.editForm)
				this.selectTaskVisible=false; 
			},
			showCaseDetail(row){
				this.editForm=row
				if(row.caseId){
					var xmTestCase=JSON.parse(JSON.stringify(row))
					xmTestCase.id=xmTestCase.caseId
					this.xmTestCase=xmTestCase
					this.caseVisible=true;
				}else{
					this.$message.success("该用例已不存在")
				}
				
			},
			showBugs(row){
				this.editForm=row
				if(!this.filters.selProject){ 
					this.$message({ message: "请先选项目", type: 'success' }); 
					this.showProjectList();
					this.nextAction="showBugs"
					return ;
				} 
				if(row.caseId){
					var xmTestCase=JSON.parse(JSON.stringify(row))
					xmTestCase.id=xmTestCase.caseId
					this.xmTestCase=xmTestCase 
					this.bugsVisible=true;
				}else{
					this.$message.success("该用例已不存在")
				}
			},
			showAddBug(row){
				this.editForm=row
				if(!this.filters.selProject){
					
					this.$message({ message: "请先选项目", type: 'success' }); 
					this.nextAction="showAddBug"
					this.showProjectList();
					return ;
				} 
				if(row.caseId){
					var xmTestCase=JSON.parse(JSON.stringify(row))
					xmTestCase.id=xmTestCase.caseId
					this.xmTestCase=xmTestCase 
					this.addBugVisible=true;
				}else{
					this.$message.success("该用例已不存在")
				} 
      },
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-test-case-exec-add':XmTestCaseExecAdd,
			'xm-test-case-exec-edit':XmTestCaseExecEdit, 
			XmTestCaseMng,XmProjectList,xmMenuSelect,XmGroupMng,XmTaskList,XmTestCaseEdit,XmQuestionMng,XmQuestionAdd, XmGantt
		    //在下面添加其它组件
		},
		mounted() { 
			this.filters.selProject=this.selProject; 
			this.$nextTick(() => {
				var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=65/1000 * window.innerHeight; 
				if(this.selProject){
					subHeight=100/1000 * window.innerHeight;
				}
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight; 
				this.getXmTestCaseExecs();
        	}); 
        	/** 举例，
    		listOption([{categoryId:'all',itemCode:'sex'},{categoryId:'all',itemCode:'grade'}] ).then(res=>{
				if(res.data.tips.isOk){ 
 					this.options=res.data.data
				}
			});
			**/
		}
	}

</script>

<style lang="scss" scoped> 
</style>