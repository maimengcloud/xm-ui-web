<template>
	<section class="page-container  padding border">
		<el-row>
			<!--新增界面 XmProductTemplate 产品表--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="产品编号" prop="id">
					<el-input v-model="addForm.id" placeholder="产品编号" ></el-input>
				</el-form-item> 
				<el-form-item label="产品名称" prop="productName">
					<el-input v-model="addForm.productName" placeholder="产品名称" ></el-input>
				</el-form-item>  
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注" ></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询 
	import { addXmProductTemplate } from '@/api/xm/core/xmProductTemplate';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProductTemplate','visible'],
		watch: {
	      'xmProductTemplate':function( xmProductTemplate ) {
	        this.addForm = xmProductTemplate;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						{ required: true, message: '产品编号不能为空', trigger: 'blur' }
					],
					
					productName: [
						{ required: true, message: '产品名称不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 产品表
				addForm: {
					id:'',productName:'',branchId:'',remark:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmProductTemplate 产品表 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							params.branchId=this.userInfo.branchId
							params.templateId=params.id
							addXmProductTemplate(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-product-edit':XmProductTemplateEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmProductTemplate);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>