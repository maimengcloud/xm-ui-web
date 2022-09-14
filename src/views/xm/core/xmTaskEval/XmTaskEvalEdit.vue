<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmTaskEval xm_task_eval--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="评价" prop="id">
					<el-input v-model="editForm.id" placeholder="评价" :maxlength="50" @change="editSomeFields(editForm,'id',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="评价类型1-雇主对服务商的评价，2-服务商对雇主的评价，3-组长对组员的评价" prop="type">
					<el-input v-model="editForm.type" placeholder="评价类型1-雇主对服务商的评价，2-服务商对雇主的评价，3-组长对组员的评价" :maxlength="1" @change="editSomeFields(editForm,'type',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="工作速度0-5分" prop="wspeed">
					<el-input-number v-model="editForm.wspeed" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="工作态度0-5分" prop="wattit">
					<el-input-number v-model="editForm.wattit" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="工作质量0-5分" prop="wquality">
					<el-input-number v-model="editForm.wquality" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="总体评价0-5分" prop="totalStar">
					<el-input-number v-model="editForm.totalStar" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="评价内容" prop="remark">
					<el-input v-model="editForm.remark" placeholder="评价内容" :maxlength="255" @change="editSomeFields(editForm,'remark',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="评价人编号" prop="evalUserid">
					<el-input v-model="editForm.evalUserid" placeholder="评价人编号" :maxlength="50" @change="editSomeFields(editForm,'evalUserid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="评价人姓名" prop="evalUsername">
					<el-input v-model="editForm.evalUsername" placeholder="评价人姓名" :maxlength="255" @change="editSomeFields(editForm,'evalUsername',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="被评价人编号" prop="toUserid">
					<el-input v-model="editForm.toUserid" placeholder="被评价人编号" :maxlength="50" @change="editSomeFields(editForm,'toUserid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="被评价人姓名" prop="toUsername">
					<el-input v-model="editForm.toUsername" placeholder="被评价人姓名" :maxlength="255" @change="editSomeFields(editForm,'toUsername',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="评价人归属机构" prop="evalBranchId">
					<el-input v-model="editForm.evalBranchId" placeholder="评价人归属机构" :maxlength="50" @change="editSomeFields(editForm,'evalBranchId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="被评价人归属机构号" prop="toBranchId">
					<el-input v-model="editForm.toBranchId" placeholder="被评价人归属机构号" :maxlength="50" @change="editSomeFields(editForm,'toBranchId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="任务编号" prop="taskId">
					<el-input v-model="editForm.taskId" placeholder="任务编号" :maxlength="50" @change="editSomeFields(editForm,'taskId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="评价时间" prop="evalTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.evalTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="付款及时度0-5分" prop="paySpeed">
					<el-input-number v-model="editForm.paySpeed" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="合作愉快度0-5分" prop="coopHappy">
					<el-input-number v-model="editForm.coopHappy" :min="0" :max="200"></el-input-number>
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
 	import { initDicts, addXmTaskEval,editXmTaskEval,editSomeFieldsXmTaskEval } from '@/api/xm/core/xmTaskEval';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmTaskEvalEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTaskEval','visible','opType'],

		watch: {
	      'xmTaskEval':function( xmTaskEval ) {
	        if(xmTaskEval){
	            this.editForm = {...xmTaskEval};
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
						//{ required: true, message: '评价不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					id:'',type:'',wspeed:'',wattit:'',wquality:'',totalStar:'',remark:'',evalUserid:'',evalUsername:'',toUserid:'',toUsername:'',evalBranchId:'',toBranchId:'',taskId:'',evalTime:'',paySpeed:'',coopHappy:''
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
			//新增、编辑提交XmTaskEval xm_task_eval父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmTaskEval
							if(this.currOpType=='edit'){
							    func=editXmTaskEval
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
			    if(this.xmTaskEval){
                    this.editForm = Object.assign({},this.xmTaskEval);
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
                var func = editSomeFieldsXmTaskEval
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