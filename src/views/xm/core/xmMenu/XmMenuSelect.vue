<template>
	<section> 
		<el-row>   
			<el-col :span="24"  style="padding-left:12px;" >
				<el-row>     
						<xm-product-select v-if="!xmProduct&&!xmIteration" :auto-select="false" :link-project-id="selProject?selProject.id:null" @row-click="onProductSelected" ref="xmProductMng" :iteration-id="xmIteration?xmIteration.id:null"  @clear-select="onProductClearSelect" @close="productVisible=false"></xm-product-select>
 
						<xm-iteration-select v-if="!xmIteration" :auto-select="false" :link-project-id="selProject?selProject.id:null" @row-click="onIterationSelected" ref="xmIterationMng" :product-id="xmProduct?xmProduct.id:null"  @clear-select="onIterationClearSelect" @close="iterationVisible=false"></xm-iteration-select>
						 
						<el-select  v-model="filters.taskFilterType" placeholder="已分配任务的需求？" clearable v-if="taskFilterType">
							<el-option   value="not-join-any-project"  label="未分配过任务的需求"></el-option>  
							<el-option   value="join-any-project"  label="已分配过任务的需求"></el-option>  
							<el-option   value="not-join-curr-project"  :label="'未分配任务到项目【'+selProject.name+'】'" v-if="selProject && selProject.id"></el-option>  
							<el-option   value="join-curr-project"  :label="'已分配任务到项目【'+selProject.name+'】'"  v-if="selProject && selProject.id"></el-option>  
						</el-select>   
						<el-select   v-model="filters.iterationFilterType" placeholder="加入过迭代？" clearable  v-if="iterationFilterType">
							<el-option   value="not-join-any-iteration"  label="未加入过迭代"></el-option>  
							<el-option   value="join-any-iteration"  label="已加入过迭代"></el-option>  
							<el-option   value="not-join-curr-iteration"  :label="'未加入迭代【'+filters.iteration.iterationName+'】'"  v-if="filters.iteration && filters.iteration.id"></el-option>  
							<el-option   value="join-curr-iteration"  :label="'已加入本迭代【'+filters.iteration.iterationName+'】'" v-if="filters.iteration && filters.iteration.id"></el-option>  
						</el-select>  	    
					 <el-select v-model="filters.priority" placeholder="优先级"  clearable style="width: 100px;">
							<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option> 
					</el-select>      
					<el-select  v-model="filters.status" placeholder="需求状态" clearable style="width: 100px;">
						<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.menuStatus" :key="index"></el-option> 
					</el-select> 
					<el-input v-model="filters.key" style="width: 15%;" placeholder="需求名称查询" clearable> 
					</el-input> 
					<el-button   type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmMenus" icon="el-icon-search">查询</el-button>
					 
 					<el-popover
						placement="top-start"
						title=""
						width="400"
						trigger="click" >
						<el-row>  
							<el-col  :span="24"  style="padding-top:5px;" >
								<font class="more-label-font">标签条件:</font>  
								<el-button type="text" v-if="!filters.tags||filters.tags.length==0" @click.native="tagSelectVisible=true">标签</el-button>
								<el-tag v-else @click="tagSelectVisible=true"   closable @close="clearFiltersTag(filters.tags[0])">{{filters.tags[0].tagName.substr(0,5)}}等({{filters.tags.length}})个</el-tag>

							</el-col> 
							<el-col :span="24"  style="padding-top:5px;">
								<font class="more-label-font">创建日期:</font>  
								<el-date-picker
									v-model="dateRanger" 
									type="daterange"
									align="right"
									unlink-panels
									range-separator="至"
									start-placeholder="创建日期"
									end-placeholder="创建日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									:default-time="['00:00:00','23:59:59']"
									:picker-options="pickerOptions"
								></el-date-picker>   
							</el-col>   
							<el-col  :span="24"  style="padding-top:5px;">
								<font class="more-label-font">
									责任人:
								</font>  
								<el-tag v-if="filters.mmUser" closable @close="clearFiltersMmUser()">{{filters.mmUser.username}}</el-tag> 
								<el-button   v-else @click="selectFiltersMmUser()">选责任人</el-button>
								<el-button    @click="setFiltersMmUserAsMySelf()">我的</el-button>
							</el-col>
							<el-col  :span="24"  style="padding-top:5px;" class="hidden-log-and-up">
								<font class="more-label-font">
									需求是否加入了迭代:
								</font>  
								<el-select   v-model="filters.iterationFilterType" placeholder="加入过迭代？" clearable >
									<el-option   value="not-join-any-iteration"  label="未加入过迭代"></el-option>  
									<el-option   value="join-any-iteration"  label="已加入过迭代"></el-option>  
									<el-option   value="not-join-curr-iteration"  :label="'未加入迭代【'+filters.iteration.iterationName+'】'"  v-if="filters.iteration && filters.iteration.id"></el-option>  
									<el-option   value="join-curr-iteration"  :label="'已加入本迭代【'+filters.iteration.iterationName+'】'" v-if="filters.iteration && filters.iteration.id"></el-option>  
								</el-select>  
							</el-col>
							
							<el-col  :span="24"  style="padding-top:5px;" class="hidden-log-and-up">
								<font class="more-label-font">
									需求是否分配了任务:
								</font>   
								<el-select  v-model="filters.taskFilterType" placeholder="已分配任务的需求？" clearable >
									<el-option   value="not-join-any-project"  label="未分配过任务的需求"></el-option>  
									<el-option   value="join-any-project"  label="已分配过任务的需求"></el-option>  
									<el-option   value="not-join-curr-project"  :label="'未分配任务到项目【'+selProject.name+'】'" v-if="selProject && selProject.id"></el-option>  
									<el-option   value="join-curr-project"  :label="'已分配任务到项目【'+selProject.name+'】'"  v-if="selProject && selProject.id"></el-option>  
								</el-select>   
							</el-col>
							<el-col  :span="24"  style="padding-top:5px;" class="hidden-log-and-up">
								<font class="more-label-font">
									需求层次:
								</font>  
								<el-select v-model="filters.dlvl" placeholder="需求层次"  clearable>
									<el-option v-for="i in this.dicts.demandLvl" :label="i.name" :key="i.id" :value="i.id"></el-option>
								</el-select>  
							</el-col>
							<el-col  :span="24"  style="padding-top:5px;" class="hidden-log-and-up">
								<font class="more-label-font">
									需求类型:
								</font>  
								<el-select v-model="filters.dtype" clearable placeholder="需求类型" style="width: 100px;">
									<el-option v-for="i in this.dicts.demandType" :label="i.name" :key="i.id" :value="i.id"></el-option>
								</el-select>   
							</el-col>
							<el-col  :span="24"  style="padding-top:5px;" class="hidden-log-and-up">
								<font class="more-label-font">
									需求来源:
								</font>  
 
								<el-select v-model="filters.source" placeholder="需求来源"  clearable style="width: 100px;">
									<el-option v-for="i in this.dicts.demandSource" :label="i.name" :key="i.id" :value="i.id"></el-option>
								</el-select>     
							</el-col>
							<el-col  :span="24"  style="padding-top:5px;" class="hidden-log-and-up">
								<font class="more-label-font">
									需求层次:
								</font>  
								<el-select v-model="filters.dlvl" placeholder="需求层次"  clearable class="hidden-md-and-down" style="width: 100px;">
									<el-option v-for="i in this.dicts.demandLvl" :label="i.name" :key="i.id" :value="i.id"></el-option>
								</el-select>    
							</el-col>
							<el-col  :span="24"  style="padding-top:5px;" class="hidden-log-and-up">
								<font class="more-label-font">
									需求层次:
								</font>  
								<el-select v-model="filters.dlvl" placeholder="需求层次"  clearable>
									<el-option v-for="i in this.dicts.demandLvl" :label="i.name" :key="i.id" :value="i.id"></el-option>
								</el-select>  
							</el-col>
							<el-col  :span="24"  style="padding-top:5px;">
								<el-button type="primary"  @click="searchXmMenus" icon="el-icon-search">查询</el-button>
							</el-col>  
						</el-row> 
						<el-button  slot="reference" icon="el-icon-more"></el-button>
					</el-popover>  
					
					<el-button  style="float:right;" type="primary" v-if="multi"  v-on:click="multiSelectedConfirm">确认选择</el-button>
				</el-row>   
				<el-row style="padding-top:12px;">
					<el-table ref="table" class="menu-table"  lazy :load="loadMenusLazy" :height="maxTableHeight" :data="xmMenusTreeData"   row-key="menuId" :tree-props="{children: 'children', hasChildren: 'childrenCnt'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
						<el-table-column v-if="multi" type="selection" width="50"></el-table-column>  
						
						<el-table-column prop="menuName" label="需求名称" min-width="140" > 
							<template slot-scope="scope">
								
								<div  v-if="scope.row.dclass=='1'" class="icon" style="background-color:  rgb(255, 153, 51);">
									<i class="el-icon-s-promotion"></i>
									</div> 
									<div v-if="scope.row.dclass=='2'" class="icon" style="background-color:  rgb(0, 153, 51);">
									<i class="el-icon-s-flag"></i>
									</div>
									<div v-if="scope.row.dclass=='3'" class="icon" style="background-color:  rgb(79, 140, 255);">
									<i class="el-icon-document"></i>
								</div>
								<span class="vlink" @click="toMenu(scope.row)">{{scope.row.seqNo}}&nbsp;
								{{scope.row.menuName}}</span> 
							</template>
						</el-table-column> 
						<el-table-column prop="productId" label="产品" min-width="100" >   </el-table-column>
						<el-table-column prop="iterationName" label="迭代" min-width="140" >   </el-table-column>
						<el-table-column label="操作"    width="100" fixed="right"  >
							<template slot-scope="scope"> 
								<el-button  :disabled="checkScope && checkScope!==scope.row.ntype"  type="primary" @click="selectedMenu( scope.row,scope.$index)">选择</el-button> 
							</template>
						</el-table-column>
					</el-table>
					<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
					
				</el-row>
			</el-col>  
			
			<el-drawer title="选择员工" :visible.sync="selectFiltersMmUserVisible" size="60%" append-to-body>
				<users-select  @confirm="onFiltersMmUserSelected" ref="selectFiltersMmUser"></users-select>
			</el-drawer>
			<el-drawer title="需求谈论" :visible.sync=" menuDetailVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
				<xm-menu-rich-detail :visible="menuDetailVisible"  :reload="false" :xm-menu="editForm" ></xm-menu-rich-detail>
			</el-drawer> 
			
			<el-drawer append-to-body title="标签条件" :visible.sync="tagSelectVisible"  size="60%">
				<tag-mng :tagIds="filters.tags?filters.tags.map(i=>i.tagId):[]" :jump="true" @select-confirm="onTagSelected">
				</tag-mng>
			</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmMenu  } from '@/api/xm/core/xmMenu';
 	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//新增界面
 	import XmMenuRichDetail from './XmMenuRichDetail';
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; 

  	import TagMng from "@/views/mdp/arc/tag/TagMng";

	import  XmIterationSelect from '../xmIteration/XmIterationSelect';//修改界面
	import {sn} from '@/common/js/sequence'

	import { mapGetters } from 'vuex'
	
	export default { 
		props:['isSelectMenu','multi','visible','xmIteration','xmProduct','selProject','checkScope'/**0-需求，1-需求池 */,'iterationFilterType','taskFilterType'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
			
			xmMenusTreeData(){ 
				var xmMenus=JSON.parse(JSON.stringify(this.xmMenus))
				return treeTool.translateDataToTree(xmMenus,"pmenuId","menuId");
			},
		},
		watch:{ 
			visible:function(visible){
				if(visible==true){
					this.getXmMenus();
				}
			},
			xmItertaion(){
				this.getXmMenus();
			},
			
			xmProduct(){
				this.filters.product=this.xmProduct
				this.getXmMenus();
			},
			selProject(){ 
				this.getXmMenus();
			}
		},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 6 );
			return {
				maps:new Map(),
				filters: {
					key: '',
					product:null,
					iterationFilterType:'',////join,not-join,''
					mmUser:null,
					taskFilterType:'',//join,not-join,''
				},
				xmMenus: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:50,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['seq_no'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['asc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmMenu界面是否显示
				//新增xmMenu界面初始化数据
				addForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmMenu界面初始化数据
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:''
				},
 				menuDetailVisible:false,
				 selectFiltersMmUserVisible:false,
				 productVisible:false,
				iterationVisible:false,
				/**begin 自定义属性请在下面加 请加备注**/
				maxTableHeight:300,
				dateRanger: [ ],  
				tagSelectVisible:false,
				pickerOptions:  util.pickerOptions('datarange'),
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmMenus();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmMenus();
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
				this.getXmMenus();
			},
			searchXmMenus(){
				 this.pageInfo.count=true; 
				 this.getXmMenus();
			},
			getParams(params){ 
				
				if( this.filters.key){
					params.key="%"+this.filters.key+"%"
				}
				 
				if(this.filters.mmUser){
					params.mmUserid=this.filters.mmUser.userid;
				}  
				if(this.filters.iterationFilterType){
					params.iterationFilterType=this.filters.iterationFilterType
					if(params.iterationFilterType==='not-join-any-iteration'){

					}else if(params.iterationFilterType==='join-any-iteration'){

					}else if(params.iterationFilterType==='not-join-curr-iteration'){
						params.filterIterationId=this.filters.iteration.id
					}else if(params.iterationFilterType==='join-curr-iteration'){
						params.filterIterationId=this.filters.iteration.id
					} 
					params.ntype="0"
				}else{
					if(this.filters.iteration){
						params.iterationId=this.filters.iteration.id
					}
				}
				if(this.xmIteration && this.xmIteration.id){ 
					params.linkIterationId=this.xmIteration.id
				}
				if(this.filters.taskFilterType){
					params.taskFilterType=this.filters.taskFilterType 
					 
					if(params.taskFilterType==='not-join-curr-project'){
						params.projectId=this.selProject.id 
					} 
					if(params.taskFilterType==='join-curr-project'){
						params.projectId=this.selProject.id 
					} 
					params.ntype="0"
				} 
				if(this.selProject && this.selProject.id){
					params.linkProjectId=this.selProject.id
				} 
				if(this.filters.product){
					params.productId=this.filters.product.id
				}  
				if(this.filters.status){
					params.status=this.filters.status
				}
				
				if(this.filters.dlvl){
					params.dlvl=this.filters.dlvl
				}
				
				if(this.filters.dtype){
					params.dtype=this.filters.dtype
				}
				
				if(this.filters.priority){
					params.priority=this.filters.priority
				}
				
				if(this.filters.source){
					params.source=this.filters.source
				}
				if( this.dateRanger && this.dateRanger.length==2){
					params.ctimeStart=this.dateRanger[0] 
					params.ctimeEnd=this.dateRanger[1] 
				} 
				if(this.filters.tags && this.filters.tags.length>0){
					params.tagIdList=this.filters.tags.map(i=>i.tagId)
				} 
				return params;
			},
			loadMenusLazy(tree, treeNode, resolve) {  
				this.maps.set(tree.menuId, { tree, treeNode, resolve }) //储存数据
				var params={pmenuId:tree.menuId}
				params=this.getParams(params);
				params.isTop=""
				this.load.list = true;
				var func=listXmMenu 
				func(params).then(res=>{
					this.load.list = false
					var tips = res.data.tips;
					if(tips.isOk){
						resolve(res.data.data) 
					}else{
						resolve([])
					}
				}).catch( err => this.load.list = false );   
				
			},
			reloadChildren(rows){  
            	treeTool.reloadAllChildren(this.$refs.table,this.maps,rows,'pmenuId',this.loadMenusLazy) 
			},
			//获取列表 XmMenu xm_project_menu
			getXmMenus() {
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
				
				if( this.filters.product  && this.filters.product.id){
					params.productId=this.filters.product.id
				}
				
				params=this.getParams(params)
				
				if(!params.productId && !params.iterationId && !params.linkIterationId){ 
					this.$notify({showClose: true, message: "请先选择产品", type: 'warning' });
					return; 
				}
				params.withParents="1"
				this.load.list = true;
				listXmMenu(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmMenus = res.data.data;
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
 
			//选择行xmMenu
			selsChange: function (sels) {
				this.sels = sels;
			},  
			 
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			 
			/**begin 自定义函数请在下面加**/
			selectedMenu:function(row){
				this.$emit("selected",row)
				this.$emit("menus-selected",[row])
			},
			multiSelectedConfirm(){
				this.$emit("menus-selected",this.sels)
			},
			toMenu:function(row){
				this.editForm=row
				this.menuDetailVisible=true;
			}, 
			clearFiltersMmUser:function(){
				 this.filters.mmUser=null;
				  this.searchXmMenus();
			},			
			selectFiltersMmUser(){
				this.selectFiltersMmUserVisible=true;
			},
			onFiltersMmUserSelected(users){
				
				 if(users && users.length>0){
					 this.filters.mmUser=users[0]
				 }else{
					 this.filters.mmUser=null;
				 }
				 this.selectFiltersMmUserVisible=false;
				 this.searchXmMenus();
			},
			setFiltersMmUserAsMySelf(){
				this.filters.mmUser=this.userInfo;
				this.searchXmMenus();
			},
			
			onProductSelected:function(product){
				this.filters.product=product 
				this.productVisible=false;
				this.xmMenus=[]
				this.searchXmMenus()
			},
			onProductClearSelect:function(){
				this.filters.product=null  
				this.productVisible=false;
				this.xmMenus=[]
				this.searchXmMenus()
			},	 
			onIterationSelected:function(iteration){
				this.filters.iteration=iteration  
				this.iterationVisible=false;
				this.xmMenus=[]
				this.searchXmMenus()
			},
			onIterationClearSelect:function(){
				this.filters.iteration=null  
				this.iterationVisible=false;
				this.xmMenus=[]
				this.searchXmMenus()
			},	
			 
			clearFiltersTag(tag){
				var index=this.filters.tags.findIndex(i=>i.tagId==tag.tagId)
				this.filters.tags.splice(index,1);
				this.searchXmMenus();
			},
			onTagSelected(tags){
				
				this.tagSelectVisible = false; 
				if (!tags || tags.length == 0) { 
					this.filters.tags=[]
				}else{
					this.filters.tags=tags
				}
				this.searchXmMenus();
			},
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
 			XmProductSelect,XmMenuRichDetail,UsersSelect,XmIterationSelect,TagMng,
 		    
		    //在下面添加其它组件
		},
		mounted() {  
			
  			initSimpleDicts("all",['menuStatus','demandSource','demandLvl','demandType','priority']).then(res=>{
				this.dicts=res.data.data;
			})
			this.$nextTick(() => {
				
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);   
				if(this.selProject && this.selProject.id){ 
					this.filters.taskFilterType='join-curr-project'
				}
				
				if(this.xmIteration && this.xmIteration.id){ 
					this.filters.iterationFilterType='join-curr-iteration'
					this.filters.iteration=this.xmIteration
				}
				if(this.iterationFilterType){
					this.filters.iterationFilterType=this.iterationFilterType
				}
				
				if(this.taskFilterType){
					this.filters.taskFilterType=this.taskFilterType
				}
				this.filters.product=this.xmProduct
				this.getXmMenus();  
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
.top{
	margin-top:-30px;
}
</style>