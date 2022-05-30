<template>
	<section>
		<el-row  class="app-container"> 
				<el-select v-model="filters.moduleId" placeholder="请选择模块" clearable>
 						<el-option  v-for="(item,index) in menuModules" :value="item.id" :label="item.name" :key="index"></el-option> 
				</el-select> 
				
				<el-select v-model="filters.supVers" placeholder="请选择版本"  clearable>
 						<el-option  v-for="(item,index) in dicts['menuSupVers']" :value="item.id" :label="item.name" :key="index"></el-option> 
				</el-select> 
			<el-input v-model="filters.key" style="width: 20%;" placeholder="名称 简称  编号 模糊查询">
				<template slot="append">  
					<el-button type="primary" v-loading="load.list" v-on:click="searchMenuDefs" icon="el-icon-search"></el-button>
				</template>
			</el-input>
			<el-button type="primary" @click="showAdd" icon="el-icon-plus">菜单</el-button>
			<el-button   @click="showImport"  icon="el-icon-upload">导入</el-button>
			<el-button   @click="showBatchSetMenuRole" :disabled="this.sels.length===0" icon="el-icon-setting">分配到角色</el-button> 
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0" icon="el-icon-delete"></el-button> 
			<el-tooltip class="item" effect="light" content="超级管理员/平台管理员/系统管理员可以查询及维护所有菜单，其它人员只能查询修改本角色拥有的菜单" placement="top-start">
		       <i class="el-icon-question"></i>
		    </el-tooltip>
		</el-row>
		<el-row class="app-container"> 
			<el-col :span="24">
				<!--列表 MenuDef 前端功能菜单表-->
				<el-table ref="table" :max-height="maxTableHeight" :data="treeData"  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" 
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          row-key="id" >
					<el-table-column sortable type="selection" width="40"></el-table-column>
					<el-table-column sortable type="index" width="40"></el-table-column> 
					<el-table-column sortable prop="mname" label="菜单名称" min-width="250" show-overflow-tooltip>
						<template slot-scope="scope">  
								{{scope.row.id}} - <el-link  @click.stop="showEdit(scope.row,scope.$index)"  type="primary">{{scope.row.mname}}</el-link> 
								 <font v-if="scope.row.menuType=='2'" style="color:red;">(按钮)</font><font v-if="scope.row.menuType!='2'" style="color:blue;">(菜单)</font>
						</template>
					</el-table-column>
					<el-table-column sortable prop="moduleId" label="归属模块" min-width="100" show-overflow-tooltip> 
					</el-table-column>
					<el-table-column sortable prop="rpath" label="路由PATH" min-width="200" show-overflow-tooltip></el-table-column> 
					<el-table-column sortable prop="supVers" label="版本" min-width="80"  >
						<template slot-scope="scope">
						 <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'menuSupVers',scope.row.supVers)" :key="index" :type="item.className">{{item.name}}</el-tag>
					</template>
					</el-table-column> 
					<el-table-column sortable prop="msort" label="顺序" min-width="80"  ></el-table-column>   
					<el-table-column sortable label="操作" width="420" fixed="right">
						<template slot-scope="scope">
							<el-button size="mini" type="primary"  @click="showSubAdd(scope.row,scope.$index)" icon="el-icon-plus"></el-button> 
							<el-button size="mini"   @click="showMenuRole(scope.row,scope.$index)" icon="el-icon-menu">分配到角色</el-button> 
							<el-button size="mini"   @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button> 
							<el-button size="mini"   @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
							<el-button size="mini" v-if="scope.row.menuType=='1'"   @click="showButtons( scope.row,scope.$index)" icon="el-icon-right">按钮</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
			</el-col>
			</el-row>
			<!--编辑 MenuDef 前端功能菜单表界面-->
			<el-dialog title="编辑前端功能菜单表" :visible.sync="editFormVisible"  width="50%" top="5vh" :close-on-click-modal="false">
				  <menu-def-edit :menu-def="editForm" :pmenu="pmenu" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></menu-def-edit>
			</el-dialog>
	
			<!--新增 MenuDef 前端功能菜单表界面-->
			<el-dialog title="新增前端功能菜单表" :visible.sync="addFormVisible"  width="50%" top="5vh" :close-on-click-modal="false">
				<menu-def-add :menu-def="addForm" :pmenu="pmenu" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></menu-def-add>
			</el-dialog> 
						<!--新增 MenuDef 前端功能菜单表界面-->
			<el-dialog title="按钮管理" :visible.sync="menuButtonsVisible"  width="50%" top="5vh" :close-on-click-modal="false">
				<menu-buttons :menu-def="addForm" :pmenu="editForm" :visible="menuButtonsVisible" @cancel="menuButtonsVisible=false" @submit="afterAddSubmit"></menu-buttons>
			</el-dialog> 
		   			<!--新增 菜单角色关系表界面-->
			<el-dialog title="分配菜单到多个角色" :visible.sync="setMenuRoleVisible"  width="80%" top="5vh"   :close-on-click-modal="false" append-to-body	>
				<menu-role-set :mids="mids" :batch="menuRoleSetBatch"  :visible="setMenuRoleVisible" @cancel="setMenuRoleVisible=false"></menu-role-set>
			</el-dialog> 
			
			<!--导入界面-->
			<el-dialog title="导入菜单" :visible.sync="setImportVisible"  width="70%" top="5vh"  :close-on-click-modal="false" append-to-body	>
				<menu-def-import :mids="mids"   :visible="setImportVisible" @cancel="setImportVisible=false" @submit="afterAddSubmit"></menu-def-import>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import {  initDicts,listMenuDef, delMenuDef, batchDelMenuDef } from '@/api/mdp/menu/menuDef';
	import { listMenuModule } from '@/api/mdp/menu/menuModule';
	import  MenuDefAdd from './MenuDefAdd';//新增界面
	import  MenuDefEdit from './MenuDefEdit';//修改界面
	import  MenuRoleSet from '../menuRole/MenuRoleSet';//修改界面 
	import MenuButtons from './MenuButtons'
	import MenuDefImport from './MenuDefImport'
	import { mapGetters } from 'vuex'; 
	
	export default {
  		name:"MenuDefMng",

	    computed: {
		    ...mapGetters([
		      'userInfo'
			]),
			treeData(){
				return this.translateDataToTree(this.menuDefs)
			}
		},
		data() {
			return {
				filters: {
					key: '',
					menuid:'',
					moduleId:'',
					supVers:'',
				},
				menuDefs: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:100,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{},//下拉选择框的所有静态数据 params=[{moduleIdId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增menuDef界面是否显示
				//新增menuDef界面初始化数据
				addForm: {
					id:'',pid:'',accUrl:'',msort:'',moduleId:'',icon:'',mname:'',rpath:'',rid:'',isShow:'1',supVers:'0'
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑menuDef界面初始化数据
				editForm: {
					id:'',pid:'',accUrl:'',msort:'',moduleId:'',icon:'',mname:'',rpath:'',rid:'',isShow:'1',supVers:'0'
				},
				/**begin 自定义属性请在下面加 请加备注**/
				pmenu:null,
				setMenuRoleVisible:false,
				menuButtonsVisible: false,//按钮管理
				mids:[],//
				refresh:false,//
				setImportVisible:false,//导入菜单
				menuRoleSetBatch: false,//
				moduleIdVisible:false,
				menuModules:[],
				maxTableHeight:500,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			...util,
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getMenuDefs();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getMenuDefs();
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
				this.getMenuDefs();
			},
			searchMenuDefs(){
				 
				 this.pageInfo.count=true;
				 this.getMenuDefs();
			},
			//获取列表 MenuDef 前端功能菜单表
			getMenuDefs() {
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
				if(this.filters.moduleId){
					params.moduleId=this.filters.moduleId
				} 
				if(this.filters.supVers){
					params.supVers=this.filters.supVers
				} 
				this.load.list = true;
				listMenuDef(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;this.pageInfo.count=false;
						this.menuDefs = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$notify({ message: '通讯错误', type: 'error' });
				});
			},

			translateDataToTree(data) {  

				let parents = data.filter(value =>{ 
					//如果我的上级为空，则我是最上级
					if(value.pid == 'undefined' || value.pid == null  || value.pid == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.pid==i.id)){
						return false;
					}else {
						return true
					}
				 
				}) 
				let children = data.filter(value =>{
					if(data.some(i=>value.pid==i.id)){
						return true;
					}else{
						return false;
					} 
				})  
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.pid === parent.id) {
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
			//显示编辑界面 MenuDef 前端功能菜单表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 MenuDef 前端功能菜单表
			showAdd: function () {
				this.pmenu=null;
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			showSubAdd: function (row) {
				this.pmenu=row
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			showImport: function () {
				this.setImportVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			showMenuRole: function ( row,index ) {
				this.menuRoleSetBatch=false
				this.setMenuRoleVisible = true;
				this.mids=[row.id]
			},
			showBatchSetMenuRole: function ( ) {
				this.menuRoleSetBatch=true
				this.mids=this.sels.map(i=>i.id)
				this.setMenuRoleVisible = true; 
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.refresh=!this.refresh
				this.getMenuDefs();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			showButtons(row,index){
				this.editForm=row
				this.menuButtonsVisible=true
			},
			//选择行menuDef
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除menuDef
			handleDel: function (row,index) { 

				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = row;
					delMenuDef(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getMenuDefs();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					});
				}).catch(() =>this.load.del=false);
			},
			//批量删除menuDef
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelMenuDef(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getMenuDefs(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => this.load.del=false );
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}, 
			moduleHandler:function(action){
				if(action=='clear'){
					this.filters.moduleId=''
				}else if(action=='cancel'){
					this.moduleIdVisible=false;
				}else if(action=='confirm'){
					this.moduleIdVisible=false;
					this.searchMenuDefs()
				}else if(action='refresh'){
					this.load.list=true
					listMenuModule({}).then(res=>{
						this.load.list=false;
						this.menuModules=res.data.data
					})
				}
			}
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'menu-def-add':MenuDefAdd,
		    'menu-def-edit':MenuDefEdit,
		      
		    MenuRoleSet,
		    MenuDefImport,
		    MenuButtons
		    //在下面添加其它组件
		},
		mounted() {
			
			initDicts(this);
			this.$nextTick(() => { 
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
				this.getMenuDefs();
				this.moduleHandler("refresh")
        	}); 
		}
	}

</script>

<style scoped> 

</style>