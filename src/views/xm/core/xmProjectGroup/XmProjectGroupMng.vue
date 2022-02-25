<template>
	<section class="page-container padding"> 
		
		<el-row  v-if="!isSelectSingleUser && !isSelectMultiUser"> 
					<el-button  type="primary" v-if="!groups||groups.length==0" @click="showGroupFormwork" icon="el-icon-plus">导入项目组</el-button>
 					<el-button  type="plain" @click="showGroupState" icon="el-icon-s-data">小组进度</el-button> 
 					<el-button  type="plain" @click="xmRecordVisible=true" icon="el-icon-document">变化日志</el-button>
					<el-button  type="plain" @click="doSearchImGroupsByProjectId" icon="el-icon-document">绑定即聊情况</el-button>
 					<el-button @click="groupRoleDescVisible=true" icon="el-icon-document">角色说明</el-button> 
  		</el-row> 
		<el-row  v-else>  
					<el-button   type="primary" @click="userConfirm" icon="el-icon-finished">确认选择用户</el-button>  
		</el-row> 
		<el-row>
			<vue-okr-tree :data="okrTreeData" 
				show-collapsable 
				default-expand-all   
				node-key="id"
				current-lable-class-name="crrentClass" 
				:render-content="renderContent"  
  				@node-click="handleNodeClick"
  				direction="horizontal"
  			></vue-okr-tree>   
		</el-row>
		<el-dialog
			title="操作"
			:visible.sync="groupOperSelectVisible"
			width="30%" >
			<el-row>
				<el-button @click="showAdd">新增一级小组</el-button>
				<el-button @click="showAddSub(editForm)">新增下级小组</el-button>
				<el-button type="primary" @click="showEdit(editForm)">小组明细</el-button> 
				<el-button @click="handleDel(editForm)">删除小组</el-button>
			</el-row> 
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import {sn} from '@/common/js/sequence';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { updateGroup,getProjectGroup } from '@/api/xm/core/xmProjectGroup';
	import { mapGetters } from 'vuex'; 
	import XmProjectGroupEdit from "./XmProjectGroupEdit"
	
	import {VueOkrTree} from 'vue-okr-tree';
	import 'vue-okr-tree/dist/vue-okr-tree.css'

	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),
			okrTreeData(){
				var groups=this.groups; 
				groups.forEach(i=>{
					i.label=i.groupName
					if(i.groupUsers){
						var groupUsers=i.groupUsers;
						groupUsers.forEach(i=>i.label=i.username)
						i.children=groupUsers
					}
				})
				var topLabel="组织架构"
				if(this.xmProduct&&this.xmProduct.id){
					topLabel=this.xmProduct.name+"-产品组织架构"
				}else if(this.selProject && this.selProject.id){
					topLabel=this.selProject.name+"-项目组织架构"
				}
				var data=[{
					label:topLabel,
					children:groups
					}
				]
				return data;
			}
		},
		props: ["selProject" ,"isSelectSingleUser","isSelectMultiUser",'xmProduct','xmIteration'],
		watch:{
			selProject(){
				this.getXmProjectGroup();
			},
			xmProduct(){
				this.getXmProjectGroup();
			},
			xmIteration(){
				this.getXmProjectGroup();
			}
		},
		data() {
			return {
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				/**begin 自定义属性请在下面加 请加备注**/
				groupSelectVisible: true,
				groups:[],
				editForm: {
					id:'',groupName:'',projectId:''
				},
				addForm: {
					id:'',groupName:'',projectId:''
				},
				groupOperSelectVisible:false,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			onGroupSelected(selGroups){
				this.load.edit=true
				if(selGroups != null){
					let groups = [];
					selGroups.forEach(i=>{
						let group = { 
							"id":i.id,
							"groupName": i.groupName,
							"groupUsers": i.groupUsers,
							"projectId": i.projectId,
							"pgTypeName": i.pgTypeName,
							"pgTypeId": i.pgTypeId
						};
						groups.push(group);
					});
					if(selGroups.length==0){
						this.$message({showClose: true, message: "最少保留一个小组", type: 'error' });
						this.load.edit=false
						return;
					}
					updateGroup(groups).then((res) => {
						var tips=res.data.tips; 
						if(tips.isOk){ 
							//this.groups = res.data.data; 
							this.$message({showClose: true, message: tips.msg, type: 'success' });
						}else{
							this.$message({showClose: true, message: tips.msg, type: 'error' });
						} 
						this.getXmProjectGroup();
						this.load.edit=false
					}).catch( err => this.load.edit = false );
				}
				//this.groupSelectVisible=false;
			},
			getXmProjectGroup() {
				this.load.list = true;
				let params = { 
				};
				if(this.selProject){
					params.projectId=this.selProject.id
				}
				if(this.xmIteration){
					params.iterationId=this.xmIteration.id
				}
				if(this.xmProduct){
					params.productId=this.xmProduct.id
				}
				getProjectGroup(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.groups = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			/**begin 自定义函数请在下面加**/
			onUserSelected:function(users){
				this.$emit("user-confirm",users);
			},
			
			renderCurrentClass (node) {
				return 'label-bg-blue'
			},
			handleNodeClick (data) {
				this.groupOperSelectVisible=true;
				this.editForm=data;
			},
			renderContent (h, node) {
				return (
				<div class={'diy-wrapper', node.isCurrent ? 'current-select' : ''}>
					<div class={'diy-con-name',node.data.userid? 'el-icon-user':''}>{node.data.label}<div></div></div>
					<div class="diy-con-content">
						{node.data.leaderUsername?
							(<div> {node.data.leaderUsername }</div> 
							)
						:   
						    (<div>   </div>)
						}
					</div>
				</div>
				)
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
				 VueOkrTree,XmProjectGroupEdit,
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmProjectGroup();
			}); 
		}
	}

</script>

<style scoped>

</style>