<template>
	<section>
		<el-row class="app-container"> 
			<el-input v-model="filters.key" style="width: 20%;" placeholder="按用户、部门、岗位、角色及其编号模糊查询"></el-input> 
			<el-button type="primary"  :disabled="userInfo.isSuperAdmin!=true && userInfo.isPlatformAdmin!=true " v-on:click="showBranchSelect">切换机构</el-button> 					    
				<el-tooltip  effect="dark" content="超级管理员和平台管理员可以查询其它机构的数据，其它人员只能查询本机构数据" placement="top">
					      <i class="el-icon-question"></i>
				</el-tooltip>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchDeptPostUserMenus" icon="el-icon-search"></el-button> 
		</el-row>
		<el-row class="app-container"> 
			<!--列表 DeptPostUser 部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）-->
			<el-table :max-height="tableHeight" :data="deptPostUsers"  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column> 
				<el-table-column sortable prop="userid" label="用户名称/编号/登录编号" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope"><font style="color: blue">{{scope.row.username}}</font> /<font style="color: green"> {{scope.row.userid}} /</font> {{scope.row.displayUserid}}</template>
				</el-table-column> 
				 <el-table-column sortable prop="deptName" label="归属部门/部门编号" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope"><font style="color: blue">{{scope.row.deptName}}</font> / {{scope.row.deptid}}</template>
				</el-table-column>
				<el-table-column sortable prop="postName" label="归属岗位/岗位编号" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope"><font style="color: blue">{{scope.row.postName}}</font> / {{scope.row.postId}}</template>
				</el-table-column>
				<el-table-column sortable prop="rolename" label="归属角色/角色编号" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope"><font style="color: blue">{{scope.row.rolename}}</font> / {{scope.row.roleid}}</template>
				</el-table-column>
				<el-table-column sortable prop="mname" label="拥有的菜单名称/菜单编号/归属模块" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope"><font style="color: blue">{{scope.row.mname}}</font> / {{scope.row.menuId}} / {{scope.row.category}} </template>
				</el-table-column>
				<el-table-column sortable prop="rpath" label="菜单路由" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope"><font style="color: blue">{{scope.row.rpath}}</font></template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 DeptPostUser 部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）界面-->
			<el-dialog title="编辑部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <dept-post-user-edit :dept-post-user="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></dept-post-user-edit>
			</el-dialog>
	
			<!--新增 DeptPostUser 部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）界面-->
			<el-dialog title="新增部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<dept-post-user-add :dept-post-user="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></dept-post-user-add>
			</el-dialog> 
			<!--超级管理员和平台管理员可以选择机构-->
			<el-dialog title="选择机构" :visible.sync="branchSelectVisible"  width="50%"  :close-on-click-modal="false">
				<branch-select  :visible="branchSelectVisible" @cancel="branchSelectVisible=false" @row-click="afterBranchSelect"></branch-select>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listDeptPostUser, delDeptPostUser, batchDelDeptPostUser,listDeptPostUserMenus } from '@/api/mdp/sys/post/deptPostUser';
	import  DeptPostUserAdd from './DeptPostUserAdd';//新增界面
	import  DeptPostUserEdit from './DeptPostUserEdit';//修改界面
	import { mapGetters } from 'vuex'
	import BranchSelect from '../../branch/BranchSelect'
	
	export default { 
		props:['post','visible'],
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		watch:{
			'visible':function(visible){
				if(visible==true){
					this.searchDeptPostUserMenus();
				}
			}
		},
		data() {
			return {
				filters: {
					key: '',
					branchId:''//查询机构
				},
				deptPostUsers: [],//查询结果
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
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增deptPostUser界面是否显示
				branchSelectVisible: false,//显示机构选择
				//新增deptPostUser界面初始化数据
				addForm: {
					id:'',postId:'',deptid:'',userid:'',startDate:'',endDate:'',actEndDate:'',enabled:'',lastDate:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑deptPostUser界面初始化数据
				editForm: {
					id:'',postId:'',deptid:'',userid:'',startDate:'',endDate:'',actEndDate:'',enabled:'',lastDate:''
				},
				tableHeight:500,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getDeptPostUserMenus();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getDeptPostUserMenus();
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
				this.getDeptPostUserMenus();
			},
			searchDeptPostUserMenus(){
				 this.pageInfo.count=true; 
				 this.getDeptPostUserMenus();
			},
			//获取列表 DeptPostUser 部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）
			getDeptPostUserMenus() {
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
					params.key="%"+this.filters.key+"%"
				}else{
					//params.xxx=xxxxx
				}
				if(this.post!=null){
					params.postId=this.post.id
				}else{
					params.branchId=this.userInfo.branchId
				}
				if(this.filters.branchId==''){
					params.branchId=this.userInfo.branchId
				}else{
					params.branchId=this.filters.branchId
				}
				
				this.load.list = true;
				listDeptPostUserMenus(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.deptPostUsers = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 DeptPostUser 部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 DeptPostUser 部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			//显示机构选择页面
			showBranchSelect: function () {
				this.branchSelectVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			
			
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getDeptPostUserMenus();
			},
			afterBranchSelect(row){
				this.branchSelectVisible=false;
				this.pageInfo.count=true;
				this.filters.branchId=row.id
				this.getDeptPostUserMenus();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行deptPostUser
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除deptPostUser
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = row;
					delDeptPostUser(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getDeptPostUserMenus();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除deptPostUser
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelDeptPostUser(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getDeptPostUserMenus(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'dept-post-user-add':DeptPostUserAdd,
		    'dept-post-user-edit':DeptPostUserEdit,
		     
		    BranchSelect
		    //在下面添加其它组件
		},
		mounted() {    
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.$nextTick(() => {
				this.getDeptPostUserMenus();
        	}); 
		}
	}

</script>

<style scoped>

</style>