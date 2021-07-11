<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="分类编号" prop="id">
					<el-input v-model="addForm.id" auto-complete="off"></el-input><el-tag>为空，则后台自动生成</el-tag>
				</el-form-item> 
				<el-form-item label="分类名称" prop="categoryName" required>
					<el-input v-model="addForm.categoryName" auto-complete="off"></el-input>
				</el-form-item>  
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="是否显示" prop="isShow"> 
					<el-switch
					  v-model="addForm.isShow" 
					  active-value="1"
					  inactive-value="0">
					</el-switch>
				</el-form-item> 
				<el-form-item>
					<el-col :span="4" :offset="16"> 
						<el-button @click.native="handleCancel">取消</el-button> 
					</el-col>
					<el-col :span="4"> 
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" >提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { addCategory } from '@/api/mdp/meta/category';
	import { mapGetters } from 'vuex' 
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['category','visible'],
		watch: {
	      'category':function( category ) {
	        this.addForm = category;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					categoryName: [
						{ required: true, message: '分类名称不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 元数据分类
				addForm: {
					id:'',categoryName:'',isShow:'1',remark:'',branchId:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交Category 元数据分类 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addCategory(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.load.add=false
							});
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'category-edit':CategoryEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.category);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>