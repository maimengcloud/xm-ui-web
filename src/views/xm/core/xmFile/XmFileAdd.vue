<template>
	<section class="page-container  padding border">
		<el-row>
			<!--新增界面 XmFile xm_file-->
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="项目名称">
					{{addForm.projectName}}
					<!-- <el-input v-model="addForm.projectName" placeholder="项目名称" ></el-input> -->
				</el-form-item>
				<el-form-item label="文件名称" prop="name">
					<el-input v-model="addForm.name" placeholder="文件名称" ></el-input>
				</el-form-item>
				<el-form-item label="文件说明" prop="description">
					<vue-editor v-if="visible" :branch-id="userInfo.branchId" v-model="addForm.description"></vue-editor>
				</el-form-item>
				<el-form-item label="附件">
					<upload v-if="fileVisible" :archiveId="addForm.id" :branchId="userInfo.branchId"  @on-change="onChange"></upload>
				</el-form-item>
				<el-form-item label="创建人">
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
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { addXmFile } from '@/api/xm/core/xmFile';
	import { mapGetters } from 'vuex';
	import VueEditor from '@/components/Tinymce/index';
	import AttachmentUpload from "@/views/mdp/arc/archiveAttachment/AttachmentUpload"; //上传组件
	import {sn} from '@/common/js/sequence';

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmFile','visible'],
		watch: {
	      'xmFile':function( xmFile ) {
	        this.addForm = xmFile;
	      },
	      'visible':function(visible) {
					this.setDefaultData();
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
						//{ required: true, message: '文档编号不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 xm_file
				addForm: {
					id:'',name:'',projectId:'',projectName:'',description:'',createUserid:'',createUsername:'',createTime:'',
					attachment:[],
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				fileVisible: false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmFile xm_file 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.addForm);
							addXmFile(params).then((res) => {
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
			},

			//上传附件
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
					this.addForm.attachment = list;
					console.log(list);
				}
			},
			setDefaultData() {
				this.addForm.id = sn();
				this.fileVisible = this.visible;
			}

			/**begin 在下面加自定义方法,记得补上面的一个逗号**/

			/**end 在上面加自定义方法**/

		},//end method
		components: {
			'upload': AttachmentUpload,
			'vue-editor' :VueEditor,
		    //在下面添加其它组件 'xm-file-edit':XmFileEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmFile);
			this.setDefaultData();
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>
.el-form-item__content{
	margin-left: 0;
}
</style>
