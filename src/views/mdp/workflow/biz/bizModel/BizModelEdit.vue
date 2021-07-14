<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="业务名称" prop="bizName" required>
					<el-input v-model="editForm.bizName" placeholder="业务名称" ></el-input>
				</el-form-item> 
				<el-form-item label="业务编码" prop="bizKey" required>
					<el-input v-model="editForm.bizKey" placeholder="业务编码"></el-input>
				</el-form-item> 
				<el-form-item label="模型编码" prop="modelKey" required>
					
					<el-input v-if="disabledSelectModel!==true" v-model="editForm.modelKey" placeholder="模型编码" @click.native="showModelSelect" readonly><el-button slot="append" @click.native="showModelSelect">选模型</el-button>  </el-input>
					{{ disabledSelectModel===true? bizModel.modelKey:''}}
					
				</el-form-item> 
				<el-form-item label="模型名称" prop="modelName" required>
					<el-input v-model="editForm.modelName" placeholder="模型名称"></el-input>
				</el-form-item>  
				<el-form-item> 
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
		
			<!--新增 BizModel mdp_biz_model界面-->
			<el-dialog title="选中模型" :visible.sync="modelSelectVisible"  width="80%"  :close-on-click-modal="false" append-to-body>
				<procdef-list-for-start :is-select-model="modelSelectVisible" @row-click="onSelectModel"></procdef-list-for-start>
			</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editBizModel } from '@/api/mdp/workflow/biz/bizModel';
	import { mapGetters } from 'vuex'
	import ProcdefListForStart from '@/views/mdp/workflow/re/procdef/ProcdefListForStart';//修改界面
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['bizModel','visible','disabledSelectModel'],
		watch: {
	      'bizModel':function( bizModel ) {
	        this.editForm = bizModel;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
				  //从新打开页面时某些数据需要重新加载，可以在这里添加
				   this.editForm = this.bizModel;
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					],
					modelKey: [
						{ required: true, message: '模型编码不能为空', trigger: 'blur' }
					],
					modelName: [
						{ required: true, message: '模型名字不能为空', trigger: 'blur' }
					],
					bizKey: [
						{ required: true, message: '业务编码不能为空', trigger: 'blur' }
					],
					bizName: [
						{ required: true, message: '业务名称不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  BizModel mdp_biz_model
				editForm: {
					bizName:'',bizKey:'',modelKey:'',modelName:'',id:'',branchId:''
				},
				modelSelectVisible:false,
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交BizModel mdp_biz_model父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editBizModel(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			},
			showModelSelect:function(){
				this.modelSelectVisible=true;
			},
			onSelectModel(model){
				this.editForm.modelKey=model.key
				this.editForm.modelName=model.name
				this.modelSelectVisible=false;
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
			//在下面添加其它组件 'biz-model-edit':BizModelEdit
			ProcdefListForStart
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.bizModel);  
		}
	}

</script>

<style scoped>

</style>