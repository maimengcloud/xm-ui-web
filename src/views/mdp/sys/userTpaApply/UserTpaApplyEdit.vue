<template>
	<section>
		<el-row class="app-container"> 
		<!--编辑界面 SysUserTpaApply sys_user_tpa_apply--> 
			<el-form :model="editForm"  label-width="150px" :rules="editFormRules" ref="editForm">
				<!-- <el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键"></el-input>
				</el-form-item> 
				<el-form-item label="申请人的用户编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="申请人的用户编号"></el-input>
				</el-form-item> 
				<el-form-item label="申请的岗位名称" prop="applyPostName">
					<el-input v-model="editForm.applyPostName" placeholder="申请的岗位名称"></el-input>
				</el-form-item> 
				<el-form-item label="申请的机构编号" prop="applyBranchId">
					<el-input v-model="editForm.applyBranchId" placeholder="申请的机构编号"></el-input>
				</el-form-item> 
				<el-form-item label="申请的商户编号" prop="applyShopId">
					<el-input v-model="editForm.applyShopId" placeholder="申请的商户编号"></el-input>
				</el-form-item> 
				<el-form-item label="申请的门店编号" prop="applyLocationId">
					<el-input v-model="editForm.applyLocationId" placeholder="申请的门店编号"></el-input>
				</el-form-item> 
				<el-form-item label="申请来源(从哪个途径申请)" prop="source">
					<el-input v-model="editForm.source" placeholder="申请来源(从哪个途径申请)"></el-input>
				</el-form-item>  -->
				<el-form-item label="申请的状态" prop="status">
					<!-- <el-input v-model="editForm.status" placeholder="申请的状态(0.申请中"></el-input> -->
					<el-radio v-model="editForm.status" label="0">申请中</el-radio>
					<el-radio v-model="editForm.status" label="1">成功</el-radio>
					<el-radio v-model="editForm.status" label="2">拒绝</el-radio>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注"></el-input>
				</el-form-item> 
				<!-- <el-form-item label="申请时间" prop="createDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="修改时间" prop="updateDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.updateDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="创建人id" prop="cuserid">
					<el-input v-model="editForm.cuserid" placeholder="创建人id"></el-input>
				</el-form-item> 
				<el-form-item label="最后操作人" prop="lopuserid">
					<el-input v-model="editForm.lopuserid" placeholder="最后操作人"></el-input>
				</el-form-item> -->
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
	import { editSysUserTpaApply } from '@/api/mdp/sys/userTpaApply';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['userTpaApply','visible'],
		watch: {
	      'userTpaApply':function( userTpaApply ) {
	        this.editForm = userTpaApply;
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
				//编辑界面数据  SysUserTpaApply sys_user_tpa_apply
				editForm: {
					id:'',userid:'',applyPostName:'',applyBranchId:'',applyShopId:'',applyLocationId:'',source:'',status:'',remark:'',createDate:'',updateDate:'',cuserid:'',lopuserid:''
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
			//编辑提交SysUserTpaApply sys_user_tpa_apply父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editSysUserTpaApply(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'sys-user-tpa-apply-edit':SysUserTpaApplyEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.userTpaApply);  
		}
	}

</script>

<style scoped>

</style>