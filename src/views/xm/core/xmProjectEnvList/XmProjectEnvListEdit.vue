<template>
	<section class="page-container  padding border">
		<el-row> 
		<!--编辑界面 XmProjectEnvList xm_project_env_list--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="归属项目组名称" prop="projectName">
					{{editForm.projectName}}
				</el-form-item> 
				<el-form-item label="ip地址" prop="ipAddress">
					<el-input v-model="editForm.ipAddress" placeholder="ip地址"></el-input>
				</el-form-item> 
				<el-form-item label="访问端口" prop="port">
					<el-input v-model="editForm.port" type="number" min="0" placeholder="访问端口"></el-input>
				</el-form-item> 
				<el-form-item label="访问用户编号" prop="accessUserid">
					<el-input v-model="editForm.accessUserid" placeholder="访问用户编号"></el-input>
				</el-form-item> 
				<el-form-item label="访问密码" prop="accessPassword">
					<el-input v-model="editForm.accessPassword" placeholder="访问密码" show-password></el-input>
				</el-form-item> 
				<el-form-item label="作用说明" prop="effect">
					<el-input v-model="editForm.effect" placeholder="作用说明"></el-input>
				</el-form-item> 
				<el-form-item label="访问链接" prop="accessUrl">
					<el-input v-model="editForm.accessUrl" placeholder="访问链接"></el-input>
				</el-form-item> 
				<el-form-item label="外网ip地址" prop="webIpAddress">
					<el-input v-model="editForm.webIpAddress" placeholder="外网ip地址"></el-input>
				</el-form-item> 
				<el-form-item label="外网端口" prop="webPort">
					<el-input v-model="editForm.webPort" type="number" min="0" placeholder="外网端口"></el-input>
				</el-form-item> 
				<el-form-item label="其它说明" prop="otherRemark">
					<el-input type="textarea" :row="3" v-model="editForm.otherRemark" placeholder="其它说明"></el-input>
				</el-form-item>
				<el-form-item label="备注说明" prop="remark">
					<el-input type="textarea" :row="3" v-model="editForm.remark" placeholder="备注说明"></el-input>
				</el-form-item> 
				<el-form-item label="添加人员姓名" prop="createUsername">
					{{editForm.createUsername}}
				</el-form-item> 
				<el-form-item label="添加时间" prop="createTime">
					{{editForm.createTime}}
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
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editXmProjectEnvList } from '@/api/xm/core/xmProjectEnvList';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectEnvList','visible'],
		watch: {
	      'xmProjectEnvList':function( xmProjectEnvList ) {
	        this.editForm = xmProjectEnvList;
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
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmProjectEnvList xm_project_env_list
				editForm: {
					id:'',remark:'',ipAddress:'',port:'',projectId:'',projectName:'',accessUserid:'',accessPassword:'',effect:'',accessUrl:'',webIpAddress:'',webPort:'',otherRemark:'',createUserid:'',createUsername:'',createTime:''
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
			//编辑提交XmProjectEnvList xm_project_env_list父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmProjectEnvList(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-env-list-edit':XmProjectEnvListEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmProjectEnvList);  
		}
	}

</script>

<style scoped>

</style>