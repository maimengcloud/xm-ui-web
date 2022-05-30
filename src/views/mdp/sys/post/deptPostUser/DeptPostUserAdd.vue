<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 DeptPostUser 部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="岗位编号" prop="postId">
					<el-input v-model="addForm.postId" placeholder="岗位编号" ></el-input>
				</el-form-item> 
				<el-form-item label="部门编号" prop="deptid">
					<el-input v-model="addForm.deptid" placeholder="部门编号" ></el-input>
				</el-form-item> 
				<el-form-item label="用户编号" prop="userid">
					<el-input v-model="addForm.userid" placeholder="用户编号" ></el-input>
				</el-form-item> 
				<el-form-item label="开始任职时间" prop="startDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.startDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束任职时间" prop="endDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.endDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="实际结束任职时间" prop="actEndDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.actEndDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="状态0-无效1-有效" prop="enabled">
					<el-input v-model="addForm.enabled" placeholder="状态0-无效1-有效" ></el-input>
				</el-form-item> 
				<el-form-item label="最后更新时间" prop="lastDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.lastDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
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
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addDeptPostUser } from '@/api/mdp/sys/post/deptPostUser';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['deptPostUser','visible'],
		watch: {
	      'deptPostUser':function( deptPostUser ) {
	        this.addForm = deptPostUser;
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
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）
				addForm: {
					id:'',postId:'',deptid:'',userid:'',startDate:'',endDate:'',actEndDate:'',enabled:'',lastDate:''
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
			//新增提交DeptPostUser 部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余） 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addDeptPostUser(params).then((res) => {
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
		    //在下面添加其它组件 'dept-post-user-edit':DeptPostUserEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.deptPostUser);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>