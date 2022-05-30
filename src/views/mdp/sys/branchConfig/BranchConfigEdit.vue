<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 BranchConfig sys_branch_config--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="购买用户数" prop="musers">
					<el-input-number v-model="editForm.musers" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="机构等级" prop="lvl">
					<el-input v-model="editForm.lvl" placeholder="机构等级" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="可投标次数-每月恢复为套餐数量，包含公司账户次数+个人以组织名义接单的次数，以上每接一单扣减此处" prop="mbidNum">
					<el-input-number v-model="editForm.mbidNum" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="开始日期yyyy-MM-dd" prop="startTime">
					<el-input v-model="editForm.startTime" placeholder="开始日期yyyy-MM-dd" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="结束日期yyyy-MM-dd" prop="endTime">
					<el-input v-model="editForm.endTime" placeholder="结束日期yyyy-MM-dd" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="服务费率，15=15%" prop="sfeeRate">
					<el-input-number v-model="editForm.sfeeRate" :min="0" :max="200"></el-input-number>
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
 	import { initDicts, addBranchConfig,editBranchConfig } from '@/api/mdp/sys/branchConfig';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'branchConfigEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['branchConfig','visible','opType'],

		watch: {
	      'branchConfig':function( branchConfig ) {
	        if(branchConfig){
	            this.editForm = {...branchConfig};
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
					branchId: [
						//{ required: true, message: '机构编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					branchId:'',musers:'',lvl:'',mbidNum:'',startTime:'',endTime:'',sfeeRate:''
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
			//新增、编辑提交BranchConfig sys_branch_config父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addBranchConfig
							if(this.currOpType=='edit'){
							    func=editBranchConfig
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
			    if(this.branchConfig){
                    this.editForm = Object.assign({},this.branchConfig);
                }

                if(this.opType=='edit'){

                }else{

                }
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