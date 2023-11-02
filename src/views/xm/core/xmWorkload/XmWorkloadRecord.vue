<template>
	<section>
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main"  ref="table">
		<!--编辑界面 XmWorkload 工时登记表-->
			<el-form :model="editForm" label-width="100px"  :rules="editFormRules" ref="editFormRef">
				<el-row v-if="bizType=='1' && editForm.ntype==='0'">
					<el-col :span="8">
						<el-form-item label="原估工时" prop="initWorkload">
							 <el-input  :controls="false" type="number" :step="8" style="width:80%;"  v-model="editForm.initWorkload" placeholder="原估工时" @change="editSomeFields(editForm,'initWorkload',$event)"></el-input> &nbsp;小时
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="预估工时" prop="budgetWorkload">
							 <el-input  :controls="false" type="number" :step="8" style="width:80%;"  v-model="editForm.budgetWorkload" placeholder="预估工时" @change="editSomeFields(editForm,'budgetWorkload',$event)"></el-input> &nbsp;小时
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="已登工时" prop="actWorkload">
							{{editForm.actWorkload?editForm.actWorkload:0}} &nbsp; 小时<el-tag type="primary">{{editForm.rate}}%</el-tag>
 						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-else>
					<el-col :span="8">
							<el-form-item label="原估工时" prop="initWorkload">
								<el-input  :controls="false" type="number" :step="8" style="width:80%;"  v-model="editForm.initWorkload" placeholder="原估工时" @change="editSomeFields(editForm,'initWorkload',$event)"></el-input> &nbsp;小时
							</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="预估工时" prop="budgetWorkload">
							 {{editForm.budgetWorkload}} &nbsp;小时
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="已登工时" prop="actWorkload">
							{{editForm.actWorkload?editForm.actWorkload:0}} &nbsp; 小时,<el-tag type="primary">{{editForm.rate}}%</el-tag>
 						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-row>
		<el-row>
			<xm-workload-list v-if="(bizType=='1'&& editForm.ntype=='0')||(bizType=='5' && editForm.dclass=='3')||bizType=='2'||bizType=='3'||bizType=='4'" :visible="visible" :biz-type="bizType" :xm-task="xmTask" :xm-menu="xmMenu" :xm-test-case="xmTestCase" :xm-test-plan-case="xmTestPlanCase" :xm-question="xmQuestion"  @submit="onWorkloadSubmit"></xm-workload-list>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import

	import { getTask, editXmTaskSomeFields } from '@/api/xm/core/xmTask';

	import { editSomeFieldsXmTestCase } from '@/api/xm/core/xmTestCase';
	import { editSomeFieldsXmTestPlanCase } from '@/api/xm/core/xmTestPlanCase';
	import { editXmQuestionSomeFields } from '@/api/xm/core/xmQuestion';
	import { mapGetters } from 'vuex'
	import XmWorkloadList from './XmWorkloadList';

	export default {
	    name:'xmWorkloadEdit',
	    components: {
			XmWorkloadList,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),
			initVal(){

				var params={}
				if( this.xmTask && this.xmTask.id){
					params.id=this.xmTask.id
					params.initWorkload=this.xmTask.initWorkload
					params.budgetWorkload=this.xmTask.budgetWorkload
					params.actWorkload=this.xmTask.actWorkload
					params.ntype=this.xmTask.ntype
				}
				if( this.xmMenu && this.xmMenu.menuId){
					params.menuId=this.xmMenu.menuId
					params.initWorkload=this.xmMenu.initWorkload
					params.budgetWorkload=this.xmMenu.budgetWorkload
					params.actWorkload=this.xmMenu.actWorkload
					params.ntype=this.xmMenu.ntype
					params.dclass=this.xmMenu.dclass
				}
				if( this.xmQuestion && this.xmQuestion.id){
					params.id=this.xmQuestion.id
					params.initWorkload=this.xmQuestion.initWorkload
					params.budgetWorkload=this.xmQuestion.budgetWorkload
					params.actWorkload=this.xmQuestion.actWorkload
				}
				if( this.xmTestCase && this.xmTestCase.id){
					params.id=this.xmTestCase.id
					params.initWorkload=this.xmTestCase.initWorkload
					params.budgetWorkload=this.xmTestCase.budgetWorkload
					params.actWorkload=this.xmTestCase.actWorkload
				}
				if( this.xmTestPlanCase && this.xmTestPlanCase.planId){
					params.planId=this.xmTestPlanCase.planId
					params.caseId=this.xmTestPlanCase.caseId
					params.initWorkload=this.xmTestPlanCase.initWorkload
					params.budgetWorkload=this.xmTestPlanCase.budgetWorkload
					params.actWorkload=this.xmTestPlanCase.actWorkload
				}
				if(params.budgetWorkload!==null && params.budgetWorkload!=='' && params.budgetWorkload>0){
					params.rate= parseInt((params.actWorkload>0?params.actWorkload:0) / params.budgetWorkload * 100)
				}else{
					params.rate= 0
				}
				return params
			}

		},
		props:['xmTask','visible','bizType'/*报工类型1-任务，2-缺陷，3-测试用例设计，4-测试执行 */,
		'xmMenu','xmTestCase','xmQuestion','xmTestPlanCase'],

		watch: {

	      'visible':function(visible) {
	      	if(visible==true){
 	      		this.initData()
	      	}
	      },
			initVal:{
				handler(){
					this.initData();
				},
				deep:true,
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
					,rworkload:null,dclass:'',
				},
                maxTableHeight:300,
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增、编辑提交XmWorkload 工时登记表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
			},
			initData: function(){

				this.editForm=Object.assign({},this.initVal)
				this.editFormBak=Object.assign({},this.editForm)
            },



			editSomeFields(row,fieldName,$event){

				var func=null;
				var emit="edit-some-fields"
				var params={ids:[row.id]};
				if(this.bizType==='1'){
					func=editXmTaskSomeFields

				}else if(this.bizType==='2'){
					func=editXmQuestionSomeFields
				}else if(this.bizType==='3'){
					func=editSomeFieldsXmTestCase
				}else if(this.bizType==='4'){
					func=editSomeFieldsXmTestPlanCase
					params={pkList:[{planId:row.planId,caseId:row.caseId}]};
				}else if(this.bizType==='5'){
					this.editForm=Object.assign(this.editForm,this.editFormBak)
					this.$notify({position:'bottom-left',showClose:true,message:"需求数据不允许手工修改",type:tips.isOk?'success':'error'})
					return
				}
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
				func(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						this.$emit(emit,params);
					}else{
						this.editForm=Object.assign(this.editForm,this.editFormBak)
						this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
					}
				})
			},
			onWorkloadSubmit(){
				if(this.bizType=='1'){
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
			}
		},//end method
		mounted() {
		    this.$nextTick(() => {

                this.initData()
            });
		}
	}

</script>

<style scoped>

</style>
