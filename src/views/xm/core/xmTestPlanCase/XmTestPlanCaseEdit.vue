<template>
	<section>
	    <el-row>
	    </el-row>
		<el-row ref="table">
		<!--编辑界面 XmTestPlanCase 测试计划与用例关系表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef" label-position="left"> 

				<el-form-item label="用例名称" prop="caseName">
					<el-input v-model="editForm.caseName" placeholder="用例名称" :maxlength="255" @change="editSomeFields(editForm,'caseName',$event)"></el-input>
				</el-form-item>  
				<el-form-item label="测试用例编号" prop="caseId">
					<el-input v-model="editForm.caseId" placeholder="测试用例编号" :maxlength="50" @change="editSomeFields(editForm,'caseId',$event)"></el-input>
				</el-form-item>   
				<el-form-item label="执行人" prop="execUsername">
					<el-input v-model="editForm.execUsername" placeholder="执行人姓名" :maxlength="255" @change="editSomeFields(editForm,'execUsername',$event)"></el-input>
				</el-form-item>  
				<el-form-item label="优先级" prop="priority">
					<el-select  v-model="editForm.priority" @change="editSomeFields(editForm,'priority',$event)">
						<el-option v-for="(item,index) in dicts['priority']" :key="index" :value="item.id" :label="item.name"></el-option>
					</el-select>
				</el-form-item> 
				<el-form-item label="执行备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="执行备注" :maxlength="2147483647" @change="editSomeFields(editForm,'remark',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="测试步骤" prop="testStep">
					 <test-step-result v-model="editForm.testStep"></test-step-result>
				</el-form-item> 
				
				<el-form-item label="测试结果" prop="execStatus">
					<el-select v-model="editForm.execStatus" @change="editSomeFields(editForm,'execStatus',$event)">
						<el-option v-for="(item,index) in dicts['testStepTcode']" :key="index" :value="item.id" :label="item.name"></el-option>
					</el-select>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row v-if="opType=='add'">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>

		
		<el-row v-if="opType!='add' && editFormBak.testStep!=editForm.testStep" > 
            <el-button v-loading="load.edit" type="primary" @click.native="editSomeFields(editForm,'testStep',editForm.testStep)" :disabled="load.edit==true">保存</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addXmTestPlanCase,editXmTestPlanCase,editSomeFieldsXmTestPlanCase } from '@/api/xm/core/xmTestPlanCase';
	import { mapGetters } from 'vuex'
import TestStepResult from './TestStepResult.vue';
	
	export default {
	    name:'xmTestPlanCaseEdit',
	    components: {
TestStepResult,

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTestPlanCase','visible','opType'],

		watch: {
	      'xmTestPlanCase':function( xmTestPlanCase ) {
	        if(xmTestPlanCase){
	            this.editForm = {...xmTestPlanCase};
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
					caseId: [
						//{ required: true, message: '测试用例编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					bugs:'',execUserid:'',caseId:'',ltime:'',ctime:'',execStatus:'',execUsername:'',planId:'',caseName:'',priority:'',remark:'',testStep:''
				},
				editFormBak: {
					bugs:'',execUserid:'',caseId:'',ltime:'',ctime:'',execStatus:'',execUsername:'',planId:'',caseName:'',priority:'',remark:'',testStep:''
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
			//新增、编辑提交XmTestPlanCase 测试计划与用例关系表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmTestPlanCase
							if(this.currOpType=='edit'){
							    func=editXmTestPlanCase
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
			    if(this.xmTestPlanCase){
                    this.editForm = Object.assign({},this.xmTestPlanCase);
                }

                if(this.opType=='edit'){

                }else{

                }
                this.editFormBak={...this.editForm}
            },

            editSomeFields(row,fieldName,$event){
                if(this.opType=='add'){
                    return;
                }
                let params={};
                params['pkList']=[row].map(i=>{ return { caseId:i.caseId,  planId:i.planId}})
                params[fieldName]=$event
                var func = editSomeFieldsXmTestPlanCase
                func(params).then(res=>{
                  let tips = res.data.tips;
                  if(tips.isOk){
                    this.editFormBak={...this.editForm}
					this.$emit('edit-fields',params)
                  }else{
                    Object.assign(this.editForm,this.editFormBak)
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }
                }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
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