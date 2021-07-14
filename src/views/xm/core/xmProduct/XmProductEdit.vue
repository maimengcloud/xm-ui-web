<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<!--新增界面 XmProduct 产品表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="产品编号" prop="id">
					<el-input v-model="editForm.id" placeholder="产品编号" ></el-input>
				</el-form-item> 
				<el-form-item label="产品名称" prop="productName">
					<el-input v-model="editForm.productName" placeholder="产品名称" ></el-input>
				</el-form-item>  
				<el-form-item label="产品经理" prop="pmUserid">
					 <el-tag v-if="editForm.pmUserid" closable @close="clearPmUser">{{editForm.pmUsername}}</el-tag>
					 <el-tag v-else>未配置</el-tag> 
					 <el-button @click="selectUser">选产品经理</el-button>
				</el-form-item>  
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 20}"  placeholder="备注" ></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
			
		
		<el-dialog title="选择员工" :visible.sync="userSelectVisible" width="60%" append-to-body>
       		 <users-select  @confirm="onUserSelected" ref="usersSelect"></users-select>
      	</el-dialog>	
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { editXmProduct } from '@/api/xm/core/xmProduct';
	import { mapGetters } from 'vuex'	
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; 

	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProduct','visible'],
		watch: {
	      'xmProduct':function( xmProduct ) {
	        this.editForm = xmProduct;
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
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
					id: [
						{ required: true, message: '产品编号不能为空', trigger: 'blur' }
					],
					
					productName: [
						{ required: true, message: '产品名称不能为空', trigger: 'blur' }
					],
					
					pmUserid: [
						{ required: true, message: '产品经理不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 产品表
				editForm: {
					id:'',productName:'',branchId:'',remark:'',pmUserid:'',pmUsername:'',ctime:''
				},
				userSelectVisible:false,
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
			//新增提交XmProduct 产品表 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {
				if(this.userInfo.userid!=this.editForm.pmUserid){
					this.$message({showClose: true, message: "你不是该产品负责人，不能修改产品信息", type:  'error' });  
					return;
				}
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							params.branchId=this.userInfo.branchId
							editXmProduct(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.edit=false);
						});
					}
				});
			},
			selectUser(){
				if(!this.roles.some(i=>i.roleid=='productAdmin')){
					this.$message({showClose: true, message: "你不是产品经理，不能修改产品负责人", type:  'error' });  
					return;
				}
				this.userSelectVisible=true;
			},
			onUserSelected(users){
				if(users && users.length>0){
					this.editForm.pmUserid=users[0].userid
					this.editForm.pmUsername=users[0].username
				}
				this.userSelectVisible=false
			},
			clearPmUser:function(){
				if(!this.roles.some(i=>i.roleid=='productAdmin')){
					this.$message({showClose: true, message: "你不是产品经理，不能修改产品负责人", type:  'error' });  
					return;
				}
				this.editForm.pmUserid=''
				this.editForm.pmUsername=''
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'xm-product-edit':XmProductEdit
			UsersSelect
		},
		mounted() {
			this.editForm= this.xmProduct;   
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>