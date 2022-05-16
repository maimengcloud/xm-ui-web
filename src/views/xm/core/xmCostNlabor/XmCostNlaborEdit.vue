<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmCostNlabor 项目实际人工成本费用--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="项目编号" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="项目编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="用户编号-费用主责人" prop="userid">
					<el-input v-model="editForm.userid" placeholder="用户编号-费用主责人" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="费用发放时间" prop="sendTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.sendTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="用户名称" prop="username">
					<el-input v-model="editForm.username" placeholder="用户名称" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="项目名称" prop="projectName">
					<el-input v-model="editForm.projectName" placeholder="项目名称" :maxlength="255"></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注" :maxlength="255"></el-input>
				</el-form-item> 
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="任务编号" prop="taskId">
					<el-input v-model="editForm.taskId" placeholder="任务编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="任务名称" prop="taskName">
					<el-input v-model="editForm.taskName" placeholder="任务名称" :maxlength="255"></el-input>
				</el-form-item> 
				<el-form-item label="科目编号" prop="subjectId">
					<el-input v-model="editForm.subjectId" placeholder="科目编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="费用归属周期开始日期" prop="bizSdate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.bizSdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="费用归属周期结束日期" prop="bizEdate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.bizEdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="实际成本金额" prop="actAt">
					<el-input v-model="editForm.actAt" placeholder="实际成本金额" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="成本类型0非人力1内部人力2外购人力,此表都是非人力" prop="costType">
					<el-input v-model="editForm.costType" placeholder="成本类型0非人力1内部人力2外购人力,此表都是非人力" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="业务归属月份yyyy-MM" prop="bizMonth">
					<el-input v-model="editForm.bizMonth" placeholder="业务归属月份yyyy-MM" :maxlength="7"></el-input>
				</el-form-item> 
				<el-form-item label="业务归属日期yyyy-MM-dd" prop="bizDate">
					<el-input v-model="editForm.bizDate" placeholder="业务归属日期yyyy-MM-dd" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="科目名称" prop="subjectName">
					<el-input v-model="editForm.subjectName" placeholder="科目名称" :maxlength="255"></el-input>
				</el-form-item> 
				<el-form-item label="用户归属机构" prop="ubranchId">
					<el-input v-model="editForm.ubranchId" placeholder="用户归属机构" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="项目归属机构" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="项目归属机构" :maxlength="50"></el-input>
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
 	import { initDicts, addXmCostNlabor,editXmCostNlabor } from '@/api/xm/core/xmCostNlabor';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmCostNlaborEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmCostNlabor','visible','opType'],

		watch: {
	      'xmCostNlabor':function( xmCostNlabor ) {
	        if(xmCostNlabor){
	            this.editForm = {...xmCostNlabor};
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
					projectId:'',userid:'',ctime:'',sendTime:'',username:'',projectName:'',remark:'',id:'',taskId:'',taskName:'',subjectId:'',bizSdate:'',bizEdate:'',actAt:'',costType:'',bizMonth:'',bizDate:'',subjectName:'',ubranchId:'',branchId:''
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
			//新增、编辑提交XmCostNlabor 项目实际人工成本费用父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmCostNlabor
							if(this.currOpType=='edit'){
							    func=editXmCostNlabor
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
			    if(this.xmCostNlabor){
                    this.editForm = Object.assign({},this.xmCostNlabor);
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