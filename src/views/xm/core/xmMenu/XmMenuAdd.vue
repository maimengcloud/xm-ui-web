<template>
	<section class="page-container  padding border">
		<el-row class="page-main ">
			<!--新增界面 XmMenu 项目需求表--> 
			<el-form :model="addForm"  label-width="120px"  :rules="addFormRules" ref="addForm">
				
				<el-collapse value="1" accordion>
					<el-collapse-item title="基本信息" name="1" >
						<el-form-item label="节点类型" prop="ntype">
							<el-radio :disabled="parentMenu&&parentMenu.menuId&&parentTask.ntype==='0'" v-model="addForm.ntype" label="1">需求池</el-radio>
							<el-radio v-model="addForm.ntype" label="0">需求</el-radio>
							<br>
							<font v-if="addForm.ntype==='0'" color="red" style="font-size:12px;">需求：建议按以下逻辑描述一个需求：什么人？做什么事？，为什么？</font> 
							<font v-if="addForm.ntype==='1'" color="red" style="font-size:12px;">需求池：需求池下可建立子需求池或者需求。负责汇总统计下级数据，分解上级需求池预算。</font>
						</el-form-item> 
						<el-row> 
							<el-col :span="6">
								<el-form-item label="序号名称" prop="seqNo" >
									<el-input v-model="addForm.seqNo" style="width:100%;" placeholder="如1.0 ， 1.1 ， 1.1.1等" ></el-input> 
								</el-form-item>  
							</el-col>
							<el-col :span="18">
								<el-form-item label="" prop="menuName" label-width="0px">
									<el-input v-model="addForm.menuName" placeholder="名称" ></el-input>
								</el-form-item>   
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="归属产品" prop="productId">
									<font v-if="addForm.productId">{{addForm.productName?addForm.productName:addForm.productId}}</font>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item v-if="parentMenu" label="需求池" prop="pmenuId"> 
									<el-link type="primary"  :icon="'el-icon-folder-opened'">{{parentMenu.seqNo}} &nbsp; &nbsp; {{parentMenu.menuName}}</el-link> 
								</el-form-item>  
								<el-form-item v-if="!parentMenu" label="需求池" prop="pmenuId">
									无归属需求池
								</el-form-item>  
							</el-col>
						</el-row> 
						<el-row> 
							
							<el-col :span="12">
								<el-form-item  label="需求类型" prop="dtype" >   
									<el-select v-model="addForm.dtype">
										<el-option v-for="i in this.options.demandType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
									</el-select>  
								</el-form-item>   
							</el-col>
							<el-col :span="12">
								<el-form-item  label="需求来源" prop="source">   
									<el-select v-model="addForm.source">
										<el-option v-for="i in this.options.demandSource" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
									</el-select>  
								</el-form-item>   
							</el-col> 
							<el-col :span="12">
								<el-form-item  label="需求层次" prop="dlvl" >   
									<el-select v-model="addForm.dlvl">
										<el-option v-for="i in this.options.demandLvl" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
									</el-select>  
								</el-form-item>   
							</el-col>
							<el-col :span="12">
							<el-form-item  label="优先级" prop="priority" >  
								<el-select v-model="addForm.priority">
										<el-option v-for="i in options.priority" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option> 
								</el-select>    
							</el-form-item>  
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="提出人" prop="proposerId">
									<el-tag type="text" v-if="addForm.mmUserid" closable @close="clearPmUser">{{addForm.mmUsername}}</el-tag> 
									<el-button type="text" @click="selectUser">选负责人</el-button>
								</el-form-item>   
							</el-col>
							<el-col  :span="12">
								<el-form-item label="跟进人" prop="mmUserid">
									<el-tag type="text" v-if="addForm.mmUserid" closable @close="clearPmUser">{{addForm.mmUsername}}</el-tag> 
									<el-button type="text" @click="selectUser">选跟进人</el-button>
								</el-form-item>   
							</el-col>
						</el-row> 
					</el-collapse-item>
						<el-collapse-item title="需求概述" name="4"> 
							<el-form-item label="需求概述" prop="remark">
								<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20}" v-model="addForm.remark" placeholder="什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划" ></el-input>
							</el-form-item>  
						</el-collapse-item> 
					<el-collapse-item title="成本进度预估" name="2">
						<el-form-item label="预估工期" prop="budgetHours">
							<el-input-number style="width:200px;"  v-model="addForm.budgetHours"  :precision="2" :step="8" :min="0" placeholder="预计工期(小时)"></el-input-number>&nbsp;小时
						</el-form-item> 
						<el-form-item label="预估工作量" prop="budgetWorkload">
							<el-input-number style="width:200px;"  v-model="addForm.budgetWorkload" :precision="2" :step="8" :min="0" placeholder="预计总工作量(人时,不包括下一级)"></el-input-number> <el-tag>人时，{{this.toFixed(addForm.budgetWorkload/8/20)}}人月</el-tag>
						</el-form-item> 
						<el-form-item label="预估金额" prop="budgetAmount">
							  <el-input-number style="width:200px;"  v-model="addForm.budgetAmount" :precision="2" :step="100" :min="0" placeholder="预算金额"></el-input-number>   元 
						</el-form-item> 
					</el-collapse-item>
					<el-collapse-item title="相关链接" name="3"> 
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
					</el-collapse-item>
				</el-collapse>
			</el-form>
			
			<el-drawer title="选择员工" :visible.sync="userSelectVisible" size="60%" append-to-body>
				<users-select  @confirm="onUserSelected" ref="usersSelect"></users-select>
			</el-drawer>	
			
		</el-row>
		<el-row class="padding">
			<el-button @click.native="handleCancel">取消</el-button>  
			<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
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
				if(this.parentMenu && this.parentMenu.menuId){
					if(this.parentMenu.childrenCnt){
						this.addForm.seqNo=this.parentMenu.seqNo+"."+(this.parentMenu.childrenCnt.length+1)
					}else{
						this.addForm.seqNo=this.parentMenu.seqNo+"."+1
					}
					
				}
				if(this.product && this.product.id){ 
					this.addForm.productId=this.product.id
					this.addForm.productName=this.product.productName
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
						//{ required: true, message: '需求编号不能为空', trigger: 'blur' }
					],					
					menuName: [
						{ required: true, message: '需求名称不能为空', trigger: 'blur' }
					],
					seqNo: [
						{ required: true, message: '序号不能为空', trigger: 'blur' }
					],
					mmUserid: [
						{ required: true, message: '负责人不能为空', trigger: 'blur' }
					],
				},
				//新增界面数据 项目需求表
				addForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'1',mmUserid:'',mmUsername:'',ntype:'0',childrenCnt:0,sinceVersion:''
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
			//新增提交XmMenu 项目需求表 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				if(this.parentMenu==null && this.product ==null ){
					this.$notify({showClose: true, message: '请选择产品/或者上级需求进行新增', type:'error' }); 
					return;
				}
				if(this.parentMenu && this.parentMenu.ntype=="0"){
					 this.$notify({showClose: true, message: '需求池下不能再建立子需求', type:'error' }); 
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
								this.$notify({showClose: true, message: '产品编号不能为空', type:'error' }); 
								return;
							}
							if(params.remark=='作为   ，我需要   ，以便我能够   。'){
								params.remark=""
							}
							addXmMenu(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}else{
						this.$notify({showClose: true, message:"表单检查不通过，请修改后提交", type: 'error' });
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
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			toFixed(floatValue){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					return parseFloat(floatValue).toFixed(2);
				}
			},
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'xm-menu-edit':XmMenuEdit
			UsersSelect
		},
		mounted() {
			
 			listOption([{categoryId:'all',itemCode:'demandSource'},{categoryId:'all',itemCode:'demandLvl'},{categoryId:'all',itemCode:'demandType'},{categoryId:'all',itemCode:'priority'}]).then(res=>{
				this.options=res.data.data;
			})
			this.addForm=Object.assign(this.addForm, this.xmMenu);  
			this.addForm.mmUserid=this.userInfo.userid
			this.addForm.mmUsername=this.userInfo.username
			if(this.product){
				this.addForm.productId=this.product.id
				this.addForm.productName=this.product.productName 
			}
			this.addForm.remark="作为   ，我需要   ，以便我能够   。"
			if(this.parentMenu){
				if(this.parentMenu.childrenCnt){
					this.addForm.seqNo=this.parentMenu.seqNo+"."+(this.parentMenu.childrenCnt+1)
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