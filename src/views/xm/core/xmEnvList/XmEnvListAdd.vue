<template>
	<section class="padding">
		<el-row>
			<!--新增界面 XmEnvList xm_env_list-->
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm" label-position="left">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.name" placeholder="名称" ></el-input>
					<el-row class="label-font-color"> <span v-if="addForm.projectName">归属项目：{{ addForm.projectName}} <el-divider direction="vertical"></el-divider></span>

						 <xm-project-select show-style="tag" style="display:inline;" v-if="!xmProject||!xmProject.id" :auto-select="false"   :link-product-id="xmProduct?xmProduct.id:null"  @change2="onProjectRowClick" @clear="onProjectClear" >
							<div slot="title">选择项目</div>
						</xm-project-select>
					</el-row>
				</el-form-item>

				<el-form-item label="访问链接" prop="accessUrl">
					<el-input v-model="addForm.accessUrl" placeholder="访问链接" ></el-input>
				</el-form-item>
				<el-row>
					<el-col :span="8">
						<el-form-item label="访问用户编号" prop="accessUserid">
							<el-input v-model="addForm.accessUserid" placeholder="访问用户编号" style="width:99%;"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="访问密码" prop="accessPassword">
							<el-input v-model="addForm.accessPassword" placeholder="访问密码" show-password style="width:99%;"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="内网ip地址" prop="ipAddress">
							<el-input v-model="addForm.ipAddress" style="width:99%;" placeholder="内网ip地址" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label=" 访问端口" prop="port">
							<el-input type="number" min="0"  v-model="addForm.port" placeholder="内网访问端口" style="width:99%;"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="外网ip地址" prop="webIpAddress">
							<el-input v-model="addForm.webIpAddress" placeholder="外网ip地址" style="width:99%;"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="外网端口" prop="webPort">
							<el-input type="number" min="0"  v-model="addForm.webPort" placeholder="外网端口" style="width:99%;"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="8">
							<el-form-item label="状态" prop="envState">
								<el-select v-model="addForm.envState">
									<el-option  value="0" label="不可用"></el-option>
									<el-option  value="1" label="已启用"></el-option>
									<el-option  value="2" label="已过期"></el-option>
								</el-select>
							</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="浏览权限" prop="readQx">
							<mdp-select item-code="readQx" v-model="addForm.readQx">
 							</mdp-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
					<el-form-item label="修改权限" prop="writeQx">
						<mdp-select item-code="writeQx" v-model="addForm.writeQx">
 						</mdp-select>
					</el-form-item>
				</el-col>
				</el-row>
				<el-form-item label="备注说明" prop="remark">
					<el-input type="textarea" rows="4" v-model="addForm.remark" placeholder="备注说明" ></el-input>
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

	import { initDicts,addXmEnvList } from '@/api/xm/core/xmEnvList';
	import XmProjectSelect from "@/views/xm/core/components/XmProjectSelect";
	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmEnvList','visible','xmProject','xmProduct'],
		watch: {
	      'xmEnvList':function( xmEnvList ) {
	        Object.assign(this.addForm,xmEnvList)
	      },
	      'visible':function(visible) {
	      	if(visible==true){
				this.initData();
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      }
	    },
		data() {
			var validateStart = (rule, value, callback) => {
				const s = this.addForm.startTime;
				const d = this.addForm.endTime;
				if(this.isEmpty(s)){
					callback(new Error('有效开始时间不可为空'));
				}
				else if(false == this.isEmpty(d) && new Date(s).getTime() > new Date(d).getTime()){
					callback(new Error('开始时间不能晚于结束时间'));
				}
				callback();
			};
			var validateEnd = (rule, value, callback) => {
				const s = this.addForm.startTime;
				const d = this.addForm.endTime;
				if(this.isEmpty(d)){
					callback(new Error('有效结束时间不可为空'));
				}
				else if(false == this.isEmpty(s) && new Date(s).getTime() > new Date(d).getTime()){
					callback(new Error('结束时间不能早于开始时间'));
				}
				callback();
			};

			return {
				dicts:{readQx:[],wrightQx:[]},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					envState: [
						{ required: true, message: '状态不能为空', trigger: 'change' }
					],
					name: [
						{ required: true, message: '名称不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 xm_env_list
				addForm: {
					id:'',name:'',remark:'',ipAddress:'',port:'',branchId:'',accessUserid:'',accessPassword:'',effect:'',accessUrl:'',supplier:'',webIpAddress:'',webPort:'',otherRemark:'',createUserid:'',createUsername:'',createTime:'',envState:'1',startTime:'',endTime:'',feeAmount:'',feeRule:'',readQx:'9',writeQx:'9',projectId:'',projectName:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

				envStatusList: [
					{
						label: "不可用",
						value: '0',
					},
					{
						label: "已启用",
						value: '1',
					},
					{
						label: "已过期",
						value: '2',
					},
				],

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmEnvList xm_env_list 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {

				this.$refs.addForm.validate((valid) => {
					if (valid) {

						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.addForm);
							addXmEnvList(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/

			matchIP(val) {
				let ip = /25[6-9]|[3-9][0-9]{2}/;
				console.log(val);
				this.addForm.ipAddress = val.replace(/^25[6-9]|[3-9][0-9]{2}|$/,"");
				// string pattern = @"((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)";
				// string input = "net:tcp//192.168.5.173:65535/MyService";
				// Regex reg = new Regex(pattern);
				// var ret=  reg.Matches(input);
			},

			isEmpty(val) {
				return val == "" || val == null || typeof(val) == undefined;
			},
			onProjectRowClick(project){
				this.addForm.projectId=project.id
				this.addForm.projectName=project.name
			},
			initData(){
				if(this.xmProject && this.xmProject.id){
					this.addForm.projectId=this.xmProject.id
					this.addForm.projectName=this.xmProject.name
				}else{
					this.addForm.projectId=''
					this.addForm.projectName=''
				}
			}
			/**end 在上面加自定义方法**/

		},//end method
		components: {
			XmProjectSelect,
		    //在下面添加其它组件 'xm-env-list-edit':XmEnvListEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmEnvList);
			this.initData();
			initDicts(this)

			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
