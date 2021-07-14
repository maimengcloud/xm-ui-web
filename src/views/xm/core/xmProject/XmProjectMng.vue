<template>
	<section>
		<el-row>
			<el-menu  active-text-color="#00abfc" :default-active="menukey"   mode="horizontal" @select="handleSelect">
				<el-menu-item index="all">全部</el-menu-item>
				<el-menu-item index="compete">我参与</el-menu-item>
				<el-menu-item index="leader">我管理</el-menu-item>
				<el-menu-item index="moniter">我监控</el-menu-item>
				<el-menu-item index="approver">我审核</el-menu-item>
				<el-menu-item index="create">我创建</el-menu-item>
				<el-menu-item index="myFocus">我关注</el-menu-item>
				<el-menu-item index="myExecuserStatus0">我排队</el-menu-item>
				<el-menu-item index="myExecuserStatus1">我执行</el-menu-item>
				<el-menu-item index="myExecuserStatus2">我提交验收</el-menu-item>
				<el-menu-item class="hidden-md-and-down" index="myExecuserStatus3">我验收成功</el-menu-item>
				<el-menu-item class="hidden-md-and-down" index="myExecuserStatus4">我验收失败</el-menu-item>
				<el-menu-item class="hidden-md-and-down" index="myExecuserStatus5">我付款中</el-menu-item>
				<el-menu-item class="hidden-lg-and-down" index="myExecuserStatus6">我付款成功</el-menu-item>
				<el-menu-item class="hidden-lg-and-down" index="myExecuserStatus7">我放弃</el-menu-item>
				<!-- <el-submenu index="7">
					<template slot="title">更多筛选</template>
					<el-menu-item index="7-1">选项1</el-menu-item>
					<el-menu-item index="7-2">选项2</el-menu-item>
					<el-menu-item index="7-3">选项3</el-menu-item>
				</el-submenu> -->
				<el-popover
					placement="top-start"
					title="更多查询条件或操作"
					width="400"
					trigger="click" >
					<el-row>
						<el-col :span="24" style="padding-top:5px;">
							<el-checkbox  v-model="finishFlag">只查未结束项目</el-checkbox>
						</el-col>
						<el-col  :span="24"  style="padding-top:5px;">
							<font v-if="filters.productId" class="more-label-font">产品:</font>  <el-tag v-if="filters.productId" closable @close="onProductClose">{{filters.productName}}</el-tag><el-button v-else    @click.native="productSelectVisible=true" size="mini">选择产品</el-button>
						</el-col>
						<el-col  :span="24"  style="padding-top:5px;"> 
							<el-checkbox  v-model="showType" false-label="false" true-label="true">直观展示</el-checkbox>
						</el-col>  
						<el-col  :span="24"  style="padding-top:5px; ">
							<el-button size="mini" class="hidden-lg-and-up hidden-btn"  style="margin-left:10px;"  @click="handleSelect('myExecuserStatus3')">我验收成功</el-button>
							<el-button size="mini" class="hidden-lg-and-up hidden-btn"    @click="handleSelect('myExecuserStatus4')">我验收失败</el-button>
							<el-button size="mini" class="hidden-lg-and-up hidden-btn"   @click="handleSelect('myExecuserStatus5')">我付款中</el-button>
							<el-button size="mini" class="hidden-xl-and-up hidden-btn"    @click="handleSelect('myExecuserStatus6')">我付款成功</el-button>
							<el-button size="mini" class="hidden-xl-and-up hidden-btn"    @click="handleSelect('myExecuserStatus7')">我放弃</el-button>
						</el-col> 
								 
						<el-col  :span="24"  style="padding-top:5px;">
							<font class="more-label-font">创建时间:</font>  
							<el-date-picker
								v-model="dateRanger" 
								type="daterange"
								align="right"
								unlink-panels
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="完成日期"
								value-format="yyyy-MM-dd"
								:default-time="['00:00:00','23:59:59']"
								:picker-options="pickerOptions"
							></el-date-picker>   
						</el-col>  
						<el-col :span="24" style="padding-top:5px;">
							<el-button size="mini" type="primary" icon="el-icon-search" @click="searchXmProjects">查询</el-button>
						</el-col>
					</el-row>
					<el-button type="text" class="right-btn" slot="reference" icon="el-icon-d-arrow-right"></el-button>
				</el-popover>
			</el-menu>
			 
		</el-row> 
		<el-row  class="app-container"> 
			<!--列表 XmProject xm_project-->
			<el-row v-show="showType" v-loading="load.list" class="project-box">
				<el-col  v-cloak v-for="(p,i) in ScreenData" :key="i" :xl="4" :lg="6" :md="8" :sm="12">
					<el-card @click.native="intoInfo(p,i)" class="project-card" shadow="always">
						<div class="project-name" title="这是项目名称">{{p.name}}</div>
						<div class="project-id eui-text-truncate">{{p.code}}</div>
						<div class="project-info">
							<div class="info-item">
								<span class="item-total">{{p.totalBugCnt==null?0:p.totalBugCnt}}</span>
								<span class="item-type">缺陷</span>
							</div>
							<div class="info-item">
								<span class="item-total">{{p.totalFileCnt==null?0:p.totalFileCnt}}</span>
								<span class="item-type">文档</span>
							</div>
							<div class="info-task">
								<span>
									<span class="item-total finish-task">{{p.totalCompleteTaskCnt==null?0:p.totalCompleteTaskCnt}}</span>
									<span style="margin: 0 .25rem !important;">/</span>
									<span class="item-type total-task">{{p.totalTaskCnt==null?0:p.totalTaskCnt}}</span>
								</span>
								<span class="item-type">任务完成</span>
							</div>
						</div>
						<div class="project-rate">
							<el-progress :percentage="(p.totalProgress==null?0:p.totalProgress)"></el-progress>
						</div>
						<div class="project-footer">
							<div class="project-type">{{p.xmType}}</div>
							<div class="project-period">{{p.startTime.substr(0,10)}} ~{{p.endTime.substr(0,10)}}</div>
						</div>
					</el-card>
				</el-col>
			</el-row>

			<el-table ref="table" v-cloak v-show="!showType" stripe :data="ScreenData" @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column prop="code" label="项目编号" min-width="120" ></el-table-column>
				<el-table-column prop="name" label="标题" min-width="200" >
					<template slot-scope="scope">
						<el-link @click.stop="intoInfo(scope.row)">{{scope.row.name}}</el-link>
					</template>
				</el-table-column> 
				<el-table-column prop="totalTaskCnt" label="任务数" min-width="80" ></el-table-column>
				<el-table-column prop="totalCompleteTaskCnt" label="任务完成" min-width="80" ></el-table-column>
				<el-table-column prop="totalFileCnt" label="文档" min-width="80" ></el-table-column>
				<el-table-column prop="totalBugCnt" label="缺陷" min-width="80" ></el-table-column>
				<el-table-column label="进度" min-width="80" >
					<template slot-scope="scope">
						{{scope.row.totalProgress}}%
					</template>
				</el-table-column>
				<el-table-column prop="startTime" label="起止时间" min-width="150" >
					<template slot-scope="scope">
						{{scope.row.startTime? scope.row.startTime.substr(0,10) : ""}}~{{scope.row.endTime? scope.row.endTime.substr(0,10) : ""}}
					</template>
				</el-table-column>
				<el-table-column prop="bizFlowState" label="审批状态" min-width="80" >
					<template slot-scope="scope">
						<el-tooltip  v-if="scope.row.flowState!='' && scope.row.flowState!=null" :content="showApprovaInfo(scope.row)" placement="bottom" effect="light">
						<el-tag v-if="scope.row.flowState=='0' || scope.row.flowState==null ">未发审</el-tag> 
						<el-tag v-else-if="scope.row.flowState=='1'">审核中</el-tag> 
						<el-tag v-else-if="scope.row.flowState=='2'">已通过</el-tag>
						<el-tag v-else-if="scope.row.flowState=='3'">未通过</el-tag>
						<el-tag v-else-if="scope.row.flowState=='4'">已取消</el-tag> 
						</el-tooltip> 
					</template>
				</el-table-column>
				<el-table-column label="操作" width="245" fixed="right">
					<template slot-scope="scope">
						<!-- <el-popover
							placement="left"
							trigger="hover"> -->
							
							<el-button-group> 
								<el-button v-if="menukey=='myFocus'" size="mini" type="primary" @click.stop="focusOrUnfocus(scope.row)" >取消关注</el-button> 
								<el-button v-else size="mini" type="primary" @click.stop="focusOrUnfocus(scope.row)" >关注</el-button>  
								<el-button   size="mini" type="primary" @click.stop="xmRecordVisible=true" >日志</el-button> 
								<!-- 
								<el-button size="mini" type="primary" @click.stop="statusChange(scope,'1')" v-if="scope.row.status==0 || scope.row.status == 2">提交审核</el-button>
								<el-button size="mini" type="primary" @click.stop="statusChange(scope,'3')" v-if="scope.row.status==1">批准</el-button>
								<el-button size="mini" type="primary" @click.stop="statusChange(scope,'2')" v-if="scope.row.status==1">退回</el-button>
								<el-button size="mini" type="primary" @click.stop="statusChange(scope,'4')" v-if="scope.row.status==3">结束</el-button>
								<el-button size="mini" type="primary" @click.stop="statusChange(scope,'3')" v-if="scope.row.status==4">重新启动</el-button>
								<el-button size="mini" type="primary" @click.stop="handleDel(scope.row,scope.$index)" v-if="isLeader(scope.row.leader)">删除</el-button>
								-->
							</el-button-group>
							
							<el-dropdown @command="handleCommand" :hide-on-click="false">
								<span class="el-dropdown-link">
									更多<i class="el-icon-arrow-down el-icon--right"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_start_approva'}">立项发审(审核通过后起效)</el-dropdown-item> 
									<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_delete_approva'}">删除发审(审核通过后删除)</el-dropdown-item> 
									<el-dropdown-item icon="el-icon-success"   :command="{type:'showEdit',row:scope.row,bizKey:'xm_project_baseinfo_change_approva'}">基础信息变更发审(审核通过后生效)</el-dropdown-item> 
									<el-dropdown-item icon="el-icon-success"   :command="{type:'showEdit',row:scope.row,bizKey:'xm_project_budget_change_approva'}">预算变更发审(审核通过后生效)</el-dropdown-item> 
									<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_over_approva'}">项目结项发审(审核通过后生效)</el-dropdown-item> 
									<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_suspension_approva'}">项目暂停发审(审核通过后生效)</el-dropdown-item> 
									<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_restart_approva'}">项目重新启动发审(审核通过后生效)</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown> 
							<!-- <el-button style="width:100%;" slot="reference" class="see-more" type="text" icon="el-icon-more"></el-button>
						</el-popover> -->
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-show="!showType" layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row>
		<el-drawer title="项目编辑" :visible.sync="editFormVisible"  size="50%"  :close-on-click-modal="false" append-to-body>
			<xm-project-edit :sel-project="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-edit>
		</el-drawer>
		<el-drawer :title="selectProject==null?'项目明细':selectProject.name" center :fullscreen="true" :visible.sync="showInfo"  size="50%"  :close-on-click-modal="false" append-to-body>
			<xm-project-info :sel-project="selectProject" :visible="showInfo" @changeShowInfo="changeShowInfo" @submit="changeShowInfo"></xm-project-info>
		</el-drawer>
		
		<el-drawer v-if="selectProject" :title="selectProject==null?'操作日志':selectProject.name+'操作日志'" center   :visible.sync="xmRecordVisible"  size="50%"  :close-on-click-modal="false" append-to-body>
			<xm-record :obj-type="'project'" :project-id="selectProject.id"  :visible="xmRecordVisible" :simple="1"></xm-record>
		</el-drawer>
		
		<el-drawer
			append-to-body
			title="产品"
			:visible.sync="productSelectVisible"
			width="80%">
			<xm-product-mng :is-select-product="true" @selected="onProductSelected"></xm-product-mng> 
		</el-drawer>
	</section> 

</template>

<script>
	import Vue from 'vue'
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import config from "@/common/config"; //全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProject, editStatus, delXmProject, batchDelXmProject } from '@/api/xm/core/xmProject'; 
	import { addXmMyFocus , delXmMyFocus } from '@/api/xm/core/xmMyFocus';
	import  XmProjectAdd from './XmProjectAdd';//新增界面
	import  XmProjectEdit from './XmProjectEdit';//修改界面
	import { mapGetters } from 'vuex'
	import xmTaskMng from '../xmTask/XmTaskMng'; 
	import xmProjectInfo from './XmProjectInfo'; 
	import XmProductMng from '../xmProduct/XmProductSelect';

	if(!Vue.component("xm-project-info")){
		
		Vue.component('xm-project-info',xmProjectInfo)
		Vue.use(xmProjectInfo);
	}
	


	export default { 
		props:['dataScope'],
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
			"showType": function(val){
				console.log("shotType_change");
				//this.xmProjects = [];
				//this.getXmProjects();
			},
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
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProject界面是否显示
				//新增xmProject界面初始化数据
				addForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planInnerUserAt:'',planOutUserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planInnerUserPrice:'',budgetOutUserPrice:'',planOutUserCnt:'',planInnerUserCnt:'',planWorkingHours:'',budgetCtrl:'0',
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProject界面初始化数据
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planInnerUserAt:'',planOutUserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planInnerUserPrice:'',budgetOutUserPrice:'',planOutUserCnt:'',planInnerUserCnt:'',planWorkingHours:'',budgetCtrl:'0',
				},
				/**begin 自定义属性请在下面加 请加备注**/
				menukey: "all",
				showType: true,
				showInfo: false,
				selectProject: null,
				finishFlag: false,
				xmRecordVisible: false,
				productSelectVisible:false,
				tableHeight:300,
				dateRanger: [
					util.formatDate.format(beginDate, "yyyy-MM-dd"),
					util.formatDate.format(endDate, "yyyy-MM-dd")
				],  
				pickerOptions:  util.pickerOptions('datarange'),
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
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				
				if(!this.dateRanger || this.dateRanger.length==0){
					this.$message({showClose: true, message: "创建日期范围不能为空", type: 'error' });
					return;
				} 
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
				params.createTimeStart=this.dateRanger[0]+" 00:00:00"
				params.createTimeEnd=this.dateRanger[1]+" 23:59:59"
				listXmProject(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						console.log(res.data);
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false; 
						this.xmProjects = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			menuFilter(params) {
				const key = this.menukey;
				const userid = this.userInfo.userid;
				if( this.dataScope=='all' && key == "compete"){ 
						params.compete = userid;  
				}else if( this.dataScope!='all' && (key == "compete" || key=="all")){
						params.compete = userid; 
				} else if(key == "leader"){ //负责人
					params.pgTypeIds=['nbxmjl']
					params.userid=userid
				}
				else if(key == "moniter"){ //监控人
					params.pgTypeIds=['yyz','xmzl']
					params.userid=userid
				}
				else if(key == "approver"){ //审批人
					params.pgTypeIds=['nbxmjl','xmzk','nbldz']
					params.userid=userid
				}
				else if(key == "create"){
					params.createUserid = userid;
				}else if(key=="myFocus"){
					params.myFocus="1"
					params.userid=userid
				}else if(key.indexOf("myExecuserStatus")>=0){
					params.userid=userid
					params.myExecuserStatus=key.substring("myExecuserStatus".length)
				}
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
			//删除xmProject
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmProject(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProjects();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
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
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				const that = this;
				//that.intoInfo(row.id);
				// this.$emit('row-click',row, event, column);//  @row-click="rowClick"
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
					this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
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
					this.$message.error("审核中，不允许重新发起");
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
						this.$message.error("只有状态为初始化的项目可以删除");
						return;
					}
					mainTitle='关于删除项目【'+titleNames+"】的审批"
					mainContext=mainTitle+',删除原因：';
				} else if(bizKey=='xm_project_over_approva'){
					if(row.status!='1'){
						this.$message.error("只有状态为执行中的项目可以进行结项操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】结项的审批"
					mainContext=mainTitle;
					
				} else if(bizKey=='xm_project_restart_approva'){
					if(row.status!='3'){
						this.$message.error("只有状态为暂停的项目可以进行重新启动操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】重新启动的审批"
					mainContext=mainTitle;
				} else if(bizKey=='xm_project_start_approva'){
					if(row.status!='0'){
						this.$message.error("只有状态为初始化的项目可以进行立项审批操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】的立项审批"
					mainContext=mainTitle
				}  else if(bizKey=='xm_project_suspension_approva'){
					if(row.status!='1'){
						this.$message.error("只有状态为执行中的项目可以进行挂起操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】暂停的审批"
					mainContext=mainTitle+'';
				} else if(bizKey=='xm_project_budget_change_approva'){
					if(row.status!='1'){
						this.$message.error("只有状态为执行中的项目可以进行预算变更操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】的预算变更审批"
					mainContext=mainTitle+'';
				} else{
					this.$message.error("暂不支持的业务审批");
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
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					})
				}else{
					addXmMyFocus({projectId:row.id,focusType:'project',projectName:row.name,userid:this.userInfo.userid,username:this.userInfo.username}).then(res=>{
						var tips=res.data.tips;
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
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
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-project-add':XmProjectAdd,
		    'xm-project-edit':XmProjectEdit,
			
			XmProductMng,
			xmTaskMng
		    //在下面添加其它组件
		},
		mounted() { 
			if(this.$route.params){
				this.filters.productId=this.$route.params.productId;
				this.filters.productName=this.$route.params.productName;
			}
			this.$nextTick(() => {
				var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=50/1000 * window.innerHeight; 
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight; 
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