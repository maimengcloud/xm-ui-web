<template>
	<section>
	     <el-dialog append-to-body width="80%" top="20px" :visible.sync="visible" :title="'任务【'+editForm.name+'】工时登记'"><xm-task-workload-record :visible="visible" :xm-task="editForm"></xm-task-workload-record></el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表 
	import { mapGetters } from 'vuex'
	import XmTaskWorkloadRecord from './XmTaskWorkloadRecord';

	export default {
	    name:'xmTaskWorkloadRecordDialog',
	    components: {
			XmTaskWorkloadRecord,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		 

		watch: { 
	    },
		data() {
			return { 
				visible:false,
				editForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'3',sortLevel:'0',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',taskOut:'0',
					rate:0,budgetCost:'',budgetWorkload:'',actCost:'',actWorkload:'',taskState:'0',taskClass:'0',toTaskCenter:'0',actStartTime:'',actEndTime:'',taskType:'4',planType:'w2',settleSchemel:'1',ntype:'0',childrenCnt:0
  
				}, 
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){ 
				this.visible=false;
				this.$emit('cancel');
			},
			//新增、编辑提交XmTaskWorkload 工时登记表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				 
			},
			initData: function(){
			    
            },
			open(xmTask){
				this.editForm={...xmTask}
				this.visible=true;
			},
			close(){
				this.visible=false;
				this.$emit("close");
			}

		},//end method
		mounted() { 
		}
	}

</script>

<style scoped>

</style>
