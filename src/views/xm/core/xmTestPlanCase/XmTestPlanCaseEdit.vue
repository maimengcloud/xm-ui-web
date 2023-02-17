<template>
	<section > 
		<el-row>
		<!--编辑界面 XmTestPlanCase 测试计划与用例关系表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef" label-position="left" > 
				<el-row ref="table">
					<el-col  :span="6" class="border padding">
					
						<el-form-item label="测试库" prop="casedbName">
							{{editForm.casedbName?editForm.casedbName:editForm.casedbId }}  
						</el-form-item>  
						<el-form-item label="归属计划" prop="planId">
							{{editForm.planId?editForm.planId:editForm.planId }}  
						</el-form-item>  
						<el-form-item label="归属项目" prop="projectId">
							{{editForm.projectId?editForm.projectId:editForm.projectId }}  
						</el-form-item>  
						<el-form-item label="归属产品" prop="productId">
							{{editForm.productName?editForm.productName:editForm.productId }}  
						</el-form-item>  
						<el-form-item label="关联模块" prop="menuName">
							{{editForm.funcName?editForm.funcName:'暂无关联需求'}}  
						</el-form-item> 
						<el-form-item label="关联需求" prop="menuName">
							{{editForm.menuName?editForm.menuName:'暂无关联需求'}} <el-button type="text" @click="menuFormVisible=true">查看需求</el-button>
						</el-form-item> 
						
						<el-form-item label="版本号" prop="verNum">
							<el-input v-model="editForm.verNum" placeholder="版本号" :maxlength="50" @change="editSomeFields(editForm,'verNum',$event)"></el-input>
						</el-form-item>   
					</el-col>
					<el-col :span="18" class="border padding-left padding-right padding-top">
						<el-form-item label="" prop="caseName" label-width="0px">  
					
					<el-row>
					<span class="title-font-size">{{editForm.caseName}}</span> 
					</el-row>
					<el-row class="label-font-color">
					<span > 用例编号:  {{editForm.caseId}}  </span> 
					</el-row>
					<el-row class="padding">
						<el-col :span="6"> 
							   <mdp-select-user-xm label="执行人" userid-key="execUserid" username-key="execUsername" v-model="editForm" @change="editSomeFields(editForm,'execUserid',$event)"></mdp-select-user-xm>
						</el-col> 
						<el-col :span="6">  
							<mdp-select-dict-x label="优先级" :dict="dicts['priority']" v-model="editForm.priority"  @change="editSomeFields(editForm,'priority',$event)"></mdp-select-dict-x>
						</el-col> 
						
						<el-col :span="6">  
							<mdp-select-dict-x label="执行结果" :dict="dicts['testStepTcode']" v-model="editForm.execStatus" :get-icon="getExecStatusIcon"  @change="editSomeFields(editForm,'execStatus',$event)"></mdp-select-dict-x> 
						</el-col> 
						<el-col :span="6">  
							<el-button v-if="opType!='add'" style="margin-top:12px;float:right;" @click="$emit('next')" type="primary">下一条</el-button>  
							<el-row v-if="opType=='add'">
								<el-button @click.native="handleCancel">取消</el-button>
								<el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
							</el-row>
 						</el-col> 
					</el-row>
 				</el-form-item>  
				<el-tabs v-model="activateName" >
					<el-tab-pane name="1" label="用例信息"  > 
						<el-row>
							<el-col :span="6">
								<el-row class="label-font-size">
									用例状态
								</el-row>
								<el-row>
                                 	 <mdp-select-dict-tag :dict="dicts['testCaseStatus']" v-model="editForm.caseStatus" :disabled="true"></mdp-select-dict-tag>
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
									<mdp-select-dict-tag  :dict="dicts['caseType']" v-model="editForm.caseType" :disabled="true" ></mdp-select-dict-tag>

								</el-row>
							</el-col>
							<el-col :span="6">
								
								<el-row  class="label-font-size">
									紧急程度
								</el-row>
								<el-row>
									 <mdp-select-dict-tag :dict="dicts['priority']" v-model="editForm.cpriority"  :disabled="true"></mdp-select-dict-tag> 
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
								备注
							</el-row> 
							<el-row class="padding">
								{{editForm.caseRemark?editForm.caseRemark:'无'}}
							</el-row>  
						</el-row>  
 					</el-tab-pane> 
					<el-tab-pane name="21" label="测试步骤"> 
						<el-row> 
							<el-row class="label-font-size">
								测试步骤
							</el-row> 
							<el-row class="padding">
								<test-step-result class="padding" v-model="editForm.testStep">
									<el-button slot="addBug" @click="addBugVisible=true" icon="el-icon-plus"  circle></el-button> 
								</test-step-result>
							</el-row> 
							<el-row class="label-font-size">
								执行备注
							</el-row> 
							<el-row class="padding">
								<el-input type="textarea" :rows="6" v-model="editForm.remark" placeholder="执行备注" :maxlength="2147483647" @change="editSomeFields(editForm,'remark',$event)"></el-input>
							</el-row>  
							<el-row v-if="opType!='add' && editFormBak.testStep!=editForm.testStep" > 
								<el-button v-loading="load.edit" type="primary" @click.native="editSomeFields(editForm,'testStep',editForm.testStep)" :disabled="load.edit==true">保存测试步骤</el-button>
							</el-row>
						</el-row>
					</el-tab-pane>
					<el-tab-pane name="3" label="缺陷"> 
 						<xm-question-mng   v-if="activateName=='3'" :xm-test-plan-case="editForm"  :xm-product="{id:editForm.productId,productName:editForm.productName}" :sel-project="{id:editForm.projectId,name:editForm.projectName}"></xm-question-mng>
 					</el-tab-pane>
					
					<el-tab-pane :label="'工时( '+( editForm.actWorkload||0)+' / '+( editForm.budgetWorkload||0)+' h )'" name="55"> 
						<xm-workload-record v-if="activateName=='55'" biz-type="4" :xm-test-plan-case="editForm" ></xm-workload-record>
					</el-tab-pane>
					<el-tab-pane name="4" label="附件">

					</el-tab-pane>
				</el-tabs>  
				
				
					</el-col>
					
				</el-row>    
			</el-form> 
		</el-row> 

				
		
		<el-dialog append-to-body title="需求明细"  :visible.sync="menuFormVisible" fullscreen width="80%"  top="20px"  :close-on-click-modal="false">
			<xm-menu-edit :visible="menuFormVisible"  :reload="true" :xm-menu="{menuId:editForm.menuId,menuName:editForm.menuName}" ></xm-menu-edit>
		</el-dialog>
		
		<!--新增 XmQuestion xm_question界面-->
		<el-dialog title="新增缺陷"  :visible.sync="addBugVisible" fullscreen  width="90%" top="20px"  append-to-body   :close-on-click-modal="false">
			<xm-question-add  op-type="add" :xm-product="{id:editForm.productId,productName:editForm.productName}" :xm-test-plan-case="editForm"  :sel-project=" {id:editForm.projectId,name:editForm.projectName} "  :visible="addBugVisible" @cancel="addBugVisible=false" ></xm-question-add>
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
import  MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm';//修改界面
		import  XmQuestionAdd from '../xmQuestion/XmQuestionEdit';//新增界面

	export default {
	    name:'xmTestPlanCaseEdit',
	    components: {
			TestStepResult,MyInput,XmMenuEdit:()=>import('../xmMenu/XmMenuEdit.vue'),XmQuestionMng,XmQuestionAdd,MdpSelectUserXm,
			'xm-workload-record':()=>import("../xmWorkload/XmWorkloadRecord"),

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
				menuFormVisible:false,
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
                
				if(fieldName=='execUserid'){
					params.execUserid=$event[0].userid
					params.execUsername=$event[0].username
				}else{
					params[fieldName]=$event
				}
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
                this.maxTableHeight = util.calcMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style lang="scss" scoped>
.my-input input {
	font-size: 28px !important; 
}

 
</style>