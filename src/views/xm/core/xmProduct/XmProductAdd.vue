<template>
	<section class="page-container  padding border"> 
		<el-row class="page-main ">
			<!--新增界面 XmProduct 产品表--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				
				<el-form-item label="产品代号" prop="code">
						<el-input v-model="addForm.code"  placeholder="产品代号，不可为空" >
							<template slot="append">
								<el-button type="text" @click="createProductCode">自动生成</el-button>
							</template>
						</el-input>
							
				</el-form-item>  		   
				<el-form-item label="产品名称" prop="productName">
					<el-input v-model="addForm.productName" placeholder="产品名称" ></el-input>
				</el-form-item>   
				<el-row>
					<el-col :span="8">
				<el-form-item label="总监"  prop="admUserid">
					<el-input readonly v-model="addForm.admUsername" @click.native="showUserVisible('admUserid')"></el-input>
					<font style="font-size:12px;" color="red"></font> 
				</el-form-item>  
					</el-col>
					<el-col :span="8">
				<el-form-item label="产品经理" prop="pmUserid"> 
					<el-input readonly v-model="addForm.pmUsername" @click.native="showUserVisible('pmUserid')"></el-input>
					<font style="font-size:12px;" color="red"></font> 
				</el-form-item> 
					</el-col>
					<el-col :span="8">
				<el-form-item label="副经理、助理" prop="assUserid"> 
					<el-input readonly v-model="addForm.assUsername" @click.native="showUserVisible('assUserid')"></el-input>
					<font style="font-size:12px;" color="red"></font> 
				</el-form-item>  
					</el-col>
				</el-row>
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
	import { addXmProduct,createProductCode } from '@/api/xm/core/xmProduct';
	import { mapGetters } from 'vuex'	
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; 

	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmProduct','visible','selProject'],
		watch: {
	      'xmProduct':function( xmProduct ) {
	        this.addForm = xmProduct;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){ 
				this.addForm.pmUserid=this.userInfo.userid
				this.addForm.pmUsername=this.userInfo.username
				this.addForm.admUserid=this.userInfo.userid
				this.addForm.admUsername=this.userInfo.username
	      	}
	      } 
	    },
		data() {
			return {
				options:{xmProductPstatus:[]},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {  
					productName: [
						{ required: true, message: '产品名称不能为空', trigger: 'change' }
					],
					
					code: [
						{ required: true, message: '产品代号不能为空', trigger: 'change' }
					],
					
					pmUserid: [
						{ required: true, message: '产品经理不能为空', trigger: 'change' }
					],
					
					admUserid: [
						{ required: true, message: '产品总监不能为空', trigger: 'change' }
					]
				},
				//新增界面数据 产品表
				addForm: {
					id:'',code:'',productName:'',branchId:'',remark:'',pmUserid:'',pmUsername:'',pstatus:'',ctime:'',admUserid:'',admUsername:'',assUserid:'',assUsername:'',del:'',locked:''
				},
				userSelectVisible:false,
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				currUserType:'',
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交XmProduct 产品表 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							if(this.selProject &&this.selProject.id){
								params.links=[{projectId:this.selProject.id}]
							}
							params.branchId=this.userInfo.branchId
							addXmProduct(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['addForm'].resetFields();
									this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}else{
						this.$notify({showClose: true, message: "表单检查不通过", type: 'error' }); 
					}
				});
			}, 
			createProductCode(){
				createProductCode({}).then(res=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.addForm.code=res.data.data
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
				})
			},
			showUserVisible(userType){
				this.currUserType=userType
				this.userSelectVisible=true;
			},
			//选择人员
			onUserSelected: function(users) {  
				this.userSelectVisible = false;
				var user={userid:'',username:''}; 
				if(users && users.length>0){
					user=users[0]
				}
				 
				if(this.currUserType=='admUserid'){ 
					this.addForm.admUserid=user.userid
					this.addForm.admUsername=user.username
				}else if(this.currUserType=='assUserid'){ 
					this.addForm.assUserid=user.userid
					this.addForm.assUsername=user.username
				}else if(this.currUserType=='pmUserid'){ 
					this.addForm.pmUserid=user.userid
					this.addForm.pmUsername=user.username
				}
				this.currUserType="";
				
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
			this.addForm.admUserid=this.userInfo.userid
			this.addForm.admUsername=this.userInfo.username
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>