<template>
	<section>
		
				<sticky  :className="'sub-navbar draft'">  
						<el-radio v-model="filters.flowState" label="0">未发审</el-radio>
						<el-radio v-model="filters.flowState" label="1">审核中</el-radio> 
  						<el-radio v-model="filters.flowState" label="5">审核结束</el-radio>
						<el-input   v-model="filters.key"  placeholder="模糊查询" style="width:15%;"></el-input> 
					  	<el-button     v-on:click="searchFormDatas" >查询</el-button> 
						  
						<el-button   @click.native="userSelectVisible=true" >创建人</el-button>  
						<el-button   @click.native="showTagSelect(false)"  >标签查找</el-button>
						<el-button   @click.native="showTagSelect(true)"  >打标签</el-button>
						<el-button   type="primary"    @click="showAdd">新增数据</el-button>  
						<el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
							导出数据
						</el-button>
				</sticky> 
				
				<el-row class="filters-show">
					<font class="filters-label">已选条件:</font>  
					<el-date-picker
						v-model="filters.createTimeRanger" class="hidden-sm-and-down"
						type="daterange"
						align="right"
						unlink-panels
						range-separator="至"
						start-placeholder="创建日期"
						end-placeholder="创建日期" 
						value-format="yyyy-MM-dd"
						:default-time="['00:00:00','23:59:59']"
						:picker-options="pickerOptions">
					</el-date-picker>  
					<el-tag  v-if="filters.tags"
						:key="tag.tagId"
						v-for="tag in filters.tags"
						:type="''"
						closable
						:disable-transitions="false"
						@close="handleFiltersTagClose(tag,'tags')">
						{{tag.tagName}}
					</el-tag>
					<el-tag v-if="filters.deptTreeNodes"
						:key="tag.deptid"
						v-for="tag in filters.deptTreeNodes"
						:type="'info'"
						closable
						:disable-transitions="false"
						@close="handleFiltersTagClose(tag,'deptTreeNodes')">
						{{tag.deptName}}
					</el-tag> 
					<el-tag v-if="filters.users"
						:type="'warning'"
						closable 
						:key="tag.userid"
						v-for="tag in filters.users"
						@close="handleFiltersTagClose(tag,'users')"
						:disable-transitions="false" >
						{{tag.username}}
					</el-tag>
					<el-tag v-if="filters.cusers"
						:type="'warning'"
						closable 
						:key="tag.userid"
						v-for="tag in filters.cusers"
						@close="handleFiltersTagClose(tag,'cusers')"
						:disable-transitions="false" >
						{{tag.username}}
					</el-tag>  
					<el-tag v-if="filters.key"
						:type="'success'"
						closable
						:disable-transitions="false" 
						@close="handleFiltersTagClose('','key')">
						{{filters.key}}
					</el-tag>   
					<el-tag v-if="filters.flowState"
						:type="'success'" 
						:disable-transitions="false" 
						closable 
						@close="handleFiltersTagClose('','flowState')">
						{{filters.flowState=='1'?'审核中':(filters.flowState=='0'?'未发审':(filters.flowState=='5'?'审核结束':''))}}
					</el-tag>   
					
					<el-tag 
						:type="'success'" 
						:disable-transitions="false" 
						closable
						@click="handleFiltersTagClose(showCalendar,'calendar')" 
						@close="handleFiltersTagClose(showCalendar,'calendar')">
						{{showCalendar==true?'切换列表':'切换日历'}}
					</el-tag>   
				</el-row>
				<el-row class="app-container">
					<el-col :xs="4" :sm="4" :md="3" :lg="3" :xl="3" class="hidden-sm-and-down">
						<dept-tree ref="deptTree" show-root default-expand-all multiple show-checkbox :expand-on-click-node="false" v-on:check-change="handleDeptTreeCheckChange"></dept-tree> 
					</el-col>
					<el-col v-if="showCalendar==false" :xs="24" :sm="24" :md="21" :lg="21" :xl="21">  
						<el-table  ref="formDataTable" :data="formDatas"    highlight-current-row v-loading="listLoading" border @selection-change="selsChange" style="width: 100%;">
						<el-table-column type="selection" width="40"  ></el-table-column>
						<el-table-column type="index" width="40"></el-table-column> 
						<el-table-column sortable prop="deptName" label="创建部门"  min-width="80"  :formatter="formatterDept"></el-table-column>
						<el-table-column sortable prop="cusername" label="创建人"  min-width="80"  :formatter="formatterUserid"></el-table-column>
						<el-table-column sortable prop="tagNames" label="标签"  min-width="100" >
							<template slot-scope="scope">
								<el-tag v-for="tagName in (scope.row.tagNames?scope.row.tagNames.split(','):[])" :key="tagName">{{tagName}}</el-tag>
							</template>
						</el-table-column> 
						<el-table-column sortable prop="flowState" label="状态"  min-width="100" >
							<template slot-scope="scope">
								<el-tag type="info" v-if="scope.row.flowState=='0'">未发审</el-tag>
								<el-tag v-else-if="scope.row.flowState=='1'">审核中</el-tag>
								<el-tag type="success" v-else-if="scope.row.flowState=='2'">已通过</el-tag>
								<el-tag type="danger" v-else-if="scope.row.flowState=='3'">未通过</el-tag>
								<el-tag type="warning" v-else-if="scope.row.flowState=='4'">取消</el-tag>
							</template>
						</el-table-column> 
						<el-table-column sortable v-for="(item,index) in formFields " :prop="item.fieldId" :label="item.fieldTitle" min-width="80"  :key="item.fieldId+index+'_'" :formatter="formatterFormFields"></el-table-column> 
						
						<el-table-column sortable prop="lastTime" label="更新时间"  min-width="80" ></el-table-column> 
						<el-table-column sortable prop="userid" label="最后更新人"  min-width="80"  :formatter="formatterUserid"></el-table-column>
						<el-table-column sortable prop="createTime" label="创建时间"  min-width="80" ></el-table-column>  
						<el-table-column label="操作" min-width="250"  fixed="right">
							<template slot-scope="scope"> 
								<el-button type="primary" v-if="scope.row.flowState!='0'"  @click="showFlowInfo(scope.row,scope.$index)">流程</el-button>
								<el-button type="primary" v-if="scope.row.flowState=='0'"   @click="sendToProcessApprova(scope.row,scope.$index)">发审</el-button>
								<el-button   @click="showEdit( scope.row,scope.$index)">改</el-button>
								<el-button type="danger"   @click="handleDel(scope.row,scope.$index)">删</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination    layout="total, sizes, prev, pager, next"  @current-change="handleCurrentChange" @size-change="handleSizeChange"  :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
							</el-pagination> 
					</el-col>
					<el-col v-if="showCalendar==true"  :xs="24" :sm="24" :md="21" :lg="21" :xl="21">  
						<el-calendar v-loading="listLoading">
							<!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
							<template
								slot="dateCell"
								scope="{date, data}">
								<div :class="data.isSelected ? 'is-selected' : ''">
									<div class="calendar-cell-data"> {{ data.day.split('-')[2] }}{{ data.isSelected ? '✔️' : ''}}
										<div  v-for=" (i,index)  in  showCalendarDataTips(date,data)"  :key="index">  
											<el-popover
											placement="right" 
											trigger="hover">
											<el-row>
												<el-col>
													<el-tag v-for=" tag in i.tags" :key="tag.id">{{tag.tagName+'('+tag.count+')'}}</el-tag>
												</el-col>
											</el-row>
											<el-table :data="i.allDatas"  max-height="450px" max-width="450px">  
												<el-table-column type="index" width="40"></el-table-column> 
												<el-table-column sortable prop="deptName" label="创建部门"  min-width="80"  :formatter="formatterDept"></el-table-column>
												<el-table-column sortable prop="cusername" label="创建人"  min-width="80"  :formatter="formatterUserid"></el-table-column>
												<el-table-column sortable prop="tagNames" label="标签"  min-width="100" >
													<template slot-scope="scope">
														<el-tag v-for="tagName in (scope.row.tagNames?scope.row.tagNames.split(','):[])" :key="tagName">{{tagName}}</el-tag>
													</template>
												</el-table-column> 
												<el-table-column sortable prop="flowState" label="状态"  min-width="100" >
													<template slot-scope="scope">
														<el-tag type="info" v-if="scope.row.flowState=='0'">未发审</el-tag>
														<el-tag v-else-if="scope.row.flowState=='1'">审核中</el-tag>
														<el-tag type="success" v-else-if="scope.row.flowState=='2'">已通过</el-tag>
														<el-tag type="danger" v-else-if="scope.row.flowState=='3'">未通过</el-tag>
														<el-tag type="warning" v-else-if="scope.row.flowState=='4'">取消</el-tag>
													</template>
												</el-table-column> 
												<el-table-column sortable v-for="(item ,index) in formFields " :prop="item.fieldId" :label="item.fieldTitle" min-width="80"  :key="item.fieldId+index" :formatter="formatterFormFields"></el-table-column> 
												
												<el-table-column sortable prop="lastTime" label="更新时间"  min-width="80" ></el-table-column> 
												<el-table-column sortable prop="userid" label="最后更新人"  min-width="80"  :formatter="formatterUserid"></el-table-column>
												<el-table-column sortable prop="createTime" label="创建时间"  min-width="80" ></el-table-column> 
												<el-table-column label="操作" min-width="280"   fixed="right">
													<template slot-scope="scope"> 
														<el-button type="primary" v-if="scope.row.flowState!='0'"  @click="showFlowInfo(scope.row,scope.$index)">流程</el-button>
														<el-button type="primary" v-if="scope.row.flowState=='0'"   @click="sendToProcessApprova(scope.row,scope.$index)">发审</el-button>
														<el-button   @click="showEdit( scope.row,scope.$index)">改</el-button>
														<el-button type="danger"   @click="handleDel(scope.row,scope.$index)">删</el-button>
													</template>
												</el-table-column>
											</el-table> 
											<div slot="reference">
												<el-tag effect="dark" type="info" v-if="i.createDatasCount>0">{{'创建:'+i.createDatasCount}}</el-tag>  
												<el-tag effect="dark" type="warning" v-if="i.lastUpdateDatasCount>0">{{'更新:'+i.lastUpdateDatasCount}}</el-tag>  
												<el-tag effect="dark" type="warning" v-if="i.nullTimeDatasCount>0">{{'空时间:'+i.nullTimeDatasCount}}</el-tag>  
											</div>
										</el-popover> 
										</div>
									</div>
								</div>
							</template>
							</el-calendar>
					</el-col>
				</el-row>
			<!--编辑 FormData 表单数据表界面-->
			<el-dialog title="编辑" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false" append-to-body>
				  <form-data-edit :form-data="editForm" :form-def="formDefSelected" :form-fields="formFields" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></form-data-edit>
			</el-dialog>
	
			<!--新增 FormData 表单数据表界面-->
			<el-dialog title="新增" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false" append-to-body>
				<form-data-add :form-data="addForm" :form-def="formDefSelected" :form-fields="formFields"  :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></form-data-add>
			</el-dialog> 
			
			<el-dialog append-to-body
				title="选择创建人"
				:visible.sync="userSelectVisible"
				width="60%">  
				<users-select :select-userids="filters.cusers?filters.cusers.map(i=>i.userid):[]"   @confirm="onUserSelected"></users-select> 
			</el-dialog> 
			<el-dialog append-to-body
				title="标签条件"
				:visible.sync="tagSelectVisible" class="dialog-body"
				width="60%"> 
				<tag-mng :tagIds="filters.tags?filters.tags.map(i=>i.tagId):[]"  :jump="true" @select-confirm="onTagSelected"></tag-mng> 
			</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库

	import config from '@/common/config';//全局公共库
	import { listOption,listOptionByItemIds } from '@/api/itemOption';//下拉框数据查询
	import { listFormData, delFormData, batchDelFormData } from '@/api/mdp/form/formData';
	import { listFormField} from '@/api/mdp/form/formField';
	import { batchInsertOrDeleteTags } from '@/api/mdp/form/formDataTag';
	import  FormDataAdd from './FormDataAdd';//新增界面
	import  FormDataEdit from './FormDataEdit';//修改界面
	import  FormDefList from '../formDef/FormDefList';//表单定义查询列表
	import Sticky from '@/components/Sticky' // 粘性header组件
	import { listUser } from '@/api/mdp/sys/user';//下拉框数据查询
	import { listDept } from '@/api/mdp/sys/dept';//下拉框数据查询
	import { mapGetters } from 'vuex'
	import { listFormQx } from '@/api/mdp/form/formQx';
	import TagMng from '@/views/mdp/arc/tag/TagMng';  
	
	import  CategoryTree from '@/views/mdp/arc/category/CategoryTree';//修改界面
	import UsersSelect from '@/views/mdp/sys/user/UsersSelect'; 
	import DeptTree from '@/views/mdp/sys/dept/DeptTree.vue'; 

	export default { 
		name:'FormDataMng',
		watch: {
		      
		    },	
	    computed: {
		    ...mapGetters([
		      'userInfo','myDepts'
		    ]) 
		},
		activated:function(){
			this.filters.deptid=this.userInfo.deptid   
			var formDefSelected={id:this.$route.query.formId,formName:this.$route.query.formName}
			
			this.filters.cusers=[{userid:this.userInfo.userid,username:this.userInfo.username}]
			if(this.formDefSelected && this.formDefSelected.id==formDefSelected.id && this.formFields.length>0){
				this.searchFormDatas();
			}else{
				this.formDefRowClick(formDefSelected);
			}
			
		},
		data() {
			const fromStartTime = new Date();
			const toStartTime = new Date();
			fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
			return {
				filters: {
					key: '',
					deptTreeNodes:[], 
					tags:[], 
					users:null,//更新人
					cusers:null,//创建人
					createTimeRanger:[util.formatDate.format(fromStartTime,'yyyy-MM-dd'),util.formatDate.format(toStartTime,'yyyy-MM-dd')], 
					flowState:'',//审核状态 0 未审核 1审核中 2 审核结束
				},  
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
						}
					},{
						text: '最近两周',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 *2);
						picker.$emit('pick', [start, end]);
						}
					},{
						text: '最近三周',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 *3);
						picker.$emit('pick', [start, end]);
						}
					},{
						text: '最近四周',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 *4);
						picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
						}
					}]
					},
				showMoreFilters: false, 
				formDatas: [],//查询结果 
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[],//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
					count:true,
				} ,
				listLoading: false,//查询中...
				sels: [],//列表选中数据 
				options2:{},//下拉选择框的所有静态数据 options.sex,options.project
				
				addFormVisible: false,//新增formData界面是否显示
				//新增formData界面初始化数据
				addForm: {
					id:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',attachmentUrls:'',attachmentNames:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑formData界面初始化数据
				editForm: {
					id:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',attachmentUrls:'',attachmentNames:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				formDefSelected:null,
				formFields:[],
				myCompanyEmployees:[],
				myCompanyDepts:[], 
				formQx: null ,
				 tagSelectVisible:false,
				 isBatchSetTags:false,
				 showCalendar:false,
				userSelectVisible:false,
				downloadLoading:false,
					/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			//获取代码对应的名称 用于数据反显 如 getCodeName(options.sex,'1');
			getCodeName(options,codeValue){
				if(!options)return codeValue;
				let code=options.filter(i=>i.codeValue==codeValue);
				if(code.length>0){
					return code[0].codeName
				}else{
					return codeValue
				} 
			},
			
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.total=0;
				 this.pageInfo.count=true;
				this.pageInfo.pageNum=1;
				this.getFormDatas();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getFormDatas();
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
				this.getFormDatas();
			},
			searchFormDatas(){ 
					 this.pageInfo.pageNum=1;
					 this.pageInfo.total=0;
					 this.getFormDatas(); 
			},
 
			//不嵌入工作流时 调用该查询 获取列表 FormData 表单数据表
			getFormDatas() {
				
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					params.orderFields=this.pageInfo.orderFields;
					params.orderDirs=this.pageInfo.orderDirs;
				}
				if(this.filters.extVars!=null){
					params.ids=this.filters.extVars.ids
					params.formId=this.filters.extVars.formId
				} else{
					
					if(this.formDefSelected==null){
						this.$message({ message: '请先选择表单', type: 'info' });
						return;
					}
					
					params.formId=this.formDefSelected.id;
				}
				if(this.filters.key!==""){
					params.key='%'+this.filters.key+'%'
				}  
				if(this.filters.deptTreeNodes!=null && this.filters.deptTreeNodes.length>0){
					params.deptids=this.filters.deptTreeNodes.map(i=>i.deptid)
				}
				
				if(this.filters.cusers!=null && this.filters.cusers.length>0){
					params.cuserids=this.filters.cusers.map(i=>i.userid)
				}  
				if(this.filters.users!=null && this.filters.users.length>0){
					params.userids=this.filters.users.map(i=>i.userid)
				}  
				if(this.filters.tags!=null && this.filters.tags.length>0){
					params.tagIds=this.filters.tags.map(i=>i.tagId)
				}
				
				if(this.filters.createTimeRanger!=null && this.filters.createTimeRanger.length==2){
					params.fromStartTime=this.filters.createTimeRanger[0]+" 00:00:00"
					params.toStartTime=this.filters.createTimeRanger[1]+" 23:59:59"
				}
				
				let tips=this.checkFormQueryQx(this.formQx,params.userid,params.deptid,this.userInfo.userid,this.userInfo.deptid,this.userInfo.roleid)
				if(tips.isOk==false){
					this.$message({ message: tips.msg, type: 'error' });
					return;
				}
				
				if(this.filters.flowState=='1'){
					params.procInstId=this.procInstId
					params.flowState=this.filters.flowState
				}else if(this.filters.flowState=='0'){
					params.flowState=this.filters.flowState
				}else if(this.filters.flowState=='2'){
					params.procInstId=this.procInstId
					params.flowState=this.filters.flowState
				}else if(this.filters.flowState=='5'){
					params.procInstId=this.procInstId
					params.flowStates=['2','3','4']
				}
				this.listLoading = true;
				listFormData(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count = false;
						this.formDatas = res.data.data 
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					
				});
			},

			//显示编辑界面 FormData 表单数据表
			showEdit: function ( row,index ) {
				let tips=this.checkFormEditQx(this.formQx,row.userid,row.deptid,this.userInfo.userid,this.userInfo.deptid,this.userInfo.roleid)
				if(tips.isOk==false){
					this.$message({ message: tips.msg, type: 'error' });
					return;
				}
				this.editFormVisible = true;
				this.editForm =row;
			},
			//显示新增界面 FormData 表单数据表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			}, 
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.total=0;
				this.getFormDatas();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行formData
			selsChange: function (sels) {
				this.sels = sels;
			},  
			//删除formData
			handleDel: function (row,index) {
				if(row.flowState=='1'){
					this.$message({ message: '数据审核中，不允许删除', type: 'error' });
					return;
				}
				if(row.flowState=='2'){
					this.$message({ message: '数据已审核通过，不允许删除', type: 'error' });
					return;
				}
				let tips=this.checkFormDelQx(this.formQx,row.userid,row.deptid,this.userInfo.userid,this.userInfo.deptid,this.userInfo.roleid)
				if(tips.isOk==false){
					this.$message({ message: tips.msg, type: 'error' });
					return;
				}
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = { id: row.id };
					delFormData(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.total=0;
							this.getFormDatas();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false;
					 
				});
			},
			//批量删除formData
			batchDel: function () {
				var ids = this.sels.map(item => item.id);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					batchDelFormData(ids).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.total=0;
							this.getFormDatas(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.listLoading = false;
					 
				});
			},
			/**begin 自定义函数请在下面加**/
			formDefRowClick: function(row, event, column){ 
				this.formDefSelected=row;
				this.pageInfo.total=0;
				this.pageInfo.pageNum=1;
				this.getFormFields();
				this.formQx=null;
				listFormQx({formId:row.id}).then(res=>{

						if(res.data.tips.isOk){
							if(res.data.data.length>0){
								let formQxTemp=res.data.data[0]
								this.formQx=this.formQxStringTransferArray(formQxTemp)

							} 
							this.$nextTick(() => { 
								this.getFormDatas();  
							});
						} 
					})
				
			},
			//获取列表 FormField 表单字段定义
			getFormFields() {
				if(  this.formDefSelected==null  ){
					return;
				}
				let params = {
					formId:this.formDefSelected.id
				};
				listFormField(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.formFields = res.data.data;
						this.getOptions2();
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch(() => {
					 
				});
			},	
			formQxStringTransferArray: function(formQx){
				if(!formQx){
					return null;
				}
				if(formQx.allowQueryRoleids!='' && formQx.allowQueryRoleids!=null){
					formQx.allowQueryRoleids=formQx.allowQueryRoleids.split(',')
				}else{
					formQx.allowQueryRoleids=[]
				} 
				if(formQx.allowQueryUserids!='' && formQx.allowQueryUserids!=null){
					formQx.allowQueryUserids=formQx.allowQueryUserids.split(',')
				}else{
					formQx.allowQueryUserids=[]
				}
				if(formQx.allowQueryDeptids!='' && formQx.allowQueryDeptids!=null){
					formQx.allowQueryDeptids=formQx.allowQueryDeptids.split(',')
				}else{
					formQx.allowQueryDeptids=[]
				}
				if(formQx.notQueryRoleids!='' && formQx.notQueryRoleids!=null){
					formQx.notQueryRoleids=formQx.notQueryRoleids.split(',')
				}else{
					formQx.notQueryRoleids=[]
				}
				if(formQx.notQueryDeptids!='' && formQx.notQueryDeptids!=null){
					formQx.notQueryDeptids=formQx.notQueryDeptids.split(',')
				}else{
					formQx.notQueryDeptids=[]
				}

				if(formQx.notQueryUserids!='' && formQx.notQueryUserids!=null){
					formQx.notQueryUserids=formQx.notQueryUserids.split(',')
				}else{
					formQx.notQueryUserids=[]
				} 
				return formQx
			},
			checkFormEditQx: function(formQx,queryUserid,queryDeptid,myUserid,myDeptid,myRoleid){
				let tips={isOk: false, msg:'无权限修改'}
				if(formQx==null){
					return {isOk: true, msg:'权限检查通过'}
				} 
				if(formQx.allowOtherEdit!='1'){
					if(queryUserid!=myUserid){ 
						return {isOk: false, msg:'你当前的用户无权修改其它用户的数据'}
					}else{
						return {isOk: true, msg:'权限检查通过'}
					}
				}
				tips=this.checkFormQueryQx(formQx,queryUserid,queryDeptid,myUserid,myDeptid,myRoleid)
				return tips;
			},
			checkFormDelQx: function(formQx,queryUserid,queryDeptid,myUserid,myDeptid,myRoleid){
				let tips={isOk: false, msg:'无权限删除'}
				if(formQx==null){
					return {isOk: true, msg:'权限检查通过'}
				} 
				if(formQx.allowOtherDel!='1'){
					if(queryUserid!=myUserid){ 
						return {isOk: false, msg:'你当前的用户无权删除其它用户的数据'}
					}else{
						return {isOk: true, msg:'权限检查通过'}
					}
				}
				tips=this.checkFormQueryQx(formQx,queryUserid,queryDeptid,myUserid,myDeptid,myRoleid)
				return tips;
			},
			checkFormQueryQx: function(formQx,queryUserid,queryDeptid,myUserid,myDeptid,myRoleid){
				let tips={isOk: false,msg:'无权操作'}
				if(formQx==null){
					return {isOk: true,msg:'权限检查通过'}
				}

				if(formQx.notQueryUserids){ 
					if(formQx.notQueryUserids.some(i=>i==myUserid)){ 
						return {isOk: false,msg:'你当前的用户无权查询该表单数据'}
					}
				}
				if(formQx.notQueryDeptids){ 
					if(formQx.notQueryDeptids.some(i=>i==myDeptid)){ 
						return {isOk: false,msg:'你当前部门无权查询该表单数据'}
					}
				}
				if(formQx.notQueryRoleids){ 
					if(formQx.notQueryRoleids.some(i=>i==myRoleid)){ 
						return {isOk: false,msg:'你当前角色无权查询该表单数据'}
					}
				}
				if(queryUserid==myUserid){
					return {isOk: true,msg:'权限检查通过'};
				}
				if(formQx.allowOtherQuery!='1'){
					if(myUserid!=queryUserid){ 
						return {isOk: false,msg:'当前表单不允许查询本人以外的数据'}
					} 
				}
				
				if(formQx.allowOtherQuery=='1'){ 
					if(formQx.allowQueryRoleids.length==0 && formQx.allowQueryUserids.length==0 && formQx.allowQueryDeptids.length==0){
						return {isOk: true,msg:'权限检查通过'};
					}
					if(formQx.allowQueryRoleids.some(i=>i==myRoleid)){ 
						return {isOk: true,msg:'权限检查通过'};
					}
					if(formQx.allowQueryUserids.some(i=>i==myUserid)){ 
						return {isOk: true,msg:'权限检查通过'};
					}
					if(formQx.allowQueryDeptids.some(i=>i==myDeptid)){ 
						return {isOk: true,msg:'权限检查通过'};
					}
 					 
				}
				return {isOk: false,msg:'无权操作'};
			},
			formatterDept(row, column, cellValue){ 
				var newValue=cellValue;
				this.myCompanyDepts.forEach(dept=>{
					if(dept.deptid==cellValue){
						 newValue= dept.deptName
						 return;
					}
				});
				return newValue;
			},
			formatterUserid(row, column, cellValue){  
				var newValue=cellValue;
				this.myCompanyEmployees.forEach(item=>{
					if(item.userid==cellValue){
						  newValue=item.username
					}
				});
				return newValue;
			},
			formatterFormFields(row, column, cellValue){
				console.log(column)
				if(cellValue=='' || cellValue==null){
					return "";
				}
				let myFields=this.formFields.filter(item=>{
					if(column.property==item.fieldIdCamel){
						 return true;
					}else{
						return false;
					} 
				});
				if(myFields && myFields.length>0){
					let field=myFields[0]
					if(field.isFromBaseData=='1' && field.secondCodeRow!=''){
						let options=this.options2[field.secondCodeRow]
						if(options && options.length>0){
							let optionsTemp=options.filter(o=>{
								if((cellValue+",").indexOf(o.optionValue+",")>=0){
									return true;
								}else{
									return false;
								}
							})
							if(optionsTemp && optionsTemp.length>0){
								return optionsTemp.map(i=>i.optionName).join(",")
							}else{
								return cellValue
							}
						}else{
							return cellValue
						}
					}else{
						//部门
						if(field.extFieldType=='dept'){
							let depts=this.myCompanyDepts.filter(i=>{
								if((cellValue+",").indexOf(i.deptid+",")>=0){
									return true;
								}else{
									return false;
								}
							})
							if(depts.length>0){
								return depts.map(i=>i.deptName).join(",")
							}else{
								return cellValue
							}
						}
						//用户
						if(field.extFieldType=='user'){
							let users=this.myCompanyEmployees.filter(i=>{
								if((cellValue+",").indexOf(i.userid+",")>=0){
									return true;
								}else{
									return false;
								}
							})
							if(users.length>0){
								return users.map(i=>i.username).join(",")
							}else{
								return cellValue
							}
						}
						return cellValue
					}
				}else{
					return cellValue
				}
				
			},
			getOptions2( ){
				this.dataListVisible=false;
				let secondCodeRows=[];
				let hasUserField=false;
				this.formFields.forEach(item=>{
					if(item.isFromBaseData=='1' && item.secondCodeRow!=''){
						secondCodeRows.push(item.secondCodeRow);
					}
					if(item.extFieldType=='user'){
						hasUserField=true;
					}
				});
				if(secondCodeRows.length>0){
					listOptionByItemIds(secondCodeRows).then(res=>{
						console.log(res.data);
						this.options2=res.data.data;
					});
				}  
				if(hasUserField){
					if(this.myCompanyEmployees.length<=0){
						listUser({branchId:this.userInfo.branchId}).then(res=>{
							this.myCompanyEmployees=res.data.data;
							console.log(res.data.data);
						});
					}
				}
					
			},
			 
			handleFiltersTagClose:function(tag,paramsName){
				if(paramsName=='key'){
					this.filters.key=null;
				}else if(paramsName=='deptTreeNodes'){
					this.filters.deptTreeNodes=this.filters.deptTreeNodes.filter(i=>i.deptid!=tag.deptid);
					this.$refs.deptTree.$refs.deptTree.setChecked(tag.deptid,false,false);
				}else if(paramsName=='tags'){
					this.filters.tags=this.filters.tags.filter(i=>i.tagId!=tag.tagId);
 				} else if(paramsName=='users'){
					this.filters.users=this.filters.users.filter(i=>i.userid!=tag.userid);
 				} else if(paramsName=='cusers'){
					this.filters.cusers=this.filters.cusers.filter(i=>i.userid!=tag.userid);
 				}  else if(paramsName=='calendar'){
					this.showCalendar=!this.showCalendar
 				}  else if(paramsName=='flowState'){
					this.filters.flowState=''
 				} 
			},
			
			onTagSelected(tags){
				this.tagSelectVisible=false;
				if(this.isBatchSetTags==true){
					//TOD 批量更新后台数据标签
					if(!tags || tags.length==0){
						 this.$message.error("最少选中一个标签");
						  this.isBatchSetTags=false;
						 return;
					}
					var tagsVos=[];
					this.sels.forEach(row=>{
						 
						var tagsVo={ 
							dataId:row.id,
							tags:tags.map(i=>{return {tagId:i.tagId,tagName:i.tagName}})
						}
						tagsVos.push(tagsVo);
					})
					var params= tagsVos
					
					 batchInsertOrDeleteTags(params).then(res=>{
						 this.isBatchSetTags=false;
						 if(res.data.tips.isOk){
							 var tagIds=tags.map(i=>i.tagId).join(",");
							 var tagNames=tags.map(i=>i.tagName).join(",");
							this.sels.forEach(row=>{
								row.tagIds=tagIds
								row.tagNames=tagNames
						 	})
							 this.$message.success("打标签成功");
						 }else{
							  this.$message.error(res.data.tips.msg);
						 }
					 }).catch(e=>this.isBatchSetTags=false);
				}else{
					if(tags==null){
						this.filters.tags=null 
					}else{
						this.filters.tags=tags 
					} 
				}
				
				
			}, 
			
			handleDeptTreeCheckChange(data, checked, indeterminate){ 
				if(data.id=='A0'){//选择了根节点，默认不按分类查询
					this.filters.deptTreeNodes=null
					return;
				}
				var node=this.$refs.deptTree.$refs.deptTree.getCheckedNodes();
				console.log("node-------------"+JSON.stringify(node));
				this.filters.deptTreeNodes=node;  
			},
			showTagSelect:function(isBatchSetTags){
				if(isBatchSetTags==true){
					if(this.sels.length==0){
						this.$message.error("请选中流程任务");
						return false;
					}
					this.tagSelectVisible=true;
				}else{
					this.tagSelectVisible=true;
				}
				this.isBatchSetTags=isBatchSetTags;
			},
			showCalendarDataTips:function(date,data){
				var datas=this.formDatas;
				var createDatas=[];
				var lastUpdateDatas=[]; 
				var nullTimeDatas=[];
				var tags=[];
				var now=new Date();
				var dateStr=util.formatDate.format(now,'yyyy-MM-dd');
				datas.forEach(i=>{
					var rowData=Object.assign({},i); 
					 
					if(rowData.createTime && rowData.createTime.indexOf(data.day)>=0){
						rowData.calStatus='开始' 
						createDatas.push(rowData);
					}else if( rowData.lastTime && rowData.lastTime.indexOf(data.day)>=0){
						rowData.calStatus='更新' 
						lastUpdateDatas.push(rowData);
					}else if( !rowData.createTime &&  !rowData.lastTime && dateStr<=data.day){
						nullTimeDatas.push(rowData);
						rowData.calStatus='空时间' 
					}
					
				});
				 
				var allDatas= createDatas.concat(lastUpdateDatas).concat(nullTimeDatas);
				allDatas.forEach(i=>{
					var tagIds=i.tagIds?i.tagIds.split(","):[];
					var tagNames=i.tagNames?i.tagNames.split(","):[]; 
					tagIds.forEach((tagId,index)=>{
						var tag=tags.find(t=>t.tagId==tagId);
						if(tag){
							tag.count=tag.count+1;
						}else{
							tag={
								tagId:tagId,
								tagName:tagNames[index],
								count:1
							}
							tags.push(tag)
						}
					});
				});

				 var msg={
					 createDatas:createDatas,
					 lastUpdateDatas:lastUpdateDatas, 
					 createDatasCount:createDatas.length,
					 lastUpdateDatasCount:lastUpdateDatas.length, 
					 nullTimeDatas:nullTimeDatas,
					 nullTimeDatasCount:nullTimeDatas.length,
					 allDatas:allDatas,
					 tags:tags
				 }
				return [msg];
			},		
			
			
			onUserSelected: function(users){  
				this.userSelectVisible=false;
				this.filters.cusers=users
			},
			showFlowInfo(row,index){
				
				let extVars={formDataId:row.id,formId:row.formId}
				let jsonExtVars=JSON.stringify(extVars); 
				let params={ 
						mainContext:'',
						mainTitle:'',
						formDataId:extVars.formDataId,
						formId:extVars.formId,
						bizUrl:process.env.BASE_API+config.getFormBasePath()+'/#/mdp/form/formData/FormDataMng?extVars='+jsonExtVars,
						restUrl:'/form/form/form/formData/processApprova',
						extVars:extVars,
						flowVars:{},
				}
 				this.$router.push({name:'ExecutionMngForFormData',params:params});
			},
			
			fetchData() {
				this.listLoading = true
				fetchList().then(response => {
					this.list = response.data.items
					this.listLoading = false
				})
			},
			handleDownload() {
				this.downloadLoading = true
				import('@/vendor/Export2Excel').then(excel => {
					const tHeader =    ['主键','创建人','创建人编号','创建部门','创建部门编号','更新人编号','更新时间','创建时间','标签','标签编号','流程审批状态','权限码'].concat(this.formFields.map(i=>i.fieldTitle))
					const filterVal =  ['id','cusername','cuserid','deptName','deptid','userid','lastTime','createTime','tagNames','tagIds','flowState','dqxCode'].concat(this.formFields.map(i=>i.fieldIdCamel));
					const list = this.formDatas
					const data = this.formatJson(filterVal, list)
					var filename="智能表单导出"
					if(this.formDefSelected){
						filename=this.formDefSelected.formName? this.formDefSelected.formName:this.formDefSelected.id+"智能表单导出"
					}
					excel.export_json_to_excel({
					header: tHeader,
					data,
					filename: filename,
					autoWidth:true,
					bookType:'xlsx'
					})
					this.downloadLoading = false
				})
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					if (j === 'timestamp') {
					return parseTime(v[j])
					} else {
					return v[j]
					}
				}))
			},
			sendToProcessApprova:function(row){
				 

				///var bizKey="form_form_data_approva"
				let extVars={formId:this.formDefSelected.id,formDataId:row.id}
				let jsonExtVars=JSON.stringify(extVars); 

				var currDomain=window.location.protocol+"//"+window.location.host;
				var fullPath=this.$route.fullPath; 
				var bizUrl=currDomain+'/#'+fullPath+'?extVars='+jsonExtVars
				let params={
					//bizKey:bizKey,
					bizUrl:bizUrl,
					resUrl:'/form/form/form/formData/processApprova',
					bizPkid:row.id,
					bizParentPkid:row.id,
					mainContext:'',
					formId:this.formDefSelected.id,
					formDataId:row.id,
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
						formDataId:row.id,
						branchId:row.branchId,
						formId:this.formDefSelected.id,
						formData:row
					}, 
				} 
				this.$router.push({name:'ProcdefListForBizStart',params:params});
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'form-data-add':FormDataAdd,
		    'form-data-edit':FormDataEdit,
		    'form-def-list':FormDefList,
		    'sticky': Sticky,TagMng,DeptTree,UsersSelect
		    //在下面添加其它组件
		},
		mounted() {  
				
			
		}
	}

</script>

<style scoped>

	.filters-show {
		margin-left: 20px;
		margin-top: 10px;
		margin-bottom: 0px;
	}
	.filters-label { 
		font-size: 14px;
		color:black;
		font-weight: bold;

	}
</style>