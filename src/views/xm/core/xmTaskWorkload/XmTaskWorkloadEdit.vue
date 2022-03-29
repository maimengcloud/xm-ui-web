<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" ref="table">
		<!--编辑界面 XmTaskWorkload 工时登记表-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-row>
					<el-col :span="8">
						<el-form-item label="预估工时" prop="budgetWorkload">
							{{xmTask.budgetWorkload}}&nbsp;&nbsp;h
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="已登工时" prop="actWorkload">
							{{xmTask.actWorkload}}&nbsp;&nbsp;h
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="工时进度" prop="rate">
							{{xmTask.rate}} %
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>

					<el-col :span="12">
						<el-form-item label="工作时长" prop="workload">
							<el-input type="number" style="width:80%;" v-model="editForm.workload" placeholder="工作时长"></el-input> &nbsp;&nbsp;h
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="剩余工时" prop="rworkload">
							<el-input type="number"  style="width:80%;" v-model="editForm.rworkload" placeholder="剩余工时"></el-input>&nbsp;&nbsp;h
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>

					<el-col :span="12">
						<el-form-item label="业务日期" prop="bizDate">
							<el-date-picker style="width:80%;" v-model="editForm.bizDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd"  placeholder="业务日期"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="任务类型" prop="ttype">
							<el-select v-model="editForm.ttype">
								<el-option v-for="i in this.dicts.taskType" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="工作说明" prop="remark">
 					<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20}" v-model="editForm.remark" placeholder="工作说明，如果报工大于8小时，请填写说明" ></el-input>
				</el-form-item>
			</el-form>
		</el-row>
		<el-row   class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { addXmTaskWorkload,editXmTaskWorkload } from '@/api/xm/core/xmTaskWorkload';
	import { mapGetters } from 'vuex'

	export default {
	    name:'xmTaskWorkloadEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTask','xmTaskWorkload','visible','opType'],

		watch: {
	      'xmTaskWorkload':function( xmTaskWorkload ) {
	        if(xmTaskWorkload){
	            this.editForm = xmTaskWorkload;
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
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					],
					bizDate:[
						{ required: true, message: '业务日期不能为空', trigger: 'change' }
					],
					workload:[
						{ required: true, message: '上班时长不能为空', trigger: 'change' }
					]
				},
				editForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:''
				},
                maxTableHeight:300,
				dicts:{
					taskType:[],
				}
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增、编辑提交XmTaskWorkload 工时登记表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmTaskWorkload
							if(this.currOpType=='edit'){
							    func=editXmTaskWorkload
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
                                this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$notify({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.xmTaskWorkload){
                    this.editForm = Object.assign({},this.xmTaskWorkload);
                }

                if(this.opType=='edit'){

                }else{
					if(this.xmTask){
						this.editForm.taskId=this.xmTask.id
						this.editForm.ttype=this.xmTask.taskType
					}
					this.editForm.bizDate=util.getDate();
					if(!this.editForm.ttype){
						this.editForm.ttype="4"
					}
                }
            },

		},//end method
		mounted() {
		    this.$nextTick(() => {
				initSimpleDicts('all',[ 'taskType' ]).then(res=>{
					this.dicts=res.data.data;
				})
                this.initData()
            });
		}
	}

</script>

<style scoped>

</style>
