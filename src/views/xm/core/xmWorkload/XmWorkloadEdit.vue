<template>
	<section  class="padding">
		<el-row  ref="table">
		<!--编辑界面 XmWorkload 工时登记表-->
			<el-form :model="editForm"  label-width="120px"  :rules="editFormRules" ref="editFormRef">
				<el-row>
					<el-col :span="12">
						<el-form-item label="预估工时" prop="budgetWorkload">
							{{val.budgetWorkload?val.budgetWorkload:0}}&nbsp;&nbsp;小时 <font color="red"> &nbsp;&nbsp;>>&nbsp; &nbsp;{{budgetWorkload}} &nbsp;小时</font>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="已登工时" prop="actWorkload">
							{{val.actWorkload?val.actWorkload:0}}&nbsp;小时, <el-tag type="primary"> {{val.rate}}% </el-tag><el-tag type="danger">&nbsp;&nbsp;>>&nbsp; &nbsp;{{rate}}% &nbsp;</el-tag>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>

					<el-col :span="12">
						<el-form-item label="业务日期" prop="bizDate">
							<el-date-picker style="width:80%;" v-model="editForm.bizDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd"  placeholder="业务日期"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="工作类型" prop="ttype">
							<el-select v-model="editForm.ttype">
								<el-option v-for="i in this.dicts.taskType" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>


				<el-row>

					<el-col :span="24">
						<el-form-item label="计时方式" prop="workloadFillType">
 							<el-select v-model="workloadFillType" style="display:inline;">
								<el-option value="1" label="正常报工(都适用)"></el-option>
								<el-option value="2" label="按报价工时减去已登记工时一次性填满（适合众包报价任务）"></el-option>
								<el-option value="3" label="按预估工时减去已登记工时一次性填满（适合不严格要求报工，但为了统计进度等）"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="工作时长" prop="workload">
							<el-input  type="number" style="width:80%;" :step="8" :min="0" :max="1000" v-model="editForm.workload" placeholder="工作时长"></el-input> 小时

						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="工时归属" prop="username">
							<mdp-select-user-xm label="工时归属" v-model="editForm" userid-key="userid" username-key="username" :project-id="val.projectId"></mdp-select-user-xm>
 						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="workloadFillType=='2'">
					<el-form-item label="报价工时" prop="quoteWorkload">
						 {{execuser?execuser.quoteWorkload:0}}h
					</el-form-item>
				</el-row>
				<el-row>

					<el-col :span="12">
						<el-form-item label="未来工时" prop="rworkload">
							<el-input :step="8"   :max="1000"  type="number" style="width:80%;" v-model="editForm.rworkload" placeholder="预计还要多少工时能够完成工作"></el-input>  小时
						</el-form-item>
					</el-col>   <font color="blue">注意：未来工时指完成工作还需要继续投入的工时，一般在原始预估出现比较大的偏差时，需要对预估偏差进行重新调整才填写。0代表百分百完成</font>
				</el-row>

				<el-form-item label="工作说明" prop="remark">
 					<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20}" v-model="editForm.remark" placeholder="工作说明，如果报工大于8小时，请填写说明" ></el-input>
				</el-form-item>
			</el-form>

			<el-row style="float:right">
				<el-button @click.native="handleCancel">取消</el-button>
				<el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
			</el-row>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import

	import { addXmWorkload,editXmWorkload } from '@/api/xm/core/xmWorkload';
	import { listXmTaskExecuser  } from '@/api/xm/core/xmTaskExecuser';
	import MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm';
	import { mapGetters } from 'vuex'

	export default {
	    name:'xmWorkloadEdit',
	    components: {
			MdpSelectUserXm
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

			budgetWorkload(){
				if(   this.editForm.rworkload !==null &&  this.editForm.rworkload!=='' && this.editForm.rworkload>=0){
					return parseFloat(this.editForm.rworkload)+parseFloat(this.editForm.workload>0?this.editForm.workload:0)+parseFloat(this.val.actWorkload>0?this.val.actWorkload:0)
				}else{
					return this.val.budgetWorkload;
				}
			},

			rate(){
				if( this.editForm.rworkload>=0 && this.budgetWorkload>0){
					return Math.round((parseFloat(this.editForm.workload?this.editForm.workload:0)+parseFloat(this.val.actWorkload?this.val.actWorkload:0))/ this.budgetWorkload *100)
				}else{
					if(this.val.budgetWorkload>0){
						return Math.round((parseFloat(this.editForm.workload>0?this.editForm.workload:0)+parseFloat(this.val.actWorkload>0?this.val.actWorkload:0))/this.val.budgetWorkload *100);
					}else{
						return 0;
					}

				}
			},
			val(){
				var params={}
				if( this.xmTask && this.xmTask.id){
					params.id=this.xmTask.id
					params.initWorkload=this.xmTask.initWorkload
					params.budgetWorkload=this.xmTask.budgetWorkload
					params.actWorkload=this.xmTask.actWorkload
					params.ntype=this.xmTask.ntype
					params.name=this.xmTask.name


				}
				if( this.xmMenu && this.xmMenu.menuId){
					params.menuId=this.xmMenu.menuId
					params.initWorkload=this.xmMenu.initWorkload
					params.budgetWorkload=this.xmMenu.budgetWorkload
					params.actWorkload=this.xmMenu.actWorkload
					params.ntype=this.xmMenu.ntype
					params.dclass=this.xmMenu.dclass
					params.name=this.xmMenu.name
					params.menuName=this.xmMenu.menuName
				}
				if( this.xmQuestion && this.xmQuestion.id){
					params.id=this.xmQuestion.id
					params.initWorkload=this.xmQuestion.initWorkload
					params.budgetWorkload=this.xmQuestion.budgetWorkload
					params.actWorkload=this.xmQuestion.actWorkload
					params.name=this.xmQuestion.name
				}
				if( this.xmTestCase && this.xmTestCase.id){
					params.id=this.xmTestCase.id
					params.initWorkload=this.xmTestCase.initWorkload
					params.budgetWorkload=this.xmTestCase.budgetWorkload
					params.actWorkload=this.xmTestCase.actWorkload
					params.name=this.xmTestCase.caseName
					params.caseName=this.xmTestCase.caseName
				}
				if( this.xmTestPlanCase && this.xmTestPlanCase.planId){
					params.planId=this.xmTestPlanCase.planId
					params.caseId=this.xmTestPlanCase.caseId
					params.initWorkload=this.xmTestPlanCase.initWorkload
					params.budgetWorkload=this.xmTestPlanCase.budgetWorkload
					params.actWorkload=this.xmTestPlanCase.actWorkload
					params.name=this.xmTestPlanCase.caseName
					params.caseName=this.xmTestPlanCase.caseName
				}
				if(params.budgetWorkload>0){
					params.rate= parseInt((params.actWorkload>0?params.actWorkload:0) / params.budgetWorkload * 100)
				}else{
					params.rate= 0
				}
				return params
			}

		},
		props:['xmTask','xmWorkload','visible','opType','bizType'/*报工类型1-任务，2-缺陷，3-测试用例设计，4-测试执行 */,
		'xmMenu','xmTestCase','xmQuestion','xmTestPlanCase'],

		watch: {
	      'xmWorkload':function( xmWorkload ) {
	        if(xmWorkload){
	           Object.assign(this.editForm,xmWorkload);
	        }

	      },
	      'visible':function(visible) {
	      	if(visible==true){
 	      		this.initData()
	      	}
	      },
		  'workloadFillType':function(val){
			  if(val==='2'){
				  this.listXmTaskExecuser();
			  }
			  if(val==='3'){
				  this.editForm.workload=this.val.budgetWorkload-this.val.actWorkload
			  }
			  if(val==='1'){
				  this.editForm.workload=8
			  }
		  }
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					],
					bizDate:[
						{ required: true, message: '业务日期不能为空', trigger: 'change' }
					],
					workload:[
						{ required: true, message: '上班时长不能为空', trigger: 'change' }
					],
					remark:[
						{ min: 0, max: 250, message: '工作描述长度在 0 到 250 个字符', trigger: 'change' },//长度
					]
				},
				editForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:'',rworkload:null
				},
				rwokkload:0,
                maxTableHeight:300,
				dicts:{
					taskType:[],
				},
				execuser:null,
				workloadFillType:'1',//工时填写方式
				groupUserSelectVisible:false,
			}//end return
		},//end data
		methods: {

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增、编辑提交XmWorkload 工时登记表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmWorkload
							if(this.currOpType=='edit'){
							    func=editXmWorkload
							}else{
								params.id=null;
							}
							func(params).then((res) => {
                                this.load.edit=false
                                var tips=res.data.tips;
                                if(tips.isOk){
                                    this.editForm=res.data.data
                                    this.$emit('submit');//  @submit="afterAddSubmit"
                                }
                                this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$notify({position:'bottom-left',showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.xmWorkload){
                    this.editForm = Object.assign({},this.xmWorkload);
                }

                if(this.opType=='edit'){

                }else{
					this.editForm.bizType=this.bizType
					this.editForm.bizDate=util.getDate();
					if(!this.editForm.ttype){
						this.editForm.ttype="4"
					}
					if( this.xmTask && this.xmTask.id){
						this.editForm.taskId=this.xmTask.id
						this.editForm.ttype=this.xmTask.taskType
						this.editForm.bizName=this.xmTask.name
					}
					if( this.xmMenu && this.xmMenu.menuId){
						this.editForm.menuId=this.xmMenu.menuId
						this.editForm.bizName=this.xmMenu.menuName
					}
					if( this.xmQuestion && this.xmQuestion.id){
						this.editForm.bugId=this.xmQuestion.id
						this.editForm.bizName=this.xmQuestion.name
					}
					if( this.xmTestCase && this.xmTestCase.id){
						this.editForm.caseId=this.xmTestCase.id
						this.editForm.bizName=this.xmTestCase.caseName
					}
					if( this.xmTestPlanCase && this.xmTestPlanCase.planId){
						this.editForm.planId=this.xmTestPlanCase.planId
						this.editForm.caseId=this.xmTestPlanCase.caseId
						this.editForm.bizName=this.xmTestPlanCase.caseName
					}

					this.editForm.workload=8
					this.editForm.userid=this.userInfo.userid
					this.editForm.username=this.userInfo.username
					this.editForm.cuserid=this.userInfo.userid
					this.editForm.cusername=this.userInfo.username
					this.editForm.ubranchId=this.userInfo.branchId
					this.editForm.rworkload=null;
					this.editForm.workloadFillType="1";
                }
            },
			listXmTaskExecuser(){
				listXmTaskExecuser({userid:this.userInfo.userid,taskId:this.val.id}).then(res=>{
					if(res.data.tips.isOk&& res.data.data.length>0){
						this.execuser=res.data.data[0]
						if(this.workloadFillType=='2'){
							this.editForm.workload=this.execuser.quoteWorkload-this.val.actWorkload
						}
					}else{
						this.$notify({position:'bottom-left',showClose:true,message:'没有找到报价信息',type:'error'})
					}
				});
			},

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
