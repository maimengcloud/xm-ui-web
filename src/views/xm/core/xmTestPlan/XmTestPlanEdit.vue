<template>
	<section  class="padding">
		<el-row ref="table">
		<!--编辑界面 XmTestPlan 测试计划-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef" label-position="left">
				 <el-form-item prop="name" label-width="0px">
				  <el-row class="padding-bottom">
					<my-input v-model="editForm.name" placeholder="计划名称" :maxlength="255" @change="editSomeFields(editForm,'name',$event)"></my-input>
 				  </el-row>
				   <el-row v-if="opType!='add'">
					 <span class="label-font-color padding-left">测试计划编号:{{ editForm.id }}</span>
 				  </el-row>
				  </el-form-item>
				<el-row class="padding-bottom">
					<el-col :span="6">
						<mdp-select-user show-style="x" label="负责人" v-model="editForm.cuserid" :init-name="editForm.cusername" @change2="editSomeFields(editForm,'cuserid',$event)"></mdp-select-user>
					</el-col>
					<el-col :span="6">
						<mdp-select  show-style="x" label="状态" item-code="testPlanStatus" v-model="editForm.status"  @change="editSomeFields(editForm,'status',$event)"></mdp-select>
					</el-col>

					<el-col :span="6">
						<mdp-select  show-style="x" label="测试方式" item-code="testType" v-model="editForm.testType"  @change="editSomeFields(editForm,'testType',$event)"></mdp-select>
					</el-col>
					<el-col :span="6">
						<mdp-select  show-style="x" label="测试结果" item-code="testPlanTcode" v-model="editForm.tcode"  @change="editSomeFields(editForm,'tcode',$event)"></mdp-select>
					</el-col>
				</el-row>

				<el-form-item label="归属测试库" prop="casedbName" class="padding-top">
					{{editForm.casedbName}}
				</el-form-item>
				<el-form-item label="归属项目" prop="projectId" >

					 <span v-if="opType=='add'">
						  <xm-project-select v-if="!selProject || !selProject.id" ref="xmProjectSelect" :link-product-id="xmTestCasedb? xmTestCasedb.productId:null"  @row-click="onPorjectConfirm" :auto-select="false">

						 </xm-project-select>
					 </span>
					  <div v-else>{{editForm.projectName}}</div>
				 </el-form-item>
				<el-form-item label="归属产品" prop="productName">
					{{editForm.productName}}
				</el-form-item>

				<el-form-item label="起止时间" prop="stime">
					<mdp-date-range :auto-default="false" placeholder="选择日期" v-model="editForm" start-key="stime" end-key="etime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" @change="editSomeFields(editForm,'stime',editForm)"></mdp-date-range>
				</el-form-item>
			</el-form>
		</el-row>

		<el-row v-if="opType=='add'" >
			<span style="float:right;">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
			</span>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addXmTestPlan,editXmTestPlan,editSomeFieldsXmTestPlan } from '@/api/xm/core/xmTestPlan';
	import { mapGetters } from 'vuex'
	import XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';

import  MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm';//修改界面
	export default {
	    name:'xmTestPlanEdit',
	    components: {
			XmProjectSelect,MdpSelectUserXm,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTestPlan','visible','opType','selProject','xmTestCasedb'],

		watch: {
	      'xmTestPlan':function( xmTestPlan ) {
	        if(xmTestPlan){
	            this.editForm = {...xmTestPlan};
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
				dicts:{
					testPlanStatus:[],
					testPlanTcode:[],
					testType:[],

				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					name: [
						{ required: true, message: '测试计划名称不能为空', trigger: 'change' },
						{ min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'change' },//长度
					],
					projectId: [
						{ required: true, message: '项目不能为空', trigger: 'change' },
					],
				},
				editForm: {
					id:'',name:'',casedbId:'',casedbName:'',projectId:'',projectName:'',cuserid:'',cusername:'',ctime:'',stime:'',etime:'',status:'',tcode:'',totalCases:'',okCases:'',errCases:'',igCases:'',blCases:'',productId:'',productName:'',flowState:''
				},
				editFormInit: {
					id:'',name:'',casedbId:'',casedbName:'',projectId:'',projectName:'',cuserid:'',cusername:'',ctime:'',stime:'',etime:'',status:'',tcode:'',totalCases:'',okCases:'',errCases:'',igCases:'',blCases:'',productId:'',productName:'',flowState:''
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
			//新增、编辑提交XmTestPlan 测试计划父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmTestPlan
							if(this.currOpType=='edit'){
							    func=editXmTestPlan
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
			    if(this.xmTestPlan){
                    this.editForm = Object.assign({},this.xmTestPlan);
                }

                if(this.opType=='edit'){

                }else{
					if(this.$refs['xmProjectSelect']) this.$refs['xmProjectSelect'].clearSelect()
                }
                this.editFormBak={...this.editForm}
            },

            editSomeFields(row,fieldName,$event){
                if(this.opType=='add'){
                    return;
                }
                let params={};
                params['ids']=[row].map(i=>i.id)

				if(fieldName=='stime'){
					params[fieldName]=$event.stime
					params.etime=$event.etime
				}else if(fieldName=='cuserid'){
					params[fieldName]=$event.userid
					params.cusername=$event.username
				}else{
					params[fieldName]=$event
				}
                var func = editSomeFieldsXmTestPlan
                func(params).then(res=>{
                  let tips = res.data.tips;
                  if(tips.isOk){
                    this.editFormBak=[...this.editForm]
					this.$emit('edit-fields',params)
                  }else{
                    Object.assign(this.editForm,this.editFormBak)
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }
                }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
            },
			onPorjectConfirm(row){
				this.editForm.projectId=row.id
				this.editForm.projectName=row.name
				this.editForm.name=this.editForm.projectName+'-测试计划-V1.0'
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

<style scoped>

</style>
