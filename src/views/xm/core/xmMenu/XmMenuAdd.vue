<template>
	<section class="page-container page-full-height padding border">
		<el-row class="page-main page-height-90">
			<!--新增界面 XmMenu 项目故事表--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item v-if="parentMenu" label="上级故事" prop="pmenuId">
					 {{parentMenu.seqNo}} &nbsp; &nbsp; {{parentMenu.menuName}}
				</el-form-item> 
				<el-form-item v-if="!parentMenu" label="上级故事" prop="pmenuId">
					无上级
				</el-form-item> 
				<el-form-item label="序号" prop="seqNo">
					<el-input v-model="addForm.seqNo" placeholder="如1.0 ， 1.1 ， 1.1.1等" ></el-input>
					<span v-if="parentMenu" style="color:red;">建议：{{parentMenu.seqNo}}.{{parentMenu.children?parentMenu.children.length+1:1}} </span> 
				</el-form-item> 
				<el-form-item label="故事名称" prop="menuName">
					<el-input v-model="addForm.menuName" placeholder="故事名称" ></el-input>
				</el-form-item>  
				<el-form-item label="负责人" prop="mmUserid">
					 <el-tag v-if="addForm.mmUserid" closable @close="clearPmUser">{{addForm.mmUsername}}</el-tag>
					 <el-tag v-else>未配置</el-tag> 
					 <el-button @click="selectUser">选负责人</el-button>
				</el-form-item>   
				<el-form-item label="需求链接" prop="demandUrl"> 
					<el-input v-model="addForm.demandUrl" placeholder="需求链接" ></el-input> 
				</el-form-item>  
				<el-form-item label="代码链接" prop="codeUrl">
					<el-input v-model="addForm.codeUrl" placeholder="代码链接" ></el-input>  
				</el-form-item>  
				<el-form-item label="设计链接" prop="designUrl">
					<el-input v-model="addForm.designUrl" placeholder="设计链接" ></el-input>  
				</el-form-item>   
				<el-form-item label="操作手册链接" prop="operDocUrl">
					<el-input v-model="addForm.operDocUrl" placeholder="操作手册链接" ></el-input>  
				</el-form-item>  
				<el-form-item label="概述" prop="remark">
					<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 20}" v-model="addForm.remark" placeholder="什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划" ></el-input>
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
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addXmMenu } from '@/api/xm/core/xmMenu';
	import { mapGetters } from 'vuex'	
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; 

	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmMenu','visible','parentMenu','product'],
		watch: {
	      'xmMenu':function( xmMenu ) {
			this.addForm = xmMenu; 
			this.addForm.mmUserid=this.userInfo.userid
			this.addForm.mmUsername=this.userInfo.username
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
				  if(this.parentMenu){
					  if(this.parentMenu.children){
						    this.addForm.seqNo=this.parentMenu.seqNo+"."+(this.parentMenu.children.length+1)
					  }else{
						  this.addForm.seqNo=this.parentMenu.seqNo+"."+1
					  }
					  
				  }
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					menuId: [
						//{ required: true, message: '故事编号不能为空', trigger: 'blur' }
					],					
					menuName: [
						{ required: true, message: '故事名称不能为空', trigger: 'blur' }
					],
					seqNo: [
						{ required: true, message: '序号不能为空', trigger: 'blur' }
					],
					mmUserid: [
						{ required: true, message: '负责人不能为空', trigger: 'blur' }
					],
				},
				//新增界面数据 项目故事表
				addForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'1',mmUserid:'',mmUsername:''
				},
				userSelectVisible:false,
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
 				this.$emit('cancel');
			},
			//新增提交XmMenu 项目故事表 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				if(this.parentMenu==null && this.product ==null ){
					this.$message({showClose: true, message: '请选择产品/或者上级故事进行新增', type:'error' }); 
					return;
				}
				this.$refs.addForm.validate((valid) => {
					if (valid) {

						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							if(this.parentMenu!=null){
								params.productId=this.parentMenu.productId
								params.pmenuId=this.parentMenu.menuId
							}else if(this.product){
								params.productId=this.product.id
							}
							if(params.productId==null|| params.productId==''){
								this.$message({showClose: true, message: '产品编号不能为空', type:'error' }); 
								return;
							}
							addXmMenu(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('submit');//  @submit="afterAddSubmit"
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
					this.addForm.mmUserid=users[0].userid
					this.addForm.mmUsername=users[0].username
				}
				this.userSelectVisible=false
			},
			clearPmUser:function(){
				this.addForm.mmUserid=''
				this.addForm.mmUsername=''
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'xm-menu-edit':XmMenuEdit
			UsersSelect
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmMenu);  
			this.addForm.mmUserid=this.userInfo.userid
			this.addForm.mmUsername=this.userInfo.username
			this.addForm.remark="作为   ，我需要   ，以便我能够   。"
			if(this.parentMenu){
				if(this.parentMenu.children){
					this.addForm.seqNo=this.parentMenu.seqNo+"."+(this.parentMenu.children.length+1)
				}else{
					this.addForm.seqNo=this.parentMenu.seqNo+"."+1
				}
				
			}
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>