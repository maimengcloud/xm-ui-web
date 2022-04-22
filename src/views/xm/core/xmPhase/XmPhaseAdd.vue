<template>
	<section class="page-container padding">
		<el-row class="page-main ">
			<!--新增界面 XmPhase xm_project_phase-->
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-row class="border padding">
					<el-form-item label="计划名称" prop="name">
						<el-input v-model="addForm.name" placeholder="计划名称" ></el-input>
					</el-form-item>
					<el-form-item label="序号" prop="seqNo">
						<el-input v-model="addForm.seqNo" style="width:50%;"  placeholder="排序序号，值越小越靠前，如1.0,2.0等"></el-input> 
						<el-checkbox true-label="1" false-label="0" v-model="addForm.milestone">标记为里程碑</el-checkbox>
					</el-form-item>
					<el-form-item  label="计划类型" prop="planType">
						<el-select v-model="addForm.planType">
							<el-option v-for="i in this.dicts.planType" :label="i.name" :key="i.id" :value="i.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item  label="任务类型" prop="taskType">
						<el-select v-model="addForm.taskType">
							<el-option v-for="i in this.dicts.taskType" :label="i.name" :key="i.id" :value="i.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注" prop="remark">
						<el-input type="textarea" rows="4" v-model="addForm.remark" placeholder="备注" ></el-input>
					</el-form-item>

				</el-row>
				<el-tabs v-model="activeName" class="border padding">
					<el-tab-pane label="工作量及人力成本" name="budgetWorkload">
						 <el-row>
							<el-row class="padding-20 border">
								<el-row class="padding">工作量计算方式：<font style="color:red">总工时 = 工作日天数 * 每日工时数 * 人数 </font> </el-row>
								<el-row class="padding">金额计算方式：  <font style="color:red">总金额 = 总工时 * 工时单价 </font></el-row>
							</el-row>
							<el-row class="padding-20 border">
								预计时间：<el-date-picker
									v-model="dateRanger"
									type="daterange"
									align="right"
									unlink-panels
									range-separator="至"
									start-placeholder="计划开始日期"
									end-placeholder="计划完成日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									:default-time="['00:00:00','23:59:59']"
									:picker-options="pickerOptions"
								></el-date-picker>
								预估工期：<el-input  style="width:100px;" type="number" v-model="addForm.budgetHours" :precision="2" :step="8" :min="0" placeholder="预计工时"></el-input>小时
 								<div class="tips"><font>工时{{autoParams.budgetHours}}小时,工作日{{autoParams.weekday}}天</font></div>
							</el-row>
							<el-row class="padding-20 border">
								<el-col :span="4">人员类型</el-col>
								<el-col :span="4">人数</el-col>
								<el-col :span="4">工作量(人时)</el-col>
								<el-col :span="4">单价(元/人时)</el-col>
								<el-col :span="8">总价(元)</el-col>

							</el-row>
							<el-row class="padding-20 border">
								<el-col :span="4">内购</el-col>
								<el-col :span="4"><el-input style="width:100px;"  type="number" v-model="addForm.budgetIuserCnt" :precision="0" :step="1" :min="0" placeholder="内购人数"></el-input>
								</el-col>
								<el-col :span="4">{{autoParams.budgetIuserWorkload}}人时</el-col>
								<el-col :span="4"><el-input  style="width:100px;" type="number" v-model="addForm.budgetIuserPrice" :precision="0" :step="1" :min="0" placeholder="预计内部人时单价"></el-input> </el-col>
								<el-col :span="8">{{this.toFixed(autoParams.budgetIuserAt)}}元,{{this.toFixed(autoParams.budgetIuserAt/10000)}} 万元</el-col>
							</el-row>
							<el-row class="padding-20 border">
								<el-col :span="4">外购</el-col>
								<el-col :span="4"><el-input  style="width:100px;" type="number" v-model="addForm.budgetOuserCnt" :precision="0" :step="1" :min="0" placeholder="外购人数"></el-input>
								</el-col>
								<el-col :span="4">{{autoParams.budgetOuserWorkload}}人时</el-col>
								<el-col :span="4"><el-input  style="width:100px;" type="number" v-model="addForm.budgetOuserPrice" :precision="0" :step="1" :min="0" placeholder="预计外购人时单价"></el-input> </el-col>
								<el-col :span="4">{{autoParams.budgetOuserAt }} 元 {{autoParams.budgetOuserAt/10000 }}万元</el-col>

							</el-row >
							<el-row class="padding-20  border">
								<el-col :span="4">合计</el-col>
								<el-col :span="4"> {{autoParams.budgetOuserCnt+autoParams.budgetIuserCnt}}
								</el-col>
								<el-col :span="4">{{autoParams.budgetOuserWorkload+autoParams.budgetIuserWorkload  }}人时,{{ (autoParams.budgetOuserWorkload+autoParams.budgetIuserWorkload)/8/20  }}人月 </el-col>
								<el-col :span="4">{{ (parseFloat2(autoParams.budgetOuserPrice) + parseFloat2(autoParams.budgetIuserPrice))/2}}元/人时</el-col>
								<el-col :span="8">{{autoParams.budgetTotalCost}} 元，{{(autoParams.budgetTotalCost)/10000}} 万元</el-col>
							</el-row>
							<el-row class="padding-20  border">
								总计： {{parseFloat2(addForm.budgetIuserAt)+parseFloat2(addForm.budgetOuserAt)+parseFloat2(addForm.budgetNouserAt)}}元 <el-tag>{{this.toFixed(autoParams.budgetTotalCost/10000)}}万元</el-tag>

							</el-row>
						</el-row>
					</el-tab-pane>
					<el-tab-pane v-if="activeName=='budgetWorkload'" label="收起" name="">
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-row>
		<el-row class="page-bottom">
			<el-button @click.native="handleCancel">取消</el-button>
			<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { addXmPhase } from '@/api/xm/core/xmPhase'; 
	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),

			autoParams:function(){


				var budgetOuserPrice=this.toFixed(this.addForm.budgetOuserPrice)
				var budgetIuserPrice=this.toFixed(this.addForm.budgetIuserPrice)
				var budgetOuserCnt=this.toFixed(this.addForm.budgetOuserCnt)
				var budgetIuserCnt=this.toFixed(this.addForm.budgetIuserCnt)
				var budgetHours=this.toFixed(this.addForm.budgetHours )
				var budgetNouserAt=this.toFixed(this.addForm.budgetNouserAt )
  				if(budgetOuserPrice==null || budgetOuserPrice==''){
					budgetOuserPrice=100
				}
				if(budgetIuserPrice==null || budgetIuserPrice==''){
					budgetIuserPrice=80
				}
				if(budgetOuserCnt==null || budgetOuserCnt==''){
					budgetOuserCnt=0.0
				}
				if(budgetIuserCnt==null || budgetIuserCnt==''){
					budgetIuserCnt=0.0
				}

				if(budgetNouserAt==null || budgetNouserAt==''){
					budgetNouserAt=0.0
				}

				if(budgetHours==null || budgetHours==''){
					budgetHours=0.0
				}
				var autoParams={

				}
				 var weekday=1;
				if(this.dateRanger!=null && this.dateRanger.length>=2 ){
					weekday=this.getWeekday(new Date(this.dateRanger[0]),new Date(this.dateRanger[1]));
					budgetHours=weekday * 8

			 	}
				autoParams.weekday=weekday
				autoParams.budgetHours=budgetHours
				autoParams.budgetOuserPrice=budgetOuserPrice
				autoParams.budgetIuserPrice=budgetIuserPrice
				autoParams.budgetOuserCnt=budgetOuserCnt
				autoParams.budgetIuserCnt=budgetIuserCnt
 				autoParams.budgetIuserWorkload= budgetIuserCnt*budgetHours
				autoParams.budgetOuserWorkload= budgetOuserCnt*budgetHours
				autoParams.budgetWorkload=  budgetIuserCnt*budgetHours + budgetOuserCnt*budgetHours
				autoParams.budgetOuserAt= budgetOuserCnt * budgetHours * budgetOuserPrice
				autoParams.budgetIuserAt=  budgetIuserCnt * budgetHours * budgetIuserPrice
				autoParams.budgetNouserAt= budgetNouserAt
 				autoParams.budgetTotalCost=  autoParams.budgetOuserAt + autoParams.budgetIuserAt + autoParams.budgetNouserAt
				return autoParams
			},
		},
		props:['xmPhase','visible','parentProjectPhase'],
		watch: {
	      'xmPhase':function( xmPhase ) {
	        this.addForm = xmPhase;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
				if(this.parentProjectPhase){
					if(this.parentProjectPhase.children){
						this.addForm.seqNo=this.parentProjectPhase.seqNo+"."+(this.parentProjectPhase.children.length+1)
					}else{
						this.addForm.seqNo=this.parentProjectPhase.seqNo+"."+1
					}

				}
	      	}
		  }, 
		  autoParams:function(autoParams){
			  this.fillbudgetHoursToField()
			  this.fillbudgetAtToField()
		  }
	    },
		data() {
			    const beginDate = new Date();
				const endDate = new Date();
				endDate.setTime(beginDate.getTime() + 3600 * 1000 * 24 * 7 * 4);
			return {
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '计划主键不能为空', trigger: 'blur' }
					],
					name: [
						{ required: true, message: '计划名称不能为空', trigger: 'blur' }
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
				//新增界面数据 xm_project_phase
				addForm: {
					id:'',name:'',remark:'',parentPhaseId:'',branchId:'',taskType:'kf',planType:'m1',projectId:'',beginDate:'',endDate:'',budgetHours:'',budgetStaffNu:'',ctime:'',budgetNouserAt:'',budgetIuserAt:'',budgetOuserAt:'',baselineId:'',bizProcInstId:'',bizFlowState:'',budgetWorkload:'',totalActWorkload:'',totalActNouserAt:'',totalActInerUserAt:'',totalActOuserAt:'',planType:'',taskType:'',seqNo:'1',budgetIuserCnt:'',budgetOuserCnt:'',budgetIuserPrice:80,budgetOuserPrice:100,budgetIuserWorkload:0,budgetOuserWorkload:0,ntype:'0'
				},
				dateRanger: [
					util.formatDate(beginDate, "yyyy-MM-dd HH:mm:ss"),
					util.formatDate(endDate, "yyyy-MM-dd HH:mm:ss")
				],
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				pickerOptions:  util.pickerOptions('datarange'),
				activeName:'',
				costVisible:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				//this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmPhase xm_project_phase 父组件监听@submit="afteraddSubmit"
			addSubmit: function () {

				if (
					this.dateRanger != null &&
					this.dateRanger.length == 2
				) {
					if(this.dateRanger[0]){
						if(this.dateRanger[0].length<=10){
							this.addForm.beginDate = this.dateRanger[0] ;
						}else{
							this.addForm.beginDate = this.dateRanger[0]
						}
					}
					if(this.dateRanger[1]){
						if(this.dateRanger[1].length<=10){
							this.addForm.endDate = this.dateRanger[1] ;
						}else{
							this.addForm.endDate = this.dateRanger[1]
						}
					}

				}else{
					this.$notify({position:'bottom-left',showClose:true,message: "请输入开始日期和结束日期", type: 'error' });
					return;
				}
				if(!this.addForm.budgetIuserCnt){
					this.$notify({position:'bottom-left',showClose:true,message: "内购人员数不能为空", type: 'error' });
					return;
				}

				if(!this.addForm.budgetHours){
					this.$notify({position:'bottom-left',showClose:true,message: "工期不能为空", type: 'error' });
					return;
				}
				if(!this.addForm.budgetIuserPrice){
					this.$notify({position:'bottom-left',showClose:true,message: "内购单价不能为空", type: 'error' });
					return;
				}
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.addForm);
							if(!params.budgetIuserAt){
								params.budgetIuserAt= this.parseFloat2(params.budgetIuserCnt) * this.parseFloat2(params.budgetIuserPrice) * this.parseFloat2(params.budgetHours)
							}
							if( !params.budgetOuserAt ){
								params.budgetOuserAt= this.parseFloat2(params.budgetOuserCnt) * this.parseFloat2(params.budgetOuserPrice) * this.parseFloat2(params.budgetHours)
							}
							params.budgetIuserWorkload= this.parseFloat2(params.budgetIuserCnt) * this.parseFloat2(params.budgetHours)
							params.budgetOuserWorkload= this.parseFloat2(params.budgetOuserCnt) * this.parseFloat2(params.budgetHours)

							params.budgetWorkload= this.parseFloat2(params.budgetIuserWorkload) + this.parseFloat2(params.budgetOuserWorkload)
							if( !params.budgetStaffNu ){

								params.budgetStaffNu= this.parseFloat2(params.budgetOuserCnt) + this.parseFloat2(params.budgetIuserCnt)
							}
							if(this.parentProjectPhase==null || this.parentProjectPhase==undefined){

							}else{
								params.parentPhaseId=this.parentProjectPhase.id
							}
							var func=addXmPhase;
							if(addForm.phaseClass=='1'){
								func=addXmPhase
							}
							func(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['addForm'].resetFields();
									this.$emit('submit',res.data.data);//  @submit="afteraddSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
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
			fillbudgetHoursToField:function(){
				this.addForm.budgetHours=this.toFixed(this.autoParams.budgetHours)
			},

			fillbudgetAtToField:function(){
				this.addForm.budgetNouserAt=this.toFixed(this.autoParams.budgetNouserAt)
				this.addForm.budgetOuserAt=this.toFixed(this.autoParams.budgetOuserAt )
				this.addForm.budgetIuserAt=this.toFixed(this.autoParams.budgetIuserAt )
				this.addForm.budgetTotalCost=this.toFixed(this.autoParams.budgetTotalCost)

			},
			/**end 在上面加自定义方法**/

		},//end method
		components: {
		    //在下面添加其它组件 'xm-phase-add':XmPhaseEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmPhase);
			/**在下面写其它函数***/

			if(this.parentProjectPhase){
				if(this.parentProjectPhase.childrenCnt){
					this.addForm.seqNo=this.parentProjectPhase.seqNo+"."+(this.parentProjectPhase.childrenCnt+1)
				}else{
					this.addForm.seqNo=this.parentProjectPhase.seqNo+"."+1
				}

			}  
			initSimpleDicts('all',['planType','taskType']).then(res=>{
				this.dicts=res.data.data;
			})
		}//end mounted
	}

</script>

<style scoped>
.padding-20{
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 20px;
	padding-bottom: 20px;
}
</style>
