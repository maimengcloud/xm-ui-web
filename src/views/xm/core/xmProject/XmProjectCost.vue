<template>
	<section>
		<el-row class="xm-cost">
			<div class="title-bar">
				<el-radio-group v-model="costShow" size="medium">
					<el-radio-button label="支出清单"></el-radio-button>
					<el-radio-button label="支出统计"></el-radio-button>
				</el-radio-group>
			</div>
			<div class="title-bar">
				<el-radio-group v-model="showType" size="medium">
					<el-radio-button label="人力"></el-radio-button>
					<el-radio-button label="非人力"></el-radio-button>
				</el-radio-group>
			</div>
			<div v-if="costShow == '支出统计'">
				<el-row>
					<el-date-picker style="padding:10px;width:120px;" v-model="selYear" value-format="yyyy" type="year" placeholder="统计年份" :clearable="false"></el-date-picker>
					<el-select  v-model="rptType" placeholder="统计类型">
						<el-option  label="统计本企业每月支出金额" value="1"> </el-option>
						<el-option  label="统计项目每月支出金额" value="2"> </el-option>
						<el-option  label="统计项目成员每月支出金额" value="3"> </el-option>
					</el-select>
				</el-row>
				<el-table ref="table"
					:height="maxTableHeight"
					v-if="showType == '人力'"
					:data="sumXmCostLaborsConvert"
					highlight-current-row
					v-loading="load.list"
					border>
					<el-table-column prop="username" label="成员姓名" min-width="100" v-if="rptType==='3'">
						<template slot-scope="scope">
							<a    style="text-decoration:underline;margin-right:5px;"  @click="showXmCostLaborDetails(scope.row,'username','queryByBizUserid')">{{scope.row.username}}</a>
						</template>

					</el-table-column>
					<el-table-column prop="projectId" label="项目编号" min-width="100" v-if="rptType==='2'">
						<template slot-scope="scope">
							<a    style="text-decoration:underline;margin-right:5px;"  @click="showXmCostLaborDetails(scope.row,'projectId','queryByProjectId')">{{scope.row.projectId}}</a>
						</template>

					</el-table-column>
					<el-table-column prop="branchId" label="企业编号" min-width="100" v-if="rptType==='1'">
						<template slot-scope="scope">
							<a    style="text-decoration:underline;margin-right:5px;"  @click="showXmCostLaborDetails(scope.row,'branchId','queryByBranchId')">{{scope.row.branchId}}</a>
						</template>

					</el-table-column>
					<!-- <el-table-column  min-width="100" ></el-table-column> -->
					<el-table-column :prop="month" v-for="month in selYearMonths" :key="month" :label="month" width="100">
						<template slot-scope="scope">
							<a    style="text-decoration:underline;margin-right:5px;"  @click="showXmCostLaborDetails(scope.row,month,'queryByBizMonth')">￥{{scope.row[month]}}</a>
						</template>
					</el-table-column>
					<el-table-column prop="monthsSum" label="合计" min-width="80">
					</el-table-column>
				</el-table>

				<el-table
					v-if="showType == '非人力'"
					:data="sumXmCostNlaborsConvert"
					highlight-current-row
					v-loading="load.list"
					border
					style="width: 100%;height:720px;overflow-y:auto;">
					<el-table-column prop="subjectId" label="科目" min-width="100" >
						<template slot-scope="scope">
							<a    style="text-decoration:underline;margin-right:5px;"  @click="showXmCostNlaborDetails(scope.row,'subjectId','queryBySubjectId')">{{scope.row.subjectId}}</a>
						</template>
					</el-table-column>
					<el-table-column prop="username" label="姓名" min-width="100" >
						<template slot-scope="scope">
							<a    style="text-decoration:underline;margin-right:5px;"  @click="showXmCostNlaborDetails(scope.row,'username','queryByBizUserid')">{{scope.row.username}}</a>
						</template>

					</el-table-column>
					<!-- <el-table-column  min-width="100" ></el-table-column> -->
					<el-table-column :prop="month" v-for="month in selYearMonths" :key="month" :label="month" width="100">
						<template slot-scope="scope">
							<a    style="text-decoration:underline;margin-right:5px;"  @click="showXmCostNlaborDetails(scope.row,month,'queryByBizMonth')">￥{{scope.row[month]}}</a>
						</template>
					</el-table-column>
					<el-table-column prop="monthsSum" label="合计" min-width="80">
					</el-table-column>
				</el-table>
			</div>

			<div v-else>
				<xm-cost-labor v-if="showType == '人力'" :sel-project="projectInfo"></xm-cost-labor>
				<xm-cost-nlabor v-else  :sel-project="projectInfo"></xm-cost-nlabor>
			</div>
			<el-drawer title="查看人力支出明细" :visible.sync="xmCostLaborVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				<xm-cost-labor v-if="xmCostLabor" :biz-month="queryType==='queryByBizMonth'?fieldName:null" :visible="xmCostLaborVisible" :userid="xmCostLabor.userid" :branch-id=" xmCostLabor.branchId " :project-id=" xmCostLabor.projectId "></xm-cost-labor>
			</el-drawer>
			<el-drawer title="查看非人力支出明细" :visible.sync="xmCostNlaborVisible"  size="60%"   append-to-body   :close-on-click-modal="false">
				<xm-cost-nlabor :xm-cost-nlabor="xmCostNlabor" :visible="xmCostNlaborVisible" :field-name="fieldName" :query-type="queryType" :sel-project="projectInfo"></xm-cost-nlabor>
			</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { mapGetters } from 'vuex';
	import { listSumSamtGroupByUseridBizMonth,listSumSamtGroupByBranchIdBizMonth,listSumSamtGroupByProjectIdBizMonth } from '@/api/xm/core/xmTaskSbillDetail';
	import { listSumXmCostNlabor } from '@/api/xm/core/xmCostNlabor';
	import xmCostLabor from '../xmTaskSbillDetail/XmTaskSbillDetailMng';
	import xmCostNlabor from '../xmCostNlabor/XmCostNlaborMng';

	export default {
		computed: {
			...mapGetters([
				'laborInfo','roles','projectInfo'
			]),
			selYearMonths:function(){
				var selYear=this.selYear;
				var yearMonths=[selYear+'-01',selYear+'-02',selYear+'-03',selYear+'-04',selYear+'-05',selYear+'-06',selYear+'-07',selYear+'-08',selYear+'-09',selYear+'-10',selYear+'-11',selYear+'-12']
				return yearMonths;
			},
			sumXmCostLaborsConvert:function(){
				var map={};
				var secMap={};
				this.sumXmCostLabors.forEach(i=>{
					i.key=i.projectId+"_"+i.subjectId+"_"+i.userid;
					i.monthKey=i.key+"_"+i.bizMonth;
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
							row[i]=val.samt;
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
			sumXmCostNlaborsConvert:function(){
				var map={};
				var secMap={};
				this.sumXmCostNlabors.forEach(i=>{
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
							row[i]=val.cost;
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
					this.listSumSamt();
				}
				else{
					this.listSumXmCostNlabor();
				}
			},
			'projectInfo': function(projectInfo){

			},
			'selYear':function(){
				this.listSumSamt();
			},
			'rptType':function(){
				this.listSumSamt();
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
				costShow: "支出统计",
				selYear: ""+new Date().getFullYear(),
				showType: "",
				xmCostLabor: [],
				xmCostNlabor: [],
				sumXmCostLabors:[],
				xmCostLabor:null,
				fieldName:'',
				queryType:'',
				xmCostLaborVisible:false,
				sumXmCostNlabors:[],
				xmCostNlabor:null,
				xmCostNlaborVisible:false,
				maxTableHeight:300,
				rptType:'1',//统计类型
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {

			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},

			listSumSamt:function(){
				var params={
					bizYear:this.selYear,
				}
				if(this.projectInfo){
					params.projectId=this.projectInfo.id
				}
				var func=listSumSamtGroupByUseridBizMonth
				if(this.rptType==='1'){
					func=listSumSamtGroupByBranchIdBizMonth
				}else if(this.rptType==='2'){
					func=listSumSamtGroupByProjectIdBizMonth
				}else if(this.rptType==='3'){
					func=listSumSamtGroupByUseridBizMonth
				}
				func(params).then(res=>{
					if(res.data.tips.isOk){
						this.sumXmCostLabors=res.data.data;
					}

				})
			},

			listSumXmCostNlabor:function(){
				var parmas={
					projectId:this.projectInfo.id,
				}
				listSumXmCostNlabor(parmas).then(res=>{
					if(res.data.tips.isOk){
						this.sumXmCostNlabors=res.data.data;
					}

				})
			},
			showXmCostLaborDetails:function(row,fieldName,queryType){
				this.xmCostLabor=row
				this.fieldName=fieldName
				this.queryType=queryType
				this.xmCostLaborVisible=true;
			},
			showXmCostNlaborDetails:function(row,fieldName,queryType){
				this.xmCostNlabor=row
				this.fieldName=fieldName
				this.queryType=queryType
				this.xmCostNlaborVisible=true;
			},
			/**end 自定义函数请在上面加**/
		},//end methods
		components: {
			xmCostLabor,
			xmCostNlabor,
				//在下面添加其它组件
		},
		mounted() {
			this.showType = "人力";
				this.$nextTick(() => {
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);
			  });

		}
	}

</script>

<style scoped>
.xm-cost{
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
.xm-cost .el-form-item{
	padding: 0 10px;
}
.xm-cost >>> input[type="number"]{
	padding-left: 5px;
	padding-right: 0;
}
/* .xm-cost >>> .headBorder:first-child, */
.xm-cost >>> .headBorder:nth-last-child(3){
	border-right: 0 !important;
}
.xm-cost .title-bar >>> .el-radio-button__inner{
	padding: 10px 15px;
	background: transparent;
	border: 0;
	border-radius: 0;
	box-shadow: 0 0 0 0 !important;
}
.xm-cost .title-bar .is-active >>> .el-radio-button__inner{
	color: #409EFF !important;
	border: 1px solid #409EFF;
}
.xm-cost>.el-table::before{
	height: 0;
}
/* 超过宽度则用...代替 */
.truncate{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
