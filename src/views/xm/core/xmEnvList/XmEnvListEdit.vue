<template>
	<section class="padding border">
		<el-row>
		<!--编辑界面 XmEnvList xm_env_list-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm" label-position="left">
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name" placeholder="名称" ></el-input>
					<el-row class="label-font-color"> <span v-if="editForm.projectName">归属项目：{{ editForm.projectName}} <el-divider direction="vertical"></el-divider></span>
					</el-row>
				</el-form-item>

				<el-form-item label="访问链接" prop="accessUrl">
					<el-input v-model="editForm.accessUrl" placeholder="访问链接" ></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="8">
						<el-form-item label="访问用户编号" prop="accessUserid">
							<el-input v-model="editForm.accessUserid" placeholder="访问用户编号" style="width:99%;"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="访问密码" prop="accessPassword">
							<el-input v-model="editForm.accessPassword" placeholder="访问密码" show-password style="width:99%;"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="内网ip地址" prop="ipAddress">
							<el-input v-model="editForm.ipAddress" style="width:99%;" placeholder="内网ip地址" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label=" 访问端口" prop="port">
							<el-input type="number" min="0"  v-model="editForm.port" placeholder="内网访问端口" style="width:99%;"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="外网ip地址" prop="webIpAddress">
							<el-input v-model="editForm.webIpAddress" placeholder="外网ip地址" style="width:99%;"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="外网端口" prop="webPort">
							<el-input type="number" min="0"  v-model="editForm.webPort" placeholder="外网端口" style="width:99%;"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="8">
							<el-form-item label="状态" prop="envState">
								<el-select v-model="editForm.envState">
									<el-option  value="0" label="不可用"></el-option>
									<el-option  value="1" label="已启用"></el-option>
									<el-option  value="2" label="已过期"></el-option>
								</el-select>
							</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="浏览权限" prop="readQx">
							<el-select v-model="editForm.readQx">
								<el-option v-for="(item,index) in dicts['readQx']" :key="index" :value="item.id" :label="item.name"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
					<el-form-item label="修改权限" prop="writeQx">
						<el-select v-model="editForm.writeQx">
							<el-option v-for="(item,index) in dicts['writeQx']" :key="index" :value="item.id" :label="item.name"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				</el-row>
				<el-form-item label="备注说明" prop="remark">
					<el-input type="textarea" rows="4" v-model="editForm.remark" placeholder="备注说明" ></el-input>
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

	import { initDicts,editXmEnvList } from '@/api/xm/core/xmEnvList';
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
				dicts:{readQx:[],wrightQx:[]},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					name: [
						{ required: true, message: '名称不能为空', trigger: 'change' }
					]
				},
				//编辑界面数据  XmEnvList xm_env_list
				editForm: {
					id:'',name:'',remark:'',ipAddress:'',port:'',branchId:'',accessUserid:'',accessPassword:'',effect:'',accessUrl:'',supplier:'',webIpAddress:'',webPort:'',otherRemark:'',createUserid:'',createUsername:'',createTime:'',envState:'1',startTime:'',endTime:'',feeAmount:'',feeRule:'',readQx:'9',writeQx:'9',projectId:'',projectName:''
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
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
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
			initDicts(this),
			this.editForm=Object.assign(this.editForm, this.xmEnvList);
		}
	}

</script>

<style scoped>

</style>
