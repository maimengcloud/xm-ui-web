<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询">
				<template slot="append">
					<el-button  v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectContracts" icon="el-icon-search"></el-button>
				</template>
			</el-input> 
			
			<el-button type="primary" @click="showAdd" icon="el-icon-plus">添加合同</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true"  icon="el-icon-delete">批量删除</el-button> 
		</el-row>
		<el-row class="page-main page-height-90"> 
			<!--列表 XmProjectContract xm_project_contract-->
			<el-table ref="table" :height="tableHeight" :data="xmProjectContracts" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<!-- ht_contract_card表 -->
				<el-table-column prop="htSn" label="合同编号" min-width="80" ></el-table-column>
				<el-table-column prop="htName" label="合同标题" min-width="80" ></el-table-column>
				<el-table-column prop="typeName" label="合同类型" min-width="80" ></el-table-column>
				<el-table-column prop="cpName" label="合同对象" min-width="80" ></el-table-column>
				<el-table-column prop="htGrossAmount" label="合同金额" min-width="80" ></el-table-column>
				<el-table-column prop="htFzUsername" label="合同跟进人" min-width="80" ></el-table-column>
				<el-table-column prop="" label="关联客户" min-width="80" ></el-table-column>
				<el-table-column prop="projectName" label="关联项目" min-width="80" ></el-table-column>
				<!-- <el-table-column prop="projectId" label="项目编号" min-width="80" ></el-table-column> -->
				<!-- <el-table-column label="操作" width="50" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmProjectContract xm_project_contract界面-->
			<el-drawer title="编辑合同" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-project-contract-edit :xm-project-contract="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-contract-edit>
			</el-drawer>

	
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectContract, delXmProjectContract, batchDelXmProjectContract } from '@/api/xm/core/xmProjectContract';
	import  XmProjectContractAdd from './XmProjectContractAdd';//新增界面
	import  XmProjectContractEdit from './XmProjectContractEdit';//修改界面
	import { mapGetters } from 'vuex';
 	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['selProject'],
		data() {
			return {
				filters: {
					key: ''
				},
				xmProjectContracts: [],//查询结果
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
				
				addFormVisible: false,//新增xmProjectContract界面是否显示
				//新增xmProjectContract界面初始化数据
				addForm: {
					htId:'',projectId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectContract界面初始化数据
				editForm: {
					htId:'',projectId:''
				},

				detailFormVisible: false,//编辑界面是否显示
				
				//编辑contractCard界面初始化数据
				detailForm: {
					htId:'',draftId:'',cpId:'',cpName:'',linkName:'',linkPhone:'',cpAddress:'',cpOpenBank:'',cpBankAccount:'',htName:'',htSn:'',htGrossAmount:'',htKaiPiaoAmount:'',htReceivedAmount:'',htReceivableAmount:'',htPayedAmount:'',htPayableAmount:'',htFile:'',htEffectDate:'',htFzUserid:'',htFzUsername:'',htParentType:'',htType:'',htSignDate:'',htExpireDate:'',htStatus:'',htDemand:'',htParty:'',htPartyName:'',htImportantClause:'',branchId:'',createTime:'',createUserId:'',createUserName:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				tableHeight:300,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectContracts();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectContracts();
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
				this.getXmProjectContracts();
			},
			searchXmProjectContracts(){
				 this.pageInfo.count=true; 
				 this.getXmProjectContracts();
			},
			//获取列表 XmProjectContract xm_project_contract
			getXmProjectContracts() {
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
				params.projectId = this.selProject.id;
				this.load.list = true;
				listXmProjectContract(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectContracts = res.data.data;
						console.log(res.data.data);
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectContract xm_project_contract
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProjectContract xm_project_contract
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjectContracts();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProjectContract
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProjectContract
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { htId: row.htId };
					delXmProjectContract(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProjectContracts();
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProjectContract
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProjectContract(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectContracts(); 
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.detailFormVisible = true;
				this.detailForm = Object.assign({}, row);
				// this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			afterDetailSubmit() {
				this.detailFormVisible = false;
			},
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-project-contract-add':XmProjectContractAdd,
				'xm-project-contract-edit':XmProjectContractEdit,
 		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				
				
				
				this.tableHeight =  util.calcTableMaxHeight('el-table'); 
				this.getXmProjectContracts();
        	}); 
		}
	}

</script>

<style scoped>

</style>