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
						<el-form-item label="测试方式" prop="testType">
							<mdp-select show-style="tag" placeholder="测试方式" clearable item-code="testType" v-model="editForm.testType" effect="dark" @change="editSomeFields(editForm,'testType',$event)" :disabled="true"></mdp-select>
						</el-form-item>
						<el-form-item label="版本号" prop="verNum">
							<el-input v-model="editForm.verNum" placeholder="版本号" :maxlength="50" @change="editSomeFields(editForm,'verNum',$event)"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="18" class="border padding-left padding-right padding-top">
						<el-form-item label="" prop="caseName" label-width="0px">

							<el-row>
								 名称：{{editForm.caseName}}<span class="label-font-color"> &nbsp;&nbsp; {{editForm.caseId}}  </span>
							</el-row>
							<el-row v-if="editForm.testType=='1'" class="padding-bottom">
								<div style="display:flex;">
									<mdp-select show-style="tag" label="请求方法" v-model="autoStep.method" :dict="dicts.autoTestMethod" :disabled="true"></mdp-select>
									<span>{{ autoStep.url }}</span>
									<el-button style="margin-left:10px;" type="primary" @click="sendMsgForTestSetting" title="执行用例">执行用例</el-button>

								</div>
							</el-row>
							<el-row class="padding">
								<el-col :span="6">
									<mdp-select-user show-style="x" size="medium" label="执行人" v-model="editForm.execUserid" :init-name="editForm.execUsername" @change="editSomeFields(editForm,'execUserid',$event)"></mdp-select-user>
								</el-col>
								<el-col :span="6">
									<mdp-select  show-style="x" size="medium" label="优先级" item-code="priority" v-model="editForm.priority"  @change="editSomeFields(editForm,'priority',$event)"></mdp-select>
								</el-col>
								<el-col :span="6">
									<mdp-select  show-style="x" size="medium" label="执行结果" item-code="testStepTcode" v-model="editForm.execStatus" :get-icon="getExecStatusIcon"  @change="editSomeFields(editForm,'execStatus',$event)"></mdp-select>
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
                                 	 <mdp-select show-style="tag" item-code="testCaseStatus" v-model="editForm.caseStatus" :disabled="true"></mdp-select>
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
									<mdp-select show-style="tag"  item-code="caseType" v-model="editForm.caseType" :disabled="true" ></mdp-select>

								</el-row>
							</el-col>
							<el-col :span="6">

								<el-row  class="label-font-size">
									紧急程度
								</el-row>
								<el-row>
									 <mdp-select show-style="tag" item-code="priority" v-model="editForm.cpriority"  :disabled="true"></mdp-select>
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
					<el-tab-pane name="21" label="测试步骤" v-if="editForm.testType!='1'">
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
					<el-tab-pane name="12" label="Params"  v-if="editForm.testType=='1'">
						<el-form-item label="查询参数"   class="field">
							{{queryStrCpd||'暂无'}}
						</el-form-item>
						<el-table
							:data="autoStep.params"
							style="width: 100%">
							<el-table-column
								prop="id"
								label="参数名"
								min-width="200">
							</el-table-column>
							<el-table-column
								prop="value"
								label="参数值"
								min-width="250">
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane name="13" label="Body"  v-if="editForm.testType=='1'">
						<mdp-select  show-style="x" size="medium" style="margin-bottom:10px;" class="padding" label="参数格式" v-model="autoStep.bodyType" :dict="dicts.autoTestBodyType" :disabled="true"></mdp-select>
						<el-input v-if="autoStep.bodyType=='json'" type="textarea" :rows="10" v-model="autoStep.body" readonly></el-input>
						<el-input v-if="autoStep.bodyType=='xml'" type="textarea" :rows="10" v-model="autoStep.body" readonly></el-input>

						<el-table v-if="autoStep.bodyType=='form-data'||autoStep.bodyType=='x-www-form-urlencoded'"
							:data="autoStep.body"
							style="width: 100%">
							<el-table-column
								prop="id"
								label="参数名"
								min-width="200">
							</el-table-column>
							<el-table-column
								prop="value"
								label="参数值"
								min-width="250">
							</el-table-column>
						</el-table>

					</el-tab-pane>
					<el-tab-pane name="14" label="Cookie"  v-if="editForm.testType=='1'">
						<el-table
							:data="autoStep.cookies"
							style="width: 100%">
							<el-table-column
								prop="id"
								label="参数名"
								min-width="200">
							</el-table-column>
							<el-table-column
								prop="value"
								label="参数值"
								min-width="250">
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane name="15" label="Header"  v-if="editForm.testType=='1'">
						<el-table
							:data="autoStep.headers"
							style="width: 100%">
							<el-table-column
								prop="id"
								label="参数名"
								min-width="200">
							</el-table-column>
							<el-table-column
								prop="value"
								label="参数值"
								min-width="250">
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane name="16" label="Auth"  v-if="editForm.testType=='1'">

						<mdp-select  show-style="x" size="medium" style="margin-bottom:10px;" class="padding" label="授权方式" v-model="autoStep.authType" :dict="dicts.autoTestAuthType" :disabled="true"></mdp-select>


						<el-row v-if="autoStep.authType=='basic-auth'">
							<el-form-item  label="username" class="field">
								{{autoStep.authData.username}}
							</el-form-item>
							<el-form-item label="password"   class="field">
								{{autoStep.authData.password||'暂无'}}
							</el-form-item>
						</el-row>

						<el-row v-if="autoStep.authType=='bearer-token'">
							<el-form-item  label="Bearer" class="field">
								{{autoStep.authData.bearerToken}}
							</el-form-item>
						</el-row>
					</el-tab-pane>
					<el-tab-pane name="17" label="响应"  v-if="editForm.testType=='1'">
						<el-row class="padding">可使用的变量 res={config:{协议配置},data:{接口返回的业务数据对象} ,headers:{协议头,key-value型},status:状态码如200/201 }</el-row>
						<el-row class="padding">可使用的变量 env={key1:value1,key2:value2,等等},env为测试库环境变量及测试计划的环境变量合并，重复则以测试计划的为准。可通过env['key1']获取值</el-row>

						<el-form-item  label="成功与失败的逻辑判断">
							<el-input type="textarea" :rows="10" v-model="autoStep.expectResult" placeholder="成功与失败的判断"  readonly></el-input>
						</el-form-item>
						<el-form-item  label="例子">
								if(res.status==200){<br/>
								&nbsp;&nbsp;return true;<br/>
								}else{<br/>
								&nbsp;&nbsp;return false;<br/>
								}<br/>
						</el-form-item>
						<el-form-item  label="响应数据预览" >
							<el-row> <el-checkbox v-model="resDataVisible">显示响应数据</el-checkbox></el-row>
							<json-viewer v-if="resDataVisible==true" :value="testRes" copyable theme="my-awesome-json-theme"></json-viewer>

						</el-form-item>
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
	 import {autoStepToAxios,initEnvVars} from '@/api/xm/core/XmTestAutoStep.js';//全局公共库

	import { mapGetters } from 'vuex'
import TestStepResult from './TestStepResult.vue';
	import MyInput from '@/components/MDinput/index';
	import XmMenuEdit from '../xmMenu/XmMenuEdit.vue';
import  XmQuestionMng from '@/views/xm/core/xmQuestion/XmQuestionMng';//修改界面
import  MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm';//修改界面
		import  XmQuestionAdd from '../xmQuestion/XmQuestionEdit';//新增界面
		import axios from 'axios'//免登录访问
import JsonViewer from 'vue-json-viewer'

	export default {
	    name:'xmTestPlanCaseEdit',
	    components: {
			TestStepResult,MyInput,XmMenuEdit:()=>import('../xmMenu/XmMenuEdit.vue'),XmQuestionMng,XmQuestionAdd,MdpSelectUserXm,
			'xm-workload-record':()=>import("../xmWorkload/XmWorkloadRecord"),
			JsonViewer,

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),
			queryStrCpd(){
				return this.autoStep.params.filter(k=>k.id).map(k=>k.id+'='+k.value).join("&")
			}

		},
		props:['xmTestPlanCase','visible','opType','xmTestCasedb','xmTestPlan'],

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


				testRes:{},
				resDataVisible:false,

				autoStep:{
					url:'',
					method:'GET',
					authType:'none',
					authData:{
					},
					bodyType:'json',
					params:[],
					body:[],
					cookies:[],
					expectResult:''
				},
				autoStepInit:{
					url:'',
					method:'',
					authType:'',
					authData:{
					},
					bodyType:'',
					params:[],
					body:[],
					cookies:[],
					expectResult:''
				}
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

			initQueryStr(){
				this.queryStr=this.autoStep.params.map(k=>k.id+'='+k.value).join("&")
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.xmTestPlanCase){
                    this.editForm = Object.assign({},this.xmTestPlanCase);
                }

                if(this.opType=='edit'){

                }else{

                }
				if(!this.editForm.autoStep){
					this.autoStep={...this.autoStepInit}
				}else{
					this.autoStep=JSON.parse(this.editForm.autoStep)
				}

                this.editFormBak={...this.editForm}
            },
			sendMsgForTestSetting(){
				this.activateName='17'
				var autoStepObj=this.autoStep
				if(!autoStepObj.url){
					this.$notify({position:'bottom-left',showClose:true,message:'url不能为空',type: 'error'})
					return;
				}
				var env=initEnvVars(this.xmTestCasedb?this.xmTestCasedb.envJson:null,this.xmTestPlan ?this.xmTestPlan.envJson:null);
				var axiosObj=autoStepToAxios(autoStepObj,env)
				//axiosObj.headers['Access-Control-Allow-Origin']='*'
				//axios.defaults.withCredentials = true // 若跨域请求需要带 cookie 身份识别
				//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
				axios(axiosObj).then(res=>{
					this.testRes=res
					if(autoStepObj.expectResult){
						var func=new Function('res','env',autoStepObj.expectResult)
						var result=func(res,env)
						if(result==true){
							this.$notify({position:'bottom-left',showClose:true,message:'成功',type: 'success'})

						}else{
							this.$notify({position:'bottom-left',showClose:true,message:'失败',type: 'error'})

						}
						this.editSomeFields(this.editForm,'execStatus',result==true?"2":"4")
					}else{
						this.$notify({position:'bottom-left',showClose:true,message:'执行完毕',type: res.status==200?'success':'error'})
						this.editSomeFields(this.editForm,'execStatus',res.status==200?"2":"4")
					}
				}).catch(res=>{
					
					var func=new Function('res','env',autoStepObj.expectResult)
					var result=func(res,env)
					if(result==true){
						this.$notify({position:'bottom-left',showClose:true,message:'成功',type: 'success'})
						this.editSomeFields(this.editForm,'execStatus', "2")

					}else{
						if(res.code=='401'){
							this.$notify({position:'bottom-left',showClose:true,message:'未登录，可能是授权数据过期',type: 'error'})
						}else{
							this.$notify({position:'bottom-left',showClose:true,message:'失败',type: 'error'})
						}
						this.editSomeFields(this.editForm,'execStatus', "4")
					}

				})

			},
			saveAutoStep(){
				this.$notify({position:'bottom-left',showClose:true,message:'当前执行用例不允许修改',type:'error'})
			},
            editSomeFields(row,fieldName,$event){
                if(this.opType=='add'){
                    return;
                }
                let params={};
                params['pkList']=[row].map(i=>{ return { caseId:i.caseId,  planId:i.planId}})

				if(fieldName=='execUserid'){
					params.execUserid=$event.userid
					params.execUsername=$event.username
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
