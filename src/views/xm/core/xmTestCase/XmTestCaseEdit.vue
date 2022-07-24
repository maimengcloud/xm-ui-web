<template>
	<section> 
		<el-row>
		<!--编辑界面 XmTestCase 测试用例--> 
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-position="left"> 
				<el-row>
					<el-col  :span="6" class="padding border">
					
						<el-form-item label="测试库" prop="casedbName">
							{{editForm.casedbName?editForm.casedbName:editForm.casedbId }}  
						</el-form-item> 
						
						<el-form-item label="产品" prop="productId">
							{{editForm.productName?editForm.productName:editForm.productId }}  
						</el-form-item> 
						<el-form-item label="关联需求" prop="menuName">
							{{editForm.menuName?editForm.menuName:'暂无关联需求'}} <el-button type="text" @click="menuVisible=true">选择需求</el-button>
						</el-form-item> 
						
						<el-form-item label="版本号" prop="verNum">
							<el-input v-model="editForm.verNum" placeholder="版本号" :maxlength="50" @change="editSomeFields(editForm,'verNum',$event)"></el-input>
						</el-form-item>   
					</el-col>
					<el-col :span="18" class="border padding">

						<el-form-item label="" prop="caseName" label-width="0px">  
							<el-row class="label-font-color">
							<span><span v-if="opType=='edit'">用例编号:</span>&nbsp;&nbsp;{{editForm.id}} &nbsp;&nbsp;</span><span class="label-font-color"><i class="el-icon-s-operation"></i>模块：</span><span>{{editForm.funcName}} <el-button type="text" @click="funcVisible=true">选择模块</el-button></span>
							</el-row>
							<el-row>
 									<my-input v-model="editForm.caseName" placeholder="测试用例 标题"  @change="editSomeFields(editForm,'caseName',$event)"></my-input> 
 							</el-row>
							<el-row class="padding">
								
								<el-col :span="6">  
									<dict-field label="状态" :dict="dicts['testCaseStatus']" v-model="editForm.caseStatus"  @change="editSomeFields(editForm,'caseStatus',$event)"></dict-field> 
								</el-col> 
								<el-col :span="6"> 
									 <xm-user-field label="维护人" userid-key="luserid" username-key="lusername" v-model="editForm" @change="editSomeFields(editForm,'luserid',$event)"></xm-user-field>
 
								</el-col>  
								<el-col :span="6">  
									<dict-field label="用例类型" :dict="dicts['caseType']" v-model="editForm.caseType"  @change="editSomeFields(editForm,'caseType',$event)"></dict-field>
								</el-col> 
								<el-col :span="6">  
									<dict-field label="优先级" :dict="dicts['priority']" v-model="editForm.cpriority"  @change="editSomeFields(editForm,'cpriority',$event)"></dict-field>
								</el-col> 
								
							</el-row>
						</el-form-item>    
						<el-tabs v-model="activeTab">
							<el-tab-pane name="1" label="基本信息">
								<el-form-item label="" prop="preRmark" label-width="0px">
									<el-row class="label-font-color padding-top">
										前置条件
									</el-row> 
									<el-row>
										<el-input type="textarea" :rows="4" v-model="editForm.preRemark" placeholder="请输入前置条件"  @change="editSomeFields(editForm,'preRmark',$event)"></el-input>
									</el-row> 
								</el-form-item>   
								<el-form-item label="" prop="testStep" label-width="0px">
									<el-row class="label-font-color padding-top">
										测试步骤
									</el-row> 
									<el-row>
										<test-step-config v-model="editForm.testStep"></test-step-config>
									</el-row>
									<el-row v-if="opType!=='add' && editForm.testStep!=editFormBak.testStep">
										<el-button type="primary" @click="editSomeFields(editForm,'testStep',editForm.testStep)">保存测试步骤</el-button>
									</el-row>
								</el-form-item>     
								<el-form-item label="" prop="caseRmark" label-width="0px">
									<el-row class="label-font-color padding-top">
										用例描述
									</el-row> 
									<el-row>
										<el-input type="textarea" :rows="4" v-model="editForm.caseRemark" placeholder="请输入用例描述"  @change="editSomeFields(editForm,'caseRemark',$event)"></el-input>
									</el-row> 
								</el-form-item>  
							</el-tab-pane>
							
							<el-tab-pane name="2" label="缺陷"  v-if="opType!=='add'">
								<xm-question-mng  v-if="activeTab=='2'" :xm-test-case="editForm"  :xm-product="{id:editForm.productId,productName:editForm.productName}" :sel-project="{id:editForm.projectId,name:editForm.projectName}"></xm-question-mng>
							</el-tab-pane>
							<el-tab-pane name="3" label="执行记录" v-if="opType!=='add'">
								<xm-test-plan-case-mng :xm-test-casedb="xmTestCasedb" :xm-test-case="editForm" v-if="activeTab=='3'"></xm-test-plan-case-mng>
							</el-tab-pane>
							<el-tab-pane name="4" label="日志" v-if="opType!=='add'"></el-tab-pane>
						</el-tabs>
						
				
					</el-col>
					
				</el-row>     
			</el-form>
		</el-row>

		<el-row v-if="opType=='add'" >
			<span style="float:right;">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
			</span>
		</el-row>
		<el-dialog append-to-body title="需求选择"  :visible.sync="menuVisible" width="80%" top="20px"  :close-on-click-modal="false">
			<xm-menu-select :is-select-menu="true" checkScope="3"  @selected="onMenuSelected" :xm-product="{id:editForm.productId}"></xm-menu-select>
		</el-dialog>
		<el-dialog append-to-body title="模块选择"  :visible.sync="funcVisible" width="60%" top="20px"  :close-on-click-modal="false">
			<xm-func-select  @row-click="onFuncSelected" :xm-product="{id:editForm.productId}"></xm-func-select>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addXmTestCase,editXmTestCase,editSomeFieldsXmTestCase } from '@/api/xm/core/xmTestCase';
	import { mapGetters } from 'vuex'
	import XmMenuSelect from '../xmMenu/XmMenuSelect' 
	import XmFuncSelect from '../xmFunc/XmFuncSelect'
import TestStepConfig from './TestStepConfig.vue';

import  XmQuestionMng from '@/views/xm/core/xmQuestion/XmQuestionMng';//修改界面
import  XmTestPlanCaseMng from '@/views/xm/core/xmTestPlanCase/XmTestPlanCaseMng';//修改界面
 	import MyInput from '@/components/MDinput/index';
	
import  XmUserField from '@/views/xm/core/components/XmUserField';//修改界面
	export default {
	    name:'xmTestCaseEdit',
	    components: {
			XmMenuSelect,XmFuncSelect,MyInput,TestStepConfig,XmQuestionMng,XmTestPlanCaseMng,XmUserField,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTestCase','visible','opType','xmTestCasedb'],

		watch: {
	      'xmTestCase':function( xmTestCase ) {
	        if(xmTestCase){
	            this.editForm = {...xmTestCase};
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
				dicts:{caseType:[]},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					caseName: [
						{ required: true, message: '测试用例名称不能为空', trigger: 'change' },
						{ max:250,min:2,  message: '测试用例名称长度为2-250个字符之间', trigger: 'change' }
					]
				},
				editFormBak: {
					id:'',caseName:'',caseRemark:'',testStep:'',expectResult:'',menuId:'',menuName:'',ctime:'',ltime:'',luserid:'',lusername:'',cbranchId:'',moduleId:'',moduleName:'',caseStatus:'0',cuserid:'',cusername:'',productId:'',verNum:'',casedbId:'',casedbName:'',cpriority:'0',funcId:'',funcName:'',preRemark:'',caseType:'0'
				},
				editForm: {
					id:'',caseName:'',caseRemark:'',testStep:'',expectResult:'',menuId:'',menuName:'',ctime:'',ltime:'',luserid:'',lusername:'',cbranchId:'',moduleId:'',moduleName:'',caseStatus:'0',cuserid:'',cusername:'',productId:'',verNum:'1.0',casedbId:'',casedbName:'',cpriority:'0',funcId:'',funcName:'',preRemark:'',caseType:'0'
				},
                maxTableHeight:300,
				menuVisible:false,
				funcVisible:false,
				activeTab:'1',
			}//end return
		},//end data
		methods: {

		    ...util,

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmTestCase 测试用例父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmTestCase
							if(this.currOpType=='edit'){
							    func=editXmTestCase
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
			    if(this.xmTestCase){
                    this.editForm = Object.assign({},this.xmTestCase);
                }

                if(this.opType=='edit'){

                }else{
					if(this.xmTestCasedb && this.xmTestCasedb.id){
						this.editForm.productId=this.xmTestCasedb.productId
						this.editForm.productName=this.xmTestCasedb.productName
						this.editForm.casedbId=this.xmTestCasedb.id
						this.editForm.casedbName=this.xmTestCasedb.name
					}
					this.editForm.id=null
					
                }
                this.editFormBak={...this.editForm}
            },

            editSomeFields(row,fieldName,$event){
                if(this.opType=='add'){
                    return;
                }
                let params={};
                params['ids']=[row].map(i=>i.id)
				if(fieldName=='funcId'){
					 params[fieldName]=$event.id
					 params['funcName']=$event.name
				}else if(fieldName=='menuId'){ 
					 params[fieldName]=$event.menuId
					 params['menuName']=$event.menuName
				}else if(fieldName=='cuserid'){
					 params[fieldName]=$event[0].userid
					 params['cusername']=$event[0].username 
				}else if(fieldName=='luserid'){
					 params[fieldName]=$event[0].userid
					 params['lusername']=$event[0].username 
				}else{
					 params[fieldName]=$event
				} 
                var func = editSomeFieldsXmTestCase
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
			onMenuSelected(row){
				this.editForm.menuId=row.menuId
				this.editForm.menuName=row.menuName
				this.menuVisible=false;
				if(this.opType!=='add'){
					this.editSomeFields(this.editForm,'menuId',row)
				}
			},
			onFuncSelected(row){
				this.editForm.funcId=row.id
				this.editForm.funcName=row.name
				this.funcVisible=false;
				if(this.opType!=='add'){
					this.editSomeFields(this.editForm,'funcId',row)
				}
			}
		},//end method
		mounted() {
		    this.$nextTick(() => {
                initDicts(this);
                this.initData() 
            });
		}
	}

</script>

<style scoped>

</style>