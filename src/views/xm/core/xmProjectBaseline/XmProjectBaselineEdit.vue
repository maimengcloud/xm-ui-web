<template>
	<section>
		<el-row class="app-container"> 
		<!--编辑界面 XmProjectBaseline xm_project_baseline--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="基线表主键" prop="id">
					<el-input v-model="editForm.id" placeholder="基线表主键"></el-input>
				</el-form-item> 
				<el-form-item label="项目代号" prop="code">
					<el-input v-model="editForm.code" placeholder="项目代号"></el-input>
				</el-form-item> 
				<el-form-item label="项目名称" prop="name">
					<el-input v-model="editForm.name" placeholder="项目名称"></el-input>
				</el-form-item> 
				<el-form-item label="项目类型" prop="xmType">
					<el-input v-model="editForm.xmType" placeholder="项目类型"></el-input>
				</el-form-item> 
				<el-form-item label="项目开始时间" prop="startTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="项目结束时间" prop="endTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="紧急程度" prop="urgent">
					<el-input v-model="editForm.urgent" placeholder="紧急程度"></el-input>
				</el-form-item> 
				<el-form-item label="优先程度" prop="priority">
					<el-input v-model="editForm.priority" placeholder="优先程度"></el-input>
				</el-form-item> 
				<el-form-item label="项目描述" prop="description">
					<el-input v-model="editForm.description" placeholder="项目描述"></el-input>
				</el-form-item> 
				<el-form-item label="项目创建人编号" prop="createUserid">
					<el-input v-model="editForm.createUserid" placeholder="项目创建人编号"></el-input>
				</el-form-item> 
				<el-form-item label="项目创建人" prop="createUsername">
					<el-input v-model="editForm.createUsername" placeholder="项目创建人"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="createTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="项目考核" prop="assess">
					<el-input v-model="editForm.assess" placeholder="项目考核"></el-input>
				</el-form-item> 
				<el-form-item label="考核备注" prop="assessRemarks">
					<el-input v-model="editForm.assessRemarks" placeholder="考核备注"></el-input>
				</el-form-item> 
				<el-form-item label="项目状态，0-初始，1-立项中，2-执行中，3-已结项，4-暂停" prop="status">
					<el-input v-model="editForm.status" placeholder="项目状态，0-初始，1-立项中，2-执行中，3-已结项，4-暂停"></el-input>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构编号"></el-input>
				</el-form-item> 
				<el-form-item label="总预算" prop="planTotalCost">
					<el-input v-model="editForm.planTotalCost" placeholder="总预算"></el-input>
				</el-form-item> 
				<el-form-item label="当前流程实例编号" prop="bizProcInstId">
					<el-input v-model="editForm.bizProcInstId" placeholder="当前流程实例编号"></el-input>
				</el-form-item> 
				<el-form-item label="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除" prop="bizFlowState">
					<el-input v-model="editForm.bizFlowState" placeholder="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除"></el-input>
				</el-form-item> 
				<el-form-item label="非人力成本总预算-应该大于或等于阶段计划非人力总成本" prop="planNouserAt">
					<el-input v-model="editForm.planNouserAt" placeholder="非人力成本总预算-应该大于或等于阶段计划非人力总成本"></el-input>
				</el-form-item> 
				<el-form-item label="内部人力成本总预算-应该大于或等于阶段计划内部人力总成本" prop="planInnerUserAt">
					<el-input v-model="editForm.planInnerUserAt" placeholder="内部人力成本总预算-应该大于或等于阶段计划内部人力总成本"></el-input>
				</el-form-item> 
				<el-form-item label="外购人力成本总预算-应该大于或等于阶段计划外购人力总成本" prop="planOutUserAt">
					<el-input v-model="editForm.planOutUserAt" placeholder="外购人力成本总预算-应该大于或等于阶段计划外购人力总成本"></el-input>
				</el-form-item> 
				<el-form-item label="是否锁定整个项目不允许变化0否1是" prop="locked">
					<el-input v-model="editForm.locked" placeholder="是否锁定整个项目不允许变化0否1是"></el-input>
				</el-form-item> 
				<el-form-item label="基线时间" prop="baseTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.baseTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="基线备注" prop="baseRemark">
					<el-input v-model="editForm.baseRemark" placeholder="基线备注"></el-input>
				</el-form-item> 
				<el-form-item label="基线主键" prop="baselineId">
					<el-input v-model="editForm.baselineId" placeholder="基线主键"></el-input>
				</el-form-item> 
				<el-form-item label="总预算工作量-应该大于或等于阶段计划总工作量" prop="planWorkload">
					<el-input v-model="editForm.planWorkload" placeholder="总预算工作量-应该大于或等于阶段计划总工作量"></el-input>
				</el-form-item> 
				<el-form-item label="总预计收款金额" prop="totalReceivables">
					<el-input v-model="editForm.totalReceivables" placeholder="总预计收款金额"></el-input>
				</el-form-item> 
				<el-form-item label="预估毛利率" prop="budgetMarginRate">
					<el-input v-model="editForm.budgetMarginRate" placeholder="预估毛利率"></el-input>
				</el-form-item> 
				<el-form-item label="合同总金额" prop="contractAmt">
					<el-input v-model="editForm.contractAmt" placeholder="合同总金额"></el-input>
				</el-form-item> 
				<el-form-item label="内部人力成本单价元/人时" prop="planInnerUserPrice">
					<el-input v-model="editForm.planInnerUserPrice" placeholder="内部人力成本单价元/人时"></el-input>
				</el-form-item> 
				<el-form-item label="外购人力成本单价元/人时" prop="planOutUserPrice">
					<el-input v-model="editForm.planOutUserPrice" placeholder="外购人力成本单价元/人时"></el-input>
				</el-form-item> 
				<el-form-item label="外购人数" prop="planOutUserCnt">
					<el-input-number v-model="editForm.planOutUserCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="内部人数" prop="planInnerUserCnt">
					<el-input-number v-model="editForm.planInnerUserCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="预计工作小时数目" prop="planWorkingHours">
					<el-input-number v-model="editForm.planWorkingHours" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="税率" prop="taxRate">
					<el-input v-model="editForm.taxRate" placeholder="税率"></el-input>
				</el-form-item> 
				<el-form-item label="内部人力总工作量-应该大于或等于阶段计划内部人力总成本" prop="planInnerUserWorkload">
					<el-input v-model="editForm.planInnerUserWorkload" placeholder="内部人力总工作量-应该大于或等于阶段计划内部人力总成本"></el-input>
				</el-form-item> 
				<el-form-item label="外购人力总工作量-应该大于或等于阶段计划外购人力总成本" prop="planOutUserWorkload">
					<el-input v-model="editForm.planOutUserWorkload" placeholder="外购人力总工作量-应该大于或等于阶段计划外购人力总成本"></el-input>
				</el-form-item> 
				<el-form-item label="项目编号" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="项目编号"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item> 
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editXmProjectBaseline } from '@/api/xm/core/xmProjectBaseline';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectBaseline','visible'],
		watch: {
	      'xmProjectBaseline':function( xmProjectBaseline ) {
	        this.editForm = xmProjectBaseline;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '基线表主键不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmProjectBaseline xm_project_baseline
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planInnerUserAt:'',planOutUserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planInnerUserPrice:'',planOutUserPrice:'',planOutUserCnt:'',planInnerUserCnt:'',planWorkingHours:'',taxRate:'',planInnerUserWorkload:'',planOutUserWorkload:'',projectId:'',ctime:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交XmProjectBaseline xm_project_baseline父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmProjectBaseline(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-baseline-edit':XmProjectBaselineEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmProjectBaseline);  
		}
	}

</script>

<style scoped>

</style>