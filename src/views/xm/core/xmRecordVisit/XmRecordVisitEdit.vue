<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmRecordVisit 重要页面访问记录--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="日志编号" prop="id">
					<el-input v-model="editForm.id" placeholder="日志编号" :maxlength="50" @change="editSomeFields(editForm,'id',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="操作人id" prop="operUserid">
					<el-input v-model="editForm.operUserid" placeholder="操作人id" :maxlength="50" @change="editSomeFields(editForm,'operUserid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="操作人名字" prop="operUsername">
					<el-input v-model="editForm.operUsername" placeholder="操作人名字" :maxlength="50" @change="editSomeFields(editForm,'operUsername',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="操作时间" prop="operTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.operTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代6" prop="objType">
					<el-input v-model="editForm.objType" placeholder="对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代6" :maxlength="50" @change="editSomeFields(editForm,'objType',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="操作的id" prop="action">
					<el-input v-model="editForm.action" placeholder="操作的id" :maxlength="50" @change="editSomeFields(editForm,'action',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="备注-只描述新旧值之间的变化" prop="remarks">
					<el-input v-model="editForm.remarks" placeholder="备注-只描述新旧值之间的变化" :maxlength="65535" @change="editSomeFields(editForm,'remarks',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="全局根踪号，用于跟踪日志" prop="gloNo">
					<el-input v-model="editForm.gloNo" placeholder="全局根踪号，用于跟踪日志" :maxlength="50" @change="editSomeFields(editForm,'gloNo',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构编号" :maxlength="50" @change="editSomeFields(editForm,'branchId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="ip地址" prop="ip">
					<el-input v-model="editForm.ip" placeholder="ip地址" :maxlength="255" @change="editSomeFields(editForm,'ip',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="业务主键编号" prop="bizId">
					<el-input v-model="editForm.bizId" placeholder="业务主键编号" :maxlength="50" @change="editSomeFields(editForm,'bizId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号" prop="pbizId">
					<el-input v-model="editForm.pbizId" placeholder="对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号" :maxlength="50" @change="editSomeFields(editForm,'pbizId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="对象名称" prop="bizName">
					<el-input v-model="editForm.bizName" placeholder="对象名称" :maxlength="255" @change="editSomeFields(editForm,'bizName',$event)"></el-input>
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
 	import { initDicts, addXmRecordVisit,editXmRecordVisit,editSomeFieldsXmRecordVisit } from '@/api/xm/core/xmRecordVisit';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmRecordVisitEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmRecordVisit','visible','opType'],

		watch: {
	      'xmRecordVisit':function( xmRecordVisit ) {
	        if(xmRecordVisit){
	            this.editForm = {...xmRecordVisit};
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
						//{ required: true, message: '日志编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					id:'',operUserid:'',operUsername:'',operTime:'',objType:'',action:'',remarks:'',gloNo:'',branchId:'',ip:'',bizId:'',pbizId:'',bizName:''
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
			//新增、编辑提交XmRecordVisit 重要页面访问记录父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmRecordVisit
							if(this.currOpType=='edit'){
							    func=editXmRecordVisit
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
			    if(this.xmRecordVisit){
                    this.editForm = Object.assign({},this.xmRecordVisit);
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
                var func = editSomeFieldsXmRecordVisit
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