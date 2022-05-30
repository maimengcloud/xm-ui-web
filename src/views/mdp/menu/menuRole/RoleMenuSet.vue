<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 MenuRole 角色资源关系表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="菜单分配" prop="id" style=" overflow-x:auto; height:550px;">
					   <menu-tree :check-strictly="true" v-loading="load.list" default-expand-all  :expand-on-click-node="false" showCheckbox multiple  ref="nodeTree"></menu-tree> 
				</el-form-item>  
				<el-form-item>
					<el-col :span="4" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button> 
					</el-col>
					<el-col :span="4"> 
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" >提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { listMenuRole, batchEditMenusToRole } from '@/api/mdp/menu/menuRole';
	import { listRole } from '@/api/mdp/sys/role';
	import MenuTree from '../menuDef/MenuTree'
	import { mapGetters } from 'vuex'; 
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['roleids','visible','batch'],
		watch: { 
	      'visible':function(visible) { 
	    	  this.mids=[];
	      	if(visible==true){
				this.getMidsByRoleid();
	      	}
	      } 
	    }, 
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 角色资源关系表
				editForm: {
					id:'',roleid:'',mid:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				mids:[],//['mid1','mid2'],
 				menuRoles:[],
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交MenuRole 角色资源关系表 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {
				
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						let mids=this.$refs.nodeTree.$refs.nodeTree.getCheckedKeys(true);    
						this.$confirm('确认提交吗？将会重置角色拥有的菜单为本次选择的菜单', '提示', {}).then(() => { 
							this.load.edit=true 
							let params = {mids:mids,roleid:this.roleids[0]}
							batchEditMenusToRole(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){ 
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.getMidsByRoleid();
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => this.load.edit=false);
						});
					}
				});
			},
			getMidsByRoleid(){
				
				if(this.roleids.length==1){
					this.load.list=true;
					listMenuRole({roleid:this.roleids[0]}).then(res=>{
						this.load.list=false
						this.menuRoles=res.data.data;
						this.mids=res.data.data.map(i=>i.mid)
						var menuRolesWithoutHalfChecked=this.menuRoles.filter(mr=>mr.half!=='1')
						var menuRolesWithoutHalfCheckedIds=menuRolesWithoutHalfChecked.map(i=>i.mid)
						this.$refs.nodeTree.$refs.nodeTree.setCheckedKeys(menuRolesWithoutHalfCheckedIds,false)
					}).catch(()=>this.load.list=false); 
				}
			}
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			MenuTree
		    //在下面添加其它组件 'res-oper-role-edit':MenuRoleEdit
		},
		mounted() {  
			this.getMidsByRoleid();
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>