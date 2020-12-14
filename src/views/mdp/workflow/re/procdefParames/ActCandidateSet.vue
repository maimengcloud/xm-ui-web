<template>
	<section>
		<el-row> 
			<el-row> 
				<el-col :span="8" class="table-box"> 
					<el-col :span="24"> 
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
						<el-button     @click.native="showSelectCandidatePosts" :loading="addPostsLoading">加岗位</el-button>
						<el-button  type="primary"   @click.native="confirm" :loading="addLoading">确认提交</el-button>
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
	
	import { listUserNames } from '@/api/mdp/sys/user';
	
	import {   listDept  } from '@/api/mdp/sys/dept'; 

	
	
	import {   listPost  } from '@/api/mdp/sys/post/post'; 

	export default {
		name:'ActCandidateSet',
	    computed: {
		    ...mapGetters([
		      'userInfo'
			]),
			screenWidth:function(){
				return screen.width;
			},
		},
		props:['actAssignee','visible'],
		watch: {
	       
		  'actAssignee':function(actAssignee){
			  if(actAssignee==null){
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
				users.forEach(e => {
					if(!this.candidateUsersData.some(i=>e.userid==i.userid)){
						this.candidateUsersData.push(e);
					}
				});
			
			},
			onSelectCandidatePosts:function(posts){
				this.selectCandidatePostsVisible=false; 
				posts.forEach(e => {
					if(!this.candidatePostsData.some(i=>e.id==i.id)){
						this.candidatePostsData.push(e);
					}
				});
				
			},
			onSelectCandidateDepts:function(){
				this.selectCandidateDeptsVisible=false; 
				var depts=this.$refs.deptSelectTree.$refs.deptTree.getCheckedNodes();
				depts.forEach(e => {
					if(!this.candidateDeptsData.some(i=>e.deptid==i.deptid)){
						this.candidateDeptsData.push(e);
					}
				});
				
			},
			delCandidateUsers:function(users){
				 users.forEach(e => {
					 var index = this.candidateUsersData.findIndex(i=>e.userid==i.userid);
					 this.candidateUsersData.splice(index,1);
				}); 
			},
			delCandidatePosts:function(posts){
				posts.forEach(e => {
					 var index = this.candidatePostsData.findIndex(i=>e.id==i.id);
					 this.candidatePostsData.splice(index,1);
				}); 
			},
			delCandidateDepts:function(depts){
				 depts.forEach(e => {
					 var index = this.candidateDeptsData.findIndex(i=>e.deptid==i.deptid);
					 this.candidateDeptsData.splice(index,1);
				});
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
				
				if(!this.actAssignee.nodeUsers){
					return;
				}
				this.usersListLoading=true;
				var userids=this.actAssignee.nodeUsers.map(i=>i.userid); 
				var params={userids:userids,branchId:this.userInfo.branchId};
				listUserNames(params).then(res=>{
					this.usersListLoading=false;
					this.candidateUsersData=res.data.data;
				});
			}, 
			getCandidateDeptsData(){
				
				if(!this.actAssignee.groupIds){
					return;
				}
				this.deptsListLoading=true;
				var deptids=this.actAssignee.groupIds.split(",").filter(i=>i.indexOf("_dept_">=0));
 				deptids=deptids.map(e=>e.substring(6));
				var params={deptids:deptids,branchId:this.userInfo.branchId};
				listDept(params).then(res=>{
					this.deptsListLoading=false;
					this.candidateDeptsData=res.data.data;
				});
				
			}, 
			getCandidatePostsData(){
				
				if(!this.actAssignee.groupIds){
					return;
				}
				this.postsListLoading=true;
				var postids=this.actAssignee.groupIds.split(",").filter(i=>i.indexOf("_post_">=0));
 				postids=postids.map(e=>e.substring(6));
				var params={ids:postids,branchId:this.userInfo.branchId};
				listPost(params).then(res=>{
					this.postsListLoading=false;
					this.candidatePostsData=res.data.data;
				}); 
			}, 
			confirm:function(){
				var actAssignee=Object.assign({},this.actAssignee);
				actAssignee.nodeUsers=this.candidateUsersData; 
				actAssignee.groupIds=this.candidateDeptsData.map(i=>"_dept_"+i.deptid).concat(this.candidatePostsData.map(i=>"_post_"+i.id)).join(",");
				actAssignee.candidate="1"
				actAssignee.candidateType="complex"
				this.$emit('confirm',actAssignee);
			}
			
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