<template>
	<section class="page-container border padding">
		<el-row class="page-main">   
				<el-row>   
					<el-popover
						placement="bottom"
						width="500"
						trigger="click"> 
						<xm-product-tpl-mng :auto-select="true" :isSelect="true"  showType="simple"  @row-click="onProductRowClick" @clear="onProductClearSelect"></xm-product-tpl-mng>
							<el-link type="warning" slot="reference" icon="el-icon-search"><font style="font-size:14px;">{{filters.product?filters.product.productName:'选择产品模板'}}</font></el-link> 
					</el-popover>
					<el-input v-model="filters.key" style="width: 20%;" placeholder="需求名字模糊查询"></el-input> 
					<el-button    v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmMenuTemplates">查询</el-button>
					<el-button type="primary" v-if="isSelectMenu" v-loading="load.del" @click="selectedMenusConfirm" :disabled="this.sels.length===0 || load.del==true">确认选择</el-button> 
				</el-row>
				<el-table lazy :load="loadMenusLazy" ref="table" :height="maxTableHeight" :data="xmMenuTemplatesTreeData"   row-key="menuId" :tree-props="{children: 'children', hasChildren: 'childrenCnt'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column sortable type="selection" width="40"></el-table-column> 
 					<el-table-column prop="menuName" label="需求名称" min-width="120" > 
						<template slot-scope="scope">
 							<el-link type="primary"  @click="showEdit(scope.row)" :icon="scope.row.ntype=='1'?'el-icon-folder-opened':''">{{scope.row.seqNo}}&nbsp;&nbsp;</el-link> 
									 {{scope.row.menuName}}
						</template>
					</el-table-column> 					
					<el-table-column prop="remark" label="说明" min-width="150" >
						
						<template slot-scope="scope">
							<el-input type="textarea" v-if="batchEditVisible"  v-model="scope.row.remark" @change="fieldChange(scope.row,'remark')"></el-input>
							<div v-else v-html="scope.row.remark"> </div>
						</template>
					</el-table-column> 
					<el-table-column label="操作" width="300" fixed="right"  v-if="isSelectMenu!=true">
						<template slot-scope="scope">
							<el-button    @click="showSubAdd( scope.row,scope.$index)">+子需求</el-button>
							<el-button   @click="showEdit( scope.row,scope.$index)">改</el-button>
							<el-button   type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
 
						</template>
					</el-table-column>
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
				   
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmMenu, delXmMenuTemplate, batchDelXmMenuTemplate,batchEditXmMenuTemplate } from '@/api/xm/core/xmMenu'; 
	import  XmProductTplMng from '../xmProduct/XmProductTplMng';//新增界面

	import { mapGetters } from 'vuex'
	
	export default { 
		props:['isSelectMenu'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
			
      		xmMenuTemplatesTreeData() { 
				  var d=JSON.parse(JSON.stringify(this.xmMenuTemplates))
        		const data = treeTool.translateDataToTree(d,"pmenuId","menuId");
				return data
			}
         
		},
		watch:{ 
		},
		data() {
			return {
				filters: {
					key: '',
					product:null,
				},
				xmMenuTemplates: [],//查询结果
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
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmMenuTemplate界面是否显示
				//新增xmMenuTemplate界面初始化数据
				addForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmMenuTemplate界面初始化数据
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:''
				},
				parentMenu:null,
				
				batchEditVisible:false,
				valueChangeRows:[],
				maxTableHeight:300,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmMenuTemplates();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmMenuTemplates();
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
				this.getXmMenuTemplates();
			},
			searchXmMenuTemplates(){
				 this.pageInfo.count=true; 
				 this.getXmMenuTemplates();
			},
			//获取列表 XmMenuTemplate xm_project_menu
			getXmMenuTemplates() {
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
					this.$notify({position:'bottom-left',showClose:true,message: "请先选择产品", type: 'warning' });
					return;
					//params.xxx=xxxxx
				} 
				
				params.itTop="1"	
				this.load.list = true;
				listXmMenu(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmMenuTemplates = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmMenuTemplate xm_project_menu
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmMenuTemplate xm_project_menu
			showAdd: function () {
				if(this.filters.product==null){
					this.$notify({position:'bottom-left',showClose:true,message: "请先在左边选择产品", type: 'warning' });
					return;
				}
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			showSubAdd:function(row){
				this.editForm=row
				this.parentMenu=row
				this.addFormVisible=true
			},
			showProdcutAdd:function(){
				this.$refs.xmProductTemplateMng.showAdd();
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.parentMenu=null;
				this.getXmMenuTemplates();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmMenuTemplate
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			onProductRowClick:function(product){
				this.filters.product=product
				this.getXmMenuTemplates()
			},
			//删除xmMenuTemplate
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { menuId: row.menuId };
					delXmMenuTemplate(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmMenuTemplates();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmMenuTemplate
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmMenuTemplate(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmMenuTemplates(); 
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			selectedMenusConfirm(){
				this.$emit("selected-menus",this.sels);
			},
			getParams(params){
				return params;
			},
			loadMenusLazy(row, treeNode, resolve) {   
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
				
			},
			
		},//end methods
		components: {  
			XmProductTplMng,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
					this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el); 
					this.getXmMenuTemplates();
			});  
		}
	}

</script>

<style lang="scss" scoped>
 .el-table{ 
	 box-sizing: border-box; 
	/deep/ .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-right: 10px;
	display: flex;
	 }
}
</style>