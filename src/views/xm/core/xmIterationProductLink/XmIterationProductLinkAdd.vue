<template>
	<section>
		<el-row>
			<!--新增界面 XmIterationProductLink 迭代表与产品表的关联关系，一般由迭代管理员将迭代挂接到产品表--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="迭代表主键" prop="iterationId">
					<el-input v-model="addForm.iterationId" placeholder="迭代表主键" ></el-input>
				</el-form-item> 
				<el-form-item label="产品表主键" prop="productId">
					<el-input v-model="addForm.productId" placeholder="产品表主键" ></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.ctime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="创建人编号" prop="cuserid">
					<el-input v-model="addForm.cuserid" placeholder="创建人编号" ></el-input>
				</el-form-item> 
				<el-form-item label="创建人姓名" prop="cusername">
					<el-input v-model="addForm.cusername" placeholder="创建人姓名" ></el-input>
				</el-form-item> 
				<el-form-item label="关联状态1关联0取消关联" prop="linkStatus">
					<el-input v-model="addForm.linkStatus" placeholder="关联状态1关联0取消关联" ></el-input>
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
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addXmIterationProductLink } from '@/api/xm/core/xmIterationProductLink';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['xmIterationProductLink','visible'],
		watch: {
	      'xmIterationProductLink':function( xmIterationProductLink ) {
	        this.addForm = xmIterationProductLink;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					iterationId: [
						//{ required: true, message: '迭代表主键不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 迭代表与产品表的关联关系，一般由迭代管理员将迭代挂接到产品表
				addForm: {
					iterationId:'',productId:'',ctime:'',cuserid:'',cusername:'',linkStatus:''
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
			//新增提交XmIterationProductLink 迭代表与产品表的关联关系，一般由迭代管理员将迭代挂接到产品表 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addXmIterationProductLink(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-iteration-product-link-edit':XmIterationProductLinkEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmIterationProductLink);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>