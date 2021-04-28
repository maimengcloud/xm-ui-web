<template>
	<section>
		
		
		<el-row class="top">  
			<el-col  :span="6"  >
				<xm-product-mng @row-click="onProductSelected" ref="xmProductMng" :simple="true"></xm-product-mng>
			</el-col>
			<el-col :span="18"  style="padding-left:12px;" >
				<el-row  >  
					<el-input v-model="filters.key" style="width: 30%;" placeholder="模糊查询">
						<template slot="append">
							<el-button   type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmMenus" icon="el-icon-search"></el-button>
						</template>
					</el-input>  
					<el-button   type="primary" v-if="multi"  v-on:click="multiSelectedConfirm">确认选择</el-button>
				</el-row>
				<el-row style="padding-top:12px;">
					<el-table :max-height="tableHeight" :data="xmMenusTreeData" default-expand-all  row-key="menuId" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
						<el-table-column v-if="multi" type="selection" width="50"></el-table-column>  
						<el-table-column prop="menuName" label="故事名称" min-width="140" > 
							<template slot-scope="scope">
								{{scope.row.seqNo}}&nbsp;&nbsp;<el-link @click="toMenu(scope.row)">{{scope.row.menuName}}</el-link> 
							</template>
						</el-table-column> 
						<el-table-column prop="mmUsername" label="负责人" min-width="100" > </el-table-column>
						<el-table-column prop="remark" label="描述" min-width="140" > 
							<template slot-scope="scope">
								<el-popover
									v-if="scope.row.remark && scope.row.remark.length>20"
									placement="top-start"
									title="故事备注"
									width="400"
									trigger="click"
									:content="scope.row.remark">
									<div slot="reference">{{scope.row.remark?scope.row.remark.substr(0,18)+"...":""}}</div>
								</el-popover> 
								<div v-else v-html="scope.row.remark"></div>
							</template>
						</el-table-column> 
						<el-table-column label="操作"  v-if="!multi" width="200" fixed="right"  >
							<template slot-scope="scope"> 
								<el-button    type="primary" @click="selectedMenu( scope.row,scope.$index)">选择</el-button> 
							</template>
						</el-table-column>
					</el-table>
					<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
					
				</el-row>
			</el-col>  
			
			<el-dialog title="故事谈论" :visible.sync=" menuDetailVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-menu-rich-detail :visible="menuDetailVisible"  :reload="false" :xm-menu="editForm" ></xm-menu-rich-detail>
			</el-dialog> 
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

	import {sn} from '@/common/js/sequence'

	import { mapGetters } from 'vuex'
	
	export default { 
		props:['isSelectMenu','excludeIterationId','multi','visible'],
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
			}
		},
		data() {
			return {
				filters: {
					key: '',
					product:null,
				},
				xmMenus: [],//查询结果
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
				/**begin 自定义属性请在下面加 请加备注**/
				tableHeight:500,
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
					this.$message({ message: "请先选择产品", type: 'success' });
					return;
					//params.xxx=xxxxx
				} 
				
				if(this.excludeIterationId){
					params.excludeIterationId=this.excludeIterationId
				}
				this.load.list = true;
				listXmMenu(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmMenus = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
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
			},
			multiSelectedConfirm(){
				this.$emit("menus-selected",this.sels)
			},
			toMenu:function(row){
				this.editForm=row
				this.menuDetailVisible=true;
			},
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
 			XmProductMng,XmMenuRichDetail
 		    
		    //在下面添加其它组件
		},
		mounted() {  
			this.$nextTick(() => {
				this.getXmMenus(); 
            	this.tableHeight = window.innerHeight - 250; 
        	}); 
		}
	}

</script>

<style scoped>
.top{
	margin-top:-30px;
}
</style>