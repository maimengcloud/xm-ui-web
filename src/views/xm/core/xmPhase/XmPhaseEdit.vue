<template>
	<section class="page-container padding">


		<el-row class="page-main ">
			<el-tabs>
				<el-tab-pane label="计划详情">
					<!--新增界面 XmPhase xm_project_phase-->
					<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
            <el-row class="border padding">
              <el-steps :active="parseInt(editForm.phaseStatus)+1" simple finish-status="success" align-center>
                <el-step v-for="(item,index) in statusList" @click.native="on_click(item.id)" :title="item.name" :key="index"></el-step> 
              </el-steps>
            </el-row>
						<el-row class="border padding">
							<el-form-item label="计划名称" prop="name">
								<el-input v-model="editForm.name" placeholder="计划名称" ></el-input>
							</el-form-item>
							<el-form-item label="序号" prop="seqNo">
								<el-input v-model="editForm.seqNo" style="width:50%;"  placeholder="排序序号，值越小越靠前，如1.0,2.0等"></el-input>
								<el-checkbox true-label="1" false-label="0" v-model="editForm.milestone">标记为里程碑</el-checkbox>
							</el-form-item>
							<el-form-item  label="任务类型" prop="taskType">
								<el-select v-model="editForm.taskType">
									<el-option v-for="i in this.options.taskType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item  label="计划类型" prop="planType">
								<el-select v-model="editForm.planType">
									<el-option v-for="i in this.options.planType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="备注" prop="remark">
								<el-input type="textarea" rows="4" v-model="editForm.remark" placeholder="备注" ></el-input>
							</el-form-item>

						</el-row>
						<el-tabs v-model="activeName" class="border padding">
							<el-tab-pane label="工作量及人力成本" name="phaseBudgetWorkload">
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
										预估工期：<el-input  style="width:100px;" type="number" v-model="editForm.phaseBudgetHours" :precision="2" :step="8" :min="0" placeholder="预计工时"></el-input>小时
										<div class="tips"><font>工时{{autoParams.phaseBudgetHours}}小时,工作日{{autoParams.weekday}}天</font></div>
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
										<el-col :span="4"><el-input style="width:100px;"  type="number" v-model="editForm.phaseBudgetIuserCnt" :precision="0" :step="1" :min="0" placeholder="内购人数"></el-input>
										</el-col>
										<el-col :span="4">{{autoParams.phaseBudgetIuserWorkload}}人时</el-col>
										<el-col :span="4"><el-input  style="width:100px;" type="number" v-model="editForm.phaseBudgetIuserPrice" :precision="0" :step="1" :min="0" placeholder="预计内部人时单价"></el-input> </el-col>
										<el-col :span="8">{{this.toFixed(autoParams.phaseBudgetIuserAt)}}元,{{this.toFixed(autoParams.phaseBudgetIuserAt/10000)}} 万元</el-col>
									</el-row>
									<el-row class="padding-20 border">
										<el-col :span="4">外购</el-col>
										<el-col :span="4"><el-input  style="width:100px;" type="number" v-model="editForm.phaseBudgetOuserCnt" :precision="0" :step="1" :min="0" placeholder="外购人数"></el-input>
										</el-col>
										<el-col :span="4">{{autoParams.phaseBudgetOuserWorkload}}人时</el-col>
										<el-col :span="4"><el-input  style="width:100px;" type="number" v-model="editForm.phaseBudgetOuserPrice" :precision="0" :step="1" :min="0" placeholder="预计外购人时单价"></el-input> </el-col>
										<el-col :span="4">{{autoParams.phaseBudgetOuserAt }} 元 {{autoParams.phaseBudgetOuserAt/10000 }}万元</el-col>

									</el-row >
									<el-row class="padding-20  border">
										<el-col :span="4">合计</el-col>
										<el-col :span="4"> {{autoParams.phaseBudgetOuserCnt+autoParams.phaseBudgetIuserCnt}}
										</el-col>
										<el-col :span="4">{{autoParams.phaseBudgetOuserWorkload+autoParams.phaseBudgetIuserWorkload  }}人时,{{ (autoParams.phaseBudgetOuserWorkload+autoParams.phaseBudgetIuserWorkload)/8/20  }}人月 </el-col>
										<el-col :span="4">{{ (parseFloat2(autoParams.phaseBudgetOuserPrice) + parseFloat2(autoParams.phaseBudgetIuserPrice))/2}}元/人时</el-col>
										<el-col :span="8">{{autoParams.phaseBudgetTotalCost}} 元，{{(autoParams.phaseBudgetTotalCost)/10000}} 万元</el-col>
									</el-row>
									<el-row class="padding-20  border">
										总计： {{parseFloat2(editForm.phaseBudgetIuserAt)+parseFloat2(editForm.phaseBudgetOuserAt)+parseFloat2(editForm.phaseBudgetNouserAt)}}元 <el-tag>{{this.toFixed(autoParams.phaseBudgetTotalCost/10000)}}万元</el-tag>

									</el-row>
								</el-row>
							</el-tab-pane>
							<el-tab-pane v-if="activeName=='phaseBudgetWorkload'" label="收起" name="">
							</el-tab-pane>
						</el-tabs>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="计划概览" lazy>
					<xm-phase-overview :xm-phase="xmPhase"></xm-phase-overview>
				</el-tab-pane>
			</el-tabs>
		</el-row>
		<el-row class="page-bottom">
			<el-button @click.native="handleCancel">取消</el-button>
			<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editXmPhase } from '@/api/xm/core/xmPhase'; 
	import { mapGetters } from 'vuex'
	import  XmPhaseOverview from './XmPhaseOverview';//新增界面

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),

			autoParams:function(){


				var phaseBudgetOuserPrice=this.toFixed(this.editForm.phaseBudgetOuserPrice)
				var phaseBudgetIuserPrice=this.toFixed(this.editForm.phaseBudgetIuserPrice)
				var phaseBudgetOuserCnt=this.toFixed(this.editForm.phaseBudgetOuserCnt)
				var phaseBudgetIuserCnt=this.toFixed(this.editForm.phaseBudgetIuserCnt)
				var phaseBudgetHours=this.toFixed(this.editForm.phaseBudgetHours )
				var phaseBudgetNouserAt=this.toFixed(this.editForm.phaseBudgetNouserAt )
  				if(phaseBudgetOuserPrice==null || phaseBudgetOuserPrice==''){
					phaseBudgetOuserPrice=100
				}
				if(phaseBudgetIuserPrice==null || phaseBudgetIuserPrice==''){
					phaseBudgetIuserPrice=80
				}
				if(phaseBudgetOuserCnt==null || phaseBudgetOuserCnt==''){
					phaseBudgetOuserCnt=0.0
				}
				if(phaseBudgetIuserCnt==null || phaseBudgetIuserCnt==''){
					phaseBudgetIuserCnt=0.0
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
					phaseBudgetHours=weekday * 8

			 	}
				autoParams.weekday=weekday
				autoParams.phaseBudgetHours=phaseBudgetHours
				autoParams.phaseBudgetOuserPrice=phaseBudgetOuserPrice
				autoParams.phaseBudgetIuserPrice=phaseBudgetIuserPrice
				autoParams.phaseBudgetOuserCnt=phaseBudgetOuserCnt
				autoParams.phaseBudgetIuserCnt=phaseBudgetIuserCnt
 				autoParams.phaseBudgetIuserWorkload= phaseBudgetIuserCnt*phaseBudgetHours
				autoParams.phaseBudgetOuserWorkload= phaseBudgetOuserCnt*phaseBudgetHours
				autoParams.phaseBudgetWorkload=  phaseBudgetIuserCnt*phaseBudgetHours + phaseBudgetOuserCnt*phaseBudgetHours
				autoParams.phaseBudgetOuserAt= phaseBudgetOuserCnt * phaseBudgetHours * phaseBudgetOuserPrice
				autoParams.phaseBudgetIuserAt=  phaseBudgetIuserCnt * phaseBudgetHours * phaseBudgetIuserPrice
				autoParams.phaseBudgetNouserAt= phaseBudgetNouserAt
 				autoParams.phaseBudgetTotalCost=  autoParams.phaseBudgetOuserAt + autoParams.phaseBudgetIuserAt + autoParams.phaseBudgetNouserAt
				return autoParams
			},
		},
		props:['xmPhase','visible','parentProjectPhase'],
		watch: {
	      'xmPhase':function( xmPhase ) {
			this.editForm = xmPhase;
			this.dateRanger=[this.editForm.beginDate,this.editForm.endDate]
	      },
	      'visible':function(visible) {
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
		  },
		  autoParams:function(autoParams){
			  this.fillphaseBudgetHoursToField()
			  this.fillphaseBudgetAtToField()
		  }
	    },
		data() {
			    const beginDate = new Date();
				const endDate = new Date();
				endDate.setTime(beginDate.getTime() + 3600 * 1000 * 24 * 7 * 4);
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
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
					]
				},
				oldeditForm:{},
				//新增界面数据 xm_project_phase
				editForm: {
					id:'',name:'',remark:'',parentPhaseId:'',branchId:'',taskType:'kf',planType:'m1',projectId:'',beginDate:'',endDate:'',phaseBudgetHours:'',phaseBudgetStaffNu:'',ctime:'',phaseBudgetNouserAt:'',phaseBudgetIuserAt:'',phaseBudgetOuserAt:'',baselineId:'',bizProcInstId:'',bizFlowState:'',phaseBudgetWorkload:'',totalActWorkload:'',totalActNouserAt:'',totalActInerUserAt:'',totalActOuserAt:'',seqNo:'1',phaseBudgetIuserCnt:'',phaseBudgetOuserCnt:'',phaseBudgetIuserPrice:80,phaseBudgetOuserPrice:100,phaseBudgetIuserWorkload:0,phaseBudgetOuserWorkload:0,phaseStatus:'',ntype:'0'
				},
				dateRanger: [
				],
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				pickerOptions:  util.pickerOptions('datarange'),
				activeName:'',
				costVisible:false,
				statusList:[
					{id:'0',name:'初始'},
					{id:'1',name:'执行中'},
					{id:'2',name:'完工'},
					{id:'3',name:'关闭'},
					{id:'4',name:'删除中'},
					{id:'5',name:'已删除'},
					{id:'6',name:'暂停'}
				]
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				//this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmPhase xm_project_phase 父组件监听@submit="aftereditSubmit"
			editSubmit: function () {

				if (
					this.dateRanger != null &&
					this.dateRanger.length == 2
				) {
					if(this.dateRanger[0]){
						if(this.dateRanger[0].length<=10){
							this.editForm.beginDate = this.dateRanger[0] ;
						}else{
							this.editForm.beginDate = this.dateRanger[0]
						}
					}
					if(this.dateRanger[1]){
						if(this.dateRanger[1].length<=10){
							this.editForm.endDate = this.dateRanger[1] ;
						}else{
							this.editForm.endDate = this.dateRanger[1]
						}
					}

				}else{
					this.$notify({showClose: true, message: "请输入开始日期和结束日期", type: 'error' });
					return;
				}
				if(!this.editForm.phaseBudgetIuserCnt){
					this.$notify({showClose: true, message: "内购人员数不能为空", type: 'error' });
					return;
				}

				if(!this.editForm.phaseBudgetHours){
					this.$notify({showClose: true, message: "工期不能为空", type: 'error' });
					return;
				}
				if(!this.editForm.phaseBudgetIuserPrice){
					this.$notify({showClose: true, message: "内购单价不能为空", type: 'error' });
					return;
				}
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							if(!params.phaseBudgetIuserAt){
								params.phaseBudgetIuserAt= this.parseFloat2(params.phaseBudgetIuserCnt) * this.parseFloat2(params.phaseBudgetIuserPrice) * this.parseFloat2(params.phaseBudgetHours)
							}
							if( !params.phaseBudgetOuserAt ){
								params.phaseBudgetOuserAt= this.parseFloat2(params.phaseBudgetOuserCnt) * this.parseFloat2(params.phaseBudgetOuserPrice) * this.parseFloat2(params.phaseBudgetHours)
							}
							params.phaseBudgetIuserWorkload= this.parseFloat2(params.phaseBudgetIuserCnt) * this.parseFloat2(params.phaseBudgetHours)
							params.phaseBudgetOuserWorkload= this.parseFloat2(params.phaseBudgetOuserCnt) * this.parseFloat2(params.phaseBudgetHours)

							params.phaseBudgetWorkload= this.parseFloat2(params.phaseBudgetIuserWorkload) + this.parseFloat2(params.phaseBudgetOuserWorkload)
							if( !params.phaseBudgetStaffNu ){

								params.phaseBudgetStaffNu= this.parseFloat2(params.phaseBudgetOuserCnt) + this.parseFloat2(params.phaseBudgetIuserCnt)
							}
							var func=editXmPhase
							if(this.editForm.phaseClass=="1"){
								func=editXmPhase
							}
							func(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['editForm'].resetFields();
									this.$emit('submit',res.data.data);//  @submit="aftereditSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.edit=false);
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
				this.editForm=Object.assign(this.editForm,this.autoParams);
			},
			fillphaseBudgetHoursToField:function(){
				this.editForm.phaseBudgetHours=this.toFixed(this.autoParams.phaseBudgetHours)
			},

			fillphaseBudgetAtToField:function(){
				this.editForm.phaseBudgetNouserAt=this.toFixed(this.autoParams.phaseBudgetNouserAt)
				this.editForm.phaseBudgetOuserAt=this.toFixed(this.autoParams.phaseBudgetOuserAt )
				this.editForm.phaseBudgetIuserAt=this.toFixed(this.autoParams.phaseBudgetIuserAt )
				this.editForm.phaseBudgetTotalCost=this.toFixed(this.autoParams.phaseBudgetTotalCost)

			},
      on_click(status){
        this.editForm.phaseStatus=status;
      }
			/**end 在上面加自定义方法**/

		},//end method
		components: {
			XmPhaseOverview,
		    //在下面添加其它组件 'xm-phase-edit':XmPhaseEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmPhase);
			/**在下面写其它函数***/
			this.dateRanger=[this.editForm.beginDate,this.editForm.endDate]
			listOption([{categoryId:'all',itemCode:'planType'},{categoryId:'all',itemCode:'taskType'}]).then(res=>{
				this.options=res.data.data;
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
