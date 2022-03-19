<template>
	<section class="page-container  padding border">
		<el-row>
			<!--新增界面 XmProjectKpi xm_project_kpi--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="项目编号" prop="projectId">
					<el-input v-model="addForm.projectId" placeholder="项目编号" ></el-input>
				</el-form-item> 
				<el-form-item label="机构编码" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="机构编码" ></el-input>
				</el-form-item> 
				<el-form-item label="指标编号" prop="kpiIndex">
					<el-input v-model="addForm.kpiIndex" placeholder="指标编号" ></el-input>
				</el-form-item> 
				<el-form-item label="指标名称" prop="kpiName">
					<el-input v-model="addForm.kpiName" placeholder="指标名称" ></el-input>
				</el-form-item> 
				<el-form-item label="最大值" prop="maxValue">
					<el-input v-model="addForm.maxValue" placeholder="最大值" ></el-input>
				</el-form-item> 
				<el-form-item label="最小值" prop="minValue">
					<el-input v-model="addForm.minValue" placeholder="最小值" ></el-input>
				</el-form-item> 
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="得分0~10分" prop="score">
					<el-input-number v-model="addForm.score" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="评分日期" prop="scoreDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.scoreDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="流程状态" prop="bizFlowState">
					<el-input v-model="addForm.bizFlowState" placeholder="流程状态" ></el-input>
				</el-form-item> 
				<el-form-item label="流程实例编号" prop="bizProcInstId">
					<el-input v-model="addForm.bizProcInstId" placeholder="流程实例编号" ></el-input>
				</el-form-item> 
				<el-form-item label="kpi当前值" prop="kpiValue">
					<el-input v-model="addForm.kpiValue" placeholder="kpi当前值" ></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注" ></el-input>
				</el-form-item> 
				<el-form-item label="考核方式0月1季度3半年4一年" prop="calcType">
					<el-input v-model="addForm.calcType" placeholder="考核方式0月1季度3半年4一年" ></el-input>
				</el-form-item> 
				<el-form-item label="下次考核开始时间" prop="nextCalcDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.nextCalcDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
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
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询 
	import { addXmProjectKpi } from '@/api/xm/core/xmProjectKpi';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectKpi','visible'],
		watch: {
	      'xmProjectKpi':function( xmProjectKpi ) {
	        this.addForm = xmProjectKpi;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 xm_project_kpi
				addForm: {
					projectId:'',branchId:'',kpiIndex:'',kpiName:'',maxValue:'',minValue:'',id:'',score:'',scoreDate:'',bizFlowState:'',bizProcInstId:'',kpiValue:'',remark:'',calcType:'',nextCalcDate:''
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
			//新增提交XmProjectKpi xm_project_kpi 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addXmProjectKpi(params).then((res) => {
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
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-kpi-edit':XmProjectKpiEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmProjectKpi);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>