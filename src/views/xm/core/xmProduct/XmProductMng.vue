<template>
	<section class="page-container">
		<el-row>
		<el-col :span="6" v-if="templateVisible"> 
			<xm-product-tpl-mng @copy="searchXmProducts" ref="xmProductTplMngRef" show-type="simple"></xm-product-tpl-mng>
		</el-col> 
		<el-col :span="templateVisible?18:24" class="padding-top padding-left border">
			<el-row>
				<el-row>
					<el-select   v-model="filters.queryScope"    placeholder="产品查询范围">
						<el-option :label="userInfo.branchName+'机构下所有的产品'" value="branchId"></el-option>
						<el-option label="我相关的产品" value="compete"></el-option>
						<el-option label="按产品编号精确查找" value="productId"></el-option>
					</el-select>
					<el-input v-if="filters.queryScope=='productId'" style="width:20%;"  v-model="filters.id"  placeholder="输入产品编号" @keyup.enter.native="searchXmProducts">
					</el-input>
					<el-input v-model="filters.key" style="width: 20%;" placeholder="名称查询" clearable>   
					</el-input>
					<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProducts" icon="el-icon-search">查询</el-button>
					
					<el-popover style="padding-left:10px;"  
							placement="top-start"
							width="450" 
							trigger="click" > 
							<el-row> 
								<el-col :span="24" style="padding-top:5px;">
									<el-badge value="都适用">
									<el-button   @click="showAdd" icon="el-icon-plus">直接添加新产品</el-button> 
									</el-badge>
								</el-col>  
								<el-col :span="24" style="padding-top:5px;">
									<el-badge value="进阶">
									<el-button type="primary" icon="el-icon-plus">通过【产品-复制】一键创建新的产品</el-button> 
									</el-badge>
								</el-col> 
								<el-col :span="24" style="padding-top:5px;">
									<el-badge value="新手">
									<el-button type="warning" @click="templateVisible=!templateVisible" icon="el-icon-plus">通过【模板-复制】一键创建新的产品</el-button> 
									</el-badge>
								</el-col> 
							</el-row>   
 							<el-button type="primary" slot="reference"  icon="el-icon-plus" v-if="!xmIteration">产品</el-button>
					</el-popover>
					<el-popover
						placement="top-start"
						title=""
						width="500"
						trigger="click" >
						<el-divider content-position="left"><strong>查询条件</strong></el-divider>
						<el-row>
							<el-col :span="24" style="padding-top:5px;">

								<font class="more-label-font">
									产品查询范围：
								</font>
								<el-select  v-model="filters.queryScope" style="width:100%;"   placeholder="产品查询范围">
									<el-option :label="userInfo.branchName+'机构下的产品'" value="branchId"></el-option>
									<el-option label="我相关的产品" value="compete"></el-option>
									<el-option label="按产品编号精确查找" value="productId"></el-option>
								</el-select>
							</el-col>
							<el-col  :span="24"  style="padding-top:5px;">
								<el-input v-if="filters.queryScope=='productId'"  v-model="filters.id" style="width:100%;"  placeholder="输入产品编号" @keyup.enter.native="searchXmProducts">
								</el-input>
							</el-col>
							<el-col v-show="!selProject&&filters.queryScope!='productId'" :span="24"  style="padding-top:5px;">
								<font class="more-label-font">创建时间:</font>
								<el-date-picker
									v-model="dateRanger"
									type="daterange"
									align="right"
									unlink-panels
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="完成日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									:default-time="['00:00:00','23:59:59']"
									:picker-options="pickerOptions"
								></el-date-picker>
							</el-col>
							<el-col  :span="24"  style="padding-top:5px;">
								<font class="more-label-font">
									产品名称:
								</font>
								<el-input   v-model="filters.key" style="width:100%;"  placeholder="输入产品名字关键字">
								</el-input>
							</el-col>
							<el-col  :span="24"  style="padding-top:5px;">
								<font class="more-label-font">
									产品经理:
								</font>
								<el-tag v-if="filters.pmUser" closable @click="selectFiltersPmUser" @close="clearFiltersPmUser()">{{filters.pmUser.username}}</el-tag>
								<el-button   v-else @click="selectFiltersPmUser()">选责任人</el-button>
								<el-button    @click="setFiltersPmUserAsMySelf()">我的</el-button>
							</el-col>

							<el-col v-if="selProject" :span="24"  style="padding-top:5px;">
								<font class="more-label-font">
									项目  <el-tag v-if="selProject">{{selProject?selProject.name:''}}</el-tag>
								</font>
							</el-col>
							<el-col  v-if="xmIteration"  :span="24"  style="padding-top:5px;">
								<font class="more-label-font">
									迭代 <el-tag v-if="xmIteration">{{xmIteration.iterationName}}</el-tag>
								</font>
							</el-col>
							<el-col  :span="24"  style="padding-top:10px;">
								<el-button type="primary"  @click="searchXmProducts" >查询</el-button><el-button type="text"  @click="templateVisible=!templateVisible" >{{templateVisible?"隐藏模板":"显示模板"}}</el-button>
							</el-col>
						</el-row>
						<el-button  slot="reference"   icon="el-icon-more"></el-button>
					</el-popover>
				</el-row>
				<el-row  class="page-main "  v-show="showType">
					<!--列表 XmProject xm_project-->
					<el-row v-loading="load.list">
						<el-col  v-cloak v-for="(p,i) in xmProducts" :key="i" :xl="4" :lg="6" :md="8" :sm="12">
							<el-card @click.native="intoInfo(p,i)" class="project-card" shadow="always">
								<div class="project-name" title="这是产品名称">{{p.productName}}</div>
								<div class="project-id eui-text-truncate">{{p.code}}</div>
								<div class="project-info">
									<div class="info-item">
										<span class="item-total">{{p.totalBugCnt==null?0:p.totalBugCnt}}</span>
										<span class="item-type">缺陷</span>
									</div>
									<div class="info-item">
										<span class="item-total">{{p.totalFileCnt==null?0:p.totalFileCnt}}</span>
										<span class="item-type">文档</span>
									</div>
									<div class="info-task">
										<span>
											<span class="item-total finish-task">{{p.totalCompleteTaskCnt==null?0:p.totalCompleteTaskCnt}}</span>
											<span style="margin: 0 .25rem !important;">/</span>
											<span class="item-type total-task">{{p.totalTaskCnt==null?0:p.totalTaskCnt}}</span>
										</span>
										<span class="item-type">任务完成</span>
									</div>
								</div>
								<div class="project-rate">
									<el-progress :percentage="(p.totalProgress==null?0:p.totalProgress)"></el-progress>
								</div>
								<div class="project-footer">
									<div class="project-type">{{p.xmType}}</div>
									<!--<div class="project-period">{{p.startTime.substr(0,10)}} ~{{p.endTime.substr(0,10)}}</div>-->
								</div>
							</el-card>
						</el-col>
					</el-row>
				</el-row>
				<el-row  class="padding-top" v-show="!showType">
					<!--列表 XmProduct 产品表-->
					<el-table ref="table"  :height="maxTableHeight" :data="xmProducts" @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
						
						<el-table-column type="index" width="60"> 
						</el-table-column>
						<el-table-column prop="productName" label="产品名称" min-width="200" sortable>
							<template slot-scope="scope">
								<el-link type="primary" @click="intoInfo(scope.row)">{{scope.row.productName}}</el-link>
							</template>
						</el-table-column>
						<el-table-column prop="pstatus" label="状态" width="100" sortable :formatter="formatPstatus"> 
						</el-table-column>
						<el-table-column prop="finishRate" label="进度" width="100" sortable>
							<template slot-scope="scope"> 
								<font  ><el-tag :type="scope.row.finishRate>=100?'success':'warning'">{{scope.row.finishRate}}%</el-tag>

								<el-tooltip content="点击统计进度，由任务汇总"><el-button  type="text" icon="el-icon-video-play" @click.stop="loadTasksToXmProductState( scope.row)"></el-button></el-tooltip>

								</font>
							</template>
						</el-table-column>
						<el-table-column prop="pmUsername" label="产品经理" width="120" sortable show-overflow-tooltip>
							<template slot-scope="scope"> 						
								<el-tag v-if="scope.row.pmUsername">{{scope.row.pmUsername}}</el-tag> 
							</template>
						</el-table-column>
						
						<el-table-column label="工作量(人时)" width="200">
							<el-table-column prop="planWorkload" label="预计" width="100"  show-overflow-tooltip sortable></el-table-column>
							<el-table-column prop="actWorkload" label="实际" width="100"  show-overflow-tooltip sortable></el-table-column>
						</el-table-column>
						
						<el-table-column  label="操作" width="350" fixed="right">
							<template slot-scope="scope">
											<el-button type="text" title="通过复制创建新的产品" @click="onCopyToBtnClick(scope.row)" :disabled="load.add" v-loading="load.add">复制</el-button>
											<el-button  type="text" @click="showProductState(scope.row)" icon="el-icon-s-data">报告</el-button>  
											<el-button  type="text" @click="toIterationList(scope.row)" icon="el-icon-document">迭代</el-button>  
											<el-button  type="text" @click="toProjectList(scope.row)"  icon="el-icon-document">项目</el-button>  
											<el-button  type="text" @click="toTaskList(scope.row)"  icon="el-icon-tickets">任务</el-button>  
											<el-button  type="text" v-loading="load.del" @click="handleDel(scope.row)" :disabled="load.del==true" icon="el-icon-delete">删除</el-button> 
							</template>
						</el-table-column>
					</el-table>
					</el-row>
					<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

							<!--编辑 XmProduct 产品表界面-->
					<el-drawer title="编辑产品" :visible.sync="editFormVisible"  size="60%"   append-to-body   :close-on-click-modal="false">
						<xm-product-edit :xm-product="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-product-edit>
					</el-drawer>

					<!--新增 XmProduct 产品表界面-->
					<el-drawer title="新增产品" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
						<xm-product-add :xm-product="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-product-add>
					</el-drawer>
					<el-drawer title="产品状态数据" :visible.sync="productStateVisible"  width="100%"  append-to-body  :close-on-click-modal="false">
						<xm-product-state-mng :xm-product="editForm" :visible="productStateVisible" @cancel="productStateVisible=false"></xm-product-state-mng>
					</el-drawer>
					<el-drawer
						append-to-body
						title="产品关联的迭代查询"
						:visible.sync="iterationVisible"
						>
							<xm-iteration-mng :simple="true" :visible="iterationVisible" :product-id="editForm.id" ></xm-iteration-mng>
					</el-drawer>

					<el-drawer title="选择员工" :visible.sync="selectFiltersPmUserVisible" size="60%" append-to-body>
						<users-select  @confirm="onFiltersPmUserSelected" ref="usersSelect"></users-select>
					</el-drawer>
					<el-drawer title="选择项目" :visible.sync="projectVisible" size="60%" append-to-body>
						<xm-project-list  @select="onProjectSelected"></xm-project-list>
					</el-drawer>

					<el-drawer title="选择产品" :visible.sync="productSelectVisible" size="60%" append-to-body>
						<xm-product-select  @row-click="onXmProductSelect"></xm-product-select>
					</el-drawer>
					<el-drawer title="迭代报告" :visible.sync="iterationSelectVisible" fullscreen  append-to-body  :close-on-click-modal="false">
						<xm-iteration-select @row-click="onXmIterationSelect"></xm-iteration-select>
					</el-drawer> 
					<el-dialog
						title="通过复制创建新的模板或者新的产品"
						:visible.sync="copyToVisible"
						width="30%" > 
						<el-form>
						<el-form-item label="产品名称">
							<el-input v-model="xmProductCopy.productName" placeholder="新的产品名称"></el-input> 
						</el-form-item>
						<el-form-item  label="产品代号"> 
							<el-input v-model="xmProductCopy.code"  placeholder="新的产品代号"> 
							<template slot="append">
								<el-button type="text" @click="createProductCode">自动生成</el-button>
							</template></el-input>
						</el-form-item>
						<el-form-item  label="目标">
							<el-radio v-model="xmProductCopy.isTpl" label="1">复制为新的模板</el-radio>
							<el-radio v-model="xmProductCopy.isTpl" label="0">复制为新的产品</el-radio>
						</el-form-item>
						<el-form-item label="附加任务">
							<el-checkbox v-model="xmProductCopy.copyMenu" true-label="1" false-label="0">拷贝需求列表</el-checkbox>   
							<el-checkbox v-model="xmProductCopy.copyPhase" true-label="1" false-label="0">拷贝计划</el-checkbox>  
							<el-checkbox v-model="xmProductCopy.copyGroup" true-label="1" false-label="0">拷贝组织架构</el-checkbox>  
							<el-checkbox v-model="xmProductCopy.copyGroupUser" true-label="1" false-label="0">拷贝产品组成员</el-checkbox>  
						</el-form-item>
						</el-form>
						<span slot="footer" class="dialog-footer">
							<el-button @click="copyToVisible = false">取 消</el-button>
							<el-button type="primary" @click="onCopyToConfirm" :disabled="load.add" v-loading="load.add">确 定</el-button>
						</span>
					</el-dialog>
			</el-row>
		</el-col>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProduct,listXmProductWithState, delXmProduct, batchDelXmProduct,copyTo,createProductCode } from '@/api/xm/core/xmProduct';
	import { addXmIterationProductLink,delXmIterationProductLink } from '@/api/xm/core/xmIterationProductLink';
	import { loadTasksToXmProductState } from '@/api/xm/core/xmProductState';
	import  XmProductAdd from './XmProductAdd';//新增界面
	import  XmProductEdit from './XmProductEdit';//修改界面
	import  XmProductTplMng from './XmProductTplMng';//修改界面
	import { mapGetters } from 'vuex'
	import  XmIterationMng from '../xmIteration/XmIterationSelect';//修改界面
	import  XmProductStateMng from '../xmProductState/XmProductStateMng';//修改界面

	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
	import XmProjectList from '../xmProject/XmProjectList.vue';
	import XmIterationSelect from '../xmIteration/XmIterationSelect.vue';
import XmProductSelect from './XmProductSelect.vue';

	export default {
		props:['selProject','xmIteration'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		watch:{
			selProject:function(){
				this.getXmProducts();
			},
			xmIteration:function(){
				this.getXmProducts();
			}
		},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
			return {
				filters: {
					key: '',
					queryScope:'compete',//compete/branchId/''/productId
					id:'',//产品编号
					pmUser:null,//产品经理
				},
				xmProducts: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{
					xmProductPstatus:[]
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增xmProduct界面是否显示
				//新增xmProduct界面初始化数据
				addForm: {
					id:'',productName:'',branchId:'',remark:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmProduct界面初始化数据
				editForm: {
					id:'',productName:'',branchId:'',remark:''
				},
				iterationVisible:false,
				iterationSelectVisible:false,
				productStateVisible:false,
				selectFiltersPmUserVisible:false,
				maxTableHeight:300,
				dateRanger: [ 
				],
				pickerOptions:  util.pickerOptions('datarange'),
				projectVisible:false,
				productSelectVisible:false,
				showType:false,
				xmProductCopy:{
					id:'',productName:'',code:'',isTpl:'',copyMenu:'1',copyPhase:'1',copyGroup:'1',copyGroupUser:'0'
				},
				copyToVisible:false,
				templateVisible:false,
				/**begin 自定义属性请在下面加 请加备注**/

				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmProducts();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProducts();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmProducts();
			},
			searchXmProducts(){
				 this.pageInfo.count=true;
				 this.getXmProducts();
			},
			showProductState(row){
				this.editForm=row
				this.productStateVisible=true;
			},
			loadTasksToXmProductState: function (row) {
				this.load.edit=true;

				let params = { productId: row.id };
				loadTasksToXmProductState(params).then((res) => {
					this.load.edit=false;
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.count=true;
						this.getXmProducts();
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err  => this.load.edit=false );
			},
			//获取列表 XmProduct 产品表
			getXmProducts() {
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
				params.queryScope=this.filters.queryScope
				if(this.filters.queryScope=='productId'){
					if(!this.filters.id){
						this.$notify({showClose: true, message:"您选择了按产品编号精确查找模式，请输入产品编号", type: 'error' });
						return;
					}
					params.id=this.filters.id

				}
				if(this.filters.queryScope=="branchId"){
					params.branchId=this.userInfo.branchId
				}
				if(this.dateRanger && this.dateRanger.length==2){
					 
					params.ctimeStart=this.dateRanger[0]
					params.ctimeEnd=this.dateRanger[1]
				}
				if(this.xmIteration){
					 params.iterationId=this.xmIteration.id
				}
				if(this.filters.key!==""){
					params.key="%"+this.filters.key+"%"
				}
				if(this.selProject){
					params.projectId=this.selProject.id
				}
				if(this.filters.pmUser){
					params.pmUserid=this.filters.pmUser.userid
				}
				this.load.list = true;
				listXmProductWithState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProducts = res.data.data; 
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProduct 产品表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProduct 产品表
			showAdd: function () {
				if(!this.roles.some(i=>i.roleid=='productAdmin')){
					this.$notify({showClose: true, message: "只有产品经理能够创建产品", type: 'error'});
					return false;
				}
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(xmProduct){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				if(this.xmIteration){//如果是迭代试图进入的迭代界面，创建了产品直接添加产品与迭代的关系
					this.onXmProductSelect(xmProduct);
				}else{
					this.getXmProducts();
				}
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getXmProducts()
			},

			//进入info界面
			intoInfo(row) {
				this.editForm = row;
				this.$router.push({ name:'XmProductInfoRoute', params: row })
				//this.showInfo = true;
			},
			//选择行xmProduct
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			
			handleDel: function (row,index) {  
				this.$prompt('将同步删除计划、组织、需求等，慎重起见，请输入产品代号:'+row.code, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					 if(value==row.code){
						this.load.del=true;
						let params = { id: row.id };
						delXmProduct(params).then((res) => {
							this.load.del=false;
							var tips=res.data.tips;
							if(tips.isOk){
								this.pageInfo.count=true;
								this.getXmProducts();
							}
							this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
						}).catch( err  => this.load.del=false );
					 }else{
						 this.$notify({showClose: true, message: "产品代号不正确", type: 'error' }); 
					 }
				}).catch(() => { 
					return;    
				}); 	
			},
			//批量删除xmProduct
			batchDel: function () {
				if(!this.roles.some(i=>i.roleid=='productAdmin')){
					this.$notify({showClose: true, message: "只有产品经理能够删除产品", type: 'error'});
					return false;
				}
				var mmSels=this.sels.filter(i=>i.pmUserid!=this.userInfo.userid)
				if(mmSels.length>0){
					this.$notify({showClose: true, message: "只能删除你负责的产品", type: 'error'});
					return false;
				}
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmProduct(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmProducts();
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			selectedProduct:function(row){
				this.$emit('selected',row);
			},
			toProjectList:function(product){
				this.$router.push({name:'xmProjectMng',params:{productId:product.id,productName:product.productName}})
			},
			toIterationList:function(product){
				 this.editForm=product
				 this.iterationVisible=true;

			},
			toTaskList:function(product){
				this.$router.push({name:'XmTaskCenterForProduct',params:{productId:product.id,productName:product.productName}})

			},
			/**begin 自定义函数请在下面加**/
			clearFiltersPmUser:function(){
				 this.filters.pmUser=null;
				  this.searchXmProducts();
			},
			selectFiltersPmUser(){
				this.selectFiltersPmUserVisible=true;
			},
			onFiltersPmUserSelected(users){
				 if(users && users.length>0){
					 this.filters.pmUser=users[0]
				 }else{
					 this.filters.pmUser=null;
				 }
				 this.selectFiltersPmUserVisible=false;
				 this.searchXmProducts();
			},
			setFiltersPmUserAsMySelf(){
				this.filters.pmUser=this.userInfo;
				this.searchXmProducts();
			},
			onProjectSelected(projects){

			},
			onXmIterationSelect(){

			},
			/**end 自定义函数请在上面加**/
			onXmProductSelect:function(row){
				var xmIteration=this.xmIteration;
				var xmProduct=row;
				this.$confirm('确认将产品【'+xmProduct.productName+'】加入迭代计划【'+xmIteration.iterationName+'】吗？', '提示', {
					type: 'warning'
				}).then(()=>{
					addXmIterationProductLink({iterationId:xmIteration.id,productId:xmProduct.id}).then(res=>{
						var tips =res.data.tips;
						if(tips.isOk){
							this.getXmProducts();
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					})
				})
			},
			doDelXmIterationProductLink(row){
				var xmIteration=this.xmIteration;
				var xmProduct=row;
				this.$confirm('确认将产品【'+xmProduct.productName+'】与迭代【'+xmIteration.iterationName+'】进行脱钩吗？脱钩后，产品下的所有需求将从本迭代计划一并移出。', '提示', {
					type: 'warning'
				}).then(()=>{
					delXmIterationProductLink({iterationId:xmIteration.id,productId:xmProduct.id}).then(res=>{
						var tips =res.data.tips;
						if(tips.isOk){
							this.getXmProducts();
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					})
				})
			},
			
			onCopyToBtnClick(row){
				this.xmProductCopy.id=row.id;
				this.xmProductCopy.productName=row.productName+"(复制)";
				this.xmProductCopy.isTpl=row.isTpl; 
				this.copyToVisible=true;
			},
			onCopyToConfirm(){ 
				if(!this.xmProductCopy.code){
					this.$notify({showClose: true, message: '产品代号不能为空', type: 'error' });
					return;
				}
				this.load.add=true;
				copyTo(this.xmProductCopy).then(res=>{ 
					this.load.add=false;
					var tips = res.data.tips;
					if(tips.isOk){
						this.copyToVisible=false;
						if(this.xmProductCopy.isTpl=='0'){
							this.searchXmProducts()
						}else{
							this.$refs.xmProductTplMngRef.searchXmProducts()
						}
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });

				})
			},
			formatPstatus(row, column, cellValue, index){
				var item=this.options.xmProductPstatus.find(i=>i.optionValue==cellValue)
				if(item){
					return item.optionName
				}else{
					return cellValue;
				}
			}, 
			createProductCode(){
				createProductCode({}).then(res=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.xmProductCopy.code=res.data.data
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
				})
			},
			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    'xm-product-add':XmProductAdd,
		    'xm-product-edit':XmProductEdit,
			XmIterationMng,
			XmProductStateMng,
			UsersSelect,
			XmProjectList,
			XmIterationSelect,
			XmProductSelect,
			XmProductTplMng,
		    //在下面添加其它组件
		},
		mounted() {
			
			listOption([{categoryId:'all',itemCode:'xmProductPstatus'}] ).then(res=>{
				if(res.data.tips.isOk){ 
					this.options['xmProductPstatus']=res.data.data.xmProductPstatus   
				}
			});
			this.$nextTick(() => { 
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el); 
				this.getXmProducts();
        	});
		}
	}

</script>

<style scoped>


.more-label-font{
	text-align:center;
	float:left;
	padding-top:5px;
}

.align-right{
	float: right;
}
</style>

<style scoped>

.project-card{
	font-size: 12px;
	color: #999;
	margin: 10px 12px;
}
.project-card:hover{
	border-color: #00abfc;
}
.project-card >>> .el-card__body{
	padding: 20px 15px 10px;
}
.project-name{
	font-size: 16px;
	font-weight: 700;
	color: #333;
	height: 24px;
}
.project-id{
	margin-top: 4px;
	height: 18px;
}
.project-info{
	display: flex;
	margin-top: 8px;
}
.project-info>div{
	display: flex;
	flex-direction: column;
}
.info-item{
	width: 15%;
	text-align: center;
}
.info-item >>> span{
	display: block;
}
.item-total{
	font-size: 18px;
	color: #666;
}
.info-task{
	padding-left: 20px;
	width: 70%;
	border-left: 1px solid #efefef;
}
.finish-task{
	color: #00abfc !important;
}
.project-rate{
	margin: 15px 0;
}
.project-rate>.el-progress{
	display: flex;
	align-items: center;
}
.project-rate >>> .el-progress-bar{
	padding-right: 0;
	margin-right: 0;
}
.project-rate >>> .el-progress__text{
	margin-left: 5px;
}
.project-footer{
	display: flex;
}
.project-footer>div{
	width: 30%;
}
.project-footer>div:not(:first-child){
	width: 70%;
}
.project-period{
	text-align: right;
}
@media only screen and (max-height: 2400px) {
	.project-box{
		max-height: 1600x;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 1200px) {
	.project-box{
		max-height: 800px;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 980px) {
	.project-box{
		max-height: 600px;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 640px) {
	.project-box{
		max-height: 300px;
		overflow-y: auto;
	}
}

</style>
