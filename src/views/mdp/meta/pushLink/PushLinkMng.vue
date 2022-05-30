<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchPushLinks" icon="el-icon-search">查询</el-button>
			<el-button type="primary" @click="showAdd" icon="el-icon-plus"> </el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
		</el-row>
		<el-row class="padding-top">
			<!--列表 PushLink 发布关联，管理端客户管理界面只能看到发布到各自平台的字典-->
			<el-table ref="pushLinkTable" :data="pushLinks" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55"></el-table-column>
				<el-table-column sortable type="index" width="55"></el-table-column>
				<el-table-column prop="itemId" label="item_id" min-width="80" ></el-table-column>
				<el-table-column prop="targetId" label="发布到目标编号" min-width="80" ></el-table-column>
				<el-table-column prop="ptime" label="发布时间" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="120" fixed="right">
				    <template slot="header">
                        <el-button @click="showAdd" icon="el-icon-plus" circle> </el-button>
                    </template>
					<template scope="scope">
						<el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 PushLink 发布关联，管理端客户管理界面只能看到发布到各自平台的字典界面-->
			<el-drawer title="编辑发布关联，管理端客户管理界面只能看到发布到各自平台的字典" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <push-link-edit :push-link="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></push-link-edit>
			</el-drawer>
	
			<!--新增 PushLink 发布关联，管理端客户管理界面只能看到发布到各自平台的字典界面-->
			<el-drawer title="新增发布关联，管理端客户管理界面只能看到发布到各自平台的字典" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<push-link-edit :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></push-link-edit>
			</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { dicts } from '@/api/mdp/meta/item';//字典表
	import { listPushLink, delPushLink, batchDelPushLink } from '@/api/mdp/meta/pushLink';
	import  PushLinkEdit from './PushLinkEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default {
		components: {
		    PushLinkEdit,
		},
		props:[],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{

		},
		data() {
			return {
				filters: {
					key: ''
				},
				pushLinks: [],//查询结果
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
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 [{id:'',itemCode:'',itemName:'',itemType:'',values:'',names:'','options':[{id:'1',name:'男'},{id:'2',name:'女'}]}]
				addFormVisible: false,//新增pushLink界面是否显示
				//新增pushLink界面初始化数据
				addForm: {
					itemId:'',targetId:'',ptime:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑pushLink界面初始化数据
				editForm: {
					itemId:'',targetId:'',ptime:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getPushLinks();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getPushLinks();
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
				this.getPushLinks();
			},
			searchPushLinks(){
				 this.pageInfo.count=true; 
				 this.getPushLinks();
			},
			//获取列表 PushLink 发布关联，管理端客户管理界面只能看到发布到各自平台的字典
			getPushLinks() {
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
				listPushLink(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.pushLinks = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 PushLink 发布关联，管理端客户管理界面只能看到发布到各自平台的字典
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 PushLink 发布关联，管理端客户管理界面只能看到发布到各自平台的字典
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getPushLinks();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行pushLink
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除pushLink
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { itemId: row.itemId };
					delPushLink(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getPushLinks();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除pushLink
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelPushLink(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getPushLinks(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },
			//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 [{id:'',itemCode:'',itemName:'',itemType:'',values:'',names:'','options':[{id:'1',name:'男'},{id:'2',name:'女'}]}]
            initDicts(categoryId,itemCodes){
                dicts({categoryId:categoryId,itemCodes:itemCodes}).then(res=>{
                    if(res.data.tips.isOk){
                        var data=res.data.data
                        data.forEach(dict=>{
                            if(dict.options){
                                dict.options=JSON.parse(dict.options)
                            }else{
                               dict.options=[]
                            }
                            this.dicts[dict.itemCode]=dict
                        })
                    }
                });
            },
			/**begin 自定义函数请在下面加**/
			
		},//end methods
		mounted() {
		    //this.initDicts('all',['sex','gradeLvl']);
			this.$nextTick(() => {
				this.getPushLinks();
				if(this.$refs.pushLinkTable){
				    var clientRect=this.$refs.pushLinkTable.$el.getBoundingClientRect();
                    var subHeight=70/1000 * window.innerHeight;
                    this.maxTableHeight =  window.innerHeight -clientRect.y - this.$refs.pushLinkTable.$el.offsetTop-subHeight;
				}
				this.initData()
        	});
		}
	}

</script>

<style scoped>
</style>