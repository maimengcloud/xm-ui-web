<template>
	<section class="page-container">
		<el-row v-loading="load.edit">
			<xm-project-group-formwork :is-select-single-user="isSelectSingleUser" :is-select-multi-user="isSelectMultiUser" :visible="groupSelectVisible" :sel-project="selProject" :sel-groups="groups" @select-confirm="onGroupSelected" @user-confirm="onUserSelected"></xm-project-group-formwork> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import {sn} from '@/common/js/sequence';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { updateGroup,getProjectGroup } from '@/api/xm/core/xmProjectGroup';
	import { mapGetters } from 'vuex';
	import XmProjectGroupFormwork from '../xmProjectGroupFormwork/XmProjectGroupFormwork';
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props: ["selProject" ,"isSelectSingleUser","isSelectMultiUser"],
		watch:{
			selProject(){
				this.getXmProjectGroup();
			}
		},
		data() {
			return {
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				/**begin 自定义属性请在下面加 请加备注**/
				groupSelectVisible: true,
				groups:[],
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
							"projectId": this.selProject.id,
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
					projectId: this.selProject.id,
				};
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
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
				
				XmProjectGroupFormwork
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