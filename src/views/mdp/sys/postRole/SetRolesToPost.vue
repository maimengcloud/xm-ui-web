<template>
	<section>
		<el-dialog append-to-body modal-append-to-body :width="width" title="设置岗位的角色列表" :visible.sync="visible">
			<el-row align="middle">
				<div class="edit_dev" style="text-align:center"> 
						<el-transfer  class="transfer"  v-loading="load.list" :props="{key:'roleid',label:'rolename'}"
							filterable  
							style="text-align: left; display: inline-block;"
							:titles="['未选角色', '已选角色']"
							filter-placeholder="输入角色名搜索"
							v-model="roleids"
							:data="roles">
						</el-transfer> 
						</div>
			</el-row>
			<el-row slot="footer">
				<el-button @click.native="close">关闭</el-button>   
				<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" >提交</el-button>  
			</el-row>
		</el-dialog>
		
	</section>
</template>

<script> 
import {
  listPostRole,
  setRolesToPost, 
} from "@/api/mdp/sys/postRole";
	import { listRole } from '@/api/mdp/sys/role';
	import { mapGetters } from 'vuex'; 
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:{ 
	
			/**
			 * 弹出框的宽度
			 */
			width:{
				type:String,
				default:'70%'
			},
		},
		watch: { 
	      'visible':function(visible) { 
	    	  this.roleids=[];
	      	if(visible==true){ 
	      			this.load.list=true;
					listPostRole({postId:this.postId}).then(res=>{
						this.load.list=false 
						this.roleids=res.data.data.map(i=>i.roleid) 
					}).catch(()=>this.load.list=false); 
	      	}
	      }, 
	    }, 
		data() {
			return { 
 				load:{ list: false, add: false, del: false, edit: false },//查询中... 
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				roles:[],//{roleid:'',rolename:''}
				roleids:[],//['roleid1','roleid2']  
				visible:false,
				postId:null,
			}//end return
		},//end data
		methods: { 
			//新增提交MenuRole 角色资源关系表 父组件监听@submit="afterAddSubmit"
			editSubmit: function () { 
				this.$confirm('确认提交吗？', '提示', {}).then(() => { 
					this.load.edit=true   
					var params={postId:this.postId,roleids:this.roleids}
						setRolesToPost(params).then((res) => {
							this.load.edit=false
							var tips=res.data.tips;
							if(tips.isOk){ 
								this.$emit('submit');//  @submit="afterAddSubmit"
							}
							this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
						}).catch(() => this.load.edit=false); 
				}); 
			} ,
			open(data){
				this.postId=data.postId
				this.visible=true
			},
			close(){
				this.visible=false 
				this.$emit('cancel');
				this.$emit('close');
			}
			
		},//end method
		components: {  
		    //在下面添加其它组件 'res-oper-role-edit':MenuRoleEdit
		},
		mounted() { 
			this.load.list=true;
			listRole({branchId:this.userInfo.branchId}).then(res=>{
				this.load.list=false;
				this.roles=res.data.data
			}).catch(()=>this.load.list=false); 
			if(this.postId){ 
				listPostRole({ postId: this.postId}).then(res=>{
					this.load.list=false 
					this.roleids=res.data.data.map(i=>i.roleid)
				}).catch(()=>this.load.list=false); 
			}
			
			
		}//end mounted
	}

</script>

<style scoped>
   .edit_dev >>>.el-transfer-panel__list.is-filterable{
		width:400px !important;
		height:550px !important;
	}
 
	.edit_dev >>>.el-transfer-panel{
		width: 400px !important;
		height: 550px !important;
	}
</style>