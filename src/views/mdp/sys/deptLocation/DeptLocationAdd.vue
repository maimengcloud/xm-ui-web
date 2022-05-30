<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 DeptLocation sys_dept_location--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="部门地址编号" prop="deptid">
					<el-input v-model="addForm.deptid" placeholder="部门地址编号" ></el-input>
				</el-form-item> 
				<el-form-item label="经度" prop="longitude">
					<el-input v-model="addForm.longitude" placeholder="经度"></el-input>
				</el-form-item> 
				<el-form-item label="纬度" prop="latitude">
					<el-input v-model="addForm.latitude" placeholder="纬度"></el-input>
				</el-form-item> 
				<el-form-item label="地址" prop="address">
					<el-input v-model="addForm.address" placeholder="地址" ></el-input>
				</el-form-item> 
				<el-form-item label="省" prop="province">
					<el-input v-model="addForm.province" placeholder="省" ></el-input>
				</el-form-item> 
				<el-form-item label="市" prop="city">
					<el-input v-model="addForm.city" placeholder="市" ></el-input>
				</el-form-item> 
				<el-form-item label="区" prop="district">
					<el-input v-model="addForm.district" placeholder="区" ></el-input>
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
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { mapGetters } from 'vuex'
	import { addDeptLocation } from '@/api/mdp/sys/deptLocation';
	
	export default {
		props:['deptLocation','visible'],
		watch: {
	      'deptLocation':function( deptLocation ) {
	        this.addForm = deptLocation;
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
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					deptid: [
						//{ required: true, message: '部门地址编号不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 sys_dept_location
				addForm: {
					deptid:'',longitude:'',latitude:'',address:'',province:'',city:'',district:''
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
			//新增提交DeptLocation sys_dept_location 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addDeptLocation(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => this.load.add=false);
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
			this.addForm=Object.assign(this.addForm, this.deptLocation);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>