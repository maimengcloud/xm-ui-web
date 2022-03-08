<template>
	<section class="page-container border padding" >
		<el-row> 
					<el-input v-model="filters.groupNameKey" style="width:15%;" clearable placeholder="小组名称查询"></el-input> 
					<el-input v-model="filters.mngUsernamekey" style="width:15%;" clearable placeholder="组长、副组长名称查询"></el-input> 
					<el-input v-model="filters.groupUsernameKey" style="width:15%;" clearable placeholder="组员名称查询"></el-input>
					<el-button type="primary" @click="searchXmGroups">查询</el-button>
 					<el-button  type="plain" @click="showGroupState" icon="el-icon-s-data">小组进度</el-button> 
 					<el-button class="hidden-md-and-down" type="plain" @click="xmRecordVisible=true" icon="el-icon-document">变化日志</el-button>
					<el-button class="hidden-md-and-down" type="plain" @click="doSearchImGroupsByProjectId" icon="el-icon-document">绑定即聊情况</el-button>
 					<el-button class="hidden-md-and-down" @click="groupRoleDescVisible=true" icon="el-icon-document">角色说明</el-button> 
					 <font style="font-size:12px;" class="hidden-md-and-down" color="red">注意：点击架构图进行操作</font>
  		</el-row> 
		<el-row ref="table" :style="{overflowX:'auto',height:maxTableHeight+'px'}">
			<vue-okr-tree :data="okrTreeData" v-loading="load.list"
				show-collapsable   
				node-key="id"
				default-expand-all
				current-lable-class-name="crrentClass" 
				:render-content="renderContent"  
  				@node-click="handleNodeClick"
  				direction="horizontal"
  			></vue-okr-tree>   
		</el-row>
		<el-row>
			<!--编辑 XmGroup xm_group界面-->
			<el-drawer title="编辑小组信息" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <xm-project-group-edit op-type="edit" :xm-project-group="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-group-edit>
			</el-drawer>

			<!--新增 XmGroup xm_group界面-->
			<el-drawer title="新增小组信息" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<xm-project-group-edit op-type="add" :xm-project-group="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-project-group-edit>
			</el-drawer>
			
			<el-dialog
				title="操作"
				:visible.sync="groupOperSelectVisible"
				append-to-body  :close-on-click-modal="true"
				width="50%" >
				<el-row v-if="currNodeType=='project'">   
					<el-button type="primary" @click="loadNexGroup" icon="el-icon-search" v-loading="load.add">加载下一级小组</el-button>  
					<el-button @click="showAdd" icon="el-icon-plus" v-loading="load.add">新增下一级小组</el-button>  
				</el-row> 
				<el-row v-else-if="currNodeType=='product'">  
					<el-button type="primary" @click="loadNexGroup" icon="el-icon-search" v-loading="load.add">加载下一级小组</el-button>  
					<el-button type="primary" @click="showAdd" icon="el-icon-plus"  v-loading="load.add">新增下一级小组</el-button> 
				</el-row> 
				<el-row v-else-if="currNodeType=='group'">  
					<el-row>
						<el-button type="primary" @click="loadNexGroup" icon="el-icon-search" v-loading="load.add">加载下一级小组</el-button>  
						<el-button   @click="showGroupState" icon="el-icon-s-data"  v-loading="load.add">查看小组进度</el-button>    
						<el-button @click="groupUserVisible=true" icon="el-icon-search"  v-loading="load.add">查看组员</el-button> 
					</el-row>
					<el-row> 
						<el-button   @click="showAddSub(editForm)" icon="el-icon-plus"  v-loading="load.add">新增下一级小组</el-button>   
						<el-button @click="showEdit(editForm)" icon="el-icon-edit"  v-loading="load.edit">修改小组信息</el-button> 
						<el-button @click="userSelectVisible=true" icon="el-icon-plus"  v-loading="load.add">新增组员</el-button> 
						<el-button type="danger" @click="handleDel(editForm)" icon="el-icon-delete"  v-loading="load.del">删除小组</el-button>
					</el-row>
				</el-row> 
				<el-row v-else-if="currNodeType=='groupUser'">  
					<el-button type="danger" icon="el-icon-delete" @click="handleDelGroupUser(editForm)" v-loading="load.del">删除组员</el-button>
				</el-row> 
				<el-row v-else>  
					<el-button type="primary" @click="loadNexGroup" icon="el-icon-search" v-loading="load.add">加载下一级小组</el-button>  
					<el-button type="primary" @click="selectProductVisible=true" icon="el-icon-plus" v-loading="load.add">新增产品小组</el-button>  
					<el-button type="primary" @click="selectProjectVisible=true" icon="el-icon-plus" v-loading="load.add">新增项目小组</el-button>  
				</el-row>
			</el-dialog>
			
			<el-drawer append-to-body
				title="角色说明" 
				size="60%"
				:visible.sync="groupRoleDescVisible"
				direction="rtl" 
				ref="drawer"
				>
				<el-row class="page-main  padding">
					<el-collapse>
						
						<el-collapse-item title="项目经理：项目整体、团队、进度、质量、计划、风险、沟通管理等" name="3">
							<div>项目：立项、项目预算、项目进度、项目成本、项目合同、项目延期、项目预算变更等</div>
							<div>团队：建立项目管理组、建立业务组、指定组长、组员管理（加人、减人、指派组长）等</div>
							<div>计划：建立计划、计划预算管理、基于计划细化任务、迭代计划制定与执行等</div>
							<div>任务：建立任务、删除任务、指派责任人、任务预算变更、任务提交测试、测试结果反馈、任务结算</div>
							<div>质量：审核测试方案、定时查看质量报告</div>
							<div>风险：风险预测、风险应对措施管理等</div>
							<div>需求：确保任务与需求的关联关系正确、范围正确，及时跟进需求的变化。 </div>
						</el-collapse-item>
						<el-collapse-item title="项目管理者: 项目经理、技术经理、项目副经理、技术副经理等具有全项目范围管理权限的管理人员。由项目经理指派。" name="4"> 
										<div>团队：建立项目管理组、建立业务组、指定组长、组员管理（加人、减人、指派组长）等</div>
										<div>进度计划：建立计划、细化计划、计划管理、计划预算管理等 </div>
										<div>任务：建立任务、删除任务、指派责任人、任务预算变更、任务提交测试、测试结果反馈、任务结算</div>
										<div>质量：审核测试方案、定时查看质量报告等</div>
										<div>风险：风险预测、风险应对措施管理等</div>
										<div>需求：确保任务与需求的关联关系正确、范围正确，及时跟进需求的变化。</div>
						</el-collapse-item>
						<el-collapse-item title="组长：每个小组的组长，由项目管理者指定" name="5"> 
										<div>团队：组员管理（加人、减人）</div>
										<div>进度计划：建立计划、细化计划、计划管理、计划预算管理、定期查看小组的工作进度情况、各成员的进度情况跟踪</div>
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
					
				</el-row> 
				<el-row class="padding">
					<el-button  type="primary" @click="groupRoleDescVisible=false">关闭</el-button> 
				</el-row>
			</el-drawer>
			<el-drawer append-to-body title="选择员工" :visible.sync="userSelectVisible" size="60%">
				<users-select :select-userids="filters.ids?filters.ids.map(i=>i.id):[]" @confirm="onUserSelected" ref="usersSelect"></users-select>
			</el-drawer>
			
			<el-drawer v-if="selProject" :title="selProject==null?'操作日志':selProject.name+'团队操作日志'" center   :visible.sync="xmRecordVisible"  size="50%"  :close-on-click-modal="false" append-to-body>
				<xm-record :obj-type="'group'" :visible="xmRecordVisible" :project-id="selProject.id"    :simple="1"></xm-record>
			</el-drawer>
			<el-drawer v-else-if="xmProduct&&!selProject" :title="xmProduct==null?'操作日志':xmProduct.productName+'团队操作日志'" center   :visible.sync="xmRecordVisible"  size="50%"  :close-on-click-modal="false" append-to-body>
				<xm-record :obj-type="'group'" :visible="xmRecordVisible" :product-id="xmProduct.id"    :simple="1"></xm-record>
			</el-drawer>
			
			<el-drawer v-if="currNodeType=='group'&&editForm.groupName" :title="editForm.groupName+'小组进度数据查看'" center   :visible.sync="xmGroupStateVisible"  size="80%"  :close-on-click-modal="false" append-to-body>
				<xm-project-group-state-mng :xm-project-group="editForm"  :visible="xmGroupStateVisible" ></xm-project-group-state-mng>
			</el-drawer>
			<el-drawer v-else-if="selProject" :title="selProject.name+'小组进度数据查看'" center   :visible.sync="xmGroupStateVisible"  size="80%"  :close-on-click-modal="false" append-to-body>
				<xm-project-group-state-mng  :sel-project="selProject"  :visible="xmGroupStateVisible" ></xm-project-group-state-mng>
			</el-drawer>
			<el-drawer v-else-if="!selProject && xmProduct" :title="xmProduct.productName+'小组进度数据查看'" center   :visible.sync="xmGroupStateVisible"  size="80%"  :close-on-click-modal="false" append-to-body>
				<xm-project-group-state-mng   :xm-product="xmProduct"   :visible="xmGroupStateVisible" ></xm-project-group-state-mng>
			</el-drawer>
			
			<el-drawer  v-if="currNodeType=='group'&&editForm.groupName" center  :title="(editForm==null?editForm.groupName:'')+'小组成员管理'" :visible.sync="groupUserVisible"  size="80%"  :close-on-click-modal="false" append-to-body>
				<xm-project-group-user-mng  :xm-project-group="editForm" :visible="groupUserVisible" ></xm-project-group-user-mng>
			</el-drawer>
			<el-drawer title="选中项目" :visible.sync="selectProjectVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
				<xm-project-list    @project-confirm="onPorjectConfirm"></xm-project-list>
			</el-drawer>   
			<el-drawer title="选中产品" :visible.sync="selectProductVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
				<xm-product-select :isSelectProduct="true"   @selected="onProductConfirm"></xm-product-select>
			</el-drawer>    
	    </el-row>
		
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listXmGroup, delXmGroup, batchDelXmGroup,getGroups } from '@/api/xm/core/xmGroup';
	import  XmGroupEdit from './XmGroupEdit';//新增修改界面
	import { mapGetters } from 'vuex'
	import {VueOkrTree} from 'vue-okr-tree';
	import 'vue-okr-tree/dist/vue-okr-tree.css'
	import { listImGroup} from '@/api/mdp/im/group/imGroup';
	import { publishMessage} from '@/api/mdp/im/imPush';
	
	import { listXmGroupUser, delXmGroupUser, batchDelXmGroupUser,batchAddXmGroupUser } from '@/api/xm/core/xmGroupUser';


	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
	import  XmGroupStateMng from '../xmGroupState/XmGroupStateMng';//修改界面
	import  XmGroupUserMng from '../xmGroupUser/XmGroupUserMng';//修改界面
	import XmProjectList from '../xmProject/XmProjectList';
	import XmProductSelect from '../xmProduct/XmProductSelect.vue';
	
	export default {
	    name:'xmGroupMng',
		components: {
		    XmGroupEdit,VueOkrTree,UsersSelect,XmGroupStateMng,XmGroupUserMng,XmProjectList,
XmProductSelect,
		},
		props:["visible","selProject" ,"isSelectSingleUser","isSelectMultiUser",'xmProduct','xmIteration'],
		computed: {
		    ...mapGetters(['userInfo']),
			expandedKeys(){  
				var expandedKeys=[]  
				if(this.xmProduct&&this.xmProduct.id){
					 expandedKeys.push(this.xmProduct.id)
				}else if(this.selProject && this.selProject.id){ 
					 expandedKeys.push(this.selProject.id)
				}else if(this.xmIteration){ 
					 expandedKeys.push(this.xmIteration.id)
				}else{
					var groupsLvl1=this.xmGroups.filter(i=>i.lvl<=1)
					expandedKeys.push(...groupsLvl1)
				}
				return expandedKeys; 
			},
			okrTreeData(){
				var groups=JSON.parse(JSON.stringify(this.xmGroups)); 
				groups.forEach(i=>{
					if(i.pgroupId==''){
						i.pgroupId=null;
					}
					i.currNodeType='group'
					i.label=i.groupName
					if(i.groupUsers){
						var groupUsers=i.groupUsers;
						groupUsers.forEach(i=>{
							i.label=i.username
							i.currNodeType='groupUser'
						})
						i.children=groupUsers
					}
				})
				var groupsTree=treeTool.translateDataToTree(groups,'pgroupId','id')
				var topLabel=this.userInfo.branchName+"-组织架构"
				var currNodeType='branch'
				var topdata={id:this.userInfo.branchId,branchName:this.userInfo.branchName,branchId:this.userInfo.branchId} 
				if(this.xmProduct&&this.xmProduct.id){
					topLabel=this.xmProduct.productName+"-产品组织架构"
					currNodeType='product'
					topdata=this.xmProduct
					topdata.leaderUserid=this.xmProduct.pmUserid
					topdata.leaderUsername=this.xmProduct.pmUsername
					topdata.assUserid=this.xmProduct.assUserid
					topdata.assUsername=this.xmProduct.assUsername
				}else if(this.selProject && this.selProject.id){
					topLabel=this.selProject.name+"-项目组织架构"
					currNodeType='project'
					topdata=this.selProject
					topdata.leaderUserid=this.selProject.pmUserid
					topdata.leaderUsername=this.selProject.pmUsername
					topdata.assUserid=this.selProject.assUserid
					topdata.assUsername=this.selProject.assUsername
				}else if(this.xmIteration){
					
					topLabel=this.xmIteration.iterationName+"-迭代组织架构"
					currNodeType='iteration'
					topdata=this.xmIteration
					topdata.leaderUserid=this.xmIteration.admUserid
					topdata.leaderUsername=this.xmIteration.admUsername 
				}
				var data=[{
					...topdata,
					label:topLabel,
					currNodeType:currNodeType,
					children:groupsTree
					}
				]
				return data;
			}
		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchXmGroups()
                }
            },
			
			selProject(){
				this.getXmGroup();
			},
			xmProduct(){
				this.getXmGroup();
			},
			xmIteration(){
				this.getXmGroup();
			}
		}, 
		data() {
			return {
				filters: {
					key: '',
					groupNameKey:'',
					mngUsernamekey:'',
					groupUsernameKey:'',
				},
				xmGroups: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:50,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmGroup界面是否显示
				addForm: {
					id:'',groupName:'',projectId:'',pgTypeId:'',pgTypeName:'',leaderUserid:'',leaderUsername:'',ctime:'',ltime:'',productId:'',branchId:'',pgClass:'',pgroupId:'',lvl:'',pidPaths:'',isTpl:'',assUserid:'',assUsername:'',childrenCnt:'',userCnt:'',qxCode:'',calcWorkload:'',ntype:'',crowBranchId:'',crowBranchName:'',isCrow:''
				},
				
				addFormInit: {
					id:'',groupName:'',projectId:'',pgTypeId:'',pgTypeName:'',leaderUserid:'',leaderUsername:'',ctime:'',ltime:'',productId:'',branchId:'',pgClass:'',pgroupId:'',lvl:'',pidPaths:'',isTpl:'',assUserid:'',assUsername:'',childrenCnt:'',userCnt:'',qxCode:'',calcWorkload:'',ntype:'',crowBranchId:'',crowBranchName:'',isCrow:''
				},
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					id:'',groupName:'',projectId:'',pgTypeId:'',pgTypeName:'',leaderUserid:'',leaderUsername:'',ctime:'',ltime:'',productId:'',branchId:'',pgClass:'',pgroupId:'',lvl:'',pidPaths:'',isTpl:'',assUserid:'',assUsername:'',childrenCnt:'',userCnt:'',qxCode:'',calcWorkload:'',ntype:'',crowBranchId:'',crowBranchName:'',isCrow:''
				},
				maxTableHeight:300,

				
				userSelectVisible: false,     
				xmRecordVisible:false,
				xmGroupStateVisible:false,
				imGroups:[],
				imGroupVisible:false,
				groupRoleDescVisible:false, 
				groupOperSelectVisible:false,
				currNodeType:'',//project/product/iteration/group/groupUser
				groupUserVisible:false,
				selectProjectVisible:false,
				selectProductVisible:false,
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmGroups();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmGroups();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				if(obj.order==null){
					this.pageInfo.orderFields=[];
					this.pageInfo.orderDirs=[]; 
				}else{
					var dir='asc';
					if(obj.order=='ascending'){
						dir='asc'
					}else{
						dir='desc';
					}
					 
					this.pageInfo.orderFields=[util.toLine(obj.prop)]; 
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmGroups();
			},
			searchXmGroups(){
				 this.pageInfo.count=true; 
				 this.getXmGroups();
			},
			loadNexGroup(){
				debugger;
				var params={}
				if(this.currNodeType=='branch'||this.currNodeType=='iteration'){
					params.branchId=this.editForm.branchId
					params.lvl=1
				}else if(this.currNodeType=='project'){
					params.projectId=this.editForm.id
					params.lvl=1
				}else if(this.currNodeType=='product'){
					params.productId=this.editForm.id
					params.lvl=1
				}else if(this.currNodeType=='group'){
					params.pgroupId=this.editForm.id
				}else if(this.currNodeType=='groupUser'){
					return;
				}
				listXmGroup(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						var childrens = res.data.data;
						childrens=childrens.filter(i=>!this.xmGroups.some(k=>k.id==i.id))
						this.xmGroups.push(...childrens)
					}else{
						this.$notify({ showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			//获取列表 XmGroup xm_group
			getXmGroups() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				
				if(this.selProject){
					params.projectId=this.selProject.id
				}
				if(this.xmIteration){
					params.iterationId=this.xmIteration.id
				}
				if(this.xmProduct){
					params.productId=this.xmProduct.id
				}
				if(this.filters.key){
					params.key=this.filters.key
				}
				if(this.filters.groupNameKey){
					params.groupNameKey=this.filters.groupNameKey
				}
				if(this.filters.groupUsernameKey){
					params.groupUsernameKey=this.filters.groupUsernameKey
				}
				if(this.filters.mngUsernamekey){
					params.mngUsernamekey=this.filters.mngUsernamekey
				}
				var func=getGroups
				this.load.list = true;
				if( !params.productId && !params.projectId && !params.iterationId){
					func=listXmGroup
					params.lvl=1
				}
				func(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmGroups = res.data.data;
					}else{
						this.$notify({ showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmGroup xm_group
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmGroup xm_group
			showAdd: function () {
				this.addForm={...this.addFormInit}
				if(this.currNodeType=='product'){
					this.addForm.pgroupId=null
					this.addForm.pgroupName=null
					this.addForm.productId=this.xmProduct.id
					this.addForm.pgClass="1" 
					this.addForm.projectId=null
					this.addForm.groupName=this.xmProduct.productName+"-产品管理组"
					this.addFormVisible = true;
				}else if(this.currNodeType=='project'){ 
					this.addForm.pgroupId=null
					this.addForm.pgroupName=null
					this.addForm.productId=null
					this.addForm.pgClass="0"
					this.addForm.projectId=this.selProject.id
					this.addForm.groupName=this.selProject.name+"-项目管理组"
					this.addFormVisible = true;
				}else{
					 return;
				}
				
				//this.addForm=Object.assign({}, this.editForm);
			},
			//显示新增界面 XmGroup xm_group
			showAddSub: function (row) { 
				
				if(!row){
					return;
				}
				this.addForm={...row}
				if("1"==row.pgClass){
					this.addForm.productId=row.productId
					this.addForm.pgClass="1" 
					this.addForm.projectId=null
				}else{
					this.addForm.productId=null
					this.addForm.pgClass="0"
					this.addForm.projectId=row.projectId
				} 
				this.addForm.pgroupId=row.id
				this.addForm.pgroupName=row.groupName
				this.addForm.groupName=row.groupName+"-"+"下级小组xx"
				this.addForm.id=null 
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(group){
				this.addFormVisible=false;
				//this.pageInfo.count=true;
				this.groupOperSelectVisible=false;
				this.xmGroups.push(group)
				//this.getXmGroups();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.groupOperSelectVisible=false;
				this.getXmGroups();
			},
			//选择行xmGroup
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmGroup
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true; 
					this.groupOperSelectVisible=false;
					let params = { id: row.id };
					delXmGroup(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmGroups();
						}
						this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmGroup
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmGroup(this.sels).then((res) => {
						this.load.del=false;
						this.groupOperSelectVisible=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmGroups(); 
						}
						this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			
			showGroupState(){
				this.xmGroupStateVisible=true;
			},
			doSearchImGroupsByProjectId(){
				
				var params={bizPid:this.selProject.id}
				listImGroup(params).then(res=>{
					this.imGroupVisible=true;
					var tips = res.data.tips;
					if(tips.isOk){
						this.imGroups=res.data.data;
					}
					this.$notify({showClose: true,
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
						this.$notify({showClose: true,
							message: tips.msg,
							type: tips.isOk ? 'success' : 'error'
						});
					})
				}else{
					that.$notify({
						message: "组员为空，不允许绑定",
						type:   'error'
					});
				}
				
			},
			
			//选择接收人
			onUserSelected: function(groupUsers) {  
				
				this.userSelectVisible = false;
				this.load.add=true;
				if(groupUsers==null||groupUsers.length==0){
					return;
				}
				var params=groupUsers.map(i=>{
					var u={
						userid:i.userid,
						username:i.username,
						groupId:this.editForm.id,
					}
					if(this.editForm.pgClass=='1'){
						u.projectId=null
						u.productId=this.editForm.productId
						u.pgClass=this.editForm.pgClass
					}else{
						u.projectId=this.editForm.projectId
						u.productId=null
						u.pgClass=this.editForm.pgClass
					}
					return u;
				})
				batchAddXmGroupUser(params).then(res=>{
					
					this.load.add=false;
					this.groupOperSelectVisible=false;
					var tips = res.data.tips
					if(tips.isOk){
						this.searchXmGroups()
					}
					this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error'}); 
				})
				
			}, 
			rowClick: function(row, event, column){
			    if(event.label!='操作' && event.type!='selection'){
			        this.showEdit(row)
			    }
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },
			renderCurrentClass (node) {
				return 'label-bg-blue'
			},
			handleNodeClick (data) { 
				if(data.currNodeType){
					this.currNodeType=data.currNodeType //project/product/iteration/group/groupUser
				}else{
					this.currNodeType=''
				}
				
				this.editForm=data;
				this.groupOperSelectVisible=true;
			},
			renderContent (h, node) {
				return (
				<div class={'diy-wrapper', node.isCurrent ? 'current-select' : ''}>
					<div class={'diy-con-name',node.data.userid? 'el-icon-user':''}>{node.data.label}<div></div></div>
					<div class="diy-con-content">
						{node.data.leaderUsername||node.data.assUsername?
							(<div> 负责人 {node.data.leaderUsername?node.data.leaderUsername:'' }  {node.data.assUsername?node.data.assUsername:''}</div> 
							)
						:   
						    (<div>   </div>)
						}
					</div>
				</div>
				)
			},
			
			//删除xmGroupUser
			handleDelGroupUser: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = row;
					delXmGroupUser(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){  
							this.groupOperSelectVisible=false;
							this.pageInfo.count=true;
							this.getXmGroups();
						}
						this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			onPorjectConfirm(project){
				this.addForm={...this.addFormInit}
				this.addForm.projectId=project.id
				this.addForm.groupName=project.name+"-管理小组"
				this.addForm.projectName=project.name
				this.addForm.pgClass="0"
				this.addFormVisible=true;
				this.selectProjectVisible=false;
			},
			onProductConfirm(product){
				this.addForm={...this.addFormInit}
				this.addForm.productId=product.id
				this.addForm.groupName=product.productName+"-管理小组"
				this.addForm.projectName=product.productName
				this.addForm.pgClass="1"
				this.addFormVisible=true;
				this.selectProductVisible=false;
			}
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
				
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);
			    this.initData()
				this.searchXmGroups(); 

        	});
		}
	}

</script>
<style>
.label-class-blue{
  color: #1989fa;
}
.label-bg-blue{
  background: #1989fa;
  color: #fff;
}
.diy-wrapper{
  padding:10px
}
.no-padding{
  padding: 0 !important;
}
.diy-wrapper.left-child{
  border: 1px solid red;
}
.diy-con-name{
	color: black;
}
.diy-con-content{
	padding-top:5px;
	color:dimgrey;
	font-size: 12px;
}
.crrentClass{
  border: 1px solid red;
  color: blue;
}
</style>
<style scoped>
</style>