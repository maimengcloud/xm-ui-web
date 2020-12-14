<template>
	<section>
		<sticky :className="'sub-navbar draft'">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" v-on:click="searchBranchs">查询</el-button>
		</sticky>
		<el-row class="app-container"> 
			<!--列表 Branch 管理端机构表（机构下面若干部门）-->
			<el-table :data="branchs" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="id" label="机构编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="branchName" label="机构名称" min-width="80" show-overflow-tooltip></el-table-column> 
				<el-table-column prop="industryCategory" label="行业分类" min-width="80" show-overflow-tooltip></el-table-column> 
				<el-table-column prop="cdate" label="创建日期" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cusername" label="创建人姓名" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="phoneNo" label="联系电话" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="emaill" label="邮件" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="enabled" label="是否启用" min-width="80" show-overflow-tooltip>
						<template slot-scope="scope">
						<el-tag v-if="scope.row.enabled=='1'">√</el-tag>
						<el-tag v-else>×</el-tag>
						</template>
				</el-table-column>
			</el-table>
			<el-pagination size="small" layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listBranch, delBranch, batchDelBranch } from './branch';
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
				branchs: [],//查询结果
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
				
				addFormVisible: false,//新增branch界面是否显示
				//新增branch界面初始化数据
				addForm: {
					id:'',branchName:'',enabled:'',industryCategory:'',cuserid:'',cdate:'',cusername:'',phoneNo:'',emaill:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑branch界面初始化数据
				editForm: {
					id:'',branchName:'',enabled:'',industryCategory:'',cuserid:'',cdate:'',cusername:'',phoneNo:'',emaill:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				userDeptFormVisible:false,	
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getBranchs();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getBranchs();
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
				this.getBranchs();
			},
			searchBranchs(){
				 
				 this.pageInfo.count=true;
				 this.getBranchs();
			},
			//获取列表 Branch 管理端机构表（机构下面若干部门）
			getBranchs() {
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
					params.key="%"+this.filters.key+"%"
				}else{
					//params.xxx=xxxxx
				}
				if( !this.userInfo.isSuperAdmin && !this.userInfo.isPlatformAdmin){
					params.id=this.userInfo.branchId;
				} 
				this.load.list = true;
				listBranch(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;this.pageInfo.count=false;
						this.branchs = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$message({ message: '通讯错误', type: 'error' });
				});
			}, 
			//选择行branch
			selsChange: function (sels) {
				this.sels = sels;
			},  
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'sticky': Sticky
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getBranchs();
        	}); 
			this.load.list=true
			listOption([{categoryId:'all',itemCode:'industryCategory'}]).then(res=>{
				this.load.list=false
				this.options=res.data.data
			}).catch(()=>this.load.list=false);
		}
	}

</script>

<style scoped>

</style>