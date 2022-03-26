<template>
	<section class="page-container">

		<el-row > 
			<el-col :span="10">
				<el-row class="padding-left">
					<el-input v-model="filters.key" style="width: 60%;" placeholder="模糊查询"> 
					</el-input>  
					<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmIterationMenus" icon="el-icon-search"></el-button>
					
					<span style="float:right;"> 
 						<el-button type="danger" @click="batchDel" icon="el-icon-right">批量移出</el-button> 
					</span>
					
				</el-row>
				<el-row class="page-main padding-top padding-left">
					<!--列表 XmIterationMenu 迭代定义-->
					<el-table ref="table" :height="maxTableHeight" :data="xmIterationMenusTreeData"  default-expand-all  row-key="menuId" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"  @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
						<el-table-column  type="selection" width="45"></el-table-column> 
						
						<el-table-column prop="menuName" label="需求名称" min-width="140" > 
							<template slot-scope="scope">
								
							<div  v-if="scope.row.dclass=='1'" class="icon" style="background-color:  rgb(255, 153, 51);">
								<i class="el-icon-s-promotion"></i>
								</div> 
								<div v-if="scope.row.dclass=='2'" class="icon" style="background-color:  rgb(0, 153, 51);">
								<i class="el-icon-s-flag"></i>
								</div>
								<div v-if="scope.row.dclass=='3'" class="icon" style="background-color:  rgb(79, 140, 255);">
								<i class="el-icon-document"></i>
							</div>
								<span class="vlink" type="primary">{{scope.row.seqNo}}
								&nbsp;&nbsp;{{scope.row.menuName}}
								</span> 
							</template>
						</el-table-column> 
						<el-table-column label="操作" width="100" fixed="right">
							<template slot-scope="scope">
								<el-button type="primary" @click="handleDel(scope.row,scope.$index)" icon="el-icon-right">移出</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
				</el-row>
			</el-col>
			<el-col :span="14">
				<xm-menu-select checkScope="0" :xm-product="{id:xmIteration.productId}" :xm-iteration="xmIteration" :visible="menuVisible" :is-select-menu="true" :multi="true"   @menus-selected="onSelectedMenus" ></xm-menu-select>
			</el-col> 
  		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmIterationMenu, delXmIterationMenu, batchDelXmIterationMenu,batchAddXmIterationMenu } from '@/api/xm/core/xmIterationMenu'; 
	import  XmIterationMng from '../xmIteration/XmIterationSelect';//修改界面
	import { mapGetters } from 'vuex'
	import xmMenuSelect from '../xmMenu/XmMenuSelect';

	
	export default { 
		props:['xmIteration'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),
			xmIterationMenusTreeData(){ 
				var data= this.translateDataToTree(this.xmIterationMenus);
				
				return data;
			},
		},
		watch:{
			'xmIteration':function(xmIteration){
				this.onIterationRowClick(xmIteration)
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmIterationMenus: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:20,//每页数据
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
				
				addFormVisible: false,//新增xmIterationMenu界面是否显示
				//新增xmIterationMenu界面初始化数据
				addForm: {
					id:'',iterationId:'',menuId:'',productId:'',ctime:'',relStatus:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmIterationMenu界面初始化数据
				editForm: {
					id:'',iterationId:'',menuId:'',productId:'',ctime:'',relStatus:''
				},
				iteration:null,
				menuVisible:false,
				maxTableHeight:300,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmIterationMenus();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmIterationMenus();
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
				this.getXmIterationMenus();
			},
			searchXmIterationMenus(){
				 this.pageInfo.count=true; 
				 this.getXmIterationMenus();
			},
			//获取列表 XmIterationMenu 迭代定义
			getXmIterationMenus() {
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
				if(this.iteration){
					params.iterationId=this.iteration.id
				}else{
					this.$notify({showClose: true, message: "请先在左边选择迭代", type: 'success' });
					return;
				}
				this.load.list = true;
				listXmIterationMenu(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmIterationMenus = res.data.data;
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmIterationMenu 迭代定义
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmIterationMenu 迭代定义
			showAdd: function () {
				this.menuVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmIterationMenus();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmIterationMenu
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmIterationMenu
			handleDel: function (row,index) {  
				this.$confirm('确认将该需求移出迭代吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { iterationId:row.iterationId,menuIds: [row.menuId] };
					delXmIterationMenu(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmIterationMenus();
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmIterationMenu
			batchDel: function () { 
				if(this.sels.length<=0){
					this.$notify({showClose: true, message:"请先选择一个或者多个需求", type: 'warning' }); 
					return ;
				}
				this.$confirm('确认将需求移出迭代吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					var params={
						iterationId:this.sels[0].iterationId,menuIds:this.sels.map(i=>i.menuId)
					}
					batchDelXmIterationMenu(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmIterationMenus(); 
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			
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
			onSelectedMenus(menus){
				if(!menus || menus.length==0){
					this.menuVisible=false
					return;
				} 
				 
				 var params={
					 menuIds:menus.map(i=>i.menuId),
					iterationId:this.iteration.id
				 }
				batchAddXmIterationMenu(params).then(res=>{
					this.menuVisible=false
					var tips = res.data.tips
					if(tips.isOk){
						this.getXmIterationMenus()
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
				})
			},
			onIterationRowClick(iteration){
				this.iteration=iteration
				this.getXmIterationMenus();
			},
			
			onIterationClearSelect(){
				this.iteration=null;
				this.getXmIterationMenus();
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  
			XmIterationMng,
			xmMenuSelect,
		    //在下面添加其它组件
		},
		mounted() { 
			if(this.xmIteration){
				this.iteration=this.xmIteration
			}
			this.$nextTick(() => {
				
				
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el); 
				this.getXmIterationMenus();
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