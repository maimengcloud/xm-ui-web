<template>
	<section>  
		<el-row>
			<el-col :span="6" style=" overflow-x:auto; max-height:600px;">
				<dept-tree ref="deptTree" show-root default-expand-all show-checkbox :expand-on-click-node="false"  @node-click="handleLeftDeptNodeClick" @branch-row-click="branchRowClick"></dept-tree>
			</el-col>
			<el-col :span="18">
				<el-row>
					<el-input v-model="filters.key" style="width: 40%;" placeholder="名称 编号 手机号码 模糊查询"></el-input>
					<el-button type="primary" v-loading="load.list" v-on:click="searchUsers">查询</el-button>
					<el-button type="primary" v-if="sels.length>0"  v-on:click="confirmUsers">确定</el-button>
				</el-row>
				<el-row class="selected-tag">
					<span v-for="sel in sels" :key="sel.userid" style="margin-left:5px;">
					<el-tag
						 type="plain"
						closable @close="unselectUser(sel)" @click="unselectUser(sel)">
						{{sel.username}}
					</el-tag>
					</span>
					<el-button type="text"
						v-if="sels.length>0" 
						@click="clearAll"> <font color="red">清空</font>
					</el-button>

				</el-row>
				<!--列表 User sys_user-->
				<el-table :row-key="'userid'" :height="maxTableHeight" :data="users" current-row-key="userid"    @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" style="width: 100%;" ref="userTable" @row-click="rowClick">
					<el-table-column :reserve-selection="true"	type="selection" width="65"></el-table-column>
					<el-table-column type="index" width="65"></el-table-column>
					<el-table-column prop="username" sortable label="用户名称" min-width="120" >
						<template slot-scope="scope">
							<div class="avatar-container" @click="showEdit(scope.$index,scope.row)">
								<div class="avatar-wrapper">
									<img v-if=" scope.row.headimgurl " class="user-avatar" :src="scope.row.headimgurl">
									<img v-else class="user-avatar" src="../../../../assets/image/user_img.gif">
									<span class="username"><i v-if="scope.row.sex=='0'" class="el-icon-female"></i><i v-else class="el-icon-male"></i> {{scope.row.username}}</span> 
								</div>    
							</div>
						</template>
					</el-table-column>

					<el-table-column prop="displayUserid" label="登录账号" min-width="150" ></el-table-column>
					<el-table-column prop="sex" label="性别" width="80">
						<template slot-scope="scope">
							<el-tag v-if="scope.row.sex=='0'">男</el-tag>
							<el-tag v-if="scope.row.sex=='1'">女</el-tag>
							<el-tag v-if="scope.row.sex=='2'">其它</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="locked" label="状态" width="80" >
						<template slot-scope="scope">
							<el-tag v-if="scope.row.locked=='0'">√</el-tag>
							<el-tag v-else>×</el-tag>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
			</el-col>
		</el-row> 
		
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库 
	import { listUser } from '@/api/mdp/sys/user';
	import DeptTree from '@/views/mdp/sys/dept/DeptTree.vue';
	import { mapGetters } from 'vuex' 

	export default {
		props:['isSingleUser'],
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		watch:{
			 
		},
		data() {
			return {
				filters: {
					key: '', 
				},
				users: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				allSels:[],//所有选中的数据
				options:{sex:[],locked:[]},//下拉选择框的所有静态数据 options.sex,options.project

				addFormVisible: false,//新增user界面是否显示
				//新增user界面初始化数据
				addForm: {
					unionid:'',displayUserid:'',userid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',password:'',salt:'',fingerpassword1:'',fingerpassword2:'',fingerpassword3:'',fingerpassword4:'',pwdtype:'',headimgurl:'',country:'',city:'',province:'',address:'',sex:'',enddate:'',districtId:'',userId:'',userAccount:'',userPwd:'',userName:'',userDesc:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑user界面初始化数据
				editForm: {
					unionid:'',displayUserid:'',userid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',password:'',salt:'',fingerpassword1:'',fingerpassword2:'',fingerpassword3:'',fingerpassword4:'',pwdtype:'',headimgurl:'',country:'',city:'',province:'',address:'',sex:'',enddate:'',districtId:'',userId:'',userAccount:'',userPwd:'',userName:'',userDesc:''
				},
				/**begin 自定义属性请在下面加 请加备注**/ 
				editUserRoleFormVisible:false,//是否显示用户角色界面
				editUserDeptFormVisible:false,//是否显示用户部门关系设置界面
				branch: {},//选中的机构  
				maxTableHeight:300,


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
				//判断是否需要通过部门查询
				if(this.isSelectByDept && Object.keys(this.deptTree.deptNodeSelected).length === 0) {
					this.$notify({position:'bottom-left',showClose:true,message: "必须先选择一个部门", type: 'error' });
					return;
				}

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
					params.key="%"+this.filters.key+"%";
				}
				var deptids=this.$refs.deptTree.$refs.deptTree.getCheckedKeys();
				if( deptids && deptids.length>0){
					params.deptid=deptids[0]
				}   
				if(this.branch && this.branch.id){
					params.branchId=this.branch.id
				}
				this.load.list = true;
				listUser(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;this.pageInfo.count=false;
						this.users = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					//this.setTableUserChecked();

					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$notify({position:'bottom-left',showClose:true,message: '通讯错误', type: 'error' });
				});
			},

			//显示编辑界面 User sys_user
			showEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 User sys_user
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getUsers();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行user
			selsChange: function (sels) {
				 this.sels=sels
			},
			setTableUserChecked(){
				if(this.sels.length>0){
					var sels=JSON.parse(JSON.stringify(this.sels))  
					this.$refs.userTable.clearSelection();
					sels.forEach(k=>{
						this.$refs.userTable.toggleRowSelection(k,true)
					})
				} 
			},
			confirmUsers: function(){
				if(this.sels.length<1){
					this.$notify({position:'bottom-left',showClose:true,message: "请选择一个用户", type: 'error' });
					return;
				}
				if(this.isSingleUser==true){
					if(this.sels.length!=1){
						this.$notify({position:'bottom-left',showClose:true,message: "最多只能选择一个用户", type: 'error' });
						return;
					}
				}  
  				this.$emit('confirm',this.sels);
			},
			branchRowClick: function(row, event, column){
				if(this.branch==null || row.id!=this.branch.id){
					this.branch=row
					this.deptTree.deptNodeSelected={}
					this.searchUsers();

				}
			},
			
			rowClick: function(row, event, column){ 
				this.$refs.userTable.toggleRowSelection(row);
			},
			unselectUser:function(user){
				this.$refs.userTable.toggleRowSelection(user,false); 
			},

			/**begin 自定义函数请在下面加**/
			handleLeftDeptNodeClick(data, node,comp) {
				if( node.level==1 ){
					 this.branch={id:data.branchId,branchName:data.deptName}
				}  
				 
				this.searchUsers(); 

		    },
			clearAll(){
				this.$refs.userTable.clearSelection()
			}
			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    'dept-tree': DeptTree,
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(()=>{
				 this.maxTableHeight = util.calcTableMaxHeight(this.$refs.userTable.$el)-50
				this.branch={id:this.userInfo.branchId,branchName:this.userInfo.branchName} 
				this.getUsers();
			})
           

		}
	}

</script>

<style lang="scss" scoped>
.selected-tag { 
	 
}
.avatar-container {
    height: 50px;
    display: flex;
    align-items: center;
    .avatar-wrapper {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        .user-avatar {
            height: 34px;
            width: 34px;
            border-radius: 50%;
            margin-right: 12px;
        }
        .username{
            color: #7D7D7D;
            font-size: 14px; 
        }
        .el-icon-caret-bottom {
            font-size: 22px;
        }
    }
}
</style>
