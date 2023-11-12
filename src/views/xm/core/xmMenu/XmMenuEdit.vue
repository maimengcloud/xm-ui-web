<template>
	<section>
		<el-row :gutter="20" >
			<el-col :span="4" class="border padding">
				<h3 class="padding-bottom">
					<div  class="big-icon" :style="{backgroundColor: calcMenuLabel.color }">
						<i :class="calcMenuLabel.icon"></i>
					</div>
					{{calcMenuLabel.label}}
				</h3>
				<el-steps :active="calcMenuCurrStep" align-center   finish-status="success" process-status="process" direction="vertical">
					<el-step v-for="(item,index) in dicts.menuStatus" :title="item.name" :description="item.name" :key="index">
						<span slot="description">
								<span v-if="item.id=='0'"><!--打开-->

									<el-button class="step-btn"  type="primary"   @click="activateTabPaneName='1'" plain>基础信息</el-button>
									<el-button class="step-btn"  type="primary"   @click="activateTabPaneName='4'" plain>概述</el-button>
									<span v-if="item.id==editForm.status">
										<el-button class="step-btn" type="danger"   icon="el-icon-d-caret" @click="editXmMenuSomeFields(editForm,'status','1')" plain>设为进行中</el-button>
									</span>
								</span>
								<span v-else-if="item.id=='1'"> <!--执行中-->
									<span v-if="item.id==editForm.status">
										<span v-if="editForm.dclass<='1'">
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='6'" plain>创建特性</el-button>
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='6'" plain>创建故事</el-button>
										</span>
										<span v-else-if="editForm.dclass=='2'">
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='6'" plain>创建故事</el-button>
										</span>
										<span v-else-if="editForm.dclass>='3'">
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='6'" plain>创建任务</el-button>
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='62'" plain>测试用例</el-button>
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='6'" plain>创建缺陷</el-button>
										</span>
										<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='3'" plain>成本</el-button>
										<el-button class="step-btn" type="danger"   icon="el-icon-d-caret" @click="editXmMenuSomeFields(editForm,'status','2')" plain>设为已完工</el-button>
									</span>
									<span v-if="item.id!=editForm.status">
										<span v-if="editForm.dclass<='1'">
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='6'" plain>创建特性</el-button>
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='6'" plain>创建故事</el-button>
										</span>
										<span v-else-if="editForm.dclass=='2'">
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='6'" plain>创建故事</el-button>
										</span>
										<span v-else-if="editForm.dclass>='3'">
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='6'" plain>创建任务</el-button>
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='62'" plain>测试用例</el-button>
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='6'" plain>创建缺陷</el-button>
										</span>
										<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='3'" plain>成本</el-button>
 									</span>
								</span>
								<span v-else-if="item.id=='2'"> <!--已完工-->
									<span v-if="item.id==editForm.status">
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='7'" plain>wiki</el-button>
											<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='8'" plain>附件</el-button>
										<el-button class="step-btn" type="danger"   icon="el-icon-d-caret" @click="editXmMenuSomeFields(editForm,'status','3')" plain>去关闭</el-button>
									</span>
									<span v-if="item.id!=editForm.status">
										<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='7'" plain>wiki</el-button>
										<el-button class="step-btn"  type="primary"  @click="activateTabPaneName='8'" plain>附件</el-button>

 									</span>
 								</span>
								<span v-else-if="item.id=='3'"> <!--已关闭-->
									<span v-if="item.id==editForm.status">
										<el-button class="step-btn" type="danger"   icon="el-icon-d-caret" @click="editXmMenuSomeFields(editForm,'status','0')" plain>去重新打开</el-button>
									</span>
 								</span>
						</span>
					</el-step>
				</el-steps>
			</el-col>
			<el-col :span="20">
			<el-form :model="editForm"  label-width="100px" label-position="left" :rules="editFormRules" ref="editForm">

								<el-form-item prop="menuName">
									<template slot="label">
										<div  class="big-icon" :style="{backgroundColor: calcMenuLabel.color }">
											<i :class="calcMenuLabel.icon"></i>
										</div>
										{{calcMenuLabel.label}}
									</template>
									<el-input v-model="editForm.menuName" placeholder="名称" title="名称" @change="editXmMenuSomeFields(editForm,'menuName',$event)">
									</el-input>
									<el-row class="label-font-color">
										编号：{{editForm.menuId}}
										<el-divider direction="vertical"></el-divider>
										<span v-if="editForm.productName">归属产品：{{ editForm.productName}}
											<el-divider direction="vertical"></el-divider>
										</span>
											归属产品编号：{{ editForm.productId }}

										<el-divider direction="vertical"></el-divider>
										<el-button type="text" icon="el-icon-share" @click="copyLink">分享</el-button>
										</el-row>
								</el-form-item>
						<el-row class="padding">
								<el-col :span="8">
									<mdp-field show-style="x" size="medium" v-if="!editForm.pmenuId" v-model="editForm.pmenuId" :disabled="true" label="上级需求">

									</mdp-field>

									<mdp-field show-style="x" size="medium" v-else v-model="editForm.pmenuId" :label="editForm.dclass==='3'?'归属特性':(editForm.dclass==='2'?'归属史诗':'归属')" :icon="editForm.dclass==='2'?'el-icon-s-promotion':'el-icon-s-flag'" :color="editForm.dclass==='2'?'rgb(255, 153, 51)':'rgb(0, 153, 51)'">
										<div slot="oper">
										<el-button
											@click="pmenuFormVisible=true"
											title="查看上级"
											icon="el-icon-upload2"> 查看上级</el-button>

										<el-button
											@click="parentMenuVisible=true"
											title="更换上级"
											icon="el-icon-upload2"> 更换上级</el-button>
											</div>
									</mdp-field>
								</el-col>
								<el-col  :span="8">
                  <mdp-select-user show-style="x" size="medium" label="负责人" v-model="editForm.mmUserid"  @change2="editXmMenuSomeFields(editForm,'mmUserid',$event)"></mdp-select-user>
 								</el-col>
								<el-col  :span="8">
                  <mdp-select-user show-style="x" size="medium" label="提出人" v-model="editForm.proposerId"  @change2="editXmMenuSomeFields(editForm,'proposerId',$event)"></mdp-select-user>
 								</el-col>
						</el-row>

						<el-row class="padding">
							<el-col :span="8">
									<mdp-select  show-style="x" size="medium" label="状态" v-model="editForm.status" item-code="menuStatus" @change="editXmMenuSomeFields(editForm,'status',$event)">
 									</mdp-select>
							</el-col>

							<el-col :span="8">
								<mdp-field show-style="x" size="medium" v-model="editForm.finishRate" label="进度">
									<div slot="value" style="min-width:150px;"><el-progress  :percentage="editForm.finishRate?editForm.finishRate:0"></el-progress>
									</div>
									<div slot="oper"><el-button  @click="activateTabPaneName='51'" type="primary">查看工时</el-button><el-button  @click="activateTabPaneName='6'" type="primary">查看子工作项</el-button></div>
								</mdp-field>
							</el-col>
							<el-col :span="8">
 										<mdp-date-range show-style="tag" label="起止时间" type="daterange" :style-obj="{maxWidth:'100%'}" :auto-default="false"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" v-model="editForm" start-key="startTime" end-key="endTime"  @change="editXmMenuSomeFields(editForm,'startTime',editForm)"></mdp-date-range>

 							</el-col>
						</el-row>
					<el-tabs  v-model="activateTabPaneName" >
					<el-tab-pane label="基本信息" name="1" >


						<el-row>

							<el-col :span="12">
								<el-form-item  label="归属模块" prop="funcName" v-if="editForm.dclass>='3'">
									{{ editForm.funcName }}
										<el-button
											@click="funcVisible=true"
											title="设置模块" > 设置</el-button>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="排序序号" prop="seqNo" >
										<el-input style="max-width:90%;" v-model="editForm.seqNo" title="序号 如 1.1，1.2.3，1.3.2等" placeholder="如1.0 ， 1.1 ， 1.1.1等"  @change="editXmMenuSomeFields(editForm,'seqNo',$event)"></el-input>

								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  label="版本号" prop="sinceVersion" >
									<el-input style="max-width:90%;" v-model="editForm.sinceVersion" @change="editXmMenuSomeFields(editForm,'sinceVersion',$event)">
									</el-input>
								</el-form-item>
							</el-col>

							<el-col :span="12">
								<el-form-item label="提出时间" prop="ctime" >
									<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" v-model="editForm.ctime"  @change="editXmMenuSomeFields(editForm,'ctime',$event)"></el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  label="需求类型" prop="dtype" >
									<mdp-select item-code="demandType" v-model="editForm.dtype"  @change="editXmMenuSomeFields(editForm,'dtype',$event)">
 									</mdp-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  label="需求来源" prop="source">
									<mdp-select item-code="demandSource" v-model="editForm.source"  @change="editXmMenuSomeFields(editForm,'source',$event)">
 									</mdp-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  label="需求层次" prop="dlvl" >
									<mdp-select item-code="demandLvl" v-model="editForm.dlvl"  @change="editXmMenuSomeFields(editForm,'dlvl',$event)">
 									</mdp-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  label="优先级" prop="priority" >
									<mdp-select item-code="priority" v-model="editForm.priority" @change="editXmMenuSomeFields(editForm,'priority',$event)">
 									</mdp-select>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane >
						<el-tab-pane label="概述" name="4">
							<el-form-item prop="remark" label-width="0px">
								<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20}" v-model="editForm.remark"  @change="editXmMenuSomeFields(editForm,'remark',editForm.remark)" placeholder="什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划" ></el-input>
							</el-form-item>
						</el-tab-pane>
						<el-tab-pane :label="'子工作项( '+(subWorkitemCpd?subWorkitemCpd:0)+' )'" name="6">
							 <xm-sub-work-item v-if="this.activateTabPaneName=='6'" :parent-xm-menu="editForm" :link-project-id="selProject?selProject.id:null" @sub-work-item-num="setSubWorkItemNum" @add-sub-menu="onAddSubMenu"></xm-sub-work-item>
						</el-tab-pane>
						<el-tab-pane :label="'测试用例('+(editForm.testCases?editForm.testCases:0)+')'" name="62">
							 <xm-test-case-mng  v-if="activateTabPaneName=='62'" :xm-product="{id:editForm.productId,productName:editForm.productName}" :xm-menu="editForm"></xm-test-case-mng>
						</el-tab-pane>
						<el-tab-pane :label="'缺陷('+(editForm.bugCnt?editForm.bugCnt:0)+')'" name="63">
							<xm-question-mng v-if="activateTabPaneName=='63'" :xm-product="editForm.productId?{id:editForm.productId,productName:editForm.productName}:null" :xm-menu="editForm"></xm-question-mng>
						</el-tab-pane>
						<el-tab-pane label="成本" name="3">
							<el-form-item label="预估金额" prop="budgetAt">
								<el-input-number :disabled="editForm.calcType!=='2'  "  style="width:200px;"  v-model="editForm.budgetAt" :precision="2" :step="100" :min="0" placeholder="预算金额"></el-input-number>   元
							</el-form-item>
							<el-form-item label="实际金额" prop="actAt">
								<el-input-number :disabled="editForm.calcType!=='2'  "  style="width:200px;"  v-model="editForm.actAt" :precision="2" :step="100" :min="0" placeholder="实际金额"></el-input-number>   元
							</el-form-item>
						</el-tab-pane>


					<el-tab-pane :label="'工时( '+(editForm.actWorkload?editForm.actWorkload:0)+' / '+(editForm.budgetWorkload?editForm.budgetWorkload:0)+' h )'" name="51">
						 <xm-workload-record v-if="activateTabPaneName=='51'" biz-type="5" :xm-menu="editForm" ></xm-workload-record>
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
						<archive-edit v-if="activateTabPaneName=='7' && editForm && editForm.menuId" :xm-menu="editForm"></archive-edit>
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
					<el-tab-pane label="评论区" name="10">
						 <comment-area v-if="activateTabPaneName=='10'"  :target-id="editForm.menuId"></comment-area>
					</el-tab-pane>
				</el-tabs>
			</el-form>
			</el-col>
			</el-row>
			<el-drawer title="选择提出人" :visible.sync="proposerSelectVisible" size="60%" append-to-body>
				<users-select  @confirm="onProposerSelected" ref="usersSelect"></users-select>
			</el-drawer>

			<el-drawer title="选择跟进人" :visible.sync="mmUserSelectVisible" size="60%" append-to-body>
				<users-select  @confirm="onMmUserSelected" ref="mmUsersSelect"></users-select>
			</el-drawer>


			<el-drawer append-to-body title="标签" :visible.sync="tagSelectVisible" class="dialog-body" size="60%">
				<tag-mng :tagIds="editForm.tagIds?editForm.tagIds.split(','):[]" :jump="true" @select-confirm="onTagSelected">
				</tag-mng>
			</el-drawer>

				<el-dialog title="上级需求详情" :visible.sync="pmenuFormVisible" :with-header="false" width="90%" top="20px"    append-to-body   :close-on-click-modal="false" >
					<xm-menu-edit v-if="pmenuFormVisible" :reload="true" :xm-menu="{menuId:editForm.pmenuId}" :sel-project="selProject" :visible="pmenuFormVisible" @cancel="pmenuFormVisible=false"></xm-menu-edit>
				</el-dialog>

		<el-drawer
		append-to-body
		title="选择上级需求"
		:visible.sync="parentMenuVisible"
		size="60%"
		:close-on-click-modal="false"
		>
		<xm-epic-features-select
			@select="onParentMenuSelected"
			:xm-product="{id:editForm.productId,productName:editForm.productName}"
		></xm-epic-features-select>
		</el-drawer>
		<el-dialog append-to-body title="模块选择"  :visible.sync="funcVisible" size="40%" top="20px"  :close-on-click-modal="false">
			<xm-func-select :show-select="true" class="padding-left padding-right" v-if="funcVisible"  @select="onFuncSelected" :xm-product="{id:editForm.productId,productName:editForm.productName}"></xm-func-select>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库

	import {listXmMenuWithState,editXmMenu,editXmMenuSomeFields,batchChangeParentMenu } from '@/api/xm/core/xmMenu';
	import { mapGetters } from 'vuex'
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
	import XmMenuOverview from './XmMenuOverview.vue';
  	import TagMng from "@/views/mdp/arc/tag/TagMng";
	import XmSubWorkItem from "@/views/xm/core/xmMenuWorkItem/XmSubWorkItem";
	import XmRecord from '../xmRecord/XmRecord'
	import XmMyDoFocus from '@/views/myWork/my/components/DoFocus';
	import ArchiveEdit from '@/views/xm/core/wiki/archive/WikiMenuEdit';
	import XmTestCaseMng from '@/views/xm/core/xmTestCase/XmTestCaseMng';

	import xmQuestionMng from "@/views/xm/core/xmQuestion/XmQuestionMng";
	import XmFuncSelect from '../xmFunc/XmFuncSelect'

	import XmEpicFeaturesSelect from "../xmMenu/XmEpicFeaturesSelect";
	import MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm'
import CommentArea from '../xmMenuComment/comment-area.vue';
	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),
			calcMenuCurrStep(){
				var status=this.dicts['menuStatus'].findIndex(i=>this.editForm.status==i.id) +1
				return status;
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
			subWorkitemCpd(){
				if(this.subWorkItemNum>0){
					return this.subWorkItemNum
				}else{
					if(this.editForm.dclass=='3'){
						var bugCnt=0;
						var taskCnt=0;
						if(this.editForm.bugCnt){
							bugCnt=parseInt(this.editForm.bugCnt)
						}
						if(this.editForm.taskCnt){
							taskCnt=parseInt(this.editForm.taskCnt)
						}
						return bugCnt+taskCnt;
					}else{
						return this.editForm.childrenCnt
					}

				}
			}
		},
		props:['xmMenu','visible','parentMenu','product','dclass','selProject','reload'],
		watch: {
	      'xmMenu':function( xmMenu ) {
	        //this.editForm = {...xmMenu};
	      },
	      'visible':function(visible) {
	      	if(visible==true){
				this.subWorkItemNum=0;
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
					mmUserid: [
						{ required: true, message: '负责人不能为空', trigger: 'change' }
					],
					remark: [
						{ max: 1000, message: '长度在 0 到 1000 个字符', trigger: 'change' },//长度
					],
				},
				//新增界面数据 项目需求表
				editForm: {
					startTime:'',menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'0',online:'0',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'',mmUserid:'',mmUsername:'',ctime:'',ntype:'0',sinceVersion:'',childrenCnt:'0',ltime:'',tagIds:'',tagNames:'',pidPaths:'',lvl:'0',isTpl:'0',phaseId:'',iterationId:'',source:'1',proposerId:'',proposerName:'',dlvl:'0',dtype:'0',priority:'0',dclass:'',iterationName:'',endTime:'',funcId:'',funcName:'',comments:'',ups:'0',reads:'0'
				},
				proposerSelectVisible:false,
				mmUserSelectVisible:false,
				dicts:{
					menuStatus:[
					]
				},
				tagSelectVisible:false,
				subWorkItemNum:-1,
				activateTabPaneName:'4',
				pmenuFormVisible:false,
				parentMenuVisible:false,
				funcVisible:false,

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
			showPmenu(){

			},
			changePmenu(){

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
					params.mmUserid=$event.userid
					params.mmUsername=$event.username
				}else if(fieldName==='proposerId'){
					params.proposerId=$event.userid
					params.proposerName=$event.username
				}else if(fieldName==='startTime'){
					params.startTime=$event.startTime
					params.endTime=$event.endTime
				}else if(fieldName==='funcId'){
					params.funcId=$event.id
					params.funcName=$event.name
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
							this.$nextTick(()=>{
								Object.assign(row,params)
							})
							Object.assign(this.editFormBak,row)
							this.$emit("edit-fields",params);
							if(fieldName==='remark'||fieldName==='link'){
								this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
							}
						}else{
							this.$nextTick(()=>{
								Object.assign(row,this.editFormBak)
							})

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
			},
			onParentMenuSelected(menu){

				if(!menu||!menu.menuId){
					this.$notify({position:'bottom-left',showClose:true,message:'请先选择一个上级需求',type:'warning'})
					return;
				}
				this.parentMenuVisible=false;
				var params={
					menuIds:[this.editForm.menuId],
					pmenuId:menu.menuId
				}
				batchChangeParentMenu(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						this.editForm.pmenuId=menu.menuId
						this.editFormBak={...this.editForm}
						this.$emit("edit-fields",params);
					}
					this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
				})
			},

			onFuncSelected(row){
				this.editForm.funcId=row.id
				this.editForm.funcName=row.name
				this.funcVisible=false;
				if(this.opType!=='add'){
					this.editXmMenuSomeFields(this.editForm,'funcId',row)
				}
			},

			copyLink(){
				var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
				var link=curlDomain+"/"+process.env.CONTEXT+"/"+process.env.VERSION+"/#/xm/core/menu/detail?menuId="+this.editForm.menuId
				this.$copyText(link).then(e => {
					this.$notify({position:'bottom-left',showClose:true,message:"拷贝链接成功，您可以黏贴到任何地方",type:'success'})
				});
			},
		},//end method
		components: {
			//在下面添加其它组件 'xm-menu-edit':XmMenuEdit
			UsersSelect,
			XmMenuOverview,
			TagMng,
			XmSubWorkItem,
			XmRecord,
			XmMyDoFocus,
			ArchiveEdit,
			XmTestCaseMng,MdpSelectUserXm,
			'xm-menu-edit':()=>import("./XmMenuDetail"),
			'xm-workload-record':()=>import("../xmWorkload/XmWorkloadRecord"),
			XmEpicFeaturesSelect,
			xmQuestionMng,
			CommentArea,
			XmFuncSelect,
		},
		mounted() { 
			this.$mdp.ajaxGetDictOptions('menuStatus').then(res=>{
				this.dicts['menuStatus']=res.data.options
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

.step-btn{
	margin-left:0px;margin-bottom: 5px;
}
</style>
