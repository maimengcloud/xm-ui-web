<template>
	<section> 
		<el-row   class="xm-kpi">
			<el-menu active-text-color="#00abfc" :default-active="selkey" @select="searchXmProjectKpis" class="el-menu-demo" mode="horizontal">
				<el-menu-item   index="currentKpi">当前指标</el-menu-item> 
				<el-menu-item   index="hisKpi">历史考核</el-menu-item>  
				<div style="line-height:50px;float:right;margin-right:10px;"> 
					<el-button @click="showAdd" type="plian">新建指标</el-button>
				</div>
			</el-menu>  
			<!--列表 XmProjectKpi xm_project_kpi-->
			<el-table ref="table" :height="tableHeight" :data="xmProjectKpis" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="index" width="40"></el-table-column> 
				<el-table-column prop="kpiName" label="指标名称" min-width="80" ></el-table-column>
				<el-table-column prop="minValue" label="正常值范围" min-width="80" >
					<template slot-scope="scope">
						<el-tag>{{scope.row.minValue}}~{{scope.row.maxValue}}</el-tag>
					</template>
				</el-table-column>   
				<el-table-column prop="kpiValue" label="kpi当前值" min-width="80" >
					<template slot-scope="scope">
						<el-tag type= 'danger' v-if="scope.row.minValue > scope.row.kpiValue">{{scope.row.kpiValue}}，异常，小于最小值</el-tag>
						<el-tag type= 'danger' v-else-if="scope.row.maxValue < scope.row.kpiValue">{{scope.row.kpiValue}} 异常，大于最大值</el-tag>
						<el-tag type= 'success' v-else>{{scope.row.kpiValue}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="score" label="得分0~10分" min-width="80" ></el-table-column>
				<el-table-column prop="scoreDate" label="评分日期" min-width="80" ></el-table-column>  
				<el-table-column prop="remark" label="备注" min-width="80" ></el-table-column>
				<el-table-column prop="calcType" label="考核方式" min-width="80" > 
					<template slot-scope="scope">
						<el-tag type= 'info' v-if="scope.row.calcType == '0' ">每月考核</el-tag>
						<el-tag type= 'info' v-if="scope.row.calcType == '1' ">每季考核</el-tag>
						<el-tag type= 'info' v-if="scope.row.calcType == '2' ">半年考核</el-tag>
						<el-tag type= 'info' v-if="scope.row.calcType == '3' ">每年考核</el-tag> 
					</template>
				</el-table-column>
				<el-table-column prop="nextCalcDate" label="下次考核" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">打分</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmProjectKpi xm_project_kpi界面-->
			<el-drawer title="编辑xm_project_kpi" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
					<xm-project-kpi-edit :xm-project-kpi="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-kpi-edit>
			</el-drawer>

			<!--新增 XmProjectKpi xm_project_kpi界面-->
			<el-drawer title="新增xm_project_kpi" :visible.sync="addFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				<xm-project-kpi-add :xm-project-kpi="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-project-kpi-add>
			</el-drawer>  
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmProjectKpi, delXmProjectKpi, batchDelXmProjectKpi } from '@/api/xm/core/xmProjectKpi';
	import  XmProjectKpiAdd from './XmProjectKpiAdd';//新增界面
	import  XmProjectKpiEdit from './XmProjectKpiEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props: ['selProject'],
		data() {
			return {
				filters: {
					key: ''
				},
				xmProjectKpis: [],//查询结果
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
				
				addFormVisible: false,//新增xmProjectKpi界面是否显示
				//新增xmProjectKpi界面初始化数据
				addForm: {
					projectId:'',branchId:'',kpiIndex:'',kpiName:'',maxValue:'',minValue:'',id:'',score:'',scoreDate:'',bizFlowState:'',bizProcInstId:'',kpiValue:'',remark:'',calcType:'',nextCalcDate:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectKpi界面初始化数据
				editForm: {
					projectId:'',branchId:'',kpiIndex:'',kpiName:'',maxValue:'',minValue:'',id:'',score:'',scoreDate:'',bizFlowState:'',bizProcInstId:'',kpiValue:'',remark:'',calcType:'',nextCalcDate:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				
				tableHeight:300,	
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectKpis();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectKpis();
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
				this.getXmProjectKpis();
			},
			searchXmProjectKpis(){
				 this.pageInfo.count=true; 
				 this.getXmProjectKpis();
			},
			//获取列表 XmProjectKpi xm_project_kpi
			getXmProjectKpis() {
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
				this.load.list = true;
				if(this.selProject!=null && this.selProject != undefined ){
					params.projectId=this.selProject.id
				}else{{
					return;
				}}
				listXmProjectKpi(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectKpis = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectKpi xm_project_kpi
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProjectKpi xm_project_kpi
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjectKpis();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProjectKpi
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProjectKpi
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmProjectKpi(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProjectKpis();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProjectKpi
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProjectKpi(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectKpis(); 
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
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
		    'xm-project-kpi-add':XmProjectKpiAdd,
		    'xm-project-kpi-edit':XmProjectKpiEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				
				
				
				this.tableHeight =  util.calcTableMaxHeight(".el-table"); 
				this.getXmProjectKpis();
        	}); 
		}
	}

</script>

<style scoped>
.xm-kpi{
	width: 100%;
}
.xm-kpi>.el-menu-demo{
	height: 50px;
	background: #fafbfc;
}
.xm-kpi>.el-menu-demo>li{
	height: 100%;
	line-height: 50px;
	color: #303133;
}
.xm-kpi>.el-menu-demo>li:hover{
	background: transparent;
}
.xm-kpi>.el-menu-demo>.is-active{
	background: transparent;
}
</style>