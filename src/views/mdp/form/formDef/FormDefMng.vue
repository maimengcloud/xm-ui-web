<template>
	<section>
		<sticky  :className="'sub-navbar draft'">  
					<el-input v-model="filters.key"  placeholder="模糊查询" style="width:20%;"></el-input>  
					<el-button type="primary"   v-on:click="searchFormDefs">查询</el-button>
					
					<el-button   @click.native="showTagSelect(false)"  >标签查找</el-button>
					<el-button   @click.native="showTagSelect(true)"  >打标签</el-button>
					<el-button type="primary"   @click="showAdd" :disabled="filters.formId!=''">新增表单</el-button> 
					<!--<el-button type="danger"    @click="batchDel" :disabled="this.sels.length===0||filters.formId!=''">批量删除</el-button> -->
		</sticky>
		
		<el-row class="filters-show">
			<font class="filters-label">已选条件:</font>  
			<el-tag  v-if="filters.tags"
				:key="tag.tagId"
				v-for="tag in filters.tags"
				:type="''"
				closable
				:disable-transitions="false"
				@close="handleFiltersTagClose(tag,'tags')">
				{{tag.tagName}}
			</el-tag>
			<el-tag v-if="filters.categoryTreeNodes"
				:key="tag.id"
				v-for="tag in filters.categoryTreeNodes"
				:type="'info'"
				closable
				:disable-transitions="false"
				@close="handleFiltersTagClose(tag,'categoryTreeNodes')">
				{{tag.name}}
			</el-tag>   
			<el-tag v-if="filters.key"
				:type="'success'"
				closable
				:disable-transitions="false" 
				@close="handleFiltersTagClose('','key')">
				 {{filters.key}}
			</el-tag>   
			
			<el-tag v-if="filters.user"
				:type="'success'"
				closable
				:disable-transitions="false" 
				@close="handleFiltersTagClose('','user')">
				 {{filters.user.username}}
			</el-tag>    
		</el-row>
		<el-row  class="page-container border"> 
			<el-col :xs="4" :sm="4" :md="3" :lg="3" :xl="3" class="hidden-sm-and-down">
				<category-tree  ref="categoryTree" multiple :expandOnClickNode="false" :defaultExpandAll="true" show-checkbox  :current-key="addForm.categoryId"  v-on:check-change="handleCategoryCheckChange" ></category-tree> 
			</el-col>
			<el-col   :xs="24" :sm="24" :md="21" :lg="21" :xl="21"> 
			<!--列表 FormDef 表单定义-->
				<el-table :data="formDefs"    highlight-current-row v-loading="listLoading" border @selection-change="selsChange" style="width: 100%;">
					<el-table-column sortable type="selection" width="40"></el-table-column>
					<el-table-column sortable type="index" width="40"></el-table-column>
					<el-table-column sortable prop="formName" label="表单名称(点击进入数据管理)" min-width="200">
						<template slot-scope="scope">  
								<el-link type="primary" @click="goToFormDataMngPage( scope.row,scope.$index)">{{scope.row.formName}} </el-link>
						</template> 
					</el-table-column>
					<el-table-column sortable prop="deptName" label="创建部门" min-width="150" ></el-table-column>  
					<el-table-column sortable prop="tagNames" label="标签" min-width="150"> 
						<template slot-scope="scope">
							<el-tag v-for="tagName in (scope.row.tagNames?scope.row.tagNames.split(','):[])" :key="tagName">{{tagName}}</el-tag>
						</template>
					</el-table-column> 
					<el-table-column sortable prop="ctime" label="创建日期" min-width="150" ></el-table-column>
					<el-table-column sortable prop="username" label="创建人" min-width="120"></el-table-column>
					<el-table-column label="操作" min-width="240"  fixed="right">
						<template slot-scope="scope">  
							<el-button  @click="showEdit( scope.row,scope.$index)">配置</el-button>
							<el-button  @click="showFormQx( scope.row,scope.$index)">权限</el-button>
							<el-button type="danger"  @click="handleDel(scope.row,scope.$index)" >删</el-button>
						</template>
					</el-table-column>
				</el-table>
				
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
				</el-pagination>
			</el-col>
			<!--编辑 FormDef 表单定义界面-->
			<el-dialog title="配置" :visible.sync="editFormVisible"  width="80%"  :close-on-click-modal="false">
				  <form-def-edit :form-def="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></form-def-edit>
			</el-dialog>
			
			
			<el-dialog append-to-body
				title="标签条件"
				:visible.sync="tagSelectVisible"
				width="60%"> 
				<tag-mng :tagIds="filters.tags?filters.tags.map(i=>i.tagId):[]"  :jump="true" @select-confirm="onTagSelected"></tag-mng> 
			</el-dialog>
			<!--新增 FormDef 表单定义界面-->
			<el-dialog title="新增表单" :visible.sync="addFormVisible"  width="80%"  :close-on-click-modal="false">
				<form-def-add :form-def="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></form-def-add>
			</el-dialog> 
			<!--表单权限设置-->
			<el-dialog title="表单权限设置" :visible.sync="formQxSetVisible"  width="50%"  :close-on-click-modal="false">
				<form-qx-set :form-def="editForm" :companyEmployees="companyEmployees" :visible="formQxSetVisible" @cancel="formQxSetVisible=false" ></form-qx-set>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listFormDef, delFormDef, batchDelFormDef } from '@/api/mdp/form/formDef';
	import  FormDefAdd from './FormDefAdd';//新增界面
	import  FormDefEdit from './FormDefEdit';//修改界面
	import { listUser } from '@/api/mdp/sys/user';//下拉框数据查询
	import { listDept } from '@/api/mdp/sys/dept';//下拉框数据查询
	import { batchInsertOrDeleteTags } from '@/api/mdp/form/formDefTag';
	import Sticky from '@/components/Sticky' // 粘性header组件
	import  FormQxSet from '../formQx/FormQxSet';//新增界面
	import { mapGetters } from 'vuex'
	import TagMng from '@/views/mdp/arc/tag/TagMng';   
	import  CategoryTree from '@/views/mdp/arc/category/CategoryTree';//修改界面
	import UsersSelect from '@/views/mdp/sys/user/UsersSelect'; 

	export default { 
		name:'FormDefMng',
	    computed: {
		    ...mapGetters([
		      'userInfo','myDepts'
		    ])
		},
		data() {
			return {
				filters: {
					key: '',
					user:'',
					deptid:'',
					formId:'',
					categoryTreeNodes:[], 
					tags:[],  
				},
				formDefs: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				listLoading: false,//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 options.sex,options.project
				
				addFormVisible: false,//新增formDef界面是否显示
				formQxSetVisible: false,//是否显示权限配置界面
				//新增formDef界面初始化数据
				addForm: {
					id:'',tableName:'',tableOwner:'',isCreateTable:'',formName:'',userid:'',deptid:'',formType:'',isTemplate:'',bizType:'',ctime:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑formDef界面初始化数据
				editForm: {
					id:'',tableName:'',tableOwner:'',isCreateTable:'',formName:'',userid:'',deptid:'',formType:'',isTemplate:'',bizType:'',ctime:''
				},
				companyEmployees:[],
				companyDepts:[],
				categorys:[],
				tagSelectVisible:false,
				isBatchSetTags:false,
				userSelectVisible:false,
				showCalendar:true,
				/**begin 自定义属性请在下面加 请加备注**/
					
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
				this.getFormDefs();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getFormDefs();
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
				this.getFormDefs();
			},
			searchFormDefs(){
				 this.pageInfo.pageNum=1;
				 this.pageInfo.total=0;
				 this.getFormDefs();
			},
			showFormQx: function(row,index){
				this.editForm = row;
				this.formQxSetVisible=true;
			},
			//获取列表 FormDef 表单定义
			getFormDefs() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					params.orderFields=this.pageInfo.orderFields;
					params.orderDirs=this.pageInfo.orderDirs;
				}
				if(this.filters.key!==""){
					params.key='%'+this.filters.key+'%'
				} 
				if(this.filters.user!=''){
					params.userid=this.filters.user.userid
				}
				if(this.filters.deptid!=''){
					params.deptid=this.filters.deptid
				}
				if(this.filters.formId!=''){
					params.id=this.filters.formId
				}
				
				
				if(this.filters.categoryTreeNodes!=null && this.filters.categoryTreeNodes.length>0){
					params.categoryIds=this.filters.categoryTreeNodes.map(i=>i.id)
				}
				
				if(this.filters.tags!=null && this.filters.tags.length>0){
					params.tagIds=this.filters.tags.map(i=>i.tagId)
				}
				 
				params.branchId=this.userInfo.branchId
				this.listLoading = true;
				listFormDef(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.formDefs = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false; 
				});
			},

			//显示编辑界面 FormDef 表单定义
			showEdit: function ( row,index ) {
				
				this.editForm = row;
				this.editFormVisible = true;
			},
			//显示新增界面 FormDef 表单定义
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.total=0;
				this.getFormDefs();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行formDef
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除formDef
			handleDel: function (row,index) {
				this.$confirm('删除表单前，请确保已经删除掉该表单下的所有数据，确定删除该表单么？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = { id: row.id };
					delFormDef(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.total=0;
							this.getFormDefs();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false; 
				});
			},
			//批量删除formDef
			batchDel: function () {
				var ids = this.sels.map(item => {return {id:item.id}});
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					batchDelFormDef(ids).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.total=0;
							this.getFormDefs(); 
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.listLoading = false; 
				});
			},
			/**begin 自定义函数请在下面加**/
			/**begin 自定义函数请在下面加**/
			formatterDept(row, column, cellValue){ 
				var newValue=cellValue;
				this.companyDepts.forEach(dept=>{
					if(dept.deptid==cellValue){
						 newValue= dept.deptName
						 return;
					}
				});
				return newValue;
			},
			formatterUserid(row, column, cellValue){  
				var newValue=cellValue;
				this.companyEmployees.forEach(item=>{
					if(item.userid==cellValue){
						  newValue=item.username
					}
				});
				return newValue;
			},
			goToFormDataMngPage:function(row){
				this.editForm=row;
				this.$router.push({path:'/mdp/form/formData/FormDataMng',query:{formId:row.id,formName:row.formName}});
			},
			handleFiltersTagClose:function(tag,paramsName){
				if(paramsName=='key'){
					this.filters.key=null;
				}else if(paramsName=='categoryTreeNodes'){
					this.filters.categoryTreeNodes=this.filters.categoryTreeNodes.filter(i=>i.id!=tag.id);
					this.$refs.categoryTree.$refs.nodeTree.setChecked(tag.id,false,false);
				}else if(paramsName=='procCategory'){
					this.filters.procCategory=null;
 				}else if(paramsName=='tags'){
					this.filters.tags=this.filters.tags.filter(i=>i.tagId!=tag.tagId);
 				} else if(paramsName=='user'){
					this.filters.user=null;
 				} else if(paramsName=='calendar'){
					this.showCalendar=!this.showCalendar
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
					var tagsVo=[];
					this.sels.forEach(row=>{
						 
						var tagVo={ 
							formId:row.id,
							tags:tags.map(i=>{return {tagId:i.tagId,tagName:i.tagName}})
						}
						tagsVo.push(tagVo);
					})
					var params= tagsVo
					
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
			handleCategoryCheckChange(data, checked, indeterminate){ 
				if(data.id=='C0'){//选择了根节点，默认不按分类查询
					this.filters.categoryTreeNodes=null
					return;
				}
				var node=this.$refs.categoryTree.$refs.nodeTree.getCheckedNodes();
				console.log("node-------------"+JSON.stringify(node));
				this.filters.categoryTreeNodes=node;  
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
			
			onUserSelected: function(users){  
				this.userSelectVisible=false;
				this.filters.assignee=users[0]
			},
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'form-def-add':FormDefAdd,
		    'form-def-edit':FormDefEdit,
		    'sticky': Sticky,
		    'form-qx-set': FormQxSet,
			CategoryTree,TagMng,UsersSelect
		    //在下面添加其它组件
		},
		mounted() {
			
			if(this.$route.query.formId){
				this.filters.formId=this.$route.query.formId
			}
			this.getFormDefs(); 
		}
	}

</script>

<style scoped>

.filters-show {
	margin-left: 20px;
	margin-top: 10px;
	margin-bottom: 0px;
	height: 20px;
}
.filters-label { 

	font-size: 14px;
	color:black;
	font-weight: bold;
	height: 20px;
}
</style>