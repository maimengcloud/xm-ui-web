<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmProductStateHis 功能状态表,无需前端维护，所有数据由汇总统计得出--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="开始时间" prop="planStartTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.planStartTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束时间" prop="planEndTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.planEndTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="实际开始时间" prop="actStartTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.actStartTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="实际结束时间" prop="actEndTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.actEndTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="计划工作量，根据关联任务汇总" prop="planWorkload">
					<el-input v-model="editForm.planWorkload" placeholder="计划工作量，根据关联任务汇总"></el-input>
				</el-form-item> 
				<el-form-item label="实际工作量，根据关联任务汇总" prop="actWorkload">
					<el-input v-model="editForm.actWorkload" placeholder="实际工作量，根据关联任务汇总"></el-input>
				</el-form-item> 
				<el-form-item label="计划成本，根据关联任务汇总" prop="planCostAmount">
					<el-input v-model="editForm.planCostAmount" placeholder="计划成本，根据关联任务汇总"></el-input>
				</el-form-item> 
				<el-form-item label="实际成本金额根据关联任务汇总" prop="actCostAmount">
					<el-input v-model="editForm.actCostAmount" placeholder="实际成本金额根据关联任务汇总"></el-input>
				</el-form-item> 
				<el-form-item label="总体完成比例0-100之间,根据taskType进行汇总" prop="finishRate">
					<el-input v-model="editForm.finishRate" placeholder="总体完成比例0-100之间,根据taskType进行汇总"></el-input>
				</el-form-item> 
				<el-form-item label="需求完成率0-100之间,根据taskType进行汇总" prop="demandRate">
					<el-input v-model="editForm.demandRate" placeholder="需求完成率0-100之间,根据taskType进行汇总"></el-input>
				</el-form-item> 
				<el-form-item label="设计完成率0-100之间,根据taskType进行汇总" prop="designRate">
					<el-input v-model="editForm.designRate" placeholder="设计完成率0-100之间,根据taskType进行汇总"></el-input>
				</el-form-item> 
				<el-form-item label="开发完成率0-100之间,根据taskType进行汇总" prop="devRate">
					<el-input v-model="editForm.devRate" placeholder="开发完成率0-100之间,根据taskType进行汇总"></el-input>
				</el-form-item> 
				<el-form-item label="uat测试完成率0-100之间,根据taskType进行汇总" prop="uatRate">
					<el-input v-model="editForm.uatRate" placeholder="uat测试完成率0-100之间,根据taskType进行汇总"></el-input>
				</el-form-item> 
				<el-form-item label="sit测试完成率0-100之间,根据taskType进行汇总" prop="sitRate">
					<el-input v-model="editForm.sitRate" placeholder="sit测试完成率0-100之间,根据taskType进行汇总"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="更新时间" prop="ltime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ltime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="创建人编号" prop="cuserid">
					<el-input v-model="editForm.cuserid" placeholder="创建人编号"></el-input>
				</el-form-item> 
				<el-form-item label="创建人姓名" prop="cusername">
					<el-input v-model="editForm.cusername" placeholder="创建人姓名"></el-input>
				</el-form-item> 
				<el-form-item label="汇总时间" prop="calcTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.calcTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="工时数" prop="planWorkhours">
					<el-input v-model="editForm.planWorkhours" placeholder="工时数"></el-input>
				</el-form-item> 
				<el-form-item label="总人数" prop="planWorkerCnt">
					<el-input v-model="editForm.planWorkerCnt" placeholder="总人数"></el-input>
				</el-form-item> 
				<el-form-item label="总关闭bugs" prop="closedBugs">
					<el-input v-model="editForm.closedBugs" placeholder="总关闭bugs"></el-input>
				</el-form-item> 
				<el-form-item label="激活bugs" prop="activeBugs">
					<el-input v-model="editForm.activeBugs" placeholder="激活bugs"></el-input>
				</el-form-item> 
				<el-form-item label="已确认bugs总数" prop="confirmedBugs">
					<el-input v-model="editForm.confirmedBugs" placeholder="已确认bugs总数"></el-input>
				</el-form-item> 
				<el-form-item label="已解决bugs总数" prop="resolvedBugs">
					<el-input v-model="editForm.resolvedBugs" placeholder="已解决bugs总数"></el-input>
				</el-form-item> 
				<el-form-item label="产品编号" prop="productId">
					<el-input v-model="editForm.productId" placeholder="产品编号"></el-input>
				</el-form-item> 
				<el-form-item label="产品名称" prop="productName">
					<el-input v-model="editForm.productName" placeholder="产品名称"></el-input>
				</el-form-item> 
				<el-form-item label="测试案例总数" prop="testCases">
					<el-input-number v-model="editForm.testCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="测试中案例总数" prop="execCases">
					<el-input-number v-model="editForm.execCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="设计中案例总数" prop="designCases">
					<el-input-number v-model="editForm.designCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="完成案例总数" prop="finishCases">
					<el-input-number v-model="editForm.finishCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="关联项目数" prop="projectCnt">
					<el-input-number v-model="editForm.projectCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="关联迭代数" prop="iterationCnt">
					<el-input-number v-model="editForm.iterationCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="任务总数" prop="taskCnt">
					<el-input-number v-model="editForm.taskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="已完成的任务总数" prop="finishTaskCnt">
					<el-input-number v-model="editForm.finishTaskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="业务日期yyyy-MM-dd字符串" prop="bizDate">
					<el-input v-model="editForm.bizDate" placeholder="业务日期yyyy-MM-dd字符串"></el-input>
				</el-form-item> 
				<el-form-item label="机构号码" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构号码"></el-input>
				</el-form-item> 
				<el-form-item label="bug总数" prop="bugCnt">
					<el-input-number v-model="editForm.bugCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="故事数" prop="menuCnt">
					<el-input-number v-model="editForm.menuCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="需求完成数" prop="menuFinishCnt">
					<el-input-number v-model="editForm.menuFinishCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="预估工时=计划结束时间在计算当日前完成的任务的预算工时总和" prop="estimateWorkload">
					<el-input v-model="editForm.estimateWorkload" placeholder="预估工时=计划结束时间在计算当日前完成的任务的预算工时总和"></el-input>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row   class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { addXmProductStateHis,editXmProductStateHis } from '@/api/xm/core/xmProductStateHis';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmProductStateHisEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmProductStateHis','visible','opType'],

		watch: {
	      'xmProductStateHis':function( xmProductStateHis ) {
	        if(xmProductStateHis){
	            this.editForm = xmProductStateHis;
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
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					productId: [
						//{ required: true, message: '产品编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					planStartTime:'',planEndTime:'',actStartTime:'',actEndTime:'',planWorkload:'',actWorkload:'',planCostAmount:'',actCostAmount:'',finishRate:'',demandRate:'',designRate:'',devRate:'',uatRate:'',sitRate:'',ctime:'',ltime:'',cuserid:'',cusername:'',calcTime:'',planWorkhours:'',planWorkerCnt:'',closedBugs:'',activeBugs:'',confirmedBugs:'',resolvedBugs:'',productId:'',productName:'',testCases:'',execCases:'',designCases:'',finishCases:'',projectCnt:'',iterationCnt:'',taskCnt:'',finishTaskCnt:'',bizDate:'',branchId:'',bugCnt:'',menuCnt:'',menuFinishCnt:'',estimateWorkload:''
				},
                maxTableHeight:300,
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmProductStateHis 功能状态表,无需前端维护，所有数据由汇总统计得出父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmProductStateHis
							if(this.currOpType=='edit'){
							    func=editXmProductStateHis
							}
							func(params).then((res) => {
                                this.load.edit=false
                                var tips=res.data.tips;
                                if(tips.isOk){
                                    this.editForm=res.data.data
                                    this.initData()
                                    this.currOpType="edit";
                                    this.$emit('submit');//  @submit="afterAddSubmit"
                                }
                                this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$notify({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.xmProductStateHis){
                    this.editForm = Object.assign({},this.xmProductStateHis);
                }

                if(this.opType=='edit'){

                }else{

                }
            },

		},//end method
		mounted() {
		    this.$nextTick(() => {
                //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
                this.initData()
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style scoped>

</style>