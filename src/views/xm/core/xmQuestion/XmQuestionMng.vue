<template>
	<section> 
			<el-row class="app-container">  
			  	<el-select v-model="filters.bugStatus" placeholder="请选择状态" style="width:15%;" clearable @change="changeBugStatus">
					<el-option v-for="(b,index) in options['bugStatus']" :value="b.optionValue"  :key="index" :label="b.optionName">{{b.optionName}}
					</el-option>
				</el-select>
				<el-select class="hidden-md-and-down" v-model="filters.priority" placeholder="紧急程度"  style="width:15%;" clearable @change="changePriority">
					<el-option v-for="(b,index) in options['urgencyLevel']" :value="b.optionValue" :key="index" :label="b.optionName">{{b.optionName}}
					</el-option>
				</el-select>
				<el-select class="hidden-md-and-down" v-model="filters.bugSeverity" placeholder="请选择严重程度" clearable @change="changeBugSeverity">
					<el-option v-for="(b,index) in options['bugSeverity']" :value="b.optionValue" :key="index" :label="b.optionName">{{b.optionName}}
					</el-option>
				</el-select>  
				<el-button v-if=" !filters.menus || filters.menus.length==0" @click="showMenu"> 选择故事</el-button>
				<el-tag v-else   closable @close="clearFiltersMenu(filters.menus[0])">{{filters.menus[0].menuName.substr(0,5)}}等({{filters.menus.length}})个</el-tag>
				<el-input style="width:200px;" v-model="filters.key" placeholder="问题名称">
					<template slot="append">
						<el-button @click="searchXmQuestions" type="primary" icon="el-icon-search"></el-button>
					</template>
				</el-input>  
				<el-button type="primary" icon="el-icon-plus" @click="showAdd">
				</el-button>
				<el-popover
					placement="top-start"
					title=""
					width="400"
					trigger="click" >
					<el-row>
						<el-col :span="24"  style="padding-top:12px;" v-if="!selProject">
							<font class="more-label-font">项目:</font>
							<el-tag v-if="filters.selProject && !selProject" closable @close="clearProject" @click="showProjectList(true)">{{ filters.selProject.name }}</el-tag>
							<el-button v-else @click="showProjectList(true)" >选择项目</el-button>
						
						</el-col>
						<el-col :span="24" style="padding-top:12px;">
							<font class="more-label-font">指派给:</font>
							<el-button v-if="!filters.handlerUsername" @click="showGroupUsers('handlerUsername')">选择被指派人</el-button>
							<el-tag v-else closable @close="clearHandler"  @click="showGroupUsers('handlerUsername')">{{filters.handlerUsername}}</el-tag>
						</el-col> 
						<el-col :span="24" style="padding-top:5px;">
								<font class="more-label-font">故事:</font>
							<font  v-if="  filters.menus && filters.menus.length>0">
								<el-tag  v-for="(item,index) in filters.menus" :key="index"  closable  @close="clearFiltersMenu(item)">{{item.menuName.substr(0,10)}}</el-tag>
							</font>
							<el-button v-else    @click="showMenu" type="plian">选故事</el-button>
						</el-col> 
						<el-col :span="24" class="hidden-lg-and-up" style="padding-top:12px;"> 
							<el-select   v-model="filters.priority" placeholder="请选择紧急程度" clearable @change="changePriority">
								<el-option v-for="(b,index) in options['urgencyLevel']" :value="b.optionValue" :key="index" :label="b.optionName">{{b.optionName}}
								</el-option>
							</el-select>
						</el-col> 
						<el-col :span="24"  style="padding-top:12px;"> 
							<el-select  v-model="filters.solution" placeholder="请选择解决方案" clearable @change="changeSolution">
								<el-option v-for="(b,index) in options['bugSolution']" :value="b.optionValue" :key="index" :label="b.optionName">{{b.optionName}}
								</el-option>
							</el-select>
						</el-col> 
						<el-col :span="24"  style="padding-top:12px;">
							<el-button @click="handleExport"   icon="el-icon-download">导出</el-button>
						</el-col> 
					</el-row>
					<el-button  slot="reference" icon="el-icon-more" circle></el-button>
				</el-popover> 

			 </el-row>
			 <el-row class="app-container">
				<!--列表 XmQuestion xm_question-->
				<el-table ref="table" :max-height="tableHeight" :data="xmQuestions" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column sortable type="index" width="45"></el-table-column> 
					<el-table-column prop="name" label="问题名称"  min-width="200"> 
						<template slot-scope="scope">
							{{scope.row.id}}&nbsp;<el-link type="primary" @click="showEdit(scope.row)">{{scope.row.name}}</el-link> 
						</template>
					</el-table-column>
					<el-table-column prop="bugStatus" label="状态" width="100" :formatter="formatterOption">
						<template slot-scope="scope">
							<el-tag type="info" v-if="scope.row.bugStatus=='create' ">创建</el-tag> 
							<el-tag type="primary" v-else-if="scope.row.bugStatus=='active'">激活</el-tag> 
							<el-tag type="warning" v-else-if="scope.row.bugStatus=='confirm'">确认</el-tag>
							<el-tag type="warning" v-else-if="scope.row.bugStatus=='confirmed'">已确认</el-tag>
							<el-tag type="success" v-else-if="scope.row.bugStatus=='solve'">解决</el-tag> 
							<el-tag type="success" v-else-if="scope.row.bugStatus=='resolved'">已解决</el-tag>
							<el-tag type="success" v-else-if="scope.row.bugStatus=='close'">关闭</el-tag> 
							<el-tag type="success" v-else-if="scope.row.bugStatus=='closed'">已关闭</el-tag>
							<el-tag v-else>{{scope.row.bugStatus}}</el-tag>  
						</template>
					</el-table-column> 
					<el-table-column prop="menuName" label="故事" width="100" show-overflow-tooltip></el-table-column> 
					<el-table-column prop="bugSeverity" label="严重程度" width="100" :formatter="formatterOption"></el-table-column> 
					<el-table-column prop="priority" label="紧急程度" width="100" :formatter="formatterOption"></el-table-column> 
					<el-table-column prop="solution" label="解决方案" width="100" :formatter="formatterOption"></el-table-column>
					<el-table-column prop="handlerUsername" width="200" label="指派给" > 
						<template slot="header">
							指派给<el-button @click="showGroupUsers('handlerUsername')"  icon="el-icon-search" circle size="mini"></el-button>
						</template>
					</el-table-column>
					<el-table-column prop="endTime" label="到期时间" width="120" :formatter="formatterDate"></el-table-column>
					
					<el-table-column prop="bizFlowState" label="升级处理" width="120" >
						<template slot-scope="scope">
							
							<el-tooltip  v-if="scope.row.flowState!='' && scope.row.flowState!=null" :content="showApprovaInfo(scope.row)" placement="bottom" effect="light"> 
							<el-tag v-if="scope.row.flowState=='0' || scope.row.flowState==null ">未发审</el-tag> 
							<el-tag v-else-if="scope.row.flowState=='1'">审核中</el-tag> 
							<el-tag v-else-if="scope.row.flowState=='2'">已通过</el-tag>
							<el-tag v-else-if="scope.row.flowState=='3'">未通过</el-tag>
							<el-tag v-else-if="scope.row.flowState=='4'">已取消</el-tag> 
							</el-tooltip> 
							<el-button icon="el-icon-star-on" v-if="!scope.row.flowState"    @click="handleCommand({type:'sendToProcessApprova',data:scope.row,bizKey:'xm_question_up_approva'})">{{qtype=='risk'?'升级':'升级'}}</el-button>
						</template>
					</el-table-column>
					<el-table-column style="text-align:center;" class="el-icon-s-operation" align="center" width="100" fixed="right"  >
						<!-- <template slot="header" slot-scope="scope"><div class="el-icon-s-operation"></div></template> -->
						<template slot-scope="scope">
							<!-- <el-popover style="min-width:0 !important;" popper-class="autowidth" placement="left"	trigger="hover"> -->
								<el-button-group> 
									<el-button size="small" type="primary"   @click.stop="showEdit(scope.row)">{{showSolveName(scope.row)}}</el-button> 
								</el-button-group>
								<!-- <el-button slot="reference" class="see-more" type="text" icon="el-icon-more"></el-button>
							</el-popover>	 -->
						</template>
					</el-table-column>
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
			 </el-row>
			<!--编辑 XmQuestion xm_question界面-->
			<el-dialog title="编辑问题"   :visible.sync="editFormVisible" fullscreen  width="100%"  append-to-body   :close-on-click-modal="false">
					<xm-question-edit :sel-project=" {id:editForm.projectId,name:editForm.projectName} " :xm-question="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-question-edit>
			</el-dialog>
	
			<!--新增 XmQuestion xm_question界面-->
			<el-dialog title="新增问题"  :visible.sync="addFormVisible"  fullscreen width="100%"  append-to-body   :close-on-click-modal="false">
				<xm-question-add :xm-test-case-exec="xmTestCaseExec" :xm-test-case="xmTestCase" :qtype="qtype" :sel-project=" filters.selProject " :xm-question="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-question-add>
			</el-dialog> 
			
			<el-dialog title="选中用户" v-if=" filters.selProject " :visible.sync="selectUserVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-group-mng  :sel-project=" filters.selProject " :is-select-single-user="1" @user-confirm="onUserConfirm"></xm-group-mng>
			</el-dialog> 
			<el-dialog title="选中项目" :visible.sync="selectProjectVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-project-list    @project-confirm="onPorjectConfirm"></xm-project-list>
			</el-dialog>  
			
			<el-dialog append-to-body title="故事选择" :visible.sync="menuVisible"    width="80%"   :close-on-click-modal="false">
				<xm-menu-select :visible="menuVisible" :is-select-menu="true" :multi="true"    @menus-selected="onSelectedMenus" ></xm-menu-select>
			</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	
	import config from '@/common/config';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmQuestion, delXmQuestion, batchDelXmQuestion, editStatus } from '@/api/xm/core/xmQuestion';
	import  XmQuestionAdd from './XmQuestionAdd';//新增界面
	import  XmQuestionEdit from './XmQuestionEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import XmGroupMng from '../xmProjectGroup/XmProjectGroupMng';
	import XmProjectList from '../xmProject/XmProjectList';

	export default { 
		computed: {
			...mapGetters([
				'userInfo','roles'
			]), 
		},
		props: ["selProject",'qtype','xmTestCaseExec','xmTestCase','visible'],
		watch:{
			selProject:function(selProject){
				this.filters.selProject=this.selProject
				//this.getXmQuestions();
			},
			visible(visible){
				if(visible==true){
					this.getXmQuestions();
				}
			},
			qtype(){
				this.getXmQuestions()
			}
		},
		data() {
			return {
				filters: {
					key: '',
					bugStatus:'',
					priority:'',
					solution:'',
					bugSeverity:'',
					handlerUserid:'',
					handlerUsername:'',
					selProject:null,
					menus:[],
				},
				xmQuestions: [],//查询结果
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
					bugSeverity:[],
					bugSolution:[],
					bugStatus:[],
					bugType:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmQuestion界面是否显示
				//新增xmQuestion界面初始化数据
				addForm: {
					id:'',name:'',projectId:'',projectName:'',taskId:'',taskName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'3',solution:'',processTime:'',receiptMessage:'',receiptTime:'',description:'',createUserid:'',createUsername:'',createTime:'',bugStatus:'',bugSeverity:'3',
					attachment: [],
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmQuestion界面初始化数据
				editForm: {
					id:'',name:'',projectId:'',projectName:'',taskId:'',taskName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'',solution:'',processTime:'',receiptMessage:'',receiptTime:'',description:'',createUserid:'',createUsername:'',createTime:'',bugStatus:'',bugSeverity:'3',
					attachment: [],
				}, 
				/**begin 自定义属性请在下面加 请加备注**/  
				selectUserVisible:false,
				selectProjectVisible:false,
				nextAction:'',
				tableHeight:300,
				cloumns: [
					{
						key: 'name',
						type: 'text',
						name: '问题名称'
					},
					{
						key: 'bugStatus',
						type: 'dict',
						name: '状态'
					},
					{
						key: 'bugSeverity',
						type: 'dict',
						name: '严重程度'
					},
					{
						key: 'priority',
						type: 'dict',
						name: '紧急程度'
					},
					{
						key: 'solution',
						type: 'dict',
						name: '解决方案'
					},
					{
						key: 'handlerUsername',
						type: 'text',
						name: '指派给'
					},
					{
						key: 'endTime',
						type: 'time',
						name: '到期时间'
					}
				],
				menuVisible:false,
				/**end 自定义属性请在上面加 请加备注**/
				
			}

		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmQuestions();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmQuestions();
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
				this.getXmQuestions();
			},
			searchXmQuestions(){
				 this.pageInfo.count=true; 
				 this.getXmQuestions();
			},
			//获取列表 XmQuestion xm_question
			getXmQuestions() {
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
				if( this.filters.bugStatus!=null && this.filters.bugStatus!="" ){
					params.bugStatus=this.filters.bugStatus
				} 
				if( this.filters.solution!=null && this.filters.solution!=""){
					params.solution=this.filters.solution
				} 
				if( this.filters.priority!=null && this.filters.priority!=""){
					params.priority=this.filters.priority
				} 
				if( this.filters.bugSeverity!=null && this.filters.bugSeverity!=""){
					params.bugSeverity=this.filters.bugSeverity
				} 
				if( this.filters.handlerUserid!=null && this.filters.handlerUserid!=""){
					params.handlerUserid=this.filters.handlerUserid
				} 
				if(this.filters.menus && this.filters.menus.length==1){
					params.menuId=this.filters.menus[0].menuId
 				}else if(this.filters.menus && this.filters.menus.length>1){
					params.menuIds=this.filters.menus.map(i=>i.menuId)
 				}
				this.load.list = true;
				if(this.filters.selProject){ 	
					params.projectId = this.filters.selProject.id; 
				}
				if(this.xmTestCaseExec){
					params.caseExecId=this.xmTestCaseExec.id
				}
				if(this.xmTestCase){
					params.caseId=this.xmTestCase.id
				}
				
				if(this.filters.key){
					params.key='%'+this.filters.key+'%'
				}
				params.qtype=this.qtype
				listXmQuestion(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmQuestions = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
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
				this.searchXmQuestions();
			},
			clearFiltersMenu(menu){
				var index=this.filters.menus.findIndex(i=>i.menuId==menu.menuId)
				this.filters.menus.splice(index,1);
				this.searchXmQuestions();
			},
			//显示编辑界面 XmQuestion xm_question
			showEdit: function ( row,index ) {
				this.editFormVisible = true;  
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmQuestion xm_question
			showAdd: function () {
				if(this.filters.selProject==null){
					
					this.$message({ message: "请先选中项目", type: 'success' }); 
					this.nextAction="showAdd"
					this.showProjectList();
					return;
				}
				this.addFormVisible = true;
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmQuestions();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getXmQuestions();
			},
			//选择行xmQuestion
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmQuestion
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmQuestion(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmQuestions();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmQuestion
			batchDel: function () {
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmQuestion(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmQuestions(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){ 
				this.editForm=row;
			},

			

			isEmpty(str) {
				return str == null || str == "";
			},
			formatDate(time,isDate) {
				const date = new Date(time);
				const m = date.getMonth()+1;
				const d = date.getDate();
				const h = date.getHours()<10 ? "0"+date.getHours() : date.getHours();
				const min = date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
				const s = date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
				return date.getFullYear()+"-"+(m < 10 ? "0"+m : m)+"-"+ (d < 10 ? "0"+d : d) + " " + h+":"+min+":"+s;
			},
			changeBugStatus(val){
				this.filters.bugStatus= val; 
				this.getXmQuestions();
			},
			changeBugSeverity(val){
				this.filters.bugSeverity= val; 
				this.getXmQuestions();
			},
			changeSolution(val){
				this.filters.solution= val; 
				this.getXmQuestions();
			},
			changePriority(val){
				this.filters.priority= val; 
				this.getXmQuestions();
			},
			formatterDate: function(row,column,cellValue, index){  
				if(cellValue){
					return cellValue.substr(0,10);
				}else{
					return ""
				}
			},
			
			formatterOption: function(row,column,cellValue, index){ 
				var columnName=column.property;
				var key="";
				if(columnName=='bugStatus'){
					key="bugStatus"
				}else if(columnName=='bugType'){
					key="bugType"
				}else if(columnName=='solution'){
					key="bugSolution"
				}else if(columnName=='bugSeverity'){
					key="bugSeverity"
				}else if(columnName=='priority'){
					key="urgencyLevel"
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
			showSolveName:function(row){
				if(row.bugStatus=='active'){
					return "去确认"
				}else if(row.bugStatus=='confirmed'){
					return "去解决"
				}else if(row.bugStatus=='resolved'){
					return "去关闭"
				}else if(row.bugStatus=='closed'){
					return "激活"
				}
			},
			
			showGroupUsers:function(){ 
				if(this.filters.selProject==null || this.filters.selProject.id==''){
					this.$message({ message: "请先选中项目", type: 'success' }); 
					this.nextAction="showGroupUsers"
					this.showProjectList();
					return;
				}
				this.selectUserVisible=true;
			},
			handleExport() {
				this.downloadLoading = true
				let header = [];
				let keyList = [];
				this.cloumns.forEach(d => {
					header.push(d.name);
					keyList.push(d.key);
				});
				console.log('this.$route==', this.$route);
				const filename = `${this.$route.meta.title}_第${this.pageInfo.pageNum}页`;
				const data = this.formatJson(keyList, this.xmQuestions);
				import('@/vendor/Export2Excel').then(excel => {
					excel.export_json_to_excel({
						header,
						data,
						filename,
						// autoWidth: this.autoWidth,
						bookType: 'xlsx'
					})
					this.downloadLoading = false
				})
			},
			formatJson(filterVal, jsonData) {
				console.log('this.options==', this.options);
				
				return jsonData.map(v => filterVal.map(j => {
					let key = '';
					if (j === 'timestamp') {
						return parseTime(v[j])
					} else if(j == 'bugStatus') {
						key = "bugStatus"
					} else if(j == 'bugType') {
						key = "bugType"
					} else if(j == 'solution') {
						key = "bugSolution"
					} else if(j == 'bugSeverity') {
						key = "bugSeverity"
					} else if(j == 'priority') {
						key = "urgencyLevel"
					} else {
						return v[j];
					}
					if(this.options[key]==undefined || this.options[key]==null || this.options[key].length==0){
						return v[j];
					}
					var rowData = this.options[key].find(i => i.optionValue == v[j]);
					if(rowData){
						return rowData.optionName;
					}else{
						return v[j];
					}
				}))
			},
			/**end 自定义函数请在上面加**/
			
			onUserConfirm:function(groupUsers){
				if(groupUsers==null || groupUsers.length==0){ 
						this.filters.handlerUserid=''
						this.filters.handlerUsername=''; 
				}else{
					var user=groupUsers[0] 
						this.filters.handlerUserid=user.userid
						this.filters.handlerUsername=user.username 
				} 
				this.selectUserVisible=false
				this.searchXmQuestions(); 

			}, 
			showProjectList:function(clear){ 
				if(clear){
					this.nextAction="";
				}
				this.selectProjectVisible=true;
			},
			onPorjectConfirm:function(project){
				this.filters.selProject=project
				this.selectProjectVisible=false;
				this.searchXmQuestions();
				if(this.nextAction=='showAdd'){
					this.showAdd()
				}else if(this.nextAction=='showGroupUsers'){
					this.showGroupUsers()
				}
			},
			showApprovaInfo:function(row){
				var msgFields=[];
				if(row.mainTitle!=null && row.mainTitle!=""){
					msgFields.push("流程【"+row.mainTitle+"】");
				}
				
				if(row.taskName!=null && row.taskName!=""){
					msgFields.push("当前环节【"+row.taskName+"】");
				}
				
				if(row.assigneeName!=null && row.assigneeName!=""){
					msgFields.push("执行人【"+row.assigneeName+"】");
				}
				
				if(row.commentMsg!=null && row.commentMsg!=""){
					msgFields.push("审批意见【"+row.commentMsg+"】");
				}
				var msg=msgFields.join(",");
				return msg;
			},
			
			sendToProcessApprova:function(row,bizKey){ 
				// 传过来的参数格式
				if(row.flowState=='1'){
					this.$message.error("已经发起，不允许重复发起");
					return;
				}
				let extVars={projectId:row.projectId,branchId:this.userInfo.branchId,questionId:row.id}
				let jsonExtVars=JSON.stringify(extVars); 

				var currDomain=window.location.protocol+"//"+window.location.host;
				var fullPath=this.$route.fullPath; 
				var bizUrl=currDomain+'/#'+fullPath+'?extVars='+jsonExtVars

				let params={
					bizKey:bizKey,
					bizUrl:bizUrl,
					resUrl:'',
					bizPkid:row.id,
					bizParentPkid:row.id,
					mainContext:'',
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED', 
						data:{
							id:row.id,
							branchId:this.userInfo.branchId,
							projectId:row.projectId, 

						}
					}, 
				} 
				if(bizKey=="xm_question_up_approva"){
					//预算变更审核
					params.mainTitle='关于问题【'+row.name+"】升级的申请";
					params.mainContext='项目编号：'+row.projectId+','+'项目名称：'+row.projectName+',任务名称：'+row.taskName
										+'<br>'+row.askUsername+'于'+row.createTime+'提出问题('+row.id+')：'+row.name
										+'<br>问题描述：'+row.description;
					params.restUrl=config.getOaBasePath()+"/xm/xmQuestion/processApprova"; 
					this.$router.push({name:'ProcdefListForBizStart',params:params}); 				
					
				}else {
					this.$message.error("不支持的审批事项");
					return;
				}
				//this.$store.dispatch('addVisitedViews', {path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}})
			},
			clearProject(){
				this.filters.selProject=null
				this.nextAction=""
				this.searchXmQuestions()
			},
			clearHandler(){
				
				this.filters.handlerUserid=''
				this.filters.handlerUsername=''; 
				this.searchXmQuestions();
				this.nextAction=""
			},
			handleCommand(command) {  
				if(command.type=='sendToProcessApprova'){ 
					this.sendToProcessApprova(command.data,command.bizKey);
				}
			}, 
		},//end methods
		components: { 
				'xm-question-add':XmQuestionAdd,
				'xm-question-edit':XmQuestionEdit,
				XmGroupMng,XmProjectList,xmMenuSelect,
				//在下面添加其它组件
		},
		mounted() { 
			if(this.selProject){
				this.filters.selProject=this.selProject
			}
			this.$nextTick(() => {
				var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=50/1000 * window.innerHeight; 
				if(this.selProject){
					subHeight=100/1000 * window.innerHeight; 
				}
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight; 
				this.getXmQuestions();
			}); 
				listOption([{categoryId:'all',itemCode:'bugSeverity'},{categoryId:'all',itemCode:'bugSolution'},{categoryId:'all',itemCode:'bugStatus'},{categoryId:'all',itemCode:'bugType'},{categoryId:'all',itemCode:'urgencyLevel'}] ).then(res=>{
					if(res.data.tips.isOk){ 
						this.options['bugSeverity']=res.data.data.bugSeverity
						this.options['bugSolution']=res.data.data.bugSolution
						this.options['bugStatus']=res.data.data.bugStatus
						this.options['bugType']=res.data.data.bugType
						this.options['urgencyLevel']=res.data.data.urgencyLevel
					}
				});
		}
	}

</script>

<style scoped>
.xm-question{
	width: 100%;
}
.xm-question>.el-menu-demo{
	height: 50px;
	padding-left: 10px;
	background: #fafbfc;
}
.xm-question>.el-menu-demo>li{
	height: 100%;
	line-height: 50px;
	color: #303133;
}
.xm-question>.el-menu-demo>li:hover{
	background: transparent;
}
.xm-question>.el-menu-demo>.is-active{
	background: transparent;
}
.el-dialog__wrapper >>> .el-dialog__body {
	padding: 0 20px;
}

.xm-file>.el-menu-demo,.title-bar{
	height: 50px;
	background: #fafbfc;
	line-height: 50px;
}
.title-bar{
	padding:0 10px;
}
.title-bar>button{
	float:right;
	margin:7px 10px;
}
.question-form{
	padding: 10px 20px;
}

.question-form .el-form-item{
	margin-bottom: 15px;
}
* >>> .autowidth{
	min-width: 0px !important;
}

.more-label-font{
	text-align:center;
	float:left;
	padding-top:10px;
}
</style>