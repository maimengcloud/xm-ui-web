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
			 
			<!--新增界面 Region sys_region--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="id" prop="id">
					<el-input v-model="addForm.id" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="parent_id" prop="parentId">
					<el-input v-model="addForm.parentId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="name" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="type" prop="type">
					<el-input v-model="addForm.type" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="agency_id" prop="agencyId">
					<el-input v-model="addForm.agencyId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" >
						<el-col :span="4" :offset="16"> 
							<el-button @click.native="handleCancel">取消</el-button> 
						</el-col>
						<el-col :span="4"> 
							<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>  
						</el-col>
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import { addRegion } from '../../../../api/mdp/sys/region';
	
	export default {
		props:['region','visible'],
		watch: {
	      'region':function( region ) {
	        this.addForm = region;
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
				addLoading: false,
				addFormRules: {
					id: [
						//{ required: true, message: 'id', trigger: 'blur' }
					]
				},
				//新增界面数据 sys_region
				addForm: {
					id:'',parentId:'',name:'',type:'',agencyId:''
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
			//新增提交Region sys_region 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true; 
							let params = Object.assign({}, this.addForm); 
							addRegion(params).then((res) => {
								this.addLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.addLoading = false;
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
			this.addForm=Object.assign(this.addForm, this.region);
			
		}//end mounted
	}

</script>

<style scoped>

</style>