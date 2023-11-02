<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="140px" :rules="editFormRules" ref="editForm">
				 
				<el-card>
					<div slot="header" class="clearfix">
						<span>字段【{{ title }}】的【查询】权限</span> 
						<el-checkbox v-model="editForm.othQuery" true-label="1" false-label="0">可查询</el-checkbox>
					</div> 
					<span v-if="editForm.othQuery=='1'"> 
						<el-form-item label="最低查询等级" prop="qryMinLvl" >
							<mdp-select item-code="dataLvl" v-model="editForm.qryMinLvl"   placeholder="请选择"/>  
						</el-form-item> 
						<el-form-item label="允许哪些人查询" prop="qryUserids" >
							<mdp-select-user :multiple="true" v-model="editForm.qryUserids"   placeholder="请选择" split=","/>  
						</el-form-item> 
						<el-form-item label="允许哪些角色查询" prop="qryRoleids" >
							<mdp-select  :multiple="true" v-model="editForm.qryRoleids"   placeholder="请选择" split="," :options="roles" :props="{id:'roleid',name:'rolename'}"/>
						</el-form-item> 
						<el-form-item label="允许哪些部门查询" prop="qryDeptids"> 
							<mdp-select-dept  v-model="editForm.qryDeptids" multiple  split=","/>
						</el-form-item>  
						
						<el-form-item label="禁止哪些人查询" prop="nqUserids"  > 
							<mdp-select-user :multiple="true" v-model="editForm.nqUserids"   placeholder="请选择" split=","/> 
						</el-form-item>   
						<el-form-item label="禁止哪些角色查询" prop="nqRoleids" > 
							<mdp-select :multiple="true" v-model="editForm.nqRoleids"   placeholder="请选择" split="," :options="roles" :props="{id:'roleid',name:'rolename'}"/>
						</el-form-item> 
						<el-form-item label="禁止哪些部门查询" prop="nqDeptids">
							<mdp-select-dept  v-model="editForm.nqDeptids" multiple  split=","/>
						</el-form-item> 
					</span>
				</el-card> 
				
				<el-card>
					<div slot="header" class="clearfix">
						<span>字段【{{ title }}】的【修改】权限</span>
						<el-checkbox v-model="editForm.othEdit" true-label="1" false-label="0">可修改</el-checkbox>
					</div> 
					<span v-if="editForm.othEdit=='1'"> 
						<el-form-item label="最低修改等级" prop="editMinLvl" >
							<mdp-select item-code="dataLvl" v-model="editForm.editMinLvl"   placeholder="请选择"/>  
						</el-form-item> 
						<el-form-item label="允许哪些人修改" prop="editUserids" >
							<mdp-select-user :multiple="true" v-model="editForm.editUserids"   placeholder="请选择" split=","/>  
						</el-form-item> 
						<el-form-item label="允许哪些角色修改" prop="editRoleids" >
							<mdp-select  :multiple="true" v-model="editForm.editRoleids"   placeholder="请选择" split="," :options="roles" :props="{id:'roleid',name:'rolename'}"/>
						</el-form-item> 
						<el-form-item label="允许哪些部门修改" prop="editDeptids"> 
							<mdp-select-dept  v-model="editForm.editDeptids" multiple  split=","/>
						</el-form-item>  
						<el-form-item label="禁止哪些人修改" prop="neUserids"  > 
							<mdp-select-user :multiple="true" v-model="editForm.neUserids"   placeholder="请选择" split=","/> 
						</el-form-item>   
						<el-form-item label="禁止哪些角色修改" prop="neRoleids" > 
							<mdp-select :multiple="true" v-model="editForm.neRoleids"   placeholder="请选择" split="," :options="roles" :props="{id:'roleid',name:'rolename'}"/>
						</el-form-item> 
						<el-form-item label="禁止哪些部门修改" prop="neDeptids">
							<mdp-select-dept  v-model="editForm.neDeptids" multiple  split=","/>
						</el-form-item> 
					</span>
				</el-card>  
			</el-form>
		</el-row> 
		<el-row class="footer">   
			<el-button @click.native="close()">关闭</el-button>  
			<el-button v-loading="load.edit" type="primary" @click.native="saveSubmit2" :disabled="load.edit==true">提交</el-button>   
		</el-row> 
	</section>
</template>

<script> 
import { mapGetters } from 'vuex'
 
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';
export default { 
    mixins:[MdpFormMixin],
	computed: {
		...mapGetters([
			'userInfo'
		])
	},
	props:{
		value:{
			type:String,
			default:'',
		},
		title:{
			type:String,
			default:'',
		}
	},
	watch: {  
	},
	data() {
		return {
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                id:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },			
			editForm: {
				formId:'',qryRoleids:'',qryDeptids:'',qryUserids:'',nqRoleids:'',nqDeptids:'',nqUserids:'',editRoleids:'',editDeptids:'',editUserids:'',neRoleids:'',neDeptids:'',neUserids:'',delRoleids:'',delDeptids:'',delUserids:'',ndRoleids:'',nddDeptids:'',ndUserids:'',othQuery:'0',othEdit:'0',othDel:'0',lvlCheck:'0',qryMinLvl:'',editMinLvl:'',delMinLvl:''
			}, 

 
		}//end return
	},//end data
	methods: { 
		//由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
		initCurrData(){ 
			
			 if(this.value && this.value.indexOf("{")==0){
				this.editForm=Object.assign({},JSON.parse(this.value))
			 } 
         }, 
		saveSubmit2(){ 
			
			var form={...this.editForm}
			Object.keys(this.editForm).forEach(k=>{
				if(!form[k] ||form[k]=='0'){
					delete form[k]
				}
			})
			var val=''
			if(Object.keys(form).length==0){
				val=''
			}else{
				val=JSON.stringify(form)
			}
			
			this.$emit('input',val)
			this.$emit('change',val)
			this.$emit('change2',form)
			this.$emit('submit',val)
		}
	},//end method
	components: {   
	},
	mounted() { 
		this.$mdp.listRole({branchId:"$IN"+this.userInfo.branchId+","+"platform-branch-001"}).then(res=>this.roles=res.data.data) 
	}
}

</script>

<style scoped>

</style>