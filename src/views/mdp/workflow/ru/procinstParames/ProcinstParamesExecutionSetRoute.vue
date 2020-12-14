<template>
	<section>
		<el-row class="execution-set">
		<procinst-parames-execution-set  :taskInfo='taskInfo' :procDefId="taskInfo.procDefId" :procInstId="taskInfo.procInstId" :visible="editFormVisible" @cancel="handleCancel" @submit="afterEditSubmit"></procinst-parames-execution-set>
		</el-row>
	</section>
</template>

<script>
	 
	import  ProcinstParamesExecutionSet from './ProcinstParamesExecutionSet';//
	
	export default {
		name:'ProcinstParamesExecutionSetRoute',
		data() {
			return {
				filters: {
					key: '', 
				},
				 taskInfo:{},
				 editFormVisible:false,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			 afterEditSubmit:function(){
				 this.$store.dispatch('delVisitedViews', {path:'/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSetRoute',name:'ProcinstParamesExecutionSetRoute'})
				 
			 },
			 handleCancel:function(){
				 
				this.$store.dispatch('delVisitedViews', {path:'/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSetRoute',name:'ProcinstParamesExecutionSetRoute'})
			 	 this.$router.back(-1)
			 }
			
		},//end methods
		components: { 
		   ProcinstParamesExecutionSet
		    //在下面添加其它组件
		},
		mounted() {
			if(this.$route.params){
				this.editFormVisible=true;
				 this.taskInfo=this.$route.params.taskInfo
			}
			
			 
		}
	}

</script>

<style scoped>
	.execution-set {
		margin-left: 20px;
	}
</style>