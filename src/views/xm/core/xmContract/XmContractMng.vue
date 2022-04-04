<template>
	<section class="page-container  padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="合同名称模糊查询">  
			</el-input>    
			<el-input v-model="filters.htSn" style="width: 20%;" placeholder="合同编号查询">  
			</el-input>    
			<el-input v-model="filters.projectId" v-if="!selProject||!selProject.id" style="width: 20%;" placeholder="项目编号查询">  
			</el-input>  
			<el-input v-model="filters.productId" v-if="!xmProduct||!xmProduct.id" style="width: 20%;" placeholder="产品编号查询">  
			</el-input>   
			<el-input v-model="filters.cpNameKey" style="width: 20%;" placeholder="相对方名称模糊查询">  
			</el-input>  
			<el-button  v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmContracts" icon="el-icon-search"></el-button> 
			<span style="float:right;">
			<el-button type="primary" @click="showAdd" icon="el-icon-plus" round>合同管理</el-button>
			</span>
 		</el-row>
		<el-row class="page-main "> 
			<!--列表 XmContract xm_project_contract-->
			<el-table ref="table" :height="tableHeight" :data="xmContracts" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<!-- ht_contract_card表 -->
				<el-table-column prop="htSn" label="合同编号" min-width="80" ></el-table-column>
				<el-table-column prop="htName" label="合同标题" min-width="80" ></el-table-column>
				<el-table-column prop="htStatus"  label="合同状态" width="100">
					<template slot-scope="scope">
						<span>{{dicts.contractStatus[scope.row.htStatus]?dicts.contractStatus[scope.row.htStatus].name:scope.row.htStatus}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="htTypeName" label="合同类型" min-width="80" ></el-table-column> 
				<el-table-column prop="htPartyName" label="合同签约主体" min-width="80" ></el-table-column>  
        		<el-table-column prop="htSignDate"  label="签订日期" min-width="80"></el-table-column>
				<el-table-column prop="cpName" label="相对方" min-width="80" ></el-table-column>
				<el-table-column prop="cbCenterName" label="合同成本中心" min-width="80" ></el-table-column>
 				<el-table-column prop="htGrossAmount" label="合同金额" min-width="80" ></el-table-column>
				<el-table-column prop="htFzUsername" label="合同跟进人" min-width="80" ></el-table-column> 
				<el-table-column prop="title" label="审批状态" min-width="80">
				<template slot-scope="scope">
					<!--当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除-->
					<el-link>
					<el-tag v-if="scope.row.bizFlowState=='0'" type="primary">初始</el-tag>
					<el-tag v-else-if="scope.row.bizFlowState=='1'" type="primary">审批中</el-tag>
					<el-tag v-else-if="scope.row.bizFlowState=='2'" type="success">已通过</el-tag>
					<el-tag v-else-if="scope.row.bizFlowState=='3'" type="danger">已拒绝</el-tag>
					<el-tag v-else-if="scope.row.bizFlowState=='4'" type="danger">已取消</el-tag>
					{{scope.row.assigneeName}}&nbsp;&nbsp;{{scope.row.commentMsg}}</el-link>
				</template>
				</el-table-column>
				<el-table-column label="操作" width="120" fixed="right"  >
				<template slot-scope="scope">
					<el-button type="primary" @click="showEdit( scope.row,scope.$index)">合同明细</el-button>
				</template>
			</el-table-column> 
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		 

	
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listContractCard } from '@/api/oa/ht/contractCard'; 
	import { mapGetters } from 'vuex';
 	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['selProject','xmProduct'],
		data() {
			return {
				filters: {
					key: '',
					cpNameKey:'',
					htSn:'',
					productId:'',
					projectId:'',
				},
				xmContracts: [],//查询结果
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
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmContract界面是否显示
				//新增xmContract界面初始化数据
				addForm: {
					htId:'',projectId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmContract界面初始化数据
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
				this.getXmContracts();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmContracts();
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
				this.getXmContracts();
			},
			searchXmContracts(){
				 this.pageInfo.count=true; 
				 this.getXmContracts();
			},
			//获取列表 XmContract xm_project_contract
			getXmContracts() {
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
					params.key=this.filters.key
				} 
				if(this.filters.htSn){
					params.htSn=this.filters.htSn
				}
				if(this.filters.cpNameKey){
					params.cpNameKey=this.filters.cpNameKey
				}
				if(this.filters.projectId){
					params.projectId=this.filters.projectId
				}
				if(this.filters.productId){
					params.productId=this.filters.productId
				}  
				if(this.selProject && this.selProject.id){
					params.projectId=this.selProject.id
				}
				if(this.xmProduct && this.xmProduct.id){
					params.productId=this.xmProduct.id
				}
				
				if(!params.projectId && !params.productId && params.htSn){
					this.$notify({position:'bottom-left',showClose:true,message:'项目编号、产品编号、合同编号必须输入一个',type:'error'})
					return;
				}
				this.load.list = true;
				listContractCard(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmContracts = res.data.data;
						console.log(res.data.data);
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmContract xm_project_contract
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				var htRoutePath="/oa/"+process.env.VERSION+"/#/oa/ht/contractCard/detail?htId="+row.htId;
				 window.open(htRoutePath, row.htName,null,true);
        		NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
			},
			//显示新增界面 XmContract xm_project_contract
			showAdd: function () {
				this.addFormVisible = true;
				var htRoutePath="/oa/"+process.env.VERSION+"/#/oa/ht/contractCard/ContractCardMng";
				 window.open(htRoutePath, "合同管理",null,true);
        		NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmContracts();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmContract
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmContract
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { htId: row.htId };
					delXmContract(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmContracts();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmContract
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmContract(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmContracts(); 
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
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
 		    
		    //在下面添加其它组件
		},
		mounted() { 
			initSimpleDicts('all',['costType','amountType','productType','contractStatus']).then(res=>this.dicts=res.data.data); 
			this.$nextTick(() => {
				this.tableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);  
				this.getXmContracts();
        	}); 
		}
	}

</script>

<style scoped>

</style>