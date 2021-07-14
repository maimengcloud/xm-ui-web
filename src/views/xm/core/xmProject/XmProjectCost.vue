<template>
	<section>
		<el-row class="xm-cost">
			<div class="title-bar">
				<el-radio-group v-model="costShow" size="medium">
					<el-radio-button label="支出清单"></el-radio-button>
					<el-radio-button label="支出统计"></el-radio-button>
				</el-radio-group>
				<span style="margin-left:10px;font-size:14px;">项目总预算：</span> <el-tag type="success">{{selProjectBudget.planTotalCost}}</el-tag>
				<span style="margin-left:10px;font-size:14px;">非人力总预算：</span><el-tag>{{selProjectBudget.planNouserAt}}</el-tag> 
				<span style="margin-left:10px;font-size:14px;">内部人力总预算：</span><el-tag>{{selProjectBudget.planInnerUserAt}}</el-tag> 
				<span style="margin-left:10px;font-size:14px;">外购人力总预算：</span><el-tag>{{selProjectBudget.planOutUserAt}}</el-tag> 
			</div>
			<div class="title-bar">
				<el-radio-group v-model="showType" size="medium">
					<el-radio-button label="人力"></el-radio-button>
					<el-radio-button label="非人力"></el-radio-button>
				</el-radio-group>
			</div>
			<div v-if="costShow == '支出统计'">
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
					v-if="showType == '人力'"
					:data="sumXmProjectMCostUsersConvert"
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
					v-if="showType == '非人力'"
					:data="sumXmProjectMCostNousersConvert" 
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
				<xm-cost-user v-if="showType == '人力'" :sel-project="selProject"></xm-cost-user>
				<xm-cost-nouser v-else  :sel-project="selProject"></xm-cost-nouser>
			</div>
			<el-dialog title="查看人力支出明细" :visible.sync="costUserVisible"  fullscreen  append-to-body   :close-on-click-modal="false">
				<xm-cost-user :cost-user="costUser" :visible="costUserVisible" :field-name="fieldName" :query-type="queryType" :sel-project="selProject"></xm-cost-user>
			</el-dialog> 
			<el-dialog title="查看非人力支出明细" :visible.sync="costNouserVisible"  fullscreen  append-to-body   :close-on-click-modal="false">
				<xm-cost-nouser :cost-nouser="costNouser" :visible="costNouserVisible" :field-name="fieldName" :query-type="queryType" :sel-project="selProject"></xm-cost-nouser>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { mapGetters } from 'vuex';
	import { editBudget } from '@/api/xm/core/xmProject';
	import { listSumXmProjectMCostUser } from '@/api/xm/core/xmProjectMCostUser';
	import { listSumXmProjectMCostNouser } from '@/api/xm/core/xmProjectMCostNouser';
	import xmCostUser from '../xmProjectMCostUser/XmProjectMCostUserMng';
	import xmCostNouser from '../xmProjectMCostNouser/XmProjectMCostNouserMng';
import { months } from 'moment';

	export default { 
		props: ["selProject"],
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),
			selYearMonths:function(){
				var selYear=this.selYear;
				var yearMonths=[selYear+'-01',selYear+'-02',selYear+'-03',selYear+'-04',selYear+'-05',selYear+'-06',selYear+'-07',selYear+'-08',selYear+'-09',selYear+'-10',selYear+'-11',selYear+'-12']
				return yearMonths;
			},
			sumXmProjectMCostUsersConvert:function(){ 
				var map={};
				var secMap={};
				this.sumXmProjectMCostUsers.forEach(i=>{
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
							row[i]=val.actCostAmount;
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
			sumXmProjectMCostNousersConvert:function(){ 
				var map={};
				var secMap={};
				this.sumXmProjectMCostNousers.forEach(i=>{
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
					this.listSumXmProjectMCostUser();
				}
				else{
					this.listSumXmProjectMCostNouser();
				}
			},
			'selProject': function(selProject){
				 this.selProjectBudget=Object.assign({},this.selProject);
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
				costUser: [],
				costNouser: [],
				selProjectBudget:{},
				sumXmProjectMCostUsers:[],
				costUser:null,
				fieldName:'',
				queryType:'',
				costUserVisible:false,
				sumXmProjectMCostNousers:[],
				costNouser:null, 
				costNouserVisible:false,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			 
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
 
			listSumXmProjectMCostUser:function(){
				var parmas={
					projectId:this.selProject.id, 
				}
				listSumXmProjectMCostUser(parmas).then(res=>{
					this.sumXmProjectMCostUsers=res.data.data;
				})
			},  
 
			listSumXmProjectMCostNouser:function(){
				var parmas={
					projectId:this.selProject.id, 
				}
				listSumXmProjectMCostNouser(parmas).then(res=>{
					this.sumXmProjectMCostNousers=res.data.data;
				})
			}, 
			showCostUserDetails:function(row,fieldName,queryType){
				this.costUser=row
				this.fileName=fieldName
				this.queryType=queryType
				this.costUserVisible=true;
			},
			showCostNouserDetails:function(row,fieldName,queryType){
				this.costNouser=row
				this.fileName=fieldName
				this.queryType=queryType
				this.costNouserVisible=true;
			},
			/**begin 自定义函数请在下面加**/
			// inputChange() {
			// 	this.selProject.planTotalCost = this.selProject.planTotalCost.replace(/[^\d.]/g,"").replace(/^\./g,"").replace(/\.{1,}/g,".");
			// },
			updateBudget() {
				if(this.selProject.planTotalCost==undefined){
					this.$message({showClose: true, message:"不允许修改", type:  'success'}); 
					return;
				}  
				var planTotalCost=this.getFloatValue(this.selProjectBudget.planTotalCost)
				var planInnerUserAt=this.getFloatValue(this.selProjectBudget.planInnerUserAt)
				var planOutUserAt=this.getFloatValue(this.selProjectBudget.planOutUserAt)
				var planNouserAt=this.getFloatValue(this.selProjectBudget.planNouserAt)
				this.selProjectBudget.planTotalCost=planInnerUserAt+planOutUserAt+planNouserAt
				this.$confirm('确定修改项目总支出吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.edit = true;
					let params = this.selProjectBudget
					editBudget(params).then((res) => {
						var tips=res.data.tips;
						if(tips.isOk){
							this.selProject.planTotalCost=this.selProjectBudget.planTotalCost
							this.selProject.planInnerUserAt=this.selProjectBudget.planInnerUserAt 
							this.selProject.planOutUserAt=this.selProjectBudget.planOutUserAt 
							this.selProject.planNouserAt=this.selProjectBudget.planNouserAt 
						}else{
							this.selProjectBudget=Object.assign({},this.selProject)
						}	
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
						this.load.edit = false;
					}).catch( err => this.load.edut = false );
				}).catch(() => {
					this.selProjectBudget=Object.assign({},this.selProject)
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
			xmCostUser,
			xmCostNouser,
				//在下面添加其它组件
		},
		mounted() { 
			this.showType = "人力";
				this.$nextTick(() => { 
			  }); 
			  this.selProjectBudget=Object.assign({},this.selProject);
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