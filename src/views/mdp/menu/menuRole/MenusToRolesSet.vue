<template>
	<section> 
		<el-row style="padding-top:10px;">
					<div class="edit_dev" style="text-align:center"> 
					  <el-transfer  class="transfer"  v-loading="load.list" :props="{key:'roleid',label:'rolename'}"
					    filterable  
						style="text-align: left; display: inline-block;"
					    :titles="['未选角色', '已选角色']"
					    filter-placeholder="输入角色名搜索"
					    v-model="menuRoleIds"
					    :data="roles">
					  </el-transfer> 
					</div> 
		</el-row> 
		<slot name="footer" :that="this">
		<el-row style="float:right;"> 
			<el-button @click.native="close">关闭</el-button>   
			<el-button v-if="batch!==true" v-loading="load.edit" type="primary" @click.native="editSubmit" >提交</el-button>  
			<el-button v-else v-loading="load.edit" type="primary" @click.native="batchEditMenusToRoles" >提交</el-button>  
		</el-row>
		</slot>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { listMenuRole, batchEditMenuToRoles,batchEditMenusToRoles } from '@/api/mdp/menu/menuRole';
	import { listRole } from '@/api/mdp/sys/role';
	import { mapGetters } from 'vuex'; 
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['mids','visible','batch'],
		watch: { 
	      'visible':function(visible) { 
	    	  this.menuRoleIds=[];
	      	if(visible==true){
	      		if(this.mids.length==1){
	      			this.load.list=true;
					listMenuRole({mid:this.mids[0]}).then(res=>{
						this.load.list=false
						this.menuRoles=res.data.data;
						this.menuRoleIds=res.data.data.map(i=>i.roleid)
					}).catch(()=>this.load.list=false);
				}
	      	}
	      },
	      'filters.roletype':function(roletype){
				this.load.list=true;
				listRole({branchId:this.userInfo.branchId,roletype:this.filters.roletype}).then(res=>{
					this.load.list=false;
					this.roles=res.data.data
				}).catch(()=>this.load.list=false);
	      }
	    }, 
		data() {
			return {
				filters:{
					roletype:'0'
				},
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
				roles:[],//{roleid:'',rolename:''}
				menuRoleIds:[],//['roleid1','roleid2']
				menuRoles:[],//
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			close:function(){
				//this.$refs['editForm'].resetFields();
				this.$emit('close');
			},
			afterEditSubmit(){
				 this.menuRoleIds=[];
				if(this.mids.length==1){
	      			this.load.list=true;
					listMenuRole({mid:this.mids[0]}).then(res=>{
						this.load.list=false
						this.menuRoles=res.data.data;
						this.menuRoleIds=res.data.data.map(i=>i.roleid)
					}).catch(()=>this.load.list=false);
				}
				this.load.list=true;
				listRole({branchId:this.userInfo.branchId,roletype:this.filters.roletype}).then(res=>{
					this.load.list=false;
					this.roles=res.data.data
				}).catch(()=>this.load.list=false);
			},
			//新增提交MenuRole 角色资源关系表 父组件监听@submit="afterAddSubmit"
			editSubmit: function () { 
				this.$confirm('确认提交吗？', '提示', {}).then(() => { 
					this.load.edit=true 
					let params = {mid: this.mids[0],roleids: this.menuRoleIds,batch:this.batch} 
					batchEditMenuToRoles(params).then((res) => {
						 
						this.load.edit=false
						var tips=res.data.tips;
						this.afterEditSubmit()
						if(tips.isOk){ 
							this.$emit('submit');//  @submit="afterAddSubmit"
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch(() => this.load.edit=false);
				}); 
			},
			//新增提交MenuRole 角色资源关系表 父组件监听@submit="afterAddSubmit"
			batchEditMenusToRoles: function () { 
				this.$confirm('确认提交吗？', '提示', {}).then(() => { 
					this.load.edit=true 
					let params = {mids: this.mids,roleids: this.menuRoleIds} 
					batchEditMenusToRoles(params).then((res) => {
						 
						this.load.edit=false
						var tips=res.data.tips; 
						if(tips.isOk){ 
							this.$emit('submit');//  @submit="afterAddSubmit"
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch(() => this.load.edit=false);
				}); 
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'res-oper-role-edit':MenuRoleEdit
		},
		mounted() { 
			this.load.list=true;
			listRole({branchId:this.userInfo.branchId,roletype:this.filters.roletype}).then(res=>{
				this.load.list=false;
				this.roles=res.data.data
			}).catch(()=>this.load.list=false);
			if(this.mids.length==1){
				this.load.list=true;
				listMenuRole({mid:this.mids[0]}).then(res=>{
					this.load.list=false
					this.menuRoles=res.data.data;
					this.menuRoleIds=res.data.data.map(i=>i.roleid)
				}).catch(()=>this.load.list=false);
			}
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>
   .edit_dev >>>.el-transfer-panel__list.is-filterable{
		width:300px !important;
		height:400px !important;
	}
 
	.edit_dev >>>.el-transfer-panel{
		width: 300px !important;
		height: 400px !important;
	}
</style>