<template>
	<section> 
		<el-row  class="app-container" style="text-align:center;">
		
			<el-select v-model="filters.moduleId" placeholder="请选择模块">
					<el-option  v-for="(item,index) in menuModules" :value="item.id" :label="item.name" :key="index"></el-option> 
			</el-select> 
			<el-input v-model="filters.key" style="width: 20%;" placeholder="名称 编号 模糊查询">
				<template slot="append">
					<el-button type="primary" v-loading="load.list" v-on:click="searchQxs" icon="el-icon-search"></el-button> 
				</template>
			</el-input>  
			
			<el-button type="primary"   @click="showAdd" icon="el-icon-plus">权限</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0" icon="el-icon-delete"></el-button>
			
			<el-tooltip
				class="item"
				effect="dark"
				content='在代码中使用权限举例： @HasQx(qxId="xxxxx_insert",qxName="xxx模块xx功能新增xx",moduleId="xxxx系统",categoryName="xxxSysId")'
				placement="top"
			>
				<i class="el-icon-question"></i>
			</el-tooltip>
		</el-row> 
		<el-row class="app-container"> 
					<!--列表 Qx 权限定义-->
					<el-table :max-height="tableHeight" :data="qxs"    highlight-current-row v-loading="load.list" border @selection-change="selsChange" > 
						<el-table-column sortable type="selection" width="40"></el-table-column>
						<el-table-column sortable type="index" width="40"></el-table-column> 
						<el-table-column sortable prop="qxName" label="权限名称" min-width="250"></el-table-column> 
						<el-table-column sortable prop="moduleId" label="归属模块" min-width="100"></el-table-column>
						<el-table-column sortable prop="qxId" label="权限编码" min-width="120"></el-table-column>   
						<el-table-column sortable label="操作" width="250"  fixed="right">
							<template scope="scope">
								<el-button  @click="showEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
								<el-button  type="danger" @click="handleDel(scope.$index, scope.row)" icon="el-icon-delete"></el-button>
							</template>
						</el-table-column>

					</el-table> 
					 
					<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
							</el-pagination>
				 
		</el-row> 
		<!--编辑 Qx 权限定义界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
			  <qx-edit :qx="editForm" @cancel="editFormVisible=false" @submit="afterEditSubmit"></qx-edit>
		</el-dialog>

		<!--新增 Qx 权限定义界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
			<qx-add :qx="addForm" @cancel="addFormVisible=false" @submit="afterAddSubmit"></qx-add>
		</el-dialog> 
		
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listQx, delQx, batchDelQx } from '../../../../api/mdp/sys/qx';
	import { listMenuModule } from '@/api/mdp/menu/menuModule';
	import  QxAdd from './QxAdd';//新增界面
	import  QxEdit from './QxEdit';//修改界面
	import { mapGetters } from 'vuex' 
	
	export default {

  		name:"QxMng",
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ]), 
		},
		watch:{ 
		},
		data() {
			return {
				filters: {
					key: '',
					moduleId:''
				},
				qxs: [],//查询结果
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
				
				addFormVisible: false,//新增qx界面是否显示
				//新增qx界面初始化数据
				addForm: {
					qxId:'',qxName:'',moduleId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑qx界面初始化数据
				editForm: {
					qxId:'',qxName:'',moduleId:''
				},
				/**begin 自定义属性请在下面加 请加备注**/ 
				categoryVisible:false,
				menuModules:[],
				tableHeight:500,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			//获取代码对应的名称 用于数据反显 如 getOptionName(options.sex,'1');
			getOptionName(options,optionValue){
				if(!options)return optionValue;
				let option=options.filter(i=>i.optionValue==optionValue);
				if(option.length>0){
					return option[0].optionName
				}else{
					return optionValue
				} 
			},
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getQxs();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getQxs();
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
				this.getQxs();
			},
			searchQxs(){
				 
				 this.pageInfo.count=true;
				 this.getQxs();
			},
			//获取列表 Qx 权限定义
			getQxs() {
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
				if(this.filters.qxType!=''){
					params.qxType=this.filters.qxType;
				} 
				if(this.filters.moduleId){
					params.moduleId=this.filters.moduleId
				}
				//params.deptid=this.userInfo.deptid;
				this.load.list = true;
				listQx(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;this.pageInfo.count=false;
						this.qxs = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$notify({ message: '通讯错误', type: 'error' });
				});
			},

			//显示编辑界面 Qx 权限定义
			showEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 Qx 权限定义
			showAdd: function () {
				this.addFormVisible = true; 
				this.addForm.moduleId=this.filters.moduleId;
				this.addForm=Object.assign({}, this.addForm); 
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getQxs();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行qx
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除qx
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.list = true;
					let params =row;
					delQx(params).then((res) => {
						this.load.list = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getQxs();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.load.list = false;
				});
			},
			//批量删除qx
			batchDel: function () { 
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.list = true;
					batchDelQx( this.sels ).then((res) => {
						this.load.list = false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getQxs(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.load.list = false;
				});
			}, 
			categoryHandler:function(action){
				if(action=='clear'){
					this.filters.moduleId=''
				}else if(action=='cancel'){
					this.categoryVisible=false;
				}else if(action=='confirm'){
					this.categoryVisible=false;
					this.searchQxs()
				}else if(action='refresh'){
					this.load.list=true
					listMenuModule({}).then(res=>{
						this.load.list=false;
						this.menuModules=res.data.data
					})
				}
			},
			getCategoryName:function(moduleId){
				if(this.menuModules==null || this.menuModules.length==0){
					return moduleId;
				}else{
					var category=this.menuModules.find(i=>i.id==moduleId)
					if(category){
						return category.cname
					}else{
						return moduleId
					}
				}
			},
			categoryTabClick:function(tab){
				console.log(tab);
				this.filters.moduleId=tab.$attrs.moduleId 
				this.searchQxs();
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'qx-add':QxAdd,
		    'qx-edit':QxEdit, 
		    //在下面添加其它组件
		},
		mounted() {  
			//加载下拉列表 如有需要去年注释  
			this.categoryHandler("refresh")
			this.searchQxs();
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			this.$nextTick(()=>{  
				this.tableHeight = window.innerHeight - 250;  
			}); 
			/**在下面写其它函数***/
		}
	}

</script>

<style scoped>

.category{
	margin-top: 14px;
}
.mdp-table{
	width: 100%; 
}
</style>