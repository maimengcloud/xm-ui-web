<template>
	<section>
		<sticky  :className="'sub-navbar draft'">  
		<!--工具条1--> 
					<el-input v-model="filters.key"  placeholder="模糊查询" style="width:30%;"></el-input>  
					<el-popover
					  placement="top"
					  width="400"
					  trigger="manual"
					  v-model="showMoreFilters">  
					  	<el-select  v-model="filters.userid"   style="width:45%;" clearable filterable placeholder="请选择用户">
					    <el-option
					      v-for="item in companyEmployees"
					      :key="item.userid"
					      :label="item.username"
					      :value="item.userid">
					      <span style="float: left">{{ item.username }}</span>
		   					  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
					    </el-option>
					  </el-select>
					 <el-select     style="width:45%;"   v-model="filters.deptid"  clearable filterable placeholder="请选择">
					    <el-option
					      v-for="item in companyDepts"
					      :key="item.deptid"
					      :label="item.deptName"
					      :value="item.deptid">
					    </el-option>
					  </el-select>  
					  <el-button slot="reference"   @click="showMoreFilters = !showMoreFilters" icon="el-icon-more" circle></el-button> 
					</el-popover>
					<el-button     v-on:click="searchFormDefs" icon="el-icon-search" circle></el-button>
					  
					
		</sticky>
		<el-row class="page-container border">
			
			
			<!--工具条2-->  
			<!--如果有更多工具条,放开此注释
			<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;">
				<el-col :span="4">
				</el-col>
			</el-col>
			-->		
			
			<!--列表 FormDef 表单定义-->
			<el-table :data="formDefs"  @sort-change="sortChange" height="480" highlight-current-row v-loading="listLoading" border @row-click="rowClick" @selection-change="selsChange" style="width: 100%;">
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="formName" label="表单名称" min-width="80" ></el-table-column>
				<el-table-column prop="bizType" label="业务分类" min-width="80" ></el-table-column>
				<el-table-column prop="userid" label="创建人" min-width="80" :formatter="formatterUserid" ></el-table-column>
				<el-table-column prop="deptid" label="创建部门" min-width="80" :formatter="formatterDept" ></el-table-column>
			</el-table> 
					<el-pagination  layout="total, prev, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
					</el-pagination> 
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库 
	import { listFormDef } from '../../../../api/mdp/form/formDef';
	import Sticky from '@/components/Sticky' // 粘性header组件
	import { mapGetters } from 'vuex' 
	export default { 
		props:['companyEmployees','companyDepts'],
	    computed: {
		    ...mapGetters([
		      'userInfo','myDepts'
		    ])
		},
		data() {
			return {
				filters: {
					key: '',
					userid:'',
					deptid:''
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
				//新增formDef界面初始化数据
				addForm: {
					id:'',tableName:'',tableOwner:'',isCreateTable:'',formName:'',userid:'',deptid:'',formType:'',isTemplate:'',bizType:'',ctime:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑formDef界面初始化数据
				editForm: {
					id:'',tableName:'',tableOwner:'',isCreateTable:'',formName:'',userid:'',deptid:'',formType:'',isTemplate:'',bizType:'',ctime:''
				},
				showMoreFilters:false
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
				if(this.filters.userid!=''){
					params.userid=this.filters.userid
				}
				if(this.filters.deptid!=''){
					params.deptid=this.filters.deptid
				}
				params.branchId=this.userInfo.branchId
				this.listLoading = true;
				listFormDef(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.formDefs = res.data.data;
						console.log(this.pageInfo)
						if(this.pageInfo.total>0){
							this.rowClick(this.formDefs[0], null, null);
						} 
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false; 
				});
			},

			
			//选择行formDef
			selsChange: function (sels) {
				this.sels = sels;
			},
			/**begin 自定义函数请在下面加**/
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}, 	
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
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'sticky': Sticky,
		},
		mounted() {
			//this.filters.userid=this.userInfo.userid
			//this.filters.deptid=this.userInfo.deptid
			this.getFormDefs();
			
			//加载下拉列表 如有需要去年注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			}); 
			**/
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
		}
	}

</script>

<style scoped>

</style>