<template>
	<section class="page-container padding">
		<el-row>
				<el-col :span="24">
					<el-button v-if="!isSelectSingleUser && !isSelectMultiUser" type="primary" @click="showGroupFormwork" icon="el-icon-plus">导入项目组</el-button>
					<el-button v-if="!isSelectSingleUser && !isSelectMultiUser" type="primary" @click="groupConfirm" icon="el-icon-finished">保存</el-button>
					<el-button v-if="!isSelectSingleUser && !isSelectMultiUser" type="plain" @click="showGroupState" icon="el-icon-s-data">小组进度</el-button>

					<el-button v-else type="primary" @click="userConfirm" icon="el-icon-finished">确认选择用户</el-button>
					<el-button v-if="!isSelectSingleUser && !isSelectMultiUser" type="plain" @click="xmRecordVisible=true" icon="el-icon-document">变化日志</el-button>
					<el-button v-if="!isSelectSingleUser && !isSelectMultiUser" type="plain" @click="doSearchImGroupsByProjectId" icon="el-icon-document">绑定即聊情况</el-button>
 					<el-button @click="groupRoleDescVisible=true" icon="el-icon-document">角色说明</el-button>
 
					<el-tooltip  v-if="isSelectSingleUser!='1' && isSelectMultiUser !='1'" content="黄色表示组长"><span class="addXmProjectGroupFormworkSquare"></span></el-tooltip>
					<el-tooltip  v-else content="黄色表示选中"><span class="addXmProjectGroupFormworkSquare">选中</span></el-tooltip>
				</el-col> 
		</el-row>
		 <el-row class="page-main page-height-80 padding" v-loading="load.list" v-if="!isSelectSingleUser && !isSelectMultiUser">
			<el-row v-for="(item,index) in xmProjectGroupFormworkSels" :key="index">
				<h3>
					<div><el-tooltip :content="'归属项目组【'+item.projectId+'】'"><font>{{item.groupName + "："}}</font></el-tooltip><el-tag v-if="imGroupVisible==true && imGroups.some(g=>item.id==g.id) "   type="success">已绑定</el-tag><el-tag type="danger" v-else-if="imGroupVisible==true " @click="doCreateImGroup(item)">未绑定，点我去绑定</el-tag>
						<i class="el-icon-close closeStyle" @click.stop="delGroup(item,index)"></i>
					</div>
				</h3>
				<el-col :span="23" style="margin-left:30px;display:flex;flex-wrap: wrap;margin-right:30px;"> 
					<div  :class="v.isHead=='1'?'checkCopyButton':'copyButton'" v-for="(v,valueIndex) in item.groupUsers" :key="valueIndex" @click="toggleHead(index,valueIndex)">
						{{v.username}}
						<i class="el-icon-close closeStyle" @click.stop="delGroupUser(index,valueIndex)"></i>
					</div> 
					<div class="add" @click="addGroupUser(index)"><i class="el-icon-circle-plus-outline" style="font-size:35px;"></i></div>
				</el-col>
			</el-row>
		</el-row>
		
		<el-row class="page-main page-height-80" v-loading="load.list" v-else>
			<el-row v-for="(item,index) in xmProjectGroupFormworkSels" :key="index">
				<h3>
					<div>{{item.groupName + "："}} 
					</div>
				</h3>
				<el-col :span="23" style="margin-left:30px;display:flex;flex-wrap: wrap;">  
					<div  :class="v.isSelected=='1'?'checkCopyButton':'copyButton'" v-for="(v,valueIndex) in item.groupUsers" :key="valueIndex" @click="toggleHead(index,valueIndex)">
							{{v.username}}
					</div>  
				</el-col>
			</el-row>
		</el-row>
		<el-drawer
			append-to-body
			:visible.sync="groupSelectVisible"
			width="50%">
			<el-row>
				<el-button  v-if="setTemplateVisible==false"  @click="getXmProjectGroupFormworks" v-loading="load.list" icon="el-icon-search">刷新</el-button>
				<el-button  v-if="setTemplateVisible==false" type="primary"  @click="groupNameConfirm" icon="el-icon-finished">确认选择</el-button>
				<el-select  v-if="setTemplateVisible==true"  style="width:20%;" placeholder="请选择小组类型"   v-model="projectGroupType" value-key="optionValue">
					<el-option
						v-for="(item,i) in options.projectGroupType"
						:key="i"
						:label="item.optionName"
						:value="item">
					</el-option>
				</el-select>
				<el-input style="width:40%" v-show="setTemplateVisible" v-model="needAddGroupNameValue" placeholder="输入组名，回车直接添加" @keyup.enter.native="addGroupName">
					
					<el-button  slot="append" @click.stop="addGroupName" icon="el-icon-plus"></el-button>
				</el-input>
				<el-button  v-if="setTemplateVisible==false"  @click.stop="setTemplateVisible=true" icon="el-icon-right">维护模板</el-button>
				<el-button  v-else @click.stop="setTemplateVisible=false" icon="el-icon-back">返回</el-button>

			</el-row>
			<el-table ref="groupTable" :height="tableHeight" @selection-change="addIsSels" @row-click.self="changesels" :data="convertXmProjectGroupFormworks"  v-loading="load.list">
				<el-table-column type="selection" aria-disabled width="55"></el-table-column>
				<el-table-column align="center" prop="groupName" label="小组模板" width="200"></el-table-column>
				<el-table-column   align="center" label="操作"> 
					<template slot-scope="scope">
						<el-button  v-show="setTemplateVisible==true" type="danger" @click.stop="deleteGroup(scope.$index, scope.row)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column> 
			</el-table>
		</el-drawer>
		<el-drawer append-to-body
			title="角色说明" 
			size="60%"
			:visible.sync="groupRoleDescVisible"
			direction="rtl" 
			ref="drawer"
			>
			<el-row class="page-main page-height-90">
				<el-collapse>
					
					<el-collapse-item title="项目经理：项目整体、团队、进度、质量、计划、风险、沟通管理等" name="3">
						<div>项目：立项、项目预算、项目进度、项目成本、项目合同、项目延期、项目预算变更等</div>
						<div>团队：建立项目管理组、建立业务组、指定组长、组员管理（加人、减人、指派组长）等</div>
						<div>计划：建立阶段计划、阶段计划预算管理、基于阶段计划细化任务、迭代计划制定与执行等</div>
						<div>任务：建立任务、删除任务、指派责任人、任务预算变更、任务提交测试、测试结果反馈、任务结算</div>
						<div>质量：审核测试方案、定时查看质量报告</div>
						<div>风险：风险预测、风险应对措施管理等</div>
						<div>需求：确保任务与需求的关联关系正确、范围正确，及时跟进需求的变化。 </div>
					</el-collapse-item>
					<el-collapse-item title="项目管理者: 项目经理、技术经理、项目副经理、技术副经理等具有全项目范围管理权限的管理人员。由项目经理指派。" name="4"> 
								    <div>团队：建立项目管理组、建立业务组、指定组长、组员管理（加人、减人、指派组长）等</div>
									<div>进度计划：建立阶段计划、细化阶段计划、阶段计划管理、阶段预算管理等 </div>
									<div>任务：建立任务、删除任务、指派责任人、任务预算变更、任务提交测试、测试结果反馈、任务结算</div>
									<div>质量：审核测试方案、定时查看质量报告等</div>
									<div>风险：风险预测、风险应对措施管理等</div>
									<div>需求：确保任务与需求的关联关系正确、范围正确，及时跟进需求的变化。</div>
					</el-collapse-item>
					<el-collapse-item title="组长：每个小组的组长，由项目管理者指定" name="5"> 
								    <div>团队：组员管理（加人、减人）</div>
									<div>进度计划：建立阶段计划、细化阶段计划、阶段计划管理、阶段预算管理、定期查看小组的工作进度情况、各成员的进度情况跟踪</div>
									<div>任务：建立任务、删除任务、指派责任人、任务预算变更、任务提交测试、测试结果反馈、任务结算</div>
									<div>质量：审核测试方案、定时查看质量报告等</div>
									<div>风险：风险预测、风险应对措施管理等</div>
									<div>需求：确保任务与需求的关联关系正确、范围正确，及时跟进需求的变化。</div>
					</el-collapse-item>
					<el-collapse-item title="任务责任人：每个任务的责任人，由组长、项目管理者指定" name="6"> 
								   <div> 团队：对任务的候选人、执行人进行统一管理、跟踪</div>
									<div>进度计划：定期查看负责的任务的进度情况、各成员的进度情况跟踪</div>
									<div>任务：任务预算变更、任务提交测试、测试结果反馈、任务结算</div>
									<div>质量：审核测试方案、定时查看质量报告等</div>
									<div>风险：风险预测、风险应对措施管理等</div>
									<div>需求：确保任务与需求的关联关系正确、范围正确，及时跟进需求的变化。</div>
					</el-collapse-item>
					<el-collapse-item title="任务候选人：每个任务的候选人，由任务责任人、组长、项目管理者指定或者由用户自行加入。" name="7"> 
								   <div> 团队：查看团队成员、加入任务候选人队列、退出任务候选人队列、不能加入具体的小组</div>
									<div>进度计划：定期查看已关注的任务的进度情况</div>
									<div>任务：关注任务、取消关注任务、查询任务、加入任务候选人队列、退出候选人队列等 </div>
									<div>需求：查看相关的需求及其滚动信息</div>
					</el-collapse-item>
					<el-collapse-item title="任务执行人：每个任务的具体执行人，由任务责任人、组长、项目管理者指定。" name="8"> 
								   <div> 团队：查看团队成员、加入业务小组、退出小组</div>
									<div>进度计划：定期查看已执行的任务的进度情况</div>
									<div>任务：关注任务、取消关注任务、查询任务、加入任务候选人队列、退出候选人队列、提交测试、提交结算申请等</div>
									<div>需求：查看相关的需求及其滚动信息</div>
					</el-collapse-item>
					<el-collapse-item title="产品经理" name="9"> 
								   <div> 团队：查看团队成员、加入业务小组、退出小组</div>
									<div>进度计划：定期查看已执行的任务的进度情况</div>
									<div>任务：关注任务、取消关注任务、查询任务、加入任务候选人队列、退出候选人队列、提交测试、提交结算申请等</div>
									<div>需求：查看相关的需求及其滚动信息</div>
					</el-collapse-item>
					<el-collapse-item title="测试经理" name="10">
					 
					</el-collapse-item>
					<el-collapse-item title="开发者" name="11">
						 
					</el-collapse-item> 
					<el-collapse-item title="项目管理委员会" name="1">
						<div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
						<div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
					</el-collapse-item>
					<el-collapse-item title="客户项目经理" name="2">
						<div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
						<div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
					</el-collapse-item>
				</el-collapse> 
				<el-button @click="groupRoleDescVisible=false">关闭</el-button> 
			</el-row> 
		</el-drawer>
		<el-drawer append-to-body title="选择员工" :visible.sync="userSelectVisible" size="60%">
        	<users-select :select-userids="filters.ids?filters.ids.map(i=>i.id):[]" @confirm="onUserSelected" ref="usersSelect"></users-select>
      	</el-drawer>
		  
		<el-drawer v-if="selProject" :title="selProject==null?'操作日志':selProject.name+'团队操作日志'" center   :visible.sync="xmRecordVisible"  size="50%"  :close-on-click-modal="false" append-to-body>
			<xm-record :obj-type="'group'" :visible="xmRecordVisible" :project-id="selProject.id"    :simple="1"></xm-record>
		</el-drawer>
		<el-drawer v-if="selProject" :title="selProject==null?'进度':selProject.name+'团队进度'" center   :visible.sync="xmProjectGroupStateVisible"  size="80%"  :close-on-click-modal="false" append-to-body>
			<xm-project-group-state-mng  :sel-project="selProject" :visible="xmProjectGroupStateVisible" ></xm-project-group-state-mng>
		</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util'; //全局公共库
	import {sn} from '@/common/js/sequence'; //全局公共库

	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import {addXmProjectGroupFormwork,delXmProjectGroupFormwork,listXmProjectGroupFormwork} from '@/api/xm/core/xmProjectGroupFormwork';
	import { listImGroup} from '@/api/mdp/im/group/imGroup';
	import { publishMessage} from '@/api/mdp/im/imPush';


	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
	import  XmProjectGroupStateMng from '../xmProjectGroupState/XmProjectGroupStateMng';//修改界面

	import {mapGetters} from 'vuex' 

	export default {
		computed: {
			...mapGetters([
				'workShop','userInfo','roles'
			])
		},
		//
		props: ['visible',"selGroups",'selProject','isSelectSingleUser','isSelectMultiUser'],
		watch: {
			"selGroups": function(selGroups) {
				if(this.selGroups){
					this.selGroups.forEach(i=>{
						if(i.groupUsers){
							i.groupUsers.forEach(k=>k.isSelected="0")
						} 
					})
					this.xmProjectGroupFormworkSels = JSON.parse(JSON.stringify(this.selGroups));
				}else{ 
					this.xmProjectGroupFormworkSels = [];
				}
				if(this.imGroupVisible){
					this.doSearchImGroupsByProjectId()
				}
				this.applyData();
			},
			'visible': function(visible) {
				if (visible == true) {
					
				}
			},
		},

		data() {
			return {
				sectionLoading: false,
				filters: {
					key: ''
				},
				load: {list: false,edit: false,del: false,add: false}, //查询中...
				sels: [], //列表选中数据
				options: {
					projectGroupType:[]
				}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				/**begin 自定义属性请在下面加 请加备注**/
				xmProjectGroupFormworkSels: [],
				userSelectVisible: false,
				groupSelectVisible: false,
				needAddGroupNameValue: '',
				needAddGroupUserIndex: 0,
				isSels: [],
				convertXmProjectGroupFormworks: [],
				projectGroupType:null,
				xmRecordVisible:false,
				xmProjectGroupStateVisible:false,
				imGroups:[],
				imGroupVisible:false,
				groupRoleDescVisible:false,
				setTemplateVisible:false,
				tableHeight:300,
				/**end 自定义属性请在上面加 请加备注**/
			}
		}, //end data
		methods: {
			toggleHead(index,valueIndex) {
				if(this.isSelectSingleUser=='1' || this.isSelectMultiUser=='1'){
					if(this.xmProjectGroupFormworkSels[index].groupUsers[valueIndex].isSelected == '1'){
						this.xmProjectGroupFormworkSels[index].groupUsers[valueIndex].isSelected ='0'
					}else{
						this.xmProjectGroupFormworkSels[index].groupUsers[valueIndex].isSelected ='1'
					}
				}else{
					if(this.xmProjectGroupFormworkSels[index].groupUsers[valueIndex].isHead =='1'){
							this.xmProjectGroupFormworkSels[index].groupUsers[valueIndex].isHead = '0';
					}else{
						this.xmProjectGroupFormworkSels[index].groupUsers.forEach(u=>{
							u.isHead = '0';
						});
						this.xmProjectGroupFormworkSels[index].groupUsers[valueIndex].isHead = '1';
					}
					
					 
				}
				
			},
			applyData(){
				let checked = this.convertXmProjectGroupFormworks.filter(i=>this.xmProjectGroupFormworkSels.some(j=> j.groupName == i.groupName));
				if(checked && checked.length > 0){
					checked.forEach(item=>{
						if(this.$refs.groupTable){
							
						this.$refs.groupTable.toggleRowSelection(item,true);
						}
					});
				}
			},
			//项目团队组行选择
			changesels(row) {
				this.$refs.groupTable.toggleRowSelection(row);
			},
			//项目团队组存储
			addIsSels(v){
				this.isSels = v;
			},

			//ok
			addGroupName() {
				let that = this;
				if(!this.selProject || !this.selProject.id){
					this.$message({showClose: true,
						message:"未知项目，不允许添加小组",
						type:   'error'
					});
					return false;
				}
				if(this.projectGroupType==null){
					this.$message({showClose: true,
						message:"项目小组类型为空，请选择小组类型后操作",
						type:   'error'
					});
					return false;
				}
				if(!this.needAddGroupNameValue) {
					this.$message({showClose: true,
						message:"小组名称不能为空",
						type:   'error'
					});
					return;
				}
				if(this.convertXmProjectGroupFormworks.some(i=>i.groupName==this.needAddGroupNameValue.trim())){
					this.$message({showClose: true,
						message:"团队名已经存在",
						type:   'error'
					});
					return false;
				}
				let params = {
					"groupName": this.needAddGroupNameValue,
					"isPub": "1",
					"pgTypeId":this.projectGroupType.optionValue,
					"pgTypeName":this.projectGroupType.optionName
				};
				if(!this.userInfo.isPlatformAdmin && !this.userInfo.isSuperAdmin){
					params.branchId = this.workShop.branchId;
					params.isPub = "0";
				}
				that.sectionLoading = true;
				addXmProjectGroupFormwork(params).then((res) => {
					that.sectionLoading = false;
					var tips = res.data.tips;
					var data=res.data.data;
					if (tips.isOk) {
						that.needAddGroupNameValue = '';
						this.getXmProjectGroupFormworks()
					}
					this.$message({showClose: true,
						message: tips.msg,
						type: tips.isOk ? 'success' : 'error'
					});
				}).catch(err => this.sectionLoading = false);
			},

			//ok
			deleteGroup(index,row){
				 
				let that = this;
				let params =row
				if (!params.id) {return;}
				this.$confirm('此操作将永久删除该团队名, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.sectionLoading = true;
					delXmProjectGroupFormwork(params).then((res) => {
						that.sectionLoading = false;
						var tips = res.data.tips;
						if (tips.isOk) {
							that.convertXmProjectGroupFormworks.splice(index,1);
						}
						that.$message({
							message: tips.msg,
							type: tips.isOk ? 'success' : 'error'
						});
					}).catch(err => that.sectionLoading = false);
				}).catch(() => {});
			},

			//获取团队组名
			getXmProjectGroupFormworks() {
				let params = {};
				params.branchId = this.workShop.branchId;
				this.load.list = true;
				listXmProjectGroupFormwork(params).then((res) => {
					
					var tips = res.data.tips;
					if (tips.isOk) {
						let allXmProjectGroupFormwork = res.data.data;
						const len = allXmProjectGroupFormwork.length;
						let convert = [];
						for(let i=0;i<len;i++) {
							let xmProjectGroupFormwork = allXmProjectGroupFormwork[i];
							let json = {
								"groupUsers": [],
								"id": xmProjectGroupFormwork.id,
								"groupName": xmProjectGroupFormwork.groupName,
								"isPub": xmProjectGroupFormwork.isPub,
								"pgTypeId":xmProjectGroupFormwork.pgTypeId,
								"pgTypeName":xmProjectGroupFormwork.pgTypeName,
							}
							convert.push(json);
						}
						this.convertXmProjectGroupFormworks = convert;
						console.log("applyData");
					} else {
						this.$message({showClose: true,
							message: tips.msg,
							type: 'error'
						});
					}
					this.load.list =false
				}).then(()=>{
					this.$nextTick(() => {
						this.applyData();
					}) 
				}).catch(err =>this.load.list =false);
			},

			//确认项目团队组成员
			groupConfirm(){
				this.$emit("select-confirm",this.xmProjectGroupFormworkSels);
			},
			userConfirm(){
				var users=[];
				this.xmProjectGroupFormworkSels.forEach(i=>{
					if(i.groupUsers){
						i.groupUsers.forEach(k=>{
							if(k.isSelected=='1'){
								users.push(k);
							}
						})
					}
				})

				if(this.isSelectSingleUser=='1'){
					if(users.length>1){
						
						this.$message({showClose: true,
							message: '只能选中一个用户',
							type: 'error'
						});
						return 
					}
				}
				this.$emit("user-confirm",users);
			},
			//确认项目团队组
			groupNameConfirm() {
				this.isSels.forEach(i=>{
					if(!this.xmProjectGroupFormworkSels.some(j=>j.groupName == i.groupName)){
						i.projectId=this.selProject.id
						i.projectName=this.selProject.name
						this.xmProjectGroupFormworkSels.push(i);
					}
				});
				//this.xmProjectGroupFormworkSels = this.xmProjectGroupFormworkSels.filter(i=> this.isSels.some(j=>j.groupName == i.groupName));
				console.log(this.xmProjectGroupFormworkSels);
				this.groupSelectVisible = false;
			},
			
			//团队组成员添加按钮
			addGroupUser(index) {
				this.needAddGroupUserIndex = index;
				this.userSelectVisible = true;
			},

			//选择接收人
			onUserSelected: function(groupUsers) {
				const index = this.needAddGroupUserIndex;
				let user = this.xmProjectGroupFormworkSels[index].groupUsers;
				groupUsers.forEach((u) => {
					if(!user.some(i=>i.userid === u.userid)){
						let json = {
							"userid": u.userid,
							"username": u.username,
							"isHead": '0',
							'isSelected':'0'
						};
						user.push(json);
					}
				});
				this.userSelectVisible = false;
			},
			delGroupUser(index,vindex) {
				this.xmProjectGroupFormworkSels[index].groupUsers.splice(vindex,1);
			},
			
			delGroup(group,index) {
				this.xmProjectGroupFormworkSels.splice(index,1);
			},
			/**begin 自定义函数请在下面加**/
			showGroupFormwork:function(){  
				this.groupSelectVisible=true;
				this.$nextTick(() => {
					this.applyData();
				})
				
			},
			showGroupState(){
				this.xmProjectGroupStateVisible=true;
			},
			doSearchImGroupsByProjectId(){
				
				var params={bizPid:this.selProject.id}
				listImGroup(params).then(res=>{
					this.imGroupVisible=true;
					var tips = res.data.tips;
					if(tips.isOk){
						this.imGroups=res.data.data;
					}
					this.$message({showClose: true,
						message: tips.msg,
						type: tips.isOk ? 'success' : 'error'
					});
				});
			},
			doCreateImGroup(group){
				if(group.groupUsers && group.groupUsers.length>0){
					var params={
						msgId:sn(),
						groupId:group.id,
						groupName:group.name,
						msgType:'group',
						action:'channelGroupCreate',
						cuserid:this.userInfo.userid,
						cusername:this.userInfo.username,
						branchId:this.userInfo.branchId,
						bizId:group.id,
						bizPid:this.selProject.id,
						users:group.groupUsers.map(gu=>{
							return {
								userid:gu.userid,
								username:gu.username
							}
						})
					}
					publishMessage(params).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							params.id=params.groupId
							this.imGroups.push(params);
						} 
						this.$message({showClose: true,
							message: tips.msg,
							type: tips.isOk ? 'success' : 'error'
						});
					})
				}else{
					that.$message({
						message: "组员为空，不允许绑定",
						type:   'error'
					});
				}
				
			}
			/**end 自定义函数请在上面加**/

		}, //end methods
		components: {
			
			UsersSelect,XmProjectGroupStateMng
			//在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {
				
				 
				var subHeight=400/1000 * window.innerHeight; 
				this.tableHeight =  window.innerHeight -subHeight; 
				if(this.selGroups){
					this.selGroups.forEach(i=>{
						if(i.groupUsers){
							i.groupUsers.forEach(k=>k.isSelected="0")
						} 
					})
					this.xmProjectGroupFormworkSels = JSON.parse(JSON.stringify(this.selGroups));
				}
				this.getXmProjectGroupFormworks();
				listOption([{categoryId:'all',itemCode:'projectGroupType'}] ).then(res=>{
					if(res.data.tips.isOk){ 
						this.options['projectGroupType']=res.data.data.projectGroupType 
					}
				});
			});
		}
	}
</script>

<style scoped>
	.copyButton {
		margin-left: 10px;
		border-radius: 20px;
		padding: 10px 1px;  
		border: 1px solid rgb(220, 223, 230);
		/* color:#039; */
	}

	.copyButton:hover {
		color: #409eff;
		border-color: #c6e2ff;
		background-color: #ecf5ff;
		cursor: default;
	}

	.checkCopyButton {
		/*color: #fff;*/
		margin-left: 10px;
		border-radius: 20px;
		padding: 10px 1px;  
		border: 1px solid #FFA00A;
		/*background-color: rgba(230, 162, 60, .1);*/
		/* background-color: #f9f9f9; */
		background-color: #fff;
		/*border-color: rgba(230,162,60,.2);*/
		color: #FFA00A;
	}

	.add {
		display: flex;
		align-items: center;
		margin-left: 10px;
		margin-top: 2px;
	}

	.add:hover {
		cursor: pointer;
		animation: myrotate 0.5s linear infinite;
	}


	.input-xmProjectGroupFormwork {
		margin-left:10px;
		margin-top: 2px;
		align-self: center;
	}
	.closeStyle {
		padding: 1px;
	}

	.closeStyle:hover {
		cursor: pointer;
		/* border-color:#f40; */
		/* border: 1px solid #f40; */
		background-color: #FFA00A;
		color: #fff;
		border-radius: 50%;
		padding: 1px;
		animation: myrotate 1s linear;
	}

	.addXmProjectGroupFormworkSquare {
		width: 15px;
		height: 15px;
		display: inline-block;
		background-color: #FFA00A;
		animation: myrotate 2s linear infinite;
	}

	.closeXmProjectGroupFormworkSquare {
		width: 15px;
		height: 15px;
		display: inline-block;
		background-color: #fff;
		animation: myrotate 2s linear infinite;
	}
	@keyframes myrotate {
		0% {
			transform: rotate(0deg);
			box-shadow: 0px 0px 10px #fff;
		}

		50% {
			transform: rotate(180deg);
			box-shadow: 0px 0px 45px #fff;
		}

		100% {
			transform: rotate(360deg);
			box-shadow: 0px 0px 10px #fff;
		}
	}
</style>
