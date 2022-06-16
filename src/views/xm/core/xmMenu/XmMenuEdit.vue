<template>
	<section>
		<el-row class="page-main ">
			<el-form :model="editForm"  label-width="100px" label-position="left" :rules="editFormRules" ref="editForm">
						<el-row :gutter="10">
							<el-col :span="6">
								<el-form-item label="序号名称" prop="seqNo" >
									<template slot="label">
										<div  class="icon" :style="{backgroundColor: calcMenuLabel.color }">
											<i :class="calcMenuLabel.icon"></i>
										</div>
										{{calcMenuLabel.label}}
									</template>
										<el-input v-model="editForm.seqNo" title="序号 如 1.1，1.2.3，1.3.2等" style="width:100%;" placeholder="如1.0 ， 1.1 ， 1.1.1等"  @change="editXmMenuSomeFields(editForm,'seqNo',$event)"></el-input>

								</el-form-item>
							</el-col>
							<el-col :span="18">
								<el-form-item label="" prop="menuName" label-width="0px">
									<el-input v-model="editForm.menuName" placeholder="名称" title="名称"  @change="editXmMenuSomeFields(editForm,'menuName',$event)"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="10">
							<el-col :span="8">
								<el-form-item label="归属产品" prop="productId">
									<font v-if="editForm.productId">{{editForm.productName?editForm.productName:editForm.productId}}</font>
								</el-form-item>
							</el-col>
							<el-col :span="8">
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
								<el-col  :span="8">
									<el-form-item label="负责人" prop="mmUserid">
										<el-tag type="text" v-if="editForm.mmUserid" closable @close="clearMmUser">{{editForm.mmUsername}}</el-tag>
										<el-button type="text" @click="mmUserSelectVisible=true">选跟进人</el-button>
									</el-form-item>
								</el-col>
						</el-row>

						<el-row :gutter="10">
							<el-col :span="8">
								<el-form-item label="需求状态" prop="status">
									<el-select style="display:block;width:100px;" v-model="editForm.status"  @change="editXmMenuSomeFields(editForm,'status',$event)">
										<el-option v-for="i in this.dicts.menuStatus" :label="i.name" :key="i.id" :value="i.id"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="16">  
								<el-form-item label="时间进度" prop="startTime" >
										<date-range type="daterange" :auto-default="false" :style-object="{display:'inline'}"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" v-model="editForm" start-key="startTime" end-key="endTime"  @change="editXmMenuSomeFields(editForm,'startTime',editForm)"></date-range>
										{{editForm.finishRate?editForm.finishRate:0}}% 

								</el-form-item>    
									
							</el-col>
						</el-row>
					<el-tabs  v-model="activateTabPaneName" >
					<el-tab-pane label="基本信息" name="1" >


						<el-row>
							<el-col :span="12">
								<el-form-item label="提出人" prop="proposerId">
									<el-tag type="text" v-if="editForm.proposerId" closable @close="clearProposer">{{editForm.proposerName}}</el-tag>
									<el-button type="text" @click="selectProposer">选提出人</el-button>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="提出时间" prop="ctime" >
									<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" v-model="editForm.ctime"  @change="editXmMenuSomeFields(editForm,'ctime',$event)"></el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>

							<el-col :span="12">
								<el-form-item  label="需求类型" prop="dtype" >
									<el-select v-model="editForm.dtype"  @change="editXmMenuSomeFields(editForm,'dtype',$event)">
										<el-option v-for="i in this.dicts.demandType" :label="i.name" :key="i.id" :value="i.id"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  label="需求来源" prop="source">
									<el-select v-model="editForm.source"  @change="editXmMenuSomeFields(editForm,'source',$event)">
										<el-option v-for="i in this.dicts.demandSource" :label="i.name" :key="i.id" :value="i.id"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  label="需求层次" prop="dlvl" >
									<el-select v-model="editForm.dlvl"  @change="editXmMenuSomeFields(editForm,'dlvl',$event)">
										<el-option v-for="i in this.dicts.demandLvl" :label="i.name" :key="i.id" :value="i.id"></el-option>
									</el-select>
								</el-form-item>
							</el-col> 
							<el-col :span="12"> 
								<el-form-item  label="优先级" prop="priority" >
									<el-select v-model="editForm.priority" @change="editXmMenuSomeFields(editForm,'priority',$event)">
											<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option>
									</el-select>
								</el-form-item>
							</el-col> 
						</el-row>
					</el-tab-pane >
						<el-tab-pane label="概述" name="4">
							<el-form-item label="需求概述" prop="remark">
								<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20}" v-model="editForm.remark"  @change="editXmMenuSomeFields(editForm,'remark',editForm.remark)" placeholder="什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划" ></el-input>
							</el-form-item> 
						</el-tab-pane>
						<el-tab-pane :label="'子工作项'+(subWorkItemNum>=0?'('+subWorkItemNum+')':'')" name="6">
							 <xm-sub-work-item v-if="this.activateTabPaneName=='6'" :parent-xm-menu="editForm" :link-project-id="selProject?selProject.id:null" @sub-work-item-num="setSubWorkItemNum" @add-sub-menu="onAddSubMenu"></xm-sub-work-item>
						</el-tab-pane>
						<el-tab-pane :label="'工时('+editForm.actWorkload+' h)'" name="2">
							
							<el-form-item label="预估工期" prop="budgetHours">
								<el-input-number :disabled="editForm.calcType!=='2'  " style="width:200px;"  v-model="editForm.budgetHours"  :precision="2" :step="8" :min="0" placeholder="预计工期(小时)"></el-input-number> &nbsp;h
							</el-form-item>
							<el-form-item label="预估工时" prop="budgetWorkload">
								<el-input-number :disabled="editForm.calcType!=='2'  " style="width:200px;"  v-model="editForm.budgetWorkload" :precision="2" :step="8" :min="0" placeholder="预计工时(小时)"></el-input-number>  &nbsp;h
							</el-form-item>
							<el-form-item label="实际工时" prop="actWorkload">
								<el-input-number :disabled="editForm.calcType!=='2'  " style="width:200px;"  v-model="editForm.actWorkload" :precision="2" :step="8" :min="0" placeholder="实际工时(小时)"></el-input-number> &nbsp;h
							</el-form-item>  
						</el-tab-pane>
						<el-tab-pane label="成本" name="3">
							<el-form-item label="预估金额" prop="budgetAt">
								<el-input-number :disabled="editForm.calcType!=='2'  "  style="width:200px;"  v-model="editForm.budgetAt" :precision="2" :step="100" :min="0" placeholder="预算金额"></el-input-number>   元
							</el-form-item>
							<el-form-item label="实际金额" prop="actAt">
								<el-input-number :disabled="editForm.calcType!=='2'  "  style="width:200px;"  v-model="editForm.actAt" :precision="2" :step="100" :min="0" placeholder="实际金额"></el-input-number>   元
							</el-form-item>
						</el-tab-pane>
					<el-tab-pane label="链接" name="5">
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

							<el-row class="padding">
 								<el-button v-loading="load.edit" type="primary" @click.native="editXmMenuSomeFields(editForm,'link',{demandUrl:editForm.demandUrl,codeUrl:editForm.codeUrl,designUrl:editForm.designUrl,operDocUrl:editForm.operDocUrl})" :disabled="load.edit==true">提交链接</el-button>
							</el-row>
					</el-tab-pane>
					<el-tab-pane label="wiki" name="7">
						关联知识库
					</el-tab-pane>
					<el-tab-pane label="附件" name="8">
						上传附件
					</el-tab-pane>
					<el-tab-pane label="关注" name="91"> 
						<xm-my-do-focus v-if="activateTabPaneName=='91'" :biz-id="editForm.menuId" :pbiz-id="editForm.productId" :biz-name="editForm.menuName" focus-type="4"></xm-my-do-focus>
					</el-tab-pane>
					<el-tab-pane label="日志" name="9">
						 <xm-record v-if="activateTabPaneName=='9'"  :biz-id="editForm.menuId" :obj-type="'menu'"></xm-record>
					</el-tab-pane>
				</el-tabs>
			</el-form>
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
	import {listXmMenuWithState,editXmMenu,editXmMenuSomeFields } from '@/api/xm/core/xmMenu';
	import { mapGetters } from 'vuex'
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
import XmMenuOverview from './XmMenuOverview.vue';
import XmMenuExchangeMng from '../xmMenuExchange/XmMenuExchangeMng.vue';
  	import TagMng from "@/views/mdp/arc/tag/TagMng";
	import XmSubWorkItem from "@/views/xm/core/xmMenuWorkItem/XmSubWorkItem";
	import XmRecord from '../xmRecord/XmRecord'  
	import XmMyDoFocus from '../xmMyFocus/XmMyDoFocus.vue';

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
					params={label:'故事',icon:'el-icon-document',color:' rgb(79, 140, 255)'};
				}
				return params;
			},
		},
		props:['xmMenu','visible','parentMenu','product','dclass','selProject','reload'],
		watch: {
	      'xmMenu':function( xmMenu ) {
	        //this.editForm = {...xmMenu};
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
				
				if(this.reload==true){
					this.searchXmMenus();
				}else{
					this.editForm = {...this.xmMenu}; 
				}
				this.activateTabPaneName="4"
				this.editFormBak=Object.assign({},this.editForm)
	      	}
	      },
			'editForm.actWorkload':function(val,oldVal){
				if(!this.editForm.budgetWorkload){
					return;
				}
				if(val==0||!val){
					return;
				}
				this.editForm.finishRate=Math.round(val/this.editForm.budgetWorkload*100)
				if( this.editForm.finishRate>100){
					this.editForm.finishRate=100;
				}
			},
			'editForm.budgetWorkload':function(val,oldVal){
				if(!this.editForm.actWorkload){
					return;
				}
				if(val==0||!val){
					return;
				}
				this.editForm.finishRate=Math.round(this.editForm.actWorkload/val*100)
				if( this.editForm.finishRate>100){
					this.editForm.finishRate=100;
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
						{ required: true, message: '需求名称不能为空', trigger: 'change' },
						{ min: 2, max: 250, message: '长度在 2 到 250 个字符', trigger: 'change' },//长度
					],
					seqNo: [
						{ required: true, message: '序号不能为空', trigger: 'change' }
					],
					mmUserid: [
						{ required: true, message: '负责人不能为空', trigger: 'change' }
					], 
					remark: [ 
						{ max: 1000, message: '长度在 0 到 1000 个字符', trigger: 'change' },//长度 
					],
				},
				//新增界面数据 项目需求表
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'1',mmUserid:'',mmUsername:'',ntype:'0',childrenCnt:0,sinceVersion:'',
						proposerId:'',proposerName:'',dlvl:'',dtype:'',priority:'',source:'',calcType:'1',actWorkload:0,actAt:0,finishRate:0,ctime:'',dclass:'1',startTime:'',endTime:''
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
				subWorkItemNum:-1,
				activateTabPaneName:'1'
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			setSubWorkItemNum(val){
				this.subWorkItemNum=val;
			},
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
 				this.$emit('cancel');
			},
			//新增提交XmMenu 项目需求表 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {
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
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.edit=false);
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
					this.editForm.proposerId=users[0].userid
					this.editForm.proposerName=users[0].username
				}
				this.editXmMenuSomeFields(this.editForm,'proposerId',{proposerId:this.editForm.proposerId,proposerName:this.editForm.proposerName})

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
				this.editXmMenuSomeFields(this.editForm,'mmUserid',users)
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
			editXmMenuSomeFields(row,fieldName,$event){
				var params={menuIds:[row.menuId]};
				if(fieldName==='iterationId'){
					if($event){
						params[fieldName]=$event.id;
						params.iterationName=$event.iterationName
					}else{
						return;
					}
				}else if(fieldName==='tagIds'){
					if($event){
						params[fieldName]=$event.map(i=>i.tagId).join(",");
						params.tagNames=$event.map(i=>i.tagName).join(",");
					}else{
						return;
					}
				}else if(fieldName==='workload'){
					params={...params,...$event}
				}else if(fieldName==='mmUserid'){
					params.mmUserid=$event[0].userid
					params.mmUsername=$event[0].username
				}else if(fieldName==='startTime'){
					params.startTime=$event.startTime
					params.endTime=$event.endTime
				}else{
					if(typeof $event ==='string'){
						params[fieldName]=$event
					}else{
						params={...params,...$event}
					}
				}

				var func=(params)=>{
					editXmMenuSomeFields(params).then(res=>{ 
						var tips = res.data.tips;
						if(tips.isOk){
							Object.assign(row,params)
							Object.assign(this.editFormBak,row)
							this.$emit("edit-fields",params);
							if(fieldName==='remark'||fieldName==='link'){
								this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
							}
						}else{ 
							Object.assign(this.editForm,this.editFormBak)
							this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
						}
					})
				}
				
				if(fieldName=='remark'){
					this.$refs.editForm.validateField('remark',err=>{
						if(err){ 
							this.$notify({position:'bottom-left',showClose:true,message: err,type: 'error'})
							return;
						}else{
							func(params)
						}
					})
				}else if(fieldName=='menuName'){  
					this.$refs.editForm.validateField('menuName',err=>{
						if(err){
							this.$notify({position:'bottom-left',showClose:true,message: err,type: 'error'})
							return;
						}else{
							func(params)
						}
					})
				}else{
					func(params)
				}
			},
			onAddSubMenu(menu){
				
				this.$emit("add-sub-menu",menu)
			},
			searchXmMenus(){
				let callback= (res)=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.editForm=res.data.data[0]  
						this.editFormBak=Object.assign({},this.editForm)
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}
				this.load.list = true; 
				var params={menuId:this.xmMenu.menuId}
					listXmMenuWithState(params).then( callback ).catch( err => this.load.list = false ); 
			}
		},//end method
		components: {
			//在下面添加其它组件 'xm-menu-edit':XmMenuEdit
			UsersSelect,
			XmMenuOverview,
			TagMng,
			XmMenuExchangeMng,
			XmSubWorkItem,
			XmRecord,
			XmMyDoFocus
		},
		mounted() {


 			initSimpleDicts('all',['demandSource','demandLvl','demandType','priority','menuStatus'] ).then(res=>{
				this.dicts=res.data.data;
			})
			this.editForm=Object.assign(this.editForm, this.xmMenu); 
			this.editFormBak=Object.assign({},this.editForm)
			if(this.reload==true){
				this.searchXmMenus();
			}
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
