<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 SysUserTpaApply sys_user_tpa_apply--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item> 
				<el-form-item label="申请人的用户编号" prop="userid">
					<el-input v-model="addForm.userid" placeholder="申请人的用户编号" ></el-input>
				</el-form-item> 
				<el-form-item label="申请的岗位名称" prop="applyPostName">
					<el-input v-model="addForm.applyPostName" placeholder="申请的岗位名称" ></el-input>
				</el-form-item> 
				<el-form-item label="申请的机构编号" prop="applyBranchId">
					<el-input v-model="addForm.applyBranchId" placeholder="申请的机构编号" ></el-input>
				</el-form-item> 
				<el-form-item label="申请的商户编号" prop="applyShopId">
					<el-input v-model="addForm.applyShopId" placeholder="申请的商户编号" ></el-input>
				</el-form-item> 
				<el-form-item label="申请的门店编号" prop="applyLocationId">
					<el-input v-model="addForm.applyLocationId" placeholder="申请的门店编号" ></el-input>
				</el-form-item> 
				<el-form-item label="申请来源(从哪个途径申请)" prop="source">
					<el-input v-model="addForm.source" placeholder="申请来源(从哪个途径申请)" ></el-input>
				</el-form-item> 
				<el-form-item label="申请的状态(0.申请中" prop="status">
					<el-input v-model="addForm.status" placeholder="申请的状态(0.申请中" ></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注" ></el-input>
				</el-form-item> 
				<el-form-item label="申请时间" prop="createDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="修改时间" prop="updateDate">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.updateDate" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="创建人id" prop="cuserid">
					<el-input v-model="addForm.cuserid" placeholder="创建人id" ></el-input>
				</el-form-item> 
				<el-form-item label="最后操作人" prop="lopuserid">
					<el-input v-model="addForm.lopuserid" placeholder="最后操作人" ></el-input>
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
	import { addSysUserTpaApply } from '@/api/mdp/sys/userTpaApply';
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
	        this.addForm = userTpaApply;
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
				//新增界面数据 sys_user_tpa_apply
				addForm: {
					id:'',userid:'',applyPostName:'',applyBranchId:'',applyShopId:'',applyLocationId:'',source:'',status:'',remark:'',createDate:'',updateDate:'',cuserid:'',lopuserid:''
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
			//新增提交SysUserTpaApply sys_user_tpa_apply 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addSysUserTpaApply(params).then((res) => {
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
		    //在下面添加其它组件 'sys-user-tpa-apply-edit':SysUserTpaApplyEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.userTpaApply);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>