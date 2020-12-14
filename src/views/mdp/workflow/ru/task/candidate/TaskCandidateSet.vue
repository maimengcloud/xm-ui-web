<template>
	<section>
		<el-row> 
			<el-row> 
				<el-col :span="8" class="table-box"> 
					<el-col :span="24">
						<el-button    @click.native="getCandidateUsersData" :loading="usersListLoading">查询</el-button> 
						<el-button    @click.native="showSelectCandidateUsers" :loading="addUsersLoading">加人员</el-button> 
					</el-col>
					<el-col :span="24">
					<el-table
							ref="candidateDeptsDataTable"
							:data="candidateUsersData"
							tooltip-effect="dark"
							style="width: 100%"
							v-loading="usersListLoading"
							> 
							<el-table-column
								prop="username"
								label="姓名"
								min-width="120" >
							</el-table-column> 
							<el-table-column
								prop="displayUserid"
								label="登陆账号"
								min-width="120"  >
							</el-table-column> 
							<el-table-column
								prop=" "
								label="操作"
								width="120">
								<template slot-scope="scope"> 
									<el-button type="text" @click="delCandidateUsers([scope.row],scope.$index)">移除</el-button>
								</template>
							</el-table-column> 
					</el-table>
					</el-col>
				</el-col>
				<el-col :span="8">
					<el-col :span="24">
						<el-button    @click.native="getCandidateDeptsData" :loading="deptsListLoading">查询</el-button> 
						<el-button    @click.native="showSelectCandidateDepts" :loading="addDeptsLoading">加部门</el-button> 
					</el-col>
					<el-col :span="24">
					<el-table
							ref="candidateDeptsDataTable"
							:data="candidateDeptsData"
							tooltip-effect="dark"
							style="width: 100%"
							v-loading="deptsListLoading"
							>
							<el-table-column
								prop="deptName"
								label="部门名称"
								min-width="120" >
							</el-table-column> 
							<el-table-column
								prop=" "
								label="操作"
								width="120">
								<template slot-scope="scope"> 
									<el-button type="text" @click="delCandidateDepts([scope.row],scope.$index)">移除</el-button>
								</template>
							</el-table-column> 
					</el-table>
					</el-col>
				</el-col>
				<el-col :span="8">
					<el-col :span="24">
						<el-button    @click.native="getCandidatePostsData" :loading="postsListLoading">查询</el-button> 
						<el-button     @click.native="showSelectCandidatePosts" :loading="addPostsLoading">加岗位</el-button>
					</el-col>
					<el-col :span="24">
					<el-table
							ref="candidatePostsDataTable"
							:data="candidatePostsData"
							tooltip-effect="dark"
							style="width: 100%"
							v-loading="postsListLoading"
							>
							<el-table-column
								prop="postName"
								label="岗位名称"
								min-width="120" >
							</el-table-column> 
							<el-table-column 
								label="操作"
								width="120">
								<template slot-scope="scope"> 
									<el-button type="text" @click="delCandidatePosts([scope.row],scope.$index)">移除</el-button>
								</template>
							</el-table-column> 
					</el-table>
					</el-col>
				</el-col>
			</el-row>  
			<el-dialog append-to-body
				title="选择候选岗位"
				:visible.sync="selectCandidatePostsVisible"
				width="60%">
					<post-select-common  :branchId="userInfo.branchId" @select="onSelectCandidatePosts"></post-select-common> 
			</el-dialog> 
			<el-dialog append-to-body
				title="选择候选部门"
				:visible.sync="selectCandidateDeptsVisible"
				width="60%">
					<dept-tree multiple show-checkbox ref="deptSelectTree" defaultExpandAll></dept-tree>
					<span slot="footer" class="dialog-footer">
						<el-button @click="selectCandidateDeptsVisible = false">取 消</el-button>
						<el-button type="primary" @click="onSelectCandidateDepts">确 定</el-button>
					</span>
			</el-dialog> 
			
			<el-dialog append-to-body
				title="选择候选人"
				:visible.sync="selectCandidateUsersVisible"
				width="60%"> 
				<users-select  @confirm="onSelectCandidateUsers"></users-select> 
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import seq from '@/common/js/sequence';//全局公共库
	import util from '@/common/js/util';//全局公共库import 
	import config from '@/common/config';//全局公共库import   
	import Sticky from '@/components/Sticky' // 粘性header组件
	import { mapGetters } from 'vuex'
	import { listCandidateUsers,listCandidateDepts,listCandidatePosts,addCandidate,delCandidate   } from '@/api/mdp/workflow/ru/task';
	import DeptTree from '@/views/mdp/sys/dept/DeptTree'; 
	import PostSelectCommon from '@/views/mdp/sys/post/PostSelectCommon'; 
	import UsersSelect from '@/views/mdp/sys/user/UsersSelect';  

	export default {
		name:'TaskCandidateSet',
	    computed: {
		    ...mapGetters([
		      'userInfo'
			]),
			screenWidth:function(){
				return screen.width;
			},
		},
		props:['taskId','procInstId','visible'],
		watch: {
	      'procInstId':function( procInstId ) { 
	    	  
		  }, 
		  'taskId':function(taskId){
			  if(taskId==null || taskId==''){
				  return;
			  }
			 this.getCandidateUsersData();
			 this.getCandidateDeptsData();
			 this.getCandidatePostsData();
		  },
	      'visible':function(visible){
			  if(visible==false){
				  return;
			  }
			   
	      }
	    },	
		data() { 
				  
			return {
				addLoading:false,
				addPostsLoading:false,
				addDeptsLoading:false,
				addUsersLoading:false,
				usersListLoading:false,
				deptsListLoading:false,
				postsListLoading:false,
				candidateUsersData:[],
				candidateDeptsData:[],
				candidatePostsData:[],
				selectCandidateUsersVisible:false,
				selectCandidateDeptsVisible:false,
				selectCandidatePostsVisible:false,

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: { 
			onSelectCandidateUsers:function(users){
				this.selectCandidateUsersVisible=false;
				this.addUsersLoading=true;
				var params={
					taskId:this.taskId,
					procInstId:this.procInstId,
					branchId:this.userInfo.branchId,
					userids:users.map(i=>i.userid),
					deptids:[],
					postids:[]
				}
				addCandidate(params).then(res=>{
					this.addUsersLoading=false;
					if(res.data.tips.isOk){
						this.getCandidateUsersData();
						this.$message.success(res.data.tips.msg);
						
					}else{
						this.$message.error(res.data.tips.msg);
					}
				}).catch(e=>{
					this.addUsersLoading=false;
				});
			
			},
			onSelectCandidatePosts:function(posts){
				this.selectCandidatePostsVisible=false;
				this.addPostsLoading=true;
				var params={
					taskId:this.taskId,
					procInstId:this.procInstId,
					branchId:this.userInfo.branchId,
					userids:[],
					deptids:[],
					postids:posts.map(i=>i.id)
				}
				addCandidate(params).then(res=>{
					this.addPostsLoading=false;
					if(res.data.tips.isOk){
						this.getCandidatePostsData();
						this.$message.success(res.data.tips.msg);
						
					}else{
						this.$message.error(res.data.tips.msg);
					}
				}).catch(e=>{
					this.addPostsLoading=false;
				});;
				
			},
			onSelectCandidateDepts:function(){
				this.selectCandidateDeptsVisible=false;
				this.addDeptsLoading=true;
				var depts=this.$refs.deptSelectTree.$refs.deptTree.getCheckedNodes();
				var params={
					taskId:this.taskId,
					procInstId:this.procInstId,
					branchId:this.userInfo.branchId,
					userids:[],
					deptids:depts.map(i=>i.deptid),
					postids:[]
				}
					
				addCandidate(params).then(res=>{
					this.addDeptsLoading=false;
					if(res.data.tips.isOk){
						this.getCandidateDeptsData();
						this.$message.success(res.data.tips.msg);
					
					}else{
						this.$message.error(res.data.tips.msg);
					}
				}).catch(e=>{
					this.addDeptsLoading=false;
				});;
				
			},
			delCandidateUsers:function(users){
				var params={
					taskId:this.taskId,
					procInstId:this.procInstId,
					branchId:this.userInfo.branchId,
					userids:users.map(i=>i.userid),
					deptids:[],
					postids:[]
				}
				delCandidate(params).then(res=>{
					if(res.data.tips.isOk){
						this.getCandidateUsersData();
						this.$message.success(res.data.tips.msg);
					}else{
						this.$message.error(res.data.tips.msg);
					}
				});
				this.selectCandidateUsersVisible=false;
			},
			delCandidatePosts:function(posts){
				var params={
					taskId:this.taskId,
					procInstId:this.procInstId,
					branchId:this.userInfo.branchId,
					userids:[],
					deptids:[],
					postids:posts.map(i=>i.postid)
				}
				delCandidate(params).then(res=>{
					if(res.data.tips.isOk){
						this.getCandidatePostsData();
						this.$message.success(res.data.tips.msg);
					}else{
						this.$message.error(res.data.tips.msg);
					}
				});
				this.selectCandidatePostsVisible=false;
			},
			delCandidateDepts:function(depts){
				var params={
					taskId:this.taskId,
					procInstId:this.procInstId,
					branchId:this.userInfo.branchId,
					userids:[],
					deptids:depts.map(i=>i.deptid),
					postids:[]
				}
				delCandidate(params).then(res=>{
					if(res.data.tips.isOk){
						this.getCandidateDeptsData();
						this.$message.success(res.data.tips.msg);
					}else{
						this.$message.error(res.data.tips.msg);
					}

				});
				this.selectCandidateDeptsVisible=false;
			},
			showSelectCandidateUsers:function(){
				this.selectCandidateUsersVisible=true;
			},
			showSelectCandidateDepts:function(){
				this.selectCandidateDeptsVisible=true;
			},
			showSelectCandidatePosts:function(){
				this.selectCandidatePostsVisible=true;
			}, 
			getCandidateUsersData(){
				this.usersListLoading=true;
				var params={procInstId:this.procInstId,taskId:this.taskId,branchId:this.userInfo.branchId};
				listCandidateUsers(params).then(res=>{
					this.usersListLoading=false;
					this.candidateUsersData=res.data.data;
				});
			}, 
			getCandidateDeptsData(){
				this.deptsListLoading=true;
				var params={procInstId:this.procInstId,taskId:this.taskId,branchId:this.userInfo.branchId};
				listCandidateDepts(params).then(res=>{
					this.deptsListLoading=false;
					this.candidateDeptsData=res.data.data;
				});
				
			}, 
			getCandidatePostsData(){
				this.postsListLoading=true;
				var params={procInstId:this.procInstId,taskId:this.taskId,branchId:this.userInfo.branchId};
				listCandidatePosts(params).then(res=>{
					this.postsListLoading=false;
					this.candidatePostsData=res.data.data;
				}); 
			}, 
			
		},//end method
		components: {   
			'sticky': Sticky,
			UsersSelect,PostSelectCommon,DeptTree
		},
		mounted() { 
			 
			 this.getCandidateUsersData();
			 this.getCandidateDeptsData();
			 this.getCandidatePostsData();
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>
h1 {font-size:2.5em;} /* 40px/16=2.5em */
h2 {font-size:1.875em;} /* 30px/16=1.875em */
p {font-size:0.875em;} /* 14px/16=0.875em */
.title {
	text-align: center;
	font: outline;
	font-size:2.5em;
	margin-top: 0.875em;
}
.sub-title {
	text-align: center;
	font: outline;
	font-size:1.875em;
	margin-top: 0.875em;
	margin-bottom: 0.875em;
}
.table-box {
	border:1px;
}
</style>