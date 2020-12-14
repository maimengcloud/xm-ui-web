<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 XmMenuPlan 功能计划表,无需前端维护，所有数据由汇总统计得出--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="项目编号" prop="projectId">
					<el-input v-model="addForm.projectId" placeholder="项目编号" ></el-input>
				</el-form-item> 
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="项目名称" prop="projectName">
					<el-input v-model="addForm.projectName" placeholder="项目名称" ></el-input>
				</el-form-item> 
				<el-form-item label="功能编号" prop="menuId">
					<el-input v-model="addForm.menuId" placeholder="功能编号" ></el-input>
				</el-form-item> 
				<el-form-item label="开始时间" prop="planStartTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.planStartTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束时间" prop="planEndTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.planEndTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="实际开始时间" prop="actStartTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.actStartTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="实际结束时间" prop="actEndTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.actEndTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="计划工作量，根据关联任务汇总" prop="planWorkload">
					<el-input v-model="addForm.planWorkload" placeholder="计划工作量，根据关联任务汇总"></el-input>
				</el-form-item> 
				<el-form-item label="实际工作量，根据关联任务汇总" prop="actWorkload">
					<el-input v-model="addForm.actWorkload" placeholder="实际工作量，根据关联任务汇总"></el-input>
				</el-form-item> 
				<el-form-item label="计划成本，根据关联任务汇总" prop="planCostAmount">
					<el-input v-model="addForm.planCostAmount" placeholder="计划成本，根据关联任务汇总"></el-input>
				</el-form-item> 
				<el-form-item label="实际成本金额根据关联任务汇总" prop="actCostAmount">
					<el-input v-model="addForm.actCostAmount" placeholder="实际成本金额根据关联任务汇总"></el-input>
				</el-form-item> 
				<el-form-item label="总体完成比例0-100之间,根据taskType进行汇总" prop="finishRate">
					<el-input v-model="addForm.finishRate" placeholder="总体完成比例0-100之间,根据taskType进行汇总"></el-input>
				</el-form-item> 
				<el-form-item label="需求完成率0-100之间,根据taskType进行汇总" prop="demandRate">
					<el-input v-model="addForm.demandRate" placeholder="需求完成率0-100之间,根据taskType进行汇总"></el-input>
				</el-form-item> 
				<el-form-item label="设计完成率0-100之间,根据taskType进行汇总" prop="designRate">
					<el-input v-model="addForm.designRate" placeholder="设计完成率0-100之间,根据taskType进行汇总"></el-input>
				</el-form-item> 
				<el-form-item label="开发完成率0-100之间,根据taskType进行汇总" prop="devRate">
					<el-input v-model="addForm.devRate" placeholder="开发完成率0-100之间,根据taskType进行汇总"></el-input>
				</el-form-item> 
				<el-form-item label="uat测试完成率0-100之间,根据taskType进行汇总" prop="uatRate">
					<el-input v-model="addForm.uatRate" placeholder="uat测试完成率0-100之间,根据taskType进行汇总"></el-input>
				</el-form-item> 
				<el-form-item label="sit测试完成率0-100之间,根据taskType进行汇总" prop="sitRate">
					<el-input v-model="addForm.sitRate" placeholder="sit测试完成率0-100之间,根据taskType进行汇总"></el-input>
				</el-form-item> 
				<el-form-item label="上线状态0未上线1上线成功" prop="onlineStatus">
					<el-input v-model="addForm.onlineStatus" placeholder="上线状态0未上线1上线成功" ></el-input>
				</el-form-item> 
				<el-form-item label="上线时间" prop="onlineTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.onlineTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="计划状态0初始1正常2暂停3延误4结束5关闭" prop="planStatus">
					<el-input v-model="addForm.planStatus" placeholder="计划状态0初始1正常2暂停3延误4结束5关闭" ></el-input>
				</el-form-item> 
				<el-form-item label="负责人编号" prop="chargeUserid">
					<el-input v-model="addForm.chargeUserid" placeholder="负责人编号" ></el-input>
				</el-form-item> 
				<el-form-item label="负责人姓名" prop="chargeUsername">
					<el-input v-model="addForm.chargeUsername" placeholder="负责人姓名" ></el-input>
				</el-form-item> 
				<el-form-item label="状态0初始1设计中2开发中3测试中4uat测试2已上线3已下线4已删除" prop="menuStatus">
					<el-input v-model="addForm.menuStatus" placeholder="状态0初始1设计中2开发中3测试中4uat测试2已上线3已下线4已删除" ></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.ctime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="更新时间" prop="ltime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.ltime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="创建人编号" prop="cuserid">
					<el-input v-model="addForm.cuserid" placeholder="创建人编号" ></el-input>
				</el-form-item> 
				<el-form-item label="创建人姓名" prop="cusername">
					<el-input v-model="addForm.cusername" placeholder="创建人姓名" ></el-input>
				</el-form-item> 
				<el-form-item label="汇总时间" prop="calcTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.calcTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="菜单名字" prop="menuName">
					<el-input v-model="addForm.menuName" placeholder="菜单名字" ></el-input>
				</el-form-item> 
				<el-form-item label="工时数" prop="planWorkhours">
					<el-input v-model="addForm.planWorkhours" placeholder="工时数"></el-input>
				</el-form-item> 
				<el-form-item label="总人数" prop="planWorkerCnt">
					<el-input-number v-model="addForm.planWorkerCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="总关闭bugs" prop="closedBugs">
					<el-input-number v-model="addForm.closedBugs" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="激活bugs" prop="activeBugs">
					<el-input-number v-model="addForm.activeBugs" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="已确认bugs总数" prop="confirmedBugs">
					<el-input-number v-model="addForm.confirmedBugs" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="已解决bugs总数" prop="resolvedBugs">
					<el-input-number v-model="addForm.resolvedBugs" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="测试用例总数" prop="testCases">
					<el-input-number v-model="addForm.testCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="测试中用例总数" prop="execCases">
					<el-input-number v-model="addForm.execCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="设计中用例总数" prop="designCases">
					<el-input-number v-model="addForm.designCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="完成用例总数" prop="finishCases">
					<el-input-number v-model="addForm.finishCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="关联迭代数" prop="iterationCnt">
					<el-input-number v-model="addForm.iterationCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="任务数" prop="taskCnt">
					<el-input-number v-model="addForm.taskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="完成的任务数" prop="finishTaskCnt">
					<el-input-number v-model="addForm.finishTaskCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="产品编号" prop="productId">
					<el-input v-model="addForm.productId" placeholder="产品编号" ></el-input>
				</el-form-item> 
				<el-form-item label="产品名称" prop="productName">
					<el-input v-model="addForm.productName" placeholder="产品名称" ></el-input>
				</el-form-item> 
				<el-form-item label="bug总数" prop="bugCnt">
					<el-input-number v-model="addForm.bugCnt" :min="0" :max="200"></el-input-number>
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
	import { addXmMenuPlan } from '@/api/xm/core/xmMenuPlan';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['xmMenuPlan','visible'],
		watch: {
	      'xmMenuPlan':function( xmMenuPlan ) {
	        this.addForm = xmMenuPlan;
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
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 功能计划表,无需前端维护，所有数据由汇总统计得出
				addForm: {
					projectId:'',id:'',projectName:'',menuId:'',planStartTime:'',planEndTime:'',actStartTime:'',actEndTime:'',planWorkload:'',actWorkload:'',planCostAmount:'',actCostAmount:'',finishRate:'',demandRate:'',designRate:'',devRate:'',uatRate:'',sitRate:'',onlineStatus:'',onlineTime:'',planStatus:'',chargeUserid:'',chargeUsername:'',menuStatus:'',ctime:'',ltime:'',cuserid:'',cusername:'',calcTime:'',menuName:'',planWorkhours:'',planWorkerCnt:'',closedBugs:'',activeBugs:'',confirmedBugs:'',resolvedBugs:'',testCases:'',execCases:'',designCases:'',finishCases:'',iterationCnt:'',taskCnt:'',finishTaskCnt:'',productId:'',productName:'',bugCnt:''
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
			//新增提交XmMenuPlan 功能计划表,无需前端维护，所有数据由汇总统计得出 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addXmMenuPlan(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-menu-plan-edit':XmMenuPlanEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmMenuPlan);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>