<template>
	<section>
		<el-row  class="app-container">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" v-on:click="searchAppTpAuths" icon="el-icon-search"></el-button>
			<el-button type="primary" v-if="appMdpDef" @click="showAdd" icon="el-icon-plus">关联第三方应用</el-button>
 		</el-row>
		<el-row class="app-container"> 
			<!--列表 AppTpAuth MDP平台应用与第三方应用关系-->
			<el-table :max-height="tableHeight" :data="appTpAuths"  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				<el-table-column sortable type="index" width="50"></el-table-column>  
				<el-table-column sortable v-if="!appMdpDef" prop="mdpAppid" label="MDP应用编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="authId" label="授权编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="appid" label="第三方应用编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="name" label="第三方应用名称" min-width="80" show-overflow-tooltip></el-table-column>  
				<el-table-column sortable prop="bizType" label="第三方应用分类" min-width="80" show-overflow-tooltip>
					
				</el-table-column>  
				<el-table-column sortable prop="cdate" label="创建日期" min-width="80" show-overflow-tooltip></el-table-column>  
				<el-table-column sortable prop="enabled" label="上架" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-tag v-if="scope.row.enabled=='1'">√</el-tag>
						<el-tag v-else>×</el-tag>
					</template>
				</el-table-column>
				<el-table-column sortable prop="openPay" label="开通支付" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-tag v-if="scope.row.openPay=='1'">√</el-tag>
						<el-tag v-else>×</el-tag>
					</template>				
				</el-table-column> 
				<el-table-column sortable label="操作" width="150" fixed="right">
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 AppTpAuth MDP平台应用与第三方应用关系界面-->
			<el-drawer title="编辑授权" :visible.sync="editFormVisible"  size="70%"  :close-on-click-modal="false"  append-to-body>
				  <app-tp-auth-edit  :app-tp-auth="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></app-tp-auth-edit>
			</el-drawer>
	
			<!--新增 AppTpAuth MDP平台应用与第三方应用关系界面-->
			<el-drawer title="新增授权" :visible.sync="addFormVisible"  size="70%"  :close-on-click-modal="false"  append-to-body>
				<app-tp-auth-add :app-mdp-def="appMdpDef" :app-tp-auth="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></app-tp-auth-add>
			</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listAppTpAuth, delAppTpAuth, batchDelAppTpAuth } from '@/api/mdp/app/appTpAuth';
	import  AppTpAuthAdd from './AppTpAuthAdd';//新增界面
	import  AppTpAuthEdit from './AppTpAuthEdit';//修改界面
	import { listAppBizType  } from '@/api/mdp/app/appBizType';
	
	import { mapGetters } from 'vuex'
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['appMdpDef','visible'],
		watch:{
			visible:function(val){
				if(val==true){
					this.searchAppTpAuths()
				}
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				appTpAuths: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增appTpAuth界面是否显示
				//新增appTpAuth界面初始化数据
				addForm: {
					mdpAppid:'',name:'',logoUrl:'',remark:'',bizType:'',deptid:'',branchId:'',appToken:'',loginUrl:'',authId:'',cdate:'',cuserid:'',appSecret:'',authUrl:'',authPattern:'',encKey:'',enabled:'',appid:'',payMchid:'',payNotifyUrl:'',openPay:'',payKey:'',msgNotifyUrl:'',ips:'',locationId:'',shopId:'',locationName:'',shopName:'',multiLoca:''
						},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑appTpAuth界面初始化数据
				editForm: {
					mdpAppid:'',name:'',logoUrl:'',remark:'',bizType:'',deptid:'',branchId:'',appToken:'',loginUrl:'',authId:'',cdate:'',cuserid:'',appSecret:'',authUrl:'',authPattern:'',encKey:'',enabled:'',appid:'',payMchid:'',payNotifyUrl:'',openPay:'',payKey:'',msgNotifyUrl:'',ips:'',locationId:'',shopId:'',locationName:'',shopName:'',multiLoca:''
						},
				/**begin 自定义属性请在下面加 请加备注**/
				appBizTypes:[],
				tableHeight:500,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getAppTpAuths();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getAppTpAuths();
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
				this.getAppTpAuths();
			},
			searchAppTpAuths(){
				 
				 this.pageInfo.count=true;
				 this.getAppTpAuths();
			},
			//获取列表 AppTpAuth MDP平台应用与第三方应用关系
			getAppTpAuths() {
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
				if(this.filters.key!==""){
					params.key='%'+this.filters.key+'%'
				}else{
					//params.xxx=xxxxx
				}
				if(this.appMdpDef){
					params.mdpAppid=this.appMdpDef.mdpAppid
				}
				this.load.list = true;
				listAppTpAuth(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;this.pageInfo.count=false;
						this.appTpAuths = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$notify({ message: '通讯错误', type: 'error' });
				});
			},

			//显示编辑界面 AppTpAuth MDP平台应用与第三方应用关系
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 AppTpAuth MDP平台应用与第三方应用关系
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getAppTpAuths();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行appTpAuth
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除appTpAuth
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = row;
					delAppTpAuth(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getAppTpAuths();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					});
				}).catch(() =>this.load.del=false);
			},
			//批量删除appTpAuth
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelAppTpAuth(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getAppTpAuths(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => this.load.del=false );
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'app-tp-auth-add':AppTpAuthAdd,
		    'app-tp-auth-edit':AppTpAuthEdit,
		     
		    //在下面添加其它组件
		},
		mounted() {    
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.$nextTick(() => {
				this.getAppTpAuths();
        	}); 
			listAppBizType().then(res=>{
				this.appBizTypes=res.data.data
			})
			listOption([{categoryId:'all',itemCode:'tpAppCategory'}]).then(res=>{
				this.options=res.data.data
			});	
		}
	}

</script>

<style scoped>

</style>