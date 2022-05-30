<template>
	<section>
		<el-row>
			<el-col :span="6">
				<item-mng @row-click="itemRowClick"></item-mng>
			</el-col>
			<el-col :span="18"> 
			<el-row  class="app-container">
			<el-input v-model="addForm.optionName"  @keyup.enter.native="addSubmit" style="width: 40%;" placeholder="输入名称按回车快速添加字段值"></el-input> 
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" v-on:click="searchItemOptions" icon="el-icon-search"></el-button>
			<el-button type="text" @click="showAdd" icon="el-icon-plus">字段值</el-button>
			<el-button type="text" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0">删除</el-button> 
			</el-row>  
			<el-row  class="app-container">
			<!--列表 ItemOption 数据项取值列表-->
			<el-table :max-height="tableHeight" :data="itemOptions"  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable prop="seqOrder" label="顺序" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="optionValue" label="选项值" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="optionName" label="选项名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="isShow" label="是否显示" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope">
					<el-tag v-if="scope.row.isShow=='1'">√</el-tag>
					<el-tag v-else>×</el-tag>
					</template>
				</el-table-column>
				<el-table-column sortable prop="fp" label="扩展字段" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable label="操作" width="150" fixed="right" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button  type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
			 </el-row>
		</el-col>
			<!--编辑 ItemOption 数据项取值列表界面-->
			<el-dialog title="编辑数据项取值列表" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <item-option-edit :item-option="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></item-option-edit>
			</el-dialog>
	
			<!--新增 ItemOption 数据项取值列表界面-->
			<el-dialog title="新增数据项取值列表" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<item-option-add :item-option="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></item-option-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listItemOption, delItemOption, batchDelItemOption, addItemOption,listOption } from '@/api/mdp/meta/itemOption';
	import  ItemOptionAdd from './ItemOptionAdd';//新增界面
	import  ItemOptionEdit from './ItemOptionEdit';//修改界面
	import  ItemMng from '../item/ItemMng';//修改界面
	import { mapGetters } from 'vuex' 
	
	export default {
		name:'ItemOptionMng',

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				itemOptions: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 options.sex,options.project
				
				addFormVisible: false,//新增itemOption界面是否显示
				//新增itemOption界面初始化数据
				addForm: {
					itemId:'',id:'',optionValue:'',optionName:'',Keyes:'',isShow:'1',seqOrder:'',fp:'',tp:'',sp:'',isDefault:'',cdate:'',branchId:'',deptid:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑itemOption界面初始化数据
				editForm: {
					itemId:'',id:'',optionValue:'',optionName:'',Keyes:'',isShow:'1',seqOrder:'',fp:'',tp:'',sp:'',isDefault:'',cdate:'',branchId:'',deptid:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				item:{},
				tableHeight:500,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getItemOptions();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getItemOptions();
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
				this.getItemOptions();
			},
			searchItemOptions(){
				 
				 this.pageInfo.count=true;
				 this.getItemOptions();
			},
			//获取列表 ItemOption 数据项取值列表
			getItemOptions() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					params.key="%"+this.filters.key+"%"
				}else{
					//params.xxx=xxxxx
				}
				if(this.item!=null && this.item.id!=''){
					params.itemId=this.item.id
				}
				this.load.list = true;
				listItemOption(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;this.pageInfo.count=false;
						this.itemOptions = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$notify({ message: '通讯错误', type: 'error' });
				});
			},

			//显示编辑界面 ItemOption 数据项取值列表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 ItemOption 数据项取值列表
			showAdd: function () {
				this.addForm.itemId=this.item.id;
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getItemOptions();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行itemOption
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除itemOption
			handleDel: function (row,index) {
				
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params =row;
					delItemOption(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getItemOptions();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					});
				}).catch(() => {
					this.load.del=false;
				});
			},
			//批量删除itemOption
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelItemOption(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getItemOptions(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.load.del=false;
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			itemRowClick: function(row, event, column){ 
				this.item=row
				this.searchItemOptions();
			},
			/**begin 自定义函数请在下面加**/
						//新增提交ItemOption 数据项取值列表 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				if(this.item==null || this.item.id == '' ){
					this.$notify.error("请先选择字段")
				}
				
				this.load.add=true
				let params = Object.assign({}, this.addForm); 
				params.id='';
				params.itemId=this.item.id
				addItemOption(params).then((res) => {
					this.load.add=false
					var tips=res.data.tips;
					if(tips.isOk){
						this.itemOptions.push(res.data.data);
					}
					this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch(() => {
					this.load.add=false
				});
			}
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'item-option-add':ItemOptionAdd,
		    'item-option-edit':ItemOptionEdit,
		     
		    'item-mng':ItemMng
		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {
      			this.tableHeight = window.innerHeight - 250;  
				this.getItemOptions();
				listOption([{categoryId:'gk8nischm',itemCode:'sex'}]).then(res=>{
					this.options=res.data.data;
					console.log(this.options);
				});
        	}); 
		}
	}

</script>

<style scoped>

</style>