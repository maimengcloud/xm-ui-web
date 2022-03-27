<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmTaskWorkload 工时登记表-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="员工编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="员工编号"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="username">
					<el-input v-model="editForm.username" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item label="创建日期" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="业务对象主键任务编号" prop="taskId">
					<el-input v-model="editForm.taskId" placeholder="业务对象主键任务编号"></el-input>
				</el-form-item>
				<el-form-item label="创建人编号" prop="cuserid">
					<el-input v-model="editForm.cuserid" placeholder="创建人编号"></el-input>
				</el-form-item>
				<el-form-item label="业务日期yyyy-MM-dd" prop="bizDate">
					<el-input v-model="editForm.bizDate" placeholder="业务日期yyyy-MM-dd"></el-input>
				</el-form-item>
				<el-form-item label="状态0-待确认，1-已确认，2-无效" prop="wstatus">
					<el-input v-model="editForm.wstatus" placeholder="状态0-待确认，1-已确认，2-无效"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注"></el-input>
				</el-form-item>
				<el-form-item label="任务类型-关联字典taskType" prop="ttype">
					<el-input v-model="editForm.ttype" placeholder="任务类型-关联字典taskType"></el-input>
				</el-form-item>
				<el-form-item label="主键" prop="id">
					<el-input-number v-model="editForm.id" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="结算单据编号" prop="sbillId">
					<el-input v-model="editForm.sbillId" placeholder="结算单据编号"></el-input>
				</el-form-item>
				<el-form-item label="结算提交时间" prop="stime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.stime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="结算状态0-无需结算，1-待结算2-已提交3-已通过4-已结算" prop="sstatus">
					<el-input v-model="editForm.sstatus" placeholder="结算状态0-无需结算，1-待结算2-已提交3-已通过4-已结算"></el-input>
				</el-form-item>
				<el-form-item label="工时对应金额" prop="amt">
					<el-input v-model="editForm.amt" placeholder="工时对应金额"></el-input>
				</el-form-item>
				<el-form-item label="结算金额" prop="samt">
					<el-input v-model="editForm.samt" placeholder="结算金额"></el-input>
				</el-form-item>
				<el-form-item label="工时，一个task_id可多次提交，小时" prop="workload">
					<el-input v-model="editForm.workload" placeholder="工时，一个task_id可多次提交，小时"></el-input>
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
		props:['xmTaskWorkload','visible','opType'],

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
					]
				},
				editForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:''
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
                    this.editForm = Object.assign({},this.xmTaskWorkload);
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
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style scoped>

</style>
