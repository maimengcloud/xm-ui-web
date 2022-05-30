<template>
	<section>
		<el-row class="app-container"> 
		<!--编辑界面 DeptLocation sys_dept_location--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="部门地址编号" prop="deptid">
					<el-input v-model="editForm.deptid" placeholder="部门地址编号"></el-input>
				</el-form-item> 
				<el-form-item label="经度" prop="longitude">
					<el-input v-model="editForm.longitude" placeholder="经度"></el-input>
				</el-form-item> 
				<el-form-item label="纬度" prop="latitude">
					<el-input v-model="editForm.latitude" placeholder="纬度"></el-input>
				</el-form-item> 
				<el-form-item label="地址" prop="address">
					<el-input v-model="editForm.address" placeholder="地址"></el-input>
				</el-form-item> 
				<el-form-item label="省" prop="province">
					<el-input v-model="editForm.province" placeholder="省"></el-input>
				</el-form-item> 
				<el-form-item label="市" prop="city">
					<el-input v-model="editForm.city" placeholder="市"></el-input>
				</el-form-item> 
				<el-form-item label="区" prop="district">
					<el-input v-model="editForm.district" placeholder="区"></el-input>
				</el-form-item> 
				<el-form-item> 
					<el-col :span="4" :offset="16"> 
						<el-button @click.native="handleCancel">取消</el-button> 
					</el-col>
					<el-col :span="4"> 
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editDeptLocation } from '@/api/mdp/sys/deptLocation';
	import { mapGetters } from 'vuex'
	
	export default {
		props:['deptLocation','visible'],
		watch: {
	      'deptLocation':function( deptLocation ) {
	        this.editForm = deptLocation;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					deptid: [
						//{ required: true, message: '部门地址编号不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  DeptLocation sys_dept_location
				editForm: {
					deptid:'',longitude:'',latitude:'',address:'',province:'',city:'',district:''
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
			//编辑提交DeptLocation sys_dept_location父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editDeptLocation(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() =>this.load.edit=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'dept-location-edit':DeptLocationEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.deptLocation);  
		}
	}

</script>

<style scoped>

</style>