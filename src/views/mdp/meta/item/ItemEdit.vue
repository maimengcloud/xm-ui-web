<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="编号" prop="id">
					<el-tag>{{editForm.id}}</el-tag>
				</el-form-item> 
				<el-form-item label="代码" prop="itemCode">
					<el-input v-model="editForm.itemCode" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="名称" prop="itemName">
					<el-input v-model="editForm.itemName" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="长度" prop="itemSize">
					<el-input v-model="editForm.itemSize" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="类型" prop="itemType">
					<el-radio v-model="editForm.itemType" label="text">文本</el-radio>
				    <el-radio v-model="editForm.itemType" label="number">数字</el-radio>
				    <el-radio v-model="editForm.itemType" label="date">日期</el-radio>
				    <el-radio v-model="editForm.itemType" label="image">图片</el-radio>
				    <el-radio v-model="editForm.itemType" label="video">视频</el-radio>
				    <el-radio v-model="editForm.itemType" label="clog">图文</el-radio>
				    <el-radio v-model="editForm.itemType" label="blog">二进制</el-radio>
				</el-form-item> 
				<el-form-item>
					<el-col :span="4" :offset="16"> 
						<el-button @click.native="handleCancel">取消</el-button> 
					</el-col>
					<el-col :span="4"> 
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" >提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { editItem } from '@/api/mdp/meta/item';
	import { mapGetters } from 'vuex' 
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['item','visible'],
		watch: {
	      'item':function( item ) {
	        this.editForm = item;
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
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
					itemName: [
						{ required: true, message: '名称不能为空', trigger: 'blur' }
					],
					itemCode: [
						{ required: true, message: '代码不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 数据项定义
				editForm: {
					id:'',itemCode:'',itemName:'',remark:'',categoryId:'',itemSize:'',itemType:'',branchId:'',deptid:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交Item 数据项定义 父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editItem(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.load.edit=false
							});
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'item-edit':ItemEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.item);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>