<template>
	<section>
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main"  ref="table">
		<!--编辑界面 XmTaskWorkload 工时登记表-->
			<el-form :model="editForm" label-width="100px"  :rules="editFormRules" ref="editFormRef">
				<el-row v-if="editForm.ntype==='0'">
					
					<el-col :span="6">
						<el-form-item label="原估工时" prop="initWorkload">
							{{editForm.initWorkload?editForm.initWorkload:'0'}} &nbsp;小时
						</el-form-item> 
					</el-col>  
					<el-col :span="6">
						<el-form-item label="预估工时" prop="budgetWorkload">
							 <el-input :controls="false" type="number" :step="8" style="width:80%;"  v-model="editForm.budgetWorkload" placeholder="预估工时" @change="editXmTaskSomeFields(editForm,'budgetWorkload',$event)"></el-input> &nbsp;小时
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="已登工时" prop="actWorkload">
							{{editForm.actWorkload?editForm.actWorkload:0}} &nbsp; 小时<el-tag type="primary">{{editForm.rate}}%</el-tag>
 						</el-form-item>
					</el-col> 
				</el-row>
				<el-row v-else>
					
					<el-col :span="6">
						<el-form-item label="原估工时" prop="initWorkload">
							{{editForm.initWorkload?editForm.initWorkload:'0'}} &nbsp;小时
						</el-form-item> 
					</el-col>  
					<el-col :span="6">
						<el-form-item label="预估工时" prop="budgetWorkload">
							 {{editForm.budgetWorkload}} &nbsp;小时
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="已登工时" prop="actWorkload">
							{{editForm.actWorkload?editForm.actWorkload:0}} &nbsp; 小时,<el-tag type="primary">{{editForm.rate}}%</el-tag>
 						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-row>
		<el-row>
			<xm-task-workload-list v-if="editForm.ntype==='0'" :visible="visible" :xm-task="editForm" @submit="onWorkloadSubmit"></xm-task-workload-list>
		</el-row> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { getTask, editXmTaskSomeFields } from '@/api/xm/core/xmTask';
	import { mapGetters } from 'vuex'
	import XmTaskWorkloadList from './XmTaskWorkloadList';

	export default {
	    name:'xmTaskWorkloadEdit',
	    components: {
			XmTaskWorkloadList,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTask','visible'],

		watch: {
	      'xmTask':{ 
			  handler(){
				  this.initData()
			  }
 	      		
	      },
	      'visible':function(visible) {
	      	if(visible==true){
 	      		this.initData()
	      	}
	      }
	    },
		data() {
			return { 
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},//新增界面数据 xm_task
				editForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'3',sortLevel:'0',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',taskOut:'0',
					rate:0,budgetCost:'',budgetWorkload:'',actCost:'',actWorkload:'',taskState:'0',taskClass:'0',toTaskCenter:'0',actStartTime:'',actEndTime:'',taskType:'4',planType:'w2',settleSchemel:'1',ntype:'0',childrenCnt:0
					,rworkload:null,
				},
                maxTableHeight:300,
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){ 
				this.$emit('cancel');
			},
			//新增、编辑提交XmTaskWorkload 工时登记表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
			},
			initData: function(){ 
				this.editForm=Object.assign({},this.xmTask)
				this.editFormBak=Object.assign({},this.editForm)
            },
			
			editXmTaskSomeFields(row,fieldName,$event){
				
				var params={ids:[row.id]}; 
				params[fieldName]=$event
				if(fieldName==='rworkload'||fieldName==='budgetWorkload'){ 
					var total=row.budgetWorkload;
					if(row.actWorkload>0 && row.rworkload>0){
						total=Math.round(row.actWorkload,2)+Math.round(row.rworkload,2)
					}
					var rate=Math.round(Math.round(row.actWorkload,2)/total*100) 
					if(rate>100){
						rate=100;
					}
					params.rate=rate
					row.rate=rate
				}
				editXmTaskSomeFields(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){ 
						//Object.assign(row,params) 
						this.$emit("edit-xm-task-some-fields",params);
					}else{
						this.editForm=Object.assign(this.editForm,this.editFormBak)
						this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
					}
				})
			},
			onWorkloadSubmit(){
				getTask({id:this.xmTask.id}).then(res=>{
					var tips = res.data.tips
					if(tips.isOk){
						if(res.data.data.length>0){
							Object.assign(this.xmTask,res.data.data[0])
							Object.assign(this.editForm,this.xmTask) 
							Object.assign(this.editFormBak,this.xmTask)
							this.$emit('submit',this.editForm)
						}
					}
				})
			}
		},//end method
		mounted() {
		    this.$nextTick(() => {
                //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
                this.initData() 
            });
		}
	}

</script>

<style scoped>

</style>
