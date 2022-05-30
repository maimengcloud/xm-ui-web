<template>
	<section class="border padding">
		<el-row  :gutter="20"> 
		<!--编辑界面 UserDept 用户部门关系表--> 
		<el-col :span="6"  style=" overflow-x:auto; height:550px;"> 
			<dept-tree v-loading="load.list" :branch-id="branch.id" :checked-keys="defaultChecked" default-expand-all show-checkbox multiple :expand-on-click-node="false" ref="nodeTree" @check-change="deptTreeCheckChange" @branch-row-click="branchChange"></dept-tree> 
 		</el-col>
		<el-col :span="18">
			<el-form :model="editForm"   label-width="160px" label-position="left" v-loading="load.list" :rules="editFormRules" ref="editForm"> 
			 <h3>【{{user.username}}】加入的部门及拥有的岗位如下： 
			  <el-tooltip class="item" effect="dark" content="如果选中的部门没有岗位，请先到【部门管理  -> 岗位设置 】将岗位与部门关联" placement="top">
							      <i class="el-icon-question"></i>
						</el-tooltip>
			 </h3>
			 <el-row class="padding-top">
				<el-card class="box-card" v-for="(item,index) in allDeptDeptPosts" :key="index" :body-style="{background: 'rgba(244, 245, 248, 1)'}">
			    	<div slot="header" class="card-header"> 
						<span>部门： {{item.deptName}} </span>	 
					</div> 
					<el-row :gutter="50">
						<el-col :span="10">
							<span v-if=" !item.deptPosts || item.deptPosts.filter(i=>i.checked==='1').length<=0">
								请选择岗位
							</span>
							<span v-else>
								<el-checkbox v-for="deptPost in item.deptPosts.filter(i=>i.checked==='1')" v-model="deptPost.checked" :true-label="'1'" :false-label="'0'" :key="deptPost.postId" :disabled="deptPost.disabled">{{deptPost.postName}}</el-checkbox>
							</span> 
						</el-col>
						<el-col :span="14"  class="" v-if="item.deptPosts && item.deptPosts.filter(i=>i.checked!=='1').length>0">
							<div class="bg-right border padding">
							 <el-checkbox   v-for="deptPost in item.deptPosts.filter(i=>i.checked!=='1')" v-model="deptPost.checked" :true-label="'1'" :false-label="'0'" :key="deptPost.postId" :disabled="deptPost.disabled">{{deptPost.postName}}</el-checkbox>
							</div>
						</el-col>
						<span v-if="!item.deptPosts || item.deptPosts.length<=0">
							该部门还没有设立岗位
						</span>
					</el-row>  
			    </el-card>
			</el-row>
				<el-form-item> 
					<el-row class="padding">
					<el-col :span="4" :offset="6"> 
						<el-button @click.native="handleCancel">取消</el-button> 
					</el-col>
					<el-col :span="4"> 
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit">提交</el-button>  
					</el-col> 
					</el-row>
				</el-form-item> 
			</el-form>
			</el-col>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库 
	import { editUserDept, listUserDept, batchEditUserDept } from '@/api/mdp/sys/userDept';
	import { listDept } from '@/api/mdp/sys/dept';
	import DeptTree from '../dept/DeptTree.vue';//下拉框数据查询
	import { listBranch } from '@/api/mdp/sys/branch';
	import { mapGetters } from 'vuex' 
	import { listDeptPost, delDeptPost, batchDelDeptPost,batchAddDeptPost } from '@/api/mdp/sys/post/deptPost';  
	import { listDeptPostUserWithDeptPosts } from '@/api/mdp/sys/post/deptPostUser';  
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
			]),
			noQxDeptids(){ 
				return [];
			},
			defaultChecked(){
				return this.userDepts.map(i=>i.deptid);
			},
		},
		props:['userDept','visible','user','branch'],
		watch: {
	      'visible':function(visible) { 
	      	if(visible==true){
	      		 this.allDeptDeptPosts=[]
				   this.userDepts=[];  
				   this.treeCheckDeptids=[];
				   if(this.$refs.nodeTree.branch!=null){
					   this.getUserDepts(this.$refs.nodeTree.branch);
				   }else{
					   this.getUserDepts(this.branch);
				   }
		    	 
	      		 //this.load.list=false;
			  }
	      },
		  treeCheckDeptids(val){
			  if(val==null || val.length==0){
				  return;
			  }
			  this.getDeptPostUserWithDeptPosts(val)
		  }
	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					userid: [
						{ required: true, message: '用户编号不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  UserDept 用户部门关系表
				editForm: {
					userid:'',deptid:'',enabled:'',seq:'',branchId:'',id:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/ 
				userDepts:[],   
				treeCheckDeptids:[],
				allDeptDeptPosts: [],//部门岗位关系[{deptid:'',deptName:'',deptPosts:[{deptid:'',postId:'',postName:'',checked:''}]}] 
				 
				/**end 在上面加自定义属性**/
			}//end return
		},//end data 
		
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			branchChange: function(branch){
				this.allDeptDeptPosts=[];
				this.getUserDepts(branch)
			},
			//编辑提交UserDept 用户部门关系表父组件监听@submit="afterEditSubmit"
			editSubmit: function () { 
						if(this.user.userid==''){
							this.$notify.error('用户不能为空');
							return;
						}
						this.load.edit=true
						var msg="确认提交吗？";
						this.$confirm(msg, '提示', {}).then(() => { 
							console.log("xxxxxxxxxxxxxx");
							let delDeptids=[];
							let deptids=this.treeCheckDeptids; 
							this.userDepts.forEach(ud=>{
								if(!this.noQxDeptids.some(d=>d==ud.deptid)){
									if(!deptids.some(deptid=>deptid==ud.deptid)){
										delDeptids.push(ud.deptid)
									}
								}
							})
							let addDeptPostUsers=[];
							let delDeptPostUsers=[];
							this.allDeptDeptPosts.forEach(i=>{
 								i.deptPosts.forEach(k=>{
 									if(k.checked=='1'){
 										k.userid=this.user.userid
 										addDeptPostUsers.push(k)
 									}else if(k.checked=='0' && k.id!=''){ 
 										delDeptPostUsers.push(k)
 									}
 								})
							})
							console.log("ffffffffffffffffffffffffffffffffffffffffffffffffff");
							
							let branch=this.$refs.nodeTree.branch; 
							let params = {branchId:branch==null?this.branch.id:branch.id,userid:this.user.userid,deptids:deptids,delDeptids:delDeptids,delDeptPostUsers:delDeptPostUsers,addDeptPostUsers:addDeptPostUsers}
							batchEditUserDept(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch((e) => {
								console.log(e)
								this.load.edit=false
							});
						}).catch((e)=>{
							console.log(e)
							this.load.edit=false; 
						})
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			getUserDepts(branch){
				this.load.list=true
				let params={userid:this.user.userid}; 
					params.branchId=branch.id; 
				
				listUserDept(params).then(res=>{ 
					this.load.list=false
					let uds=res.data.data
					this.userDepts=uds; 
					this.treeCheckDeptids=this.userDepts.map(i=>i.deptid)  
					
				}).catch(()=>this.load.list=false);
			},
			deptTreeCheckChange: function(data,checked,indeterminate){ 
				if(checked==false){
					this.treeCheckDeptids=this.treeCheckDeptids.filter(i=>i!=data.deptid)
				}else{
					if(!this.treeCheckDeptids.some(i=>i==data.deptid)){
						this.treeCheckDeptids.push(data.deptid)
					}
				} 
				
			},
			getDeptPostUserWithDeptPosts: function(deptids){ 
				this.load.list=true 
				let params={userid: this.user.userid,deptids:deptids}
				this.allDeptDeptPosts=[]
				listDeptPostUserWithDeptPosts(params).then(res=>{ 
					this.load.list=false 
					let allDeptDeptPosts=[];
					let deptPosts=res.data.deptPosts
					if(!deptPosts){
						deptPosts=[]
					}
					let deptPostUsers=res.data.deptPostUsers
					if(!deptPostUsers){
						deptPostUsers=[]
					}
					deptPosts.forEach(i=>{
						i.id='';
						i.checked='0'
						i.disabled=this.noQxDeptids.some(n=>n==i.deptid)
						if(deptPostUsers.some(k=>{ 
							if(k.deptid==i.deptid && k.postId==i.postId){
								i.id=k.id
								return true
							}else{
								return false
							}
						})){
							i.checked='1'
						}
					})
					deptPosts.forEach(i=>{
						if(allDeptDeptPosts.some(k=>k.deptid==i.deptid )){
							allDeptDeptPosts.forEach(j=>{
								if(j.deptid==i.deptid){
									j.deptPosts.push(i)
								}
							})
						}else{
							allDeptDeptPosts.push({deptid:i.deptid,deptName:i.deptName,deptPosts:[i]})
						}
						
					})
					this.allDeptDeptPosts=allDeptDeptPosts 
				}).catch((e)=>{ 
					this.load.list=false; 
				})
			},
			goToSetDeptPostPage:function(){
				this.$router.push({path:'/mdp/sys/dept/DeptMng'});
			}
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'user-dept-edit':UserDeptEdit
			DeptTree
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.userDept);    
			this.getUserDepts(this.branch) 
		}
	}

</script>

<style scoped> 
 .bg-right{
	background: rgba(255, 255, 255, 1); 
 }  
 .card-body{
	 background: rgba(244, 245, 248, 1);
 }
 .card-header{
	  background: rgba(242, 242, 242, 0)
 }
</style>