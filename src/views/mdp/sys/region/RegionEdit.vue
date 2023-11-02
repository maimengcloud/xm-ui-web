<template>
	<section>
		<el-row>
		<!--工具条1-->  
		<!--如果有更多工具条,放开此注释
		<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;">
			<el-col :span="4">
			</el-col>
		</el-col>
		-->
		 
		<!--编辑界面 Region sys_region--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="id" prop="id">
					<el-input v-model="editForm.id" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="parent_id" prop="parentId">
					<el-input v-model="editForm.parentId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="name" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="type" prop="type">
					<el-input v-model="editForm.type" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="agency_id" prop="agencyId">
					<el-input v-model="editForm.agencyId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" >
						<el-col :span="4" :offset="16"> 
							<el-button @click.native="handleCancel">取消</el-button> 
						</el-col>
						<el-col :span="4"> 
							<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>  
						</el-col>
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import { editRegion } from '../../../../api/mdp/sys/region';
	
	export default {
		props:['region','visible'],
		watch: {
	      'region':function( region ) {
	        this.editForm = region;
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
				editLoading: false,
				editFormRules: {
					id: [
						//{ required: true, message: 'id', trigger: 'blur' }
					]
				},
				//编辑界面数据  Region sys_region
				editForm: {
					id:'',parentId:'',name:'',type:'',agencyId:''
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
			//编辑提交Region sys_region父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true; 
							let params = Object.assign({}, this.editForm); 
							editRegion(params).then((res) => {
								this.editLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.editLoading = false;
							});
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'region-edit':RegionEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.region);
		}
	}

</script>

<style scoped>

</style>