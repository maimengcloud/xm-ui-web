<template>
	<section>
		<el-row>
		<el-form :model="editForm"  label-width="140px" :rules="editFormRules" ref="editForm">  
			
			<el-form-item label="指定候选人" prop="hxUserids" >
				<mdp-select-user :multiple="true" v-model="hxUserids"   placeholder="请选择"  split=","/>  
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

import {listCandidates,addCandidates } from '@/api/mdp/workflow/ru/task';  

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
		props:['taskId','visible'],
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
					hxUserids:'',
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
				if(this.taskId){
					listCandidates({taskId:this.taskId}).then(res=>{
						this.editForm={...res.data.data}
					})
				}else{
					this.editForm={...this.editFormInit} 
				}
				 
			 },
			confirm:function(){
				var params={...this.editForm}
				params.taskId=this.taskId
				addCandidates(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						this.$emit('confirm',params);
					}
					this.$notify({position:'bottom-left',showClose: true,
						message: tips.msg,
						type: tips.isOk?"success":"error"
					});
				})
   				
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