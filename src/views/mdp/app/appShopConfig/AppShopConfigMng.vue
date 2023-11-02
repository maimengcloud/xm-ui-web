<template>
	<section>
		<el-row  class="app-container">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchAppShopConfigs" icon="el-icon-search"></el-button>
			<el-button type="primary" @click="showAdd" icon="el-icon-plus">app_shop_config</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="app-container"> 
			<!--列表 AppShopConfig app_shop_config-->
			<el-table :max-height="tableHeight" :data="appShopConfigs" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="shopBranchId" label="商户自身归属机构号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="shopId" label="商户编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="tpServiceCharges" label="第三方手续费费率如支付宝/微信支付的费率比如0.003" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="platServiceCharges" label="mdp平台附加手续费费率比如0.002,即该商户下所有交易需要支付给平台的手续费费率" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="platShopDepositAccountId" label="mdp平台分配给该商户（门店）预存款账户（一般商户编号-门店编号-01，用于mdp平台与该商户的结算，商户充值等），如果是总部店，为一般商户编号-0-01" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="platAssetAccountId" label="平台资产账户，商户缴纳给平台手续费等，从商户预存款账户转出，转入该账户计入平台主营业务收入" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="platShopId" label="归属平台商户编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="shopServiceCharges" label="mdp平台商户手续费费率一般为门店订单交易需要支付一定的手续费给商户" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="shopAssetAccountId" label="商户内部主营业务收入账户，在途资金到账后，转入主营业务收入" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="isPlatSc" label="商户是否需要向平台缴纳手续费" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="isShopSc" label="门店是否需要向商户缴纳手续费" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="acctPrjType" label="核算项目platform-由平台结算，shop-由商户独立结算，location-由门店独立结算" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="paySetType" label="支付结算方式platform-使用平台支付通道结算，shop-使用商户结算通道，location-使用门店独立结算通道" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="setLevel" label="结算级别1-商户2-门店，将在途资金账户余额归入商户的预存款账户还是门店预存款账户" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="allowLocationWithdraw" label="是否允许门店提现0否1允许3按门店配置自定义" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="settleShopId" label="归属计算商户pay_set_type=platform时，指向平台商户编号platform_shop_id，pay_set_type=shop时指向本商户编号shop_id" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="isJoinPlat" label="是否加入平台，如果加入平台将在平台的大商城可以展现数据-同步到shop表，避免多表关联" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="shopDepositAccountId" label="商户预存款账户，shop模式下，作为客户" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="settleBranchId" label="结算商户对应的机构号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="platBranchId" label="商户归属的平台机构号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="160" fixed="right"  show-overflow-tooltip>
					<template scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 AppShopConfig app_shop_config界面-->
			<el-drawer title="编辑app_shop_config" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <app-shop-config-edit :app-shop-config="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></app-shop-config-edit>
			</el-drawer>
	
			<!--新增 AppShopConfig app_shop_config界面-->
			<el-drawer title="新增app_shop_config" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<app-shop-config-add :app-shop-config="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></app-shop-config-add>
			</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listAppShopConfig, delAppShopConfig, batchDelAppShopConfig } from '@/api/mdp/app/appShopConfig';
	import  AppShopConfigAdd from './AppShopConfigAdd';//新增界面
	import  AppShopConfigEdit from './AppShopConfigEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
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
				appShopConfigs: [],//查询结果
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
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增appShopConfig界面是否显示
				//新增appShopConfig界面初始化数据
				addForm: {
					shopBranchId:'',shopId:'',tpServiceCharges:'',platServiceCharges:'',platShopDepositAccountId:'',platAssetAccountId:'',platShopId:'',shopServiceCharges:'',shopAssetAccountId:'',isPlatSc:'',isShopSc:'',acctPrjType:'',paySetType:'',setLevel:'',allowLocationWithdraw:'',settleShopId:'',isJoinPlat:'',shopDepositAccountId:'',settleBranchId:'',platBranchId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑appShopConfig界面初始化数据
				editForm: {
					shopBranchId:'',shopId:'',tpServiceCharges:'',platServiceCharges:'',platShopDepositAccountId:'',platAssetAccountId:'',platShopId:'',shopServiceCharges:'',shopAssetAccountId:'',isPlatSc:'',isShopSc:'',acctPrjType:'',paySetType:'',setLevel:'',allowLocationWithdraw:'',settleShopId:'',isJoinPlat:'',shopDepositAccountId:'',settleBranchId:'',platBranchId:''
				},
				tableHeight:500,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getAppShopConfigs();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getAppShopConfigs();
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
				this.getAppShopConfigs();
			},
			searchAppShopConfigs(){
				 this.pageInfo.count=true; 
				 this.getAppShopConfigs();
			},
			//获取列表 AppShopConfig app_shop_config
			getAppShopConfigs() {
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
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listAppShopConfig(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.appShopConfigs = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 AppShopConfig app_shop_config
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 AppShopConfig app_shop_config
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getAppShopConfigs();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行appShopConfig
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除appShopConfig
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { shopId: row.shopId };
					delAppShopConfig(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getAppShopConfigs();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除appShopConfig
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelAppShopConfig(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getAppShopConfigs(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'app-shop-config-add':AppShopConfigAdd,
		    'app-shop-config-edit':AppShopConfigEdit,
		     
		    //在下面添加其它组件
		},
		mounted() {    
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.$nextTick(() => {
				this.getAppShopConfigs();
        	}); 
		}
	}

</script>

<style scoped>

</style>