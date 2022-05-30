<template>
	<section class="page-container padding">
		<el-row >
			<el-input v-model="filters.key" style="width: 60%;" placeholder="模糊查询"></el-input> 
			<el-button  type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="getShops" icon="el-icon-search"></el-button>
		</el-row>
		<el-row class="padding-top">  
				<el-table :max-height="tableHeight" :data="shops" border  highlight-current-row style="width:100%;"> 
					<el-table-column sortable prop="shopBrand" label="商户名称(点击选中)"   align="center">
						<template scope="scope"> 
							<el-link @click="sureMethod(scope.row)">{{scope.row.shopBrand}}</el-link>
						</template>
					</el-table-column>  
				</el-table>
				<el-pagination style="float:right" layout="total,  prev, pager, next,jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange"
					 :page-sizes="[10,20, 50, 100, 500]" :current-page.sync="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total"></el-pagination>
				 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util'; //全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import {
		listShop
	} from '@/api/mdp/mallm/shop/shop';
	import {
		mapGetters
	} from 'vuex'
	export default {
		computed: {
			...mapGetters([
				'userInfo'
			])
		},
		props: [],
		watch: {},
		data() {
			return {
				filters:{
					key:''
				},
				elRowLoading: false,
				shops: [],
				load:{list:false},
				pageInfo: { //分页数据
					total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。  计算出有多少条记录
					pageSize: 10, //每页数据		每页现实的数据的大小 
					count: false, //是否需要重新计算总记录数  
					pageNum: 1, //当前页码、从1开始计算 
					orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				tableHeight:500,
			}
		}, //end data
		methods: {
			handleCurrentChange(pageNum) { //分页组件的修改当前页数
				this.pageInfo.pageNum = pageNum;
				this.getShops();
			},
			handleSizeChange(pageSize) { //分页组建的修改每页显示的大小
				this.pageInfo.pageSize = pageSize;
				this.getShops();
			},

			getShops() {
				let that = this;
				let params = {
					"pageSize":this.pageInfo.pageSize,
					"pageNum":this.pageInfo.pageNum,
					"count":this.pageInfo.count
				};
				if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) { //获取排序的字段的内容 以及排序的方式 按时间倒叙排序
					let orderBys = [];
					for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
						orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
					}
					params.orderBy = orderBys.join(",") //多个排序字段直接进行拼接的处理
				};
				params.key=this.filters.key
				this.elRowLoading = true;
				listShop(params).then(res => {
					this.elRowLoading = false;
					let tips = res.data.tips;
					if (tips.isOk) {
						this.pageInfo.total=res.data.total;
						this.pageInfo.count=false;
						that.shops = res.data.data;
					}
					this.$notify({
						message: tips.msg,
						type: tips.isOk ? 'success' : 'error'
					});
				}).catch(() => {
					this.elRowLoading = false
				});
			},
			
			sureMethod(row,index){
				this.$emit('row-select',row);
			}
		}, //end methods
		components: {
			 
			//在下面添加其它组件
		},
		mounted() {   
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.getShops();
		}
	}
</script>

<style scoped>

</style>
