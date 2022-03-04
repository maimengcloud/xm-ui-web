<template>
	<section class="page-container padding border">
		
		<el-row class="padding-header">
			<el-steps :active="calcXmProductPstatusStep" simple finish-status="success">
 				<el-step  v-for="(i,index) in options['xmProductPstatus']" :title="i.optionName" :key="index" @click.native.stop="editForm.pstatus=i.optionValue">
					 <el-link slot="title" >
						 {{i.optionName}} 
					 </el-link>
				</el-step> 
			</el-steps>
		</el-row>
		<el-row class="page-main">
			<!--新增界面 XmProduct 产品表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="产品编码" prop="code">
					<el-input v-model="editForm.code" placeholder="产品编码" ></el-input>
				</el-form-item> 
				<el-form-item label="产品名称" prop="productName">
					<el-input v-model="editForm.productName" placeholder="产品名称" ></el-input>
				</el-form-item>  
				
				<el-form-item label="状态" prop="pstatus">
					<el-select v-model="editForm.pstatus" placeholder="状态" >
						<el-option v-for="(item,index) in options['xmProductPstatus']" :label="item.optionName" :value="item.optionValue" :key="index"></el-option>
					</el-select>
				</el-form-item>  
				<el-row>
					<el-col :span="8">
				<el-form-item label="总监"  prop="admUserid">
					<el-input readonly v-model="editForm.admUsername" @click.native="showUserVisible('admUserid')"></el-input>
					<font style="font-size:12px;" color="red"></font> 
				</el-form-item>  
					</el-col>
					<el-col :span="8">
				<el-form-item label="产品经理" prop="pmUserid"> 
					<el-input readonly v-model="editForm.pmUsername" @click.native="showUserVisible('pmUserid')"></el-input>
					<font style="font-size:12px;" color="red"></font> 
				</el-form-item> 
					</el-col>
					<el-col :span="8">
				<el-form-item label="副经理、助理" prop="assUserid"> 
					<el-input readonly v-model="editForm.assUsername" @click.native="showUserVisible('assUserid')"></el-input>
					<font style="font-size:12px;" color="red"></font> 
				</el-form-item>  
					</el-col>
				</el-row> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 20}"  placeholder="备注" ></el-input>
				</el-form-item>  
			</el-form>
			
		
		<el-drawer title="选择员工" :visible.sync="userSelectVisible" size="60%" append-to-body>
       		 <users-select  @confirm="onUserSelected" ref="usersSelect"></users-select>
      	</el-drawer>	
		</el-row>
		
		<el-row> 
			<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { editXmProduct } from '@/api/xm/core/xmProduct';
	import { mapGetters } from 'vuex'	
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; 

	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			calcXmProductPstatusStep(){
				if(this.options['xmProductPstatus']){
					var index=this.options['xmProductPstatus'].findIndex(i=>{
						if(i.optionValue==this.editForm.pstatus){
							return true;
						}else{
							return false;
						}
					})
					return index+1;
				}else{
					return 0;
				}
			},
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
				options:{xmProductPstatus:[]},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
					id: [
						{ required: true, message: '产品编号不能为空', trigger: 'blur' }
					],
					
					productName: [
						{ required: true, message: '产品名称不能为空', trigger: 'blur' }
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
				editForm: {
					id:'',code:'',productName:'',branchId:'',remark:'',pmUserid:'',pmUsername:'',pstatus:'',ctime:'',admUserid:'',admUsername:'',assUserid:'',assUsername:'',del:'',locked:''
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
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.edit=false);
						});
					}
				});
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
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'xm-product-edit':XmProductEdit
			UsersSelect
		},
		mounted() {
			
			
			listOption([{categoryId:'all',itemCode:'xmProductPstatus'}] ).then(res=>{
				if(res.data.tips.isOk){ 
					this.options['xmProductPstatus']=res.data.data.xmProductPstatus   
				}
			});
			this.editForm= this.xmProduct;   
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>