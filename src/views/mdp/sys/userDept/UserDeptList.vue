<template>
	<section>
		<el-row >
			<el-checkbox v-model="filters.includeSubDept" true-label="1" :false-label="0">查本部及以下</el-checkbox> 
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询">
				<template slot="append">
					<el-button type="primary" v-loading="load.list" v-on:click="searchUserDepts" icon="el-icon-search"></el-button>
				</template>
			</el-input>   
			<el-button type="primary" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0" icon="el-icon-right">移出部门</el-button> 
				<el-tooltip  effect="dark" content="将用户移出部门，将同步取消该用户在该部门上拥有的岗位，进而取消该用户在该岗位上拥有的角色、菜单权限,请慎重处理" placement="top">
					<i class="el-icon-question"></i>
				</el-tooltip>
		</el-row>
		<el-row style="padding-top:10px;"> 
			<!--列表 UserDept 用户部门关系表-->
			<el-table :max-height="tableHeight" :data="userDepts"  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column sortable prop="username" label="姓名" min-width="80" show-overflow-tooltip></el-table-column> 
				<el-table-column sortable prop="userid" label="用户编号" min-width="80" show-overflow-tooltip></el-table-column> 
				<el-table-column sortable prop="displayUserid" label="登录账号" min-width="80" show-overflow-tooltip></el-table-column>  
				<el-table-column sortable prop="deptName" label="归属部门" min-width="150" show-overflow-tooltip></el-table-column>   
				<el-table-column sortable label="操作" min-width="100" fixed="right">
					<template slot-scope="scope"> 
						<el-button type="primary" @click="handleDel(scope.row,scope.$index)" icon="el-icon-right">移出部门</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件 
	import { listUserDept, delUserDept, batchDelUserDept } from '@/api/mdp/sys/userDept'; 
	import { mapGetters } from 'vuex' 
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['deptid','branchId','visible'],
		watch: {
	      'visible':function(visible) { 
	      	if(visible==true){
	      		this.searchUserDepts();
	      	}
	      } 
	   },
		data() {
			return {
				filters: {
					key: '',
					includeSubDept:'0'
				},
				userDepts: [],//查询结果
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
				
				addFormVisible: false,//新增userDept界面是否显示
				//新增userDept界面初始化数据
				addForm: {
					userid:'',deptid:'',enabled:'',seq:'',branchId:'',id:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑userDept界面初始化数据
				editForm: {
					userid:'',deptid:'',enabled:'',seq:'',branchId:'',id:''
				},
				tableHeight:500,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getUserDepts();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getUserDepts();
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
				this.getUserDepts();
			},
			searchUserDepts(){
				 
				 this.pageInfo.count=true;
				 this.getUserDepts();
			},
			//获取列表 UserDept 用户部门关系表
			getUserDepts() {
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
				}else{
					//params.xxx=xxxxx
				}
				params.deptid=this.deptid
				params.branchId=this.branchId
				if(this.deptid!=null && this.deptid!=''){
					params.includeSubDept=this.filters.includeSubDept//查询本部还是本部以下
				}else if(this.deptid==null || this.deptid==''){
					if(this.filters.includeSubDept='1'){
						params.deptid=this.userInfo.deptid
						params.includeSubDept=this.filters.includeSubDept//查询本部还是本部以下
					}
				}
				
				this.load.list = true;
				listUserDept(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;this.pageInfo.count=false;
						this.userDepts = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$notify({ message: '通讯错误', type: 'error' });
				});
			},

			//显示编辑界面 UserDept 用户部门关系表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 UserDept 用户部门关系表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getUserDepts();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行userDept
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除userDept
			handleDel: function (row,index) {
				this.load.del=true;
				this.$confirm('将用户移出部门，将同步取消该用户在该部门上拥有的岗位，进而取消该用户在该岗位上拥有的角色、菜单权限,确认移出部门吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					let params = row;
					delUserDept(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getUserDepts();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					});
				}).catch(() => {
					this.load.del=false;
				});
			},
			//批量删除userDept
			batchDel: function () {
				this.load.del=true;
				this.$confirm('将用户移出部门，将同步取消该用户在该部门上拥有的岗位，进而取消该用户在该岗位上拥有的角色、菜单权限,确认移出部门吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					batchDelUserDept(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getUserDepts(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.load.del=false;
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  
		     
		    //在下面添加其它组件
		},
		mounted() {    
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 300;   
			}); 
			this.$nextTick(() => {
				this.getUserDepts();
        	}); 
		}
	}

</script>

<style scoped>

</style>