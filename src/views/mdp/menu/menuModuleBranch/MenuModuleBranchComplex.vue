<template>
	<section>
		<el-card> 
			<div slot="header" class="clearfix"> 
					<el-row>
						<span><strong>产品信息</strong></span> &nbsp;&nbsp;
						<el-button style="font-size:14px;" @click="productScopeSet('hadOpen')" type="primary">已开通产品</el-button> 
						<el-button  style="font-size:14px;" @click="productScopeSet('all')"  >全部产品</el-button>  
					</el-row>
			</div>    
				<!--列表 MenuModuleBranch 管理端机构表（机构下面若干部门）-->
				<el-table ref="menuModuleBranchTable" :data="menuModuleBranchs"  @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
					<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
 					<el-table-column prop="moduleName" label="产品" min-width="150" show-overflow-tooltip  fixed="left"> 
						<template slot-scope="scope">
							<div class="avatar-container" @click="showEdit(scope.$index,scope.row)">
								<div class="avatar-wrapper">
									<img v-if=" scope.row.logoUrl" class="user-avatar" :src="scope.row.logoUrl">
									<img v-else class="user-avatar" src="../../../../assets/image/user_img.gif">
									<span class="username">  {{scope.row.moduleName}}</span> 
								</div>    
							</div>
						</template>
					 </el-table-column> 
					<el-table-column prop="status" label="状态" min-width="80" show-overflow-tooltip>
						<template slot-scope="scope"> 
							<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'status',scope.row.status)" :key="index" :type="item.className">{{item.name}}</el-tag>
						</template>
					</el-table-column> 
					<el-table-column prop="endTime" label="有效期" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope"> 
							{{scope.row.endTime}} 
						</template>
					</el-table-column>   
					<el-table-column prop="musers" label="购买用户数" min-width="80" show-overflow-tooltip>
						<template slot-scope="scope"> 
							{{scope.row.musers}} 
						</template>
					</el-table-column>   
					<el-table-column prop="ousers" label="可用人数" min-width="80" show-overflow-tooltip>
						<template slot-scope="scope"> 
							{{scope.row.ousers}} 
						</template>
					</el-table-column>  
					<el-table-column label="操作" width="180" fixed="right">
						<template scope="scope">
							<el-button type="primary" @click="goToAddUsers">新增人数</el-button>
							<el-button type="warning" @click="goToRenew(scope.row)">续费</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
 
		 
			<!--编辑 MenuModuleBranch 管理端机构表（机构下面若干部门）界面-->
			<el-drawer title="编辑" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <menu-module-branch-edit op-type="edit" :menu-module-branch="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></menu-module-branch-edit>
			</el-drawer>

			<!--新增 MenuModuleBranch 管理端机构表（机构下面若干部门）界面-->
			<el-drawer title="新增" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<menu-module-branch-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></menu-module-branch-edit>
			</el-drawer> 
		
		</el-card>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
 	import { initDicts,listMenuModuleBranch, delMenuModuleBranch, batchDelMenuModuleBranch,editSomeFieldsMenuModuleBranch } from '@/api/mdp/menu/menuModuleBranch';
	import  MenuModuleBranchEdit from './MenuModuleBranchEdit';//新增修改界面
	import { mapGetters } from 'vuex'
	
	import {modulesOfIcon} from "@/components/ModulesMenu/modulesOfIcon.js";

	export default {
	    name:'menuModuleBranchMng',
		components: {
		    MenuModuleBranchEdit,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchMenuModuleBranchs()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				menuModuleBranchs: [],//查询结果
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
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增menuModuleBranch界面是否显示
				addForm: {
					branchId:'',moduleId:'',startTime:'',endTime:'',ctime:'',ltime:'',cuserid:'',cusername:'',luserid:'',lusername:'',status:'',musers:'',mbidNum:'',sfeeRate:'',ver:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					branchId:'',moduleId:'',startTime:'',endTime:'',ctime:'',ltime:'',cuserid:'',cusername:'',luserid:'',lusername:'',status:'',musers:'',mbidNum:'',sfeeRate:'',ver:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: { 
			...util,
			
			goToAddUsers(){
				this.$router.push("/my/order/addUsers")
			},
			goToRenew(){
				this.$router.push("/my/order/renew")
			},
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getMenuModuleBranchs();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getMenuModuleBranchs();
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
				this.getMenuModuleBranchs();
			},
			searchMenuModuleBranchs(){
				 this.pageInfo.count=true; 
				 this.getMenuModuleBranchs();
			},
			//获取列表 MenuModuleBranch 管理端机构表（机构下面若干部门）
			getMenuModuleBranchs() {
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
					params.key=this.filters.key
				}

				this.load.list = true;
				listMenuModuleBranch(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						res.data.data.forEach(i=>{
							var module=modulesOfIcon.find(k=>k.id==i.moduleId)
							i.logoUrl=module?module.logoUrl:''
						})
						this.menuModuleBranchs = res.data.data;
					}else{
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 MenuModuleBranch 管理端机构表（机构下面若干部门）
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 MenuModuleBranch 管理端机构表（机构下面若干部门）
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.searchMenuModuleBranchs();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.searchMenuModuleBranchs();
				
			},
			//选择行menuModuleBranch
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除menuModuleBranch
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = {  branchId:row.branchId,  moduleId:row.moduleId };
					delMenuModuleBranch(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.searchMenuModuleBranchs();
						}
						this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除menuModuleBranch
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { branchId:i.branchId,  moduleId:i.moduleId}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelMenuModuleBranch(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.searchMenuModuleBranchs();
						}
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
          editSomeFields(row,fieldName,$event){
            let params={};
            if(this.sels.length>0){
              if(!this.sels.some(k=> k.branchId==row.branchId &&  k.moduleId==row.moduleId)){
                this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
                Object.assign(this.editForm,this.editFormBak)
                return;
              }
                params['pkList']=this.sels.map(i=>{ return { branchId:i.branchId,  moduleId:i.moduleId}})
            }else{
                params['pkList']=[row].map(i=>{ return { branchId:i.branchId,  moduleId:i.moduleId}})
            }
            params[fieldName]=$event
            var func = editSomeFieldsMenuModuleBranch
            func(params).then(res=>{
              let tips = res.data.tips;
              if(tips.isOk){
                if(this.sels.length>0){
                    this.searchMenuModuleBranchs();
                }
                this.editFormBak=[...this.editForm]
              }else{
                Object.assign(this.editForm,this.editFormBak)
                this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
              }
            }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
          },
			rowClick: function(row, event, column){
			    this.editForm=row
			    this.editFormBak={...row};
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            }, 
			productScopeSet(scope){
				this.$emit("product-scope-set",scope);
			}
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    initDicts(this);
			    this.initData()
				this.searchMenuModuleBranchs();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.menuModuleBranchTable.$el)

        	});
		}
	}

</script>

<style lang="scss" scoped>
.avatar-container {
    height: 50px;
    display: flex;
    align-items: center;
    .avatar-wrapper {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        .user-avatar {
            height: 34px;
            width: 34px;
            border-radius: 50%;
            margin-right: 12px;
        }
        .username{
            color: #7D7D7D;
            font-size: 18px;
            margin-right: 2px;
        }
        .el-icon-caret-bottom {
            font-size: 22px;
        }
    }
}
</style>