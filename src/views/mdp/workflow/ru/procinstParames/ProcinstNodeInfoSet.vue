<template>
	<section>
		<el-row style="padding-top:10px;">  
			<!--新增界面 ProcinstParames 流程实例参数设置表-->   
					  <el-table
						:data="nodeInfoList" 
						style="width: 100%">
						<el-table-column 
						prop="actName"
						label="节点名称"
						min-width="100">
						</el-table-column>
						<el-table-column 
						prop="showNextAssignees"
						label="已配置人员"
						min-width="250">
							<template slot-scope="scope">
								{{showAssigneeTips(scope.row)}} 
 								<el-button round type="warning" @click="$refs['candidateSetDialog'].open(scope.row)" v-if="scope.row.candidate=='1' && scope.row.allowOverUser!='0'" placeholder="选候选人、部门">选候选人、部门</el-button>    
								<mdp-select-user  v-if="scope.row.candidate!='1' && scope.row.allowOverUser!='0'" placeholder="执行人"></mdp-select-user>   
								<el-button round v-if="scope.row.toCreater!='1'" type="primary" @click.native="setAssigneeAsStartUser(scope.row)">转发起人</el-button>  
							</template>
						</el-table-column>
						<el-table-column 
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
						label="权限配置"
						min-width="100">
							<template slot-scope="scope">  
								<el-button   type="plain" @click.native="$refs['qxSetDialog'].open(scope.row)"  >配置权限</el-button>   
							</template>
						</el-table-column> 
					</el-table>  
			 
			<mdp-dialog ref="qxSetDialog"
				title="配置流程节点权限"  > 
				<template v-slot="{visible,data,dialog}">
					<act-qx-code-set :formFields="[]" :visible="visible" :qxCode="data.qxCode" @cancel="dialog.close()"   @confirm="(qxCode)=>data.qxCode=qxCode"></act-qx-code-set> 
				</template>
			</mdp-dialog> 
			<mdp-dialog ref="candidateSetDialog"
				title="选择候选人/候选部门/候选岗位"  > 
				<template v-slot="{visible,data,dialog}">
					<act-candidate-set :visible="visible" :actAssignee="data" @cance="dialog.close()"  @confirm="(nodeInfo)=>{
						Object.assign(data,nodeInfo);
						dialog.close();
					}" @close="dialog.close()"></act-candidate-set> 
				</template>
				
			</mdp-dialog>  
		</el-row>
		
		<el-row class="footer">
			<el-button @click="handleCancel" icon="el-icon-back">关闭</el-button>
			<el-button type="primary" @click="confirm" icon="el-icon-finished">确定</el-button>
		</el-row>
	</section>
</template>

<script>
	import { mapGetters } from 'vuex'  
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
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/ 
				nodeInfoList:[],//id:'',actId:'',actName:'',procDefId:'',assignees:'',isMultiple:'' , 
				nodeInfoListOld:[],//用于恢复
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			confirm:function(){
				this.$emit('confirm',this.nodeInfoList);
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
			setAssigneeAsStartUser(nodeInfoSeleced){
				if(nodeInfoSeleced.allowOverUser=='0'){
					this.$notify.error("当前节点不允许变更执行人")
					return;
				} 
				nodeInfoSeleced.toCreater='1'
				nodeInfoSeleced.candidate='0'
				nodeInfoSeleced.showNextAssignees='0'
				
			}
			  
		},//end method
		components: {  
		    //在下面添加其它组件 'procdef-parames-edit':ProcdefParamesEdit    
			ActCandidateSet,ActQxCodeSet
		},
		mounted() { 
			var jsonStrData=JSON.stringify(this.nodeInfos);
			this.nodeInfoList=JSON.parse(jsonStrData)
		}
	}

</script>
<style scoped>

	.actConfig {
		margin-bottom: 14px;
	}
</style>