<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmTestPlan 测试计划--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="测试计划编号" prop="id">
					<el-input v-model="editForm.id" placeholder="测试计划编号" :maxlength="50" @change="editSomeFields(editForm,'id',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="计划名称" prop="name">
					<el-input v-model="editForm.name" placeholder="计划名称" :maxlength="255" @change="editSomeFields(editForm,'name',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="用例库编号" prop="casedbId">
					<el-input v-model="editForm.casedbId" placeholder="用例库编号" :maxlength="50" @change="editSomeFields(editForm,'casedbId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="用例库名称" prop="casedbName">
					<el-input v-model="editForm.casedbName" placeholder="用例库名称" :maxlength="255" @change="editSomeFields(editForm,'casedbName',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="项目编号" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="项目编号" :maxlength="50" @change="editSomeFields(editForm,'projectId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="项目名称" prop="projectName">
					<el-input v-model="editForm.projectName" placeholder="项目名称" :maxlength="255" @change="editSomeFields(editForm,'projectName',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="创建人编号" prop="cuserid">
					<el-input v-model="editForm.cuserid" placeholder="创建人编号" :maxlength="50" @change="editSomeFields(editForm,'cuserid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="创建人名称" prop="cusername">
					<el-input v-model="editForm.cusername" placeholder="创建人名称" :maxlength="255" @change="editSomeFields(editForm,'cusername',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="开始时间" prop="stime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.stime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束时间" prop="etime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.etime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="状态0-未开始，1-进行中，2已结束" prop="status">
					<el-input v-model="editForm.status" placeholder="状态0-未开始，1-进行中，2已结束" :maxlength="1" @change="editSomeFields(editForm,'status',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="测试结果0未通过，1已通过" prop="tcode">
					<el-input v-model="editForm.tcode" placeholder="测试结果0未通过，1已通过" :maxlength="1" @change="editSomeFields(editForm,'tcode',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="总用例数" prop="totalCases">
					<el-input-number v-model="editForm.totalCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="通过用例数" prop="okCases">
					<el-input-number v-model="editForm.okCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="失败用例数" prop="errCases">
					<el-input-number v-model="editForm.errCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="忽略用例数" prop="igCases">
					<el-input-number v-model="editForm.igCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="阻塞用例数" prop="blCases">
					<el-input-number v-model="editForm.blCases" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="产品编号" prop="productId">
					<el-input v-model="editForm.productId" placeholder="产品编号" :maxlength="50" @change="editSomeFields(editForm,'productId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="产品名称" prop="productName">
					<el-input v-model="editForm.productName" placeholder="产品名称" :maxlength="255" @change="editSomeFields(editForm,'productName',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="评审结果0-待评审，1-已评审通过，2-已拒绝" prop="flowState">
					<el-input v-model="editForm.flowState" placeholder="评审结果0-待评审，1-已评审通过，2-已拒绝" :maxlength="1" @change="editSomeFields(editForm,'flowState',$event)"></el-input>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row v-if="opType=='add'" class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addXmTestPlan,editXmTestPlan,editSomeFieldsXmTestPlan } from '@/api/xm/core/xmTestPlan';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmTestPlanEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTestPlan','visible','opType'],

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
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '测试计划编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
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
			    this.currOpType=this.opType
			    if(this.xmTestPlan){
                    this.editForm = Object.assign({},this.xmTestPlan);
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
                params['ids']=[row].map(i=>i.id)
                params[fieldName]=$event
                var func = editSomeFieldsXmTestPlan
                func(params).then(res=>{
                  let tips = res.data.tips;
                  if(tips.isOk){
                    this.editFormBak=[...this.editForm]
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