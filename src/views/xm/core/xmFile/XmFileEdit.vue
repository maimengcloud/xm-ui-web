<template>
	<section>
		<el-row>
		<!--编辑界面 XmFile xm_file-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm"> 
				<el-form-item label="文件名称" prop="name">
					<el-input v-model="editForm.name" placeholder="文件名称"></el-input>
					<el-row class="label-font-color">编号：{{editForm.id}} <el-divider direction="vertical"></el-divider><span v-if="editForm.projectName">归属项目：{{ editForm.projectName}} <el-divider direction="vertical"></el-divider></span>创建人：{{ editForm.createUsername }}<el-divider direction="vertical"></el-divider> 创建时间：{{ editForm.createTime }}</el-row>
				</el-form-item>
				<el-form-item label="文件说明" prop="description">
					<vue-editor v-if="visible" :branch-id="userInfo.branchId" v-model="editForm.description"></vue-editor>
				</el-form-item>
				<el-form-item label="附件">
					<upload :archiveId="editForm.id" :branchId="userInfo.branchId"  @on-change="onChange"></upload>
				</el-form-item>  
				<el-form-item> 
					<span style="float:right;">
						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button> 
					</span>
				</el-form-item>
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { editXmFile } from '@/api/xm/core/xmFile';
	import { mapGetters } from 'vuex'
	import VueEditor from '@/components/Tinymce/index';
	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmFile','visible'],
		watch: {
	      'xmFile':function( xmFile ) {
	        this.editForm = xmFile;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      }
	    },
		data() {
			return {
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '文档编号不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmFile xm_file
				editForm: {
					id:'',name:'',projectId:'',projectName:'',description:'',createUserid:'',createUsername:'',createTime:'',
					attachment:[],
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				fileVisible: true,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交XmFile xm_file父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							editXmFile(params).then((res) => {
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
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			onChange : function(file,fileList){
				let list = [];
				if(fileList != null && fileList.length > 0){
					fileList.forEach( (item)=>{
						let fileOne = {
							id: item.id,
							name: item.name,
							addr: item.url,
							type: item.fileSuffix,
							remark: item.remark,
						}
						list.push(fileOne);
					} );
					this.editForm.attachment = list;
				}
			}
			/**end 在上面加自定义方法**/
		},//end method
		components: {
				//在下面添加其它组件 'xm-file-edit':XmFileEdit
			'upload': AttachmentUpload,
			'vue-editor' :VueEditor,
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmFile);
		}
	}

</script>

<style scoped>

</style>
