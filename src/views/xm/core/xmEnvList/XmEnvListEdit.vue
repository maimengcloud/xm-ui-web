<template>
	<section class="page-container page-full-height padding border">
		<el-row> 
		<!--编辑界面 XmEnvList xm_env_list--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="内网ip地址" prop="ipAddress">
					<el-input v-model="editForm.ipAddress" placeholder="内网ip地址" ></el-input>
				</el-form-item> 
				<el-form-item label="内网访问端口" prop="port">
					<el-input type="number" min="0" v-model="editForm.port" placeholder="内网访问端口" ></el-input>
				</el-form-item> 
				<el-form-item label="访问用户编号" prop="accessUserid">
					<el-input v-model="editForm.accessUserid" placeholder="访问用户编号" ></el-input>
				</el-form-item> 
				<el-form-item label="访问密码" prop="accessPassword">
					<el-input v-model="editForm.accessPassword" placeholder="访问密码" show-password ></el-input>
				</el-form-item> 
				<el-form-item label="作用说明" prop="effect">
					<el-input v-model="editForm.effect" placeholder="作用说明" ></el-input>
				</el-form-item> 
				<el-form-item label="访问链接" prop="accessUrl">
					<el-input v-model="editForm.accessUrl" placeholder="访问链接" ></el-input>
				</el-form-item> 
				<el-form-item label="供应商" prop="supplier">
					<el-input v-model="editForm.supplier" placeholder="供应商" ></el-input>
				</el-form-item> 
				<el-form-item label="外网ip地址" prop="webIpAddress">
					<el-input v-model="editForm.webIpAddress" placeholder="外网ip地址" ></el-input>
				</el-form-item> 
				<el-form-item label="外网端口" prop="webPort">
					<el-input type="number" min="0" v-model="editForm.webPort" placeholder="外网端口" ></el-input>
				</el-form-item> 
				<el-form-item label="其它说明" prop="otherRemark">
					<el-input v-model="editForm.otherRemark" placeholder="其它说明" ></el-input>
				</el-form-item> 
				
				<el-form-item label="状态" prop="envState">
					<el-radio-group v-model="editForm.envState">
						<el-radio label="0">不可用</el-radio>
						<el-radio label="1">已启用</el-radio>
						<el-radio label="2">已过期</el-radio>
					</el-radio-group>
				</el-form-item> 
				<el-form-item label="有效日期开始" prop="startTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="有效日期结束" prop="endTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="费用" prop="feeAmount">
					<el-input type="number" min="0" v-model="editForm.feeAmount" placeholder="费用"></el-input>
				</el-form-item> 
				<el-form-item label="计费规则" prop="feeRule">
					<el-input v-model="editForm.feeRule" placeholder="计费规则" ></el-input>
				</el-form-item>
				<el-form-item label="备注说明" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注说明" ></el-input>
				</el-form-item>
				<el-form-item label="添加人员姓名" prop="createUsername">
					{{userInfo.username}}
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
	import { editXmEnvList } from '@/api/xm/core/xmEnvList';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmEnvList','visible'],
		watch: {
	      'xmEnvList':function( xmEnvList ) {
	        this.editForm = xmEnvList;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
					}
					else{
						this.$refs["editForm"].resetFields();
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
				//编辑界面数据  XmEnvList xm_env_list
				editForm: {
					id:'',remark:'',ipAddress:'',port:'',branchId:'',accessUserid:'',accessPassword:'',effect:'',accessUrl:'',supplier:'',webIpAddress:'',webPort:'',otherRemark:'',createUserid:'',createUsername:'',createTime:'',envState:'',startTime:'',endTime:'',feeAmount:'',feeRule:''
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
			//编辑提交XmEnvList xm_env_list父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmEnvList(params).then((res) => {
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
		    //在下面添加其它组件 'xm-env-list-edit':XmEnvListEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmEnvList);  
		}
	}

</script>

<style scoped>

</style>