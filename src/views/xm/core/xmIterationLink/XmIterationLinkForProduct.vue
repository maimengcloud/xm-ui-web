<template>
	<section class="app-container"> 
		<el-row>
			<el-button type="primary" v-if="xmIteration" @click="productVisible=true" icon="el-icon-plus" > 选择更多产品加入迭代 </el-button>
			<el-button type="primary" v-if="xmProduct" @click="iterationVisible=true" icon="el-icon-plus" > 选择更多迭代加入产品 </el-button>
			<el-button type="primary"  icon="el-icon-plus" @click="showAdd"> 新增迭代 </el-button>
		</el-row>
		<el-row style="padding-top:10px;">
			<!--列表 XmIterationLink 迭代表与产品表的关联关系，一般由迭代管理员将迭代挂接到产品表-->
			<el-table ref="xmIterationLink" :data="xmIterationLinks" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
  				<el-table-column prop="seqNo" v-if="!xmIteration" label="迭代序号" width="100" ></el-table-column>
				<el-table-column prop="iterationName" v-if="!xmIteration" label="迭代名称" min-width="150" ></el-table-column>
				<el-table-column prop="productName" v-if="!xmProduct" label="产品名称" min-width="150" ></el-table-column>
				<el-table-column prop="ctime" label="加入时间" min-width="80" ></el-table-column>
 				<el-table-column prop="cusername" label="操作者" min-width="80" ></el-table-column> 
				<el-table-column label="操作" width="120" fixed="right"> 
					<template scope="scope">
 						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete" v-loading="load.del">移出</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		 

						 
			<el-drawer title="选择产品" :visible.sync="productVisible"  size="50%"  append-to-body  :close-on-click-modal="false">
				 <xm-product-select @row-click="onProductSelect"></xm-product-select>
			</el-drawer> 
			
			<el-drawer title="选择迭代" :visible.sync="iterationVisible"  size="50%"  append-to-body  :close-on-click-modal="false">
				<xm-iteration-select @row-click="onIterationSelect"></xm-iteration-select>
			</el-drawer> 
			
			<!--新增 XmIteration 迭代定义界面-->
			<el-drawer title="新增迭代" :visible.sync="addFormVisible"  size="50%"  append-to-body  :close-on-click-modal="false">
				<xm-iteration-add :xm-iteration="addForm" :xm-product="xmProduct" :sel-project="selProject" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-iteration-add>
			</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmIterationLinkWithProductInfo,addXmIterationLink, delXmIterationLink, batchDelXmIterationLink } from '@/api/xm/core/xmIterationLink';
 
	import { mapGetters } from 'vuex'
	import XmProductSelect from '../xmProduct/XmProductSelect.vue';
	import XmIterationSelect from '../xmIteration/XmIterationSelect.vue';
	
	import  XmIterationAdd from '../xmIteration/XmIterationAdd';//新增界面
	
	export default { 
		props:['xmIteration','xmProduct','selProject'],
		watch:{
			xmIteration(){
				this.getXmIterationLinks();
			},
			xmProduct(){
				this.getXmIterationLinks();
			}
		},
		computed: {
		    ...mapGetters([
		      'userInfo','workSpace'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmIterationLinks: [],//查询结果
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
				dicts:{
					//sex:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmIterationLink界面是否显示
				//新增xmIterationLink界面初始化数据
				addForm: {
					iterationId:'',proId:'',ctime:'',cuserid:'',cusername:'',linkStatus:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmIterationLink界面初始化数据
				editForm: {
					iterationId:'',proId:'',ctime:'',cuserid:'',cusername:'',linkStatus:''
				},
				maxTableHeight:300,
				productVisible:false,
				iterationVisible:false,	
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmIterationLinks();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmIterationLinks();
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
				this.getXmIterationLinks();
			},
			searchXmIterationLinks(){
				 this.pageInfo.count=true; 
				 this.getXmIterationLinks();
			},
			//获取列表 XmIterationLink 迭代表与产品表的关联关系，一般由迭代管理员将迭代挂接到产品表
			getXmIterationLinks() {
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
				if(this.filters.key){
					params.key="%"+this.filters.key+"%"
				}

				if(this.xmIteration){
					params.iterationId=this.xmIteration.id
				}
				
				if(this.xmProduct){
					params.proId=this.xmProduct.id
				}
				this.load.list = true;
				listXmIterationLinkWithProductInfo(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmIterationLinks = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmIterationLink 迭代表与产品表的关联关系，一般由迭代管理员将迭代挂接到产品表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmIterationLink 迭代表与产品表的关联关系，一般由迭代管理员将迭代挂接到产品表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmIterationLinks();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmIterationLink
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmIterationLink
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = row;
					delXmIterationLink(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmIterationLinks();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmIterationLink
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmIterationLink(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmIterationLinks(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			onProductSelect(product){
				this.$confirm('确认建立与产品【'+product.productName+'】的关联关系吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.add=true;
					this.addForm.iterationId=this.xmIteration.id;
					this.addForm.proId= product.id; 
					this.addForm.ltype="1"
					addXmIterationLink(this.addForm).then((res) => {
						this.load.add=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmIterationLinks(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			onIterationSelect(iteration){
				this.$confirm('确认建立与迭代【'+iteration.iterationName+'】的关联关系吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.add=true;
					this.addForm.iterationId=iteration.id;
					this.addForm.proId=this.xmProduct.id;
					this.addForm.ltype="1"
					addXmIterationLink(this.addForm).then((res) => {
						this.load.add=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmIterationLinks(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			}	
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  
			XmProductSelect,
			XmIterationSelect,
			XmIterationAdd,
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmIterationLinks(); 
                this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.xmIterationLink.$el)
        	}); 
        	/** 举例，
    		initSimpleDicts( "all",["sex","grade"] ).then(res=>{
				if(res.data.tips.isOk){ 
 					this.dicts=res.data.data
				}
			});
			**/
		}
	}

</script>

<style scoped>
</style>