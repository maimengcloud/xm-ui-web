<template>
	<section class="page-container border padding">
		<el-row class="page-main ">
			<el-tabs>
				<el-tab-pane  :label="calcMenuLabel.label+'详情'">
					<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm"> 
						<el-row class="padding-bottom"> 
						<el-steps :active="calcMenuCurrStep"   finish-status="success" align-center>
							<el-step v-for="(item,index) in dicts.menuStatus" @click.native="on_click(item.id)" :title="item.name" :key="index"></el-step> 
						</el-steps>
						</el-row> 
						<el-collapse value="1" accordion>
						<el-collapse-item title="基本信息" name="1" > 
							<el-row> 
								<el-col :span="6">
									<el-form-item label="calcMenuLabel.label" prop="seqNo" >
										<template slot="label">
											<div  class="icon" :style="{backgroundColor: calcMenuLabel.color }">
													<i :class="calcMenuLabel.icon"></i>
												</div>  
												{{calcMenuLabel.label}}
										</template>
										<el-input v-model="editForm.seqNo" style="width:100%;" placeholder="如1.0 ， 1.1 ， 1.1.1等" ></el-input> 
									</el-form-item>  
								</el-col>
								<el-col :span="18">
									<el-form-item label="" prop="menuName" label-width="0px">
										<el-input v-model="editForm.menuName" placeholder="名称" > 
										</el-input>
									</el-form-item>   
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="归属产品" prop="productId">
										<font v-if="editForm.productId">{{editForm.productName?editForm.productName:editForm.productId}}</font>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item v-if="!editForm.pmenuId" :label="editForm.dclass==='3'?'归属特性':(editForm.dclass==='2'?'归属史诗':'归属')" prop="pmenuId">
										无
									</el-form-item>  
									
									<el-form-item  v-else :label="editForm.dclass==='3'?'归属特性':(editForm.dclass==='2'?'归属史诗':'归属')" prop="pmenuId">  
										<div   v-if="editForm.dclass==='2'"  class="icon" style="background-color:  rgb(255, 153, 51);">
											<i class="el-icon-s-promotion"></i>
										</div> 
										<div   v-if="editForm.dclass==='3'"  class="icon" style="background-color:  rgb(0, 153, 51);">
											<i class="el-icon-s-flag"></i>
										</div> 
										  {{editForm.pmenuName?editForm.pmenuName:editForm.pmenuId}} 
									</el-form-item>  
								</el-col>
							</el-row> 
							<el-row> 
								
								<el-col :span="12">
									<el-form-item  label="需求类型" prop="dtype" >   
										<el-select v-model="editForm.dtype">
											<el-option v-for="i in this.dicts.demandType" :label="i.name" :key="i.id" :value="i.id"></el-option>
										</el-select>  
									</el-form-item>   
								</el-col>
								<el-col :span="12">
									<el-form-item  label="需求来源" prop="source">   
										<el-select v-model="editForm.source">
											<el-option v-for="i in this.dicts.demandSource" :label="i.name" :key="i.id" :value="i.id"></el-option>
										</el-select>  
									</el-form-item>   
								</el-col> 
								<el-col :span="12">
									<el-form-item  label="需求层次" prop="dlvl" >   
										<el-select v-model="editForm.dlvl">
											<el-option v-for="i in this.dicts.demandLvl" :label="i.name" :key="i.id" :value="i.id"></el-option>
										</el-select>  
									</el-form-item>   
								</el-col>
								<el-col :span="12">
								<el-form-item  label="优先级" prop="priority" >  
									<el-select v-model="editForm.priority">
											<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option> 
									</el-select>    
								</el-form-item>  
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="12">
									<el-form-item label="提出人" prop="proposerId">
										<el-tag type="text" v-if="editForm.proposerId" closable @close="clearProposer">{{editForm.proposerName}}</el-tag> 
										<el-button type="text" @click="selectProposer">选提出人</el-button>
									</el-form-item>   
								</el-col>
								<el-col  :span="12">
									<el-form-item label="跟进人" prop="mmUserid">
										<el-tag type="text" v-if="editForm.mmUserid" closable @close="clearMmUser">{{editForm.mmUsername}}</el-tag> 
										<el-button type="text" @click="mmUserSelectVisible=true">选跟进人</el-button>
									</el-form-item>   
								</el-col>
							</el-row>
						</el-collapse-item>
						<el-collapse-item title="需求概述" name="4"> 
							<el-form-item label="需求概述" prop="remark">
								<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20}" v-model="editForm.remark" placeholder="什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划" ></el-input>
							</el-form-item>  
						</el-collapse-item> 
						<el-collapse-item title="工期与工作量预估" name="2">
							<el-form-item label="预估工期" prop="budgetHours">
								<el-input-number style="width:200px;"  v-model="editForm.budgetHours"  :precision="2" :step="8" :min="0" placeholder="预计工期(小时)"></el-input-number>&nbsp;小时
							</el-form-item> 
							<el-form-item label="预估工作量" prop="budgetWorkload">
								<el-input-number style="width:200px;"  v-model="editForm.budgetWorkload" :precision="2" :step="8" :min="0" placeholder="预计总工作量(人时,不包括下一级)"></el-input-number> <el-tag>人时，{{this.toFixed(editForm.budgetWorkload/8/20)}}人月</el-tag>
							</el-form-item> 
							<el-form-item label="预估金额" prop="budgetAmount">
								<el-input-number style="width:200px;"  v-model="editForm.budgetAmount" :precision="2" :step="100" :min="0" placeholder="预算金额"></el-input-number>   元 
							</el-form-item> 
							<font color="red" style="font-size:10px;">控制规则：下级预估工作量总和不能大于上级预估工作量</font>
						</el-collapse-item>
						<el-collapse-item title="进度与实际工作量填报" name="3">
							<el-form-item label="数据收集方式" prop="calcType"> 
								<el-radio   v-model="editForm.calcType"  label="3" placeholder="下级往上级汇总" :disabled="editForm.ntype==='0'">下级往上级汇总</el-radio>
 								<el-radio   v-model="editForm.calcType"  label="1" placeholder="由任务汇总" :disabled="editForm.ntype==='1'">由任务汇总</el-radio> 
								<el-radio   v-model="editForm.calcType"  label="2" placeholder="手工填报" :disabled="editForm.ntype==='1'">手工填报</el-radio>
							</el-form-item> 
							<el-form-item label="当前进度" prop="mactRate" v-if="editForm.calcType==='2'">
								<el-input-number style="width:200px;" v-model="editForm.mactRate" :precision="2" :step="5" :min="0" :max="100" placeholder="进度"></el-input-number> &nbsp;%
							</el-form-item> 
							<el-form-item label="实际工作量" prop="mactWorkload" v-if="editForm.calcType==='2'">
								<el-input-number style="width:200px;"  v-model="editForm.mactWorkload" :precision="2" :step="8" :min="0" placeholder="实际总工作量(人时)"></el-input-number> <el-tag>人时，{{this.toFixed(editForm.budgetWorkload/8/20)}}人月</el-tag>
							</el-form-item> 
							<el-form-item label="实际金额" prop="mactAmount" v-if="editForm.calcType==='2'">
								<el-input-number style="width:200px;"  v-model="editForm.mactAmount" :precision="2" :step="100" :min="0" placeholder="实际金额"></el-input-number>   元 
							</el-form-item> 
							<font color="red" style="font-size:10px;">控制规则:
								<br>下级往上汇总：指需求池的数据来自直接下级的需求池(需求)的数据之和。逐级往上汇总。
								<br>由任务汇总： 指需求(不包括需求池)的数据来自与该需求关联的任务的数据之和。
								<br>手工填报：  指需求(不包括需求池)的数据来自手工填报，无论是否关联了任务，都不从任务汇总。
							</font>
						</el-collapse-item>
						<el-collapse-item title="相关链接" name="4"> 
							<el-form-item label="需求链接" prop="demandUrl"> 
								<el-input v-model="editForm.demandUrl" placeholder="需求链接" ></el-input> 
							</el-form-item>  
							<el-form-item label="代码链接" prop="codeUrl">
								<el-input v-model="editForm.codeUrl" placeholder="代码链接" ></el-input>  
							</el-form-item>  
							<el-form-item label="设计链接" prop="designUrl">
								<el-input v-model="editForm.designUrl" placeholder="设计链接" ></el-input>  
							</el-form-item>   
							<el-form-item label="操作手册链接" prop="operDocUrl">
								<el-input v-model="editForm.operDocUrl" placeholder="操作手册链接" ></el-input>  
							</el-form-item>  
						</el-collapse-item> 
						</el-collapse>
					</el-form> 
					<el-row class="padding">
						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
					</el-row>
				</el-tab-pane>
				<el-tab-pane  label="概览" lazy>
					<xm-menu-overview :xm-menu="xmMenu"></xm-menu-overview>
				</el-tab-pane>
				
				<el-tab-pane  label="需求评论" lazy>
					<xm-menu-exchange-mng :xm-menu="xmMenu"></xm-menu-exchange-mng>
				</el-tab-pane>
			</el-tabs>
			<el-drawer title="选择提出人" :visible.sync="proposerSelectVisible" size="60%" append-to-body>
				<users-select  @confirm="onProposerSelected" ref="usersSelect"></users-select>
			</el-drawer>
			
			<el-drawer title="选择跟进人" :visible.sync="mmUserSelectVisible" size="60%" append-to-body>
				<users-select  @confirm="onMmUserSelected" ref="mmUsersSelect"></users-select>
			</el-drawer>
		</el-row>
			
			<el-drawer append-to-body title="标签" :visible.sync="tagSelectVisible" class="dialog-body" size="60%">
				<tag-mng :tagIds="editForm.tagIds?editForm.tagIds.split(','):[]" :jump="true" @select-confirm="onTagSelected">
				</tag-mng>
			</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { editXmMenu } from '@/api/xm/core/xmMenu';
	import { mapGetters } from 'vuex'
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
import XmMenuOverview from './XmMenuOverview.vue';
import XmMenuExchangeMng from '../xmMenuExchange/XmMenuExchangeMng.vue';
  	import TagMng from "@/views/mdp/arc/tag/TagMng";


	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),
			calcMenuCurrStep(){
				var menuStatus= this.dicts.menuStatus
				if(!menuStatus){
					return 1;
				}else{
					var status=menuStatus.findIndex(i=>this.editForm.status==i.id)
					if(status>=0){
						return status+1;
					}else{
						return 1;
					}
				}
			},
			calcMenuLabel(){ 
				var params={label:'工作项',icon:'',color:''};
				if(this.editForm.dclass==='1'){
					params={label:'史诗',icon:'el-icon-s-promotion',color:'rgb(255, 153, 51)'};
				}else if(this.editForm.dclass==='2'){
					params={label:'特性',icon:'el-icon-s-flag',color:'rgb(0, 153, 51)'};
				}else if(this.editForm.dclass==='3'){
					params={label:'用户故事',icon:'el-icon-document',color:' rgb(79, 140, 255)'};
				} 
				return params;
			}, 
		},
		props:['xmMenu','visible','parentMenu','product','dclass'],
		watch: {
	      'xmMenu':function( xmMenu ) {
	        this.editForm = xmMenu;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      }
	    },
		data() {
			return {
				//dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
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
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'1',mmUserid:'',mmUsername:'',ntype:'0',childrenCnt:0,sinceVersion:'',
						proposerId:'',proposerName:'',dlvl:'',dtype:'',priority:'',source:'',calcType:'1',mactWorkload:0,mactAmount:0,mactRate:0
				},
				proposerSelectVisible:false,
				mmUserSelectVisible:false,
				dicts:{
					menuStatus:[
						
							{id:"0", name:"初始"},
							{id:"1", name:"待评审"},
							{id:"2", name:"待设计"},
							{id:"3", name:"待开发"},
							{id:"4", name:"待SIT"},
							{id:"5", name:"待UAT"},
							{id:"6", name:"待上线"},
							{id:"7", name:"运行中"},
							{id:"8", name:"已下线"},
							{id:"9", name:"已删除"}, 
					]
				},
				tagSelectVisible:false,
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
 				this.$emit('cancel');
			},
			//新增提交XmMenu 项目需求表 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {

				if(!this.roles.some(i=>i.roleid=='productAdmin') && !this.roles.some(i=>i.roleid=='productTeamAdmin')){
					this.$notify({showClose: true, message: "只有产品经理、产品组长能够修改需求", type: 'error'});
					return false;
				}
				this.$refs.editForm.validate((valid) => {
					if (valid) {

						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							editXmMenu(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.edit=false);
						});
					}else{
						this.$notify({showClose: true, message:"表单检查不通过，请修改后提交", type: 'error' });
					}
				});
			},
			selectProposer(){
				this.proposerSelectVisible=true;
			},
			onProposerSelected(users){
				if(users && users.length>0){
					this.editForm.proposerId=users[0].userid
					this.editForm.proposerName=users[0].username
				}
				this.proposerSelectVisible=false
			},
			clearProposer:function(){
				this.editForm.proposerId=''
				this.editForm.proposerName=''
			},
			onMmUserSelected(users){
				if(users && users.length>0){
					this.editForm.mmUserid=users[0].userid
					this.editForm.mmUsername=users[0].username
				}
				this.mmUserSelectVisible=false
			},
			clearMmUser:function(){
				this.editForm.mmUserid=''
				this.editForm.mmUsername=''
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			on_click(status){
				this.editForm.status=status;
			},
			onTagSelected(tags) {
				this.tagSelectVisible = false; 
				if(tags && tags.length>0){ 
					this.editForm.tagIds=tags.map(i=>i.tagId).join(",")
					this.editForm.tagNames=tags.map(i=>i.tagName).join(",")
				}else{
					this.editForm.tagIds=""
					this.editForm.tagNames=""
				}
			},
			/**end 在上面加自定义方法**/

			toFixed(floatValue){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					return parseFloat(floatValue).toFixed(2);
				}
			},
		},//end method
		components: {
			//在下面添加其它组件 'xm-menu-edit':XmMenuEdit
			UsersSelect,
			XmMenuOverview,
			TagMng,
			XmMenuExchangeMng,
		},
		mounted() {
			
			
 			initSimpleDicts('all',['demandSource','demandLvl','demandType','priority','menuStatus'] ).then(res=>{
				this.dicts=res.data.data;
			})
			this.editForm=Object.assign(this.editForm, this.xmMenu);
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

.icon {
  color: #fff;
  height: 20px;
  width: 20px;
  border-radius: 15px;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  display: inline-block;
  margin-right: 5px;
} 
</style>
