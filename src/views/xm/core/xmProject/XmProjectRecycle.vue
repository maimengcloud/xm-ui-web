<template>
	<section class="padding">
		<el-row>
			 <el-input v-model="filters.key" style="width:60%;" placeholder="项目名称模糊查询"> 
			</el-input> 
			<el-button @click="searchXmProjects" icon="el-icon-search"></el-button>
		</el-row>
		<el-row class="padding-top">  
			 <el-table  ref="table" border :height="maxTableHeight" v-cloak stripe :data="xmProjects" @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
						<el-table-column  type="index" label="序号" width="80" ></el-table-column>
						<el-table-column prop="id" label="项目编码" min-width="120" ></el-table-column>
						<el-table-column prop="name" label="标题" min-width="200" >
							<template slot-scope="scope">
								<el-link @click.stop="intoInfo(scope.row)">{{scope.row.name}}</el-link>
							</template>
						</el-table-column> 
						<el-table-column prop="totalTaskCnt" label="任务数" min-width="80" ></el-table-column>
						<el-table-column prop="totalCompleteTaskCnt" label="任务完成" min-width="80" ></el-table-column>
						<el-table-column prop="totalFileCnt" label="文档" min-width="80" ></el-table-column>
						<el-table-column prop="totalBugCnt" label="缺陷" min-width="80" ></el-table-column>
						<el-table-column label="进度" min-width="80" >
							<template slot-scope="scope">
								{{scope.row.finishRate}}%
							</template>
						</el-table-column>
						<el-table-column prop="startTime" label="起止时间" min-width="150" >
							<template slot-scope="scope">
								{{scope.row.startTime? scope.row.startTime.substr(0,10) : ""}}~{{scope.row.endTime? scope.row.endTime.substr(0,10) : ""}}
							</template>
						</el-table-column> 
						<el-table-column label="操作" width="120" fixed="right">
							<template slot-scope="scope"> 
								<el-button  type="primary" @click.stop="unDel(scope.row)" >撤销删除</el-button>   
							</template>
						</el-table-column>
					</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row> 
	</section> 

</template>

<script>
	import Vue from 'vue'
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import config from "@/common/config"; //全局公共库
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmProject,unDelXmProject  } from '@/api/xm/core/xmProject';  
	import { mapGetters } from 'vuex' 
	


	export default {  
		computed: {
			...mapGetters([
				'userInfo','roles'
			]), 
		}, 
		data() {
			return {
				filters: {
					key: ''
				},
				xmProjects: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProject界面是否显示
				//新增xmProject界面初始化数据
				addForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planIuserAt:'',planOuserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planIuserPrice:'',budgetOuserPrice:'',planOuserCnt:'',planIuserCnt:'',planWorkingHours:''
				},
				
				editFormVisible: false,//编辑界面是否显示 
				//编辑xmProject界面初始化数据
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planIuserAt:'',planOuserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planIuserPrice:'',budgetOuserPrice:'',planOuserCnt:'',planIuserCnt:'',planWorkingHours:''
				},
				maxTableHeight:300,
 
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjects();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjects();
			},
			
			rowClick: function(row, event, column){ 
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
				this.getXmProjects();
			},
			searchXmProjects(){
				 this.pageInfo.count=true; 
				 this.getXmProjects();
			},
			//获取列表 XmProject xm_project
			getXmProjects() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
				};

				if(this.filters.key){
					params.key='%'+this.filters.key+'%'
				}
				this.load.list = true; 
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				} 
				params.del="1"
				params.branchId = this.userInfo.branchId;
				listXmProject(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						console.log(res.data);
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false; 
						this.xmProjects = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			}, 
			intoInfo(row) { 
				this.$router.push({ name:'XmProjectInfoRoute', params: row })
				//this.showInfo = true;
			},
			unDel: function (row,index) {  
				this.$prompt('将同步恢复计划、组织、任务等，慎重起见，请输入项目代号:'+row.code, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					 if(value==row.code){
						 this.load.del=true;
						let params = { id: row.id };
						unDelXmProject(params).then((res) => {
							this.load.del=false;
							var tips=res.data.tips;
							if(tips.isOk){ 
								this.pageInfo.count=true;
								this.getXmProjects();
							}
							this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
						}).catch( err  => this.load.del=false ); 
					 }else{
						 this.$notify({position:'bottom-left',showClose:true,message: "项目代号不正确", type: 'error' }); 
					 }
				}).catch(() => { 
					return;    
				});
 
					
			},
			//选择行xmProject
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  
			 
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => { 
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el);
				this.showInfo = false;
				this.getXmProjects();
      }); 
		}
	}

</script>

<style scoped> 
</style>