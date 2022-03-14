<template>
	<section class="page-container padding-left padding-top">  
		<el-row v-if="showType!='simple'">
			<el-checkbox v-model="filters.isMy" false-label="" true-label="1">我的模板</el-checkbox>
			<el-input style="width:300px;" v-model="filters.key" placeholder="模板名字"></el-input>
			<el-button @click="searchXmProducts" icon="el-icon-search"></el-button>
		</el-row>
		<el-row v-if="showType=='simple'"> 
			<el-col :span="24">
				<el-checkbox v-model="filters.isMy" false-label="0" true-label="1">我的模板</el-checkbox> 
			</el-col>
			<el-col :span="18">
				<el-input  v-model="filters.key" placeholder="模板名字"></el-input>
			</el-col>
			<el-col :span="6">
			 &nbsp;&nbsp;<el-button @click="searchXmProducts" icon="el-icon-search"></el-button>
			</el-col>
 
		</el-row>
		<el-row  class="page-main" v-if="showType!='simple'">
			<!--列表 XmProduct 产品表-->
			<el-table ref="table"  :height="maxTableHeight" :data="xmProducts" @sort-change="sortChange" highlight-current-row v-loading="load.list"  @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
  				
				<el-table-column    label="序号" width="60" type="index"  v-if="showType!='simple'">  
				</el-table-column> 
				  <el-table-column prop="productName" label="产品模板(参考学习用)" min-width="150" sortable show-overflow-tooltip> 
					<template slot-scope="scope">
						<el-link  @click="intoInfo(scope.row)">{{scope.row.productName}}</el-link>
					</template>
				</el-table-column> 
				<el-table-column prop="code" label="产品代号" min-width="100" sortable> 
				</el-table-column>
				<el-table-column prop="pstatus" label="状态" width="100" sortable :formatter="formatPstatus"> 
				</el-table-column>
				<el-table-column prop="finishRate" label="进度" width="100" sortable>
					<template slot-scope="scope"> 
						<font  ><el-tag :type="scope.row.finishRate>=100?'success':'warning'">{{scope.row.finishRate}}%</el-tag> 
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
				<el-table-column  label="" width="100" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" title="通过复制创建新的项目" @click="onCopyToBtnClick(scope.row)" :disabled="load.add" v-loading="load.add">复制</el-button>
						<el-button type="text" title="删除该模板" @click="handleDel(scope.row)" :disabled="load.del" v-loading="load.del">删除</el-button>
					</template>
				</el-table-column> 
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row> 
		 	
		<el-row  class="page-main" v-else>
			<!--列表 XmProduct 产品表-->
			<el-table ref="table"  :height="maxTableHeight" :data="xmProducts" @sort-change="sortChange" highlight-current-row v-loading="load.list"  @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
  				
				<el-table-column    label="序号" width="60" type="index">  
				</el-table-column> 
				  <el-table-column prop="productName" label="产品模板(参考学习用)" sortable show-overflow-tooltip> 
					<template slot-scope="scope">
						
						<div v-if="isSelect===true">{{scope.row.productName}}</div>
						<el-link v-else  @click="intoInfo(scope.row)">{{scope.row.productName}}</el-link>
					</template>
				</el-table-column>  
				<el-table-column v-if="isSelect!==true"  label="操作" width="80" fixed="right">
					<template slot-scope="scope">
						<el-button type="text" title="通过复制创建新的项目" @click="onCopyToBtnClick(scope.row)" :disabled="load.add" v-loading="load.add">复制</el-button> 
					</template>
				</el-table-column> 
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>  
			<el-drawer title="编辑产品" :visible.sync="editFormVisible"  size="50%" :with-header="false"  append-to-body   :close-on-click-modal="false">
				  <xm-product-edit :xm-product="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-product-edit>
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
							</template>
				</el-input>
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
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmProduct,listXmProductWithState, delXmProduct, batchDelXmProduct,copyTo,createProductCode } from '@/api/xm/core/xmProduct';
	import { addXmIterationLink,delXmIterationLink } from '@/api/xm/core/xmIterationLink';
	import { loadTasksToXmProductState } from '@/api/xm/core/xmProductState';
 	import  XmProductEdit from './XmProductEdit';//修改界面
	import { mapGetters } from 'vuex'
 
 
	export default {
		props:['selProject','xmIteration','showType','isSelect'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		watch:{ 
		},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
			return {
				filters: {
					key: '',
					queryScope:'',//compete/branchId/''/productId
					id:'',//产品编号
					pmUser:null,//产品经理
					isMy:'',

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
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

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
				dateRanger: [ 
				],
				pickerOptions:  util.pickerOptions('datarange'),
				projectVisible:false,
				productSelectVisible:false,
				xmProductCopy:{ 
					id:'',productName:'',code:'',isTpl:'',copyMenu:'1',copyPhase:'1',copyGroup:'1',copyGroupUser:'0'
				},
				copyToVisible:false,
				maxTableHeight:300,
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
				 if(this.filters.key){
					 params.key='%'+this.filters.key+'%'
				 }
				 if(this.filters.isMy=='1'){
					 params.assistantUserid=this.userInfo.userid
				 }
				params.isTpl="1"
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
					addXmIterationLink({iterationId:xmIteration.id,productId:xmProduct.id}).then(res=>{
						var tips =res.data.tips;
						if(tips.isOk){
							this.getXmProducts();
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					})
				})
			},
			doDelXmIterationLink(row){
				var xmIteration=this.xmIteration;
				var xmProduct=row;
				this.$confirm('确认将产品【'+xmProduct.productName+'】与迭代【'+xmIteration.iterationName+'】进行脱钩吗？脱钩后，产品下的所有需求将从本迭代计划一并移出。', '提示', {
					type: 'warning'
				}).then(()=>{
					delXmIterationLink({iterationId:xmIteration.id,productId:xmProduct.id}).then(res=>{
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
						if(this.xmProductCopy.isTpl=='1'){
							this.searchXmProducts()
						}  
						this.$emit("copy",res.data.data)
					}
					
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });

				})
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
		    'xm-product-edit':XmProductEdit, 
		    //在下面添加其它组件
		},
		mounted() {
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
