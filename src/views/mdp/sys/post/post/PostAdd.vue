<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 Post 岗位管理--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="岗位编码" prop="id">
					<el-input v-model="addForm.id" placeholder="岗位编码，为空则后台自动生成" ></el-input>
				</el-form-item> 
				<el-form-item label="岗位名称" prop="postName">
					<el-input v-model="addForm.postName" placeholder="岗位名称" ></el-input>
				</el-form-item> 

				<el-form-item label="岗位级别" prop="postLvl">
					<el-select v-model="addForm.postLvl" placeholder="请选择岗位级别">
					    <el-option
					      v-for="item in options.postLvl"
					      :key="item.optionValue"
					      :label="item.optionName"
					      :value="item.optionValue">
					    </el-option>
					  </el-select>
				</el-form-item> 
				<el-form-item label="岗位类型" prop="postType">
					  <el-select v-model="addForm.postType" placeholder="请选择岗位类型">
					    <el-option
					      v-for="item in options.postType"
					      :key="item.optionValue"
					      :label="item.optionName"
					      :value="item.optionValue">
					    </el-option>
					  </el-select>
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
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addPost } from '@/api/mdp/sys/post/post';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['post','visible'],
		watch: {
	      'post':function( post ) {
	        this.addForm = post;
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
					postName: [
						{ required: true, message: '岗位名称不能为空', trigger: 'blur' }
					],
					postLvl: [
						{ required: true, message: '岗位级别不能为空', trigger: 'blur' }
					],
					postType: [
						{ required: true, message: '岗位类型不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 岗位管理
				addForm: {
					id:'',postName:'',remark:'',branchId:'',cdate:'',postLvl:'',postType:''
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
			//新增提交Post 岗位管理 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							params.branchId=this.userInfo.branchId
							addPost(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'post-edit':PostEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.post);  
			/**在下面写其它函数***/
			listOption([{categoryId:'all',itemCode:'postLvl'},{categoryId:'all',itemCode:'postType'}]).then(res=>{
				this.options=res.data.data
			})
			
		}//end mounted
	}

</script>

<style scoped>

</style>