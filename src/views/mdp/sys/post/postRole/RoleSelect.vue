<template>
	<section> 
		<el-row  class="app-container">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="名称 模糊查询"></el-input>  
			<el-switch v-model="filters.roletype" active-text="公共角色" inactive-text="自定义角色" active-value="1"  inactive-value="0"> </el-switch>

			<el-button type="primary" v-loading="load.list" v-on:click="searchRoles" icon="el-icon-search"></el-button>

			<el-button type="primary"   @click="confirmRoleSelect">确定</el-button> 
			<el-tooltip class="item" effect="light" content="如果没有查询到角色，有可能是所有角色已经加入该岗位，可在角色管理中定义新的角色，再到此将角色加入岗位" placement="top-start">
		       <i class="el-icon-question"></i>
		    </el-tooltip>
		    <el-tooltip class="item" effect="light" content="公共角色为全平台共享，不区分机构，自定义角色按机构划分，本机构只能查询本机构的角色" placement="top-start">
		       <i class="el-icon-question"></i>
		    </el-tooltip>
		</el-row> 
		<el-row class="app-container"> 
			<!--列表 Role 角色管理-->
			<el-table :max-height="tableHeight" :data="roles"    highlight-current-row @row-click="roleRowClick" v-loading="load.list" border @selection-change="selsChange" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column> 
				<el-table-column sortable prop="roleid" label="编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="rolename" label="角色名" min-width="80"  show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="remark" label="备注" min-width="30" show-overflow-tooltip></el-table-column>  
				<el-table-column sortable prop="enabled" label="启用" min-width="30" show-overflow-tooltip>
					<template slot-scope="scope">
					<el-tag v-if="scope.row.enabled=='1'">√</el-tag>
					<el-tag v-else>×</el-tag>
					</template>
				</el-table-column> 
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
					</el-pagination>
		</el-row> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件 
	import { listRoleNotInPostId } from '@/api/mdp/sys/role'; 
	import { mapGetters } from 'vuex' 
	
	export default {
		props:['postId','visible'],
		watch: { 
	      'visible':function(visible) { 
	      	if(visible==true){
	      		this.searchRoles()
	      	}
	      } 
	    },
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				filters: {
					key: '',
					roletype:'0'
				},
				roles: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 options.sex,options.project
				
				addFormVisible: false,//新增role界面是否显示
				//新增role界面初始化数据
				addForm: {
					roleid:'',rolename:'',remark:'',roletype:'',rolebeg:'',roleend:'',crdate:'',enabled:'',deptid:'',sortOrder:'',branchId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑role界面初始化数据
				editForm: {
					roleid:'',rolename:'',remark:'',roletype:'',rolebeg:'',roleend:'',crdate:'',enabled:'',deptid:'',sortOrder:'',branchId:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				
				roleSelected:{},//角色选中行
				 
				roleids:[],//选中的角色编号 ,
				tableHeight:500,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getRoles();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getRoles();
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
				this.getRoles();
			},
			searchRoles(){
				 
				 this.pageInfo.count=true;
				 this.getRoles();
			},
			//获取列表 Role 角色管理
			getRoles() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,count:this.pageInfo.count
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
					//params.key=xxxxx
				}
				params.roletype=this.filters.roletype+''
				params.postId=this.postId
				console.log("fffffffffffffffffffffffffffffff")
				console.log(this.userInfo)
				//params.deptid=this.userInfo.deptid; 
					params.branchId=this.userInfo.branchId; 
				this.load.list = true;
				listRoleNotInPostId(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;this.pageInfo.count=false;
						this.roles = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$notify({ message: '通讯错误', type: 'error' });
				});
			},

			//显示编辑界面 Role 角色管理
			showEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 Role 角色管理
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getRoles();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行role
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除role
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.list = true;
					let params = row;
					delRole(params).then((res) => {
						this.load.list = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getRoles();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.load.list = false;
				});
			},
			//批量删除role
			batchDel: function () { 
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.list = true;
					batchDelRole(this.sels).then((res) => {
						this.load.list = false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getRoles(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.load.list = false;
				});
			},
			/**begin 自定义函数请在下面加**/
			roleRowClick(row, event, column){ 
				this.editForm=row;
			}, 
			confirmRoleSelect(){
				if(this.sels.length<=0){
					this.$notify({ message:'请选择角色', type: 'error'});
					return;
				}
				this.$emit('select',this.sels);//  @select="afterRoleSelect"
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  
		     
		},
		mounted() {   
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.getRoles();
			  
		}
	}

</script>

<style scoped>

</style>