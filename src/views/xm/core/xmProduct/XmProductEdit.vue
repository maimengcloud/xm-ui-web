<template>
	<section class="page-container padding border">
		
		<el-row style="padding-left:250px;padding-right:250px;padding-top:20px;padding-bottom:20px;">
			<el-steps :active="calcXmProductPstatusStep" finish-status="success">
 				<el-step  v-for="(i,index) in dicts['xmProductPstatus']" :title="i.name" :key="index" @click.native.stop="editForm.pstatus=i.id">
					 <el-link slot="title" >
						 {{i.name}} 
					 </el-link>
				</el-step> 
			</el-steps>
		</el-row>
		<el-row class="page-main">
			<!--新增界面 XmProduct 产品表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm"> 
				<el-form-item label="名称" prop="productName">
					<el-input v-model="editForm.productName" placeholder="产品名称" ></el-input>
				</el-form-item>  
				<el-row>
					<el-col :span="8">
						<el-form-item label="编号" prop="id">
							 {{editForm.code}}
						</el-form-item>  
					</el-col>
					<el-col :span="8">
						<el-form-item label="产品代号" prop="code">
							 {{editForm.code}}
						</el-form-item>  
					</el-col>
					<el-col :span="8"> 
						<el-form-item label="状态" prop="pstatus">
							<el-select v-model="editForm.pstatus" placeholder="状态" @change="editSomeFields(editForm,'pstatus',$event)">
								<el-option v-for="(item,index) in dicts['xmProductPstatus']" :label="item.name" :value="item.id" :key="index"></el-option>
							</el-select>
						</el-form-item>  
					</el-col>
				</el-row> 
				<el-row>
					<el-col :span="8">
				<el-form-item label="总监"  prop="admUserid">
					<el-input readonly v-model="editForm.admUsername" @click.native="showUserVisible('admUserid')"></el-input>
					<font style="font-size:12px;" color="blue"></font> 
				</el-form-item>  
					</el-col>
					<el-col :span="8">
				<el-form-item label="产品经理" prop="pmUserid"> 
					<el-input readonly v-model="editForm.pmUsername" @click.native="showUserVisible('pmUserid')"></el-input>
					<font style="font-size:12px;" color="blue"></font> 
				</el-form-item> 
					</el-col>
					<el-col :span="8">
				<el-form-item label="副经理、助理" prop="assUserid"> 
					<el-input readonly v-model="editForm.assUsername" @click.native="showUserVisible('assUserid')"></el-input>
					<font style="font-size:12px;" color="blue"></font> 
				</el-form-item>  
					</el-col>
				</el-row> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" :rows="10" type="textarea" :autosize="{ minRows: 4, maxRows: 20}"  placeholder="备注"  @change="editSomeFields(editForm,'remark',$event)"></el-input>
				</el-form-item>  
			</el-form>
			
		
		<el-drawer title="选择员工" :visible.sync="userSelectVisible" size="60%" append-to-body>
       		 <users-select  @confirm="onUserSelected" ref="usersSelect"></users-select>
      	</el-drawer>	
		</el-row> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库 
	import { initDicts,editXmProduct,editXmProductSomeFields } from '@/api/xm/core/xmProduct';
	import { mapGetters } from 'vuex'	
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; 

	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			calcXmProductPstatusStep(){
				if(this.dicts['xmProductPstatus']){
					var index=this.dicts['xmProductPstatus'].findIndex(i=>{
						if(i.id==this.editForm.pstatus){
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

	      'xmProduct': {
			handler(){
				 this.editForm = this.xmProduct;
				 this.editFormBak={...this.editForm}
			},
			deep:true,
	       
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				dicts:{xmProductPstatus:[]},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
					productName: [
						{ required: true, message: '产品名称不能为空', trigger: 'change' },
						{ min:2,max:250, message: '名称长度在10-250个字符', trigger: 'change' }
					],
					
					id: [
						{ required: true, message: '产品编号不能为空', trigger: 'change' }
					],
					code: [
						{ required: true, message: '产品代号不能为空', trigger: 'change' }
					],
					
					pmUserid: [
						{ required: true, message: '产品经理不能为空', trigger: 'change' }
					],
					
					admUserid: [
						{ required: true, message: '产品总监不能为空', trigger: 'change' }
					],
					remark:[ 
						{ min:0,max:250, message: '备注长度在10-250个字符', trigger: 'change' }
					]
				},
				//新增界面数据 产品表 
				editForm: {
					id:'',productName:'',branchId:'',remark:'',version:'',pmUserid:'',pmUsername:'',ctime:'',deptid:'',pstatus:'',startTime:'',endTime:'',deptName:'',admUserid:'',admUsername:'',assUserid:'',assUsername:'',bizProcInstId:'',bizFlowState:'',isTpl:'',baselineId:'',baseTime:'',code:'',pbudgetWorkload:'',pbudgetAmount:'',pmenuBudgetWorkload:'',pmenuBudgetAmount:'',budgetCtrl:'',phaseBudgetCtrl:'',phaseActCtrl:'',locked:'',del:'',ltime:''
				},
				editFormBak: {
					id:'',productName:'',branchId:'',remark:'',version:'',pmUserid:'',pmUsername:'',ctime:'',deptid:'',pstatus:'',startTime:'',endTime:'',deptName:'',admUserid:'',admUsername:'',assUserid:'',assUsername:'',bizProcInstId:'',bizFlowState:'',isTpl:'',baselineId:'',baseTime:'',code:'',pbudgetWorkload:'',pbudgetAmount:'',pmenuBudgetWorkload:'',pmenuBudgetAmount:'',budgetCtrl:'',phaseBudgetCtrl:'',phaseActCtrl:'',locked:'',del:'',ltime:''
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
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.edit=false);
						});
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: "表单验证不通过，请修改后提交", type: 'error' }); 
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
				this.editSomeFields(this.editForm,this.currUserType,user)
				this.currUserType="";
				
			},  

            editSomeFields(row,fieldName,$event){ 
                let params={};
                params['ids']=[row].map(i=>i.id)
				if(fieldName=='adminUserid'){
					params['adminUserid']=$event.userid 
					params['adminUsername']=$event.username
				}else if(fieldName=='assUserid'){
					params['assUserid']=$event.userid 
					params['assUsername']=$event.username
				}else if(fieldName=='pmUserid'){
					params['pmUserid']=$event.userid 
					params['pmUsername']=$event.username
				}else if(fieldName=='startTime'){
					params['startTime']=row.startTime
					params['endTime']=row.endTime
				}else{
					params[fieldName]=$event
				}
                
                var func = editXmProductSomeFields
                func(params).then(res=>{
                  let tips = res.data.tips;
                  if(tips.isOk){
                    this.editFormBak=[...this.editForm]
					Object.assign(this.editForm,params)
					this.$emit('edit-fields',params)
                  }else{
                    Object.assign(this.editForm,this.editFormBak)
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }
                }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
            },
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'xm-product-edit':XmProductEdit
			UsersSelect
		},
		mounted() {
			this.editForm= this.xmProduct;    
			this.editFormBak={...this.editForm}
			initDicts(this)
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>