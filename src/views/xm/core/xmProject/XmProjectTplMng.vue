<template>
	<section class="page-container"> 
		<el-row v-if="showType!='simple'" class="padding">
			<el-checkbox v-model="filters.isMy" false-label="" true-label="1">我的模板</el-checkbox>
			<el-input style="width:300px;" v-model="filters.key" placeholder="模板名字"></el-input>
			<el-button @click="searchXmProjects" icon="el-icon-search"></el-button>
		</el-row>
		<el-row v-if="showType=='simple'"> 
					<el-col :span="24">
					<el-checkbox v-model="filters.isMy" false-label="0" true-label="1">我的模板</el-checkbox> <font style="font-size:10px;" color="blue">通过复制快速创建新的项目</font>
					</el-col>
					<el-col :span="16"><el-input  v-model="filters.key" placeholder="模板名字"></el-input>
					</el-col>
					<el-col :span="8">
					&nbsp;&nbsp;<el-button @click="searchXmProjects" icon="el-icon-search"></el-button>
					</el-col> 
		</el-row>
		<el-row  class="page-main"> 
			<!--列表 XmProject xm_project-->
			<el-row  v-loading="load.list">
				
					<el-table :height="maxTableHeight" ref="table" v-cloak  stripe :data="ScreenData" @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 						<el-table-column prop="name" label="项目模板(学习/参考)" min-width="200" >
							<template slot-scope="scope">
								<div v-if="isSelect===true">{{scope.row.name}}</div>
								<el-link v-else @click.stop="intoInfo(scope.row)">{{scope.row.name}}</el-link>
							</template>
						</el-table-column>  
						<el-table-column  label="" width="100" fixed="right" v-if="isSelect!==true">
							<template slot-scope="scope"> 
								<el-button type="text" title="通过复制创建新的项目" @click="onCopyToBtnClick(scope.row)" :disabled="load.add" v-loading="load.add">复制</el-button>								
								<el-button type="text" title="删除该模板" @click="handleDel(scope.row)" :disabled="load.del" v-loading="load.del">删除</el-button>
							</template>
						</el-table-column> 
					</el-table>
			</el-row>
 
			<el-pagination  layout="total,  prev, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total"  style="float:right;"></el-pagination> 
		</el-row> 
		<el-drawer title="项目编辑" :visible.sync="editFormVisible" :with-header="false"  size="50%"  :close-on-click-modal="false" append-to-body>
			<xm-project-edit :sel-project="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-edit>
		</el-drawer>
		<el-drawer :title="selectProject==null?'项目明细':selectProject.name" center :fullscreen="true" :visible.sync="showInfo"  size="50%"  :close-on-click-modal="false" append-to-body>
			<xm-project-info :sel-project="selectProject" :visible="showInfo" @changeShowInfo="changeShowInfo" @submit="changeShowInfo"></xm-project-info>
		</el-drawer>
		<el-dialog
			title="通过复制创建新的模板或者新的项目"
			:visible.sync="copyToVisible"
			width="30%" > 
			<el-form>
			<el-form-item label="项目名称">
				<el-input v-model="xmProjectCopy.name" placeholder="新的项目名称"></el-input> 
			</el-form-item>
			<el-form-item  label="项目代号"> 
				<el-input v-model="xmProjectCopy.code"  placeholder="新的项目代号"> 
					<template slot="append">
						<el-button type="text" @click="createProjectCode">自动生成</el-button>
					</template>
				</el-input>
				<font color="blue" style="font-size:10px;">项目代号为合同上的项目代号，甲乙方共享;项目内部编号为 &nbsp;代号-四位随机码</font>
			</el-form-item>
			<el-form-item  label="目标">
				<el-radio v-model="xmProjectCopy.isTpl" label="1">复制为新的模板</el-radio>
				<el-radio v-model="xmProjectCopy.isTpl" label="0">复制为新的项目</el-radio>
			</el-form-item>
			<el-form-item label="附加任务">
				<el-checkbox v-model="xmProjectCopy.copyPhase" true-label="1" false-label="0">拷贝计划</el-checkbox> 
				<el-checkbox v-model="xmProjectCopy.copyTask" true-label="1" false-label="0">拷贝任务</el-checkbox>  
				<el-checkbox v-model="xmProjectCopy.copyGroup" true-label="1" false-label="0">拷贝项目组织架构</el-checkbox>  
				<el-checkbox v-model="xmProjectCopy.copyGroupUser" true-label="1" false-label="0">拷贝项目组成员</el-checkbox>  
			</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="copyToVisible = false">取 消</el-button>
				<el-button type="primary" @click="onCopyToConfirm" :disabled="load.add" v-loading="load.add">确 定</el-button>
			</span>
		</el-dialog>
	</section> 

</template>

<script>
	import Vue from 'vue'
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import config from "@/common/config"; //全局公共库
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmProject, editStatus, delXmProject, batchDelXmProject,copyTo,createProjectCode} from '@/api/xm/core/xmProject'; 
	import { addXmMyFocus , delXmMyFocus } from '@/api/xm/core/xmMyFocus'; 
 	import { mapGetters } from 'vuex'  

	 
	


	export default { 
		props:['dataScope','showType','isSelect'],
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),
			ScreenData() {
				const key = this.menukey;
				const userid = this.userInfo.userid;
				return this.xmProjects;
				 
			},
		},
		watch: { 
			"finishFlag":function(val){
				this.searchXmProjects();
			}
		},
		data() {
			
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
			return {
				filters: {
					key: '',
					productId:'',
					productName:'',
				},
				xmProjects: [],//查询结果
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
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProject界面是否显示
				//新增xmProject界面初始化数据
				addForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planIuserAt:'',planOuserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planIuserPrice:'',budgetOuserPrice:'',planOuserCnt:'',planIuserCnt:'',planWorkingHours:'',budgetCtrl:'0',
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProject界面初始化数据
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planIuserAt:'',planOuserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planIuserPrice:'',budgetOuserPrice:'',planOuserCnt:'',planIuserCnt:'',planWorkingHours:'',budgetCtrl:'0',
				},
				/**begin 自定义属性请在下面加 请加备注**/
				menukey: "all", 
				showInfo: false,
				selectProject: null,
				finishFlag: false,
				xmRecordVisible: false,
				productSelectVisible:false,
				maxTableHeight:300,
				dateRanger: [ ],  
				pickerOptions:  util.getPickerOptions('datarange'),
				xmProjectCopy:{
					id:'',name:'',code:'',isTpl:'',copyPhase:'1',copyTask:'1',copyGroup:'1',copyGroupUser:'0'
				},
				copyToVisible:false, 
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjects();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjects();
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
				this.getXmProjects();
			},
			searchXmProjects(){
				 this.pageInfo.count=true; 
				 this.getXmProjects();
			},
			//获取列表 XmProject xm_project
			getXmProjects() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
				};
				if(this.filters.key!==""){
					 params.key='%'+this.filters.key+'%';
				} 
				
				if(this.dateRanger&&this.dateRanger.length==2){
					 
				} 
				params.isTpl="1"
				this.load.list = true; 
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.finishFlag){
					params.status  = '4';
				}

				params = this.menuFilter(params);
				if(this.filters.productId){
					params.productId  = this.filters.productId
				} 
				params.createTimeStart=this.dateRanger[0]
				params.createTimeEnd=this.dateRanger[1]
				listXmProject(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						console.log(res.data);
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false; 
						this.xmProjects = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			menuFilter(params) {
				 
				return params;
			},

			//"隐藏结束的项目"按下触发
			setSearch() {
				this.getXmProjects();
			},

			//显示编辑界面 XmProject xm_project
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProject xm_project
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjects();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProject
			selsChange: function (sels) {
				this.sels = sels;
			},  
			handleDel: function (row,index) {  
				this.$prompt('将同步删除计划、组织、任务等，慎重起见，请输入项目代号:'+row.code, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					 if(value==row.code){
						 this.load.del=true;
						let params = { id: row.id };
						delXmProject(params).then((res) => {
							this.load.del=false;
							var tips=res.data.tips;
							if(tips.isOk){ 
								this.pageInfo.count=true;
								this.getXmProjects();
							}
							this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
						}).catch( err  => this.load.del=false ); 
					 }else{
						 this.$notify({position:'bottom-left',showClose:true,message: "项目代号不正确", type: 'error' }); 
					 }
				}).catch(() => { 
					return;    
				});
 
					
			},
			//批量删除xmProject
			batchDel: function () {
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProject(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjects(); 
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){ 
				this.editForm=row
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			onCopyToBtnClick(row){
				this.xmProjectCopy.id=row.id;
				this.xmProjectCopy.name=row.name+"(复制)";
				this.xmProjectCopy.isTpl=row.isTpl; 
				this.copyToVisible=true;
			},
			onCopyToConfirm(){ 
				if(!this.xmProjectCopy.code){
					this.$notify({position:'bottom-left',showClose:true,message: '项目代号不能为空', type: 'error' });
					return;
				}
				this.load.add=true;
				copyTo(this.xmProjectCopy).then(res=>{ 
					this.load.add=false;
					var tips = res.data.tips;
					if(tips.isOk){
						this.copyToVisible=false;
						if(this.xmProjectCopy.isTpl){
							this.searchXmProjects()
						}
						this.$emit("copy",res.data.data)
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

				})
			},
			/**begin 自定义函数请在下面加**/
			//是否负责人 是则true，否则false
			isLeader(leader) {
				return leader.some(i=>i.leadType=='负责人' && i.userid == this.userInfo.userid);
			},

			//进入info界面
			intoInfo(row) {
				this.selectProject = row;
				this.$router.push({ name:'XmProjectInfoRoute', params: row })
				//this.showInfo = true;
			},

			//筛选项目
			handleSelect(key, keyPath) {
				this.menukey = key;
				this.getXmProjects();
			},
			//修改项目状态
			statusChange(scope,val) {
				this.load.edit = true;
				let params = {
					id: scope.row.id,
					status: val,
				};
				editStatus(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.ScreenData[scope.$index].status = val;
						this.status = val;
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
					this.load.edit = false;
				}).catch( err => this.load.edut = false );
			},
			changeShowInfo() {
				this.xmProjects = [];
				this.getXmProjects();
				this.showInfo = false;
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
				if(row.bizFlowState=='1'){
					this.$notify.error("审核中，不允许重新发起");
					return;
				}
				
				let extVars={projectId:row.id}
				let jsonExtVars=JSON.stringify(extVars); 

				var currDomain=window.location.protocol+"//"+window.location.host;
				var fullPath=this.$route.fullPath;  
				var bizUrl=currDomain+'/'+process.env.CONTEXT+'/'+process.env.VERSION+'/#'+fullPath+'?extVars='+jsonExtVars
					
				var titleNames=row.name
				var mainTitle=''
				var mainContext=''


				if(bizKey=='xm_project_delete_approva'){
					if(row.status!='0'){
						this.$notify.error("只有状态为初始化的项目可以删除");
						return;
					}
					mainTitle='关于删除项目【'+titleNames+"】的审批"
					mainContext=mainTitle+',删除原因：';
				} else if(bizKey=='xm_project_over_approva'){
					if(row.status!='1'){
						this.$notify.error("只有状态为执行中的项目可以进行结项操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】结项的审批"
					mainContext=mainTitle;
					
				} else if(bizKey=='xm_project_restart_approva'){
					if(row.status!='3'){
						this.$notify.error("只有状态为暂停的项目可以进行重新启动操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】重新启动的审批"
					mainContext=mainTitle;
				} else if(bizKey=='xm_project_start_approva'){
					if(row.status!='0'){
						this.$notify.error("只有状态为初始化的项目可以进行立项审批操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】的立项审批"
					mainContext=mainTitle
				}  else if(bizKey=='xm_project_suspension_approva'){
					if(row.status!='1'){
						this.$notify.error("只有状态为执行中的项目可以进行挂起操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】暂停的审批"
					mainContext=mainTitle+'';
				} else if(bizKey=='xm_project_budget_change_approva'){
					if(row.status!='1'){
						this.$notify.error("只有状态为执行中的项目可以进行预算变更操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】的预算变更审批"
					mainContext=mainTitle+'';
				} else{
					this.$notify.error("暂不支持的业务审批");
					return;
				} 

				let params={ 
					mainContext:mainContext,
					mainTitle:mainTitle,
					bizKey:bizKey,
					bizUrl:bizUrl,
					restUrl:config.getXmBasePath()+"/xm/core/xmProject/processApprova",
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
						branchId:row.branchId,
						projectId:row.id
					},
				}
				let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
				this.$router.push({name:'ProcdefListForBizStart',params:jsonParmas}); 
			}, 
			handleCommand(command) { 
				if(command.type=='sendToProcessApprova'){
					this.sendToProcessApprova(command.row,command.bizKey);
				} else if(command.type=='showEdit'){
					this.showEdit(command.row,null);
				}
			},
			focusOrUnfocus:function(row){
				if(this.menukey=="myFocus"){
					delXmMyFocus({projectId:row.id,focusType:'project',userid:this.userInfo.userid,username:this.userInfo.username}).then(res=>{
						var tips=res.data.tips;
						if(tips.isOk){
							this.getXmProjects(); 
						} 
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
					})
				}else{
					addXmMyFocus({projectId:row.id,focusType:'project',projectName:row.name,userid:this.userInfo.userid,username:this.userInfo.username}).then(res=>{
						var tips=res.data.tips;
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
					})
				}
			},
			
			onProductSelected:function(product){
				this.filters.productId=product.id
				this.filters.productName=product.productName  
				this.getXmProjects()
				this.productSelectVisible=false;
			},
			onProductClose:function(){
				this.filters.productId=''
				this.filters.productName=''
				this.getXmProjects()
			}, 
			createProjectCode(){
				createProjectCode({}).then(res=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.xmProjectCopy.code=res.data.data
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
				})
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {   
		},
		mounted() { 
			if(this.$route.params){
				this.filters.productId=this.$route.params.productId;
				this.filters.productName=this.$route.params.productName;
			}
			this.$nextTick(() => {  
				
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);  
				this.showInfo = false;
				this.getXmProjects();
			}); 
		}, 
	}

</script>

<style scoped>
* >>> .sub-navbar{
	background: #fafbfc;
}
.changebtn{
	float: right;
	padding: 2px 10px;
	display: flex;
	align-items: center;
	line-height: 0;
	height: 100%;
}
.changebtn > button{
	padding: 0;
	border: 0;
	color: #333;
}
.changebtn >>> i::before{
	font-size:20px;
}
.changebtn-active{
	color: #409EFF !important;
}
.app-container{
	padding: 10px;
}
.el-menu-demo{
	border: 0 !important;
	height: 50px;
	padding-left: 10px;
	background-color: #fafbfc;
}
.el-menu-demo>.el-menu-item,
.el-menu-demo>.el-submenu >>> .el-submenu__title{
	height: 100%;
	line-height: 50px;
	color: #909399;
}
.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal>.el-submenu .el-submenu__title:hover{
	background-color: transparent;
}
.project-card{
	font-size: 12px;
	color: #999;
	margin: 10px 12px;
}
.project-card:hover{
	border-color: #00abfc;
}
.project-card >>> .el-card__body{
	padding: 20px 15px 10px;
}
.project-name{
	font-size: 16px;
	font-weight: 700;
	color: #333;
	height: 24px;
}
.project-id{
	margin-top: 4px;
	height: 18px;
}
.project-info{
	display: flex;
	margin-top: 8px;
}
.project-info>div{
	display: flex;
	flex-direction: column;
}
.info-item{
	width: 15%;
	text-align: center;
}
.info-item >>> span{
	display: block;
}
.item-total{
	font-size: 18px;
	color: #666;
}
.info-task{
	padding-left: 20px;
	width: 70%;
	border-left: 1px solid #efefef;
}
.finish-task{
	color: #00abfc !important;
}
.project-rate{
	margin: 15px 0;
}
.project-rate>.el-progress{
	display: flex;
	align-items: center;
}
.project-rate >>> .el-progress-bar{
	padding-right: 0;
	margin-right: 0;
}
.project-rate >>> .el-progress__text{
	margin-left: 5px;
}
.project-footer{
	display: flex;
}
.project-footer>div{
	width: 30%;
}
.project-footer>div:not(:first-child){
	width: 70%;
}
.project-period{
	text-align: right;
}
.see-more > i{
	background:#000;
}
/* 超过宽度则用...代替 */
.truncate{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
[v-cloak]{
	display: none;
}
.hidden-btn{
	margin-top: 5px;
	margin-bottom: 5px;
}
.right-btn{
	margin-top: 12px;
} 
@media only screen and (max-height: 2400px) {
	.project-box{
		max-height: 1600x;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 1200px) {
	.project-box{
		max-height: 800px;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 980px) {
	.project-box{
		max-height: 600px;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 640px) {
	.project-box{
		max-height: 300px;
		overflow-y: auto;
	}
}

.more-label-font{
	text-align:center;
	float:left;
	padding-top:5px;
}
</style>