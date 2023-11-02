<template>
	<section>
		<el-row>
		<el-form :model="editForm"  label-width="140px" :rules="editFormRules" ref="editForm">  
			
			<el-form-item label="指定候选人" prop="nodeUsers" >
				<mdp-select-user :multiple="true" :value="editForm.nodeUsers?editForm.nodeUsers.map(k=>k.userid):[]"   placeholder="请选择" @change2="(users)=>{
					editForm.nodeUsers=users.map(k=>{
						return {userid:k.userid,username:k.username,branchId:k.branchId}
					})
				}"/>  
			</el-form-item>   
			<el-form-item label="候选角色" prop="hxRoleids" >
				<mdp-select  :multiple="true" v-model="editForm.hxRoleids"   placeholder="请选择" split="," :options="roles" :props="{id:'roleid',name:'rolename'}"/>
			</el-form-item>  
			<el-form-item label="候选岗位" prop="hxPostids" >
				<mdp-select  :multiple="true" v-model="editForm.hxPostids"   placeholder="请选择" split="," :options="roles" :props="{id:'id',name:'postName'}"/>
			</el-form-item>  
			<el-form-item label="候选部门" prop="hxDeptids"> 
				<mdp-select-dept  v-model="editForm.hxDeptids" multiple  split=","/>
			</el-form-item>   
			</el-form>
		</el-row> 
		<el-row class="footer">   
			<el-button @click.native="$emit('close')">关闭</el-button>  
			<el-button v-loading="load.edit" type="primary" @click.native="confirm" :disabled="load.edit==true">提交</el-button>   
		</el-row> 
	</section>
</template>

<script>
import { mapGetters } from 'vuex'   

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
	      'visible':function(visible){
			  if(visible==false){
				  return;
			  }
			 this.initData();
			   
	      }
	    },	
		data() { 
				  
			return {
				load:{edit:false,},
				 editForm:{
					candidate:"1",
					nodeUsers:[],
					hxRoleids:'',
					hxDeptids:'',
					hxPostids:''
				 },
				 roles:[],
				 posts:[],

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: { 
			 initData(){
				if(this.actAssignee){
					this.editForm.nodeUsers=this.actAssignee.nodeUsers
					this.editForm.hxRoleids=this.actAssignee.hxRoleids
					this.editForm.hxDeptids=this.actAssignee.hxDeptids
					this.editForm.hxPostids=this.actAssignee.hxPostids
				}else{
					this.editForm={...this.editFormInit}
				}
			 },
			confirm:function(){
				var actAssignee=Object.assign(this.actAssignee,this.editForm);
   				this.$emit('confirm',actAssignee);
			}
			
		},//end method
		components: {    
		},
		mounted() { 
			this.initData();
			 this.editFormInit={...this.editForm}
			this.$mdp.listRole({branchId:"$IN"+this.userInfo.branchId+","+"platform-branch-001"}).then(res=>this.roles=res.data.data) 
			/**在下面写其它函数***/
			this.$mdp.listPost({branchId:"$IN"+this.userInfo.branchId+","+"platform-branch-001"}).then(res=>this.posts=res.data.data) 
			
		}//end mounted
	}

</script>

<style scoped> 
</style>