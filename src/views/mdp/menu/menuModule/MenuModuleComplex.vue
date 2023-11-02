<template>
	<section>
		<el-card> 
			<div slot="header" class="clearfix"> 
					<el-row>
						<span><strong>产品信息</strong></span> &nbsp;&nbsp;
						<el-button style="font-size:14px;" @click="productScopeSet('hadOpen')">已开通产品</el-button> 
						<el-button  style="font-size:14px;" @click="productScopeSet('all')" type="primary" >全部产品</el-button>  
					</el-row>
			</div>  
			<!--列表 MenuModule 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问-->
			<el-table ref="menuModuleTable" :data="menuModules"  @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
 				<el-table-column prop="name" label="模块名称" min-width="120" show-overflow-tooltip>
					<template slot-scope="scope">
						<div class="avatar-container" @click="showEdit(scope.row)">
							<div class="avatar-wrapper">
								<img v-if=" scope.row.logoUrl" class="user-avatar" :src="scope.row.logoUrl">
								<img v-else class="user-avatar" src="../../../../assets/image/user_img.gif">
								<span class="username">  {{scope.row.name}}</span> 
							</div>    
						</div>
					</template>
				</el-table-column> 
				<el-table-column prop="billMode" label="计费模式" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope"> 
 						<mdp-select show-style="tag" item-code="moduleBillMode" v-model="scope.row.billMode" :disabled="true"></mdp-select>
                    </template>
				</el-table-column>
				<el-table-column prop="uniFee" label="每人月均费用" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
						<span v-if="scope.row.billMode==='1'||scope.row.billMode==='3'"> 
							人均￥ {{scope.row.uniFee}} 
						</span>
						<span v-else-if="scope.row.billMode==='2'"> 
							总包￥ {{scope.row.fee}} 
						</span>
						<span v-else> 
							- 
						</span>
                    </template>
				</el-table-column> 
				<!--
				<el-table-column prop="url" label="匹配的url" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="cell-text">
                        {{scope.row.url}}
                      </span>
                      <span class="cell-bar">
                            <el-input style="display:inline;" v-model="scope.row.url" placeholder="匹配的url" @change="editSomeFields(scope.row,'url',$event)" :maxlength="255"></el-input>
                      </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ignoreUrl" label="忽略url" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="cell-text">
                        {{scope.row.ignoreUrl}}
                      </span>
                      <span class="cell-bar">
                            <el-input style="display:inline;" v-model="scope.row.ignoreUrl" placeholder="匹配这个地址的不计费" @change="editSomeFields(scope.row,'ignoreUrl',$event)" :maxlength="255"></el-input>
                      </span>
                    </template>
				</el-table-column>
				--> 
				<!--
				<el-table-column prop="procInstId" label="审核流程实例编号" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="cell-text">
                        {{scope.row.procInstId}}
                      </span>
                      <span class="cell-bar">
                            <el-input style="display:inline;" v-model="scope.row.procInstId" placeholder="审核流程实例编号" @change="editSomeFields(scope.row,'procInstId',$event)" :maxlength="50"></el-input>
                      </span>
                    </template>
				</el-table-column>
				-->
				<el-table-column label="操作" width="180" fixed="right">
					<template scope="scope">
						<el-button type="primary" @click="goToMo(scope.row)">开通</el-button> 
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
			<mdp-dialog ref="formDialog">
                <template v-slot="{visible,data,dialog}">
                     <menu-module-form :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="dialog.close()" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog>
		</el-card>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from '@/api/mdp_pub/mdp_config';//全局公共库 
 	import { listMenuModule, delMenuModule, batchDelMenuModule,editSomeFieldsMenuModule } from '@/api/mdp/menu/menuModule';
	import { mapGetters } from 'vuex'
	import MenuModuleForm from './Form'
	import {modulesOfIcon} from "../../../layout/ModulesMenu/modulesOfIcon.js";

	export default {
	    name:'menuModuleMng',
		components: {
			MenuModuleForm
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchMenuModules()
                }
            }
		},
		data() {
			return {
				filters: {
					key: '',
					mcate:'',
				},
				menuModules: [],//查询结果
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
					
					moduleBillMode:[],
					bizFlowState:[],
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增menuModule界面是否显示
				addForm: {
					id:'',name:'',fee:'',billMode:'',uniFee:'',discount:'',url:'',ignoreUrl:'',bizFlowState:'',procInstId:'',status:'',mcate:'',logoUrl:'',feeDesc:'',udisRate:'',udis:'',saleDesc:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					id:'',name:'',fee:'',billMode:'',uniFee:'',discount:'',url:'',ignoreUrl:'',bizFlowState:'',procInstId:'',status:'',mcate:'',logoUrl:'',feeDesc:'',udisRate:'',udis:'',saleDesc:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: {

		    ...util,

			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getMenuModules();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getMenuModules();
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
				this.getMenuModules();
			},
			searchMenuModules(){
				 this.pageInfo.count=true; 
				 this.getMenuModules();
			},
			//获取列表 MenuModule 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问
			getMenuModules() {
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

				if(this.filters.mcate){
					params.mcate=this.filters.mcate
				}
				this.load.list = true;
				listMenuModule(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.menuModules = res.data.data; 
						res.data.data.forEach(i=>{
							var module=modulesOfIcon.find(k=>k.id==i.id)
							i.logoUrl=module?module.logoUrl:''
						})
					}else{
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 MenuModuleBranch 管理端机构表（机构下面若干部门）
			showEdit: function ( row,index ) { 
				this.$refs['formDialog'].open({formData:row,subOpType:'detail'})
			},
			//显示新增界面 MenuModuleBranch 管理端机构表（机构下面若干部门）
			showAdd: function () {
				this.$refs['formDialog'].open({formData:this.addForm,subOpType:'add'}) 
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getMenuModules();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行menuModule
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除menuModule
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = {  id:row.id };
					delMenuModule(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.searchMenuModules();
						}
						this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除menuModule
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { id:i.id}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelMenuModule(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.searchMenuModules();
						}
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
          editSomeFields(row,fieldName,$event){
            let params={};
            if(this.sels.length>0){
              if(!this.sels.some(k=> k.id==row.id)){
                this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
                Object.assign(this.editForm,this.editFormBak)
                return;
              }
                params['ids']=this.sels.map(i=>i.id)
            }else{
                params['ids']=[row].map(i=>i.id)
            }
            params[fieldName]=$event
            var func = editSomeFieldsMenuModule
            func(params).then(res=>{
              let tips = res.data.tips;
              if(tips.isOk){
                if(this.sels.length>0){
                    this.searchMenuModules();
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
			},
			
			goToMo(item){
				if(item){
					this.$router.push("/my/order/index?moduleId="+item.id)
				}else{
					this.$router.push("/my/order/index")
				}
				
			},
			
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    
			    this.initData()
				this.searchMenuModules(); 

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