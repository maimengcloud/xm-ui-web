<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="业务名称" prop="bizName">
					<el-input v-model="addForm.bizName" placeholder="业务名称" ></el-input>
				</el-form-item> 
				<el-form-item label="业务编码" prop="bizKey">
					<el-input v-model="addForm.bizKey" placeholder="业务编码" ></el-input>
				</el-form-item> 
				<el-form-item label="模型编码" prop="modelKey">
					<el-input v-if="disabledSelectModel!==true" v-model="addForm.modelKey" placeholder="模型编码" @click.native="showModelSelect" readonly><el-button slot="append" @click.native="showModelSelect">选模型</el-button>  </el-input>
					{{ disabledSelectModel===true? bizModel.modelKey:''}}
					
				</el-form-item> 
				<el-form-item label="模型名称" prop="modelName">
					<el-input v-model="addForm.modelName" placeholder="模型名称" ></el-input> 
				</el-form-item>  
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
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
	import { addBizModel } from '@/api/mdp/workflow/biz/bizModel';
	import { mapGetters } from 'vuex'
	import ProcdefListForStart from '@/views/mdp/workflow/re/procdef/ProcdefListForStart';//修改界面
	
	export default { 
		name:'BizModelAdd',
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['bizModel','visible','disabledSelectModel'],
		watch: {
	      'bizModel':function( bizModel ) {
	        this.addForm = bizModel;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
				  this.addForm = this.bizModel;
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
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
				//新增界面数据 mdp_biz_model
				addForm: {
					bizName:'',bizKey:'',modelKey:'',modelName:'',id:'',branchId:''
				},
				modelSelectVisible:false,
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				//this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交BizModel mdp_biz_model 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							params.branchId=this.userInfo.branchId;
							addBizModel(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			showModelSelect:function(){
				this.modelSelectVisible=true;
			},
			onSelectModel(model){
				this.addForm.modelKey=model.key
				this.addForm.modelName=model.name
				this.modelSelectVisible=false;
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {
			'procdef-list-for-start':ProcdefListForStart,
		    //在下面添加其它组件 'biz-model-edit':BizModelEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.bizModel);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>