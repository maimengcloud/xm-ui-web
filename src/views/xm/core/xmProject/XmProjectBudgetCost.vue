<template>
	<section>
		<el-row class="xm-budget">
			<div class="title-bar">
				<el-radio-group v-model="costShow" size="medium">
					<el-radio-button label="预算清单"></el-radio-button>
					<el-radio-button label="预算统计"></el-radio-button>
				</el-radio-group>
				<span style="margin-left:10px;font-size:14px;">项目总预算：</span> <el-tag type="success">{{projectInfoBudget.planTotalCost}}</el-tag>
				<span style="margin-left:10px;font-size:14px;">非人力总预算：</span><el-tag>{{projectInfoBudget.planNouserAt}}</el-tag>
				<span style="margin-left:10px;font-size:14px;">内部人力总预算：</span><el-tag>{{projectInfoBudget.planIuserAt}}</el-tag>
				<span style="margin-left:10px;font-size:14px;">外购人力总预算：</span><el-tag>{{projectInfoBudget.planOuserAt}}</el-tag>
			</div>
			<div class="title-bar">
				<el-radio-group v-model="showType" size="medium">
					<el-radio-button label="人力"></el-radio-button>
					<el-radio-button label="非人力"></el-radio-button>
				</el-radio-group>
			</div>
			<div v-if="costShow == '预算统计'">
				<el-date-picker style="padding:10px;width:120px;" v-model="selYear" value-format="yyyy" type="year" placeholder="年份" :clearable="false"></el-date-picker>
				<!-- <el-select style="height:50px;padding:10px;width:120px;" v-model="selYear" placeholder="年份">
					<el-option
						v-for="item in subjectYearList"
						:key="item"
						:label="item"
						:value="item">
					</el-option>
				</el-select> -->
				<el-table
					ref="table"
					v-adaptive="{bottomOffset:30}"
					v-if="showType == '人力'"
					:data="sumXmBudgetLaborsConvert"
					highlight-current-row
					v-loading="load.list"
					border>
					<el-table-column prop="subjectId" label="科目" min-width="100" >
						<template slot-scope="scope">
							<a    style="text-decoration:underline;margin-right:5px;"  @click="showCostUserDetails(scope.row,'subjectId','queryBySubjectId')">{{scope.row.subjectId}}</a>
						</template>
					</el-table-column>
					<el-table-column prop="username" label="姓名" min-width="100" >
						<template slot-scope="scope">
							<a    style="text-decoration:underline;margin-right:5px;"  @click="showCostUserDetails(scope.row,'username','queryByUsername')">{{scope.row.username}}</a>
						</template>

					</el-table-column>
					<!-- <el-table-column  min-width="100" ></el-table-column> -->
					<el-table-column :prop="month" v-for="month in selYearMonths" :key="month" :label="month" width="100">
						<template slot-scope="scope">
							<a    style="text-decoration:underline;margin-right:5px;"  @click="showCostUserDetails(scope.row,month,'queryByBizzMonth')">{{scope.row[month]}}</a>
						</template>
					</el-table-column>
					<el-table-column prop="monthsSum" label="合计" min-width="80">
					</el-table-column>
				</el-table>

				<el-table
					ref="table"
					v-adaptive="{bottomOffset:30}"
					v-if="showType == '非人力'"
					:data="sumXmBudgetNlaborsConvert"
					highlight-current-row
					v-loading="load.list"
					border
					style="width: 100%;height:720px;overflow-y:auto;">
					<el-table-column prop="subjectId" label="科目" min-width="100" >
						<template slot-scope="scope">
							<a    style="text-decoration:underline;margin-right:5px;"  @click="showCostNouserDetails(scope.row,'subjectId','queryBySubjectId')">{{scope.row.subjectId}}</a>
						</template>
					</el-table-column>
					<el-table-column prop="username" label="姓名" min-width="100" >
						<template slot-scope="scope">
							<a    style="text-decoration:underline;margin-right:5px;"  @click="showCostNouserDetails(scope.row,'username','queryByUsername')">{{scope.row.username}}</a>
						</template>

					</el-table-column>
					<!-- <el-table-column  min-width="100" ></el-table-column> -->
					<el-table-column :prop="month" v-for="month in selYearMonths" :key="month" :label="month" width="100">
						<template slot-scope="scope">
							<a    style="text-decoration:underline;margin-right:5px;"  @click="showCostNouserDetails(scope.row,month,'queryByBizzMonth')">{{scope.row[month]}}</a>
						</template>
					</el-table-column>
					<el-table-column prop="monthsSum" label="合计" min-width="80">
					</el-table-column>
				</el-table>
			</div>

			<div v-else>
				<xm-budget-labor v-if="showType == '人力'" :sel-project="projectInfo"></xm-budget-labor>
				<xm-budget-nlabor v-else  :sel-project="projectInfo"></xm-budget-nlabor>
			</div>
			<el-drawer title="查看人力预算明细" :visible.sync="xmBudgetLaborVisible"  fullscreen  append-to-body   :close-on-click-modal="false">
				<xm-budget-labor :xm-budget-labor="xmBudgetLabor" :visible="xmBudgetLaborVisible" :field-name="fieldName" :query-type="queryType" :sel-project="projectInfo"></xm-budget-labor>
			</el-drawer>
			<el-drawer title="查看非人力预算明细" :visible.sync="xmBudgetNlaborVisible"  fullscreen  append-to-body   :close-on-click-modal="false">
				<xm-budget-nlabor :xm-budget-nlabor="xmBudgetNlabor" :visible="xmBudgetNlaborVisible" :field-name="fieldName" :query-type="queryType" :sel-project="projectInfo"></xm-budget-nlabor>
			</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { mapGetters } from 'vuex';
	import { editBudget } from '@/api/xm/core/xmProject';
	import { listSumXmBudgetLabor } from '@/api/xm/core/xmBudgetLabor';
	import { listSumXmBudgetNlabor } from '@/api/xm/core/xmBudgetNlabor';
	import xmBudgetLabor from '../xmBudgetLabor/XmBudgetLaborMng';
	import xmBudgetNlabor from '../xmBudgetNlabor/XmBudgetNlaborMng';

	export default {
		computed: {
			...mapGetters([
				'userInfo','roles','projectInfo'
			]),
			selYearMonths:function(){
				var selYear=this.selYear;
				var yearMonths=[selYear+'-01',selYear+'-02',selYear+'-03',selYear+'-04',selYear+'-05',selYear+'-06',selYear+'-07',selYear+'-08',selYear+'-09',selYear+'-10',selYear+'-11',selYear+'-12']
				return yearMonths;
			},
			sumXmBudgetLaborsConvert:function(){
				var map={};
				var secMap={};
				this.sumXmBudgetLabors.forEach(i=>{
					i.key=i.projectId+"_"+i.subjectId+"_"+i.userid+"_"+i.username;
					i.monthKey=i.key+"_"+i.bizzMonth;
					secMap[i.monthKey]=i;
					map[i.key]=i;
				});
				var list=[];
				for(var key in map){
					var row=map[key];
					var monthsSum=0;
					this.selYearMonths.forEach(i=>{
						var val=secMap[key+"_"+i];
						if( val !=null && val !=undefined ){
							row[i]=val.budgetCost;
						}else{
							row[i]=0;
						}
						monthsSum=monthsSum+row[i]
					});
					row['monthsSum']=monthsSum;
					list.push(row);
				}
				return list;
			},
			sumXmBudgetNlaborsConvert:function(){
				var map={};
				var secMap={};
				this.sumXmBudgetNlabors.forEach(i=>{
					i.key=i.projectId+"_"+i.subjectId;
					i.monthKey=i.key+"_"+i.bizzMonth;
					secMap[i.monthKey]=i;
					map[i.key]=i;
				});
				var list=[];
				for(var key in map){
					var row=map[key];
					var monthsSum=0;
					this.selYearMonths.forEach(i=>{
						var val=secMap[key+"_"+i];
						if( val !=null && val !=undefined ){
							row[i]=val.budgetCost;
						}else{
							row[i]=0;
						}
						monthsSum=monthsSum+row[i]
					});
					row['monthsSum']=monthsSum;
					list.push(row);
				}
				return list;
			}
		},
		watch: {
			'showType': function(val) {
				if(val == "人力"){
					this.listSumXmBudgetLabor();
				}
				else{
					this.listSumXmBudgetNlabor();
				}
			},
			'projectInfo': function(projectInfo){
				 this.projectInfoBudget=Object.assign({},this.projectInfo);
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				screenData: [],//查询结果
				load:{ list: false, edit: false, del: false, add: false },//查询中...

				/**begin 自定义属性请在下面加 请加备注**/
				subjects: [],
				costShow: "预算统计",
				selYear: ""+new Date().getFullYear(),
				showType: "",
				xmBudgetLabors: [],
				xmBudgetNlabors: [],
				projectInfoBudget:{},
				sumXmBudgetLabors:[],
				xmBudgetLabor:null,
				fieldName:'',
				queryType:'',
				xmBudgetLaborVisible:false,
				sumXmBudgetNlabors:[],
				xmBudgetNlabor:null,
				xmBudgetNlaborVisible:false,
				tableHeight:300,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {

			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},

			listSumXmBudgetLabor:function(){
				var parmas={
					projectId:this.projectInfo.id,
				}
				listSumXmBudgetLabor(parmas).then(res=>{
					this.sumXmBudgetLabors=res.data.data;
				})
			},

			listSumXmBudgetNlabor:function(){
				var parmas={
					projectId:this.projectInfo.id,
				}
				listSumXmBudgetNlabor(parmas).then(res=>{
					this.sumXmBudgetNlabors=res.data.data;
				})
			},
			showCostUserDetails:function(row,fieldName,queryType){
				this.xmBudgetLabor=row
				this.fileName=fieldName
				this.queryType=queryType
				this.xmBudgetLaborVisible=true;
			},
			showCostNouserDetails:function(row,fieldName,queryType){
				this.xmBudgetNlabor=row
				this.fileName=fieldName
				this.queryType=queryType
				this.xmBudgetNlaborVisible=true;
			},
			/**begin 自定义函数请在下面加**/
			// inputChange() {
			// 	this.projectInfo.planTotalCost = this.projectInfo.planTotalCost.replace(/[^\d.]/g,"").replace(/^\./g,"").replace(/\.{1,}/g,".");
			// },
			updateBudget() {
				if(this.projectInfo.planTotalCost==undefined){
					this.$notify({position:'bottom-left',showClose:true,message:"不允许修改", type:  'success'});
					return;
				}
				var planTotalCost=this.getFloatValue(this.projectInfoBudget.planTotalCost)
				var planIuserAt=this.getFloatValue(this.projectInfoBudget.planIuserAt)
				var planOuserAt=this.getFloatValue(this.projectInfoBudget.planOuserAt)
				var planNouserAt=this.getFloatValue(this.projectInfoBudget.planNouserAt)
				this.projectInfoBudget.planTotalCost=planIuserAt+planOuserAt+planNouserAt
				this.$confirm('确定修改项目总预算吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.edit = true;
					let params = this.projectInfoBudget
					editBudget(params).then((res) => {
						var tips=res.data.tips;
						if(tips.isOk){
							this.projectInfo.planTotalCost=this.projectInfoBudget.planTotalCost
							this.projectInfo.planIuserAt=this.projectInfoBudget.planIuserAt
							this.projectInfo.planOuserAt=this.projectInfoBudget.planOuserAt
							this.projectInfo.planNouserAt=this.projectInfoBudget.planNouserAt
						}else{
							this.projectInfoBudget=Object.assign({},this.projectInfo)
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
						this.load.edit = false;
					}).catch( err => this.load.edut = false );
				}).catch(() => {
					this.projectInfoBudget=Object.assign({},this.projectInfo)
				});
			},

			getFloatValue(value,digit){
				if(value==null ||  value=='' || value==undefined){
					value=0;
				}
				return parseFloat(value);
			},
			/**end 自定义函数请在上面加**/
		},//end methods
		components: {
			xmBudgetLabor,
			xmBudgetNlabor,
				//在下面添加其它组件
		},
		mounted() {
			this.showType = "人力";
			this.$nextTick(() => {
				this.tableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);
			});
			  this.projectInfoBudget=Object.assign({},this.projectInfo);
		}
	}

</script>

<style scoped>
.xm-budget{
	width: 100%;
}
.title-bar{
	padding:7px 10px;
	height: 50px;
	background: #fafbfc;
	border-bottom: 1px solid #efefef;
}
/* .title-bar>button{
	float:right;
} */
.fs-ft{
	font-size: 14px !important;
}
.xm-budget .el-form-item{
	padding: 0 10px;
}
.xm-budget >>> input[type="number"]{
	padding-left: 5px;
	padding-right: 0;
}
/* .xm-budget >>> .headBorder:first-child, */
.xm-budget >>> .headBorder:nth-last-child(3){
	border-right: 0 !important;
}
.xm-budget .title-bar >>> .el-radio-button__inner{
	padding: 10px 15px;
	background: transparent;
	border: 0;
	border-radius: 0;
	box-shadow: 0 0 0 0 !important;
}
.xm-budget .title-bar .is-active >>> .el-radio-button__inner{
	color: #409EFF !important;
	border: 1px solid #409EFF;
}
.xm-budget>.el-table::before{
	height: 0;
}
/* 超过宽度则用...代替 */
.truncate{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
