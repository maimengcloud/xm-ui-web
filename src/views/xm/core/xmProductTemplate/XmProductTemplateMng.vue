<template>
	<section>
		<el-row v-if="simple!=true" class="page-main">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProductTemplates">查询</el-button>
			<el-button type="primary" @click="showAdd">+产品</el-button>
			<el-button v-if="isSelectProduct!=true" type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row  v-show="simple!=true" class="page-main"> 
			<!--列表 XmProductTemplate 产品表-->
			<el-table   :data="xmProductTemplates" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column   sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column  prop="id" label="产品编号" min-width="80" ></el-table-column>
				<el-table-column prop="productName" label="产品名称" min-width="80" ></el-table-column>
				<el-table-column  prop="branchId" label="机构号" min-width="80" ></el-table-column>
				<el-table-column  prop="remark" label="备注" min-width="80" ></el-table-column>
				<el-table-column  label="操作" width="260" fixed="right"  >
					<template slot-scope="scope">
						<el-button v-if="isSelectProduct!=true" @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button v-if="isSelectProduct==true"  @click="selectedProduct( scope.row,scope.$index)">选择</el-button>
						<el-button v-if="isSelectProduct!=true" type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
						<el-button v-if="isSelectProduct!=true" type="success" @click="toProjectList(scope.row)">项目</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>  
		</el-row>
		
		<el-row  v-show="simple==true" > 
			<!--列表 XmProductTemplate 产品表-->
			<el-table   :data="xmProductTemplates" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column  prop="id" label="产品编号" min-width="80" ></el-table-column>
				<el-table-column prop="productName" label="产品名称" min-width="80" ></el-table-column> 
				
				<el-table-column v-if="isSelectProduct==true"  label="操作" width="160" fixed="right"  >
					<template slot-scope="scope"> 
						<el-button  @click="selectedProduct( scope.row,scope.$index)">选择</el-button> 
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>  
		</el-row>
					<!--编辑 XmProductTemplate 产品表界面-->
			<el-drawer title="编辑产品" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-product-template-edit :xm-product-template="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-product-template-edit>
			</el-drawer>
	
			<!--新增 XmProductTemplate 产品表界面-->
			<el-drawer title="新增产品" :visible.sync="addFormVisible"  size="50%"  append-to-body  :close-on-click-modal="false">
				<xm-product-template-add :xm-product-template="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-product-template-add>
			</el-drawer> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProductTemplate, delXmProductTemplate, batchDelXmProductTemplate } from '@/api/xm/core/xmProductTemplate';
	import  XmProductTemplateAdd from './XmProductTemplateAdd';//新增界面
	import  XmProductTemplateEdit from './XmProductTemplateEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		props:['simple','isSelectProduct'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmProductTemplates: [],//查询结果
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
				
				addFormVisible: false,//新增xmProductTemplate界面是否显示
				//新增xmProductTemplate界面初始化数据
				addForm: {
					id:'',productName:'',branchId:'',remark:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProductTemplate界面初始化数据
				editForm: {
					id:'',productName:'',branchId:'',remark:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProductTemplates();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProductTemplates();
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
				this.getXmProductTemplates();
			},
			searchXmProductTemplates(){
				 this.pageInfo.count=true; 
				 this.getXmProductTemplates();
			},
			//获取列表 XmProductTemplate 产品表
			getXmProductTemplates() {
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
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				params.branchId=this.userInfo.branchId
				this.load.list = true;
				listXmProductTemplate(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProductTemplates = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProductTemplate 产品表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProductTemplate 产品表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProductTemplates();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProductTemplate
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProductTemplate
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmProductTemplate(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProductTemplates();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProductTemplate
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProductTemplate(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProductTemplates(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
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
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-product-template-add':XmProductTemplateAdd,
		    'xm-product-template-edit':XmProductTemplateEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmProductTemplates();
        	}); 
		}
	}

</script>

<style scoped>

</style>