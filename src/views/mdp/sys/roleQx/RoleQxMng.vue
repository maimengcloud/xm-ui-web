<template>
	<section> 
		<!--编辑界面 角色权限管理--> 
			<el-form v-if="role && role.roleid" :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item  label="角色名" prop="rolename">
					<el-tag type="gray">{{role.rolename}}</el-tag> <el-tag type="danger" v-if="role.remark">{{role.remark}}</el-tag>  
				</el-form-item>   
				<el-form-item  label="权限"> 
  							<div class="edit_dev">
								<el-transfer
								style="text-align: left; display: inline-block;"
								v-model="dbQxIds"
								filterable
								:filter-method="transferFilterMethod"
								:render-content="renderFunc"
								:titles="['未拥有的权限', '已拥有的权限']"
								:format="{
									noChecked: '${total}',
									hasChecked: '${checked}/${total}'
								}"
								:props="{key:'qxId',label:'qxName'}"
								@change="handleChange"
								:data="qxs">
								</el-transfer>
							</div> 
				</el-form-item>
			</el-form>
			<el-row slot="footer" class="footer">
				<el-button @click.native="close">关闭</el-button>   
				<el-button type="primary" @click.native="editSubmit" :loading="load.edit">提交</el-button>   
			</el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listRoleQx, delRoleQx, batchEditRoleQx, editRoleQx, addRoleQx } from '@/api/mdp/sys/roleQx'; 
	import { listMenuModule } from '@/api/mdp/menu/menuModule';
	import { listQx, delQx, batchDelQx, editQx, addQx } from '@/api/mdp/sys/qx'; 
	import { editRole } from '@/api/mdp/sys/role';
	import { mapGetters } from 'vuex'  
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
			]), 
		},
		props:{
			width:{
				type:String,
				default:'60%'
			},
			visible:{
				type:Boolean,
				default:false,
			},
			role:{
				type:Object,
				default:null,
			}
		},
		watch: {
	      'visible':function(visible) { 
	      	if(visible==true){
	      		this.getRoleQxs(); 
	      	}
		  },
		  'allSelectQx':function(allSelectQx){
			  if(allSelectQx==1){
				var myQxs=this.qxsCmp[this.currentCategoryId]
				if(!myQxs){
					return;
				}
				myQxs.forEach(qx=>{
					if(!this.dbQxIds.some(i=>i==qx.qxId)){
						this.dbQxIds.push(qx.qxId);
					}
				});
			  }else{
				var myQxs=this.qxsCmp[this.currentCategoryId] 
				if(!myQxs){
					return;
				}
				this.dbQxIds=this.dbQxIds.filter(qxId=>{
					return !myQxs.some(qx=>qx.qxId==qxId)
				})
				 
			  }
		  }
	    },	
		data() {
			return {
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: { 
				},
				//编辑界面 角色权限管理
				editForm: {
					qxId:'',id:'' ,roleid:'' 
				},
				/**begin 在下面加自定义变量**/
				roleQxs:[],//[{id,roleid,qxId}]权限列表
				qxs:[],//[{qxId,qxName}]全量权限 
				dbQxIds:[],//[qxId1,qxId2}]数据操作权限
				menuModules:[],
				allSelectQx:0,
				currentCategoryId:'',//当前选择的归属模块
 				/**end 在上面加自定义变量**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			close:function(){
				this.$emit('close');
			},
			//新增提交Role 角色管理 父组件监听@submit="afterEditSubmit"
			//编辑权限
			editSubmit: function () {
				if(this.deptScope==''){
					this.$notify({ message: "请选择数据范围", type: 'error' }); 
					return
				}
				
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit = true; 
							let roleid=this.role.roleid; 
							let params = {roleid:roleid,dbQxIds:this.dbQxIds,dataLvl:this.role.dataLvl};
							params.deptid=this.userInfo.deptid;
							params.branchId=this.userInfo.branchId;
							console.log(params);
							batchEditRoleQx(params).then((res) => {
								this.load.edit = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
									this.visible=false;
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.load.edit = false;
							});
						});
					}
				});
			},
			/**begin 在下面加自定义方法**/
			//显示设置权限界面
			getRoleQxs(){ 
				
				if( !this.role || !this.role.roleid){
					return;
				}
				this.load.list=true
				let params={roleid:this.role.roleid};
				this.roleQxs=[]
				this.dbQxIds=[] 
				listRoleQx(params).then(res=>{
					this.load.list=false 
					this.roleQxs=res.data.data;
					this.roleQxs.forEach(rq=>{ 
						if(rq.qxId){
							this.dbQxIds.push(rq.qxId) 
						}
						
					})
				}).catch(()=>this.load.list=false); 
			},
			handleChange(rbizCategorys){
				console.log(rbizCategorys);
				let rbizCategory=rbizCategorys[rbizCategorys.length-1];
				listResDef({rbizCategory:rbizCategory}).then(res=>this.resDefs[rbizCategory]=res.data.data)
			},
			disabledDeptScopeRadio:function(qx){
				if(this.userInfo.isSuperAdmin || this.userInfo.isPlatformAdmin){
					return false
				}else{ 
					if(qx.lvl>5){
						return true
					}
					return false
				}
			},
			qxTabClick(tab){ 
				this.currentCategoryId=tab.$attrs.categoryId 
			},
			
			renderFunc(h, option) {
				return <span>{option.moduleId} - { option.qxName } - { option.qxId }  </span>;
			},
			handleChange(){

			},
			transferFilterMethod:function(query, item) { 
				if(!item){
					return false;
				}
				if( item.qxName && item.qxName.indexOf(query)>-1){
					return true;
				}
				if(item.qxId && item.qxId.indexOf(query)>-1){
					return true;
				}
				return false; 
			},
			saveDataLvl(){
				this.$confirm('确认提交吗？', '提示', {}).then(() => { 
					this.load.edit=true
					let params = Object.assign({}, this.role); 
					editRole(params).then((res) => {
						this.load.edit=false
						var tips=res.data.tips; 
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
						this.visible=false
					}).catch(() =>this.load.edit=false);
				});
			},
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'role-edit':RoleEdit
		},
		mounted() {
			this.getRoleQxs();
			/**在下面写其它函数***/
			this.load.list=true
			listQx({}).then(res=>{
				this.load.list=false
				this.qxs=res.data.data; 
			}).catch(()=>this.load.list=false);  
		}//end mounted
	}

</script>

<style scoped>
.top14{
	margin-top: 14px;
} 
   .edit_dev >>>.el-transfer-panel__list.is-filterable{
		width:400px !important;
		height:650px !important;
	}
 
	.edit_dev >>>.el-transfer-panel{
		width: 400px !important;
		height: 650px !important;
	}
	.edit_dev >>> .el-transfer__buttons{
		width:100px;  
	}	
	.edit_dev >>> .el-button{ 
			margin-left: 0px; 
	}
</style>