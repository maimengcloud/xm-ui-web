<template>
	<section>
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main"  ref="table">
		<!--编辑界面 XmTaskWorkload 工时登记表-->
			<el-form :model="editForm" label-width="100px"  :rules="editFormRules" ref="editFormRef">
				<el-row>
					<el-col :span="6">
						<el-form-item label="预估工时" prop="budgetWorkload">
							 <el-input style="width:85%;"  v-model="editForm.budgetWorkload" placeholder="预估工时"></el-input> &nbsp;h 
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="已登工时" prop="actWorkload">
							<el-input style="width:85%;"  v-model="editForm.actWorkload" placeholder="已登记工时"></el-input> &nbsp;h
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="剩余工时" prop="rworkload">
							<el-input style="width:85%;"  v-model="editForm.rworkload" placeholder="剩余工时"></el-input>  &nbsp;h
						</el-form-item> 
					</el-col> 
					<el-col :span="6">
						<el-form-item label="工时进度" prop="rate">
							<el-input v-model="editForm.rate" placeholder="工时进度"></el-input>
						</el-form-item> 
					</el-col>
				</el-row>
			</el-form>
		</el-row>
		<el-row>
			<xm-task-workload-list :xm-task="xmTask"></xm-task-workload-list>
		</el-row> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { addXmTaskWorkload,editXmTaskWorkload } from '@/api/xm/core/xmTaskWorkload';
	import { mapGetters } from 'vuex'
	import XmTaskWorkloadList from './XmTaskWorkloadList';

	export default {
	    name:'xmTaskWorkloadEdit',
	    components: {
			XmTaskWorkloadList,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTask','visible','opType'],

		watch: {
	      
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
					]
				},//新增界面数据 xm_task
				editForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'3',sortLevel:'0',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',taskOut:'0',
					rate:0,budgetCost:'',budgetWorkload:'',actCost:'',actWorkload:'',taskState:'0',taskClass:'0',toTaskCenter:'0',actStartTime:'',actEndTime:'',taskType:'4',planType:'w2',settleSchemel:'1',ntype:'0',childrenCnt:0
  
				},
                maxTableHeight:300,
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
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
                    this.editForm = Object.assign({},this.xmTask);
                }

                if(this.opType=='edit'){

                }else{

                }
            },

		},//end method
		mounted() {
		    this.$nextTick(() => {
                //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
                this.initData() 
            });
		}
	}

</script>

<style scoped>

</style>
