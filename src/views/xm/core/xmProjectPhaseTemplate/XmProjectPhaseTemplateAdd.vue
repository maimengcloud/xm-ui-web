<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<!--新增界面 XmProjectPhaseTemplate xm_phase_template--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm"> 
				<el-form-item label="计划名称" prop="phaseName">
					<el-input v-model="addForm.phaseName" placeholder="计划名称" ></el-input>
				</el-form-item> 
				<el-form-item label="序号" prop="seqNo">
					<el-input v-model="addForm.seqNo"  placeholder="排序序号，值越小越靠前，如1.0，1.1，1.1.1等"></el-input> 
				</el-form-item> 
				<el-form-item  label="计划类型" prop="planType"> 
					<el-select v-model="addForm.planType">
						<el-option v-for="i in this.options.planType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item  label="任务类型" prop="taskType"> 
					<el-select v-model="addForm.taskType">
						<el-option v-for="i in this.options.taskType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注" ></el-input>
				</el-form-item> 
				<el-form-item label="预计工时" prop="phaseBudgetHours">
					<el-input-number v-model="addForm.phaseBudgetHours" :precision="2" :step="8" :min="0" placeholder="工时(不包括下一级)-应该大于或等于任务中总工时"></el-input-number><el-tag>参考工时{{autoParams.phaseBudgetHours}}小时,工作日{{autoParams.weekday}}天</el-tag> <el-button @click.native="fillToField" type="success">填充</el-button>
				</el-form-item>  
				<el-form-item label="预计人数" prop="phaseBudgetStaffNu">
					<el-input-number v-model="addForm.phaseBudgetStaffNu" :precision="0" :step="1" :min="0" placeholder="投入人员数(不包括下一级)-应该大于或等于任务中总人数"></el-input-number> <el-tag>参考{{autoParams.phaseBudgetStaffNu}}人</el-tag>
				</el-form-item>  
				<el-form-item label="非人力成本总预算" prop="phaseBudgetNouserAt">
					<el-input-number v-model="addForm.phaseBudgetNouserAt" :precision="2" :step="1000" :min="0" placeholder="非人力成本总预算(不包括下一级)-应该大于或等于任务中非人力总成本"></el-input-number> <el-tag>参考{{autoParams.phaseBudgetNouserAt}}元，{{this.toFixed( autoParams.phaseBudgetNouserAt/10000)}}万元</el-tag>
				</el-form-item>  
				<el-form-item label="预计总工作量" prop="phaseBudgetWorkload">
					<el-input-number v-model="addForm.phaseBudgetWorkload" :precision="2" :step="8" :min="0" placeholder="预计总工作量(人时,不包括下一级)-应该大于或者等于任务中的预算总工作量"></el-input-number> <el-tag>参考{{autoParams.phaseBudgetWorkload}}人时，{{this.toFixed(autoParams.phaseBudgetWorkload/24/20)}}人月</el-tag>
				</el-form-item> 
				<el-form-item label="内部人力成本总预算" prop="phaseBudgetInnerUserAt">
					<el-input-number v-model="addForm.phaseBudgetInnerUserAt" :precision="2" :step="1000" :min="0" placeholder="内部人力成本总预算(不包括下一级)-应该大于或等于任务中内部人力总成本"></el-input-number> <el-tag>参考{{autoParams.phaseBudgetInnerUserAt}}元，{{this.toFixed(autoParams.phaseBudgetInnerUserAt/10000)}}万元</el-tag>
				</el-form-item> 
				<el-form-item label="外购人力成本总预算" prop="phaseBudgetOutUserAt">
					<el-input-number v-model="addForm.phaseBudgetOutUserAt" :precision="2" :step="1000" :min="0" placeholder="外购人力成本总预算(不包括下一级)-应该大于或等于任务中外购总成本"></el-input-number> <el-tag>参考{{autoParams.phaseBudgetOutUserAt}}元，{{this.toFixed(autoParams.phaseBudgetOutUserAt/10000)}}万元</el-tag>
				</el-form-item>
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addXmProjectPhaseTemplate } from '@/api/xm/core/xmProjectPhaseTemplate';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),
			autoParams:function(){
				
				var defaultPlanWorkingStaffNu=this.addForm.phaseBudgetStaffNu;
				if(defaultPlanWorkingStaffNu==null || defaultPlanWorkingStaffNu=='' || defaultPlanWorkingStaffNu <=0 ){
					defaultPlanWorkingStaffNu=1;
				} 
				var defaultPlanWorkingHours=this.addForm.phaseBudgetHours
				if(defaultPlanWorkingHours==null || defaultPlanWorkingHours=='' || defaultPlanWorkingHours<=0){
					defaultPlanWorkingHours=8
				}
				var autoParams={
					phaseBudgetHours:defaultPlanWorkingHours,
					phaseBudgetStaffNu: defaultPlanWorkingStaffNu,
					phaseBudgetWorkload: defaultPlanWorkingHours * defaultPlanWorkingStaffNu

				}
				 var phaseBudgetHours=defaultPlanWorkingHours; 
				autoParams.weekday=parseInt(phaseBudgetHours/8)
				autoParams.phaseBudgetHours=this.toFixed(phaseBudgetHours)
				autoParams.phaseBudgetWorkload= this.toFixed(autoParams.phaseBudgetHours*defaultPlanWorkingStaffNu)
				autoParams.phaseBudgetOutUserAt=this.toFixed( autoParams.phaseBudgetWorkload * 100 * 0.6)
				autoParams.phaseBudgetInnerUserAt=this.toFixed( autoParams.phaseBudgetWorkload * 100 * 0.4)
				autoParams.phaseBudgetNouserAt=autoParams.phaseBudgetWorkload * 100 * 0.2
				return autoParams
			}
		},
		props:['xmProjectPhaseTemplate','visible','xmParentPhaseTemplate','selProjectTemplate'],
		watch: {
	      'xmProjectPhaseTemplate':function( xmProjectPhaseTemplate ) {
			this.addForm = xmProjectPhaseTemplate;
			if(this.selProjectTemplate){
				this.addForm.projectId=this.selProjectTemplate.id
				this.addForm.projectName=this.selProjectTemplate.projectName
			}
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '计划主键不能为空', trigger: 'blur' }
					],					
					phaseName: [
						{ required: true, message: '计划名称不能为空', trigger: 'blur' }
					],
					planType: [
						//{ required: true, message: '请选择计划类型', trigger: 'blur' }
					],
					taskType: [
						{ required: true, message: '请选择任务类型', trigger: 'blur' }
					],
					seqNo: [
						{ required: true, message: '序号不能为空', trigger: 'blur' }
					],
				},
				//新增界面数据 xm_phase_template
				addForm: {
					id:'',phaseName:'',remark:'',parentPhaseId:'',branchId:'',beginDate:'',endDate:'',phaseBudgetHours:'',phaseBudgetStaffNu:'',projectTypeId:'',projectTypeName:'',phaseBudgetNouserAt:'',phaseBudgetInnerUserAt:'',phaseBudgetOutUserAt:'',phaseBudgetWorkload:'',"taskType":'',planType:'m1',seqNo:'1'
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmProjectPhaseTemplate xm_phase_template 父组件监听@submit="afterAddSubmit"
			addSubmit: function () { 
				if(!this.selProjectTemplate){
					this.$notify.error("模板不能为空，请先选择项目模板")
					return;
				}
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm);  
							if(this.xmParentPhaseTemplate){
								params.parentPhaseId=this.xmParentPhaseTemplate.id
								params.parentPhaseName=this.xmParentPhaseTemplate.phaseName
							} 
							params.projectId=this.selProjectTemplate.id
							params.projectName=this.selProjectTemplate.name
							addXmProjectPhaseTemplate(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/ 
			getWeekday(first, last) {
				//计算工作日方法：遍历这两个日期区间的每一个日期，获取他的getDay()

				//分别获取first和last的毫秒数(时间戳)
				first = first.getTime();
				last = last.getTime();

				var count = 0;
				for (var i = first; i <= last; i += 24 * 3600 * 1000) {
					var d = new Date(i);
					if (d.getDay() >= 1 && d.getDay() <= 5) {
						count++;
					}
				}
				return count;
			},
			toFixed(floatValue){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					return parseFloat(floatValue).toFixed(2);
				}
			},
			fillToField:function(){
				this.addForm=Object.assign(this.addForm,this.autoParams);
			}	
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-phase-template-edit':XmProjectPhaseTemplateEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmProjectPhaseTemplate);  
			if(this.selProjectTemplate){
				this.addForm.projectId=this.selProjectTemplate.id
				this.addForm.projectName=this.selProjectTemplate.projectName
			}
			/**在下面写其它函数***/
			listOption([{categoryId:'all',itemCode:'planType'},{categoryId:'all',itemCode:'taskType'}]).then(res=>{
				this.options=res.data.data;
			})

			
		}//end mounted
	}

</script>

<style scoped>

</style>