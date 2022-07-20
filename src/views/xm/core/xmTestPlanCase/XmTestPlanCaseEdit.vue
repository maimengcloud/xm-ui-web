<template>
	<section>
	    <el-row>
	    </el-row>
		<el-row :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmTestPlanCase 测试计划与用例关系表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef" label-position="left" > 

				<el-form-item label="" prop="caseName" label-width="0px">  
					<el-row>
					<span class="padding-left"><i class="el-icon-s-operation"></i>模块：</span><span>{{editForm.funcName}}</span>
					</el-row>
					<el-row>
					<span class="title-font-size">{{editForm.caseName}}</span> 
					</el-row>
					<el-row class="padding">
						<el-col :span="8" class="avater-box"> 
							<el-avatar class="avater"> {{editForm.execUsername}} </el-avatar> 
							<div class="msg">
								<span class="title">{{editForm.execUsername}} </span>
								<span class="sub-title">执行人</span>
							</div>   
						</el-col> 
						<el-col :span="8" class="avater-box"> 
							<el-avatar class="avater" icon="el-icon-top" :style="{backgroundColor:getColor(editForm.priority)}"></el-avatar> 
							<div class="msg">
								<span class="title">{{formatDicts(dicts,'priority',editForm.priority)}} </span>
								<span class="sub-title">优先级</span>
							</div>   
							<el-select class="select" v-model="editForm.priority" @change="editSomeFields(editForm,'priority',$event)" clearable>
								<el-option style="margin-top:5px;" v-for="(item,index) in dicts['priority']" :key="index" :value="item.id" :label="item.name">
									<span :style="{backgroundColor:item.color,color:'aliceblue'}" class="padding"> 
										<i  v-if="item.icon" :class="item.icon"></i>
										{{item.name}}
									</span> 
								</el-option>
							</el-select>
						</el-col> 
						
						<el-col :span="8" class="avater-box">  
							<div>    
  								<el-button size="medium " :type="getType(editForm.execStatus)" :icon="getExecStatusIcon(editForm.execStatus)" circle></el-button>
							</div>
							<div class="msg">
								<span class="title">{{formatDicts(dicts,'testStepTcode',editForm.execStatus)}} </span>
								<span class="sub-title">执行结果</span>
							</div>   
						</el-col> 
					</el-row>
 				</el-form-item>  
				<el-tabs>
					<el-tab-pane name="1" label="用例信息">
						<el-row class="padding-top">
							<el-col :span="6">
								<el-row class="label-font-size">
									用例状态
								</el-row>
								<el-row>
									<el-tag class="cell-text" v-for="(item,index) in formatDictsWithClass(dicts,'testCaseStatus',editForm.caseStatus)" :key="index" :type="item.className">{{item.name}}</el-tag>
                                 
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
									<el-tag  v-for="(item,index) in formatDictsWithClass(dicts,'caseType',editForm.caseType)" :key="index" :type="item.className">{{item.name}}</el-tag>

								</el-row>
							</el-col>
							<el-col :span="6">
								
								<el-row  class="label-font-size">
									紧急程度
								</el-row>
								<el-row>
									<el-tag  v-for="(item,index) in formatDictsWithClass(dicts,'priority',editForm.priority)" :key="index" :type="item.className">{{item.name}}</el-tag>

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
								<test-step-result class="padding" v-model="editForm.testStep"></test-step-result>
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

					</el-tab-pane>
					<el-tab-pane name="4" label="附件">

					</el-tab-pane>
				</el-tabs>  
			</el-form>
		</el-row>
		
				
		<el-row> 
			<el-col :span="8">
				<el-checkbox v-model="next">继续下一条执行用例</el-checkbox>
			</el-col>
			<el-col :span="8" class="avater-box">  
				<div>    
					<el-button size="medium " :type="getType(editForm.execStatus)" :icon="getExecStatusIcon(editForm.execStatus)" circle></el-button>
				</div>
				<div class="msg">
					<span class="title">{{formatDicts(dicts,'testStepTcode',editForm.execStatus)}} </span> 
				</div> 
				<el-select class="select" v-model="editForm.execStatus" @change="editSomeFields(editForm,'execStatus',$event)">
				<el-option style="margin-top:5px;" v-for="(item,index) in dicts['testStepTcode']" :key="index" :value="item.id" :label="item.name">
					<span :style="{backgroundColor:item.color,color:'aliceblue'}" class="padding"> 
						<i  :class="getExecStatusIcon(item.id)"></i>
						{{item.name}}
					</span> 
				</el-option>
			</el-select>   
			</el-col> 
			
		</el-row>
		<el-row v-if="opType=='add'">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
		<el-dialog append-to-body title="需求明细"  :visible.sync="menuVisible" width="80%"  top="20px"  :close-on-click-modal="false">
			<xm-menu-edit :visible="menuVisible"  :reload="true" :xm-menu="{menuId:editForm.menuId,menuName:editForm.menuName}" ></xm-menu-edit>
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
	
	export default {
	    name:'xmTestPlanCaseEdit',
	    components: {
TestStepResult,MyInput,XmMenuEdit,

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
					bugs:'',execUserid:'',caseId:'',ltime:'',ctime:'',execStatus:'',execUsername:'',planId:'',caseName:'',priority:'',remark:'',testStep:''
				},
				editFormBak: {
					bugs:'',execUserid:'',caseId:'',ltime:'',ctime:'',execStatus:'',execUsername:'',planId:'',caseName:'',priority:'',remark:'',testStep:''
				},
                maxTableHeight:300,
				menuVisible:false,
				next:false,
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
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style lang="scss">
.my-input input {
	font-size: 28px !important; 
}


.avater-box {  
    display: flex;
    align-items: center;
	cursor: pointer;
    .avater { 
		background-color:#FF9F73;
    }

    .msg {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        .title { 
			margin-top: 5px;
            font-size: 16px; 
        } 
		.sub-title{  
			margin-top: -10px;
			 font-size: 14px;
			 color: #C0C4CC;
		}
        
    }
	.select{
		visibility:hidden; 
	}
	.btn{
		margin-top: 0px;
		visibility:hidden; 
	} 
}
 .avater-box:hover .btn{
		visibility: visible !important;
}
 .avater-box:hover .select{
		visibility: visible !important;
}
</style>