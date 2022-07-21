<template>
	<section > 
		<el-row :style="{overflow:'auto',maxHeight:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmTestPlanCase 测试计划与用例关系表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef" label-position="left" > 

				<el-form-item label="" prop="caseName" label-width="0px">  
					<el-row>
					<span><span class="label-font-color">用例编号:</span>&nbsp;&nbsp;{{editForm.caseId}} &nbsp;&nbsp;<i class="el-icon-s-operation"></i><span class="label-font-color">模块：</span></span><span>{{editForm.funcName}}</span>
					</el-row>
					<el-row>
					<span class="title-font-size">{{editForm.caseName}}</span> 
					</el-row>
					<el-row class="padding">
						<el-col :span="8" class="field-box"> 
							<el-avatar class="avater"> {{editForm.execUsername}} </el-avatar> 
							<div class="msg">
								<span class="field-value">{{editForm.execUsername}} </span>
								<span class="field-label">执行人</span>
							</div>   
						</el-col> 
						<el-col :span="8">  
							<dict-field label="优先级" :dict="dicts['priority']" v-model="editForm.priority"></dict-field>
						</el-col> 
						
						<el-col :span="8">  
							<dict-field label="执行结果" :dict="dicts['testStepTcode']" v-model="editForm.execStatus" :get-icon="getExecStatusIcon"></dict-field> 
						</el-col> 
					</el-row>
 				</el-form-item>  
				<el-tabs v-model="activateName" >
					<el-tab-pane name="1" label="用例信息"  >
						<el-row  >
						<el-row class="padding-top">
							<el-col :span="6">
								<el-row class="label-font-size">
									用例状态
								</el-row>
								<el-row>
                                 	 <dict-tag :dict="dicts['testCaseStatus']" v-model="editForm.caseStatus" :disabled="true"></dict-tag>
								</el-row>
							</el-col>
							<el-col :span="6">
								<el-row  class="label-font-size">
									用例版本
								</el-row>
								<el-row>
									{{editForm.verNum}}
								</el-row>
							</el-col>
							<el-col :span="6">
								
								<el-row  class="label-font-size">
									用例类型
								</el-row>
								<el-row>
									<dict-tag  :dict="dicts['caseType']" v-model="editForm.caseType"></dict-tag>

								</el-row>
							</el-col>
							<el-col :span="6">
								
								<el-row  class="label-font-size">
									紧急程度
								</el-row>
								<el-row>
									 <dict-tag :dict="dicts['priority']" v-model="editForm.priority"></dict-tag> 
								</el-row>
							</el-col>
						</el-row> 
						
						<el-row class="padding-top"> 
							<el-row class="label-font-size padding-top">
								前置条件
							</el-row> 
							<el-row class="padding">
								{{editForm.preRemark?editForm.preRemark:'无'}}
							</el-row>  
						</el-row>
						<el-row class="padding-top"> 
							<el-row class="label-font-size padding-top">
								测试步骤
							</el-row> 
							<el-row class="padding">
								<test-step-result class="padding" v-model="editForm.testStep">
									<el-button slot="addBug" @click="addBugVisible=true" icon="el-icon-plus"  circle></el-button> 
								</test-step-result>
							</el-row> 
							<el-row v-if="opType!='add' && editFormBak.testStep!=editForm.testStep" > 
								<el-button v-loading="load.edit" type="primary" @click.native="editSomeFields(editForm,'testStep',editForm.testStep)" :disabled="load.edit==true">保存测试步骤</el-button>
							</el-row>
						</el-row>
						<el-row class="padding-top"> 
							<el-row class="label-font-size padding-top">
								备注
							</el-row> 
							<el-row class="padding">
								{{editForm.caseRemark?editForm.caseRemark:'无'}}
							</el-row>  
						</el-row>
						
						<el-form-item label="执行备注" prop="remark">
							<el-input type="textarea" :rows="6" v-model="editForm.remark" placeholder="执行备注" :maxlength="2147483647" @change="editSomeFields(editForm,'remark',$event)"></el-input>
						</el-form-item> 
						</el-row>
 					</el-tab-pane>
					<el-tab-pane name="2" label="需求"> 
						<el-row>
							<el-col :span="12"> 
								<el-form-item  label="归属产品" prop="productId"> 
									 {{editForm.productId}}
								</el-form-item>  
							</el-col>
							<el-col :span="12"> 
								<el-form-item  label="用户故事" prop="menuId" id="menuInfo"> 
									{{editForm.menuName}} &nbsp;&nbsp;&nbsp; <el-link @click="menuVisible=true" type="primary">{{editForm.menuName?'更改':'设置'}}</el-link>&nbsp;&nbsp;&nbsp;
									<el-link v-if="editForm.menuName" @click="menuVisible=true" type="primary">查看需求</el-link>
								</el-form-item> 
							</el-col> 
						</el-row>
					</el-tab-pane>
					<el-tab-pane name="3" label="缺陷"> 
						<el-row v-if="activateName=='3'">
							<xm-question-mng   :xm-test-plan-case="editForm"  :xm-product="{id:xmTestPlanCase.productId,productName:xmTestPlanCase.productName}" :sel-project="{id:xmTestPlanCase.projectId,name:xmTestPlanCase.projectName}"></xm-question-mng>
						</el-row>
					</el-tab-pane>
					<el-tab-pane name="4" label="附件">

					</el-tab-pane>
				</el-tabs>  
			</el-form> 
		</el-row>
		<el-row>  
			<el-col :offset="12" :span="12" style="display: flex;">  
				<dict-field label="执行结果" :dict="dicts['testStepTcode']" v-model="editForm.execStatus" :get-icon="getExecStatusIcon" @change="editSomeFields(editForm,'execStatus',$event)">
					<span slot="label"></span>
				</dict-field>   
				<el-button @click="$emit('next')" type="primary">下一条</el-button>
			</el-col> 
		</el-row>
		<el-row v-if="opType=='add'">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
				
		
		<el-dialog append-to-body title="需求明细"  :visible.sync="menuVisible" width="80%"  top="20px"  :close-on-click-modal="false">
			<xm-menu-edit :visible="menuVisible"  :reload="true" :xm-menu="{menuId:editForm.menuId,menuName:editForm.menuName}" ></xm-menu-edit>
		</el-dialog>
		
		<!--新增 XmQuestion xm_question界面-->
		<el-dialog title="新增缺陷"  :visible.sync="addBugVisible"   width="90%" top="20px"  append-to-body   :close-on-click-modal="false">
			<xm-question-add   :xm-product="{id:editForm.productId,productName:editForm.productName}" :xm-test-plan-case="editForm"  :sel-project=" {id:editForm.projectId,name:editForm.projectName} "  :visible="addBugVisible" @cancel="addBugVisible=false" ></xm-question-add>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addXmTestPlanCase,editXmTestPlanCase,editSomeFieldsXmTestPlanCase } from '@/api/xm/core/xmTestPlanCase';
	import { mapGetters } from 'vuex'
import TestStepResult from './TestStepResult.vue';
	import MyInput from '@/components/MDinput/index';
	import XmMenuEdit from '../xmMenu/XmMenuEdit.vue';
import  XmQuestionMng from '@/views/xm/core/xmQuestion/XmQuestionMng';//修改界面
		import  XmQuestionAdd from '../xmQuestion/XmQuestionAdd';//新增界面

	export default {
	    name:'xmTestPlanCaseEdit',
	    components: {
			TestStepResult,MyInput,XmMenuEdit,XmQuestionMng,XmQuestionAdd,

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
				dicts:{'testPlanStatus':[],'testPlanTcode':[],'testStepTcode':[],'priority':[],'testCaseStatus':[],'caseType':[]},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					caseId: [
						//{ required: true, message: '测试用例编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					bugs:'',execUserid:'',caseId:'',ltime:'',ctime:'',execStatus:'',execUsername:'',planId:'',caseName:'',priority:'',remark:'',testStep:'',caseType:''
				},
				editFormBak: {
					bugs:'',execUserid:'',caseId:'',ltime:'',ctime:'',execStatus:'',execUsername:'',planId:'',caseName:'',priority:'',remark:'',testStep:'',caseType:''
				},
                maxTableHeight:300,
				menuVisible:false,
				next:false,
				activateName:'1',
				addBugVisible:false,
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
				if(fieldName!='testStep'){
					if(this.editForm.testStep!=this.editFormBak.testStep){
						params.testStep=this.editForm.testStep
					}
				}
                var func = editSomeFieldsXmTestPlanCase
                func(params).then(res=>{
                  let tips = res.data.tips;
                  if(tips.isOk){
                    this.editFormBak={...this.editForm}
					params.next=this.next
					this.$emit('edit-fields',params)
                  }else{
                    Object.assign(this.editForm,this.editFormBak)
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }
                }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
            }, 

			getExecStatusIcon(execStatus){
				var icons=['el-icon-arrow-up','el-icon-right','el-icon-check','el-icon-minus','el-icon-close'];
				if(!execStatus){
					return icons[0]
				}
				return icons[parseInt(execStatus)]
			}
		},//end method
		mounted() {
		    this.$nextTick(() => {
                initDicts(this);  
                this.initData()
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)-100
            });
		}
	}

</script>

<style lang="scss" scoped>
.my-input input {
	font-size: 28px !important; 
}

 
</style>