<template>
	<section>  
		<el-row class="page-main">   
			<el-table ref="table" :height="maxTableHeight"  stripe :data="xmProjects"  highlight-current-row v-loading="load.list"  @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" >
 				<el-table-column prop="name" label="项目名称" min-width="80" >
					 <template slot-scope="scope">
						 {{scope.row.name}}&nbsp;&nbsp;
						 <font class="align-right"><el-tag :type="scope.row.totalProgress>=100?'success':'warning'">{{parseInt(scope.row.totalProgress)}}%</el-tag></font>
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
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProject,  } from '@/api/xm/core/xmProject';  
	import { mapGetters } from 'vuex' 
	


	export default {  
		props:["xmIteration","xmProduct"],
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
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProject界面是否显示
				//新增xmProject界面初始化数据
				addForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planInnerUserAt:'',planOutUserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planInnerUserPrice:'',budgetOutUserPrice:'',planOutUserCnt:'',planInnerUserCnt:'',planWorkingHours:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				maxTableHeight:300,
				//编辑xmProject界面初始化数据
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planInnerUserAt:'',planOutUserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planInnerUserPrice:'',budgetOutUserPrice:'',planOutUserCnt:'',planInnerUserCnt:'',planWorkingHours:''
				},
 
 
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
			
			//选择行xmProject
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			searchXmProjects(){
				 this.pageInfo.count=true; 
				 this.getXmProjects();
			},
			rowClick(row){
				this.editForm=row;
				this.$emit("row-click",row);
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
				if(this.xmIteration&&this.xmIteration.id){
					params.iterationId=this.xmIteration.id
				}
				if(this.xmProduct&&this.xmProduct.id){
					params.productId=this.xmProduct.id
				}
				params.branchId = this.userInfo.branchId;
				listXmProject(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						console.log(res.data);
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false; 
						this.xmProjects = res.data.data;
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			}, 
			selectProject:function(row){
				this.editForm=row
				this.$emit('project-confirm',this.editForm);
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  
			 
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {  
                
                
                this.maxTableHeight = window.innerHeight - top -100;
				this.showInfo = false;
				this.getXmProjects();
      }); 
		}
	}

</script>


<style scoped> 
.align-right{
	float: right; 
}
</style>