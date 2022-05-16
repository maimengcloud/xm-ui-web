<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmBudgetLabor 项目人力成本预算--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="项目编号" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="项目编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="项目成员编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="项目成员编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="预算金额/每月" prop="budgetAt">
					<el-input v-model="editForm.budgetAt" placeholder="预算金额/每月" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注" :maxlength="255"></el-input>
				</el-form-item> 
				<el-form-item label="用户名" prop="username">
					<el-input v-model="editForm.username" placeholder="用户名" :maxlength="255"></el-input>
				</el-form-item> 
				<el-form-item label="预算科目编号" prop="subjectId">
					<el-input v-model="editForm.subjectId" placeholder="预算科目编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="费用归属周期开始日期" prop="bizSdate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.bizSdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="费用归属周期结束日期" prop="bizEdate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.bizEdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="费用归属月份yyyy-mm" prop="bizMonth">
					<el-input v-model="editForm.bizMonth" placeholder="费用归属月份yyyy-mm" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="当前流程实例编号" prop="instId">
					<el-input v-model="editForm.instId" placeholder="当前流程实例编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除" prop="bizFlowState">
					<el-input v-model="editForm.bizFlowState" placeholder="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="成本类型0非人力1内部人力2外购人力" prop="costType">
					<el-input v-model="editForm.costType" placeholder="成本类型0非人力1内部人力2外购人力" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="科目名称" prop="subjectName">
					<el-input v-model="editForm.subjectName" placeholder="科目名称" :maxlength="255"></el-input>
				</el-form-item> 
				<el-form-item label="项目归属机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="项目归属机构编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="用户归属机构编号-也就是将来的结算对象" prop="ubranchId">
					<el-input v-model="editForm.ubranchId" placeholder="用户归属机构编号-也就是将来的结算对象" :maxlength="50"></el-input>
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
 	import { initDicts, addXmBudgetLabor,editXmBudgetLabor } from '@/api/xm/core/xmBudgetLabor';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmBudgetLaborEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmBudgetLabor','visible','opType'],

		watch: {
	      'xmBudgetLabor':function( xmBudgetLabor ) {
	        if(xmBudgetLabor){
	            this.editForm = {...xmBudgetLabor};
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
					projectId:'',userid:'',budgetAt:'',id:'',remark:'',username:'',subjectId:'',bizSdate:'',bizEdate:'',bizMonth:'',instId:'',bizFlowState:'',costType:'',subjectName:'',branchId:'',ubranchId:''
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
			//新增、编辑提交XmBudgetLabor 项目人力成本预算父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmBudgetLabor
							if(this.currOpType=='edit'){
							    func=editXmBudgetLabor
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
			    if(this.xmBudgetLabor){
                    this.editForm = Object.assign({},this.xmBudgetLabor);
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