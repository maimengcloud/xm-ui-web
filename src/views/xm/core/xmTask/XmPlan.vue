<template>
	<section> 
		<el-row>
			<el-col :span="8">
				<xm-phase :xm-product="xmProduct" :sel-project="selProject" queryScope="plan" @row-click="onPhaseRowClick"></xm-phase>
			</el-col> 
			<el-col :span="16">
				<xm-task-mng :xm-product="xmProduct" :sel-project="selProject" queryScope="task" :parent-task="parentTask"></xm-task-mng>
			</el-col>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	
 	import  XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';//新增界面
 	import  XmPhase from '@/views/xm/core/xmTask/XmPhase';//新增界面
 	import  XmTaskMng from '@/views/xm/core/xmTask/XmTaskMng';//新增界面
	export default { 
        
		components: {   
			XmProjectSelect,XmPhase,XmTaskMng
		},
        props:['xmProduct','selProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
            
			
        }, 
		watch: {  
			 
	    },
		data() {
			return { 
				parentTask:null,
				xmProject:null,
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false, 

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

<style scoped>
 
</style>