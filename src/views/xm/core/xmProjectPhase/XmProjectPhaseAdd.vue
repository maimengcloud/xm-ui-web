<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 XmProjectPhase xm_project_phase--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item v-if="parentProjectPhase" label="上级" prop="phaseName">
					{{parentProjectPhase.seqNo}} &nbsp;&nbsp;{{parentProjectPhase.phaseName}}
				</el-form-item>  
				<el-form-item v-else label="上级" prop="phaseName">
					无上级
				</el-form-item>
				<el-form-item label="阶段名称" prop="phaseName">
					<el-input v-model="addForm.phaseName" placeholder="阶段名称" ></el-input>
				</el-form-item>  
				<el-form-item label="序号" prop="seqNo">
					<el-input v-model="addForm.seqNo"   placeholder="排序序号，值越小越靠前，如1.0,2.0等"></el-input> <span v-if="parentProjectPhase" style="color:red;">建议：{{parentProjectPhase.seqNo}}.1</span>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注" ></el-input>
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
				<el-form-item label="计划成本预估" >
						<el-tabs v-model="activeName">
							<el-tab-pane label="工作量及人力成本" name="phaseBudgetWorkload">
								<el-row>
									<el-date-picker
										v-model="dateRanger"
										class="hidden-sm-and-down"
										type="daterange"
										align="right"
										unlink-panels
										range-separator="至"
										start-placeholder="计划开始日期"
										end-placeholder="计划完成日期"
										value-format="yyyy-MM-dd"
										:default-time="['00:00:00','23:59:59']"
										:picker-options="pickerOptions"
									></el-date-picker>    
									<el-input  style="width:150px;" type="number" v-model="addForm.phaseBudgetHours" :precision="2" :step="8" :min="0" placeholder="预计工时"></el-input><el-tag>参考工时{{autoParams.phaseBudgetHours}}小时,工作日{{autoParams.weekday}}天</el-tag> <el-button @click.native="fillphaseBudgetHoursToField" type="success">填充工时</el-button>
									
								</el-row>
								<el-divider></el-divider>
								<el-row>
									<el-col :span="4">人员类型</el-col>
									<el-col :span="4">人数</el-col>
									<el-col :span="4">工作量</el-col>
									<el-col :span="4">单价</el-col>
									<el-col :span="8">总价</el-col>
									
								</el-row>
								<el-divider></el-divider>
								<el-row>
									<el-col :span="4">内购</el-col>
									<el-col :span="4"><el-input style="width:150px;"  type="number" v-model="addForm.phaseBudgetInnerUserCnt" :precision="0" :step="1" :min="0" placeholder="内购人数"></el-input>  
									</el-col>
									<el-col :span="4">{{autoParams.phaseBudgetInnerUserWorkload}}人时</el-col>
									<el-col :span="4"><el-input  style="width:150px;" type="number" v-model="addForm.phaseBudgetInnerUserPrice" :precision="0" :step="1" :min="0" placeholder="预计内部人时单价"></el-input> </el-col>
									<el-col :span="8">{{this.toFixed(autoParams.phaseBudgetInnerUserAt)}}元,{{this.toFixed(autoParams.phaseBudgetInnerUserAt/10000)}} 万元</el-col>
								</el-row>
								<el-divider></el-divider>
								<el-row>
									<el-col :span="4">外购</el-col>
									<el-col :span="4"><el-input  style="width:150px;" type="number" v-model="addForm.phaseBudgetOutUserCnt" :precision="0" :step="1" :min="0" placeholder="外购人数"></el-input>  
									</el-col>
									<el-col :span="4">{{autoParams.phaseBudgetOutUserWorkload}}人时</el-col>
									<el-col :span="4"><el-input  style="width:150px;" type="number" v-model="addForm.phaseBudgetOutUserPrice" :precision="0" :step="1" :min="0" placeholder="预计外购人时单价"></el-input> </el-col>
									<el-col :span="4">{{autoParams.phaseBudgetOutUserAt }} 元 {{autoParams.phaseBudgetOutUserAt/10000 }}万元</el-col>
								
								</el-row>
								<el-divider></el-divider>
								<el-row>
									<el-col :span="4">合计</el-col>
									<el-col :span="4"> {{autoParams.phaseBudgetOutUserCnt+autoParams.phaseBudgetInnerUserCnt}}
									</el-col>
									<el-col :span="4">{{autoParams.phaseBudgetOutUserWorkload+autoParams.phaseBudgetInnerUserWorkload  }}人时,{{ (autoParams.phaseBudgetOutUserWorkload+autoParams.phaseBudgetInnerUserWorkload)/8/20  }}人月 </el-col>
									<el-col :span="4">平均：{{ (parseFloat2(autoParams.phaseBudgetOutUserPrice) + parseFloat2(autoParams.phaseBudgetInnerUserPrice))/2}}元/人时</el-col>
									<el-col :span="8">{{autoParams.phaseBudgetTotalCost}} 元，{{(autoParams.phaseBudgetTotalCost)/10000}} 万元</el-col>
								</el-row> 
									 
								<el-row>
									内购：  <el-input style="width:150px;" type="number" v-model="addForm.phaseBudgetInnerUserAt" :precision="2" :step="1000" :min="0" placeholder="内部人力成本总预算"></el-input> <el-tag>参考{{this.toFixed(autoParams.phaseBudgetInnerUserAt)}}元，{{this.toFixed(autoParams.phaseBudgetInnerUserAt/10000)}}万元</el-tag>
									外购：  <el-input style="width:150px;" type="number" v-model="addForm.phaseBudgetOutUserAt" :precision="2" :step="1000" :min="0" placeholder="外购人力成本总预算"></el-input> <el-tag>参考{{this.toFixed(autoParams.phaseBudgetOutUserAt)}}元，{{this.toFixed(autoParams.phaseBudgetOutUserAt/10000)}}万元</el-tag>
									非人力：<el-input style="width:150px;" type="number" v-model="addForm.phaseBudgetNouserAt" :precision="2" :step="1000" :min="0" placeholder="人力成本总预算"></el-input> 元 
								</el-row>
								<el-divider></el-divider>
								<el-row>
									总计： {{parseFloat2(addForm.phaseBudgetInnerUserAt)+parseFloat2(addForm.phaseBudgetOutUserAt)+parseFloat2(addForm.phaseBudgetNouserAt)}}元 <el-tag>参考{{this.toFixed(autoParams.phaseBudgetTotalCost)}}元，{{this.toFixed(autoParams.phaseBudgetTotalCost/10000)}}万元</el-tag>
									<el-button @click.native="fillphaseBudgetCostAtToField" type="success">使用参考值自动填充</el-button>
								</el-row>
							</el-tab-pane>
							<el-tab-pane v-if="activeName=='phaseBudgetWorkload'" label="收起" name="">
							</el-tab-pane>
						</el-tabs>
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
	import { addXmProjectPhase } from '@/api/xm/core/xmProjectPhase';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
			
			autoParams:function(){
				
				 
				var phaseBudgetOutUserPrice=this.toFixed(this.addForm.phaseBudgetOutUserPrice)
				var phaseBudgetInnerUserPrice=this.toFixed(this.addForm.phaseBudgetInnerUserPrice)
				var phaseBudgetOutUserCnt=this.toFixed(this.addForm.phaseBudgetOutUserCnt)
				var phaseBudgetInnerUserCnt=this.toFixed(this.addForm.phaseBudgetInnerUserCnt)
				var phaseBudgetHours=this.toFixed(this.addForm.phaseBudgetHours )
				var phaseBudgetNouserAt=this.toFixed(this.addForm.phaseBudgetNouserAt ) 
  				if(phaseBudgetOutUserPrice==null || phaseBudgetOutUserPrice==''){
					phaseBudgetOutUserPrice=100
				}
				if(phaseBudgetInnerUserPrice==null || phaseBudgetInnerUserPrice==''){
					phaseBudgetInnerUserPrice=80
				}
				if(phaseBudgetOutUserCnt==null || phaseBudgetOutUserCnt==''){
					phaseBudgetOutUserCnt=0.0
				}
				if(phaseBudgetInnerUserCnt==null || phaseBudgetInnerUserCnt==''){
					phaseBudgetInnerUserCnt=0.0
				}
				
				if(phaseBudgetNouserAt==null || phaseBudgetNouserAt==''){
					phaseBudgetNouserAt=0.0
				} 
				
				if(phaseBudgetHours==null || phaseBudgetHours==''){
					phaseBudgetHours=0.0
				} 
				var autoParams={   

				} 
				 var weekday=1;
				if(this.dateRanger!=null && this.dateRanger.length>=2 ){
					weekday=this.getWeekday(new Date(this.dateRanger[0]),new Date(this.dateRanger[1]));
					if(this.addForm.phaseBudgetHours==null || this.addForm.phaseBudgetHours=='' || this.addForm.phaseBudgetHours<=0){
						phaseBudgetHours=weekday * 8
					}
					
			 	} 
				autoParams.weekday=weekday
				autoParams.phaseBudgetHours=phaseBudgetHours
				autoParams.phaseBudgetOutUserPrice=phaseBudgetOutUserPrice
				autoParams.phaseBudgetInnerUserPrice=phaseBudgetInnerUserPrice
				autoParams.phaseBudgetOutUserCnt=phaseBudgetOutUserCnt
				autoParams.phaseBudgetInnerUserCnt=phaseBudgetInnerUserCnt 
 				autoParams.phaseBudgetInnerUserWorkload= phaseBudgetInnerUserCnt*phaseBudgetHours
				autoParams.phaseBudgetOutUserWorkload= phaseBudgetOutUserCnt*phaseBudgetHours
				autoParams.phaseBudgetWorkload=  phaseBudgetInnerUserCnt*phaseBudgetHours + phaseBudgetOutUserCnt*phaseBudgetHours
				autoParams.phaseBudgetOutUserAt= phaseBudgetOutUserCnt * phaseBudgetHours * phaseBudgetOutUserPrice
				autoParams.phaseBudgetInnerUserAt=  phaseBudgetInnerUserCnt * phaseBudgetHours * phaseBudgetInnerUserPrice
				autoParams.phaseBudgetNouserAt= phaseBudgetNouserAt
 				autoParams.phaseBudgetTotalCost=  autoParams.phaseBudgetOutUserAt + autoParams.phaseBudgetInnerUserAt + autoParams.phaseBudgetNouserAt
				return autoParams
			},
		},
		props:['xmProjectPhase','visible','parentProjectPhase'],
		watch: {
	      'xmProjectPhase':function( xmProjectPhase ) {
	        this.addForm = xmProjectPhase;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
		  },
	    },
		data() {
			    const beginDate = new Date();
				const endDate = new Date();
				endDate.setTime(beginDate.getTime() + 3600 * 1000 * 24 * 7 * 4);
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '阶段主键不能为空', trigger: 'blur' }
					], 			
					phaseName: [
						{ required: true, message: '阶段名称不能为空', trigger: 'blur' }
					],
					planType: [
						{ required: true, message: '请选择计划类型', trigger: 'blur' }
					],
					taskType: [
						{ required: true, message: '请选择任务类型', trigger: 'blur' }
					],
					seqNo: [
						{ required: true, message: '序号不能为空', trigger: 'blur' }
					],
				},
				oldAddForm:{},
				//新增界面数据 xm_project_phase
				addForm: {
					id:'',phaseName:'',remark:'',parentPhaseId:'',branchId:'',taskType:'kf',planType:'m1',projectId:'',beginDate:'',endDate:'',phaseBudgetHours:'',phaseBudgetStaffNu:'',ctime:'',phaseBudgetNouserAt:'',phaseBudgetInnerUserAt:'',phaseBudgetOutUserAt:'',projectBaselineId:'',bizProcInstId:'',bizFlowState:'',phaseBudgetWorkload:'',totalActWorkload:'',totalActNouserAt:'',totalActInerUserAt:'',totalActOutUserAt:'',planType:'',taskType:'',seqNo:'1',phaseBudgetInnerUserCnt:'',phaseBudgetOutUserCnt:'',phaseBudgetInnerUserPrice:80,phaseBudgetOutUserPrice:100,phaseBudgetInnerUserWorkload:0,phaseBudgetOutUserWorkload:0
				}, 
				dateRanger: [
					util.formatDate.format(beginDate, "yyyy-MM-dd HH:mm:ss"),
					util.formatDate.format(endDate, "yyyy-MM-dd HH:mm:ss")
				],  
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				pickerOptions:  util.pickerOptions('datarange'),
				activeName:'',
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				//this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmProjectPhase xm_project_phase 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				if (
					this.dateRanger != null &&
					this.dateRanger.length == 2
				) {   
					if(this.dateRanger[0]){
						if(this.dateRanger[0].length<=10){
							this.addForm.beginDate = this.dateRanger[0] + " 00:00:00";
						}else{
							this.addForm.beginDate = this.dateRanger[0]
						}
					}
					if(this.dateRanger[1]){
						if(this.dateRanger[1].length<=10){
							this.addForm.endDate = this.dateRanger[1] + " 23:59:59";
						}else{
							this.addForm.endDate = this.dateRanger[1]
						}
					}
					
				}else{
					this.$message({ message: "请输入开始日期和结束日期", type: 'error' }); 
					return;
				}
				if(!this.addForm.phaseBudgetInnerUserCnt){
					this.$message({ message: "内购人员数不能为空", type: 'error' }); 
					return;
				}
				
				if(!this.addForm.phaseBudgetHours){
					this.$message({ message: "工期不能为空", type: 'error' }); 
					return;
				}
				if(!this.addForm.phaseBudgetInnerUserPrice){
					this.$message({ message: "内购单价不能为空", type: 'error' }); 
					return;
				}
				this.$refs.addForm.validate((valid) => {
					if (valid) { 
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							if(!params.phaseBudgetInnerUserAt){
								params.phaseBudgetInnerUserAt= this.parseFloat2(params.phaseBudgetInnerUserCnt) * this.parseFloat2(params.phaseBudgetInnerUserPrice) * this.parseFloat2(params.phaseBudgetHours)
							}
							if( !params.phaseBudgetOutUserAt ){
								params.phaseBudgetOutUserAt= this.parseFloat2(params.phaseBudgetOutUserCnt) * this.parseFloat2(params.phaseBudgetOutUserPrice) * this.parseFloat2(params.phaseBudgetHours)
							}  
							params.phaseBudgetInnerUserWorkload= this.parseFloat2(params.phaseBudgetInnerUserCnt) * this.parseFloat2(params.phaseBudgetHours) 
							params.phaseBudgetOutUserWorkload= this.parseFloat2(params.phaseBudgetOutUserCnt) * this.parseFloat2(params.phaseBudgetHours) 
 								 
							params.phaseBudgetWorkload= this.parseFloat2(params.phaseBudgetInnerUserWorkload) + this.parseFloat2(params.phaseBudgetOutUserWorkload) 
							if( !params.phaseBudgetStaffNu ){
								 
								params.phaseBudgetStaffNu= this.parseFloat2(params.phaseBudgetOutUserCnt) + this.parseFloat2(params.phaseBudgetInnerUserCnt)
							}   
							if(this.parentProjectPhase==null || this.parentProjectPhase==undefined){

							}else{
								params.parentPhaseId=this.parentProjectPhase.id
							}
							addXmProjectPhase(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			}, 
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
			toFixed(floatValue,num){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					if(!num){
						num=2
					}
					return parseFloat(parseFloat(floatValue).toFixed(num));
				}
			},
			parseFloat2(floatValue){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					return parseFloat(floatValue);
				}
			},
			fillToField:function(){
				this.addForm=Object.assign(this.addForm,this.autoParams);
			},
			fillphaseBudgetHoursToField:function(){
				this.addForm.phaseBudgetHours=this.toFixed(this.autoParams.phaseBudgetHours)
			},
			
			fillphaseBudgetCostAtToField:function(){
				this.addForm.phaseBudgetNouserAt=this.toFixed(this.autoParams.phaseBudgetNouserAt)
				this.addForm.phaseBudgetOutUserAt=this.toFixed(this.autoParams.phaseBudgetOutUserAt )
				this.addForm.phaseBudgetInnerUserAt=this.toFixed(this.autoParams.phaseBudgetInnerUserAt )
				this.addForm.phaseBudgetTotalCost=this.toFixed(this.autoParams.phaseBudgetTotalCost)

			}, 
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-phase-edit':XmProjectPhaseEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmProjectPhase);  
			/**在下面写其它函数***/
			
			listOption([{categoryId:'all',itemCode:'planType'},{categoryId:'all',itemCode:'taskType'}]).then(res=>{
				this.options=res.data.data;
			})
		}//end mounted
	}

</script>

<style scoped>

</style>