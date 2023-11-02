<template>
	<section class="page-container  padding border">
		<el-row>
			<!--新增界面 XmAttachment xm_attachment-->
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item>
				<el-form-item label="附件来源类型，0任务，1缺陷，2文档" prop="originType">
					<el-input v-model="addForm.originType" placeholder="附件来源类型，0任务，1缺陷，2文档" ></el-input>
				</el-form-item>
				<el-form-item label="来源id" prop="originId">
					<el-input v-model="addForm.originId" placeholder="来源id" ></el-input>
				</el-form-item>
				<el-form-item label="附件名字" prop="name">
					<el-input v-model="addForm.name" placeholder="附件名字" ></el-input>
				</el-form-item>
				<el-form-item label="附件地址" prop="addr">
					<el-input v-model="addForm.addr" placeholder="附件地址" ></el-input>
				</el-form-item>
				<el-form-item label="附件类型" prop="type">
					<el-input v-model="addForm.type" placeholder="附件类型" ></el-input>
				</el-form-item>
				<el-form-item label="备注说明" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注说明" ></el-input>
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

	import { addXmAttachment } from '@/api/xm/core/xmAttachment';
	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmAttachment','visible'],
		watch: {
	      'xmAttachment':function( xmAttachment ) {
	        this.addForm = xmAttachment;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      }
	    },
		data() {
			return {
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 xm_attachment
				addForm: {
					id:'',originType:'',originId:'',name:'',addr:'',type:'',remark:''
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
			//新增提交XmAttachment xm_attachment 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {

				this.$refs.addForm.validate((valid) => {
					if (valid) {

						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.addForm);
							addXmAttachment(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/

			/**end 在上面加自定义方法**/

		},//end method
		components: {
		    //在下面添加其它组件 'xm-attachment-edit':XmAttachmentEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmAttachment);
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
