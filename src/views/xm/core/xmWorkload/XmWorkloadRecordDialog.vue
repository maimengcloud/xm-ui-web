<template>
	<section>
	     <el-dialog append-to-body width="80%" top="20px" :visible.sync="visible" :title="'任务【'+editForm.name+'】工时登记'">
			 <xm-workload-record :visible="visible" :xm-task="editForm" @edit-xm-task-some-fields="onEditXmTaskSomeFields" @submit="onWorkloadSubmit"></xm-workload-record></el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import

	import { mapGetters } from 'vuex'
	import XmWorkloadRecord from './XmWorkloadRecord';

	export default {
	    name:'xmWorkloadRecordDialog',
	    components: {
			XmWorkloadRecord,
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
			//新增、编辑提交XmWorkload 工时登记表父组件监听@submit="afterEditSubmit"
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
			},
			onEditXmTaskSomeFields(data){
				this.$emit('edit-xm-task-some-fields',data);
			},
			onWorkloadSubmit(data){
				this.$emit('submit',data)
			}

		},//end method
		mounted() {
		}
	}

</script>

<style scoped>

</style>
