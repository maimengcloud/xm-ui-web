<template>
	<section class="page-container border padding">
		<el-row>
			<el-select :disabled="categoryId" v-model="filters.categoryId" placeholder="请选择分类" clearable>
				<el-option
				v-for="item in categorys"
				:key="item.id"
				:label="item.categoryName"
				:value="item.id">
				</el-option>
			</el-select>
			<el-select v-model="filters.targetId" placeholder="请选择发布平台" clearable>
				<el-option
				v-for="(item ,index) in dicts['meta_push_target']"
				:key="index"
				:label="item.name"
				:value="item.id">
				</el-option>
			</el-select>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			 <el-button v-loading="load.list" :disabled="load.list==true" @click="searchItems" icon="el-icon-search">查询</el-button>
			<el-button type="primary" @click="showAdd" icon="el-icon-plus" circle> </el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" circle></el-button><font color="blue">系统缓存，5-10分钟后起效</font>
		</el-row>
		<el-row class="padding-top">
			<!--列表 Item 数据项定义-->
			<el-table ref="item" :data="items" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="itemName" label="字典名称" min-width="100" >
				</el-table-column><el-table-column prop="itemCode" label="字典代码" min-width="100" ></el-table-column>
				<el-table-column prop="categoryName" label="分类" min-width="80" ></el-table-column>
				<el-table-column prop="itemType" label="输入类型" min-width="80" >
					<template slot-scope="scope">
						<div v-for=" (it,idxx) in itemTypeList" :key="idxx">
							<div v-if="scope.row.itemType==it.id">{{it.name}}</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="dvalues" label="值" min-width="80" show-overflow-tooltip></el-table-column>

				<el-table-column prop="optionList" label="列表" min-width="80" show-overflow-tooltip :formatter="formatteroptionList"></el-table-column>
				<!--
				<el-table-column prop="dnames" label="默认值" min-width="80" ></el-table-column>

 				<el-table-column prop="required" label="必须" min-width="80" ></el-table-column>
				<el-table-column prop="seq" label="顺序" min-width="80" ></el-table-column>
 				<el-table-column prop="show" label="显示" min-width="80" ></el-table-column>
				<el-table-column prop="qx" label="权限" min-width="80" ></el-table-column>
				-->
				<el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="120" fixed="right">
				    <template slot="header">
                        <el-button @click="showAdd" icon="el-icon-plus" circle> </el-button>
                    </template>
					<template scope="scope">
						<el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit" circle></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete" circle></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

			<!--编辑 Item 数据项定义界面-->
			<el-drawer title="编辑数据项定义" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <item-edit :item="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></item-edit>
			</el-drawer>

			<!--新增 Item 数据项定义界面-->
			<el-drawer title="新增数据项定义" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<item-add :item="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></item-add>
			</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库

	import { listItem, delItem, batchDelItem,initSimpleDicts } from '@/api/mdp/meta/item';
	import  ItemAdd from './ItemAdd';//新增界面
	import  ItemEdit from './ItemEdit';//修改界面
	import { mapGetters } from 'vuex'
	import { listCategory } from '@/api/mdp/meta/category';
	export default {
		props:['categoryId'],
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				filters: {
					key: '',
					categoryId:'all',
					targetId:'',
				},
				categorys:[],
				items: [],//查询结果
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
					meta_push_target:{options:[]}
					//sex:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增item界面是否显示
				//新增item界面初始化数据
				addForm: {
					id:'',itemCode:'',itemName:'',remark:'',categoryId:'',itemSize:'50',itemType:'',branchId:'',deptid:'',cmenu:'',dvalues:'',dnames:'',optionList:'',inputFormat:'请输入',required:'0',seq:'999',tableName:'',isShow:'1',qx:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑item界面初始化数据
				editForm: {
					id:'',itemCode:'',itemName:'',remark:'',categoryId:'',itemSize:'',itemType:'',branchId:'',deptid:'',cmenu:'',dvalues:'',dnames:'',optionList:'',inputFormat:'',required:'',seq:'',tableName:'',isShow:'',qx:''
				},
				maxTableHeight:300,
				itemTypeList:[
					{id:"1",name:"普通文本"},
					{id:"2",name:"数字"},
					{id:"3",name:"日期"},
					{id:"4",name:"单选列表"},
					{id:"5",name:"多选列表"},
					{id:"6",name:"单文件"},
					{id:"7",name:"多文件夹"},
					{id:"8",name:"富文本"},
					{id:"9",name:"单图文"},
					{id:"10",name:"多图文"},
					{id:"11",name:"单视频"},
					{id:"12",name:"多视频"},
					{id:"13",name:"单选radio"},
					{id:"14",name:"多选checkbox"}
				]
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getItems();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getItems();
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
				this.getItems();
			},
			searchItems(){
				 this.pageInfo.count=true;
				 this.getItems();
			},
			//获取列表 Item 数据项定义
			getItems() {
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
					params.key= this.filters.key
				}
				if(this.filters.categoryId){
					params.categoryId=this.filters.categoryId
				}
				if(this.filters.targetId){
					params.targetId=this.filters.targetId
				}
				this.load.list = true;
				listItem(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.items = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 Item 数据项定义
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 Item 数据项定义
			showAdd: function () {
				this.addFormVisible = true;
				this.addForm.categoryId=this.filters.categoryId
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getItems();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行item
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除item
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { id: row.id };
					delItem(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getItems();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除item
			batchDel: function () {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelItem(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getItems();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			//获取列表 Category 元数据分类
			getCategorys() {
				let params = {

				};
				this.load.list = true;
				listCategory(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.categorys = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
				});
			},
			formatteroptionList(row,colum,cellValue,index){
				if(cellValue){
					var arr=JSON.parse(cellValue)
					return arr.map(i=>i.name).join(",")
				}else{
					return ""
				}
			}
			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    'item-add':ItemAdd,
		    'item-edit':ItemEdit,
		},
		mounted() {

			if(this.categoryId){
				this.filters.categoryId=this.categoryId
				this.addForm.categoryId=this.categoryId
			}
			this.getCategorys();
			this.$nextTick(() => {
				this.getItems();
                 var clientRect=this.$refs.item.$el.getBoundingClientRect();
                var subHeight=70/1000 * window.innerHeight;
                this.maxTableHeight =  window.innerHeight -clientRect.y - this.$refs.item.$el.offsetTop-subHeight;

        	});
		}
	}

</script>

<style scoped>
</style>
