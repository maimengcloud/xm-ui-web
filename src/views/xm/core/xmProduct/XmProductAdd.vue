<template>
	<section class="page-container page-full-height padding border">
		<el-row class="padding-bottom">
			<el-steps :active="calcProjectStatusStep" simple finish-status="success">
 				<el-step  v-for="(i,index) in options['projectStatus']" :title="i.optionName" :key="index">
					 <el-row slot="title" @click.native.stop="editForm.status=i.optionValue">
						 {{i.optionName}} 
					 </el-row>
				</el-step> 
			</el-steps>
		</el-row>
		<el-row class="page-main page-height-80">
			<!--新增界面 XmProduct 产品表--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="产品编号" prop="id">
					<el-input v-model="addForm.id" placeholder="产品编号" ></el-input>
				</el-form-item> 
				<el-form-item label="产品名称" prop="productName">
					<el-input v-model="addForm.productName" placeholder="产品名称" ></el-input>
				</el-form-item>  
				<el-form-item label="产品经理" prop="pmUserid">
					 <el-tag v-if="addForm.pmUserid" closable @close="clearPmUser">{{addForm.pmUsername}}</el-tag>
					 <el-tag v-else>未配置</el-tag> 
					 <el-button @click="selectUser">选产品经理</el-button>
				</el-form-item>  
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 20}"  placeholder="备注" ></el-input>
				</el-form-item>  
			</el-form>
			
		
		<el-drawer title="选择员工" :visible.sync="userSelectVisible" size="60%" append-to-body>
       		 <users-select  @confirm="onUserSelected" ref="usersSelect"></users-select>
      	</el-drawer>	
		</el-row>
		<el-row> 
			<el-button @click.native="handleCancel">取消</el-button>  
			<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>   
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addXmProduct } from '@/api/xm/core/xmProduct';
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
	        this.addForm = xmProduct;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{xmProductPstatus:[]},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
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
				addForm: {
					id:'',productName:'',branchId:'',remark:'',pmUserid:'',pmUsername:'',ctime:''
				},
				userSelectVisible:false,
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
			//新增提交XmProduct 产品表 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				if(!this.roles.some(i=>i.roleid=='productAdmin')){
					this.$message({showClose: true, message: "只有产品经理能够创建产品", type: 'error'}); 
					return false;
				}
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							params.branchId=this.userInfo.branchId
							addXmProduct(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['addForm'].resetFields();
									this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			selectUser(){  
				this.userSelectVisible=true;
			},
			onUserSelected(users){
				if(users && users.length>0){
					this.addForm.pmUserid=users[0].userid
					this.addForm.pmUsername=users[0].username
				}
				this.userSelectVisible=false
			},
			clearPmUser:function(){
				this.addForm.pmUserid=''
				this.addForm.pmUsername=''
			},  
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'xm-product-edit':XmProductEdit
			UsersSelect
		},
		mounted() { 
			this.addForm=Object.assign(this.addForm, this.xmProduct);  
			this.addForm.pmUserid=this.userInfo.userid
			this.addForm.pmUsername=this.userInfo.username
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>