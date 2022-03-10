<template>
	<section class="page-container  padding border">
		<el-row>
			<!--新增界面 XmPhaseTemplate xm_phase_template--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm"> 
				<el-form-item label="计划名称" prop="name">
					<el-input v-model="editForm.name" placeholder="计划名称" ></el-input>
				</el-form-item> 
				<el-form-item label="序号" prop="seqNo">
					<el-input v-model="editForm.seqNo"   placeholder="排序序号，值越小越靠前，如1.0，2.0等"></el-input> 
				</el-form-item> 
				<el-form-item  label="计划类型" prop="planType"> 
					<el-select v-model="editForm.planType">
						<el-option v-for="i in this.options.planType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item  label="任务类型" prop="taskType"> 
					<el-select v-model="editForm.taskType">
						<el-option v-for="i in this.options.taskType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注" ></el-input>
				</el-form-item> 
				<el-form-item label="预计工时" prop="budgetHours">
					<el-input-number v-model="editForm.budgetHours" :precision="2" :step="8" :min="0" placeholder="工时(不包括下一级)-应该大于或等于任务中总工时"></el-input-number><el-tag>参考工时{{autoParams.budgetHours}}小时,工作日{{autoParams.weekday}}天</el-tag> <el-button @click.native="fillToField" type="success">填充</el-button>
				</el-form-item>  
				<el-form-item label="预计人数" prop="budgetStaffNu">
					<el-input-number v-model="editForm.budgetStaffNu" :precision="0" :step="1" :min="0" placeholder="投入人员数(不包括下一级)-应该大于或等于任务中总人数"></el-input-number> <el-tag>参考{{autoParams.budgetStaffNu}}人</el-tag>
				</el-form-item>  
				<el-form-item label="非人力成本总预算" prop="budgetNouserAt">
					<el-input-number v-model="editForm.budgetNouserAt" :precision="2" :step="1000" :min="0" placeholder="非人力成本总预算(不包括下一级)-应该大于或等于任务中非人力总成本"></el-input-number> <el-tag>参考{{autoParams.budgetNouserAt}}元，{{this.toFixed( autoParams.budgetNouserAt/10000)}}万元</el-tag>
				</el-form-item>  
				<el-form-item label="预计总工作量" prop="budgetWorkload">
					<el-input-number v-model="editForm.budgetWorkload" :precision="2" :step="8" :min="0" placeholder="预计总工作量(人时,不包括下一级)-应该大于或者等于任务中的预算总工作量"></el-input-number> <el-tag>参考{{autoParams.budgetWorkload}}人时，{{this.toFixed(autoParams.budgetWorkload/24/20)}}人月</el-tag>
				</el-form-item> 
				<el-form-item label="内部人力成本总预算" prop="budgetIuserAt">
					<el-input-number v-model="editForm.budgetIuserAt" :precision="2" :step="1000" :min="0" placeholder="内部人力成本总预算(不包括下一级)-应该大于或等于任务中内部人力总成本"></el-input-number> <el-tag>参考{{autoParams.budgetIuserAt}}元，{{this.toFixed(autoParams.budgetIuserAt/10000)}}万元</el-tag>
				</el-form-item> 
				<el-form-item label="外购人力成本总预算" prop="budgetOuserAt">
					<el-input-number v-model="editForm.budgetOuserAt" :precision="2" :step="1000" :min="0" placeholder="外购人力成本总预算(不包括下一级)-应该大于或等于任务中外购总成本"></el-input-number> <el-tag>参考{{autoParams.budgetOuserAt}}元，{{this.toFixed(autoParams.budgetOuserAt/10000)}}万元</el-tag>
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
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import {  editXmPhaseTemplate } from '@/api/xm/core/xmPhaseTemplate';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),
			autoParams:function(){
				
				var defaultPlanWorkingStaffNu=this.editForm.budgetStaffNu;
				if(defaultPlanWorkingStaffNu==null || defaultPlanWorkingStaffNu=='' || defaultPlanWorkingStaffNu <=0 ){
					defaultPlanWorkingStaffNu=1;
				} 
				var defaultPlanWorkingHours=this.editForm.budgetHours
				if(defaultPlanWorkingHours==null || defaultPlanWorkingHours=='' || defaultPlanWorkingHours<=0){
					defaultPlanWorkingHours=8
				}
				var autoParams={
					budgetHours:defaultPlanWorkingHours,
					budgetStaffNu: defaultPlanWorkingStaffNu,
					budgetWorkload: defaultPlanWorkingHours * defaultPlanWorkingStaffNu

				}
				 var budgetHours=defaultPlanWorkingHours; 
				autoParams.weekday=parseInt(budgetHours/8)
				autoParams.budgetHours=this.toFixed(budgetHours)
				autoParams.budgetWorkload= this.toFixed(autoParams.budgetHours*defaultPlanWorkingStaffNu)
				autoParams.budgetOuserAt=this.toFixed( autoParams.budgetWorkload * 100 * 0.6)
				autoParams.budgetIuserAt=this.toFixed( autoParams.budgetWorkload * 100 * 0.4)
				autoParams.budgetNouserAt=autoParams.budgetWorkload * 100 * 0.2
				return autoParams
			}
		},
		props:['xmPhaseTemplate','visible','xmParentPhaseTemplate'],
		watch: {
	      'xmPhaseTemplate':function( xmPhaseTemplate ) {
	        this.editForm = xmPhaseTemplate;
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
				load:{ list: false, add: false, del: false,  edit: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '计划主键不能为空', trigger: 'blur' }
					],				
					name: [
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
				 editForm: {
					id:'',name:'',remark:'',parentPhaseId:'',branchId:'',beginDate:'',endDate:'',budgetHours:'',budgetStaffNu:'',projectTypeId:'',projectTypeName:'',budgetNouserAt:'',budgetIuserAt:'',budgetOuserAt:'',budgetWorkload:'',"taskType":'',planType:'m1'
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
			//新增提交XmPhaseTemplate xm_phase_template 父组件监听@submit="afterAddSubmit"
			 editSubmit: function () {
				
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							if(this.xmParentPhaseTemplate){
								params.parentPhaseId=this.xmParentPhaseTemplate.id
								params.parentPhaseName=this.xmParentPhaseTemplate.name
							}
							 editXmPhaseTemplate(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.edit=false);
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
				this.editForm=Object.assign(this.editForm,this.autoParams);
			}	
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-phase-template-edit':XmPhaseTemplateEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmPhaseTemplate);  
			/**在下面写其它函数***/
			listOption([{categoryId:'all',itemCode:'planType'},{categoryId:'all',itemCode:'taskType'}]).then(res=>{
				this.options=res.data.data;
			})

			
		}//end mounted
	}

</script>

<style scoped>

</style>