<template>
	<section>
		
		<el-row>
			 
			<el-col :span="24" v-if="formShowType=='table'"> 
				<sticky  :className="'sub-navbar draft'">  
						<el-radio v-model="filters.flowState" label="1">已加入审核单</el-radio>
  						<el-radio v-model="filters.flowState" label="0">未加入审核单</el-radio>
						<el-input   v-model="filters.key"  placeholder="模糊查询" style="width:15%;"></el-input> 
						<el-select   v-model="filters.userid"   style="width:20%;" clearable filterable placeholder="请选择用户">
					    <el-option
					      v-for="item in myCompanyEmployees"
					      :key="item.userid"
					      :label="item.username"
					      :value="item.userid">
					      <span style="float: left">{{ item.username }}</span>
		   					  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
					    </el-option>
					  </el-select>
					 <el-select      style="width:20%;"   v-model="filters.deptid"  clearable filterable placeholder="请选择">
					    <el-option
					      v-for="item in myCompanyDepts"
					      :key="item.deptid"
					      :label="item.deptName"
					      :value="item.deptid">
					    </el-option>
					  </el-select>
					  	
					  	<el-button     v-on:click="searchFormDatas" icon="el-icon-search" circle></el-button> 
					   <el-button v-if="filters.flowState!='1'" type="primary"    @click="showAdd">新增数据</el-button>
						<el-button v-if=" filters.flowState!='1'" type="danger"     @click="batchDel" :disabled="this.sels.length===0">批量删除</el-button>  
				</sticky> 
				<el-row class="page-container border">
					<el-table v-if="filters.flowState=='0'" :data="formDatas"  @sort-change="sortChange" height="240" highlight-current-row v-loading="listLoading" border @selection-change="selsChange" style="width: 100%;">
					<el-table-column type="selection" width="55" v-if="showBtn"></el-table-column>
					<el-table-column type="index" width="60"></el-table-column> 
					<el-table-column prop="deptid" label="创建部门"  min-width="80"  :formatter="formatterDept"></el-table-column>
					<el-table-column prop="userid" label="创建人"  min-width="80"  :formatter="formatterUserid"></el-table-column>
					<el-table-column prop="lastTime" label="更新时间"  min-width="80" ></el-table-column> 
					<el-table-column v-for="item in formFields " :prop="item.fieldId" :label="item.fieldTitle" min-width="80"  :key="item.fieldId" :formatter="formatterFormFields"></el-table-column> 

					<el-table-column label="操作" min-width="250"  fixed="right" v-if="showBtn" >
						<template slot-scope="scope"> 
						<el-tooltip content="当提交工作流时才会真正保存到后台审核单" placement="bottom" effect="light">
						   <el-button    @click="joinToProc( scope.row,scope.$index)">加入审核单 </el-button>
						</el-tooltip> 
							<el-button  v-if="showBtn" @click="showEdit( scope.row,scope.$index)">改</el-button>
							<el-button type="danger"  v-if="showBtn" @click="handleDel(scope.row,scope.$index)">删</el-button>
						</template>
					</el-table-column>
				</el-table>
								<el-pagination  v-if="filters.flowState=='0'"   layout="total, sizes, prev, pager, next"  :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
						</el-pagination>
				<!--列表 FormData 表单数据表-->
				<el-table v-if=" filters.flowState=='1'" :data="procFormDatas"    height="240" highlight-current-row v-loading="listLoading" border   style="width: 100%;">
					<el-table-column type="selection" width="55" v-if="false"></el-table-column>
					<el-table-column type="index" width="60"></el-table-column> 
					<el-table-column prop="deptid" label="创建部门"  min-width="80"  :formatter="formatterDept"></el-table-column>
					<el-table-column prop="userid" label="创建人"  min-width="80"  :formatter="formatterUserid"></el-table-column>
					<el-table-column prop="lastTime" label="更新时间"  min-width="80" ></el-table-column> 
					<el-table-column v-for="item in formFields " :prop="item.fieldId" :label="item.fieldTitle" :key="item.fieldId" min-width="80"  :formatter="formatterFormFields"></el-table-column> 

					<el-table-column label="操作" min-width="200"  fixed="right" v-if="showBtn">
						<template slot-scope="scope">
							<el-button  v-if="showBtn" @click="showEdit( scope.row,scope.$index)">改</el-button>
							<el-tooltip content="当提交工作流时才会真正从数据库移除" placement="bottom" effect="light">
						   		<el-button type="danger"  v-if="showBtn" @click="removeFromProc(scope.row,scope.$index)">移出审核单</el-button>
							</el-tooltip> 
							
						</template>
					</el-table-column>
				</el-table>
				<el-pagination  v-if="filters.flowState=='1'"   layout="total, sizes, prev, pager, next"  :page-sizes="[10,20, 50, 100, 500]" :current-page="procPageInfo.pageNum" :page-size="procPageInfo.pageSize"  :total="procPageInfo.total" style="float:right;">
						</el-pagination>
				</el-row>
				<!--编辑 FormData 表单数据表界面-->
				<el-dialog title="编辑" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false" append-to-body>
					<form-data-edit :form-data="editForm" :form-def="formDefSelected" :form-fields="formFields" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></form-data-edit>
				</el-dialog>
		
				<!--新增 FormData 表单数据表界面-->
				<el-dialog title="新增" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false" append-to-body>
					<form-data-add :form-data="addForm" :form-def="formDefSelected" :form-fields="formFields"  :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></form-data-add>
				</el-dialog> 
			</el-col>
			<el-col :span="24" v-if="formShowType!='table'" v-loading="listLoading" > 
				<form-data v-if="isFlowStart" :form-data="addForm" :form-def="formDefSelected" :form-fields="formFields" :submitEvent="submitEvent"  :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit" ref="formData"><div></div></form-data>
				<form-data v-else :form-data="editForm" :form-def="formDefSelected" :form-fields="formFields"  :submitEvent="submitEvent"  :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterEditSubmit" ref="formData"><div></div></form-data>
			</el-col>
			
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	
	import qxutil from '@/common/js/qxutil';//全局公共库
	import { listOption,listOptionByItemIds } from '@/api/itemOption';//下拉框数据查询
	import { listFormData, delFormData, batchDelFormData } from '@/api/mdp/form/formData';
	import { listFormField} from '@/api/mdp/form/formField';
	import  FormData from './FormData';//新增界面
	import  FormDataAdd from './FormDataAdd';//新增界面
	import  FormDataEdit from './FormDataEdit';//修改界面
	import  FormDefList from '../formDef/FormDefList';//表单定义查询列表
	import Sticky from '@/components/Sticky' // 粘性header组件
	import { listUser } from '@/api/mdp/sys/user';//下拉框数据查询
	import { listDept } from '@/api/mdp/sys/dept';//下拉框数据查询
	import { mapGetters } from 'vuex'

	import { listFormQx } from '@/api/mdp/form/formQx';
	export default { 
		props: ['isFlowStart','formId','procInstId','formDataIds','submitEvent','formShowType','qxCode'],
		watch: {
		      
		      'formId':function(formId) { 
				  if(!formId||formId==''||formId==null){
					  return;
				  }
		    	  this.formDefSelected={id:formId};
		    	  this.getFormFields();
					this.formQx=null;
					/**工作流中不需要权限
					listFormQx({formId:formId}).then(res=>{ 
							if(res.data.tips.isOk){
								if(res.data.data.length>0){
									let formQxTemp=res.data.data[0]
									this.formQx=this.formQxStringTransferArray(formQxTemp)

								}  
							} 
						})
						 */
		    	  this.formDatas=[]
		    	  this.delProcFormDatas=[]
		    	  this.procFormDatas=[]
		      },
		      'procInstId':function(procInstId) {  
				  if(procInstId==null||procInstId==""){
					  return;
				  }
		    	  this.filters.flowState="1"
		    	  this.formDatas=[]
		    	  this.delProcFormDatas=[]
		    	  this.procFormDatas=[]
		    	  this.getProcFormDatas()
		      },
		      'formDataIds':function(formDataIds) {  
				  if(formDataIds==null ||formDataIds.length==0){
					  return;
				  }
		    	  this.filters.flowState="1"
		    	  this.formDatas=[]
		    	  this.delProcFormDatas=[]
		    	  this.procFormDatas=[]
		    	  this.getFormDatas()
			  },
			  'qxCode':function(qxCode){
				  this.qxCodeArr=qxutil.flow.parseQxCode(this.qxCode)
				  this.formFields=qxutil.flow.parseFormFieldsQx(this.qxCodeArr,this.formFields);
			  },
			  'submitEvent':function(submitEvent) {  
				   let formDatas=this.procFormDatas;
				   let that=this;
				  if(!this.procInstId && this.isFlowStart==true && (this.procFormDatas==null||this.procFormDatas.length==0)){
					  that.$refs.formData.$refs.editForm.validate((valid)=>{
						  if(valid){
							  var formData=that.$refs.formData.editSubmit()
							  that.$message({ message: "检查通过3", type: 'success' }); 
							  
							  console.log("formData------------------"+JSON.stringify(formData));
							  if(formData!=false && formData!=null){ 
								formDatas=[];
								formDatas.push(formData);
								that.$emit("submit",formDatas)
							  }
							return;
						  }else{
							   that.$message({ message: '请补充智能表单数据', type: 'info' });
							  return;
						  }
					  });
					return;
				  }else if(this.formShowType!='table'){
						 that.$refs.formData.$refs.editForm.validate((valid)=>{
						  if(valid){
							formDatas=[that.$refs.formData.editForm];
							that.$emit("submit",formDatas)
							return;
						  }else{
							   this.$message({showClose: true, message: '请补充智能表单数据', type: 'info' });
							  return;
						  }
					  });
					return; 
				}else{
				   if(formDatas.length<=0){ 
					   this.$message({showClose: true, message: '请先选择要加入审批流的智能表单数据', type: 'info' });
				   }else{ 
						   formDatas.forEach(i=>{ 
								   i.flowAction="join" 
						   })
						   this.delProcFormDatas.forEach(i=>{
							   if(!this.procFormDatas.some(item=>item.id==i.id)){
								   i.flowAction="remove"
									   formDatas.push(i)
							   }
						   })
					   this.$emit("submit",formDatas)
				   }

				  }
				 
	      	   },
		    },	
	    computed: {
		    ...mapGetters([
		      'userInfo','myDepts'
		    ]),
		   	showBtn: function(){
		   		
		   		return true;
		   	}
		},
		data() {
			return {
				filters: {
					key: '',
					userid:'',
					deptid:'', 
					flowState:'0',//审核状态 0 未审核 1审核中 2 审核结束
				}, 
				formDatas: [],//未加入审核单的查询结果
				procFormDatas: [],//审核中数据
				delProcFormDatas:[],//编辑界面移除的审核单数据
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				procPageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				listLoading: false,//查询中...
				sels: [],//列表选中数据
				procSels:[],//
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
				qxCodeArr:[],
				formQx: null,
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
				if( this.filters.flowState=='1'){
					this.procPageInfo.pageNum=1;
					this.procPageInfo.total=0;
					 this.getProcFormDatas();
				}else{
					 this.pageInfo.pageNum=1;
					 this.pageInfo.total=0;
					 this.getFormDatas();
				}
				
			},

			//如果是嵌入工作流i时调用此函数
			getProcFormDatas() {
				let params = { 
					pageSize: this.procPageInfo.pageSize,
					pageNum: this.procPageInfo.pageNum,
					total: this.procPageInfo.total 
				};
				if(this.procPageInfo.orderFields!=null && this.procPageInfo.orderFields.length>0){
					params.orderFields=this.procPageInfo.orderFields;
					params.orderDirs=this.procPageInfo.orderDirs;
				} 
					
					console.log(this.formDefSelected)
					if(this.procInstId && this.procInstId!='' && this.procInstId!=null){//工作流中直接发起
						params.procInstId=this.procInstId
						//params.flowState='1';
					}else if( this.formDataIds && this.formDataIds.length>0){//从智能表单跳转过来的审批流，指定了智能表单数据
							params.ids=this.formDataIds
					}else {
						return;
					}
				 
				this.listLoading = true;
				listFormData(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.procPageInfo.total = res.data.total; 
						if(this.procInstId && this.procInstId!='' && this.procInstId!=null){//工作流中直接发起
							this.procFormDatas=res.data.data.filter(i=>!this.delProcFormDatas.some(item=>i.id==item.id))
						}else if( this.formDataIds && this.formDataIds.length>0){//从智能表单跳转过来的审批流，指定了智能表单数据
							let tem=res.data.data.filter(i=>this.formDataIds.some(item=>i.id==item))
							this.procFormDatas=tem.filter(i=>!this.delProcFormDatas.some(item=>i.id==item.id))
						}
						this.editForm=this.procFormDatas[0];
						
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					
				});
			},

			formQxStringTransferArray: function(formQx){
				if(!formQx){
					return;
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
			//不嵌入工作流时 调用该查询 获取列表 FormData 表单数据表
			getFormDatas() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					params.orderFields=this.pageInfo.orderFields;
					params.orderDirs=this.pageInfo.orderDirs;
				} 
					console.log(this.formDefSelected) 
						if(this.formDefSelected!=null){
							params.formId=this.formDefSelected.id;
						}else{
							this.$message({showClose: true, message: '没有关联智能表单，无法查询表单数据', type: 'info' });
							return;
						}   
				if(this.formDataIds){
					params.ids=this.formDataIds
				}

				if((this.formDataIds==null||this.formDataIds.length==0) && !this.procInstId ){
					return;
				}
				let tips=this.checkFormQueryQx(this.formQx,params.userid,params.deptid,this.userInfo.userid,this.userInfo.deptid,this.userInfo.roleid)
				if(tips.isOk==false){
					this.$message({showClose: true, message: tips.msg, type: 'error' });
					return;
				}
				//params.flowState="0" 
				this.listLoading = true;
				listFormData(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						 
						let temp = res.data.data.filter(item=>!this.procFormDatas.some(i=>i.id==item.id)); 
						 let delTemp=this.delProcFormDatas.filter(i=>temp.some(item=>item.id==i.id))
						 delTemp.forEach(i=>temp.push(i))
						 
						 this.formDatas=temp;
						 if(this.formShowType!='table'){
							 if(this.isFlowStart){
								  this.addForm=this.formDatas[0]
							 }else{
								  this.editForm=this.formDatas[0]
							 }
							 
						 }
						
						
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
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
					this.$message({showClose: true, message: tips.msg, type: 'error' });
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
			startProc: function() { 
				if(this.sels.length<1){
					this.$message({showClose: true, message: "请至少选择一条数据发审", type: 'error' });
					return;
				}
				let extVars={ids:this.sels.map(i=>i.id),formId:this.formDefSelected.id}
				let jsonExtVars=JSON.stringify(extVars); 
				let params={ 
						mainContext:'',
						mainTitle:'',
						bizUrl:process.env.BASE_API+config.getFormBasePath()+'/#/mdp/form/formData/FormDataMng?extVars='+jsonExtVars,
						extVars:extVars
				}
				let jsonParams=JSON.stringify(params);
				jsonParams=encodeURIComponent(jsonParams);
				window.open(process.env.BASE_API+config.getWorkflowBasePath()+'/#/mdp/workflow/re/procdef/ProcdefListForStart?params='+jsonParams)
			},
			joinToProc: function(row,index){
				let tips=this.checkFormEditQx(this.formQx,row.userid,row.deptid,this.userInfo.userid,this.userInfo.deptid,this.userInfo.roleid)
				if(tips.isOk==false){
					this.$message({showClose: true, message: tips.msg, type: 'error' });
					return;
				}
				 if(this.procFormDatas.some(i=>i.id==row.id)){
					 this.$message({showClose: true, message: '该数据已在审核单中', type: 'info'});
				 }else{
					 this.$nextTick(() => {
						 this.formDatas.splice(index, 1); 
						 this.delProcFormDatas=this.delProcFormDatas.filter(i=>i.id!=row.id)
						 this.procFormDatas.push(row)
						 this.$message({showClose: true, message: '添加成功', type: 'info'});
		        		});
					
				 }
			},
			removeFromProc: function(row,index){
				let tips=this.checkFormEditQx(this.formQx,row.userid,row.deptid,this.userInfo.userid,this.userInfo.deptid,this.userInfo.roleid)
				if(tips.isOk==false){
					this.$message({showClose: true, message: tips.msg, type: 'error' });
					return;
				}
				 if(this.procFormDatas.some(i=>i.id==row.id)){
					 this.$nextTick(() => {
						 this.procFormDatas.splice(index, 1); 
						 if(!this.delProcFormDatas.some(i=>i.id==row.id)){
							 this.delProcFormDatas.push(row)
						 } 
						 this.formDatas.push(row);
						 this.$message({showClose: true, message: '移除成功', type: 'info'});
		        		});
					 
				 }else{
					 this.$message({showClose: true, message: '没有该条数据', type: 'error'});
				 }
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
			//选择行formData
			procSelsChange: function (sels) {
				this.procSels = sels;
			}, 
			//删除formData
			handleDel: function (row,index) {
				let tips=this.checkFormDelQx(this.formQx,row.userid,row.deptid,this.userInfo.userid,this.userInfo.deptid,this.userInfo.roleid)
				if(tips.isOk==false){
					this.$message({showClose: true, message: tips.msg, type: 'error' });
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
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
						
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
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
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
				if(this.filters.flowState=='1'){ 
						this.getProcFormDatas()  
				} 
				/**
				listFormQx({formId:row.id}).then(res=>{

						if(res.data.tips.isOk){
							if(res.data.data.length>0){
								let formQxTemp=res.data.data[0]
								this.formQx=this.formQxStringTransferArray(formQxTemp)

							} 
							if(this.filters.flowState!='1'){
								this.$nextTick(() => { 
									this.getFormDatas();   
				        		});
							}
						} 
					})
					 */
				
			},
			//获取列表 FormField 表单字段定义
			getFormFields() {
				if(  this.formDefSelected==null  ){
					return;
				}
				let params = {
					formId:this.formDefSelected.id
				};
				this.formFields=[]
				this.listLoading=true;
				listFormField(params).then((res) => {
					var tips=res.data.tips;
					this.listLoading=false;
					if(tips.isOk){ 
						var formFields = res.data.data;
						this.formFields=qxutil.flow.parseFormFieldsQx(this.qxCodeArr,formFields);
						this.getOptions2();
						this.$emit('formFieldsLoad',this.formFields);
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
				}).catch(() => {
					 this.listLoading=false;
				});
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
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
			'form-data-add':FormDataAdd,
			'form-data':FormData,
		    'form-data-edit':FormDataEdit,
		    'form-def-list':FormDefList,
		    'sticky': Sticky,
		    //在下面添加其它组件
		},
		mounted() {
			//this.getFormDatas();
			console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
			console.log(this.formId+"----formDataIds---"+JSON.stringify( this.formDataIds)) 
			this.qxCodeArr=qxutil.flow.parseQxCode(this.qxCode);
			if((this.formDataIds && this.formDataIds.length>0) || (this.procInstId && this.procInstId!='' && this.procInstId!=null)){//如果是通过工作流bizUrl跳转回来，则进此
				console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx extVars")
				this.filters.flowState="1"  
				this.formDefRowClick({id:this.formId})
			}else {
				this.filters.flowState="0" 
				this.formDefRowClick({id:this.formId}) 
			}  
		}
	}

</script>

<style scoped>

</style>