<template>
	<section>
		<el-row>
			<el-button @click="handleCancel" icon="el-icon-back">取消</el-button>
			<el-button type="primary" @click="confirm" icon="el-icon-finished">确定</el-button>
		</el-row>
		<el-row style="padding-top:10px;">  
			<!--新增界面 ProcinstParames 流程实例参数设置表-->   
					  <el-table
						:data="nodeInfoList"
						border
						style="width: 100%">
						<el-table-column
						fixed
						prop="actName"
						label="节点名称"
						min-width="100">
						</el-table-column>
						<el-table-column
						fixed
						prop="showNextAssignees"
						label="已配置人员"
						min-width="250">
							<template slot-scope="scope">
								{{showAssigneeTips(scope.row)}} 
								<el-button round v-if="scope.row.candidate=='1'  && scope.row.allowOverUser!='0'" type="warning" @click.native="showCandidateSelectDialog(scope.row,'')" :loading="listLoading">选候选人</el-button> 
								<el-button  round v-if="scope.row.candidate!='1' && scope.row.allowOverUser!='0'" type="success" @click.native="showUserSelectDialog(scope.row,'')" :loading="listLoading">选人员</el-button>   
								<el-button round v-if="scope.row.toCreater!='1'" type="primary" @click.native="setAssigneeAsStartUser(scope.row)">转发起人</el-button>  
							</template>
						</el-table-column>
						<el-table-column
						fixed
						prop="showNextAssignees"
						label="手选执行人"
						width="150">
						
							<template slot-scope="scope">
								<el-checkbox v-if="scope.row.allowOverUser!='0'" v-model="scope.row.showNextAssignees" label="可手选" true-label="1" false-label="0" border></el-checkbox>   
							</template>
						</el-table-column>
						<el-table-column
						prop="candidate"
						label="候选任务"
						width="120"> 
							<template slot-scope="scope">
								<el-checkbox v-if="scope.row.allowOverUser!='0'" v-model="scope.row.candidate" label="候选" true-label="1" false-label="0" border></el-checkbox>  
							</template>
						</el-table-column> 
						
						<el-table-column
						prop="qxCode"
						fixed="right"
						label="权限配置"
						min-width="100">
							<template slot-scope="scope">  
								<el-button   type="plain" @click.native="showQxDialog(scope.row)"  >配置权限</el-button>   
							</template>
						</el-table-column> 
					</el-table>  
			 
			<el-dialog append-to-body
				title="配置流程节点权限"
				:visible.sync="qxVisible"
				width="60%"> 
				<act-qx-code-set :formFields="[]" :visible="qxVisible" :qxCode="nodeInfoSeleced ? nodeInfoSeleced.qxCode:''" @cancel="onQxCancel"   @confirm="onQxSelected"></act-qx-code-set> 
			</el-dialog> 
			<el-dialog append-to-body
				title="选择候选人/候选部门/候选岗位"
				:visible.sync="candidateSelectVisible"
				width="60%"> 
				<act-candidate-set :node-info="nodeInfoSeleced"  @confirm="onCandidateSelected"></act-candidate-set> 
			</el-dialog> 
			<el-dialog append-to-body
				title="选择审批员工"
				:visible.sync="userSelectVisible"
				width="60%"> 
				<users-select :select-userids=" (nodeInfoSeleced && nodeInfoSeleced.nodeUsers)?nodeInfoSeleced.nodeUsers.map(i=>i.userid):[]"   @confirm="onUserSelected"></users-select> 
			</el-dialog>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库import 
	import { listUser,listUserNames } from '@/api/mdp/sys/user';
	import { listDept } from '@/api/mdp/sys/dept';
	import { getBpmnActAssignees } from '@/api/mdp/workflow/re/procdefNodeInfo'; 
	import { getNodeInfos } from '@/api/mdp/workflow/ru/procinstNodeInfo'; 
	import { mapGetters } from 'vuex'  
	import UsersSelect from '@/views/mdp/sys/user/UsersSelect';     
	import ActCandidateSet from '@/views/mdp/workflow/re/procdefParames/ActCandidateSet';  
	import ActQxCodeSet from '@/views/mdp/workflow/re/procdefParames/ActQxCodeSet';  

	export default {
		name:'ProcinstNodeInfoSet',
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['nodeInfos'],
		watch: { 
	      'visible':function(visible) {  
	      	if(visible==true){ 
				   this.nodeInfoList=JSON.parse(JSON.stringify(this.nodeInfos))
	      	}
	      } 
	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 
				listLoading:false, 
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/ 
				nodeInfoList:[],//id:'',actId:'',actName:'',procDefId:'',assignees:'',isMultiple:'' , 
				candidateSelectVisible:false, 
				userSelectVisible:false, 
				nodeInfoSeleced:null,//选中的nodeInfoList 
				qxVisible:false, 
				nodeInfoListOld:[],//用于恢复
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				//this.nodeInfoList=JSON.parse(JSON.stringify(this.nodeInfoListOld))
				this.$emit('cancel');
			},
			confirm:function(){
				this.$emit('confirm',this.nodeInfoList);
			},
			onCandidateSelected:function(nodeInfo){
				this.candidateSelectVisible=false;
				console.log("nodeInfo-----------"+JSON.stringify(nodeInfo));
				 
				this.nodeInfoSeleced.nodeUsers=nodeInfo.nodeUsers;
				this.nodeInfoSeleced.groupIds=nodeInfo.groupIds 
				this.nodeInfoSeleced.toCreater='0'

			},
			onUserSelected:function(users){
				this.userSelectVisible=false; 
				this.nodeInfoSeleced.nodeUsers=users  
				this.nodeInfoSeleced.toCreater='0'

			},   
			
			showUserSelectDialog:function(nodeInfoSeleced,index){
				if(nodeInfoSeleced.allowOverUser=='0'){
					this.$message.error("当前节点不允许变更执行人")
					return;
				} 
				this.userSelectVisible=true;
				this.nodeInfoSeleced=nodeInfoSeleced;
			},
			showCandidateSelectDialog:function(nodeInfoSeleced,index){
				if(nodeInfoSeleced.allowOverUser=='0'){
					this.$message.error("当前节点不允许变更执行人")
					return;
				} 
				this.candidateSelectVisible=true;
				this.nodeInfoSeleced=nodeInfoSeleced;
			},
			showAssigneeTips(nodeInfo){
				var tips=[];
				if(nodeInfo.toCreater=='1'){
					tips.push("流程发起人作为执行人")
				}else if(nodeInfo.candidate=='1'){
					if(nodeInfo.nodeUsers){
						var userCount=nodeInfo.nodeUsers.length;
						tips.push(userCount+"个候选用户");
					} 
					if(nodeInfo.groupIds){
						var groupCount=nodeInfo.groupIds.split(",").length;
						tips.push(groupCount+"个候选部门/岗位");
					}
					
					if(tips.length==0){
						tips.push("未配置任何候选人/候选部门/候选岗位");
					}
					
				}else{
					if(nodeInfo.nodeUsers){ 
						tips=tips.concat(nodeInfo.nodeUsers.map(i=>i.username)); 
					}else{ 
						tips.push("未配置任何任务执行人");
					} 
				}
				return tips.join(",");
			},   
			listBpmnActAssignees(){
				this.nodeInfoList=[]; 
				this.listLoading = true;
				let params = {  };
				if(this.isStart=='1'){
					params.procDefId=this.procDefId
					getBpmnActAssignees(params).then(res=>{
						var tips=res.data.tips;
						this.listLoading = false;
						if(tips.isOk){
							//this.nodeInfoList=res.data.data
							this.nodeInfoList=res.data.data; 
							this.nodeInfoListOld=JSON.parse(JSON.stringify(this.nodeInfoList));
						}else{
							this.$message({showClose: true, message: tips.msg, type: 'error' });
						}
					});
				}else{
					params.procInstId=this.procInstId
					getNodeInfos(params).then(res=>{
						var tips=res.data.tips;
						this.listLoading = false;
						if(tips.isOk){
							//this.nodeInfoList=res.data.data
							this.nodeInfoList=res.data.data; 
							this.nodeInfoListOld=JSON.parse(JSON.stringify(this.nodeInfoList));
						}else{
							this.$message({showClose: true, message: tips.msg, type: 'error' });
						}
					});
				}
				
				
			},
			/**end 在上面加自定义方法**/
			 
			onQxSelected:function(qxCode){
				this.qxVisible=false;
				this.nodeInfoSeleced.qxCode=qxCode;
			},
			
			onQxCancel:function(){
				this.qxVisible=false; 
			},
			showQxDialog:function(nodeInfo){
				this.qxVisible=true;
				this.nodeInfoSeleced=nodeInfo;
			},
			setAssigneeAsStartUser(nodeInfoSeleced){
				if(nodeInfoSeleced.allowOverUser=='0'){
					this.$message.error("当前节点不允许变更执行人")
					return;
				} 
				this.nodeInfoSeleced=nodeInfoSeleced
				this.nodeInfoSeleced.toCreater='1'
				this.nodeInfoSeleced.candidate='0'
				this.nodeInfoSeleced.showNextAssignees='0'
				
			}
			  
		},//end method
		components: {  
		    //在下面添加其它组件 'procdef-parames-edit':ProcdefParamesEdit    
			UsersSelect,ActCandidateSet,ActQxCodeSet
		},
		mounted() { 
			var jsonStrData=JSON.stringify(this.nodeInfos);
			this.nodeInfoList=JSON.parse(jsonStrData)
			this.nodeInfoListOld=JSON.parse(jsonStrData);
		}
	}

</script>
<style scoped>

	.actConfig {
		margin-bottom: 14px;
	}
</style>