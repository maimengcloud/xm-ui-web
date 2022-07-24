<template>
	<section class="padding">
		<el-row class="page-main ">
			<!--新增界面 XmMenu 项目需求表--> 
			<el-form :model="addForm"  label-width="125px" label-position="left" :rules="addFormRules" ref="addForm"> 
						<el-row class="label-font-color">归属产品：{{ addForm.productName}} &nbsp;&nbsp;产品编号：{{ addForm.productId }}</el-row>
						<el-row :gutter="10">  
							<el-col :span="24">
								<el-form-item prop="menuName">
									<template slot="label">
										<div  class="big-icon" :style="{backgroundColor: calcMenuLabel.color }">
											<i :class="calcMenuLabel.icon"></i>
										</div>   
										{{calcMenuLabel.label}}
									</template> 
									<el-input v-model="addForm.menuName" placeholder="名称" title="名称"> 
									</el-input>
								</el-form-item>   
							</el-col>
						</el-row>
						<el-row class="padding"> 
								<el-col :span="8">
									<mdp-field-x v-if="!addForm.pmenuId" v-model="addForm.pmenuName" :disabled="true" label="上级需求"> </mdp-field-x>

									<mdp-field-x v-else v-model="addForm.pmenuName" :label="addForm.dclass==='3'?'归属特性':(addForm.dclass==='2'?'归属史诗':'归属')" :icon="addForm.dclass==='2'?'el-icon-s-promotion':'el-icon-s-flag'" :color="addForm.dclass==='2'?'rgb(255, 153, 51)':'rgb(0, 153, 51)'">
										<el-button slot="oper"
											@click="showPmenu"  
											title="查看上级"
											icon="el-icon-upload2"> 查看上级</el-button> 
									</mdp-field-x>  
								</el-col> 
								<el-col  :span="8">
									<mdp-select-user-xm  label="负责人" v-model="addForm" userid-key="mmUserid" username-key="mmUsername" @change="editXmTaskSomeFields(addForm,'mmUserid',$event)"></mdp-select-user-xm>   
								</el-col>
								<el-col  :span="8">
									<mdp-select-user-xm  label="提出人" v-model="addForm" userid-key="proposerId" username-key="proposerName" @change="editXmTaskSomeFields(addForm,'proposerId',$event)"></mdp-select-user-xm>   
								</el-col>
						</el-row> 
						<el-row>
							<el-col :span="8">
								<el-form-item  label="需求类型" prop="dtype" >   
									<el-select v-model="addForm.dtype">
										<el-option v-for="i in this.dicts.demandType" :label="i.name" :key="i.id" :value="i.id"></el-option>
									</el-select>  
								</el-form-item>   
							</el-col>
							<el-col :span="8">
								<el-form-item  label="需求来源" prop="source">   
									<el-select v-model="addForm.source">
										<el-option v-for="i in this.dicts.demandSource" :label="i.name" :key="i.id" :value="i.id"></el-option>
									</el-select>  
								</el-form-item>   
							</el-col> 
							<el-col :span="8">
								<el-form-item  label="需求层次" prop="dlvl" >   
									<el-select v-model="addForm.dlvl">
										<el-option v-for="i in this.dicts.demandLvl" :label="i.name" :key="i.id" :value="i.id"></el-option>
									</el-select>  
								</el-form-item>   
							</el-col> 
						</el-row>
						
						<el-row> 
							
							<el-col :span="8">
								<el-form-item label="排序序号" prop="seqNo">  
									 <el-input style="max-width:90%;" v-model="addForm.seqNo" placeholder="请输入排序序号"> 
									</el-input>  
								</el-form-item>
							</el-col> 
							<el-col :span="8">
								<el-form-item  label="版本号" prop="sinceVersion" >   
									<el-input style="max-width:90%;" v-model="addForm.sinceVersion" placeholder="请输入需求归属的版本号"> 
									</el-input>  
								</el-form-item>   
							</el-col>  
							<el-col :span="8">
								<el-form-item label="截止时间" prop="startTime">  
									 <mdp-date-range type="daterange" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" v-model="addForm" start-key="startTime" end-key="endTime"></mdp-date-range>
								  
								</el-form-item>
							</el-col> 
						</el-row>  
						<el-row>
							<el-form-item label="需求概述" prop="remark">
								<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20}" v-model="addForm.remark" placeholder="什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划" ></el-input>
							</el-form-item>  
						</el-row> 
			</el-form>
			
			<el-drawer title="选择提出人" :visible.sync="proposerSelectVisible" size="60%" append-to-body>
				<users-select  @confirm="onProposerSelected" ref="usersSelect"></users-select>
			</el-drawer>
			
			<el-drawer title="选择跟进人" :visible.sync="mmUserSelectVisible" size="60%" append-to-body>
				<users-select  @confirm="onMmUserSelected" ref="mmUsersSelect"></users-select>
			</el-drawer>
			
		</el-row>
		<el-row class="padding">
			<el-button @click.native="handleCancel">关闭</el-button>  
			<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询 
	import { addXmMenu } from '@/api/xm/core/xmMenu';
	import { mapGetters } from 'vuex'	
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; 

	import MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),
			
			calcMenuLabel(){ 
				;
				var params={label:'用户故事',icon:'el-icon-document',color:' rgb(79, 140, 255)'};
				if(this.addForm.dclass==='1'){
					params={label:'史诗',icon:'el-icon-s-promotion',color:'rgb(255, 153, 51)'};
				}else if(this.addForm.dclass==='2'){
					params={label:'特性',icon:'el-icon-s-flag',color:'rgb(0, 153, 51)'};
				}else if(this.addForm.dclass==='3'){
					params={label:'用户故事',icon:'el-icon-document',color:' rgb(79, 140, 255)'};
				} 
				return params;
			}, 
		},
		props:['xmMenu','visible','parentMenu'],
		watch: { 
	      'visible':function(visible) { 
	      	if(visible==true){ 
				 this.initData();
	      	}
	      } 
	    },
		data() {
			return {
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					menuId: [
						//{ required: true, message: '需求编号不能为空', trigger: 'blur' }
					],					
					menuName: [
						{ required: true, message: '需求名称不能为空', trigger: 'change' },
						{ min: 2, max: 250, message: '长度在 2 到 250 个字符', trigger: 'change' },//长度
					], 
					mmUserid: [
						{ required: true, message: '负责人不能为空', trigger: 'change' }
					], 
					remark: [ 
						{ max: 1000, message: '长度在 0 到 1000 个字符', trigger: 'change' },//长度 
					],
				},
				//新增界面数据 项目需求表
				addForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'0',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'1',mmUserid:'',mmUsername:'',ntype:'0',childrenCnt:0,sinceVersion:'',
					proposerId:'',proposerName:'',dlvl:'0',dtype:'0',priority:'0',source:'1',dclass:'3',
				},
				proposerSelectVisible:false,
				mmUserSelectVisible:false,
				dateRanger:[],
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
				if(this.addForm.productId==null){
					this.$notify({position:'bottom-left',showClose:true,message: '请选择产品/或者上级需求进行新增', type:'error' }); 
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
							}
							if(params.productId==null|| params.productId==''){
								this.$notify({position:'bottom-left',showClose:true,message: '产品编号不能为空', type:'error' }); 
								return;
							}
							if(params.remark=='作为   ，我需要   ，以便我能够   。'){
								params.remark=""
							}
							
							if(this.dateRanger.length>1){
								params.startTime=this.dateRanger[0]
								params.endTime=this.dateRanger[1]
							}
							addXmMenu(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
						});
					}else{
						this.$notify({position:'bottom-left',showClose:true,message:"表单检查不通过，请修改后提交", type: 'error' });
					}
				});
			},
			selectProposer(){
				this.proposerSelectVisible=true;
			},
			onProposerSelected(users){
				if(users && users.length>0){
					this.addForm.proposerId=users[0].userid
					this.addForm.proposerName=users[0].username
				}
				this.proposerSelectVisible=false
			},
			clearProposer:function(){
				this.addForm.proposerId=''
				this.addForm.proposerName=''
			},
			onMmUserSelected(users){
				if(users && users.length>0){
					this.addForm.mmUserid=users[0].userid
					this.addForm.mmUsername=users[0].username
				}
				this.mmUserSelectVisible=false
			},
			clearMmUser:function(){
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
			initData(){
				Object.assign(this.addForm, this.xmMenu);  
				this.addForm.mmUserid=this.userInfo.userid
				this.addForm.mmUsername=this.userInfo.username
				this.addForm.remark=""
				if(this.parentMenu && this.parentMenu.menuId){
					if(this.parentMenu.childrenCnt){
						this.addForm.seqNo=this.parentMenu.seqNo+"."+(this.parentMenu.childrenCnt+1)
					}else{
						this.addForm.seqNo=this.parentMenu.seqNo+"."+1
					} 
					this.addForm.pmenuId=this.parentMenu.menuId
					this.addForm.pmenuName=this.parentMenu.menuName
					this.addForm.menuName=this.parentMenu.menuName+'-请修改补充'
					if(!this.addForm.dclass){
						if(this.parentMenu.dclass==='3'){
							this.addForm.dclass='4'
						}else if(this.parentMenu.dclass==='2'){
							this.addForm.dclass='3'
						}else if(this.parentMenu.dclass==='1'){
							this.addForm.dclass='2'
						}else if(this.parentMenu.dclass==='0'){
							this.addForm.dclass='1'
						}
					}
					
					if(this.addForm.dclass<3){
						this.addForm.calcType="3"
					}else{
						this.addForm.calcType="1"
					}
					
				} 
			}
		},//end method
		components: {  
			//在下面添加其它组件 'xm-menu-edit':XmMenuEdit
			UsersSelect,MdpSelectUserXm
		},
		mounted() {
			
 			initSimpleDicts('all',['demandSource','demandLvl','demandType','priority','menuStatus'] ).then(res=>{
				this.dicts=res.data.data;
			})

			this.initData()
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>


</style>