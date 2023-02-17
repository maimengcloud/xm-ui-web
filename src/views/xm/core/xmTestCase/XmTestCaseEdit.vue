<template>
	<section> 
		<el-row>
		<!--编辑界面 XmTestCase 测试用例--> 
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef" label-position="left"> 
				<el-row>
					<el-col  :span="6" class="padding border">
					
						<el-form-item label="测试库" prop="casedbName">
							{{editForm.casedbName?editForm.casedbName:editForm.casedbId }}  
							<el-button type="text" @click="testCasedbVisible=true" v-if="opType==='add' && (!xmTestCasedb||!xmTestCasedb.id)">选择测试库</el-button>
						</el-form-item> 
						
						<el-form-item label="产品" prop="productId">
							{{editForm.productName?editForm.productName:editForm.productId }}  
						</el-form-item> 
						<el-form-item label="关联模块" prop="menuName">
							{{editForm.funcName?editForm.funcName:'暂无关联需求'}} <el-button type="text" @click="funcVisible=true">选择模块</el-button>
						</el-form-item>   
						<el-form-item  label="关联需求" prop="menuId" id="menuInfo"> 
							{{editForm.menuName}} &nbsp;&nbsp;&nbsp; <el-link @click="menuVisible=true" type="primary">{{editForm.menuName?'更改':'设置'}}</el-link>&nbsp;&nbsp;&nbsp;
							<el-link v-if="editForm.menuId" @click="menuFormVisible=true" type="primary">查看需求</el-link>
						</el-form-item> 
						<el-form-item label="版本号" prop="verNum">
							<el-input v-model="editForm.verNum" placeholder="版本号" :maxlength="50" @change="editSomeFields(editForm,'verNum',$event)"></el-input>
						</el-form-item>   
					</el-col>
					<el-col :span="18" class="border padding-left padding-right padding-top">

						<el-form-item label="用例标题" prop="caseName">    
 									<el-input v-model="editForm.caseName" placeholder="测试用例 标题"  @change="editSomeFields(editForm,'caseName',$event)"></el-input> 
 							<el-row class="label-font-color" v-if="opType=='edit'">
							<span><span >用例编号:</span>&nbsp;&nbsp;{{editForm.id}} &nbsp;&nbsp;</span> 
							</el-row>
						</el-form-item>    
						<el-row class="padding">
								
								<el-col :span="6">  
									<mdp-select-dict-x label="状态" :dict="dicts['testCaseStatus']" v-model="editForm.caseStatus"  @change="editSomeFields(editForm,'caseStatus',$event)"></mdp-select-dict-x> 
								</el-col> 
								<el-col :span="6"> 
									 <mdp-select-user-xm label="责任人" userid-key="cuserid" username-key="cusername" v-model="editForm" @change="editSomeFields(editForm,'cuserid',$event)" :product-id="editForm.productId"></mdp-select-user-xm>
 
								</el-col>  
								<el-col :span="6">  
									<mdp-select-dict-x label="用例类型" :dict="dicts['caseType']" v-model="editForm.caseType"  @change="editSomeFields(editForm,'caseType',$event)"></mdp-select-dict-x>
								</el-col> 
								<el-col :span="6">  
									<mdp-select-dict-x label="优先级" :dict="dicts['priority']" v-model="editForm.cpriority"  @change="editSomeFields(editForm,'cpriority',$event)"></mdp-select-dict-x>
								</el-col> 
							</el-row> 
						<el-tabs v-model="activeTab">
							<el-tab-pane name="1" label="基本信息">
								<el-form-item label="" prop="preRmark" label-width="0px">
									<el-row class="label-font-color">
										前置条件
									</el-row> 
									<el-row>
										<el-input type="textarea" :rows="4" v-model="editForm.preRemark" placeholder="请输入前置条件"  @change="editSomeFields(editForm,'preRemark',$event)"></el-input>
									</el-row> 
								</el-form-item>   
								<el-form-item label="" prop="testStep" label-width="0px">
									<el-row class="label-font-color">
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
									<el-row class="label-font-color">
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
							
							<el-tab-pane :label="'工时( '+( editForm.actWorkload||0)+' / '+( editForm.budgetWorkload||0)+' h )'" name="55"> 
								<xm-workload-record v-if="activeTab=='55'" biz-type="3" :xm-test-case="editForm" ></xm-workload-record>
							</el-tab-pane>
							<el-tab-pane name="4" label="日志" v-if="opType!=='add'"></el-tab-pane>
						</el-tabs>
						
						<el-row v-if="opType=='add'" class="padding">
							<span style="float:right;">
							<el-button @click.native="handleCancel">取消</el-button>
							<el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
							</span>
						</el-row>  
					</el-col>
					
				</el-row> 
  
			</el-form>
		</el-row>


		<el-dialog append-to-body title="需求选择"  :visible.sync="menuVisible" width="80%" top="20px"  :close-on-click-modal="false">
			<xm-menu-select :is-select-menu="true" checkScope="3"  @selected="onMenuSelected" :xm-product="{id:editForm.productId}"></xm-menu-select>
		</el-dialog>
		<el-dialog append-to-body title="模块选择"  :visible.sync="funcVisible" width="60%" top="20px"  :close-on-click-modal="false">
			<xm-func-select  @row-click="onFuncSelected" :xm-product="{id:editForm.productId}"></xm-func-select>
		</el-dialog>
		<el-dialog title="需求详情" :visible.sync="menuFormVisible" :with-header="false" width="90%" top="20px"    append-to-body   :close-on-click-modal="false" >
			<xm-menu-edit v-if="menuFormVisible" :reload="true" :xm-menu="{menuId:editForm.menuId}"  :visible="menuFormVisible" @cancel="menuFormVisible=false"></xm-menu-edit>
		</el-dialog>
		
		<el-dialog title="选择测试库" :visible.sync="testCasedbVisible" :with-header="false" width="90%" top="20px"    append-to-body   :close-on-click-modal="false" >
			<xm-test-casedb-mng v-if="testCasedbVisible" :select="true" :xm-product="xmProduct&&xmProduct.id?xmProduct:(xmMenu&&xmMenu.menuId?{id:xmMenu.productId,productName:xmMenu.productName}:null)"  :visible="testCasedbVisible" @cancel="testCasedbVisible=false" @select="onTestCasedbSelect"></xm-test-casedb-mng>
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
	
import  MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm';//修改界面
	export default {
	    name:'xmTestCaseEdit',
	    components: {
			XmMenuSelect,XmFuncSelect,MyInput,TestStepConfig,XmQuestionMng,XmTestPlanCaseMng,MdpSelectUserXm,
			XmMenuEdit:()=>import("../xmMenu/XmMenuDetail"),
			XmTestCasedbMng:()=>import('../xmTestCasedb/XmTestCasedbMng'),
			'xm-workload-record':()=>import("../xmWorkload/XmWorkloadRecord"),
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTestCase','visible','opType','xmTestCasedb','xmProduct','xmMenu'],

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
				editFormInit: {
					id:'',caseName:'',caseRemark:'',testStep:'',expectResult:'',menuId:'',menuName:'',ctime:'',ltime:'',luserid:'',lusername:'',cbranchId:'',moduleId:'',moduleName:'',caseStatus:'0',cuserid:'',cusername:'',productId:'',verNum:'1.0',casedbId:'',casedbName:'',cpriority:'0',funcId:'',funcName:'',preRemark:'',caseType:'0'
				},
                maxTableHeight:300,
				menuVisible:false,
				menuFormVisible:false,
				funcVisible:false,
				activeTab:'1',
				testCasedbVisible:false,
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
				this.editForm={...this.editFormInit}
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
					
					if(this.xmProduct && this.xmProduct.id){
						this.editForm.productId=this.xmProduct.id
						this.editForm.productName=this.xmProduct.productName  
					}
					
					if(this.xmMenu && this.xmMenu.menuId){
						this.editForm.productId=this.xmMenu.productId
						this.editForm.productName=this.xmMenu.productName
						this.editForm.menuId=this.xmMenu.menuId
						this.editForm.menuName=this.xmMenu.menuName
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
					 params['cbranchId']=$event[0].branchId 
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
			},
			onTestCasedbSelect(testCasedb){
				this.editForm.casedbId=testCasedb.id
				this.editForm.casedbName=testCasedb.Name
				if(testCasedb.productId){
					this.editForm.productId=testCasedb.productId
					this.editForm.productName=testCasedb.productName
				}
				this.testCasedbVisible=false;
				
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