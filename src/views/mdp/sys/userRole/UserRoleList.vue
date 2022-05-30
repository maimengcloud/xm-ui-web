<template>
	<section>
	
		<!--工具条1-->
		<el-col :span="24" class="toolbar"  style="padding: 0px">
			<el-col :span="4">
				<el-input v-model="filters.key"  placeholder="模糊查询"></el-input>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" v-loading="load.list"  v-on:click="searchUsers" icon="el-icon-search"></el-button> 
			</el-col>	 
		</el-col> 
		
		<!--列表 User sys_user-->
		<el-table :max-height="tableHeight" :data="users"    highlight-current-row v-loading="load.list" border @selection-change="selsChange" style="width: 100%;">
			<el-table-column sortable type="index" width="40"></el-table-column>
			<el-table-column sortable prop="username" label="用户名称" min-width="120"></el-table-column>
			<el-table-column sortable prop="nickname" label="昵称" min-width="100"></el-table-column>
			<el-table-column sortable prop="displayUserid" label="登录账号" min-width="150"></el-table-column> 
		</el-table>
		<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
				</el-pagination>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库 
	import { listUser, delUser, batchDelUser } from '../../../../api/mdp/sys/user';
	import { listUserInfosByRoleid } from '../../../../api/mdp/sys/userRole';
	import { mapGetters } from 'vuex' 
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['role','visible'],
		watch: {
	      'visible':function(visible) { 
	      	if(visible==true){
	      		this.searchUsers()
	      	}
	      } 
	    },	
		data() {
			return {
				filters: {
					key: ''
				},
				users: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{list: false},//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 options.sex,options.project 
				tableHeight:500,
				/**begin 自定义属性请在下面加 请加备注**/
				
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getUsers();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getUsers();
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
				this.getUsers();
			},
			searchUsers(){
				 
				 this.pageInfo.count=true;
				 this.getUsers();
			},
			//获取列表 User sys_user
			getUsers() {
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
					params.key='%'+this.filters.key+'%'
				} 
				params.roleid=this.role.roleid; 
				//params.deptid=this.userInfo.deptid;
				if( !this.userInfo.isSuperAdmin && !this.userInfo.isPlatformAdmin){
					params.branchId=this.userInfo.branchId;
				} 
				this.load.list = true;
				listUserInfosByRoleid(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;this.pageInfo.count=false;
						this.users = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$notify({ message: '通讯错误', type: 'error' });
				});
			},

			//选择行user
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    //在下面添加其它组件
		},
		mounted() {   
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.getUsers(); 
		}
	}

</script>

<style scoped>

</style>