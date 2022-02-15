<template>
	<section>
		
		
		<el-row>  
			<el-col  :span="6"  >
				<xm-product-mng :xm-iteration="xmIteration" @row-click="onProductSelected" ref="xmProductMng" :simple="true"></xm-product-mng>
			</el-col>
			<el-col :span="18"  style="padding-left:12px;" >
				<el-row  >  
 					<el-select class="hidden-md-and-down" v-if="excludeIterationId" v-model="filters.iterationFilterType" placeholder="是否加入过迭代？" clearable  >
						<el-option   value="not-join"  label="未加入任何迭代的故事"></el-option>  
						<el-option   value="join"  label="已加入迭代的故事"></el-option>  
					</el-select>
					<el-select class="hidden-md-and-down" v-else v-model="filters.taskFilterType" placeholder="是否分配了任务？" clearable  >
						<el-option   value="not-join"  label="未分配任何任务的故事"></el-option>  
						<el-option   value="join"  label="已分配任务的故事"></el-option>  
					</el-select> 
					<el-input v-model="filters.key" closable style="width: 20%;" placeholder="故事名查询"> 
					</el-input>  
					<el-button   type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmMenus" icon="el-icon-search"></el-button>
					<el-popover
						placement="top-start"
						title=""
						width="400"
						trigger="click" >
						<el-row> 
							<el-col  :span="24"  style="padding-top:5px;">
								<el-select    v-model="filters.iterationFilterType" placeholder="是否加入过迭代？" clearable  >
									<el-option   value="not-join"  label="未加入任何迭代的故事"></el-option>  
									<el-option   value="join"  label="已加入迭代的故事"></el-option>  
								</el-select>
							</el-col>
							<el-col  :span="24"  style="padding-top:5px;"> 
								<el-select   v-model="filters.taskFilterType" placeholder="是否分配了任务？" clearable >
									<el-option   value="not-join"  label="未分配任何任务的故事"></el-option>  
									<el-option   value="join"  label="已分配任务的故事"></el-option>  
								</el-select> 
							</el-col>
							<el-col :span="24"  style="padding-top:5px;">
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
									责任人:
								</font>  
								<el-tag v-if="filters.mmUser" closable @close="clearFiltersMmUser()">{{filters.mmUser.username}}</el-tag> 
								<el-button v-else @click="selectFiltersMmUser()">选责任人</el-button>
								<el-button   @click="setFiltersMmUserAsMySelf()">我的</el-button>
							</el-col>
							<el-col  :span="24"  style="padding-top:5px;">
								<font class="more-label-font">
									故事名称:
								</font> 
								<el-input   v-model="filters.key" style="width:100%;"  placeholder="输入故事名字关键字" clearable>  
								</el-input> 
							</el-col>
							<el-col  :span="24"  style="padding-top:5px;">
								<el-button type="primary"  @click="searchXmMenus" >查询</el-button>
 							</el-col> 
						</el-row> 
						<el-button  slot="reference" icon="el-icon-more"></el-button>
					</el-popover> 
					<el-button   type="primary" v-if="multi"  v-on:click="multiSelectedConfirm">确认选择</el-button>
				</el-row>
				<el-row style="padding-top:12px;">
					<el-table ref="table"  lazy :load="loadMenusLazy" :height="tableHeight" :data="xmMenusTreeData" default-expand-all  row-key="menuId" :tree-props="{children: 'children', hasChildren: 'childrenCnt'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
						<el-table-column v-if="multi" type="selection" width="50"></el-table-column>  
						<el-table-column prop="menuName" label="故事名称" min-width="140" > 
							<template slot-scope="scope">
								<el-link :icon="scope.row.ntype=='1'?'el-icon-folder-opened':''" @click="toMenu(scope.row)">{{scope.row.seqNo}}&nbsp;&nbsp;{{scope.row.menuName}}</el-link> 
							</template>
						</el-table-column>   
						<el-table-column prop="mmUsername" label="责任人" width="140" > 
							 
						</el-table-column> 
						<el-table-column label="操作"    width="200" fixed="right"  >
							<template slot-scope="scope"> 
								<el-button    type="primary" @click="selectedMenu( scope.row,scope.$index)">选择</el-button> 
							</template>
						</el-table-column>
					</el-table>
					<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
					
				</el-row>
			</el-col>  
			
			<el-drawer title="选择员工" :visible.sync="selectFiltersMmUserVisible" size="60%" append-to-body>
				<users-select  @confirm="onFiltersMmUserSelected" ref="selectFiltersMmUser"></users-select>
			</el-drawer>
			<el-drawer title="故事谈论" :visible.sync=" menuDetailVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
				<xm-menu-rich-detail :visible="menuDetailVisible"  :reload="false" :xm-menu="editForm" ></xm-menu-rich-detail>
			</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmMenu  } from '@/api/xm/core/xmMenu';
 	import  XmProductMng from '../xmProduct/XmProductSelect';//新增界面
 	import XmMenuRichDetail from './XmMenuRichDetail';
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; 

	import {sn} from '@/common/js/sequence'

	import { mapGetters } from 'vuex'
	
	export default { 
		props:['isSelectMenu','excludeIterationId','multi','visible','xmIteration'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
			
			xmMenusTreeData(){ 
				return this.translateDataToTree(this.xmMenus);
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
			}
		},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 6 );
			return {
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
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
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
				/**begin 自定义属性请在下面加 请加备注**/
				tableHeight:300,
				dateRanger: [ ],  
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

				if(!params.productId){
					params.branchId=this.userInfo.branchId
				}
				
				if( this.filters.key){
					params.key="%"+this.filters.key+"%"
				}
				 
				if(this.filters.mmUser){
					params.mmUserid=this.filters.mmUser.userid;
				}  
				if(this.filters.iterationFilterType){
					params.iterationFilterType=this.filters.iterationFilterType
				} 
				if(this.xmIteration){
					params.iterationFilterType='join'
					params.iterationId=this.xmIteration.id
				}
				if(this.filters.taskFilterType){
					params.taskFilterType=this.filters.taskFilterType
				} 
				if(this.selProject){
					params.projectId=this.selProject.id
				}
				
				if(this.filters.parentMenu){
					params.pmenuId=this.filters.parentMenu.menuId
				}
				
				if( this.dateRanger && this.dateRanger.length==2){
					params.ctimeStart=this.dateRanger[0] 
					params.ctimeEnd=this.dateRanger[1] 
				} 
				if(!(params.ctimeStart||params.pmenuId||params.projectId||params.iterationId||params.iterationFilterType||params.mmUserid||params.key||params.taskFilterType)){
					params.isTop="1"
				}
				return params;
			},
			loadMenusLazy(row, treeNode, resolve) {  
				if(row.children&&row.children.length>0){
					resolve(row.children) 
				}else{
					var params={pmenuId:row.menuId}
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
				}
				
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
				
				if( this.filters.product!==null && this.filters.product.id!=''){
					params.productId=this.filters.product.id
				}else {
					this.$message({showClose: true, message: "请先选择产品", type: 'success' });
					return;
					//params.xxx=xxxxx
				} 
				
				params=this.getParams(params)
				
				this.load.list = true;
				listXmMenu(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmMenus = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
 
			//选择行xmMenu
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			onProductSelected:function(product){
				this.filters.product=product
				this.getXmMenus()
			},
			 
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			
			/**begin 自定义函数请在下面加**/
			translateDataToTree(data2) { 
				var data=JSON.parse(JSON.stringify(data2));
				let parents = data.filter(value =>{
					//如果我的上级为空，则我是最上级 
					if(value.pmenuId == 'undefined' || value.pmenuId == null  || value.pmenuId == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.pmenuId==i.menuId)){
						return false;
					}else {
						return true
					}
				 
				}) 
				let children = data.filter(value =>{
					if(data.some(i=>value.pmenuId==i.menuId)){
						return true;
					}else{
						return false;
					} 
				})  
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.pmenuId === parent.menuId) {
								let temp = JSON.parse(JSON.stringify(children))
								temp.splice(index, 1)
								translator([current], temp)
								typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
							}
						}
						)
					}
					)
				}

				translator(parents, children)

				return parents
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
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
 			XmProductMng,XmMenuRichDetail,UsersSelect
 		    
		    //在下面添加其它组件
		},
		mounted() {  
			this.$nextTick(() => {
				if(this.excludeIterationId){
					this.filters.iterationFilterType='not-join'
				}
				this.getXmMenus(); 
            	var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=70/1000 * window.innerHeight; 
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight; 
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