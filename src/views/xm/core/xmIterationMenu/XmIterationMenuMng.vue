<template>
	<section>
		<el-row :gutter="10">
			<el-col :span="8">
				<xm-epic-features-select :xm-product="{id:xmIteration.productId,name:''}" :show-select="false" @row-click="onEpicFeatureSelect"></xm-epic-features-select>
			</el-col>
			<el-col :span="16">
				<el-row>
					<el-col :span="24">
						<el-row>
							<el-input v-model="filters.key" style="width: 60%;" placeholder="模糊查询" clearable>
							</el-input>
							<el-button v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmIterationMenus" icon="el-icon-search"></el-button>

							<span style="float:right;">
								<el-button type="danger" @click="batchDel" icon="el-icon-delete">移出</el-button>
								<el-button type="primary" @click="showAdd" icon="el-icon-plus">故事</el-button>
							</span>

						</el-row>
						<el-row class="padding-top">
							<!--列表 XmIterationMenu 迭代定义-->
							<el-table ref="table" :height="maxTableHeight" :data="xmIterationMenusTreeData"  row-key="menuId"   @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
								<el-table-column  type="selection" width="45"></el-table-column>

								<el-table-column prop="menuName" label="已加入迭代的用户故事" min-width="140" >
									<template slot-scope="scope">
										<div style="display:flex;">
									<div  v-if="scope.row.dclass=='1'" class="icon" style="background-color:  rgb(255, 153, 51);">
										<i class="el-icon-s-promotion"></i>
										</div>
										<div v-if="scope.row.dclass=='2'" class="icon" style="background-color:  rgb(0, 153, 51);">
										<i class="el-icon-s-flag"></i>
										</div>
										<div v-if="scope.row.dclass=='3'" class="icon" style="background-color:  rgb(79, 140, 255);">
										<i class="el-icon-document"></i>
									</div>
										 <el-link @click="showEdit( scope.row,scope.$index)" >{{scope.row.seqNo}}
										&nbsp;&nbsp;{{scope.row.menuName}}</el-link>
									</div>
									</template>
								</el-table-column>
								<el-table-column prop="finishRate" label="进度" width="100" show-overflow-tooltip sortable>
									<template slot-scope="scope">
										<span
											:style="{borderRadius: '30px',color:scope.row.finishRate >= 100 ? 'green' : 'blue'}"
										>
											{{ (scope.row.finishRate != null ? scope.row.finishRate : 0) + "%" }}
										</span>
									</template>
								</el-table-column>
								<el-table-column label="操作" width="100" fixed="right">
									<template slot-scope="scope">
										<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete">移出</el-button>
									</template>
								</el-table-column>
							</el-table>
							<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
						</el-row>
					</el-col>
				</el-row>
			</el-col>
		</el-row>

		  <el-dialog :visible.sync="menuVisible" width="80%" top="20px" append-to-body title="选择用户故事加入迭代">
			  <xm-menu-select ref="menusSelect" style="margin-top:-30px;" iterationFilterType="not-join-curr-iteration" checkScope="3" :xm-product="xmIteration?{id:xmIteration.productId}:null" :xm-iteration="xmIteration" :visible="menuVisible" :is-select-menu="true" :multi="true"   @menus-selected="onSelectedMenus" ></xm-menu-select>
		  </el-dialog>
		<!--编辑 XmMenu xm_project_menu界面-->
			<el-dialog title="编辑故事" :visible.sync="editFormVisible" :with-header="false" width="90%" top="20px"    append-to-body   :close-on-click-modal="false" >
				<xm-menu-edit :xm-menu="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"   @edit-fields="onEditSomeFields"></xm-menu-edit>
			</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	import config from '@/common/config';//全局公共库

	import { listXmIterationMenu, delXmIterationMenu, batchDelXmIterationMenu,batchAddXmIterationMenu } from '@/api/xm/core/xmIterationMenu';
	import  XmIterationMng from '@/views/xm/core/components/XmIterationSelect';//修改界面
	import { mapGetters } from 'vuex'
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import xmMenuEdit from '../xmMenu/xmMenuEdit';
	import XmEpicFeaturesSelect from '../xmMenu/XmEpicFeaturesSelect'

	export default {
		props:['xmIteration'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),

      		xmIterationMenusTreeData() {
				 return this.xmIterationMenus;
			},
		},
		watch:{
			'xmIteration.id':function(){
				this.onIterationRowClick(this.xmIteration)
			}
		},
		data() {
			return {
				filters: {
					key: '',
					pmenuId:'',
				},
				xmIterationMenus: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:20,//每页数据
					count:true,//是否需要重新计算总记录数
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
			onEpicFeatureSelect(parentMenu){
				if(parentMenu && parentMenu.menuId){
					this.filters.parentMenu=parentMenu
				}else{
					this.filters.parentMenu=null
				}
				this.searchXmIterationMenus();

			},
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
					this.$notify({position:'bottom-left',showClose:true,message: "请先在左边选择迭代", type: 'success' });
					return;
				}
				if(this.filters.parentMenu){
					params.pidPathsLike=this.filters.parentMenu.pidPaths
				}
				this.load.list = true;
				listXmIterationMenu(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmIterationMenus = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
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
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmIterationMenu
			batchDel: function () {
				if(this.sels.length<=0){
					this.$notify({position:'bottom-left',showClose:true,message:"请先选择一个或者多个需求", type: 'warning' });
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
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
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
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
				})
			},
			onIterationRowClick(iteration){
				this.iteration=iteration
				this.getXmIterationMenus();
			},

			onIterationClearSelect(){
				this.iteration=null;
				this.getXmIterationMenus();
			},
			onEditSomeFields(row){
				Object.assign(this.editForm,row)
			}
			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
			XmIterationMng,
			xmMenuSelect,
			XmEpicFeaturesSelect,
			xmMenuEdit
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

			**/
		}
	}

</script>

<style scoped>

</style>
