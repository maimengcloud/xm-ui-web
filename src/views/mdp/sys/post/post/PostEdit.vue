<template>
	<section>
		<el-row class="app-container"> 
		<!--编辑界面 Post 岗位管理--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="岗位编号" prop="id">
					<el-input v-model="editForm.id" placeholder="岗位编号，不可修改" :readonly="true"></el-input>
				</el-form-item> 
				<el-form-item label="岗位名称" prop="postName">
					<el-input v-model="editForm.postName" placeholder="岗位名称"></el-input>
				</el-form-item> 

				<el-form-item label="岗位级别" prop="postLvl">
					<el-select v-model="editForm.postLvl" placeholder="请选择岗位级别">
					    <el-option
					      v-for="item in options.postLvl"
					      :key="item.optionValue"
					      :label="item.optionName"
					      :value="item.optionValue">
					    </el-option>
					  </el-select>
				</el-form-item> 
				<el-form-item label="岗位类型" prop="postType">
					  <el-select v-model="editForm.postType" placeholder="请选择岗位类型">
					    <el-option
					      v-for="item in options.postType"
					      :key="item.optionValue"
					      :label="item.optionName"
					      :value="item.optionValue">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注"></el-input>
				</el-form-item> 
				<el-form-item> 
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editPost } from '@/api/mdp/sys/post/post';
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
	        this.editForm = post;
	        this.editForm.postLvl=this.editForm.postLvl+'';
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					postName: [
						{ required: true, message: '岗位名称', trigger: 'blur' }
					],
					postLvl: [
						{ required: true, message: '岗位级别不能为空', trigger: 'blur' }
					],
					postType: [
						{ required: true, message: '岗位类型不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  Post 岗位管理
				editForm: {
					id:'',postName:'',remark:'',branchId:'',cdate:'',postLvl:'',postType:''
				}
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
			//编辑提交Post 岗位管理父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editPost(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
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
			this.editForm=Object.assign(this.editForm, this.post);  
			this.editForm.postLvl=this.editForm.postLvl+'';
			listOption([{categoryId:'all',itemCode:'postLvl'},{categoryId:'all',itemCode:'postType'}]).then(res=>{
				this.options=res.data.data
			})
		}
	}

</script>

<style scoped>

</style>