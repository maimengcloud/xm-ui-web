<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<!--新增界面 XmProjectEnvList xm_project_env_list--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="归属项目组名称" prop="projectName">
					{{currProject.name}}
				</el-form-item> 
				<el-form-item label="ip地址" prop="ipAddress">
					<el-input v-model="addForm.ipAddress" placeholder="ip地址" ></el-input>
				</el-form-item> 
				<el-form-item label="访问端口" prop="port">
					<el-input v-model="addForm.port" type="number" min="0" placeholder="访问端口" ></el-input>
				</el-form-item> 
				<el-form-item label="访问用户编号" prop="accessUserid">
					<el-input v-model="addForm.accessUserid" placeholder="访问用户编号" ></el-input>
				</el-form-item> 
				<el-form-item label="访问密码" prop="accessPassword">
					<el-input v-model="addForm.accessPassword" placeholder="访问密码" show-password ></el-input>
				</el-form-item> 
				<el-form-item label="作用说明" prop="effect">
					<el-input v-model="addForm.effect" placeholder="作用说明" ></el-input>
				</el-form-item> 
				<el-form-item label="访问链接" prop="accessUrl">
					<el-input v-model="addForm.accessUrl" placeholder="访问链接" ></el-input>
				</el-form-item> 
				<el-form-item label="外网ip地址" prop="webIpAddress">
					<el-input v-model="addForm.webIpAddress" placeholder="外网ip地址" ></el-input>
				</el-form-item> 
				<el-form-item label="外网端口" prop="webPort">
					<el-input type="number" min="0" v-model="addForm.webPort" placeholder="外网端口" ></el-input>
				</el-form-item> 
				<el-form-item label="其它说明" prop="otherRemark">
					<el-input type="textarea" :row="3" v-model="addForm.otherRemark" placehdlder="其它说明" ></el-input>
				</el-form-item> 
				<el-form-item label="备注说明" prop="remark">
					<el-input type="textarea" :row="3" v-model="addForm.remark" placeholder="备注说明" ></el-input>
				</el-form-item> 
				<el-form-item label="添加人员姓名" prop="createUsername">
					{{userInfo.username}}
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
	import { addXmProjectEnvList } from '@/api/xm/core/xmProjectEnvList';
	import { mapGetters } from 'vuex'
	
	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectEnvList','visible',"currProject"],
		watch: {
	      'xmProjectEnvList':function( xmProjectEnvList ) {
	        this.addForm = xmProjectEnvList;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
						this.$refs["addForm"].resetFields();
						this.addForm.projectId = this.currProject.id;
						this.addForm.projectName = this.currProject.name;
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
				//新增界面数据 xm_project_env_list
				addForm: {
					id:'',remark:'',ipAddress:'',port:'',projectId:'',projectName:'',accessUserid:'',accessPassword:'',effect:'',accessUrl:'',webIpAddress:'',webPort:'',otherRemark:'',createUserid:'',createUsername:'',createTime:''
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
			//新增提交XmProjectEnvList xm_project_env_list 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true;
							this.addForm.projectId = this.currProject.id;
							this.addForm.projectName = this.currProject.name;
							let params = Object.assign({}, this.addForm); 
							addXmProjectEnvList(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
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
			this.addForm=Object.assign(this.addForm, this.xmProjectEnvList);  
			this.addForm.projectId = this.currProject.id;
			this.addForm.projectName = this.currProject.name;
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>