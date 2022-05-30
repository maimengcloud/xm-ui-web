<template>
	<section>
		<el-row  class="app-container">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchAppTpPays" icon="el-icon-search"></el-button>
			<el-button type="primary" @click="showAdd" icon="el-icon-plus">支付渠道</el-button>
 		</el-row>
		<el-row class="app-container"> 
			<!--列表 AppTpPay app_tp_pay-->
			<el-table :max-height="tableHeight" :data="appTpPays"  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				<el-table-column sortable type="index" width="40"></el-table-column> 
				<el-table-column sortable prop="name" label="应用名称" min-width="80" show-overflow-tooltip></el-table-column> 
				<el-table-column sortable prop="remark" label="应用描述" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="payType" label="支付渠道" min-width="80" show-overflow-tooltip></el-table-column>
 				<el-table-column sortable prop="enabled" label="应用状态" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="appid" label="appid" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="payMchid" label="渠道支付商户编号" min-width="80" show-overflow-tooltip></el-table-column> 
				<el-table-column sortable prop="openPay" label="开通支付" min-width="80" show-overflow-tooltip></el-table-column> 
 				<el-table-column sortable prop="shopId" label="绑定的商户编号" min-width="80" show-overflow-tooltip></el-table-column>
 				<el-table-column sortable prop="shopName" label="商户名称" min-width="80" show-overflow-tooltip></el-table-column>  
  				<el-table-column sortable prop="cdate" label="创建日期" min-width="80" show-overflow-tooltip></el-table-column>
 				<el-table-column sortable label="操作" width="160" fixed="right"  show-overflow-tooltip>
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 AppTpPay app_tp_pay界面-->
			<el-drawer title="修改支付渠道" :visible.sync="editFormVisible"  size="70%"  :close-on-click-modal="false"  append-to-body>
				  <app-tp-pay-edit :app-tp-pay="editForm" :app-mdp-def="appMdpDef" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></app-tp-pay-edit>
			</el-drawer>
	
			<!--新增 AppTpPay app_tp_pay界面-->
			<el-drawer title="新增支付渠道" :visible.sync="addFormVisible"  size="70%"  :close-on-click-modal="false"  append-to-body>
				<app-tp-pay-add :app-tp-pay="addForm" :app-mdp-def="appMdpDef" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></app-tp-pay-add>
			</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listAppTpPay, delAppTpPay, batchDelAppTpPay } from '@/api/mdp/app/appTpPay';
	import  AppTpPayAdd from './AppTpPayAdd';//新增界面
	import  AppTpPayEdit from './AppTpPayEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		props:['appMdpDef','visible'],
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		watch:{
			visible:function(val){
				if(val==true){
					this.searchAppTpPays()
				}
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				appTpPays: [],//查询结果
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
				
				addFormVisible: false,//新增appTpPay界面是否显示
				//新增appTpPay界面初始化数据
				addForm: {
					mdpAppid:'',name:'',logoUrl:'',remark:'',payType:'',deptid:'',branchId:'',cdate:'',cuserid:'',enabled:'',appid:'',payMchid:'',payNotifyUrl:'',openPay:'',payKey:'',ips:'',locationId:'',shopId:'',locationName:'',shopName:'',payAuthId:'',payPubKey:'',tpServiceCharges:'',mdpServiceCharges:'',mdpPayAccountId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑appTpPay界面初始化数据
				editForm: {
					mdpAppid:'',name:'',logoUrl:'',remark:'',payType:'',deptid:'',branchId:'',cdate:'',cuserid:'',enabled:'',appid:'',payMchid:'',payNotifyUrl:'',openPay:'',payKey:'',ips:'',locationId:'',shopId:'',locationName:'',shopName:'',payAuthId:'',payPubKey:'',tpServiceCharges:'',mdpServiceCharges:'',mdpPayAccountId:''
				},
				tableHeight:500,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getAppTpPays();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getAppTpPays();
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
				this.getAppTpPays();
			},
			searchAppTpPays(){
				 this.pageInfo.count=true; 
				 this.getAppTpPays();
			},
			//获取列表 AppTpPay app_tp_pay
			getAppTpPays() {
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
				if(this.appMdpDef){
					params.mdpAppid=this.appMdpDef.mdpAppid
				}
				this.load.list = true;
				listAppTpPay(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.appTpPays = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 AppTpPay app_tp_pay
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 AppTpPay app_tp_pay
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getAppTpPays();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行appTpPay
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除appTpPay
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { payAuthId: row.payAuthId };
					delAppTpPay(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getAppTpPays();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除appTpPay
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelAppTpPay(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getAppTpPays(); 
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
		    'app-tp-pay-add':AppTpPayAdd,
		    'app-tp-pay-edit':AppTpPayEdit,
		     
		    //在下面添加其它组件
		},
		mounted() {    
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.$nextTick(() => {
				this.getAppTpPays();
        	}); 
		}
	}

</script>

<style scoped>

</style>