<template>
	<section class="padding"> 
		<el-row>
			<div style="display:flex;">
				<xm-product-select v-if=" !xmProduct || !xmProduct.id" ref="xmProductSelect1" style="display:inline;"  :auto-select="true" :link-project-id="selProject?selProject.id:null" @row-click="onProductSelected" @clear="onProductClearSelect" ></xm-product-select>
				<el-input v-else v-model="filters.key" style="width:50%;"  placeholder="名称模糊查询"  clearable></el-input>  

				&nbsp;&nbsp; 
				<span style="margin-left: auto;">
					<el-popover
						placement="top-start"
						width="250"
						trigger="click" >
						<el-row>
							<el-row>
								<div   class="icon" style="background-color:  rgb(255, 153, 51);">
									<i class="el-icon-s-promotion"></i>
								</div>
								<el-button   @click="showAdd('1')">新建史诗</el-button>
							</el-row>
							<!--
							<el-row>
								<div  class="icon" style="background-color:  rgb(0, 153, 51);">
								<i class="el-icon-s-flag"></i>
								</div>
								<el-button   @click="showAdd('2')">新建特性</el-button>
							</el-row>
							<el-row>

								<div  class="icon" style="background-color:  rgb(79, 140, 255);">
								<i class="el-icon-document"></i>
								</div>
								<el-button   @click="showAdd('3')"  >新建用户故事</el-button>
							</el-row>
							-->

							<el-row>
								<el-button  @click="showImportFromMenuTemplate()" icon="el-icon-upload2">由模板快速导入需求</el-button>
							</el-row>
						</el-row>
						<el-button type="primary" v-if="!disabledMng" round  slot="reference" icon="el-icon-plus"></el-button>
					</el-popover> 
					<el-popover 
						placement="top-start"
						title="更多操作"
						width="400"
						trigger="manual"
						v-model="moreVisible"
					>
						<el-row>  
								<el-button  style="float:right;margin-top:-40px;"
								icon="el-icon-close"
								@click="moreVisible=false"
								type="text"
								>关闭</el-button
								> 
						</el-row>  
						<el-divider></el-divider>
						<el-row> 
						
							<el-button type="primary"  @click="showParentMenu" icon="el-icon-top" title="更换上级">更换上级</el-button> 
							<el-button type="danger" 
								@click="batchDel"
								v-loading="load.del"
								icon="el-icon-delete"
								title="批量删除" v-if="!disabledMng"
								>批量删除</el-button
							>
							<el-button          @click="loadTasksToXmMenuState" icon="el-icon-s-marketing" title="汇总进度">汇总进度</el-button> 
						</el-row>
						<el-divider></el-divider>

						<el-row> 
							<el-button    type="primary"      @click="searchXmMenus" icon="el-icon-search" title="查询" style="float:right;">查询</el-button> 
						</el-row>  
						<el-button slot="reference" @click="moreVisible=!moreVisible" icon="el-icon-more"></el-button>
					</el-popover>  
			</span>
			</div>
			</el-row> 
		<el-row >
			<el-table ref="table" :cell-style="cellStyleCalc" :expand-row-keys="expandRowKeysCpd" :header-cell-style="cellStyleCalc"    stripe fit border  :height="maxTableHeight" :data="xmMenusTreeData" current-row-key="menuId" row-key="menuId" :tree-props="{children: 'children'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick"
				element-loading-text="努力加载中"
				element-loading-spinner="el-icon-loading" 
			>
				<template v-if="!disabledMng">
					<el-table-column sortable type="selection" width="40"></el-table-column> 
				</template>
				
				<el-table-column prop="menuName" label="史诗、特性名称" min-width="150" > 
					<template slot="header">
						<div style="display:flex;"> 
							<div style="text-align: center;line-height: 32px;" title="史诗特性名称">史诗、特性</div>
							&nbsp;&nbsp;
							<el-button type="text" icon="el-icon-circle-close " class="hidden-md-and-down" @click="unselectRow()" title="清除选中的行">清除选中</el-button>
							<el-button type="text" icon="el-icon-circle-close " class="hidden-lg-and-up" @click="unselectRow()" title="清除选中的行"></el-button>

							<el-input v-if=" !xmProduct || !xmProduct.id" v-model="filters.key" style="width:50%;margin-left: auto;"  placeholder="名称模糊查询"  clearable></el-input>  
						</div>
					</template>
					<template slot-scope="scope"> 
						<div  v-if="scope.row.dclass=='1'" class="icon hidden-md-and-down" style="background-color:  rgb(255, 153, 51);">
						<i class="el-icon-s-promotion"></i>
						</div>
						<div v-if="scope.row.dclass=='2'" class="icon hidden-md-and-down" style="background-color:  rgb(0, 153, 51);">
						<i class="el-icon-s-flag"></i>
						</div>
						<div v-if="scope.row.dclass=='3'" class="icon hidden-md-and-down" style="background-color:  rgb(79, 140, 255);">
						<i class="el-icon-document"></i>
						</div>
						<span class="hidden-md-and-down">{{scope.row.seqNo}}</span><span>{{scope.row.menuName}} </span>
						

							<div class="tool-bar left" v-if="!disabledMng">
						<span class="u-btn">
									<el-button size="mini"   v-if=" scope.row.dclass==='1' "  @click.stop="showSubAdd( scope.row,scope.$index)" icon="el-icon-plus" title="新建特性" circle > </el-button>
										
							<el-button  size="mini"    @click.stop="showEdit( scope.row,scope.$index)" icon="el-icon-edit" title="编辑" circle  > </el-button>     
						</span>
						</div>
						<el-tag style="float:right;" class="hidden-md-and-down" v-for="(item,index) in formatDictsWithClass(dicts,'menuStatus',scope.row.status)" :key="index" :type="item.className">{{item.name}}</el-tag>
						<span
							:style="{borderRadius: '30px',color:scope.row.finishRate >= 100 ? 'green' : 'blue',float:'right'}" 
						>
							{{ (scope.row.finishRate != null ? scope.row.finishRate : 0) + "%" }}
						</span>  
					</template> 
				</el-table-column> 
			</el-table>  
		</el-row>
		<el-row>
			<el-pagination  layout="total, sizes, prev,  next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<!--编辑 XmMenu xm_project_menu界面-->
		<el-dialog :title="'编辑'+(editForm&&editForm.dclass=='1'?'史诗':'特性')" :visible.sync="editFormVisible"  width="90%" top="20px"    append-to-body   :close-on-click-modal="false" >
			<xm-menu-edit :xm-menu="editForm" :sel-project="selProject" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" @add-sub-menu="onAddSubMenu" @edit-fields="onEditSomeFields"></xm-menu-edit>
		</el-dialog>

		<!--新增 XmMenu xm_project_menu界面-->
		<el-dialog :title="'新增'+(addForm.dclass=='1'?'史诗':'特性')" :visible.sync="addFormVisible"    width="80%" top="20px"    append-to-body   :close-on-click-modal="false">
			<xm-menu-add  :parent-menu="parentMenu"  :xm-menu="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-menu-add>
		</el-dialog>
		<el-drawer title="需求模板" :visible.sync="menuTemplateVisible"   size="80%"  append-to-body   :close-on-click-modal="false">
			<xm-menu-template-mng  :is-select-menu="true"  :visible="menuTemplateVisible" @cancel="menuTemplateVisible=false" @selected-menus="onSelectedMenuTemplates"></xm-menu-template-mng>
		</el-drawer>      
	<el-dialog append-to-body width="60%" top="20px" :visible.sync="parentMenuVisible">
		<xm-epic-features-select v-if="parentMenuVisible" :xm-product="xmProduct?xmProduct:filters.product" @select="onParentMenuSelected"></xm-epic-features-select>
	</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmMenu, delXmMenu, batchDelXmMenu,batchAddXmMenu,batchEditXmMenu,listXmMenuWithState,listXmMenuWithPlan,batchChangeParentMenu,editXmMenuSomeFields } from '@/api/xm/core/xmMenu';
	import { batchRelTasksWithMenu } from '@/api/xm/core/xmTask';
	import { loadTasksToXmMenuState} from '@/api/xm/core/xmMenuState';

	import {   batchDelXmIterationMenu,batchAddXmIterationMenu } from '@/api/xm/core/xmIterationMenu';

	import  XmMenuAdd from './XmMenuAdd';//新增界面
	import  XmMenuEdit from './XmMenuEdit';//修改界面
 	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//新增界面
	import  XmMenuTemplateMng from '../xmMenuTemplate/XmMenuTemplateMng';//新增界面
       	import  XmGroupDialog from '@/views/xm/core/xmGroup/XmGroupDialog';//修改界面
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
 
  	import TagDialog from "@/views/mdp/arc/tag/TagDialog";
  	import XmEpicFeaturesSelect from "@/views/xm/core/xmMenu/XmEpicFeaturesSelect";

	import {sn} from '@/common/js/sequence'

	import { mapGetters } from 'vuex'

	export default {
		props:['selProject','xmProduct','disabledMng'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),

      		xmMenusTreeData() {
				let xmMenus = JSON.parse(JSON.stringify(this.xmMenus || []));
				if(this.filters.key){
					xmMenus=xmMenus.filter(k=>k.menuName.indexOf(this.filters.key)>=0)
				}
				let xmMenusTreeData = treeTool.translateDataToTree(xmMenus,"pmenuId","menuId");
				 return xmMenusTreeData;
			},
		},
		watch:{
			xmProduct:function(){
					this.filters.product=this.xmProduct
					this.loadDatasFirstCache();
			}, 
    	},
		data() { 
			return {
				columnsConfig:[/**{label:'',property:'',isShow:true} */],
				filters: {
					key: '',
					product:null, 
					dclasss:['1','2'], 
					productId:'',//产品编号
				},
				xmMenus: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:500,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					menuStatus:[
					],
					dclass:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增xmMenu界面是否显示
				//新增xmMenu界面初始化数据
				addForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'0',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',ntype:'0',childrenCnt:0,sinceVersion:'',proposerId:'',proposerName:'',dlvl:'0',dtype:'0',priority:'0',source:'1'
				},
				addFormInit: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',ntype:'0',childrenCnt:0,sinceVersion:'',proposerId:'',proposerName:'',dlvl:'0',dtype:'0',priority:'0',source:'1'
				},
				editFormVisible: false,//编辑界面是否显示
				//编辑xmMenu界面初始化数据
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',ntype:'0',childrenCnt:0,sinceVersion:'',proposerId:'',proposerName:'',dlvl:'0',dtype:'0',priority:'0',source:'1'
				},
				parentMenu:null,
				menuTemplateVisible:false,       
				maxTableHeight:300,    
				parentMenuVisible:false,  
 				/**begin 自定义属性请在下面加 请加备注**/
				expandRowKeysCpd:[],
				moreVisible:false,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			...util,
			 
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
				 
				if(this.filters.product){
					params.productId=this.filters.product.id
				}
				  
				if(this.filters.dclasss){
					params.dclasss=this.filters.dclasss
				}
				return params;
			}, 
			//获取列表 XmMenu xm_project_menu
			getXmMenus() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				//this.xmMenus=[]
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}
				params=this.getParams(params); 
				if(!params.productId){
					return;
				}
				let callback= (res)=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmMenus = res.data.data;
						this.setDatasToCache(this.xmMenus)
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}
				this.load.list = true;
				listXmMenuWithState(params).then( callback ).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmMenu xm_project_menu
			showEdit: function ( row,index ) {
				this.$refs.table.setCurrentRow(row)
				if(this.editForm && row.menuId!=this.editForm.menuId){ 
					this.$refs.table.setCurrentRow(row); 
					this.$emit("row-click",row) 
				}
				this.editForm =row
				this.editFormVisible = true;
			},
			//显示新增界面 XmMenu xm_project_menu
			showAdd: function (dclass) { 
				Object.assign(this.addForm,this.addFormInit) 
				if(this.filters.product && this.filters.product.id){
					this.parentMenu=null;
					this.addForm.productId=this.filters.product.id
					this.addForm.productName=this.filters.product.productName
					this.addForm.dclass=dclass
					this.addFormVisible = true;
				}else if(this.filters.iteration && this.filters.iteration.id){
					this.parentMenu=null;
					this.addForm.productId=this.filters.iteration.productId
					this.addForm.iterationId=this.filters.iteration.id
					this.addForm.iterationName=this.filters.iteration.iterationName
					this.addForm.dclass=dclass
					this.addFormVisible = true;
				}else{
					this.$refs.xmProductSelect1.productVisible=true;
					this.$refs.xmProductSelect1.searchXmProducts();
					this.$notify({position:'bottom-left',showClose:true,message: "请先选择一个产品", type: 'warning'});
				}
				this.addForm.dclass=dclass

				//this.addForm=Object.assign({}, this.editForm);
			},
			showSubAdd:function(row){
				this.$refs.table.setCurrentRow(row)
				if(this.editForm && row.menuId!=this.editForm.menuId){ 
					this.$refs.table.setCurrentRow(row); 
					this.$emit("row-click",row) 
				}
				this.addForm={...this.addFormInit}
				this.editForm=row
				this.parentMenu=row
				this.expandRowKeysCpd.push(row.pmenuId);
				this.addForm.productId=row.productId 

				if(this.filters.product && row.productId==this.filters.product.id){
					this.addForm.productName=this.filters.product.productName
				}else{
					this.addForm.productName=null;
				}
				if(this.filters.iteration && this.filters.iteration.id){
					this.addForm.productId=this.filters.iteration.productId
					this.addForm.iterationId=this.filters.iteration.id
					this.addForm.iterationName=this.filters.iteration.iterationName
					this.addFormVisible = true;
				}
				this.addForm.dclass=(parseInt(row.dclass)+1)+"";
				this.addFormVisible=true
			},  
			afterEditSubmit(row){ 
				this.editFormVisible=false;
				var data=this.xmMenus.find(k=>k.menuId==row.menuId)
				if(data){
					Object.assign(data,row)
					this.setDatasToCache(this.xmMenus)
				}
				//this.getXmMenus(); 
			},
			afterAddSubmit(row){
				this.xmMenus.push(row)
				this.setDatasToCache(this.xmMenus)
			},
			//选择行xmMenu
			selsChange: function (sels) {
				this.sels = sels;
			},
			onProductSelected:function(product){
				this.filters.product=product 
				this.xmMenus=[]
				this.getXmMenus()
				this.$emit('product-selected',product)
			},
			onProductClearSelect:function(){
				this.filters.product=null 
				this.xmMenus=[]
				this.pageInfo.total=0;
				//this.getXmMenus() 
				this.$emit('product-clear')
			},  
			//批量删除xmMenu
			batchDel: function () {
				if(this.sels.length==0){
					this.$notify({position:'bottom-left',showClose:true,message: "请先选择要删除的需求", type: 'warning'});
					return;
				}
				this.$confirm('确认删除选中的'+this.sels.length+'条数据吗？删除后数据不可恢复', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmMenu(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmMenus(); 
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			unselectRow(){
				this.$refs.table.clearSelection()
				this.editForm=null;
				this.$emit('row-click',null)
				this.$refs.table.setCurrentRow(); 
			},
			rowClick: function(row, event, column){
				if(this.editForm && row.menuId===this.editForm.menuId){ 
					return;
				}  
				this.editForm=row
				this.editFormBak=Object.assign({},row) 
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
      },
      handleExport() {
        this.downloadLoading = true
        const pageNum = this.pageInfo.pageNum;
        const header = ['需求名称', '负责人', '总体进度', '描述'];
        const keyList = ['menuName', 'mmUsername', 'finishRate', 'remark'];
        const filename = `需求管理_${this.filters.product.productName}_第${pageNum}页`;
				const data = this.formatJson(keyList, this.xmMenusTreeData);
				import('@/vendor/Export2Excel').then(excel => {
					excel.export_json_to_excel({
						header,
						data,
						filename,
						// autoWidth: this.autoWidth,
						bookType: 'xlsx'
					})
					this.downloadLoading = false
				})
			},
			formatJson(filterVal, jsonData, dataList = []) {
        jsonData.forEach(v => {
          const row = filterVal.map(j => {
            let key = '';
            if (j === 'menuName') {
              return `${v.seqNo}  ${v[j]}`;
            } else if(j == 'finishRate') {
              return `${ (v[j] !== null ? v[j] : 0 )+'%' }`;
            } else {
              return v[j];
            }
          })
        dataList.push(row);
          if (v.children && v.children.length) {
            dataList = this.formatJson(filterVal, v.children, dataList);
          }
        })
        return dataList;
      },

			showImportFromMenuTemplate(row){
				if(!this.filters.product){
					this.$notify.error("请选择产品模板")
					return;
				}
				this.parentMenu=row
				this.menuTemplateVisible=true;
			},
			onSelectedMenuTemplates:function(menuTemplates){

				if(menuTemplates==null || menuTemplates.length==0){
					this.menuTemplateVisible=false;
					return;
				}
				var menuTemplates2=JSON.parse(JSON.stringify(menuTemplates))
				this.load.add=true
				let parents = menuTemplates2.filter(value =>{
					//如果我的上级为空，则我是最上级
					if(value.pmenuId == 'undefined' || value.pmenuId == null  || value.pmenuId == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(menuTemplates2.some(i=>value.pmenuId==i.menuId)){
						return false;
					}else {
						return true
					}

				})
				if(this.parentMenu!=null &&  this.parentMenu!=undefined){
					parents.forEach(i=>i.pmenuId=this.parentMenu.menuId);
				}else{
					parents.forEach(i=>i.pmenuId=null);
				}
				let children = menuTemplates2.filter(value =>{
					if(menuTemplates2.some(i=>value.pmenuId==i.menuId)){
						return true;
					}else{
						return false;
					}
				})
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						var newId=sn();
						var myChildren=[];
						if(children!=null && children.length>0){
							myChildren=children.filter(current=>current.pmenuId===parent.menuId);
						}
						myChildren.forEach((current, index) => {
							 current.pmenuId=newId;
							 var mySubChildren=children.filter(c=>c.pmenuId===current.menuId);
							 translator([current],mySubChildren)
						})
						parent.menuId=newId;
					})
				}

				translator(parents, children)
				menuTemplates2.forEach(i=>{
					i.productId=this.filters.product.id
					i.productName=this.filters.product.productName
				});
				batchAddXmMenu(menuTemplates2).then(res=>{
					this.menuTemplateVisible=false;
					this.load.add=false
					var tips =res.data.tips
					if(tips.isOk){
						this.getXmMenus() 
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
				}).catch( err  => this.load.add=false );
			}, 
 
			loadTasksToXmMenuState: function () {
				
				if(!this.filters.product ){
					if(!this.filters.iteration){
						this.$notify.warning("请先选择产品或者迭代");
						return;
					} 
				}
				this.load.edit=true;
				let params = { productId: ''};
				if(!this.filters.product){
					params.productId=this.filters.iteration.productId
				}else{
					params = { productId: this.filters.product.id };
				}
				
				loadTasksToXmMenuState(params).then((res) => {
					this.load.edit=false;
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.count=true;
						this.xmMenus=[];
						this.getXmMenus();
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err  => this.load.edit=false );
			},       
			showParentMenu(){
				if(this.filters.product && this.filters.product.id){
					if(this.sels.length==0){
						this.$notify({position:'bottom-left',showClose:true,message:'请先选择一个或者多个需求',type:'warning'})
						return;
					}
					if(this.sels.some(k=>k.dclass=='1')){
						this.$notify({position:'bottom-left',showClose:true,message:"只能调整特性的上级，请选择特性",type:'warning'})
						return;
					}
					this.parentMenuVisible=true;
				}else{
					this.$notify({position:'bottom-left',showClose:true,message:'请先选择产品',type:'warning'})
					return;
				}

			},
			onParentMenuSelected(menu){
				

				if(!menu||!menu.menuId){
					this.$notify({position:'bottom-left',showClose:true,message:'请先选择一个上级需求',type:'warning'})
					return;
				}
				if(menu.dclass!='1'){
					this.$notify({position:'bottom-left',showClose:true,message:menu.menuName+'是特性，不能作为上级，请选择史诗作为上级',type:'warning'})
					return;
				}
				
				this.parentMenuVisible=false;
				var params={
					menuIds:this.sels.map(i=>i.menuId),
					pmenuId:menu.menuId
				}
				batchChangeParentMenu(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						this.searchXmMenus();
						var rows=[...this.sels,{menuId:'',pmenuId:menu.menuId}] 
					}
					this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
				})
			},   
			calcMenuLabel(dclass){
				var params={label:'工作项',icon:'',color:''};
				if(dclass==='1'){
					params={label:'史诗',icon:'el-icon-s-promotion',color:'rgb(255, 153, 51)'};
				}else if(dclass==='2'){
					params={label:'特性',icon:'el-icon-s-flag',color:'rgb(0, 153, 51)'};
				}else if(dclass==='3'){
					params={label:'用户故事',icon:'el-icon-document',color:' rgb(79, 140, 255)'};
				}
				return params;
			}, 
			 
			cellStyleCalc({row, column, rowIndex, columnIndex}){
				if(this.$refs.tableConfig && this.$refs.tableConfig.columnsConfig.length>0){
					if(this.$refs.tableConfig.columnsConfig.some(i=>i.property==column.property&&i.isShow==false)){
						return "display:none;"
					}else{
						return "";
					}
				}else{
					return "";
				}
			}, 
			onEditSomeFields(params){
				Object.assign(this.editForm,params)
				var data=this.xmMenus.find(k=>k.menuId==this.editForm.menuId)
				if(data){ 
					var dataRaw=JSON.parse(JSON.stringify(params))
					dataRaw.children=null; 
					Object.assign(data,dataRaw) 
					this.setDatasToCache(this.xmMenus)
				}
			},
			onAddSubMenu(row){
 			},
			loadDatasFirstCache(){
				 
				if(!this.filters.product || !this.filters.product.id){
					return;
				}
				var key="xm_epic_features_cache_"+this.filters.product.id
				var dataStr=sessionStorage.getItem(key)
				if(dataStr && dataStr!='null' && dataStr!='undefined'){
					this.xmMenus=JSON.parse(dataStr)
					this.pageInfo.total=this.xmMenus.length;
				}else{
					this.getXmMenus();
				}
				
			},
			setDatasToCache(datas){
				
				if(!this.filters.product || !this.filters.product.id){
					return;
				}
				var key="xm_epic_features_cache_"+this.filters.product.id
				if(!datas || datas.length==0){
					sessionStorage.removeItem(key)
				}else{
					sessionStorage.setItem(key,JSON.stringify(datas))
				}
				
			},
			copyOne(row,index){
				
				var params={...row}
				params.id=null;
				params.createUserid=this.userInfo.userid
				params.createUsername=this.userInfo.username 
				params.bugStatus="1"
				params.name=row.name+'V'
				addXmQuestion(params).then(res=>{
					var tips = res.data.tips
					if(tips.isOk){ 
						var row2=res.data.data
						this.xmQuestions.splice(index+1,0,row2)
						this.pageInfo.total=this.pageInfo.total+1
						this.$message.success("复制成功")
					}else{
						this.$message.error(tips.msg)
					}
				})
			}
		},//end methods
		components: {
		    'xm-menu-add':XmMenuAdd,
			'xm-menu-edit':XmMenuEdit,
			XmProductSelect,
			XmMenuTemplateMng,   
			UsersSelect, 
		    TagDialog,   
			XmGroupDialog, XmEpicFeaturesSelect,
		    //在下面添加其它组件
		},
		mounted() {
  			initSimpleDicts("all",['menuStatus','demandSource','demandLvl','demandType','priority','dclass']).then(res=>{
				  Object.assign(this.dicts,res.data.data) 
			})
			this.filters.product=this.xmProduct  
			this.$nextTick(() => {
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);
				this.loadDatasFirstCache();
          });
		}, 
	}

</script>

<style lang="scss" scoped>
 
.align-right{
	float: right;
}
.tool-bar.left{  
  
  transform: translate(-100%, -50%);
}
</style>

<style lang="scss">

</style>
