<template>
	<section class="padding">
		<el-row :gutter="10">
			<el-col :span="7">
				<xm-phase milestone="1"  :sel-project="projectInfo" queryScope="plan" @row-click="onPhaseRowClick"></xm-phase>
			</el-col>
			<el-col :span="17">
				<xm-task-mng  milestone="1" :sel-project="projectInfo" queryScope="task" :parent-task="parentTask"></xm-task-mng>
			</el-col>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库

	import { mapGetters } from 'vuex'

  	import  XmPhase from '@/views/xm/core/xmTask/XmPhase';//新增界面
 	import  XmTaskMng from '@/views/xm/core/xmTask/XmTaskMng';//新增界面
	export default {

		components: {
			XmPhase,XmTaskMng
		},
		computed: {
		    ...mapGetters([
		      'userInfo','roles','projectInfo'
		    ]),


        },
		watch: {

	    },
		data() {
			return {
				parentTask:null,
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...

			}//end return
		},//end data
		methods: {
			 onPhaseRowClick(task){
				 this.parentTask=task
			 }
		},//end method
		mounted() {


		}//end mounted
	}

</script>

<style lang="less" scoped>

</style>
