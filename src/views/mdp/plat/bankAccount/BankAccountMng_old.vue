<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询">
			        <el-button v-loading="load.list" :disabled="load.list==true" @click="searchBankAccounts" icon="el-icon-search">查询</el-button>
			</el-input>
			 <el-button v-loading="load.list" :disabled="load.list==true" @click="searchBankAccounts" icon="el-icon-search">查询</el-button>

			<el-button type="primary" @click="showAdd" icon="el-icon-plus" circle> </el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" circle></el-button>
		</el-row>
		<el-row class="padding-top">
			<!--列表 BankAccount 平台收付款账户-->
			<el-table ref="bankAccount" :data="bankAccounts" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55"></el-table-column>
				<el-table-column sortable type="index" width="55"></el-table-column>
				<el-table-column prop="bankName" label="银行名称" min-width="80" ></el-table-column>
				<el-table-column prop="bankCode" label="银行机构码" min-width="80" ></el-table-column>
				<el-table-column prop="cardAccountId" label="银行卡账户编号" min-width="80" ></el-table-column>
				<el-table-column prop="cardAccountName" label="银行卡账户名称" min-width="80" ></el-table-column>
				<el-table-column prop="subBankName" label="银行分支机构名称" min-width="80" ></el-table-column>
				<el-table-column prop="subBankCode" label="分支机构编码" min-width="80" ></el-table-column>
				<el-table-column prop="ctime" label="新增时间" min-width="80" ></el-table-column>
				<el-table-column prop="ltime" label="更新时间" min-width="80" ></el-table-column>
				<el-table-column prop="opUserid" label="操作用户编号" min-width="80" ></el-table-column>
				<el-table-column prop="opUsername" label="操作用户名称" min-width="80" ></el-table-column>
				<el-table-column prop="status" label="账户状态0无效1有效" min-width="80" ></el-table-column>
				<el-table-column prop="type" label="账户性质0-平台收款" min-width="80" ></el-table-column>
				<el-table-column prop="platformId" label="平台编号" min-width="80" ></el-table-column>
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

			<!--编辑 BankAccount 平台收付款账户界面-->
			<el-drawer title="编辑平台收付款账户" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <bank-account-edit :bank-account="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></bank-account-edit>
			</el-drawer>

			<!--新增 BankAccount 平台收付款账户界面-->
			<el-drawer title="新增平台收付款账户" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<bank-account-add :bank-account="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></bank-account-add>
			</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from '@/api/mdp_pub/mdp_config';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listBankAccount, delBankAccount, batchDelBankAccount } from '@/api/mdp/plat/bankAccount';
	import  BankAccountAdd from './BankAccountAdd';//新增界面
	import  BankAccountEdit from './BankAccountEdit';//修改界面
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
				bankAccounts: [],//查询结果
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
				options:{
					//sex:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增bankAccount界面是否显示
				//新增bankAccount界面初始化数据
				addForm: {
					bankName:'',bankCode:'',cardAccountId:'',cardAccountName:'',subBankName:'',subBankCode:'',ctime:'',ltime:'',opUserid:'',opUsername:'',status:'',type:'',platformId:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑bankAccount界面初始化数据
				editForm: {
					bankName:'',bankCode:'',cardAccountId:'',cardAccountName:'',subBankName:'',subBankCode:'',ctime:'',ltime:'',opUserid:'',opUsername:'',status:'',type:'',platformId:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getBankAccounts();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getBankAccounts();
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
				this.getBankAccounts();
			},
			searchBankAccounts(){
				 this.pageInfo.count=true;
				 this.getBankAccounts();
			},
			//获取列表 BankAccount 平台收付款账户
			getBankAccounts() {
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
					params.key="%"+this.filters.key+"%"
				}

				this.load.list = true;
				listBankAccount(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.bankAccounts = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 BankAccount 平台收付款账户
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 BankAccount 平台收付款账户
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getBankAccounts();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行bankAccount
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除bankAccount
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { cardAccountId: row.cardAccountId };
					delBankAccount(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getBankAccounts();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除bankAccount
			batchDel: function () {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelBankAccount(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getBankAccounts();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/


			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    'bank-account-add':BankAccountAdd,
		    'bank-account-edit':BankAccountEdit,
		},
		mounted() {
			this.$nextTick(() => {
				this.getBankAccounts();
                 var clientRect=this.$refs.bankAccount.$el.getBoundingClientRect();
                var subHeight=70/1000 * window.innerHeight;
                this.maxTableHeight =  window.innerHeight -clientRect.y - this.$refs.bankAccount.$el.offsetTop-subHeight;
        	});
        	/** 举例，
    		listOption([{categoryId:'all',itemCode:'sex'},{categoryId:'all',itemCode:'grade'}] ).then(res=>{
				if(res.data.tips.isOk){
 					this.options=res.data.data
				}
			});
			**/
		}
	}

</script>

<style scoped>
</style>
