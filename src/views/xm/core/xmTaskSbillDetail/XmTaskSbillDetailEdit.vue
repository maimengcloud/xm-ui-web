<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmTaskSbillDetail 工时登记表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="员工编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="员工编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="姓名" prop="username">
					<el-input v-model="editForm.username" placeholder="姓名" :maxlength="255"></el-input>
				</el-form-item> 
				<el-form-item label="创建日期" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="业务对象主键任务编号" prop="taskId">
					<el-input v-model="editForm.taskId" placeholder="业务对象主键任务编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="业务日期yyyy-MM-dd" prop="bizDate">
					<el-input v-model="editForm.bizDate" placeholder="业务日期yyyy-MM-dd" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注" :maxlength="255"></el-input>
				</el-form-item> 
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="结算单据编号-来自task_sbill.id" prop="sbillId">
					<el-input v-model="editForm.sbillId" placeholder="结算单据编号-来自task_sbill.id" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="结算提交时间" prop="stime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.stime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结算状态0-无需结算，1-待结算2-已提交3-已通过4-已结算" prop="sstatus">
					<el-input v-model="editForm.sstatus" placeholder="结算状态0-无需结算，1-待结算2-已提交3-已通过4-已结算" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="工时对应金额" prop="amt">
					<el-input v-model="editForm.amt" placeholder="工时对应金额" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="结算工时对应结算金额-根据结算方案计算结算金额" prop="samt">
					<el-input v-model="editForm.samt" placeholder="结算工时对应结算金额-根据结算方案计算结算金额" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="报工工时" prop="workload">
					<el-input v-model="editForm.workload" placeholder="报工工时" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="归属项目" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="归属项目" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="结算工时，用于结算，默认=workload" prop="sworkload">
					<el-input v-model="editForm.sworkload" placeholder="结算工时，用于结算，默认=workload" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="月份yyyy-MM型" prop="bizMonth">
					<el-input v-model="editForm.bizMonth" placeholder="月份yyyy-MM型" :maxlength="7"></el-input>
				</el-form-item> 
				<el-form-item label="任务预算金额-来自task表" prop="budgetAt">
					<el-input v-model="editForm.budgetAt" placeholder="任务预算金额-来自task表" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="任务预算工时-来自task表" prop="budgetWorkload">
					<el-input v-model="editForm.budgetWorkload" placeholder="任务预算工时-来自task表" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="任务初始工时-来自task表" prop="initWorkload">
					<el-input v-model="editForm.initWorkload" placeholder="任务初始工时-来自task表" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="报价金额-来自task_execuser表" prop="quoteAt">
					<el-input v-model="editForm.quoteAt" placeholder="报价金额-来自task_execuser表" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="报价工时-来自task_execuser表" prop="quoteWorkload">
					<el-input v-model="editForm.quoteWorkload" placeholder="报价工时-来自task_execuser表" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="任务结算方案,来自task表、来自数字字典xmTaskSettleSchemel" prop="sschemel">
					<el-input v-model="editForm.sschemel" placeholder="任务结算方案,来自task表、来自数字字典xmTaskSettleSchemel" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="工时单价，来自task表，根据task_out判断取内部还是外部单价" prop="uniPrice">
					<el-input v-model="editForm.uniPrice" placeholder="工时单价，来自task表，根据task_out判断取内部还是外部单价" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="报价结束时间" prop="qendTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.qendTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="报价开始时间" prop="qstartTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.qstartTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="实际完工时间-来自task表" prop="actEndTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.actEndTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="实际开始时间-来自task表" prop="actStartTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.actStartTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
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
 	import { initDicts, addXmTaskSbillDetail,editXmTaskSbillDetail } from '@/api/xm/core/xmTaskSbillDetail';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmTaskSbillDetailEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTaskSbillDetail','visible','opType'],

		watch: {
	      'xmTaskSbillDetail':function( xmTaskSbillDetail ) {
	        if(xmTaskSbillDetail){
	            this.editForm = {...xmTaskSbillDetail};
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
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					userid:'',username:'',ctime:'',taskId:'',bizDate:'',remark:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:'',projectId:'',sworkload:'',bizMonth:'',budgetAt:'',budgetWorkload:'',initWorkload:'',quoteAt:'',quoteWorkload:'',sschemel:'',uniPrice:'',qendTime:'',qstartTime:'',actEndTime:'',actStartTime:''
				},
                maxTableHeight:300,
			}//end return
		},//end data
		methods: {

		    ...util,

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmTaskSbillDetail 工时登记表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmTaskSbillDetail
							if(this.currOpType=='edit'){
							    func=editXmTaskSbillDetail
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
                                this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$notify({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.xmTaskSbillDetail){
                    this.editForm = Object.assign({},this.xmTaskSbillDetail);
                }

                if(this.opType=='edit'){

                }else{

                }
            },

		},//end method
		mounted() {
		    this.$nextTick(() => {
                initDicts(this);
                this.initData()
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style scoped>

</style>